// Caching Strategy for Mogvel Application
// This file defines caching patterns and implementation guidelines

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { db } from '../db';
import { users, organizations, products } from './schema';
import { eq } from 'drizzle-orm';

/**
 * CACHING LAYERS
 * 
 * 1. Application-Level Cache (React Cache)
 * 2. Server-Side Cache (Next.js Cache)
 * 3. Database Query Cache (Optional: Redis)
 * 4. CDN Cache (Static Assets)
 */

// ============================================================================
// LAYER 1: REACT CACHE (Request Deduplication)
// ============================================================================

/**
 * React Cache - Deduplicates requests within a single render
 * Use for data fetched multiple times in component tree
 */

export const getCachedUser = cache(async (userId: string) => {
    // This will only execute once per request, even if called multiple times
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });
    return user;
});

// Usage in components:
// const user = await getCachedUser(userId); // First call - executes query
// const sameUser = await getCachedUser(userId); // Second call - returns cached

// ============================================================================
// LAYER 2: NEXT.JS CACHE (Server-Side Caching)
// ============================================================================

/**
 * Next.js unstable_cache - Caches across requests
 * Use for data that doesn't change frequently
 */

// Cache organization data for 5 minutes
export const getCachedOrganization = unstable_cache(
    async (orgId: string) => {
        return await db.query.organizations.findFirst({
            where: eq(organizations.id, orgId),
            with: {
                members: {
                    with: {
                        user: true,
                        role: true
                    }
                }
            }
        });
    },
    ['organization'], // Cache key prefix
    {
        revalidate: 300, // Revalidate every 5 minutes
        tags: ['organization'] // For manual invalidation
    }
);

// Cache product catalog for 10 minutes
export const getCachedProducts = unstable_cache(
    async (vendorId: string) => {
        return await db.query.products.findMany({
            where: eq(products.vendorId, vendorId),
            with: {
                pricing: true,
                stock: true
            }
        });
    },
    ['products'],
    {
        revalidate: 600, // 10 minutes
        tags: ['products']
    }
);

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

/**
 * Invalidate cache when data changes
 */

import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Invalidate cache when data changes
 */

export async function invalidateOrganizationCache(orgId: string) {
    // Invalidate by tag
    revalidateTag('organization');

    // Invalidate specific paths
    revalidatePath('/dashboard/team');
    revalidatePath('/dashboard/profile');
}

export async function invalidateProductCache() {
    revalidateTag('products');
    revalidatePath('/dashboard/catalogues');
    revalidatePath('/dashboard/vendor/catalogue');
}

// ============================================================================
// CACHING STRATEGIES BY DATA TYPE
// ============================================================================

/**
 * STATIC DATA (Rarely Changes)
 * - Cache Duration: 1 hour - 1 day
 * - Examples: Organization settings, roles, permissions
 */
export const staticDataCache = {
    duration: 3600, // 1 hour
    tags: ['static']
};

/**
 * SEMI-STATIC DATA (Changes Occasionally)
 * - Cache Duration: 5-15 minutes
 * - Examples: Product catalog, user profiles, team members
 */
export const semiStaticCache = {
    duration: 600, // 10 minutes
    tags: ['semi-static']
};

/**
 * DYNAMIC DATA (Changes Frequently)
 * - Cache Duration: 1-5 minutes or no cache
 * - Examples: Orders, RFQs, real-time inventory
 */
export const dynamicCache = {
    duration: 60, // 1 minute
    tags: ['dynamic']
};

/**
 * REAL-TIME DATA (Never Cache)
 * - Cache Duration: 0
 * - Examples: Live chat, notifications, current user session
 */
// Don't use caching for real-time data

// ============================================================================
// REDIS CACHE (OPTIONAL - FOR HIGH TRAFFIC)
// ============================================================================

/**
 * For production with high traffic, consider Redis:
 * 
 * npm install ioredis
 * 
 * Setup:
 */

/*
import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: 0,
});

// Cache with Redis
export async function getCachedData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl = 300 // 5 minutes
): Promise<T> {
    // Try to get from cache
    const cached = await redis.get(key);
    if (cached) {
        return JSON.parse(cached);
    }

    // Fetch fresh data
    const data = await fetchFn();
    
    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(data));
    
    return data;
}

// Usage:
const products = await getCachedData(
    `products:${vendorId}`,
    () => db.query.products.findMany({ where: eq(products.vendorId, vendorId) }),
    600 // 10 minutes
);
*/

// ============================================================================
// CACHE WARMING
// ============================================================================

/**
 * Pre-populate cache for frequently accessed data
 * Run this on application startup or scheduled intervals
 */

export async function warmCache() {
    console.log('🔥 Warming cache...');

    // Pre-cache common queries
    const tasks = [
        // Cache all organizations
        db.query.organizations.findMany({ limit: 100 }),

        // Cache active products
        db.query.products.findMany({
            where: eq(products.status, 'active'),
            limit: 1000
        }),

        // Cache roles
        db.query.roles.findMany(),
    ];

    await Promise.all(tasks);
    console.log('✅ Cache warmed');
}

// ============================================================================
// CACHE MONITORING
// ============================================================================

/**
 * Monitor cache hit rates and performance
 */

export class CacheMonitor {
    private hits = 0;
    private misses = 0;

    recordHit() {
        this.hits++;
    }

    recordMiss() {
        this.misses++;
    }

    getHitRate() {
        const total = this.hits + this.misses;
        return total === 0 ? 0 : (this.hits / total) * 100;
    }

    getStats() {
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: this.getHitRate().toFixed(2) + '%'
        };
    }

    reset() {
        this.hits = 0;
        this.misses = 0;
    }
}

export const cacheMonitor = new CacheMonitor();

// ============================================================================
// CACHING BEST PRACTICES
// ============================================================================

/**
 * DO's:
 * ✅ Cache expensive queries
 * ✅ Use appropriate TTL for data type
 * ✅ Invalidate cache when data changes
 * ✅ Monitor cache hit rates
 * ✅ Use cache tags for easy invalidation
 * 
 * DON'Ts:
 * ❌ Don't cache user-specific data globally
 * ❌ Don't cache sensitive data
 * ❌ Don't set TTL too high for dynamic data
 * ❌ Don't forget to invalidate on updates
 * ❌ Don't cache error responses
 */

// ============================================================================
// CACHE CONFIGURATION BY ENVIRONMENT
// ============================================================================

export const cacheConfig = {
    development: {
        enabled: true,
        defaultTTL: 60, // 1 minute for faster development
        redis: false
    },
    staging: {
        enabled: true,
        defaultTTL: 300, // 5 minutes
        redis: false
    },
    production: {
        enabled: true,
        defaultTTL: 600, // 10 minutes
        redis: true // Enable Redis in production
    }
};

// ============================================================================
// IMPLEMENTATION CHECKLIST
// ============================================================================

/**
 * To implement caching:
 * 
 * 1. ✅ Identify cacheable queries (slow, frequently accessed)
 * 2. ✅ Choose appropriate cache layer (React/Next.js/Redis)
 * 3. ✅ Set appropriate TTL based on data volatility
 * 4. ✅ Implement cache invalidation on data mutations
 * 5. ✅ Add cache monitoring
 * 6. ✅ Test cache behavior in development
 * 7. [ ] Load test with cache enabled
 * 8. [ ] Monitor cache hit rates in production
 * 9. [ ] Adjust TTL based on metrics
 * 10. [ ] Consider Redis for high-traffic scenarios
 */
