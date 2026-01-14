'use server';

import { db } from '@/lib/db';
import { users, organizationMembers, roles, teamActivities } from '@/lib/db/schema';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { eq, desc, asc } from 'drizzle-orm';

// Helper to log team activity
async function logActivity(
    organizationId: string,
    actorId: string,
    actorName: string,
    action: string,
    targetId?: string,
    targetName?: string,
    details?: any
) {
    await db.insert(teamActivities).values({
        organizationId,
        actorId,
        actorName,
        targetId,
        targetName,
        action,
        details: details ? JSON.stringify(details) : null,
    });
}

// Get all team members for the organization
export async function getTeamMembers() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // Get user's organization
        const membership = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, session.user.id),
            with: { organization: true },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        // Get all members of the organization
        const members = await db.query.organizationMembers.findMany({
            where: eq(organizationMembers.organizationId, membership.organizationId),
            with: {
                user: true,
                role: true,
            },
            orderBy: [desc(organizationMembers.createdAt)],
        });

        console.log('✅ getTeamMembers:', {
            orgId: membership.organizationId,
            memberCount: members.length
        });

        return { members, organizationId: membership.organizationId };
    } catch (error) {
        console.error('Error fetching team members:', error);
        return { error: 'Failed to fetch team members' };
    }
}

// Add a new team member
export async function addTeamMember(data: {
    email: string;
    name: string;
    roleId: string;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        // Get user's organization
        const membership = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, session.user.id),
            with: { organization: true },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        // Check if user already exists
        let user = await db.query.users.findFirst({
            where: eq(users.email, data.email),
        });

        // If user doesn't exist, create them
        if (!user) {
            [user] = await db.insert(users).values({
                email: data.email,
                name: data.name,
                role: 'user',
            }).returning();
        }

        // Check if already a member
        const existingMember = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, user.id),
        });

        if (existingMember) {
            return { error: 'User is already a team member' };
        }

        // Create membership
        const [newMember] = await db.insert(organizationMembers).values({
            organizationId: membership.organizationId,
            userId: user.id,
            roleId: data.roleId,
            status: 'active',
        }).returning();

        // Fetch the complete member with relations
        const completeMember = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.id, newMember.id),
            with: {
                user: true,
                role: true,
            },
        });

        // Log activity
        await logActivity(
            membership.organizationId,
            session.user.id,
            session.user.name || session.user.email || 'Unknown',
            'invited',
            user.id,
            data.name,
            { role: completeMember?.role.name }
        );

        revalidatePath('/dashboard/team');
        return { success: true, member: completeMember };
    } catch (error) {
        console.error('Error adding team member:', error);
        return { error: 'Failed to add team member' };
    }
}

// Update member role
export async function updateMemberRole(memberId: string, roleId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        const membership = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, session.user.id),
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const member = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.id, memberId),
            with: { user: true, role: true },
        });

        if (!member || member.organizationId !== membership.organizationId) {
            return { error: 'Member not found' };
        }

        const newRole = await db.query.roles.findFirst({
            where: eq(roles.id, roleId),
        });

        await db.update(organizationMembers)
            .set({ roleId })
            .where(eq(organizationMembers.id, memberId));

        const updatedMember = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.id, memberId),
            with: { user: true, role: true },
        });

        // Log activity
        await logActivity(
            membership.organizationId,
            session.user.id,
            session.user.name || session.user.email || 'Unknown',
            'updated_role',
            member.userId,
            member.user.name || member.user.email,
            { oldRole: member.role.name, newRole: newRole?.name }
        );

        revalidatePath('/dashboard/team');
        return { success: true, member: updatedMember };
    } catch (error) {
        console.error('Error updating member role:', error);
        return { error: 'Failed to update member role' };
    }
}

// Update member status (active/suspended)
export async function updateMemberStatus(memberId: string, status: 'active' | 'disabled') {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        const membership = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, session.user.id),
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const member = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.id, memberId),
            with: { user: true },
        });

        if (!member || member.organizationId !== membership.organizationId) {
            return { error: 'Member not found' };
        }

        await db.update(organizationMembers)
            .set({ status })
            .where(eq(organizationMembers.id, memberId));

        const updatedMember = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.id, memberId),
            with: { user: true, role: true },
        });

        // Log activity
        await logActivity(
            membership.organizationId,
            session.user.id,
            session.user.name || session.user.email || 'Unknown',
            status === 'active' ? 'activated' : 'suspended',
            member.userId,
            member.user.name || member.user.email
        );

        revalidatePath('/dashboard/team');
        return { success: true, member: updatedMember };
    } catch (error) {
        console.error('Error updating member status:', error);
        return { error: 'Failed to update member status' };
    }
}

// Delete team member
export async function deleteMember(memberId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        const membership = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, session.user.id),
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const member = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.id, memberId),
            with: { user: true },
        });

        if (!member || member.organizationId !== membership.organizationId) {
            return { error: 'Member not found' };
        }

        await db.delete(organizationMembers)
            .where(eq(organizationMembers.id, memberId));

        // Log activity
        await logActivity(
            membership.organizationId,
            session.user.id,
            session.user.name || session.user.email || 'Unknown',
            'deleted',
            member.userId,
            member.user.name || member.user.email
        );

        revalidatePath('/dashboard/team');
        return { success: true };
    } catch (error) {
        console.error('Error deleting member:', error);
        return { error: 'Failed to delete member' };
    }
}

// Get team activity log
export async function getTeamActivity() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        const membership = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, session.user.id),
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const activities = await db.query.teamActivities.findMany({
            where: eq(teamActivities.organizationId, membership.organizationId),
            orderBy: [desc(teamActivities.createdAt)],
            limit: 50, // Last 50 activities
        });

        return { activities };
    } catch (error) {
        console.error('Error fetching team activity:', error);
        return { error: 'Failed to fetch team activity' };
    }
}

// Get available roles for the organization
export async function getOrganizationRoles() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        const membership = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, session.user.id),
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const rolesList = await db.query.roles.findMany({
            where: eq(roles.organizationId, membership.organizationId),
            orderBy: [asc(roles.name)],
        });

        console.log('✅ getOrganizationRoles:', {
            orgId: membership.organizationId,
            roleCount: rolesList.length,
            roles: rolesList.map(r => r.name)
        });

        return { roles: rolesList };
    } catch (error) {
        console.error('Error fetching roles:', error);
        return { error: 'Failed to fetch roles' };
    }
}

// Export team data as CSV
export async function exportTeamCSV() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        const membership = await db.query.organizationMembers.findFirst({
            where: eq(organizationMembers.userId, session.user.id),
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const members = await db.query.organizationMembers.findMany({
            where: eq(organizationMembers.organizationId, membership.organizationId),
            with: {
                user: true,
                role: true,
            },
            orderBy: [desc(organizationMembers.createdAt)],
        });

        // Generate CSV content
        const headers = ['Name', 'Email', 'Role', 'Status', 'Joined Date'];
        const rows = members.map(member => [
            member.user.name || '',
            member.user.email,
            member.role.name,
            member.status,
            new Date(member.createdAt).toLocaleDateString(),
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        return { csvContent };
    } catch (error) {
        console.error('Error exporting CSV:', error);
        return { error: 'Failed to export CSV' };
    }
}
