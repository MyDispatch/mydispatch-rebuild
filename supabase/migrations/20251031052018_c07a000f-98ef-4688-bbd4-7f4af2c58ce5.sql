-- ==================================================================================
-- SECURITY FIX: Function Search Path for update_marketing_stats_timestamp
-- DATE: 2025-10-31
-- PURPOSE: Fix security linter warning by setting explicit search_path
-- ==================================================================================

CREATE OR REPLACE FUNCTION update_marketing_stats_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;