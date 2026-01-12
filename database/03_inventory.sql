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
