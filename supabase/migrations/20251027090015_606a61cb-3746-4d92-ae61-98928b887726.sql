-- ==================================================================================
-- FIX SECURITY WARNING: Function Search Path for update_master_logs_updated_at
-- ==================================================================================
-- Add SET search_path to prevent search_path manipulation attacks
-- ==================================================================================

CREATE OR REPLACE FUNCTION public.update_master_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog';
