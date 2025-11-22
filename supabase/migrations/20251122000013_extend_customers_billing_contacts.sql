-- ========================================
-- TASK 7: Kunden - Doppelte Rechnungsadresse & Ansprechpartner
-- ========================================
-- Erweiterte Kunden-Verwaltung mit separaten Rechnungsadressen
-- für Privat- und Geschäftskunden

-- ============================================================================
-- PART 1: CUSTOMERS TABLE - Add Billing Address Fields
-- ============================================================================

ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS billing_street TEXT,
ADD COLUMN IF NOT EXISTS billing_house_number TEXT,
ADD COLUMN IF NOT EXISTS billing_postal_code TEXT,
ADD COLUMN IF NOT EXISTS billing_city TEXT,
ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'Deutschland',
ADD COLUMN IF NOT EXISTS use_separate_billing_address BOOLEAN DEFAULT false;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_billing_postal_code ON public.customers(billing_postal_code);
CREATE INDEX IF NOT EXISTS idx_customers_billing_city ON public.customers(billing_city);

-- Comments
COMMENT ON COLUMN public.customers.billing_street IS 'Rechnungsadresse: Straßenname';
COMMENT ON COLUMN public.customers.billing_house_number IS 'Rechnungsadresse: Hausnummer';
COMMENT ON COLUMN public.customers.billing_postal_code IS 'Rechnungsadresse: Postleitzahl';
COMMENT ON COLUMN public.customers.billing_city IS 'Rechnungsadresse: Stadt/Ort';
COMMENT ON COLUMN public.customers.billing_country IS 'Rechnungsadresse: Land';
COMMENT ON COLUMN public.customers.use_separate_billing_address IS 'Separate Rechnungsadresse verwenden?';

-- ============================================================================
-- PART 2: CONTACT PERSONS TABLE (Already exists - extend if needed)
-- ============================================================================

-- Check if contact_persons table needs extensions
-- Existing columns: id, customer_id, first_name, last_name, email, phone, position
-- Add salutation and title for consistency

ALTER TABLE public.contact_persons
ADD COLUMN IF NOT EXISTS salutation TEXT CHECK (salutation IN ('Herr', 'Frau', 'Divers')),
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- Index for primary contact person
CREATE INDEX IF NOT EXISTS idx_contact_persons_is_primary ON public.contact_persons(customer_id, is_primary);

COMMENT ON COLUMN public.contact_persons.salutation IS 'Anrede des Ansprechpartners';
COMMENT ON COLUMN public.contact_persons.title IS 'Titel des Ansprechpartners (z.B. Dr., Prof.)';
COMMENT ON COLUMN public.contact_persons.is_primary IS 'Primärer Ansprechpartner?';

-- ============================================================================
-- PART 3: VALIDATION FUNCTIONS
-- ============================================================================

-- Function: Format billing address
CREATE OR REPLACE FUNCTION public.format_billing_address(
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

COMMENT ON FUNCTION public.format_billing_address IS 'Formatiert vollständige Rechnungsadresse';

-- Function: Get effective billing address (with fallback to main address)
CREATE OR REPLACE FUNCTION public.get_effective_billing_address(p_customer_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_customer RECORD;
  v_address TEXT;
BEGIN
  SELECT * INTO v_customer FROM public.customers WHERE id = p_customer_id;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- If separate billing address is used and exists
  IF v_customer.use_separate_billing_address 
     AND v_customer.billing_street IS NOT NULL THEN
    RETURN format_billing_address(
      v_customer.billing_street,
      v_customer.billing_house_number,
      v_customer.billing_postal_code,
      v_customer.billing_city,
      v_customer.billing_country
    );
  END IF;
  
  -- Fallback to main address (if exists in customers table)
  -- Note: customers table might need street/postal_code columns added
  RETURN NULL; -- TODO: Add main address fields if not present
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_effective_billing_address IS 'Gibt effektive Rechnungsadresse zurück (mit Fallback auf Hauptadresse)';

-- ============================================================================
-- PART 4: CONTACT PERSONS MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function: Get primary contact person for customer
CREATE OR REPLACE FUNCTION public.get_primary_contact_person(p_customer_id UUID)
RETURNS TABLE (
  contact_id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  position TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    format_full_name(cp.salutation, cp.title, cp.first_name, cp.last_name),
    cp.email,
    cp.phone,
    cp.position
  FROM public.contact_persons cp
  WHERE cp.customer_id = p_customer_id
    AND cp.is_primary = true
  LIMIT 1;
  
  -- If no primary contact, return first contact
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      cp.id,
      format_full_name(cp.salutation, cp.title, cp.first_name, cp.last_name),
      cp.email,
      cp.phone,
      cp.position
    FROM public.contact_persons cp
    WHERE cp.customer_id = p_customer_id
    ORDER BY cp.created_at ASC
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_primary_contact_person IS 'Gibt primären Ansprechpartner für Kunde zurück';

-- ============================================================================
-- PART 5: TRIGGER - ENSURE ONLY ONE PRIMARY CONTACT
-- ============================================================================

-- Trigger function: Ensure only one primary contact per customer
CREATE OR REPLACE FUNCTION public.ensure_single_primary_contact()
RETURNS TRIGGER AS $$
BEGIN
  -- If new contact is set as primary, unset all others
  IF NEW.is_primary = true THEN
    UPDATE public.contact_persons
    SET is_primary = false
    WHERE customer_id = NEW.customer_id
      AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ensure_single_primary_contact ON public.contact_persons;
CREATE TRIGGER trigger_ensure_single_primary_contact
  BEFORE INSERT OR UPDATE OF is_primary ON public.contact_persons
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_primary_contact();

-- ============================================================================
-- PART 6: VALIDATION QUERIES
-- ============================================================================

-- Check customers with billing addresses
-- SELECT 
--   first_name,
--   last_name,
--   email,
--   use_separate_billing_address,
--   format_billing_address(
--     billing_street, 
--     billing_house_number, 
--     billing_postal_code, 
--     billing_city, 
--     billing_country
--   ) as billing_address,
--   (SELECT COUNT(*) FROM contact_persons WHERE customer_id = customers.id) as contact_count
-- FROM public.customers
-- WHERE use_separate_billing_address = true
-- LIMIT 10;

-- Check contact persons with primary flag
-- SELECT 
--   c.first_name || ' ' || c.last_name as customer_name,
--   format_full_name(cp.salutation, cp.title, cp.first_name, cp.last_name) as contact_name,
--   cp.email,
--   cp.phone,
--   cp.position,
--   cp.is_primary
-- FROM public.contact_persons cp
-- JOIN public.customers c ON cp.customer_id = c.id
-- ORDER BY c.last_name, cp.is_primary DESC;

-- Test primary contact function
-- SELECT * FROM get_primary_contact_person('<customer-id>'::UUID);
