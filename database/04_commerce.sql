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
