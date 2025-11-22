-- ========================================
-- TASK 3: MwSt-Felder für Buchungen
-- ========================================
-- Auftragseingabe erhält MwSt-Felder:
-- - vat_rate (7%, 19%)
-- - price_includes_vat (boolean)

-- ============================================================================
-- PART 1: BOOKINGS TABLE - Add VAT Columns
-- ============================================================================

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(4,2) DEFAULT 19.00 CHECK (vat_rate IN (0, 7, 19)),
ADD COLUMN IF NOT EXISTS price_includes_vat BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS price_net NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS vat_amount NUMERIC(10,2);

COMMENT ON COLUMN public.bookings.vat_rate IS 'MwSt-Satz: 0%, 7%, 19%';
COMMENT ON COLUMN public.bookings.price_includes_vat IS 'TRUE = Preis inkl. MwSt, FALSE = Preis exkl. MwSt';
COMMENT ON COLUMN public.bookings.price_net IS 'Netto-Preis (berechnet)';
COMMENT ON COLUMN public.bookings.vat_amount IS 'MwSt-Betrag (berechnet)';

-- ============================================================================
-- PART 2: PRICE CALCULATION FUNCTIONS
-- ============================================================================

-- Calculate net price from gross price
CREATE OR REPLACE FUNCTION public.calculate_net_price(
  p_price NUMERIC,
  p_includes_vat BOOLEAN,
  p_vat_rate NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
  IF p_includes_vat THEN
    -- Price includes VAT -> calculate net
    RETURN ROUND(p_price / (1 + p_vat_rate / 100), 2);
  ELSE
    -- Price is already net
    RETURN p_price;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate VAT amount
CREATE OR REPLACE FUNCTION public.calculate_vat_amount(
  p_price NUMERIC,
  p_includes_vat BOOLEAN,
  p_vat_rate NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  v_net_price NUMERIC;
BEGIN
  v_net_price := public.calculate_net_price(p_price, p_includes_vat, p_vat_rate);
  RETURN ROUND(v_net_price * p_vat_rate / 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate gross price from net price
CREATE OR REPLACE FUNCTION public.calculate_gross_price(
  p_price NUMERIC,
  p_includes_vat BOOLEAN,
  p_vat_rate NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
  IF p_includes_vat THEN
    -- Price is already gross
    RETURN p_price;
  ELSE
    -- Price is net -> add VAT
    RETURN ROUND(p_price * (1 + p_vat_rate / 100), 2);
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.calculate_net_price IS 'Berechnet Netto-Preis aus Brutto oder gibt Netto zurück';
COMMENT ON FUNCTION public.calculate_vat_amount IS 'Berechnet MwSt-Betrag';
COMMENT ON FUNCTION public.calculate_gross_price IS 'Berechnet Brutto-Preis aus Netto oder gibt Brutto zurück';

-- ============================================================================
-- PART 3: AUTO-CALCULATION TRIGGER
-- ============================================================================

-- Trigger function: Auto-calculate price_net and vat_amount
CREATE OR REPLACE FUNCTION public.calculate_booking_vat()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate net price and VAT amount
  NEW.price_net := public.calculate_net_price(
    NEW.price,
    NEW.price_includes_vat,
    NEW.vat_rate
  );

  NEW.vat_amount := public.calculate_vat_amount(
    NEW.price,
    NEW.price_includes_vat,
    NEW.vat_rate
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_calculate_booking_vat ON public.bookings;
CREATE TRIGGER trigger_calculate_booking_vat
  BEFORE INSERT OR UPDATE OF price, price_includes_vat, vat_rate ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_booking_vat();

COMMENT ON TRIGGER trigger_calculate_booking_vat ON public.bookings IS 'Berechnet automatisch Netto-Preis und MwSt-Betrag';

-- ============================================================================
-- PART 4: UPDATE EXISTING BOOKINGS
-- ============================================================================

-- Update existing bookings with default values
UPDATE public.bookings
SET
  vat_rate = 19.00,
  price_includes_vat = true
WHERE vat_rate IS NULL OR price_includes_vat IS NULL;

-- Trigger recalculation for existing bookings
UPDATE public.bookings
SET price = price
WHERE price_net IS NULL;

-- ============================================================================
-- PART 5: VALIDATION QUERIES
-- ============================================================================

-- Test price calculations
-- SELECT
--   price,
--   vat_rate,
--   price_includes_vat,
--   price_net,
--   vat_amount,
--   price_net + vat_amount as calculated_gross
-- FROM public.bookings
-- LIMIT 10;

-- Example calculations:
-- SELECT
--   public.calculate_net_price(119.00, true, 19) as net_from_gross, -- Should be 100.00
--   public.calculate_vat_amount(119.00, true, 19) as vat_amount, -- Should be 19.00
--   public.calculate_gross_price(100.00, false, 19) as gross_from_net; -- Should be 119.00
