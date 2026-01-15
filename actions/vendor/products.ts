'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { products, productPricing, productStock, locations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) {
        return { error: "Unauthorized" };
    }

    const orgId = (session.user as any).orgId;

    try {
        const vendorProducts = await db.query.products.findMany({
            where: eq(products.vendorId, orgId),
            with: {
                pricing: true,
                stock: true,
            }
        });

        return { products: vendorProducts };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { error: "Failed to fetch products" };
    }
}

export async function createProduct(formData: FormData) {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) {
        return { error: "Unauthorized" };
    }

    const orgId = (session.user as any).orgId;

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const stockStr = formData.get('stock') as string;
    const sku = formData.get('sku') as string;
    const unit = formData.get('unit') as string;

    if (!name || !priceStr) {
        return { error: "Name and Price are required" };
    }

    const price = parseFloat(priceStr);
    const stock = parseInt(stockStr) || 0;

    try {
        await db.transaction(async (tx) => {
            // 1. Create Product
            const [product] = await tx.insert(products).values({
                vendorId: orgId,
                name,
                description,
                sku,
                unitOfMeasure: unit,
                status: 'active',
            }).returning();

            // 2. Create Pricing
            await tx.insert(productPricing).values({
                productId: product.id,
                basePrice: price.toString(), // SQLite Decimal as string
                currency: 'GEL',
            });

            // 3. Create Stock (Need a location first - using default or creating one)
            // Ideally we pick a location or use a default one. 
            // Let's check if we have any location for this vendor.
            let location = await tx.query.locations.findFirst({
                where: eq(locations.organizationId, orgId),
            });

            if (!location) {
                const [newLocation] = await tx.insert(locations).values({
                    organizationId: orgId,
                    name: 'Main Warehouse',
                    type: 'warehouse',
                }).returning();
                location = newLocation;
            }

            await tx.insert(productStock).values({
                productId: product.id,
                locationId: location.id,
                currentStock: stock.toString(),
                stockStatus: stock > 10 ? 'medium' : 'low',
            });
        });

        revalidatePath('/dashboard/vendor/catalogue');
        return { success: "Product created successfully" };
    } catch (error) {
        console.error("Error creating product:", error);
        return { error: "Failed to create product" };
    }
}
