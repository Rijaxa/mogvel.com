'use server';

import { db } from "@/lib/db";
import { companyVendorLinks, organizations } from "@/lib/db/schema";
import { getActiveOrganization, requireUser } from "@/lib/dal";
import { eq, and } from "drizzle-orm";

export async function getLinkedVendors() {
    const user = await requireUser();
    const membership = await getActiveOrganization(user.id!);

    if (!membership) return [];

    // Logic: fetch vendors linked to this company
    const links = await db.query.companyVendorLinks.findMany({
        where: and(
            eq(companyVendorLinks.companyId, membership.organizationId),
            eq(companyVendorLinks.status, 'active')
        ),
        with: {
            vendor: true
        }
    });

    return links.map(link => ({
        name: link.vendor.name,
        isVerified: link.vendor.verificationStatus === 'verified',
        rating: 4.8, // Mock or add to schema
        stability: 'Stable', // Mock
        stockLevel: 'Medium', // Mock
        deliverySLA: '98%', // Mock
        vendorId: link.vendorId
    }));
}
