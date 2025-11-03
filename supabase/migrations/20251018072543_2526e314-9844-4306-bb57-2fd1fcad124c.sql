-- ==================================================================================
-- PUBLIC LANDINGPAGE ACCESS FIX V18.2.30
-- ==================================================================================
-- Problem: Landing Pages sind öffentlich, aber RLS blockiert SELECT ohne Auth
-- Lösung: Neue Policy für öffentlichen READ-Zugriff auf Companies mit landingpage_enabled
-- ==================================================================================

-- Neue Policy: Öffentlicher Zugriff auf Landing Pages
CREATE POLICY "Public can view companies with enabled landingpage"
ON public.companies
FOR SELECT
TO public
USING (landingpage_enabled = true);

-- ==================================================================================
-- RESERVED SLUGS CONSTRAINT
-- ==================================================================================
-- Verhindert, dass System-URLs als company_slug verwendet werden
-- ==================================================================================

-- Check Constraint für reserved slugs
ALTER TABLE public.companies
ADD CONSTRAINT company_slug_not_reserved CHECK (
  company_slug NOT IN (
    'home', 'auth', 'dashboard', 'auftraege', 'angebote', 'rechnungen',
    'kunden', 'fahrer', 'fahrzeuge', 'partner', 'schichtzettel',
    'kommunikation', 'office', 'dokumente', 'kostenstellen', 'statistiken',
    'unternehmen', 'einstellungen', 'landingpage-konfigurator', 
    'driver-tracking', 'agent-dashboard', 'master', 'impressum',
    'datenschutz', 'agb', 'terms', 'nexify-support', 'pricing', 'faq',
    'docs', 'contact', 'portal', 'api', 'admin', 'login', 'signup',
    'settings', 'help', 'support'
  )
);

COMMENT ON CONSTRAINT company_slug_not_reserved ON public.companies IS 
'Verhindert Kollisionen zwischen Unternehmens-Slugs und System-URLs';

-- ==================================================================================
-- SLUG VALIDATION FUNCTION (für bessere Fehlermeldungen)
-- ==================================================================================

CREATE OR REPLACE FUNCTION validate_company_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Slug Format-Validierung
  IF NEW.company_slug !~ '^[a-z0-9-]+$' THEN
    RAISE EXCEPTION 'Ungültiger Slug-Format. Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt.';
  END IF;
  
  -- Mindestlänge
  IF LENGTH(NEW.company_slug) < 3 THEN
    RAISE EXCEPTION 'Slug muss mindestens 3 Zeichen lang sein.';
  END IF;
  
  -- Maximal-Länge
  IF LENGTH(NEW.company_slug) > 50 THEN
    RAISE EXCEPTION 'Slug darf maximal 50 Zeichen lang sein.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für Slug-Validierung
DROP TRIGGER IF EXISTS validate_company_slug_trigger ON public.companies;
CREATE TRIGGER validate_company_slug_trigger
  BEFORE INSERT OR UPDATE OF company_slug ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION validate_company_slug();

COMMENT ON FUNCTION validate_company_slug() IS 
'Validiert company_slug Format: nur a-z, 0-9, Bindestriche, 3-50 Zeichen';