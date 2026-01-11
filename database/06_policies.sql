-- =========================================================
-- 06_policies.sql
-- Row Level Security (RLS)
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.company_vendor_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_responses ENABLE ROW LEVEL SECURITY;


-- 1. Profiles: Users can see/edit their own profile
CREATE POLICY profiles_select_self ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_insert_self ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- 2. Organization Members: Users see their own membership
CREATE POLICY org_members_select_self ON public.organization_members FOR SELECT USING (user_id = auth.uid());
-- Invites are usually handled by service_role or specific logic, defaulting to self-view for now.


-- 3. Roles & Permissions: Readable by active members of the same org
CREATE POLICY roles_select_member ON public.roles
FOR SELECT USING (public.is_active_member(organization_id));

CREATE POLICY role_permissions_select_member ON public.role_permissions
FOR SELECT USING (
 EXISTS (
   SELECT 1 FROM public.roles r
   WHERE r.id = role_permissions.role_id
     AND public.is_active_member(r.organization_id)
 )
);


-- 4. Organizations
-- Members see their own org.
-- Company users can see "listed", "active" "vendor" orgs (discovery).
CREATE POLICY organizations_select ON public.organizations
FOR SELECT
USING (
 public.is_active_member(id)
 OR (
   public.is_company_user()
   AND organizations.type = 'vendor'
   AND organizations.status = 'active'
   AND organizations.is_listed = true
 )
);

-- 5. Locations: Members see their org's locations
CREATE POLICY locations_select_member ON public.locations FOR SELECT USING (public.is_active_member(organization_id));
CREATE POLICY locations_insert_member ON public.locations FOR INSERT WITH CHECK (public.is_active_member(organization_id));
CREATE POLICY locations_update_member ON public.locations FOR UPDATE USING (public.is_active_member(organization_id)) WITH CHECK (public.is_active_member(organization_id));


-- 6. Company <-> Vendor Links
-- Visible to members of either side
CREATE POLICY cvl_select ON public.company_vendor_links
FOR SELECT
USING (public.is_active_member(company_id) OR public.is_active_member(vendor_id));


-- 7. Products
-- Vendor sees own products.
-- Company sees products if:
--   a) Vendor is listed & active
--   b) Or they have a link (invited/active) with the vendor
CREATE POLICY products_select ON public.products
FOR SELECT
USING (
 public.is_active_member(vendor_id)
 OR (
   public.is_company_user()
   AND EXISTS (
     SELECT 1 FROM public.organizations o
     WHERE o.id = products.vendor_id
       AND o.type='vendor'
       AND o.status='active'
       AND o.is_listed=true
   )
 )
 OR (
   public.is_company_user()
   AND EXISTS (
     SELECT 1 FROM public.company_vendor_links cvl
     JOIN public.organization_members m ON m.organization_id = cvl.company_id
     WHERE cvl.vendor_id = products.vendor_id
       AND cvl.status IN ('active','invited')
       AND m.user_id = auth.uid()
       AND m.status = 'active'
   )
 )
);

CREATE POLICY products_insert_vendor ON public.products FOR INSERT WITH CHECK (public.is_active_member(vendor_id));
CREATE POLICY products_update_vendor ON public.products FOR UPDATE USING (public.is_active_member(vendor_id)) WITH CHECK (public.is_active_member(vendor_id));


-- 8. Pricing
-- Vendor sees own pricing.
-- Companies see pricing for products they can see (simplified) OR explicit company_id match
CREATE POLICY pricing_select ON public.product_pricing
FOR SELECT
USING (
 EXISTS (
   SELECT 1 FROM public.products p
   WHERE p.id = product_pricing.product_id
     AND public.is_active_member(p.vendor_id)
 )
 OR (company_id IS NOT NULL AND public.is_active_member(company_id))
 -- Note: The logic for general pricing visibility is tricky, usually relies on Product visibility.
 -- Assuming if you can see product, you can see base pricing, unless specific restrictions apply.
 -- For now, restricting to "Own Vendor" OR "Targeted Company Price".
 -- If we want public prices, we need the Product visibility logic here too or a simpler "public price".
);


-- 9. Product Stock
-- Vendor sees own stock.
CREATE POLICY product_stock_select ON public.product_stock
FOR SELECT
USING (
 EXISTS (
   SELECT 1
   FROM public.products p
   JOIN public.locations l ON l.id = product_stock.location_id
   WHERE p.id = product_stock.product_id
     AND l.organization_id = p.vendor_id
     AND public.is_active_member(p.vendor_id)
 )
);


-- 10. Contracts
CREATE POLICY contracts_select ON public.contracts
FOR SELECT
USING (
 (company_id IS NOT NULL AND public.is_active_member(company_id))
 OR (vendor_id IS NOT NULL AND public.is_active_member(vendor_id))
);


-- 11. Orders
-- Visible to both parties
CREATE POLICY orders_select ON public.orders
FOR SELECT
USING (
 public.is_active_member(company_id)
 OR public.is_active_member(vendor_id)
);

CREATE POLICY orders_insert_company ON public.orders FOR INSERT WITH CHECK (public.is_active_member(company_id));
CREATE POLICY orders_update_participants ON public.orders FOR UPDATE
USING (public.is_active_member(company_id) OR public.is_active_member(vendor_id))
WITH CHECK (public.is_active_member(company_id) OR public.is_active_member(vendor_id));


-- 12. RFQs
-- Company sees own.
-- Vendors see Open/Closed/Awarded (Public RFQs).
CREATE POLICY rfqs_select ON public.rfqs
FOR SELECT
USING (
 public.is_active_member(company_id)
 OR (public.is_vendor_user() AND status IN ('open','closed','awarded'))
);

CREATE POLICY rfqs_insert_company ON public.rfqs FOR INSERT WITH CHECK (public.is_active_member(company_id));
CREATE POLICY rfqs_update_company ON public.rfqs FOR UPDATE USING (public.is_active_member(company_id)) WITH CHECK (public.is_active_member(company_id));


-- 13. RFQ Items
-- Visible if RFQ is visible
CREATE POLICY rfq_items_select ON public.rfq_items
FOR SELECT
USING (
 EXISTS (
   SELECT 1 FROM public.rfqs r
   WHERE r.id = rfq_items.rfq_id
     AND (
       public.is_active_member(r.company_id)
       OR (public.is_vendor_user() AND r.status IN ('open','closed','awarded'))
     )
 )
);


-- 14. RFQ Responses
-- Vendor sees own.
-- Company sees all responses for their RFQ.
CREATE POLICY rfq_responses_select ON public.rfq_responses
FOR SELECT
USING (
 public.is_active_member(vendor_id)
 OR EXISTS (
   SELECT 1 FROM public.rfqs r
   WHERE r.id = rfq_responses.rfq_id
     AND public.is_active_member(r.company_id)
 )
);
