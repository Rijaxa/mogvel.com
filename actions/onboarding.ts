'use server';

import { db } from '@/lib/db';
import { organizations, roles, organizationMembers } from '@/lib/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

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
        const organization = await db.transaction(async (tx) => {
            // 1. Create Org
            const [org] = await tx.insert(organizations).values({
                name,
                type,
                status: 'active'
            }).returning();

            // 2. Create Owner Role
            const [role] = await tx.insert(roles).values({
                organizationId: org.id,
                scope: type,
                name: 'Owner',
                description: 'Full access to organization'
            }).returning();

            // 3. Create Membership
            await tx.insert(organizationMembers).values({
                userId: session.user!.id!,
                organizationId: org.id,
                roleId: role.id,
                status: 'active'
            });

            return org;
        });

        return { success: true, organization };
    } catch (error) {
        console.error("Onboarding error:", error);
        return { error: "Failed to create organization" };
    }
}

// Corrected Approach: Atomic transaction for Onboarding
export async function onboardUser(orgName: string, orgType: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    // existing check
    const existingMember = await db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, userId!)
    });

    if (existingMember) {
        return { message: "Already onboarded" };
    }

    return await db.transaction(async (tx) => {
        // 1. Create Org
        const [org] = await tx.insert(organizations).values({
            name: orgName,
            type: orgType,
            status: 'active'
        }).returning();

        // 2. Create Owner Role
        const [role] = await tx.insert(roles).values({
            organizationId: org.id,
            scope: orgType,
            name: 'Owner',
            description: 'Full access to organization'
        }).returning();

        // 3. Create Membership
        await tx.insert(organizationMembers).values({
            userId: userId!,
            organizationId: org.id,
            roleId: role.id,
            status: 'active'
        });

        return org;
    });
}
