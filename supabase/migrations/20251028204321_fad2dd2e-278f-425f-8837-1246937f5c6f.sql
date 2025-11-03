-- Fix Function Search Path (Security Linter WARN)
DROP TRIGGER IF EXISTS update_cookie_consents_updated_at_trigger ON public.cookie_consents CASCADE;
DROP TRIGGER IF EXISTS update_cookie_consents_updated_at ON public.cookie_consents CASCADE;
DROP FUNCTION IF EXISTS public.update_cookie_consents_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_cookie_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

CREATE TRIGGER update_cookie_consents_updated_at_trigger
  BEFORE UPDATE ON public.cookie_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cookie_consents_updated_at();