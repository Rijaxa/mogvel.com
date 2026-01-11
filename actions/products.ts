'use server';

import { db } from "@/lib/db";
import { getActiveOrganization, requireUser } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function getProducts() {
    const user = await requireUser();
    const membership = await getActiveOrganization(user.id!);

    if (!membership) return [];

    const orgId = membership.organizationId;

    // If vendor, show own products
    // If company, show products from linked vendors? or generic catalog? 
    // Usually "Catalogues" page suggests browsing available products.

    // For now, let's just fetch all products if Company (marketplace style) 
    // OR restricted to linked vendors.
    // The previous mock data implies a list of products.

    const products = await db.product.findMany({
        where: {
            // Simple logic: if vendor, only mine. If company, all active?
            status: 'active'
        },
        include: {
            vendor: true
        }
    });

    return products.map(p => ({
        id: p.id,
        name: p.name,
        price: "0.00", // Need pricing logic
        vendor: p.vendor.name,
        category: p.category || 'General',
        image: '/placeholder.png' // Need to handle images
    }));
}

export async function createProduct(formData: FormData) {
    const user = await requireUser();
    const membership = await getActiveOrganization(user.id!);

    if (!membership || membership.organization.type !== 'vendor') {
        return { error: "Only vendors can create products" };
    }

    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const sku = formData.get("sku") as string;

    if (!name) return { error: "Name required" };

    try {
        const product = await db.product.create({
            data: {
                vendorId: membership.organizationId,
                name,
                sku,
                // Add default price entry if needed, but schema separates pricing
            }
        });

        // Add Base Price
        if (!isNaN(price)) {
            await db.productPricing.create({
                data: {
                    productId: product.id,
                    basePrice: price,
                    currency: 'GEL'
                }
            });
        }

        revalidatePath('/dashboard/catalogues');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create product" };
    }
}
