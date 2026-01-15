'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { products, organizations, productPricing, productStock, companyVendorLinks } from '@/lib/db/schema';
import { eq, and, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getAllProducts(query?: string, category?: string) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        const filters = [];
        filters.push(eq(products.status, 'active'));

        if (query) {
            filters.push(or(
                ilike(products.name, `%${query}%`),
                ilike(products.description, `%${query}%`)
            ));
        }

        if (category && category !== 'All Products') {
            filters.push(eq(products.category, category));
        }

        const allProducts = await db.query.products.findMany({
            where: and(...filters),
            with: {
                vendor: true,
                pricing: true,
                stock: true,
            },
            orderBy: (products, { desc }) => [desc(products.createdAt)],
            limit: 50
        });

        // Transform for UI
        const formattedProducts = allProducts.map(p => {
            // Find generic pricing (companyId is null) or specific? 
            // For now, take the first pricing available (simplified)
            const priceObj = p.pricing.find(pr => !pr.companyId) || p.pricing[0];
            const stockObj = p.stock[0];

            return {
                id: p.id,
                title: p.name,
                description: p.description || '',
                price: priceObj ? parseFloat(priceObj.basePrice) : 0,
                vendor: p.vendor.name,
                category: p.category || 'General',
                inStock: stockObj ? parseFloat(stockObj.currentStock) > 0 : false,
                stockLevel: stockObj?.stockStatus || 'unknown'
            };
        });

        return { products: formattedProducts };
    } catch (error) {
        console.error("Error fetching catalogue:", error);
        return { error: "Failed to fetch products" };
    }
}

export async function getAllVendors(query?: string) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    // (session.user as any).orgId might be needed if checking specific links

    try {
        const filters = [];
        filters.push(eq(organizations.type, 'vendor'));
        filters.push(eq(organizations.status, 'active'));

        if (query) {
            filters.push(ilike(organizations.name, `%${query}%`));
        }

        const allVendors = await db.query.organizations.findMany({
            where: and(...filters),
            limit: 50
        });

        const formattedVendors = allVendors.map(v => ({
            id: v.id,
            name: v.name,
            isVerified: v.verificationStatus === 'verified',
            rating: 4.8, // Mock for now, requires joins with reviews
            stability: 'Stable', // Mock
            stockLevel: 'Medium', // Mock aggregation
            deliverySLA: '98%', // Mock
            city: v.city
        }));

        return { vendors: formattedVendors };
    } catch (error) {
        console.error("Error fetching vendors:", error);
        return { error: "Failed to fetch vendors" };
    }
}
