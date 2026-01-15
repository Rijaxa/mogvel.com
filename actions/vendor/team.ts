'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, organizationMembers, roles, organizations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function getTeamMembers() {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) {
        return { error: "Unauthorized" };
    }

    const orgId = (session.user as any).orgId;

    try {
        const members = await db.query.organizationMembers.findMany({
            where: eq(organizationMembers.organizationId, orgId),
            with: {
                user: true,
                role: true,
            }
        });

        return { members };
    } catch (error) {
        console.error("Error fetching team members:", error);
        return { error: "Failed to fetch team members" };
    }
}

export async function inviteMember(formData: FormData) {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) {
        return { error: "Unauthorized" };
    }

    const orgId = (session.user as any).orgId;
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const roleName = formData.get('role') as string || 'Member'; // Default to Member

    if (!email || !name) {
        return { error: "Name and Email are required" };
    }

    try {
        // 1. Check if user exists
        let user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        // 2. If user doesn't exist, create them (with a temp password or just as a placeholder)
        // For now, we'll create a user with a default password 'password123' and status 'invited'
        // In a real app, we'd send an email invite.
        if (!user) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const [newUser] = await db.insert(users).values({
                email,
                name,
                password: hashedPassword,
                role: 'user',
            }).returning();
            user = newUser;
        }

        // 3. Check if already a member
        const existingMember = await db.query.organizationMembers.findFirst({
            where: and(
                eq(organizationMembers.organizationId, orgId),
                eq(organizationMembers.userId, user.id)
            )

        });

        if (existingMember) {
            return { error: "User is already a member of this organization" };
        }

        // 4. Get Role ID
        // We need to find the role ID for the given role name in this org, or a default one.
        // For simplicity, let's assume we have standard roles or just use the one provided if found.
        let role = await db.query.roles.findFirst({
            where: and(
                eq(roles.organizationId, orgId),
                eq(roles.name, roleName)
            )
        });

        // If specific role not found, try to find ANY role for this org, or create one.
        if (!role) {
             // Fallback: Try to find 'Member' role
             role = await db.query.roles.findFirst({
                where: and(
                    eq(roles.organizationId, orgId),
                    eq(roles.name, 'Member')
                )
            });
            
            // If still no role, create a default 'Member' role
            if (!role) {
                const [newRole] = await db.insert(roles).values({
                    organizationId: orgId,
                    name: 'Member',
                    scope: 'vendor', // Assuming vendor context
                    description: 'Standard member',
                }).returning();
                role = newRole;
            }
        }

        // 5. Add to OrganizationMembers
        await db.insert(organizationMembers).values({
            organizationId: orgId,
            userId: user.id,
            roleId: role.id,
            status: 'active', // Should be invited, but auto-activating for MVP
        });

        revalidatePath('/dashboard/vendor/team');
        return { success: "Member invited successfully" };

    } catch (error) {
        console.error("Error inviting member:", error);
        return { error: "Failed to invite member" };
    }
}

export async function removeMember(memberId: string) {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) {
        return { error: "Unauthorized" };
    }

    const orgId = (session.user as any).orgId;

    try {
        // Ensure we are only removing a member from OUR organization
        // The memberId passed here is the organization_members.id (not user.id)
        
        await db.delete(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.id, memberId),
                    eq(organizationMembers.organizationId, orgId)
                )
            );

        revalidatePath('/dashboard/vendor/team');
        return { success: "Member removed successfully" };
    } catch (error) {
        console.error("Error removing member:", error);
        return { error: "Failed to remove member" };
    }
}
