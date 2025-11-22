-- ========================================
-- TASK 1: Formulare - 4 Separate Felder
-- ========================================
-- Alle Personendaten erhalten 4 separate Felder:
-- - salutation (Anrede: Herr, Frau, Divers)
-- - title (Titel: Dr., Prof., etc.)
-- - first_name (Vorname)
-- - last_name (Nachname)
--
-- Betrifft: customers, drivers, profiles, contact_persons

-- ============================================================================
-- PART 1: CUSTOMERS TABLE
-- ============================================================================

-- Add new columns
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS salutation TEXT CHECK (salutation IN ('Herr', 'Frau', 'Divers')),
ADD COLUMN IF NOT EXISTS title TEXT;

-- Update existing data (split full_name if exists, or use first_name/last_name)
-- HINWEIS: Manuelle Datenbereinigung kann erforderlich sein

COMMENT ON COLUMN public.customers.salutation IS 'Anrede: Herr, Frau, Divers';
COMMENT ON COLUMN public.customers.title IS 'Titel: Dr., Prof., Dipl.-Ing., etc.';
COMMENT ON COLUMN public.customers.first_name IS 'Vorname (separate Feld)';
COMMENT ON COLUMN public.customers.last_name IS 'Nachname (separate Feld)';

-- ============================================================================
-- PART 2: DRIVERS TABLE
-- ============================================================================

-- Add new columns
ALTER TABLE public.drivers
ADD COLUMN IF NOT EXISTS salutation TEXT CHECK (salutation IN ('Herr', 'Frau', 'Divers')),
ADD COLUMN IF NOT EXISTS title TEXT;

COMMENT ON COLUMN public.drivers.salutation IS 'Anrede: Herr, Frau, Divers';
COMMENT ON COLUMN public.drivers.title IS 'Titel: Dr., Prof., etc.';
COMMENT ON COLUMN public.drivers.first_name IS 'Vorname (separate Feld)';
COMMENT ON COLUMN public.drivers.last_name IS 'Nachname (separate Feld)';

-- ============================================================================
-- PART 3: PROFILES TABLE
-- ============================================================================

-- Add new columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS salutation TEXT CHECK (salutation IN ('Herr', 'Frau', 'Divers')),
ADD COLUMN IF NOT EXISTS title TEXT;

COMMENT ON COLUMN public.profiles.salutation IS 'Anrede: Herr, Frau, Divers';
COMMENT ON COLUMN public.profiles.title IS 'Titel: Dr., Prof., etc.';
COMMENT ON COLUMN public.profiles.first_name IS 'Vorname (separate Feld)';
COMMENT ON COLUMN public.profiles.last_name IS 'Nachname (separate Feld)';

-- ============================================================================
-- PART 4: CONTACT_PERSONS TABLE (if exists)
-- ============================================================================

-- Check if table exists first
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'contact_persons'
  ) THEN
    -- Add columns if table exists
    ALTER TABLE public.contact_persons
    ADD COLUMN IF NOT EXISTS salutation TEXT CHECK (salutation IN ('Herr', 'Frau', 'Divers')),
    ADD COLUMN IF NOT EXISTS title TEXT;

    COMMENT ON COLUMN public.contact_persons.salutation IS 'Anrede: Herr, Frau, Divers';
    COMMENT ON COLUMN public.contact_persons.title IS 'Titel: Dr., Prof., etc.';
  END IF;
END $$;

-- ============================================================================
-- PART 5: VALIDATION FUNCTION
-- ============================================================================

-- Helper function: Format full name with title and salutation
CREATE OR REPLACE FUNCTION public.format_full_name(
  p_salutation TEXT,
  p_title TEXT,
  p_first_name TEXT,
  p_last_name TEXT
) RETURNS TEXT AS $$
BEGIN
  RETURN TRIM(
    CONCAT_WS(' ',
      NULLIF(p_salutation, ''),
      NULLIF(p_title, ''),
      NULLIF(p_first_name, ''),
      NULLIF(p_last_name, '')
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.format_full_name IS 'Formatiert vollständigen Namen mit Anrede und Titel';

-- Example usage:
-- SELECT format_full_name('Herr', 'Dr.', 'Max', 'Mustermann');
-- Result: 'Herr Dr. Max Mustermann'

-- ============================================================================
-- PART 6: UPDATE EXISTING DATA (Optional - Manual Review Recommended)
-- ============================================================================

-- HINWEIS: Diese Updates sollten manuell geprüft werden!
-- Beispiel: Existierende Namen mit 'Herr' oder 'Frau' Prefix splitten

-- Update customers with 'Herr ' prefix
-- UPDATE public.customers
-- SET 
--   salutation = 'Herr',
--   first_name = TRIM(REGEXP_REPLACE(first_name, '^Herr\s+', '', 'i'))
-- WHERE first_name ILIKE 'Herr %';

-- Update customers with 'Frau ' prefix
-- UPDATE public.customers
-- SET 
--   salutation = 'Frau',
--   first_name = TRIM(REGEXP_REPLACE(first_name, '^Frau\s+', '', 'i'))
-- WHERE first_name ILIKE 'Frau %';

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================

-- Check customers with new fields
-- SELECT salutation, title, first_name, last_name, format_full_name(salutation, title, first_name, last_name) as full_name
-- FROM public.customers
-- LIMIT 10;

-- Check drivers with new fields
-- SELECT salutation, title, first_name, last_name, format_full_name(salutation, title, first_name, last_name) as full_name
-- FROM public.drivers
-- LIMIT 10;
