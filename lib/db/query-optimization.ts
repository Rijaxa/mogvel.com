// Query Optimization Configuration for Drizzle ORM
// This file contains optimized query patterns and best practices

import { db } from './db';
import { users, organizations, organizationMembers, products, orders } from './db/schema';
import { eq, and, or, desc, asc, sql, inArray } from 'drizzle-orm';

/**
 * QUERY OPTIMIZATION PATTERNS
 * 
 * 1. Use indexes for WHERE clauses
 * 2. Limit result sets with .limit()
 * 3. Use prepared statements for repeated queries
 * 4. Batch queries when possible
 * 5. Use WITH clauses for complex joins
 */

// ============================================================================
// OPTIMIZED QUERY PATTERNS
// ============================================================================

/**
 * Pattern 1: Indexed Lookups
 * Always use indexed columns in WHERE clauses
 */
export async function getUserByEmail(email: string) {
    // ✅ GOOD: Uses indexed email column
    return await db.query.users.findFirst({
        where: eq(users.email, email),
        // Only select needed columns to reduce data transfer
        columns: {
            id: true,
            email: true,
            name: true,
            role: true,
        }
    });
}

/**
 * Pattern 2: Limit Result Sets
 * Always limit queries to prevent loading too much data
 */
export async function getRecentOrders(limit = 50) {
    // ✅ GOOD: Limited and ordered by indexed column
    return await db.query.orders.findMany({
        limit,
        orderBy: [desc(orders.placedAt)],
        with: {
            company: {
                columns: { name: true }
            },
            vendor: {
                columns: { name: true }
            }
        }
    });
}

/**
 * Pattern 3: Prepared Statements
 * Use for queries executed multiple times
 */
export const preparedQueries = {
    // Prepared statement for user lookup
    getUserById: db.query.users.findFirst({
        where: eq(users.id, sql.placeholder('userId'))
    }).prepare('get_user_by_id'),

    // Prepared statement for organization members
    getOrgMembers: db.query.organizationMembers.findMany({
        where: eq(organizationMembers.organizationId, sql.placeholder('orgId')),
        with: {
            user: true,
            role: true
        }
    }).prepare('get_org_members')
};

/**
 * Pattern 4: Batch Queries
 * Fetch multiple records in one query instead of N+1
 */
export async function getProductsWithPricing(productIds: string[]) {
    // ✅ GOOD: Single query with IN clause
    return await db.query.products.findMany({
        where: inArray(products.id, productIds),
        with: {
            pricing: true,
            stock: true
        }
    });
}

/**
 * Pattern 5: Selective Field Loading
 * Only load fields you need
 */
export async function getUserList() {
    // ✅ GOOD: Only loads necessary columns
    return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
    }).from(users).limit(100);
}

/**
 * Pattern 6: Efficient Counting
 * Use COUNT(*) for better performance
 */
export async function getUserCount() {
    // ✅ GOOD: Efficient count query
    const result = await db.select({
        count: sql<number>`count(*)::int`
    }).from(users);

    return result[0].count;
}

/**
 * Pattern 7: Complex Joins with CTEs
 * Use Common Table Expressions for complex queries
 */
export async function getOrganizationStats(orgId: string) {
    // ✅ GOOD: Efficient aggregation
    const stats = await db.select({
        totalMembers: sql<number>`count(distinct ${organizationMembers.id})::int`,
        totalProducts: sql<number>`count(distinct ${products.id})::int`,
        totalOrders: sql<number>`count(distinct ${orders.id})::int`
    })
        .from(organizations)
        .leftJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
        .leftJoin(products, eq(organizations.id, products.vendorId))
        .leftJoin(orders, or(
            eq(organizations.id, orders.companyId),
            eq(organizations.id, orders.vendorId)
        ))
        .where(eq(organizations.id, orgId))
        .groupBy(organizations.id);

    return stats[0];
}

// ============================================================================
// QUERY ANTI-PATTERNS (AVOID THESE)
// ============================================================================

/**
 * ❌ BAD: N+1 Query Problem
 */
async function badGetUsersWithOrgs() {
    const users = await db.query.users.findMany();

    // ❌ This creates N queries (one per user)
    for (const user of users) {
        const memberships = await db.query.organizationMembers.findMany({
            where: eq(organizationMembers.userId, user.id)
        });
    }
}

/**
 * ✅ GOOD: Single Query with Relations
 */
async function goodGetUsersWithOrgs() {
    // ✅ Single query with eager loading
    return await db.query.users.findMany({
        with: {
            memberships: {
                with: {
                    organization: true
                }
            }
        }
    });
}

/**
 * ❌ BAD: Loading All Data
 */
async function badGetAllProducts() {
    // ❌ Loads entire table into memory
    return await db.query.products.findMany();
}

/**
 * ✅ GOOD: Paginated Results
 */
async function goodGetProducts(page = 1, pageSize = 50) {
    // ✅ Loads only needed page
    const offset = (page - 1) * pageSize;
    return await db.query.products.findMany({
        limit: pageSize,
        offset
    });
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Query Performance Logger
 * Wrap queries to measure execution time
 */
export async function measureQuery<T>(
    name: string,
    queryFn: () => Promise<T>
): Promise<T> {
    const start = performance.now();
    try {
        const result = await queryFn();
        const duration = performance.now() - start;

        // Log slow queries (> 100ms)
        if (duration > 100) {
            console.warn(`⚠️ Slow query: ${name} took ${duration.toFixed(2)}ms`);
        } else {
            console.log(`✓ Query: ${name} took ${duration.toFixed(2)}ms`);
        }

        return result;
    } catch (error) {
        const duration = performance.now() - start;
        console.error(`❌ Query failed: ${name} after ${duration.toFixed(2)}ms`, error);
        throw error;
    }
}

// Usage example:
// const users = await measureQuery('getUserList', () => getUserList());

// ============================================================================
// CONNECTION POOL OPTIMIZATION
// ============================================================================

/**
 * Connection pool is configured in lib/db.ts:
 * 
 * - max: 20 connections (adjust based on load)
 * - idleTimeoutMillis: 30000 (30 seconds)
 * - connectionTimeoutMillis: 2000 (2 seconds)
 * 
 * Monitor pool usage:
 * - If pool exhaustion occurs, increase max
 * - If idle connections high, decrease max
 * - If connection timeouts occur, check database load
 */

export const connectionPoolConfig = {
    max: 20,                      // Maximum pool size
    idleTimeoutMillis: 30000,     // Close idle connections after 30s
    connectionTimeoutMillis: 2000, // Fail fast if no connection available

    // For production, consider:
    // max: 50-100 (based on concurrent users)
    // idleTimeoutMillis: 60000 (1 minute)
    // connectionTimeoutMillis: 5000 (5 seconds)
};

// ============================================================================
// INDEX RECOMMENDATIONS
// ============================================================================

/**
 * Current indexes (defined in schema.ts):
 *
 * 1. idx_orders_company - ON orders(company_id)
 * 2. idx_orders_vendor - ON orders(vendor_id)
 * 3. idx_pricing_product_company - ON product_pricing(product_id, company_id)
 *
 * Additional indexes to consider:
 *
 * 4. ON users(email) - Already unique, serves as index
 * 5. ON orders(placed_at) - For date range queries
 * 6. ON products(vendor_id, status) - For active product lookups
 * 7. ON organization_members(user_id, status) - For active membership queries
 */

// ============================================================================
// QUERY OPTIMIZATION CHECKLIST
// ============================================================================

/**
 * Before deploying a query, verify:
 * 
 * ✅ Uses indexed columns in WHERE clause
 * ✅ Limits result set size
 * ✅ Only selects needed columns
 * ✅ Uses prepared statements if repeated
 * ✅ Avoids N+1 queries
 * ✅ Uses batch loading when possible
 * ✅ Measured performance < 100ms
 * ✅ Tested with production-size data
 */
