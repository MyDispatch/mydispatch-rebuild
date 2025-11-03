-- ==================================================================================
-- V18.5.13: FIX SECURITY WARNINGS - Function Search Path
-- ==================================================================================
-- Setze expliziten search_path für alle neuen Funktionen
-- ==================================================================================

-- Fix: update_pricing_tiers_timestamp() mit search_path
DROP FUNCTION IF EXISTS public.update_pricing_tiers_timestamp() CASCADE;

CREATE OR REPLACE FUNCTION public.update_pricing_tiers_timestamp()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger neu erstellen
CREATE TRIGGER trigger_pricing_tiers_updated_at
  BEFORE UPDATE ON public.pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_pricing_tiers_timestamp();