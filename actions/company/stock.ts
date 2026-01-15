'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { products, productStock, locations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Get all stock items for the current company
 */
export async function getCompanyStock() {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return { error: "Unauthorized" };
    }

    const orgId = (session.user as any).orgId as string;

    try {
        // Get company's location(s)
        const companyLocations = await db.query.locations.findMany({
            where: eq(locations.organizationId, orgId),
        });

        if (companyLocations.length === 0) {
            return { stock: [] };
        }

        // Get all stock for these locations
        const allStock = [];
        for (const location of companyLocations) {
            const stockItems = await db.query.productStock.findMany({
                where: eq(productStock.locationId, location.id),
                with: {
                    product: {
                        with: {
                            vendor: true,
                            pricing: true,
                        }
                    },
                    location: true,
                }
            });
            allStock.push(...stockItems);
        }

        return { stock: allStock };
    } catch (error) {
        console.error("Error fetching company stock:", error);
        return { error: "Failed to fetch stock" };
    }
}

/**
 * Add or update stock tracking for a product
 * Note: Companies track stock for products they've ordered from vendors
 */
export async function upsertCompanyStock(data: {
    productId: string;
    currentStock: number;
    reorderPoint?: number;
    stockStatus?: string;
}) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return { error: "Unauthorized" };
    }

    const orgId = (session.user as any).orgId as string;

    try {
        // Get or create a default location for this company
        let location = await db.query.locations.findFirst({
            where: eq(locations.organizationId, orgId),
        });

        if (!location) {
            const [newLocation] = await db.insert(locations).values({
                organizationId: orgId,
                name: 'Main Warehouse',
                type: 'warehouse',
            }).returning();
            location = newLocation;
        }

        // Check if stock entry exists
        const existingStock = await db.query.productStock.findFirst({
            where: and(
                eq(productStock.productId, data.productId),
                eq(productStock.locationId, location.id)
            ),
        });

        if (existingStock) {
            // Update existing
            await db.update(productStock)
                .set({
                    currentStock: data.currentStock.toString(),
                    reorderPoint: data.reorderPoint?.toString(),
                    stockStatus: data.stockStatus || 'medium',
                    updatedAt: new Date(),
                })
                .where(eq(productStock.id, existingStock.id));
        } else {
            // Create new
            await db.insert(productStock).values({
                productId: data.productId,
                locationId: location.id,
                currentStock: data.currentStock.toString(),
                reorderPoint: data.reorderPoint?.toString(),
                stockStatus: data.stockStatus || 'medium',
            });
        }

        revalidatePath('/dashboard/stock');
        return { success: "Stock updated successfully" };
    } catch (error) {
        console.error("Error updating stock:", error);
        return { error: "Failed to update stock" };
    }
}
