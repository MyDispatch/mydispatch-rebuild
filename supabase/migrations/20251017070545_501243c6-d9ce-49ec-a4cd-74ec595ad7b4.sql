-- ==================================================================================
-- MIGRATION: LOCATION-BASED SYSTEM V18.2.8
-- ==================================================================================
-- Erweitert companies-Tabelle um strukturierte Standort-Daten
-- Basis für Location-Aware Widgets (Wetter, Verkehr, GPS-Zentrum)
-- ==================================================================================

-- 1. Company Location Fields (strukturiert)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS street_number TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6),
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Berlin',
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'DE',
ADD COLUMN IF NOT EXISTS phone_prefix TEXT DEFAULT '+49';

-- 2. Kommentare für Dokumentation
COMMENT ON COLUMN companies.street IS 'Straßenname des Firmenstandorts (z.B. "Maximilianstraße")';
COMMENT ON COLUMN companies.street_number IS 'Hausnummer (z.B. "12a")';
COMMENT ON COLUMN companies.postal_code IS 'Postleitzahl (z.B. "80539")';
COMMENT ON COLUMN companies.city IS 'Stadt (z.B. "München")';
COMMENT ON COLUMN companies.latitude IS 'Breitengrad (Dezimalgrad, WGS84)';
COMMENT ON COLUMN companies.longitude IS 'Längengrad (Dezimalgrad, WGS84)';
COMMENT ON COLUMN companies.timezone IS 'IANA Zeitzone (Standard: Europe/Berlin)';
COMMENT ON COLUMN companies.country_code IS 'ISO 3166-1 Alpha-2 Ländercode (z.B. "DE")';
COMMENT ON COLUMN companies.phone_prefix IS 'Telefonvorwahl (z.B. "+49")';

-- 3. Index für Geo-Queries (Performance)
CREATE INDEX IF NOT EXISTS idx_companies_location 
ON companies (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 4. Funktion: Vollständige Adresse generieren
CREATE OR REPLACE FUNCTION get_company_full_address(company_row companies)
RETURNS TEXT AS $$
BEGIN
  -- Prüfe ob strukturierte Adresse vorhanden
  IF company_row.street IS NOT NULL AND company_row.city IS NOT NULL THEN
    RETURN CONCAT_WS(', ',
      CONCAT_WS(' ', company_row.street, company_row.street_number),
      CONCAT_WS(' ', company_row.postal_code, company_row.city),
      CASE WHEN company_row.country_code != 'DE' THEN company_row.country_code ELSE NULL END
    );
  -- Fallback auf altes address-Feld
  ELSIF company_row.address IS NOT NULL THEN
    RETURN company_row.address;
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. Trigger: Aktualisiere updated_at bei Location-Änderungen
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_company_location_timestamp ON companies;
CREATE TRIGGER trigger_update_company_location_timestamp
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_company_location_timestamp();

-- 6. View: Company mit vollständiger Adresse
CREATE OR REPLACE VIEW companies_with_full_address AS
SELECT 
  c.*,
  get_company_full_address(c) AS full_address,
  CASE 
    WHEN c.latitude IS NOT NULL AND c.longitude IS NOT NULL THEN true 
    ELSE false 
  END AS has_geocoded_location
FROM companies c;