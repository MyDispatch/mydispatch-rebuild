-- ========================================
-- Task 12: Kunden - Doppelte Rechnungsanschrift & Ansprechpartner
-- ========================================
-- Part 1: Add invoice address fields to customers table
-- Part 2: Create contact_persons table for business customers

-- ============================================================================
-- PART 1: INVOICE ADDRESS FIELDS (JSONB for flexibility)
-- ============================================================================
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS invoice_address_private JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS invoice_address_business JSONB DEFAULT '{}'::JSONB;

-- Comments for documentation
COMMENT ON COLUMN public.customers.invoice_address_private IS 'Private invoice address (JSON: {street, postal_code, city, country})';
COMMENT ON COLUMN public.customers.invoice_address_business IS 'Business invoice address (JSON: {street, postal_code, city, country, company_name, tax_id})';

-- ============================================================================
-- PART 2: CONTACT PERSONS TABLE (Ansprechpartner für Firmenkunden)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Comments
COMMENT ON TABLE public.contact_persons IS 'Contact persons (Ansprechpartner) for business customers';
COMMENT ON COLUMN public.contact_persons.customer_id IS 'Foreign key to customers table';
COMMENT ON COLUMN public.contact_persons.name IS 'Full name of contact person';
COMMENT ON COLUMN public.contact_persons.role IS 'Role/position (e.g., Geschäftsführer, Disponent, Buchhaltung)';
COMMENT ON COLUMN public.contact_persons.is_primary IS 'Primary contact person for this customer';

-- RLS Policies
ALTER TABLE public.contact_persons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contact persons of their company" ON public.contact_persons FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert contact persons for their company" ON public.contact_persons FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update contact persons of their company" ON public.contact_persons FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete contact persons of their company" ON public.contact_persons FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

-- Triggers
CREATE TRIGGER update_contact_persons_updated_at BEFORE UPDATE ON public.contact_persons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_persons_customer ON public.contact_persons(customer_id)
WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_contact_persons_company ON public.contact_persons(company_id)
WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_contact_persons_primary ON public.contact_persons(customer_id, is_primary)
WHERE is_primary = true AND archived = false;
