'use server';

import { db } from "@/lib/db";
import { products, productPricing } from "@/lib/db/schema";
import { getActiveOrganization, requireUser } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function getProducts() {
    const user = await requireUser();
    const membership = await getActiveOrganization(user.id!);

    if (!membership) return [];

    const orgId = membership.organizationId;
    const orgType = membership.organization.type;

    // Tenant Isolation
    if (orgType === 'vendor') {
        // Vendors see their own products
        const productsList = await db.query.products.findMany({
            where: eq(products.vendorId, orgId),
            with: {
                vendor: true
            }
        });

        return productsList.map(p => ({
            id: p.id,
            name: p.name,
            price: "0.00", // Need pricing logic
            vendor: p.vendor.name,
            category: p.category || 'General',
            image: '/placeholder.png' // Need to handle images
        }));
    } else {
        // Companies see active products
        const productsList = await db.query.products.findMany({
            where: eq(products.status, 'active'),
            with: {
                vendor: true
            }
        });

        return productsList.map(p => ({
            id: p.id,
            name: p.name,
            price: "0.00", // Need pricing logic
            vendor: p.vendor.name,
            category: p.category || 'General',
            image: '/placeholder.png' // Need to handle images
        }));
    }
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
        const [product] = await db.insert(products).values({
            vendorId: membership.organizationId,
            name,
            sku,
        }).returning();

        // Add Base Price
        if (!isNaN(price)) {
            await db.insert(productPricing).values({
                productId: product.id,
                basePrice: price.toString(),
                currency: 'GEL'
            });
        }

        revalidatePath('/dashboard/catalogues');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create product" };
    }
}
