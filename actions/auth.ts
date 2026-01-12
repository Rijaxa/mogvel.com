'use server';

import * as z from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1).optional(),
});

export const registerUser = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // Automatically sign in upon registration?
    // For now, we prefer to let them login to verify credentials flow
    return { success: "User created!" };
};

export const login = async (values: any) => {
    // Basic wrapper around next-auth signIn
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false, // We'll handle redirect in client or throw
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
