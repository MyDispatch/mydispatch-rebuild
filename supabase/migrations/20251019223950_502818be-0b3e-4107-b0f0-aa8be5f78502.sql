-- ==================================================================================
-- SECURITY FIX: Add search_path to functions
-- ==================================================================================

-- 1. Fix cleanup_old_archives()
CREATE OR REPLACE FUNCTION public.cleanup_old_archives()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Lösche Dokumente die >2 Jahre archiviert sind
  DELETE FROM documents 
  WHERE archived = true 
  AND archived_at < NOW() - INTERVAL '2 years';
  
  -- Lösche Partner-Verbindungen die >2 Jahre archiviert sind
  DELETE FROM partner_connections 
  WHERE archived = true 
  AND archived_at < NOW() - INTERVAL '2 years';
  
  RAISE NOTICE 'Cleaned up archived documents and partner connections older than 2 years';
END;
$function$;

-- 2. Fix get_company_public_address()
CREATE OR REPLACE FUNCTION public.get_company_public_address(company_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $function$
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
$function$;