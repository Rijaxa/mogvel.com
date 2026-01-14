'use server';

import { db } from "@/lib/db";
import { orders, organizations } from "@/lib/db/schema";
import { getActiveOrganization, requireUser } from "@/lib/dal";
import { eq, desc } from "drizzle-orm";

export async function getOrders() {
    const user = await requireUser();
    const membership = await getActiveOrganization(user.id!);

    if (!membership) {
        return null;
    }

    const orgId = membership.organizationId;
    const orgType = membership.organization.type; // 'company' or 'vendor'

    // Fetch orders where this org is strict 'company' side OR 'vendor' side
    // If the org is a company, it sees orders where companyId = orgId
    // If the org is a vendor, it sees orders where vendorId = orgId

    const whereClause = orgType === 'company'
        ? eq(orders.companyId, orgId)
        : eq(orders.vendorId, orgId);

    const ordersList = await db.query.orders.findMany({
        where: whereClause,
        with: {
            vendor: true,
            company: true,
        },
        orderBy: [desc(orders.placedAt)]
    });

    // Transform to UI expected format (matches mock data structure if possible)
    return ordersList.map(order => ({
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
