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
