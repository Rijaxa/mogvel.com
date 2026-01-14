import { pgTable, text, uuid, timestamp, boolean, integer, decimal, unique, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// =======================
// User & Auth
// =======================

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password'),
    name: text('name'),
    role: text('role').notNull().default('user'), // 'user', 'admin'
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    companyDetails: text('company_details'), // JSON string
});

export const usersRelations = relations(users, ({ many }) => ({
    memberships: many(organizationMembers),
    createdOrders: many(orders),
}));

// =======================
// Organizations
// =======================

export const organizations = pgTable('organizations', {
    id: uuid('id').primaryKey().defaultRandom(),
    type: text('type').notNull(), // 'company', 'vendor'
    name: text('name').notNull(),
    legalName: text('legal_name'),
    taxId: text('tax_id'),
    country: text('country'),
    city: text('city'),
    address: text('address'),
    status: text('status').notNull().default('active'), // 'active', 'suspended', 'pending_verification'
    isListed: boolean('is_listed').notNull().default(true),
    verificationStatus: text('verification_status').notNull().default('pending'), // 'pending', 'verified', 'rejected'
    supportPhone: text('support_phone'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
    members: many(organizationMembers),
    roles: many(roles),
    locations: many(locations),
    // Vendor relations
    products: many(products),
    vendorLinks: many(companyVendorLinks, { relationName: 'vendorLinks' }),
    contractsAsVendor: many(contracts, { relationName: 'vendorContracts' }),
    ordersAsVendor: many(orders, { relationName: 'vendorOrders' }),
    rfqResponses: many(rfqResponses),
    // Company relations
    pricing: many(productPricing),
    companyLinks: many(companyVendorLinks, { relationName: 'companyLinks' }),
    contractsAsCompany: many(contracts, { relationName: 'companyContracts' }),
    ordersAsCompany: many(orders, { relationName: 'companyOrders' }),
    rfqs: many(rfqs),
}));

// =======================
// Organization Members
// =======================

export const organizationMembers = pgTable('organization_members', {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'restrict' }),
    status: text('status').notNull().default('invited'), // 'invited', 'active', 'disabled'
    invitedEmail: text('invited_email'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    uniqueOrgUser: unique().on(table.organizationId, table.userId),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
    organization: one(organizations, {
        fields: [organizationMembers.organizationId],
        references: [organizations.id],
    }),
    user: one(users, {
        fields: [organizationMembers.userId],
        references: [users.id],
    }),
    role: one(roles, {
        fields: [organizationMembers.roleId],
        references: [roles.id],
    }),
}));

// =======================
// Roles
// =======================

export const roles = pgTable('roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    scope: text('scope').notNull(), // 'company', 'vendor'
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    uniqueOrgName: unique().on(table.organizationId, table.name),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [roles.organizationId],
        references: [organizations.id],
    }),
    members: many(organizationMembers),
    permissions: many(rolePermissions),
}));

// =======================
// Role Permissions
// =======================

export const rolePermissions = pgTable('role_permissions', {
    id: uuid('id').primaryKey().defaultRandom(),
    roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
    resource: text('resource').notNull(),
    action: text('action').notNull(),
    allowed: boolean('allowed').notNull().default(true),
}, (table) => ({
    uniqueRoleResourceAction: unique().on(table.roleId, table.resource, table.action),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id],
    }),
}));

// =======================
// Locations
// =======================

export const locations = pgTable('locations', {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: text('type'), // 'hq', 'warehouse', 'office', 'branch'
    address: text('address'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const locationsRelations = relations(locations, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [locations.organizationId],
        references: [organizations.id],
    }),
    stock: many(productStock),
    receivedOrders: many(orders),
}));

// =======================
// Inventory - Products
// =======================

export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    vendorId: uuid('vendor_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    sku: text('sku'),
    name: text('name').notNull(),
    description: text('description'),
    category: text('category'),
    subCategory: text('sub_category'),
    unitOfMeasure: text('unit_of_measure'),
    minOrderQuantity: integer('min_order_quantity').notNull().default(1),
    leadTimeDays: integer('lead_time_days').notNull().default(0),
    status: text('status').notNull().default('active'), // 'active', 'inactive'
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
    vendor: one(organizations, {
        fields: [products.vendorId],
        references: [organizations.id],
    }),
    pricing: many(productPricing),
    stock: many(productStock),
}));

// =======================
// Product Pricing
// =======================

export const productPricing = pgTable('product_pricing', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    currency: text('currency').notNull().default('GEL'),
    basePrice: decimal('base_price', { precision: 12, scale: 2 }).notNull(),
    priceMin: decimal('price_min', { precision: 12, scale: 2 }),
    priceMax: decimal('price_max', { precision: 12, scale: 2 }),
    volumeThreshold: integer('volume_threshold'),
    companyId: uuid('company_id').references(() => organizations.id, { onDelete: 'cascade' }),
    validFrom: timestamp('valid_from', { withTimezone: true }).notNull().defaultNow(),
    validTo: timestamp('valid_to', { withTimezone: true }),
}, (table) => ({
    productCompanyIdx: index('idx_pricing_product_company').on(table.productId, table.companyId),
}));

export const productPricingRelations = relations(productPricing, ({ one }) => ({
    product: one(products, {
        fields: [productPricing.productId],
        references: [products.id],
    }),
    company: one(organizations, {
        fields: [productPricing.companyId],
        references: [organizations.id],
    }),
}));

// =======================
// Product Stock
// =======================

export const productStock = pgTable('product_stock', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id').notNull().references(() => locations.id, { onDelete: 'cascade' }),
    currentStock: decimal('current_stock').notNull().default('0'),
    reservedStock: decimal('reserved_stock').notNull().default('0'),
    stockStatus: text('stock_status').notNull().default('medium'), // 'high', 'medium', 'low', 'critical'
    reorderPoint: decimal('reorder_point'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    uniqueProductLocation: unique().on(table.productId, table.locationId),
}));

export const productStockRelations = relations(productStock, ({ one }) => ({
    product: one(products, {
        fields: [productStock.productId],
        references: [products.id],
    }),
    location: one(locations, {
        fields: [productStock.locationId],
        references: [locations.id],
    }),
}));

// =======================
// Commerce - Company Vendor Links
// =======================

export const companyVendorLinks = pgTable('company_vendor_links', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    vendorId: uuid('vendor_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('invited'), // 'active', 'invited', 'blocked'
    contractId: text('contract_id'),
    rating: decimal('rating', { precision: 2, scale: 1 }),
    priceStability: text('price_stability'),
    deliverySlaPercent: decimal('delivery_sla_percent', { precision: 5, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    uniqueCompanyVendor: unique().on(table.companyId, table.vendorId),
}));

export const companyVendorLinksRelations = relations(companyVendorLinks, ({ one }) => ({
    company: one(organizations, {
        fields: [companyVendorLinks.companyId],
        references: [organizations.id],
        relationName: 'companyLinks',
    }),
    vendor: one(organizations, {
        fields: [companyVendorLinks.vendorId],
        references: [organizations.id],
        relationName: 'vendorLinks',
    }),
}));

// =======================
// Contracts
// =======================

export const contracts = pgTable('contracts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title'),
    vendorId: uuid('vendor_id').references(() => organizations.id),
    companyId: uuid('company_id').references(() => organizations.id),
    validFrom: timestamp('valid_from', { withTimezone: true }),
    validTo: timestamp('valid_to', { withTimezone: true }),
    fileUrl: text('file_url'),
    status: text('status').default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
    vendor: one(organizations, {
        fields: [contracts.vendorId],
        references: [organizations.id],
        relationName: 'vendorContracts',
    }),
    company: one(organizations, {
        fields: [contracts.companyId],
        references: [organizations.id],
        relationName: 'companyContracts',
    }),
}));

// =======================
// Orders
// =======================

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderNumber: text('order_number').notNull().unique(),
    companyId: uuid('company_id').notNull().references(() => organizations.id, { onDelete: 'restrict' }),
    vendorId: uuid('vendor_id').notNull().references(() => organizations.id, { onDelete: 'restrict' }),
    locationId: uuid('location_id').references(() => locations.id),
    status: text('status').notNull().default('pending'), // 'pending', 'approved', 'shipped', 'delivered', 'cancelled'
    urgency: text('urgency').notNull().default('medium'), // 'low', 'medium', 'urgent'
    currency: text('currency').notNull().default('GEL'),
    subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
    discountTotal: decimal('discount_total', { precision: 12, scale: 2 }).notNull().default('0'),
    taxTotal: decimal('tax_total', { precision: 12, scale: 2 }).notNull().default('0'),
    grandTotal: decimal('grand_total', { precision: 12, scale: 2 }).notNull().default('0'),
    placedAt: timestamp('placed_at', { withTimezone: true }).notNull().defaultNow(),
    expectedDeliveryAt: timestamp('expected_delivery_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    createdBy: uuid('created_by').references(() => users.id),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    companyIdx: index('idx_orders_company').on(table.companyId),
    vendorIdx: index('idx_orders_vendor').on(table.vendorId),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
    company: one(organizations, {
        fields: [orders.companyId],
        references: [organizations.id],
        relationName: 'companyOrders',
    }),
    vendor: one(organizations, {
        fields: [orders.vendorId],
        references: [organizations.id],
        relationName: 'vendorOrders',
    }),
    location: one(locations, {
        fields: [orders.locationId],
        references: [locations.id],
    }),
    creator: one(users, {
        fields: [orders.createdBy],
        references: [users.id],
    }),
}));

// =======================
// RFQ - Requests for Quotation
// =======================

export const rfqs = pgTable('rfqs', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    status: text('status').notNull().default('draft'), // 'draft', 'open', 'closed', 'awarded'
    deadline: timestamp('deadline', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const rfqsRelations = relations(rfqs, ({ one, many }) => ({
    company: one(organizations, {
        fields: [rfqs.companyId],
        references: [organizations.id],
    }),
    items: many(rfqItems),
    responses: many(rfqResponses),
}));

// =======================
// RFQ Items
// =======================

export const rfqItems = pgTable('rfq_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    rfqId: uuid('rfq_id').notNull().references(() => rfqs.id, { onDelete: 'cascade' }),
    productName: text('product_name').notNull(),
    quantity: decimal('quantity'),
    targetPrice: decimal('target_price', { precision: 12, scale: 2 }),
});

export const rfqItemsRelations = relations(rfqItems, ({ one }) => ({
    rfq: one(rfqs, {
        fields: [rfqItems.rfqId],
        references: [rfqs.id],
    }),
}));

// =======================
// RFQ Responses
// =======================

export const rfqResponses = pgTable('rfq_responses', {
    id: uuid('id').primaryKey().defaultRandom(),
    rfqId: uuid('rfq_id').notNull().references(() => rfqs.id, { onDelete: 'cascade' }),
    vendorId: uuid('vendor_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    priceQuote: decimal('price_quote', { precision: 12, scale: 2 }),
    comments: text('comments'),
    respondedAt: timestamp('responded_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    uniqueRfqVendor: unique().on(table.rfqId, table.vendorId),
}));

export const rfqResponsesRelations = relations(rfqResponses, ({ one }) => ({
    rfq: one(rfqs, {
        fields: [rfqResponses.rfqId],
        references: [rfqs.id],
    }),
    vendor: one(organizations, {
        fields: [rfqResponses.vendorId],
        references: [organizations.id],
    }),
}));

// =======================
// Team Activity Log
// =======================

export const teamActivities = pgTable('team_activities', {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull(),
    actorId: uuid('actor_id').notNull(),
    actorName: text('actor_name').notNull(),
    targetId: uuid('target_id'),
    targetName: text('target_name'),
    action: text('action').notNull(), // 'invited', 'updated_role', 'suspended', 'activated', 'deleted', 'updated_access'
    details: text('details'), // JSON string
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Export all tables for Drizzle
export const schema = {
    users,
    organizations,
    organizationMembers,
    roles,
    rolePermissions,
    locations,
    products,
    productPricing,
    productStock,
    companyVendorLinks,
    contracts,
    orders,
    rfqs,
    rfqItems,
    rfqResponses,
    teamActivities,
};
