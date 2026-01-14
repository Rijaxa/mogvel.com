'use server';

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";

export async function updateUserProfile(formData: FormData) {
    const session = await auth();
    console.log("🔹 Server Action: updateUserProfile called");

    if (!session?.user?.email) {
        return { error: "Not authenticated" };
    }

    // Extract fields
    const organisationName = formData.get('organisationName') as string;
    const legalName = formData.get('legalName') as string;
    const registrationNumber = formData.get('registrationNumber') as string;
    const country = formData.get('country') as string || 'Georgia';
    const city = formData.get('city') as string;
    const address = formData.get('address') as string;
    const currency = formData.get('currency') as string || 'GEL';
    const contactPerson = formData.get('contactPerson') as string;
    const phone = formData.get('phone') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const numberOfOffices = formData.get('numberOfOffices') as string;
    const vatPayerStatus = formData.get('vatPayerStatus') as 'vat_payer' | 'not_vat_payer';
    const businessScale = formData.get('businessScale') as 'small' | 'medium' | 'large' | undefined;
    const serviceAreas = formData.get('serviceAreas') as string;

    // Handle File Upload
    let logoUrl = undefined;
    const logoFile = formData.get('logo') as File | null;

    if (logoFile && logoFile.size > 0) {
        try {
            const buffer = Buffer.from(await logoFile.arrayBuffer());
            const filename = `${Date.now()}-${logoFile.name.replace(/\s/g, '_')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            logoUrl = `/uploads/${filename}`;
        } catch (error) {
            console.error("Error uploading file:", error);
            // Continue without updating logo if failed, or throw? Let's log and continue for now.
        }
    }

    // Prepare update object (only update logo if one was uploaded)
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, session.user.email)
    });

    let existingLogo = undefined;
    if (existingUser?.companyDetails) {
        try {
            const details = typeof existingUser.companyDetails === 'string'
                ? JSON.parse(existingUser.companyDetails)
                : existingUser.companyDetails;
            existingLogo = details.logoUrl;
        } catch (e) {
            console.error("Error parsing company details", e);
        }
    }

    const newCompanyDetails = {
        organisationName,
        legalName,
        registrationNumber,
        country,
        city,
        address,
        currency,
        contactPerson,
        phone,
        contactEmail,
        numberOfOffices,
        vatPayerStatus,
        businessScale: businessScale || undefined, // Handle empty string/null
        serviceAreas,
        logoUrl: logoUrl || existingLogo,
        isProfileComplete: !!(organisationName && legalName && registrationNumber && city && address && contactPerson && phone && contactEmail)
    };

    const [updatedUser] = await db.update(users)
        .set({ companyDetails: JSON.stringify(newCompanyDetails) })
        .where(eq(users.email, session.user.email))
        .returning();

    if (!updatedUser) {
        return { error: "User not found" };
    }

    revalidatePath('/dashboard/profile');
    console.log("✅ Server Action: Profile updated successfully for", session.user.email);
    return { success: true, user: updatedUser };
}
