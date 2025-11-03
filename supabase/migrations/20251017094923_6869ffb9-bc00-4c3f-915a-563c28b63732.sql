-- ============================================================================
-- FINAL SECURITY FIXES: Remaining function search paths
-- ============================================================================

-- Fix update_company_location_timestamp
CREATE OR REPLACE FUNCTION public.update_company_location_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF (NEW.latitude IS DISTINCT FROM OLD.latitude OR 
      NEW.longitude IS DISTINCT FROM OLD.longitude OR
      NEW.street IS DISTINCT FROM OLD.street OR
      NEW.city IS DISTINCT FROM OLD.city) THEN
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Fix get_company_full_address
CREATE OR REPLACE FUNCTION public.get_company_full_address(company_row companies)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $$
BEGIN
  IF company_row.street IS NOT NULL AND company_row.city IS NOT NULL THEN
    RETURN CONCAT_WS(', ',
      CONCAT_WS(' ', company_row.street, company_row.street_number),
      CONCAT_WS(' ', company_row.postal_code, company_row.city),
      CASE WHEN company_row.country_code != 'DE' THEN company_row.country_code ELSE NULL END
    );
  ELSIF company_row.address IS NOT NULL THEN
    RETURN company_row.address;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;