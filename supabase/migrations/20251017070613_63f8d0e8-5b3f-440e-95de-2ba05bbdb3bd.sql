-- ==================================================================================
-- SECURITY FIX: LOCATION-BASED SYSTEM V18.2.8
-- ==================================================================================
-- Behebt Security Definer View Warning & Function Search Path Mutable
-- ==================================================================================

-- 1. DROP unsichere View und neu erstellen OHNE SECURITY DEFINER
DROP VIEW IF EXISTS companies_with_full_address;

CREATE OR REPLACE VIEW companies_with_full_address AS
SELECT 
  c.*,
  get_company_full_address(c) AS full_address,
  CASE 
    WHEN c.latitude IS NOT NULL AND c.longitude IS NOT NULL THEN true 
    ELSE false 
  END AS has_geocoded_location
FROM companies c;

-- 2. FIX Function Search Path - Setze IMMUTABLE und SECURITY INVOKER
CREATE OR REPLACE FUNCTION get_company_full_address(company_row companies)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql IMMUTABLE SECURITY INVOKER SET search_path = public;

-- 3. FIX Trigger Function - Setze SECURITY INVOKER
CREATE OR REPLACE FUNCTION update_company_location_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.latitude IS DISTINCT FROM OLD.latitude OR 
      NEW.longitude IS DISTINCT FROM OLD.longitude OR
      NEW.street IS DISTINCT FROM OLD.street OR
      NEW.city IS DISTINCT FROM OLD.city) THEN
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 4. Recreate Trigger
DROP TRIGGER IF EXISTS trigger_update_company_location_timestamp ON companies;
CREATE TRIGGER trigger_update_company_location_timestamp
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_company_location_timestamp();