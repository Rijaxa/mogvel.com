'use server';

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function register(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const companyName = formData.get('companyName') as string;

    if (!email || !password || !companyName) {
        return { error: "Missing required fields" };
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "User already exists with this email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const initialCompanyDetails = {
        businessName: companyName,
        isProfileComplete: false
    };

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name: companyName,
            role: 'user', // Default role
            companyDetails: JSON.stringify(initialCompanyDetails)
        }
    });

    return { success: true };
}
