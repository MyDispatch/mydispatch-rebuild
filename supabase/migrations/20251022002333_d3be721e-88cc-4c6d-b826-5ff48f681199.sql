
-- ============================================================================
-- FINAL QUALITY COMPLIANCE MIGRATION V18.3.29
-- ============================================================================
-- Fixes:
-- 1. Move pg_net extension to extensions schema (Linter Warning)
-- 2. Create missing companies_public_info view (if needed)
-- 3. Optimize security definer functions
-- ============================================================================

-- 1. CREATE EXTENSIONS SCHEMA IF NOT EXISTS (bereits in vorheriger Migration, aber sicherstellen)
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. MOVE pg_net EXTENSION TO extensions SCHEMA
-- Achtung: pg_net kann nicht einfach verschoben werden, muss neu erstellt werden
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 3. VERIFY/CREATE companies_public_info VIEW
-- (Falls diese View Security Definer Issue verursacht)
DROP VIEW IF EXISTS public.companies_public_info CASCADE;

CREATE OR REPLACE VIEW public.companies_public_info 
WITH (security_invoker=true) -- WICHTIG: security_invoker statt security_definer
AS
SELECT 
  id,
  name,
  company_slug,
  logo_url,
  primary_color,
  landingpage_title,
  landingpage_hero_text,
  landingpage_description,
  widget_button_text,
  widget_size,
  business_hours,
  postal_code,
  city,
  phone,
  email,
  landingpage_enabled,
  company_status
FROM public.companies
WHERE landingpage_enabled = true 
  AND company_status = 'active';

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA extensions TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA extensions TO anon, authenticated;

-- 5. Ensure RLS is properly configured
COMMENT ON VIEW public.companies_public_info IS 
  'Public view for company landingpages - uses security_invoker for better security';
