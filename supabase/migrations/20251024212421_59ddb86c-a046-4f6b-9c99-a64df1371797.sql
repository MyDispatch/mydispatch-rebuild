-- Fix Security Linter Warnings: Function Search Path Mutable
-- Update trigger functions with proper search_path

-- Fix for update_cookie_consents_updated_at
DROP FUNCTION IF EXISTS update_cookie_consents_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_cookie_consents_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_cookie_consents_updated_at
  BEFORE UPDATE ON public.cookie_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_cookie_consents_updated_at();