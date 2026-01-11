'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function createOrganization(formData: FormData) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("orgName") as string;
    const type = formData.get("orgType") as string; // 'company' or 'vendor'

    if (!name || !type) {
        return { error: "Missing fields" };
    }

    // Transaction: Create Org + Membership + Role
    try {
        const organization = await db.organization.create({
            data: {
                name,
                type,
                members: {
                    create: {
                        userId: session.user.id,
                        roleId: await getOrCreateDefaultRole(name, type),
                        status: 'active'
                    }
                }
            }
        });

        return { success: true, organization };
    } catch (error) {
        console.error("Onboarding error:", error);
        return { error: "Failed to create organization" };
    }
}

async function getOrCreateDefaultRole(orgName: string, orgType: string) {
    // This logic is a bit circular because Roles are tied to Org. 
    // We need to create the Org first, then the Role. 
    // Prisma `create` with nested writes handles this better if we structure it differently.
    // However, since we need to return a Role ID in the `members.create`, we might need a different approach.
    // simpler: Create Org -> Create Role -> Create Member.
    return "temp-role-id"; // Placeholder, see logic correction below
}

// Corrected Approach: Atomic transaction for Onboarding
export async function onboardUser(orgName: string, orgType: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    // existing check
    const existingMember = await db.organizationMember.findFirst({
        where: { userId: userId }
    });

    if (existingMember) {
        return { message: "Already onboarded" };
    }

    return await db.$transaction(async (tx) => {
        // 1. Create Org
        const org = await tx.organization.create({
            data: {
                name: orgName,
                type: orgType,
                status: 'active'
            }
        });

        // 2. Create Owner Role
        const role = await tx.role.create({
            data: {
                organizationId: org.id,
                scope: orgType,
                name: 'Owner',
                description: 'Full access to organization'
            }
        });

        // 3. Create Membership
        await tx.organizationMember.create({
            data: {
                userId: userId!,
                organizationId: org.id,
                roleId: role.id,
                status: 'active'
            }
        });

        return org;
    });
}
