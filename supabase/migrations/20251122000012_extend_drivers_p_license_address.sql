-- ========================================
-- TASK 6: Fahrer P-Schein & Vollständige Adresse
-- ========================================
-- Erweiterte Fahrer-Verwaltung mit Personenbeförderungsschein
-- und vollständiger Postanschrift

-- ============================================================================
-- PART 1: DRIVERS TABLE - Add Address & P-Schein Fields
-- ============================================================================

ALTER TABLE public.drivers
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS house_number TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Deutschland',

-- Personenbeförderungsschein (P-Schein)
ADD COLUMN IF NOT EXISTS p_license_number TEXT,
ADD COLUMN IF NOT EXISTS p_license_issued_at DATE,
ADD COLUMN IF NOT EXISTS p_license_expires_at DATE,
ADD COLUMN IF NOT EXISTS p_license_document_url TEXT,
ADD COLUMN IF NOT EXISTS p_license_reminder_sent_at TIMESTAMPTZ;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_drivers_postal_code ON public.drivers(postal_code);
CREATE INDEX IF NOT EXISTS idx_drivers_city ON public.drivers(city);
CREATE INDEX IF NOT EXISTS idx_drivers_p_license_expires_at ON public.drivers(p_license_expires_at);

-- Comments
COMMENT ON COLUMN public.drivers.street IS 'Straßenname (z.B. Musterstraße)';
COMMENT ON COLUMN public.drivers.house_number IS 'Hausnummer (z.B. 42, 12a)';
COMMENT ON COLUMN public.drivers.postal_code IS 'Postleitzahl (z.B. 12345)';
COMMENT ON COLUMN public.drivers.city IS 'Stadt/Ort (z.B. Berlin, München)';
COMMENT ON COLUMN public.drivers.country IS 'Land (Standard: Deutschland)';
COMMENT ON COLUMN public.drivers.p_license_number IS 'Personenbeförderungsschein-Nummer';
COMMENT ON COLUMN public.drivers.p_license_issued_at IS 'Erteilungsdatum des P-Scheins';
COMMENT ON COLUMN public.drivers.p_license_expires_at IS 'Ablaufdatum des P-Scheins';
COMMENT ON COLUMN public.drivers.p_license_document_url IS 'URL zum P-Schein-Dokument (Supabase Storage)';
COMMENT ON COLUMN public.drivers.p_license_reminder_sent_at IS 'Zeitstempel der letzten Ablauf-Erinnerung';

-- ============================================================================
-- PART 2: VALIDATION FUNCTIONS
-- ============================================================================

-- Function: Format full address
CREATE OR REPLACE FUNCTION public.format_driver_address(
  p_street TEXT,
  p_house_number TEXT,
  p_postal_code TEXT,
  p_city TEXT,
  p_country TEXT DEFAULT 'Deutschland'
)
RETURNS TEXT AS $$
BEGIN
  RETURN TRIM(
    CONCAT_WS(', ',
      NULLIF(TRIM(CONCAT(p_street, ' ', p_house_number)), ''),
      NULLIF(TRIM(CONCAT(p_postal_code, ' ', p_city)), ''),
      NULLIF(p_country, '')
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.format_driver_address IS 'Formatiert vollständige Fahrer-Adresse';

-- Function: Check if P-Schein is expired
CREATE OR REPLACE FUNCTION public.is_p_license_expired(p_expires_at DATE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_expires_at < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Check if P-Schein expires soon (within X days)
CREATE OR REPLACE FUNCTION public.is_p_license_expiring_soon(
  p_expires_at DATE,
  p_days_ahead INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_expires_at BETWEEN CURRENT_DATE AND (CURRENT_DATE + p_days_ahead);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.is_p_license_expired IS 'Prüft, ob P-Schein abgelaufen ist';
COMMENT ON FUNCTION public.is_p_license_expiring_soon IS 'Prüft, ob P-Schein bald abläuft';

-- ============================================================================
-- PART 3: GET EXPIRING P-LICENSES FUNCTION
-- ============================================================================

-- Function: Get drivers with expiring P-Schein
CREATE OR REPLACE FUNCTION public.get_expiring_p_licenses(
  p_company_id UUID,
  p_days_ahead INTEGER DEFAULT 60
)
RETURNS TABLE (
  driver_id UUID,
  driver_name TEXT,
  p_license_number TEXT,
  p_license_expires_at DATE,
  days_until_expiration INTEGER,
  email TEXT,
  phone TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    format_full_name(d.salutation, d.title, d.first_name, d.last_name),
    d.p_license_number,
    d.p_license_expires_at,
    (d.p_license_expires_at - CURRENT_DATE)::INTEGER,
    d.email,
    d.phone
  FROM public.drivers d
  WHERE d.company_id = p_company_id
    AND d.active = true
    AND d.p_license_expires_at IS NOT NULL
    AND d.p_license_expires_at BETWEEN CURRENT_DATE AND (CURRENT_DATE + p_days_ahead)
  ORDER BY d.p_license_expires_at ASC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_expiring_p_licenses IS 'Gibt Fahrer mit bald ablaufendem P-Schein zurück';

-- ============================================================================
-- PART 4: STORAGE BUCKET FOR P-SCHEIN DOCUMENTS
-- ============================================================================

-- Create storage bucket for P-Schein documents (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver_p_licenses', 'driver_p_licenses', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Users can upload P-Schein documents for their company's drivers
CREATE POLICY IF NOT EXISTS "Users can upload P-Schein documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'driver_p_licenses'
  AND auth.uid() IN (
    SELECT user_id FROM profiles
    WHERE company_id IN (
      SELECT company_id FROM drivers
      WHERE id::text = (storage.foldername(name))[1]
    )
  )
);

-- RLS Policy: Users can view P-Schein documents for their company's drivers
CREATE POLICY IF NOT EXISTS "Users can view P-Schein documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'driver_p_licenses'
  AND auth.uid() IN (
    SELECT user_id FROM profiles
    WHERE company_id IN (
      SELECT company_id FROM drivers
      WHERE id::text = (storage.foldername(name))[1]
    )
  )
);

-- ============================================================================
-- PART 5: AUTO-UPDATE TRIGGER FOR DRIVER STATUS
-- ============================================================================

-- Trigger function: Auto-disable drivers with expired P-Schein
CREATE OR REPLACE FUNCTION public.check_driver_p_license_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If P-Schein expired and driver is active, log warning (don't auto-disable)
  IF NEW.p_license_expires_at IS NOT NULL
     AND NEW.p_license_expires_at < CURRENT_DATE
     AND NEW.active = true THEN

    -- Log warning to console (Edge Function will send email)
    RAISE WARNING 'Driver % (%) has expired P-Schein (expired: %)',
      NEW.first_name || ' ' || NEW.last_name,
      NEW.id,
      NEW.p_license_expires_at;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_driver_p_license ON public.drivers;
CREATE TRIGGER trigger_check_driver_p_license
  BEFORE INSERT OR UPDATE OF p_license_expires_at, active ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.check_driver_p_license_status();

-- ============================================================================
-- PART 6: VALIDATION QUERIES
-- ============================================================================

-- Check drivers with full address and P-Schein
-- SELECT
--   first_name,
--   last_name,
--   format_driver_address(street, house_number, postal_code, city, country) as address,
--   p_license_number,
--   p_license_issued_at,
--   p_license_expires_at,
--   CASE
--     WHEN is_p_license_expired(p_license_expires_at) THEN 'Abgelaufen'
--     WHEN is_p_license_expiring_soon(p_license_expires_at, 60) THEN 'Läuft bald ab'
--     ELSE 'Gültig'
--   END as p_license_status
-- FROM public.drivers
-- WHERE active = true
-- ORDER BY p_license_expires_at ASC NULLS LAST;

-- Test expiring P-Schein function
-- SELECT * FROM get_expiring_p_licenses(
--   '<your-company-id>'::UUID,
--   60 -- days ahead
-- );

-- Test address formatting
-- SELECT format_driver_address('Musterstraße', '42', '12345', 'Berlin', 'Deutschland');
