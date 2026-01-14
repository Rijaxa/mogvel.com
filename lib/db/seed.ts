import { db, pool } from '../db';
import { users, organizations, roles, organizationMembers, products, companyVendorLinks, orders } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // Create Vendor User
        const hashedVendorPassword = await bcrypt.hash('vendor123', 10);
        const [vendorUser] = await db.insert(users).values({
            email: 'vendor@mogvel.com',
            password: hashedVendorPassword,
            name: 'Vendor Admin',
            role: 'user'
        }).returning();

        console.log('✓ Created vendor user');

        // Create Vendor Organization
        const [vendorOrg] = await db.insert(organizations).values({
            type: 'vendor',
            name: 'Mogvel Supplies',
            legalName: 'Mogvel Supplies LLC',
            status: 'active',
            isListed: true,
            verificationStatus: 'verified'
        }).returning();

        console.log('✓ Created vendor organization');

        // Create Vendor Role
        const [vendorRole] = await db.insert(roles).values({
            organizationId: vendorOrg.id,
            scope: 'vendor',
            name: 'Admin',
            description: 'Full access to vendor features'
        }).returning();

        console.log('✓ Created vendor role');

        // Link Vendor User to Organization
        await db.insert(organizationMembers).values({
            organizationId: vendorOrg.id,
            userId: vendorUser.id,
            roleId: vendorRole.id,
            status: 'active'
        });

        console.log('✓ Linked vendor user to organization');

        // Create Company User
        const hashedCompanyPassword = await bcrypt.hash('company123', 10);
        const [companyUser] = await db.insert(users).values({
            email: 'company@mogvel.com',
            password: hashedCompanyPassword,
            name: 'Company Admin',
            role: 'user'
        }).returning();

        console.log('✓ Created company user');

        // Create Company Organization
        const [companyOrg] = await db.insert(organizations).values({
            type: 'company',
            name: 'Acme Corporation',
            legalName: 'Acme Corporation Ltd',
            status: 'active',
            isListed: false,
            verificationStatus: 'verified'
        }).returning();

        console.log('✓ Created company organization');

        // Create Company Roles
        const [adminRole] = await db.insert(roles).values({
            organizationId: companyOrg.id,
            scope: 'company',
            name: 'Admin',
            description: 'Full administrative access'
        }).returning();

        const [salesManagerRole] = await db.insert(roles).values({
            organizationId: companyOrg.id,
            scope: 'company',
            name: 'Sales Manager',
            description: 'Manage sales and orders'
        }).returning();

        const [salesRepRole] = await db.insert(roles).values({
            organizationId: companyOrg.id,
            scope: 'company',
            name: 'Sales Representative',
            description: 'Create and view orders'
        }).returning();

        const [logisticsRole] = await db.insert(roles).values({
            organizationId: companyOrg.id,
            scope: 'company',
            name: 'Logistics',
            description: 'Manage inventory and shipments'
        }).returning();

        const [viewerRole] = await db.insert(roles).values({
            organizationId: companyOrg.id,
            scope: 'company',
            name: 'Viewer',
            description: 'Read-only access'
        }).returning();

        console.log('✓ Created company roles');

        // Link Company User to Organization
        await db.insert(organizationMembers).values({
            organizationId: companyOrg.id,
            userId: companyUser.id,
            roleId: adminRole.id,
            status: 'active'
        });

        console.log('✓ Linked company user to organization');

        // Create Zura User (from your existing data)
        const hashedZuraPassword = await bcrypt.hash('zura123', 10);
        const [zuraUser] = await db.insert(users).values({
            email: 'gamtenadze.zura@gmail.com',
            password: hashedZuraPassword,
            name: 'Zura Gamtenadze',
            role: 'admin'
        }).returning();

        console.log('✓ Created Zura user');

        // Link Zura to Company Organization
        await db.insert(organizationMembers).values({
            organizationId: companyOrg.id,
            userId: zuraUser.id,
            roleId: adminRole.id,
            status: 'active'
        });

        console.log('✓ Linked Zura to company organization');

        // Create Sample Products
        await db.insert(products).values([
            {
                vendorId: vendorOrg.id,
                sku: 'PROD-001',
                name: 'Office Chair',
                description: 'Ergonomic office chair',
                category: 'Furniture',
                status: 'active'
            },
            {
                vendorId: vendorOrg.id,
                sku: 'PROD-002',
                name: 'Standing Desk',
                description: 'Adjustable standing desk',
                category: 'Furniture',
                status: 'active'
            },
            {
                vendorId: vendorOrg.id,
                sku: 'PROD-003',
                name: 'Monitor',
                description: '27-inch 4K monitor',
                category: 'Electronics',
                status: 'active'
            }
        ]);

        console.log('✓ Created sample products');

        // Create Company-Vendor Link
        await db.insert(companyVendorLinks).values({
            companyId: companyOrg.id,
            vendorId: vendorOrg.id,
            status: 'active'
        });

        console.log('✓ Created company-vendor link');

        // Create Sample Orders
        await db.insert(orders).values([
            {
                orderNumber: 'ORD-2024-001',
                companyId: companyOrg.id,
                vendorId: vendorOrg.id,
                status: 'pending',
                urgency: 'medium',
                currency: 'GEL',
                subtotal: '1500.00',
                grandTotal: '1500.00',
                createdBy: companyUser.id
            },
            {
                orderNumber: 'ORD-2024-002',
                companyId: companyOrg.id,
                vendorId: vendorOrg.id,
                status: 'delivered',
                urgency: 'low',
                currency: 'GEL',
                subtotal: '2500.00',
                grandTotal: '2500.00',
                createdBy: companyUser.id,
                deliveredAt: new Date()
            }
        ]);

        console.log('✓ Created sample orders');

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Test Credentials:');
        console.log('   Vendor: vendor@mogvel.com / vendor123');
        console.log('   Company: company@mogvel.com / company123');
        console.log('   Admin: gamtenadze.zura@gmail.com / zura123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seed();
