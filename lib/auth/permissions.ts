import { auth } from '@/auth';
import { db } from '@/lib/db';
import { rolePermissions, organizationMembers, roles } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function checkPermission(resource: string, action: string): Promise<boolean> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return false;
    }

    const userId = session.user.id as string;
    const orgId = (session.user as any).orgId as string;

    try {
        // 1. Get User's Role in Org
        const member = await db.query.organizationMembers.findFirst({
            where: and(
                eq(organizationMembers.userId, userId),
                eq(organizationMembers.organizationId, orgId)
            ),
            with: {
                role: {
                    with: {
                        permissions: true
                    }
                }
            }
        });

        if (!member || !member.role) {
            return false;
        }

        // 2. Check Permissions
        // Admin/Owner roles usually have all permissions, but let's check explicit permissions first.
        // If the role name is 'Owner' or 'Admin', we might want to bypass (optional logic).
        if (member.role.name === 'Owner') return true;

        const hasPermission = member.role.permissions.some(p =>
            p.resource === resource && p.action === action && p.allowed
        );

        return hasPermission;
    } catch (error) {
        console.error("Permission check error:", error);
        return false;
    }
}
