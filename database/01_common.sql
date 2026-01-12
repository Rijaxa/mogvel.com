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
