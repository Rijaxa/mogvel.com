'use server';

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "Not authenticated" };
    }

    const businessName = formData.get('businessName') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const website = formData.get('website') as string;

    const updatedUser = db.updateUser(session.user.email, {
        companyDetails: {
            businessName,
            address,
            phone,
            website,
            isProfileComplete: !!(businessName && address && phone)
        }
    });

    if (!updatedUser) {
        return { error: "User not found" };
    }

    revalidatePath('/dashboard/profile');
    return { success: true, user: updatedUser };
}
