-- ========================================
-- TASK 2: Mindestvorlauf-Konfiguration
-- ========================================
-- Unternehmen können minimale Vorlaufzeit konfigurieren
-- Standard: 30 Minuten
-- Optionen: 30 Min / 1 Std / 1,5 Std / 2 Std

-- ============================================================================
-- PART 1: COMPANIES TABLE - Add Settings Column
-- ============================================================================

-- Add minimum_lead_time_minutes to companies.settings JSONB
-- If settings column doesn't exist, create it
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Set default minimum_lead_time_minutes for existing companies
UPDATE public.companies
SET settings = COALESCE(settings, '{}'::jsonb) || '{"minimum_lead_time_minutes": 30}'::jsonb
WHERE settings IS NULL OR NOT (settings ? 'minimum_lead_time_minutes');

COMMENT ON COLUMN public.companies.settings IS 'Unternehmens-Einstellungen: minimum_lead_time_minutes (30, 60, 90, 120), etc.';

-- ============================================================================
-- PART 2: VALIDATION FUNCTION
-- ============================================================================

-- Function: Check if booking meets minimum lead time
CREATE OR REPLACE FUNCTION public.validate_minimum_lead_time(
  p_company_id UUID,
  p_pickup_datetime TIMESTAMPTZ
) RETURNS BOOLEAN AS $$
DECLARE
  v_minimum_minutes INTEGER;
  v_lead_time_minutes INTEGER;
BEGIN
  -- Get company's minimum lead time setting (default 30 min)
  SELECT COALESCE((settings->>'minimum_lead_time_minutes')::INTEGER, 30)
  INTO v_minimum_minutes
  FROM public.companies
  WHERE id = p_company_id;

  -- Calculate actual lead time
  v_lead_time_minutes := EXTRACT(EPOCH FROM (p_pickup_datetime - NOW())) / 60;

  -- Return true if lead time meets minimum requirement
  RETURN v_lead_time_minutes >= v_minimum_minutes;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.validate_minimum_lead_time IS 'Prüft ob Buchung die Mindestvorlaufzeit erfüllt';

-- ============================================================================
-- PART 3: BOOKINGS TABLE - Add Validation Trigger (Optional)
-- ============================================================================

-- Trigger function: Validate lead time before insert/update
CREATE OR REPLACE FUNCTION public.check_booking_lead_time()
RETURNS TRIGGER AS $$
DECLARE
  v_pickup_datetime TIMESTAMPTZ;
  v_is_valid BOOLEAN;
BEGIN
  -- Combine pickup_date and pickup_time
  v_pickup_datetime := (NEW.pickup_date::TEXT || ' ' || NEW.pickup_time::TEXT)::TIMESTAMPTZ;

  -- Validate lead time
  v_is_valid := public.validate_minimum_lead_time(NEW.company_id, v_pickup_datetime);

  -- Allow bypass for admin users (check via auth context if needed)
  -- For now, we just log a warning but don't block
  IF NOT v_is_valid THEN
    RAISE NOTICE 'Warnung: Buchung unterschreitet Mindestvorlaufzeit für company_id=%', NEW.company_id;
    -- Uncomment to enforce strict validation:
    -- RAISE EXCEPTION 'Buchung muss mindestens % Minuten im Voraus erstellt werden',
    --   (SELECT settings->>'minimum_lead_time_minutes' FROM companies WHERE id = NEW.company_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (currently only logs warning, doesn't block)
DROP TRIGGER IF EXISTS trigger_check_booking_lead_time ON public.bookings;
CREATE TRIGGER trigger_check_booking_lead_time
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.check_booking_lead_time();

COMMENT ON TRIGGER trigger_check_booking_lead_time ON public.bookings IS 'Validiert Mindestvorlaufzeit bei neuen Buchungen';

-- ============================================================================
-- PART 4: HELPER FUNCTION - Get Allowed Lead Time Options
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_lead_time_options()
RETURNS TABLE(value INTEGER, label TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM (VALUES
    (30, '30 Minuten'),
    (60, '1 Stunde'),
    (90, '1,5 Stunden'),
    (120, '2 Stunden')
  ) AS options(value, label);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.get_lead_time_options IS 'Gibt verfügbare Mindestvorlaufzeit-Optionen zurück';

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================

-- Check current settings for all companies
-- SELECT id, name, settings->>'minimum_lead_time_minutes' as min_lead_time
-- FROM public.companies;

-- Test validation function
-- SELECT public.validate_minimum_lead_time(
--   '<company_id>'::UUID,
--   NOW() + INTERVAL '45 minutes'
-- ); -- Should return TRUE if company has 30 min setting

-- Get lead time options
-- SELECT * FROM public.get_lead_time_options();
