import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('password123', 10)

    // 1. Create Vendor Org & User
    const vendorUser = await prisma.user.upsert({
        where: { email: 'vendor@demo.com' },
        update: {},
        create: {
            email: 'vendor@demo.com',
            name: 'Demo Vendor User',
            password,
            role: 'user'
        }
    })

    // Create Org first
    const vendorOrg = await prisma.organization.create({
        data: {
            name: 'OfficeMax Direct',
            type: 'vendor',
            status: 'active'
        }
    })

    // Create Role
    const vendorRole = await prisma.role.create({
        data: {
            organizationId: vendorOrg.id,
            name: 'Owner',
            scope: 'vendor',
            description: 'Default owner role'
        }
    })

    // Create Membership
    await prisma.organizationMember.create({
        data: {
            organizationId: vendorOrg.id,
            userId: vendorUser.id,
            roleId: vendorRole.id,
            status: 'active'
        }
    })

    // 2. Create Company Org & User
    const companyUser = await prisma.user.upsert({
        where: { email: 'company@demo.com' },
        update: {},
        create: {
            email: 'company@demo.com',
            name: 'Demo Company User',
            password,
            role: 'user'
        }
    })

    const companyOrg = await prisma.organization.create({
        data: {
            name: 'Acme Corp',
            type: 'company',
            status: 'active'
        }
    })

    // Create all predefined roles for company
    const adminRole = await prisma.role.create({
        data: {
            organizationId: companyOrg.id,
            name: 'Admin (Owner)',
            scope: 'company',
            description: 'Full catalogue and team control'
        }
    })

    const salesManagerRole = await prisma.role.create({
        data: {
            organizationId: companyOrg.id,
            name: 'Sales Manager',
            scope: 'company',
            description: 'Manage clients + pricing + promotions'
        }
    })

    const salesRepRole = await prisma.role.create({
        data: {
            organizationId: companyOrg.id,
            name: 'Sales Representative',
            scope: 'company',
            description: 'Handle assigned clients and orders'
        }
    })

    const logisticsRole = await prisma.role.create({
        data: {
            organizationId: companyOrg.id,
            name: 'Logistics Staff',
            scope: 'company',
            description: 'Update delivery and stock statuses'
        }
    })

    const viewerRole = await prisma.role.create({
        data: {
            organizationId: companyOrg.id,
            name: 'Viewer',
            scope: 'company',
            description: 'View analytics and orders only'
        }
    })

    // Create Membership with Admin role
    await prisma.organizationMember.create({
        data: {
            organizationId: companyOrg.id,
            userId: companyUser.id,
            roleId: adminRole.id,
            status: 'active'
        }
    })

    // Create Zura's User
    const zuraUser = await prisma.user.upsert({
        where: { email: 'gamtenadze.zura@gmail.com' },
        update: {
            password,
            role: 'user'
        },
        create: {
            email: 'gamtenadze.zura@gmail.com',
            name: 'Zura',
            password,
            role: 'user'
        }
    })

    // Add Zura to Company Team
    await prisma.organizationMember.create({
        data: {
            organizationId: companyOrg.id,
            userId: zuraUser.id,
            roleId: adminRole.id,
            status: 'active'
        }
    })

    // 3. Create Products for Vendor
    await prisma.product.createMany({
        data: [
            {
                vendorId: vendorOrg.id,
                name: 'Office Paper A4 (500 sheets)',
                sku: 'PAPER-001',
                description: 'Premium office paper',
            },
            {
                vendorId: vendorOrg.id,
                name: 'Ballpoint Pens (Box of 50)',
                sku: 'PEN-002',
            },
            {
                vendorId: vendorOrg.id,
                name: 'Stapler Heavy Duty',
                sku: 'STAPLER-003',
            }
        ]
    })

    // 4. Link Company to Vendor
    await prisma.companyVendorLink.create({
        data: {
            companyId: companyOrg.id,
            vendorId: vendorOrg.id,
            status: 'active'
        }
    })

    console.log({ vendorUser, companyUser })

    // 5. Create Sample Orders
    // Order 1: Pending
    await prisma.order.create({
        data: {
            orderNumber: 'ORD-2026-001',
            companyId: companyOrg.id,
            vendorId: vendorOrg.id,
            status: 'pending',
            urgency: 'medium',
            subtotal: 50.00,
            grandTotal: 50.00,
            currency: 'GEL',
            createdBy: companyUser.id
        }
    })

    // Order 2: Delivered
    await prisma.order.create({
        data: {
            orderNumber: 'ORD-2026-002',
            companyId: companyOrg.id,
            vendorId: vendorOrg.id,
            status: 'delivered',
            urgency: 'low',
            subtotal: 120.50,
            grandTotal: 120.50,
            currency: 'GEL',
            createdBy: companyUser.id,
            deliveredAt: new Date()
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
