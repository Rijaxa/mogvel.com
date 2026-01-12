-- =========================================================
-- 00_init.sql
-- Extensions and Global Settings
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

SET timezone = 'Asia/Tbilisi';
-- =========================================================
-- 01_common.sql
-- Common Functions and Utilities
-- =========================================================

-- Trigger function to update timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 NEW.updated_at = now();
 RETURN NEW;
END;
$$;
-- =========================================================
-- 02_auth_core.sql
-- Organizations, Users, Roles, Locations
-- =========================================================

-- 1. Organizations
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('company','vendor')),
    name text NOT NULL,
    legal_name text,
    tax_id text,
    country text,
    city text,
    address text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','pending_verification')),
    is_listed boolean NOT NULL DEFAULT true,
    verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected')),
    support_phone text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Profiles (Extends auth.users)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    job_title text,
    phone text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Roles
CREATE TABLE public.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    scope text NOT NULL CHECK (scope IN ('company','vendor')),
    name text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(organization_id, name)
);

-- 4. Organization Members
CREATE TABLE public.organization_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','active','disabled')),
    invited_email text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

CREATE TRIGGER trg_org_members_updated_at
BEFORE UPDATE ON public.organization_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Role Permissions
CREATE TABLE public.role_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    resource text NOT NULL,
    action text NOT NULL,
    allowed boolean NOT NULL DEFAULT true,
    UNIQUE(role_id, resource, action)
);

-- 6. Locations
CREATE TABLE public.locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    type text CHECK (type IN ('hq','warehouse','office','branch')),
    address text,
    created_at timestamptz NOT NULL DEFAULT now()
);


-- =========================================================
-- Helper Functions (Depend on Core Tables)
-- =========================================================

-- Check if user is an active member of specific org
CREATE OR REPLACE FUNCTION public.is_active_member(p_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
 SELECT EXISTS (
   SELECT 1
   FROM public.organization_members m
   WHERE m.organization_id = p_company_id
     AND m.user_id = auth.uid()
     AND m.status = 'active'
 );
$$;

-- Check if user belongs to ANY 'company' type organization
CREATE OR REPLACE FUNCTION public.is_company_user()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
 SELECT EXISTS (
   SELECT 1
   FROM public.organization_members m
   JOIN public.organizations o ON o.id = m.organization_id
   WHERE m.user_id = auth.uid()
     AND m.status = 'active'
     AND o.type = 'company'
 );
$$;

-- Check if user belongs to ANY 'vendor' type organization
CREATE OR REPLACE FUNCTION public.is_vendor_user()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
 SELECT EXISTS (
   SELECT 1
   FROM public.organization_members m
   JOIN public.organizations o ON o.id = m.organization_id
   WHERE m.user_id = auth.uid()
     AND m.status = 'active'
     AND o.type = 'vendor'
 );
$$;

-- Assert Org Type (for triggers)
CREATE OR REPLACE FUNCTION public.assert_org_type(p_org_id uuid, p_expected text)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE t text;
BEGIN
 SELECT type::text INTO t FROM public.organizations WHERE id = p_org_id;
 IF t IS NULL THEN
   RAISE EXCEPTION 'Organization % not found', p_org_id;
 END IF;
 IF t <> p_expected THEN
   RAISE EXCEPTION 'Organization % must be %, got %', p_org_id, p_expected, t;
 END IF;
END;
$$;
-- =========================================================
-- 03_inventory.sql
-- Products, Pricing, Stock
-- =========================================================

-- 1. Products
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    sku text,
    name text NOT NULL,
    description text,
    category text,
    sub_category text,
    unit_of_measure text,
    min_order_quantity int NOT NULL DEFAULT 1 CHECK (min_order_quantity >= 1),
    lead_time_days int NOT NULL DEFAULT 0 CHECK (lead_time_days >= 0),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enforce vendor_id is actually a vendor
CREATE OR REPLACE FUNCTION public.enforce_products_vendor()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 IF NEW.vendor_id IS NULL THEN
   RAISE EXCEPTION 'products.vendor_id cannot be NULL';
 END IF;
 PERFORM public.assert_org_type(NEW.vendor_id, 'vendor');
 RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_vendor
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.enforce_products_vendor();


-- 2. Product Pricing
CREATE TABLE public.product_pricing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    currency text NOT NULL DEFAULT 'GEL',
    base_price numeric(12,2) NOT NULL CHECK (base_price >= 0),
    price_min numeric(12,2) CHECK (price_min >= 0),
    price_max numeric(12,2) CHECK (price_max >= 0),
    volume_threshold int,
    company_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE, -- Specific price for a specific buyer company
    valid_from date NOT NULL DEFAULT CURRENT_DATE,
    valid_to date,
    CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

CREATE INDEX idx_pricing_product_company ON public.product_pricing(product_id, company_id);


-- 3. Product Stock
CREATE TABLE public.product_stock (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    current_stock numeric NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    reserved_stock numeric NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    stock_status text NOT NULL DEFAULT 'medium' CHECK (stock_status IN ('high','medium','low','critical')),
    reorder_point numeric CHECK (reorder_point IS NULL OR reorder_point >= 0),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(product_id, location_id)
);

-- Enforce that the stock location belongs to the product's vendor
CREATE OR REPLACE FUNCTION public.enforce_product_stock_location_vendor()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE p_vendor uuid;
DECLARE l_org uuid;
BEGIN
 IF NEW.location_id IS NULL THEN
   RAISE EXCEPTION 'product_stock.location_id cannot be NULL';
 END IF;

 SELECT vendor_id INTO p_vendor FROM public.products WHERE id = NEW.product_id;
 SELECT organization_id INTO l_org FROM public.locations WHERE id = NEW.location_id;

 IF l_org <> p_vendor THEN
   RAISE EXCEPTION 'product_stock.location_id must belong to the vendor who owns the product';
 END IF;

 RETURN NEW;
END;
$$;

CREATE TRIGGER trg_product_stock_location_vendor
BEFORE INSERT OR UPDATE ON public.product_stock
FOR EACH ROW EXECUTE FUNCTION public.enforce_product_stock_location_vendor();

CREATE INDEX idx_product_stock_product_location ON public.product_stock(product_id, location_id);
-- =========================================================
-- 04_commerce.sql
-- Relations, Contracts, Orders
-- =========================================================

-- 1. Company <-> Vendor Links (Partnerships)
CREATE TABLE public.company_vendor_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    vendor_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'invited' CHECK (status IN ('active','invited','blocked')),
    contract_id uuid, -- Can link to a contract if needed later, but circular dep risk if FK. Leaving as UUID for now or just metadata.
    rating numeric(2,1),
    price_stability text,
    delivery_sla_percent numeric(5,2),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(company_id, vendor_id)
);

CREATE OR REPLACE FUNCTION public.enforce_cvl_types()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 PERFORM public.assert_org_type(NEW.company_id, 'company');
 PERFORM public.assert_org_type(NEW.vendor_id, 'vendor');
 RETURN NEW;
END;
$$;

CREATE TRIGGER trg_cvl_types
BEFORE INSERT OR UPDATE ON public.company_vendor_links
FOR EACH ROW EXECUTE FUNCTION public.enforce_cvl_types();

CREATE INDEX idx_cvl_company_vendor_status ON public.company_vendor_links(company_id, vendor_id, status);


-- 2. Contracts
CREATE TABLE public.contracts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text,
    vendor_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
    company_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
    valid_from date,
    valid_to date,
    file_url text,
    status text DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Note: We could enforce types on contracts too, but sometimes contracts might be drafted without one side fully set? 
-- Assuming strict B2B for now.
CREATE OR REPLACE FUNCTION public.enforce_contract_types()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 IF NEW.company_id IS NOT NULL THEN
    PERFORM public.assert_org_type(NEW.company_id, 'company');
 END IF;
 IF NEW.vendor_id IS NOT NULL THEN
    PERFORM public.assert_org_type(NEW.vendor_id, 'vendor');
 END IF;
 RETURN NEW;
END;
$$;

CREATE TRIGGER trg_contract_types
BEFORE INSERT OR UPDATE ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.enforce_contract_types();


-- 3. Orders
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number text UNIQUE NOT NULL,
    company_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    vendor_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL, -- Delivery location (usually company's)
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','shipped','delivered','cancelled')),
    urgency text NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low','medium','urgent')),
    currency text NOT NULL DEFAULT 'GEL',
    subtotal numeric(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    discount_total numeric(12,2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
    tax_total numeric(12,2) NOT NULL DEFAULT 0 CHECK (tax_total >= 0),
    grand_total numeric(12,2) NOT NULL DEFAULT 0 CHECK (grand_total >= 0),
    placed_at timestamptz NOT NULL DEFAULT now(),
    expected_delivery_at timestamptz,
    delivered_at timestamptz,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.enforce_orders_types()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 PERFORM public.assert_org_type(NEW.company_id, 'company');
 PERFORM public.assert_org_type(NEW.vendor_id, 'vendor');
 RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_types
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_orders_types();

CREATE INDEX idx_orders_company ON public.orders(company_id);
CREATE INDEX idx_orders_vendor ON public.orders(vendor_id);
-- =========================================================
-- 05_rfq.sql
-- Requests for Quotation
-- =========================================================

-- 1. RFQs
CREATE TABLE public.rfqs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title text NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','open','closed','awarded')),
    deadline timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_rfqs_updated_at
BEFORE UPDATE ON public.rfqs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enforce company_id is a company
CREATE OR REPLACE FUNCTION public.enforce_rfq_types()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 PERFORM public.assert_org_type(NEW.company_id, 'company');
 RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rfq_types
BEFORE INSERT OR UPDATE ON public.rfqs
FOR EACH ROW EXECUTE FUNCTION public.enforce_rfq_types();


-- 2. RFQ Items (What is requested)
CREATE TABLE public.rfq_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    product_name text NOT NULL, -- Text description or link to product if needed later
    quantity numeric,
    target_price numeric(12,2)
);

CREATE INDEX idx_rfq_items_rfq ON public.rfq_items(rfq_id);


-- 3. RFQ Responses (Vendor bids)
CREATE TABLE public.rfq_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    vendor_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    price_quote numeric(12,2),
    comments text,
    responded_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(rfq_id, vendor_id)
);

CREATE OR REPLACE FUNCTION public.enforce_rfq_response_types()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 PERFORM public.assert_org_type(NEW.vendor_id, 'vendor');
 RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rfq_response_types
BEFORE INSERT OR UPDATE ON public.rfq_responses
FOR EACH ROW EXECUTE FUNCTION public.enforce_rfq_response_types();

CREATE INDEX idx_rfq_responses_rfq_vendor ON public.rfq_responses(rfq_id, vendor_id);
CREATE INDEX idx_rfqs_company_status ON public.rfqs(company_id, status);
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
