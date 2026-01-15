'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function updateUserProfile(userId: string, data: {
    name?: string;
    lastName?: string;
    phone?: string;
    jobPosition?: string;
}) {
    try {
        const session = await auth();
        const sessionUserId = session?.user?.id;

        if (!sessionUserId || sessionUserId !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        const [updatedUser] = await db.update(users)
            .set({
                name: data.name,
                lastName: data.lastName,
                phone: data.phone,
                jobPosition: data.jobPosition,
            })
            .where(eq(users.id, userId))
            .returning();

        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/vendor/profile');
        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard/vendor/settings');
        // Also revalidate the new company paths
        revalidatePath('/dashboard/(company)/profile');
        revalidatePath('/dashboard/(company)/settings');

        return { success: true, user: updatedUser };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: "Failed to update profile" };
    }
}
