-- =====================================================================
-- V5.0 SECURITY FIX: Function Search Path
-- =====================================================================

-- Fix: update_automation_patterns_timestamp() needs SET search_path
CREATE OR REPLACE FUNCTION update_automation_patterns_timestamp()
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