-- ==================================================================================
-- PHASE 3: FEHLENDE FORM-FELDER HINZUFÜGEN (V33.0) - KORRIGIERT
-- ==================================================================================
-- ✅ 20+ neue Spalten über 6 Tabellen
-- ✅ Alle Felder OPTIONAL (nullable) - keine Breaking Changes
-- ✅ Auto-Generation Trigger für billing_address
-- ==================================================================================

-- customers: Billing-Felder (5 Spalten)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_street TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_street_number TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_postal_code TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_city TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- drivers: P-Schein & Medical-Felder (3 Spalten)
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS p_schein_number TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS p_schein_expiry_date DATE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS medical_certificate_expiry DATE;

-- vehicles: Service & Rental-Felder (6 Spalten)
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS service_interval_km INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS last_service_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS last_service_km INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS rental_rate_daily DECIMAL(10,2);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS rental_rate_weekly DECIMAL(10,2);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS rental_rate_monthly DECIMAL(10,2);

-- documents: Tags & Reminder-Felder (2 Spalten)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;

-- invoices: PDF & Notes-Felder (2 Spalten)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- shifts: Archive-Tracking-Felder (3 Spalten)
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES profiles(id);
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS archive_reason TEXT;

-- Trigger für auto-generierte billing_address (korrekte Syntax)
CREATE OR REPLACE FUNCTION generate_customer_billing_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.billing_street IS NOT NULL AND NEW.billing_street_number IS NOT NULL 
     AND NEW.billing_postal_code IS NOT NULL AND NEW.billing_city IS NOT NULL THEN
    NEW.billing_address := NEW.billing_street || ' ' || NEW.billing_street_number || ', ' 
                          || NEW.billing_postal_code || ' ' || NEW.billing_city;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_customer_billing_address ON customers;
CREATE TRIGGER trg_generate_customer_billing_address
  BEFORE INSERT OR UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION generate_customer_billing_address();