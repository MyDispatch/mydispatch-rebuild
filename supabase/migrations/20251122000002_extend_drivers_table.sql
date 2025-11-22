-- ========================================
-- Task 11: Fahrer - P-Schein & Adressverwaltung
-- ========================================
-- Adds P-Schein (Personenbeförderungsschein) management and address fields
-- - p_schein_issue_date (Erteilungsdatum)
-- - p_schein_expiry_date (Ablaufdatum)
-- - p_schein_number (Dokumentennummer)
-- - p_schein_document_url (Upload)
-- - address_street, address_postal_code, address_city (Adressverwaltung)

ALTER TABLE public.drivers
ADD COLUMN IF NOT EXISTS p_schein_issue_date DATE,
ADD COLUMN IF NOT EXISTS p_schein_expiry_date DATE,
ADD COLUMN IF NOT EXISTS p_schein_number TEXT,
ADD COLUMN IF NOT EXISTS p_schein_document_url TEXT,
ADD COLUMN IF NOT EXISTS address_street TEXT,
ADD COLUMN IF NOT EXISTS address_postal_code TEXT,
ADD COLUMN IF NOT EXISTS address_city TEXT;

-- Comments for documentation
COMMENT ON COLUMN public.drivers.p_schein_issue_date IS 'Date when P-Schein (Personenbeförderungsschein) was issued';
COMMENT ON COLUMN public.drivers.p_schein_expiry_date IS 'Expiry date of P-Schein - automatic reminders sent 30/60/90 days before';
COMMENT ON COLUMN public.drivers.p_schein_number IS 'P-Schein document number (unique identifier)';
COMMENT ON COLUMN public.drivers.p_schein_document_url IS 'URL to uploaded P-Schein document in Supabase Storage';
COMMENT ON COLUMN public.drivers.address_street IS 'Driver street address';
COMMENT ON COLUMN public.drivers.address_postal_code IS 'Driver postal code (PLZ)';
COMMENT ON COLUMN public.drivers.address_city IS 'Driver city';

-- Constraints for data integrity
ALTER TABLE public.drivers
ADD CONSTRAINT check_p_schein_expiry_future CHECK (p_schein_expiry_date IS NULL OR p_schein_expiry_date >= CURRENT_DATE),
ADD CONSTRAINT check_postal_code_format CHECK (address_postal_code IS NULL OR address_postal_code ~ '^\d{5}$');

-- Index for expiry monitoring (used by auto-reminder cron job)
CREATE INDEX IF NOT EXISTS idx_drivers_p_schein_expiry ON public.drivers(p_schein_expiry_date)
WHERE p_schein_expiry_date IS NOT NULL AND archived = false;

-- Index for address search
CREATE INDEX IF NOT EXISTS idx_drivers_address ON public.drivers(address_postal_code, address_city)
WHERE address_postal_code IS NOT NULL;
