'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

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
    await db.teamActivity.create({
        data: {
            organizationId,
            actorId,
            actorName,
            targetId,
            targetName,
            action,
            details: details ? JSON.stringify(details) : null,
        },
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
        const membership = await db.organizationMember.findFirst({
            where: { userId: session.user.id },
            include: { organization: true },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        // Get all members of the organization
        const members = await db.organizationMember.findMany({
            where: { organizationId: membership.organizationId },
            include: {
                user: true,
                role: true,
            },
            orderBy: { createdAt: 'desc' },
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
        const membership = await db.organizationMember.findFirst({
            where: { userId: session.user.id },
            include: { organization: true },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        // Check if user already exists
        let user = await db.user.findUnique({
            where: { email: data.email },
        });

        // If user doesn't exist, create them
        if (!user) {
            user = await db.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    role: 'user',
                },
            });
        }

        // Check if already a member
        const existingMember = await db.organizationMember.findFirst({
            where: {
                organizationId: membership.organizationId,
                userId: user.id,
            },
        });

        if (existingMember) {
            return { error: 'User is already a team member' };
        }

        // Create membership
        const newMember = await db.organizationMember.create({
            data: {
                organizationId: membership.organizationId,
                userId: user.id,
                roleId: data.roleId,
                status: 'active',
            },
            include: {
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
            { role: newMember.role.name }
        );

        revalidatePath('/dashboard/team');
        return { success: true, member: newMember };
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
        const membership = await db.organizationMember.findFirst({
            where: { userId: session.user.id },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const member = await db.organizationMember.findUnique({
            where: { id: memberId },
            include: { user: true, role: true },
        });

        if (!member || member.organizationId !== membership.organizationId) {
            return { error: 'Member not found' };
        }

        const newRole = await db.role.findUnique({
            where: { id: roleId },
        });

        const updatedMember = await db.organizationMember.update({
            where: { id: memberId },
            data: { roleId },
            include: { user: true, role: true },
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
        const membership = await db.organizationMember.findFirst({
            where: { userId: session.user.id },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const member = await db.organizationMember.findUnique({
            where: { id: memberId },
            include: { user: true },
        });

        if (!member || member.organizationId !== membership.organizationId) {
            return { error: 'Member not found' };
        }

        const updatedMember = await db.organizationMember.update({
            where: { id: memberId },
            data: { status },
            include: { user: true, role: true },
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
        const membership = await db.organizationMember.findFirst({
            where: { userId: session.user.id },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const member = await db.organizationMember.findUnique({
            where: { id: memberId },
            include: { user: true },
        });

        if (!member || member.organizationId !== membership.organizationId) {
            return { error: 'Member not found' };
        }

        await db.organizationMember.delete({
            where: { id: memberId },
        });

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
        const membership = await db.organizationMember.findFirst({
            where: { userId: session.user.id },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const activities = await db.teamActivity.findMany({
            where: { organizationId: membership.organizationId },
            orderBy: { createdAt: 'desc' },
            take: 50, // Last 50 activities
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
        const membership = await db.organizationMember.findFirst({
            where: { userId: session.user.id },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const roles = await db.role.findMany({
            where: { organizationId: membership.organizationId },
            orderBy: { name: 'asc' },
        });

        return { roles };
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
        const membership = await db.organizationMember.findFirst({
            where: { userId: session.user.id },
        });

        if (!membership) {
            return { error: 'No organization found' };
        }

        const members = await db.organizationMember.findMany({
            where: { organizationId: membership.organizationId },
            include: {
                user: true,
                role: true,
            },
            orderBy: { createdAt: 'desc' },
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
