'use server';

import * as z from 'zod';
import { db } from '@/lib/db';
import { users, organizations, roles, organizationMembers } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { eq } from 'drizzle-orm';

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1).optional(),
});

export const registerUser = async (values: any) => {
    // Basic validation manually or use Zod schema passed in. 
    // We expect values to have: email, password, name, organizationName, accountType ('vendor' | 'company')

    const { email, password, name, organizationName, accountType } = values;

    if (!email || !password || !organizationName || !accountType) {
        return { error: "Missing required fields!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    try {
        // Drizzle doesn't have built-in transactions like Prisma, so we use db.transaction
        await db.transaction(async (tx) => {
            // 1. Create User
            const [user] = await tx.insert(users).values({
                name,
                email,
                password: hashedPassword,
                role: 'admin', // First user of an org is an admin of that org
            }).returning();

            // 2. Create Organization
            const [org] = await tx.insert(organizations).values({
                name: organizationName,
                type: accountType, // 'vendor' or 'company'
                status: 'active',
            }).returning();

            // 3. Create Default Role for this Org
            const [ownerRole] = await tx.insert(roles).values({
                organizationId: org.id,
                name: 'Owner',
                scope: accountType,
                description: 'Full access to organization resources',
            }).returning();

            // 4. Create Membership
            await tx.insert(organizationMembers).values({
                userId: user.id,
                organizationId: org.id,
                roleId: ownerRole.id,
                status: 'active',
            });
        });

        return { success: "Account created successfully!" };
    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Failed to create account. Please try again." };
    }
};

export const login = async (values: any) => {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        return { success: "Logged in!" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }
}

export const logout = async () => {
    await signOut();
}
