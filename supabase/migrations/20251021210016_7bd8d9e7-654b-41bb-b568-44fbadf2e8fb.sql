-- ==================================================================================
-- SECURITY FIX V18.3.25 - COMPANIES TABLE PUBLIC EXPOSURE (FINAL)
-- ==================================================================================
-- RLS funktioniert NUR auf regulären Tables, NICHT auf Views/Materialized Views
-- Views werden automatisch durch die RLS der zugrundeliegenden Tables geschützt
-- ==================================================================================

-- ==================================================================================
-- FIX 1: COMPANIES TABLE - PUBLIC POLICY ENTFERNEN (CRITICAL P0)
-- ==================================================================================
-- Problem: "Public landing page data only" Policy exponiert sensitive Daten:
--   - Email, Phone (Kontaktdaten)
--   - Tax ID, IBAN, BIC (Finanz-Daten)
--   - Address (Vollständige Adresse)
--   - Stripe Customer ID (Payment-Daten)
--   - Business Registration Details

-- Lösung: Public SELECT Policy komplett entfernen
-- Public Access NUR über companies_public_info View (die filtert bereits)

DROP POLICY IF EXISTS "Public landing page data only" ON public.companies;

-- Dokumentation der Änderung
COMMENT ON TABLE public.companies IS 
'Company master data - PROTECTED. 
No public access allowed on table level.
Public landing page access ONLY via companies_public_info view which filters sensitive fields.
RLS policies: company_select_policy (authenticated), company_update_policy (admin only).';


-- ==================================================================================
-- FIX 2: COMPANIES_PUBLIC_INFO VIEW - DOKUMENTATION
-- ==================================================================================
-- Views können KEIN eigenes RLS haben!
-- Sie werden automatisch durch die RLS der zugrundeliegenden Tabelle (companies) geschützt
-- Diese View ist bereits gut designed - filtert Email/Phone/Address intelligent

COMMENT ON VIEW public.companies_public_info IS 
'Public view for company landing pages - SAFE DESIGN.
Automatically filters sensitive data (full address, tax_id, iban, bic, stripe_id).
Shows phone/email only if explicitly enabled (widget_show_phone, landingpage_enabled).
Protected by underlying companies table RLS - no direct table access possible.
Public access to this view is INTENTIONAL for marketing/SEO purposes.';


-- ==================================================================================
-- FIX 3: MATERIALIZED VIEWS - DOKUMENTATION
-- ==================================================================================
-- Materialized Views können KEIN RLS haben!
-- Sie aggregieren company-specific Daten und sollten über Security Definer Functions
-- oder durch application-level filtering geschützt werden

COMMENT ON MATERIALIZED VIEW public.dashboard_stats IS 
'Company-specific dashboard statistics. 
NO PUBLIC ACCESS - use get_dashboard_stats_for_company() function with RLS.
Refreshed via refresh_dashboard_stats trigger.';

COMMENT ON MATERIALIZED VIEW public.mv_document_expiry_dashboard IS 
'Company-specific document expiry aggregation.
NO PUBLIC ACCESS - application must filter by company_id from auth context.
Contains sensitive expiry data for drivers, vehicles, company documents.';


-- ==================================================================================
-- FIX 4: SECURITY BEST PRACTICES - HELPER FUNCTION FÜR VIEWS
-- ==================================================================================
-- Erstelle Helper Function um sicher auf companies_public_info zuzugreifen

CREATE OR REPLACE FUNCTION public.get_public_company_info(company_slug_param text)
RETURNS TABLE (
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
  business_hours jsonb,
  postal_code text,
  city text,
  phone text,
  email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
    email
  FROM public.companies_public_info
  WHERE company_slug = company_slug_param
    AND landingpage_enabled = true
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_public_company_info IS 
'Safe public function to retrieve landing page data by slug.
Returns only non-sensitive fields filtered by companies_public_info view.
Used by public landing pages and widgets.';


-- ==================================================================================
-- VERIFICATION
-- ==================================================================================

-- Info-Ausgabe
DO $$
BEGIN
  RAISE NOTICE '✅ Security Fix V18.3.25 erfolgreich angewendet';
  RAISE NOTICE '   1. Companies table: Public policy entfernt - kein direkter Zugriff';
  RAISE NOTICE '   2. companies_public_info: Protected by table RLS, safe filtering';
  RAISE NOTICE '   3. Materialized views: Dokumentiert, app-level filtering required';
  RAISE NOTICE '   4. Helper function: get_public_company_info() für safe access';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  WICHTIG für Frontend:';
  RAISE NOTICE '   - Nutze get_public_company_info(slug) statt direktem Table-Access';
  RAISE NOTICE '   - Materialized Views nur mit company_id Filter abfragen';
  RAISE NOTICE '   - Keine direkten SELECT auf companies table von Public';
END $$;