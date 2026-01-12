-- =========================================================
-- Mogvel Supabase Repair Migration
-- Canonical columns:
--   - company_id (NOT buyer_company_id)
--   - vendor_id
--   - product_stock.location_id
-- Fixes repeated 42703 missing-column errors by ALTERing existing tables
-- =========================================================


-- =========================
-- 01_extensions.sql
-- =========================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
SET timezone = 'Asia/Tbilisi';


-- =========================
-- 02_helpers.sql
-- =========================


CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 NEW.updated_at = now();
 RETURN NEW;
END;
$$;


-- Keep parameter name EXACTLY p_company_id (Supabase 42P13 issue)
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


-- Org type assert (used by enforcement triggers)
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


-- =========================
-- 03_core_tables.sql (create if missing)
-- =========================


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='organizations') THEN
   CREATE TABLE public.organizations (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     type text NOT NULL CHECK (type IN ('company','vendor')),
     name text NOT NULL,
     legal_name text,
     tax_id text,
     country text,
     city text,
     address text,
     status text NOT NULL DEFAULT 'active'
       CHECK (status IN ('active','suspended','pending_verification')),
     created_at timestamptz NOT NULL DEFAULT now(),
     updated_at timestamptz NOT NULL DEFAULT now()
   );
 END IF;
END$$;


ALTER TABLE public.organizations
 ADD COLUMN IF NOT EXISTS is_listed boolean NOT NULL DEFAULT true,
 ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'pending'
   CHECK (verification_status IN ('pending','verified','rejected')),
 ADD COLUMN IF NOT EXISTS support_phone text;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_organizations_updated_at') THEN
   CREATE TRIGGER trg_organizations_updated_at
   BEFORE UPDATE ON public.organizations
   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 END IF;
END$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='profiles') THEN
   CREATE TABLE public.profiles (
     id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     full_name text,
     job_title text,
     phone text,
     created_at timestamptz NOT NULL DEFAULT now(),
     updated_at timestamptz NOT NULL DEFAULT now()
   );
 END IF;
END$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_profiles_updated_at') THEN
   CREATE TRIGGER trg_profiles_updated_at
   BEFORE UPDATE ON public.profiles
   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 END IF;
END$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='roles') THEN
   CREATE TABLE public.roles (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
     scope text NOT NULL CHECK (scope IN ('company','vendor')),
     name text NOT NULL,
     description text,
     created_at timestamptz NOT NULL DEFAULT now(),
     UNIQUE(organization_id, name)
   );
 END IF;
END$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='organization_members') THEN
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
 END IF;
END$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_org_members_updated_at') THEN
   CREATE TRIGGER trg_org_members_updated_at
   BEFORE UPDATE ON public.organization_members
   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 END IF;
END$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='role_permissions') THEN
   CREATE TABLE public.role_permissions (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
     resource text NOT NULL,
     action text NOT NULL,
     allowed boolean NOT NULL DEFAULT true,
     UNIQUE(role_id, resource, action)
   );
 END IF;
END$$;


-- Unified locations
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='locations') THEN
   CREATE TABLE public.locations (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
     name text NOT NULL,
     type text CHECK (type IN ('hq','warehouse','office','branch')),
     address text,
     created_at timestamptz NOT NULL DEFAULT now()
   );
 END IF;
END$$;


-- =========================
-- 04_business_tables.sql (create if missing)
-- =========================


-- Products (must have vendor_id)
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='products') THEN
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
 END IF;
END$$;


ALTER TABLE public.products
 ADD COLUMN IF NOT EXISTS vendor_id uuid;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_products_updated_at') THEN
   CREATE TRIGGER trg_products_updated_at
   BEFORE UPDATE ON public.products
   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 END IF;
END$$;


-- Product pricing
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='product_pricing') THEN
   CREATE TABLE public.product_pricing (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
     currency text NOT NULL DEFAULT 'GEL',
     base_price numeric(12,2) NOT NULL CHECK (base_price >= 0),
     price_min numeric(12,2) CHECK (price_min >= 0),
     price_max numeric(12,2) CHECK (price_max >= 0),
     volume_threshold int,
     company_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
     valid_from date NOT NULL DEFAULT CURRENT_DATE,
     valid_to date,
     CHECK (valid_to IS NULL OR valid_to >= valid_from)
   );
 END IF;
END$$;


ALTER TABLE public.product_pricing
 ADD COLUMN IF NOT EXISTS company_id uuid;


-- Stock (canonical: location_id)
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='product_stock') THEN
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
 END IF;
END$$;


ALTER TABLE public.product_stock
 ADD COLUMN IF NOT EXISTS location_id uuid;


-- Company↔Vendor link (canonical: company_id + vendor_id)
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='company_vendor_links') THEN
   CREATE TABLE public.company_vendor_links (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     company_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
     vendor_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
     status text NOT NULL DEFAULT 'invited' CHECK (status IN ('active','invited','blocked')),
     contract_id uuid,
     rating numeric(2,1),
     price_stability text,
     delivery_sla_percent numeric(5,2),
     created_at timestamptz NOT NULL DEFAULT now(),
     UNIQUE(company_id, vendor_id)
   );
 END IF;
END$$;


ALTER TABLE public.company_vendor_links
 ADD COLUMN IF NOT EXISTS company_id uuid,
 ADD COLUMN IF NOT EXISTS vendor_id uuid;


-- Contracts (canonical: company_id + vendor_id)
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='contracts') THEN
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
 END IF;
END$$;


ALTER TABLE public.contracts
 ADD COLUMN IF NOT EXISTS vendor_id uuid,
 ADD COLUMN IF NOT EXISTS company_id uuid,
 ADD COLUMN IF NOT EXISTS buyer_company_id uuid;


-- Orders (canonical: company_id + vendor_id)
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='orders') THEN
   CREATE TABLE public.orders (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     order_number text UNIQUE NOT NULL,
     company_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
     vendor_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
     location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
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
 END IF;
END$$;


ALTER TABLE public.orders
 ADD COLUMN IF NOT EXISTS company_id uuid,
 ADD COLUMN IF NOT EXISTS vendor_id uuid,
 ADD COLUMN IF NOT EXISTS buyer_company_id uuid;


-- RFQs (canonical: company_id)
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='rfqs') THEN
   CREATE TABLE public.rfqs (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     company_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
     title text NOT NULL,
     status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','open','closed','awarded')),
     deadline timestamptz,
     created_at timestamptz NOT NULL DEFAULT now(),
     updated_at timestamptz NOT NULL DEFAULT now()
   );
 END IF;
END$$;


ALTER TABLE public.rfqs
 ADD COLUMN IF NOT EXISTS company_id uuid,
 ADD COLUMN IF NOT EXISTS buyer_company_id uuid;


-- RFQ items/responses
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='rfq_items') THEN
   CREATE TABLE public.rfq_items (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
     product_name text NOT NULL,
     quantity numeric,
     target_price numeric(12,2)
   );
 END IF;
END$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
                WHERE n.nspname='public' AND c.relname='rfq_responses') THEN
   CREATE TABLE public.rfq_responses (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
     vendor_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
     price_quote numeric(12,2),
     comments text,
     responded_at timestamptz NOT NULL DEFAULT now(),
     UNIQUE(rfq_id, vendor_id)
   );
 END IF;
END$$;


ALTER TABLE public.rfq_responses
 ADD COLUMN IF NOT EXISTS vendor_id uuid;


-- =========================
-- 05_canonicalize_company_id.sql
-- (Replace buyer_company_id -> company_id)
-- =========================


-- Orders: rename if possible, else backfill
DO $$
BEGIN
 IF EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='orders' AND column_name='buyer_company_id'
 ) AND NOT EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='orders' AND column_name='company_id'
 ) THEN
   EXECUTE 'ALTER TABLE public.orders RENAME COLUMN buyer_company_id TO company_id';
 END IF;
END$$;


DO $$
BEGIN
 IF EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='orders' AND column_name='buyer_company_id'
 ) AND EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='orders' AND column_name='company_id'
 ) THEN
   EXECUTE 'UPDATE public.orders SET company_id = buyer_company_id WHERE company_id IS NULL AND buyer_company_id IS NOT NULL';
 END IF;
END$$;


-- RFQs: rename/backfill
DO $$
BEGIN
 IF EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='rfqs' AND column_name='buyer_company_id'
 ) AND NOT EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='rfqs' AND column_name='company_id'
 ) THEN
   EXECUTE 'ALTER TABLE public.rfqs RENAME COLUMN buyer_company_id TO company_id';
 END IF;
END$$;


DO $$
BEGIN
 IF EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='rfqs' AND column_name='buyer_company_id'
 ) AND EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='rfqs' AND column_name='company_id'
 ) THEN
   EXECUTE 'UPDATE public.rfqs SET company_id = buyer_company_id WHERE company_id IS NULL AND buyer_company_id IS NOT NULL';
 END IF;
END$$;


-- Contracts: rename/backfill buyer_company_id -> company_id
DO $$
BEGIN
 IF EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='contracts' AND column_name='buyer_company_id'
 ) AND NOT EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='contracts' AND column_name='company_id'
 ) THEN
   EXECUTE 'ALTER TABLE public.contracts RENAME COLUMN buyer_company_id TO company_id';
 END IF;
END$$;


DO $$
BEGIN
 IF EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='contracts' AND column_name='buyer_company_id'
 ) AND EXISTS (
   SELECT 1 FROM information_schema.columns
   WHERE table_schema='public' AND table_name='contracts' AND column_name='company_id'
 ) THEN
   EXECUTE 'UPDATE public.contracts SET company_id = buyer_company_id WHERE company_id IS NULL AND buyer_company_id IS NOT NULL';
 END IF;
END$$;


-- =========================
-- 06_enforcement_triggers.sql
-- =========================


-- products.vendor_id must be vendor
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


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_products_vendor') THEN
   CREATE TRIGGER trg_products_vendor
   BEFORE INSERT OR UPDATE ON public.products
   FOR EACH ROW EXECUTE FUNCTION public.enforce_products_vendor();
 END IF;
END$$;


-- company_vendor_links types
CREATE OR REPLACE FUNCTION public.enforce_cvl_types()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 IF NEW.company_id IS NULL OR NEW.vendor_id IS NULL THEN
   RAISE EXCEPTION 'company_vendor_links.company_id and vendor_id cannot be NULL';
 END IF;
 PERFORM public.assert_org_type(NEW.company_id, 'company');
 PERFORM public.assert_org_type(NEW.vendor_id, 'vendor');
 RETURN NEW;
END;
$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_cvl_types') THEN
   CREATE TRIGGER trg_cvl_types
   BEFORE INSERT OR UPDATE ON public.company_vendor_links
   FOR EACH ROW EXECUTE FUNCTION public.enforce_cvl_types();
 END IF;
END$$;


-- orders types
CREATE OR REPLACE FUNCTION public.enforce_orders_types()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 IF NEW.company_id IS NULL OR NEW.vendor_id IS NULL THEN
   RAISE EXCEPTION 'orders.company_id and vendor_id cannot be NULL';
 END IF;
 PERFORM public.assert_org_type(NEW.company_id, 'company');
 PERFORM public.assert_org_type(NEW.vendor_id, 'vendor');
 RETURN NEW;
END;
$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_orders_types') THEN
   CREATE TRIGGER trg_orders_types
   BEFORE INSERT OR UPDATE ON public.orders
   FOR EACH ROW EXECUTE FUNCTION public.enforce_orders_types();
 END IF;
END$$;


-- stock: location must belong to product.vendor_id
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
 IF p_vendor IS NULL THEN
   RAISE EXCEPTION 'Product % not found', NEW.product_id;
 END IF;


 SELECT organization_id INTO l_org FROM public.locations WHERE id = NEW.location_id;
 IF l_org IS NULL THEN
   RAISE EXCEPTION 'Location % not found', NEW.location_id;
 END IF;


 IF l_org <> p_vendor THEN
   RAISE EXCEPTION 'product_stock.location_id must belong to the vendor who owns the product';
 END IF;


 RETURN NEW;
END;
$$;


DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_product_stock_location_vendor') THEN
   CREATE TRIGGER trg_product_stock_location_vendor
   BEFORE INSERT OR UPDATE ON public.product_stock
   FOR EACH ROW EXECUTE FUNCTION public.enforce_product_stock_location_vendor();
 END IF;
END$$;


-- =========================
-- 07_rls.sql
-- =========================


-- Enable RLS
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


-- Drop existing policies on these tables to eliminate broken references
DO $$
DECLARE r record;
BEGIN
 FOR r IN
   SELECT schemaname, tablename, policyname
   FROM pg_policies
   WHERE schemaname='public'
     AND tablename IN (
       'organizations','locations','profiles','organization_members','roles','role_permissions',
       'products','product_pricing','product_stock',
       'company_vendor_links','contracts',
       'orders','rfqs','rfq_items','rfq_responses'
     )
 LOOP
   EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
 END LOOP;
END$$;


-- profiles: self only
CREATE POLICY mogvel_profiles_select_self ON public.profiles
FOR SELECT USING (auth.uid() = id);


CREATE POLICY mogvel_profiles_upd_self ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


CREATE POLICY mogvel_profiles_ins_self ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);


-- members: self only
CREATE POLICY mogvel_org_members_select_self ON public.organization_members
FOR SELECT USING (user_id = auth.uid());


-- roles/permissions readable by members of same org
CREATE POLICY mogvel_roles_select ON public.roles
FOR SELECT USING (public.is_active_member(organization_id));


CREATE POLICY mogvel_role_permissions_select ON public.role_permissions
FOR SELECT USING (
 EXISTS (
   SELECT 1 FROM public.roles r
   WHERE r.id = role_permissions.role_id
     AND public.is_active_member(r.organization_id)
 )
);


-- organizations:
-- - members see their org
-- - company users browse listed vendors
CREATE POLICY mogvel_organizations_select ON public.organizations
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


-- locations: members see their org locations
CREATE POLICY mogvel_locations_select ON public.locations
FOR SELECT USING (public.is_active_member(organization_id));


CREATE POLICY mogvel_locations_insert ON public.locations
FOR INSERT WITH CHECK (public.is_active_member(organization_id));


CREATE POLICY mogvel_locations_update ON public.locations
FOR UPDATE USING (public.is_active_member(organization_id))
WITH CHECK (public.is_active_member(organization_id));


-- company_vendor_links: both sides see links
CREATE POLICY mogvel_cvl_select ON public.company_vendor_links
FOR SELECT
USING (public.is_active_member(company_id) OR public.is_active_member(vendor_id));


-- products:
CREATE POLICY mogvel_products_select ON public.products
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


CREATE POLICY mogvel_products_insert ON public.products
FOR INSERT WITH CHECK (public.is_active_member(vendor_id));


CREATE POLICY mogvel_products_update ON public.products
FOR UPDATE USING (public.is_active_member(vendor_id))
WITH CHECK (public.is_active_member(vendor_id));


-- pricing:
CREATE POLICY mogvel_pricing_select ON public.product_pricing
FOR SELECT
USING (
 EXISTS (
   SELECT 1 FROM public.products p
   WHERE p.id = product_pricing.product_id
     AND public.is_active_member(p.vendor_id)
 )
 OR (company_id IS NOT NULL AND public.is_active_member(company_id))
);


-- stock (location_id canonical):
CREATE POLICY mogvel_product_stock_select ON public.product_stock
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


-- contracts: visible to buyer or vendor members (canonical company_id)
CREATE POLICY mogvel_contracts_select ON public.contracts
FOR SELECT
USING (
 (company_id IS NOT NULL AND public.is_active_member(company_id))
 OR (vendor_id IS NOT NULL AND public.is_active_member(vendor_id))
);


-- orders: visible to buyer or vendor members (canonical company_id)
CREATE POLICY mogvel_orders_select ON public.orders
FOR SELECT
USING (
 public.is_active_member(company_id)
 OR public.is_active_member(vendor_id)
);


CREATE POLICY mogvel_orders_insert ON public.orders
FOR INSERT
WITH CHECK (public.is_active_member(company_id));


CREATE POLICY mogvel_orders_update ON public.orders
FOR UPDATE
USING (public.is_active_member(company_id) OR public.is_active_member(vendor_id))
WITH CHECK (public.is_active_member(company_id) OR public.is_active_member(vendor_id));


-- rfqs: buyer sees own; vendors see open/closed/awarded
CREATE POLICY mogvel_rfqs_select ON public.rfqs
FOR SELECT
USING (
 public.is_active_member(company_id)
 OR (public.is_vendor_user() AND status IN ('open','closed','awarded'))
);


CREATE POLICY mogvel_rfqs_insert ON public.rfqs
FOR INSERT
WITH CHECK (public.is_active_member(company_id));


CREATE POLICY mogvel_rfqs_update ON public.rfqs
FOR UPDATE
USING (public.is_active_member(company_id))
WITH CHECK (public.is_active_member(company_id));


CREATE POLICY mogvel_rfq_items_select ON public.rfq_items
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


CREATE POLICY mogvel_rfq_responses_select ON public.rfq_responses
FOR SELECT
USING (
 public.is_active_member(vendor_id)
 OR EXISTS (
   SELECT 1 FROM public.rfqs r
   WHERE r.id = rfq_responses.rfq_id
     AND public.is_active_member(r.company_id)
 )
);


-- =========================
-- 08_indexes.sql
-- =========================
CREATE INDEX IF NOT EXISTS idx_org_type_status ON public.organizations(type, status);
CREATE INDEX IF NOT EXISTS idx_org_is_listed ON public.organizations(type, is_listed);


CREATE INDEX IF NOT EXISTS idx_locations_org ON public.locations(organization_id);


CREATE INDEX IF NOT EXISTS idx_org_members_org_user ON public.organization_members(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);


CREATE INDEX IF NOT EXISTS idx_products_vendor ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_pricing_product_company ON public.product_pricing(product_id, company_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_product_location ON public.product_stock(product_id, location_id);


CREATE INDEX IF NOT EXISTS idx_cvl_company_vendor_status ON public.company_vendor_links(company_id, vendor_id, status);


CREATE INDEX IF NOT EXISTS idx_orders_company ON public.orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor ON public.orders(vendor_id);


CREATE INDEX IF NOT EXISTS idx_rfqs_company_status ON public.rfqs(company_id, status);
CREATE INDEX IF NOT EXISTS idx_rfq_items_rfq ON public.rfq_items(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_responses_rfq_vendor ON public.rfq_responses(rfq_id, vendor_id);
