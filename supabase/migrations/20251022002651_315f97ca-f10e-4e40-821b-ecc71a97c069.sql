
-- ============================================================================
-- FIX companies_public_info VIEW - Add widget_enabled
-- ============================================================================

DROP VIEW IF EXISTS public.companies_public_info CASCADE;

CREATE OR REPLACE VIEW public.companies_public_info 
WITH (security_invoker=true)
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
  widget_enabled,
  widget_show_phone,
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

COMMENT ON VIEW public.companies_public_info IS 
  'Public view for company landingpages - uses security_invoker for better security';

-- Update get_public_company_info function signature
DROP FUNCTION IF EXISTS public.get_public_company_info(text);

CREATE OR REPLACE FUNCTION public.get_public_company_info(company_slug_param text)
 RETURNS TABLE(
   id uuid, 
   name text, 
   company_slug text, 
   logo_url text, 
   primary_color text, 
   landingpage_title text, 
   landingpage_hero_text text, 
   landingpage_description text, 
   widget_button_text text, 
   widget_size text, 
   widget_enabled boolean,
   widget_show_phone boolean,
   business_hours jsonb, 
   postal_code text, 
   city text, 
   phone text, 
   email text
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    widget_enabled,
    widget_show_phone,
    business_hours,
    postal_code,
    city,
    phone,
    email
  FROM public.companies_public_info
  WHERE company_slug = company_slug_param
    AND landingpage_enabled = true
  LIMIT 1;
$function$;
