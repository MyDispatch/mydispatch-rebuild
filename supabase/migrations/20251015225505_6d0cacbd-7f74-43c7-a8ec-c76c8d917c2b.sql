-- ==================================================================================
-- DATENBANK-MIGRATION V18.1: VOLLSTÄNDIGE FORMULARFELDER (FIXED)
-- ==================================================================================
-- Dokumentation: FORMS_FIELD_REQUIREMENTS.md
-- Datum: 15.10.2025
-- Status: FINAL
-- ==================================================================================

-- ==================================================================================
-- 1. DRIVERS TABELLE ERWEITERN
-- ==================================================================================

-- Persönliche Daten
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS salutation salutation_type;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS title TEXT;

-- Adresse (Google Places Autocomplete)
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS street TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS street_number TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS city TEXT;

-- Führerscheindaten
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_expiry_date DATE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_classes TEXT[];

-- Profilbild
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Automatische Adress-Generierung (Trigger)
CREATE OR REPLACE FUNCTION generate_driver_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.street IS NOT NULL AND NEW.street_number IS NOT NULL 
     AND NEW.postal_code IS NOT NULL AND NEW.city IS NOT NULL THEN
    NEW.address := NEW.street || ' ' || NEW.street_number || ', ' || NEW.postal_code || ' ' || NEW.city;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_driver_address ON drivers;
CREATE TRIGGER trigger_generate_driver_address
  BEFORE INSERT OR UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION generate_driver_address();

-- ==================================================================================
-- 2. VEHICLES TABELLE ERWEITERN
-- ==================================================================================

-- Fahrzeugdaten
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tuev_expiry_date DATE;

-- Erweiterte Fahrzeugdaten
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vin TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fuel_type TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS seats INTEGER DEFAULT 4;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS mileage INTEGER DEFAULT 0;

-- KFZ-Versicherung
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_company TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_start_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_end_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_type TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_annual_premium NUMERIC(10,2) DEFAULT 0;

-- Wartung & Service
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS last_service_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS next_service_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS service_interval_km INTEGER DEFAULT 15000;

-- Profilbild
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Constraints (nur hinzufügen wenn nicht existiert)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vehicles_year_check'
  ) THEN
    ALTER TABLE vehicles ADD CONSTRAINT vehicles_year_check 
      CHECK (year IS NULL OR (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vehicles_vin_length_check'
  ) THEN
    ALTER TABLE vehicles ADD CONSTRAINT vehicles_vin_length_check 
      CHECK (vin IS NULL OR LENGTH(vin) <= 17);
  END IF;
END $$;

-- ==================================================================================
-- 3. CUSTOMERS TABELLE ERWEITERN
-- ==================================================================================

-- Kundentyp
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_type TEXT DEFAULT 'Privatkunde';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tax_id TEXT;

-- Adresse (Google Places Autocomplete)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS street TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS street_number TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS city TEXT;

-- Rechnungsadresse (optional, falls abweichend)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_street TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_street_number TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_postal_code TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_city TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- Zahlungsinformationen
ALTER TABLE customers ADD COLUMN IF NOT EXISTS payment_term_days INTEGER DEFAULT 14;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5,2) DEFAULT 0;

-- Automatische Adress-Generierung (Trigger)
CREATE OR REPLACE FUNCTION generate_customer_address()
RETURNS TRIGGER AS $$
BEGIN
  -- Hauptadresse
  IF NEW.street IS NOT NULL AND NEW.street_number IS NOT NULL 
     AND NEW.postal_code IS NOT NULL AND NEW.city IS NOT NULL THEN
    NEW.address := NEW.street || ' ' || NEW.street_number || ', ' || NEW.postal_code || ' ' || NEW.city;
  END IF;
  
  -- Rechnungsadresse
  IF NEW.billing_street IS NOT NULL AND NEW.billing_street_number IS NOT NULL 
     AND NEW.billing_postal_code IS NOT NULL AND NEW.billing_city IS NOT NULL THEN
    NEW.billing_address := NEW.billing_street || ' ' || NEW.billing_street_number || ', ' || NEW.billing_postal_code || ' ' || NEW.billing_city;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_customer_address ON customers;
CREATE TRIGGER trigger_generate_customer_address
  BEFORE INSERT OR UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION generate_customer_address();

-- ==================================================================================
-- 4. INDEXES FÜR PERFORMANCE
-- ==================================================================================

-- Drivers
CREATE INDEX IF NOT EXISTS idx_drivers_license_expiry ON drivers (license_expiry_date);
CREATE INDEX IF NOT EXISTS idx_drivers_salutation ON drivers (salutation);

-- Vehicles
CREATE INDEX IF NOT EXISTS idx_vehicles_tuev_expiry ON vehicles (tuev_expiry_date);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles (brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles (year);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON customers (customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers (city);

-- ==================================================================================
-- MIGRATION ABGESCHLOSSEN
-- ==================================================================================
-- Version: V18.1
-- Dokumentation: FORMS_FIELD_REQUIREMENTS.md
-- Status: ✅ VOLLSTÄNDIG
-- ==================================================================================