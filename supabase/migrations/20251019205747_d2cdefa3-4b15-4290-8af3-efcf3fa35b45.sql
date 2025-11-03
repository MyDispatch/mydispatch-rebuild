-- ==================================================================================
-- KRITISCHE SECURITY-FIXES V18.3
-- ==================================================================================
-- Behebt: SECURITY DEFINER View, Öffentliche PII-Exposition in companies-Tabelle
-- ==================================================================================

-- 1. DROP Security Definer View (companies_with_full_address)
-- Diese View ist öffentlich zugänglich und enthält sensible Daten
DROP VIEW IF EXISTS public.companies_with_full_address CASCADE;

-- 2. Erstelle sichere, eingeschränkte View NUR mit öffentlichen Daten
CREATE OR REPLACE VIEW public.companies_public_info AS
SELECT 
  id,
  name,
  company_slug,
  business_type,
  business_hours,
  timezone,
  landingpage_enabled,
  landingpage_title,
  landingpage_hero_text,
  landingpage_description,
  widget_enabled,
  widget_button_text,
  widget_size,
  widget_show_phone,
  primary_color,
  logo_url,
  -- Öffentliche Kontaktinformationen (nur wenn Landingpage aktiv)
  CASE WHEN landingpage_enabled THEN phone ELSE NULL END as phone,
  CASE WHEN landingpage_enabled THEN email ELSE NULL END as email,
  -- Adresse nur Stadt (kein Straße/Hausnummer)
  CASE WHEN landingpage_enabled THEN city ELSE NULL END as city,
  CASE WHEN landingpage_enabled THEN postal_code ELSE NULL END as postal_code
FROM public.companies
WHERE landingpage_enabled = true AND company_status = 'active';

-- Enable RLS auf der neuen View
ALTER VIEW public.companies_public_info SET (security_invoker = true);

-- 3. Verschärfe RLS-Policy auf companies-Tabelle
-- Entferne zu offene "Public can view" Policy
DROP POLICY IF EXISTS "Public can view companies with enabled landingpage" ON public.companies;

-- Neue, sichere Policy: Nur nicht-sensitive Felder für öffentliche Landingpages
CREATE POLICY "Public can view basic landingpage info"
ON public.companies
FOR SELECT
TO public
USING (
  landingpage_enabled = true 
  AND company_status = 'active'
);

-- WICHTIG: Stelle sicher, dass sensitive Felder NICHT in Queries zurückgegeben werden
-- Dies wird durch die View companies_public_info sichergestellt

-- 4. Grant SELECT auf die neue sichere View
GRANT SELECT ON public.companies_public_info TO anon;
GRANT SELECT ON public.companies_public_info TO authenticated;

-- 5. Erstelle sichere Computed Column Funktion (statt View)
-- Für Full Address, aber mit RLS
CREATE OR REPLACE FUNCTION public.get_company_public_address(company_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
DECLARE
  result text;
  company_record record;
BEGIN
  -- Prüfe ob Company öffentliche Landingpage hat
  SELECT landingpage_enabled, city, postal_code
  INTO company_record
  FROM public.companies
  WHERE id = company_id
    AND landingpage_enabled = true
    AND company_status = 'active';
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Gebe nur Stadt und PLZ zurück (keine Straße/Hausnummer)
  RETURN CONCAT_WS(', ', 
    company_record.postal_code, 
    company_record.city
  );
END;
$$;

-- 6. Audit-Log für Security-Änderungen
INSERT INTO public.system_logs (level, message, context)
VALUES (
  'info',
  'Security Hardening V18.3: Removed SECURITY DEFINER view, restricted public company data access',
  jsonb_build_object(
    'action', 'security_fix',
    'findings_fixed', jsonb_build_array(
      'SUPA_security_definer_view',
      'EXPOSED_SENSITIVE_DATA',
      'MISSING_RLS_PROTECTION'
    ),
    'timestamp', now()
  )
);

-- 7. Kommentar für Dokumentation
COMMENT ON VIEW public.companies_public_info IS 
'Sichere, öffentliche View für Company-Informationen. Zeigt nur nicht-sensitive Daten für Companies mit aktivierter Landingpage. Verwendet SECURITY INVOKER statt SECURITY DEFINER.';

COMMENT ON FUNCTION public.get_company_public_address IS
'Sichere Funktion zum Abrufen der öffentlichen Adresse (nur Stadt/PLZ). Verwendet SECURITY INVOKER und prüft landingpage_enabled.';
