'use server';

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function register(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const companyName = formData.get('companyName') as string;

    if (!email || !password || !companyName) {
        return { error: "Missing required fields" };
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existingUser) {
        return { error: "User already exists with this email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const initialCompanyDetails = {
        businessName: companyName,
        isProfileComplete: false
    };

    await db.insert(users).values({
        email,
        password: hashedPassword,
        name: companyName,
        role: 'user', // Default role
        companyDetails: JSON.stringify(initialCompanyDetails)
    });

    return { success: true };
}
