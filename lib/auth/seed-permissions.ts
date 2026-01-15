'use server';

import { db } from '@/lib/db';
import { rolePermissions } from '@/lib/db/schema';

/**
 * Default permissions for different role types
 */
export const DEFAULT_PERMISSIONS = {
    // Owner has full access to everything
    Owner: [
        // Analytics
        { resource: 'analytics', action: 'view' },
        { resource: 'analytics', action: 'export' },

        // Products
        { resource: 'products', action: 'view' },
        { resource: 'products', action: 'create' },
        { resource: 'products', action: 'edit' },
        { resource: 'products', action: 'delete' },

        // Orders
        { resource: 'orders', action: 'view' },
        { resource: 'orders', action: 'create' },
        { resource: 'orders', action: 'edit' },
        { resource: 'orders', action: 'cancel' },
        { resource: 'orders', action: 'approve' },

        // Team Management
        { resource: 'team', action: 'view' },
        { resource: 'team', action: 'invite' },
        { resource: 'team', action: 'edit' },
        { resource: 'team', action: 'remove' },

        // Settings
        { resource: 'settings', action: 'view' },
        { resource: 'settings', action: 'edit' },

        // RFQs (Company only)
        { resource: 'rfqs', action: 'view' },
        { resource: 'rfqs', action: 'create' },
        { resource: 'rfqs', action: 'edit' },

        // Stock Management (Vendor only)
        { resource: 'stock', action: 'view' },
        { resource: 'stock', action: 'edit' },
    ],

    // Manager has most permissions except critical team/settings changes
    Manager: [
        { resource: 'analytics', action: 'view' },
        { resource: 'analytics', action: 'export' },
        { resource: 'products', action: 'view' },
        { resource: 'products', action: 'create' },
        { resource: 'products', action: 'edit' },
        { resource: 'orders', action: 'view' },
        { resource: 'orders', action: 'create' },
        { resource: 'orders', action: 'edit' },
        { resource: 'orders', action: 'approve' },
        { resource: 'team', action: 'view' },
        { resource: 'settings', action: 'view' },
        { resource: 'rfqs', action: 'view' },
        { resource: 'rfqs', action: 'create' },
        { resource: 'stock', action: 'view' },
        { resource: 'stock', action: 'edit' },
    ],

    // Viewer can only view data
    Viewer: [
        { resource: 'analytics', action: 'view' },
        { resource: 'products', action: 'view' },
        { resource: 'orders', action: 'view' },
        { resource: 'team', action: 'view' },
        { resource: 'settings', action: 'view' },
        { resource: 'rfqs', action: 'view' },
        { resource: 'stock', action: 'view' },
    ],
};

/**
 * Seed permissions for a specific role
 */
export async function seedRolePermissions(roleId: string, roleName: string) {
    const permissions = DEFAULT_PERMISSIONS[roleName as keyof typeof DEFAULT_PERMISSIONS];

    if (!permissions) {
        console.warn(`No default permissions defined for role: ${roleName}`);
        return;
    }

    try {
        // Insert all permissions for this role
        await db.insert(rolePermissions).values(
            permissions.map(p => ({
                roleId,
                resource: p.resource,
                action: p.action,
                allowed: true,
            }))
        );

        console.log(`✅ Seeded ${permissions.length} permissions for role: ${roleName}`);
    } catch (error) {
        console.error(`Error seeding permissions for role ${roleName}:`, error);
        throw error;
    }
}
