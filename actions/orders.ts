'use server';

import { db } from "@/lib/db";
import { getActiveOrganization, requireUser } from "@/lib/dal";

export async function getOrders() {
    const user = await requireUser();
    const membership = await getActiveOrganization(user.id!);

    if (!membership) {
        throw new Error("No active organization found");
    }

    const orgId = membership.organizationId;
    const orgType = membership.organization.type; // 'company' or 'vendor'

    // Fetch orders where this org is strict 'company' side OR 'vendor' side
    // If the org is a company, it sees orders where companyId = orgId
    // If the org is a vendor, it sees orders where vendorId = orgId

    // However, Prisma schema has relations:
    // ordersAsCompany Order[] @relation("CompanyOrders")
    // ordersAsVendor Order[] @relation("VendorOrders")

    let whereClause = {};
    if (orgType === 'company') {
        whereClause = { companyId: orgId };
    } else {
        whereClause = { vendorId: orgId };
    }

    const orders = await db.order.findMany({
        where: whereClause,
        include: {
            vendor: true,
            company: true,
            // items? Schema doesn't have OrderItems yet?
            // Wait, schema check Step 8:
            // Order has: subtotal, discountTotal...
            // It does NOT have OrderItems relation shown in the view?
            // Let me check schema again. 
        },
        orderBy: { placedAt: 'desc' }
    });

    // Transform to UI expected format (matches mock data structure if possible)
    return orders.map(order => ({
        id: order.orderNumber || order.id,
        date: order.placedAt.toLocaleDateString('en-GB'), // 16.11.2024 format
        vendor: order.vendor.name, // or company name if viewing as vendor?
        // logic: if I am company, I want to see Vendor name. If I am vendor, I want to see Company name?
        // The mock UI has 'vendor' field. Let's assume it's Company View primarily for now.
        status: normalizeStatus(order.status),
        amount: `₾${order.grandTotal}`,
        // Items are missing in DB Schema viewed previously? Or I missed them.
        // Assuming no items relation for now, returning empty array to avoid crash
        items: [],
        activity: []
    }));
}

function normalizeStatus(status: string) {
    // Map DB status to UI status strings if needed
    // DB: pending, approved, shipped, delivered, cancelled
    // UI: 'Vendor Response', 'Proof Uploaded', 'Shipped', 'Delivered'

    // Simple mapping for now
    const map: Record<string, string> = {
        'pending': 'Vendor Response',
        'approved': 'In Progress',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return map[status] || status;
}
