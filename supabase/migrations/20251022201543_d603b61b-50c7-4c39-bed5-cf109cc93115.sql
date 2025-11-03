-- ============================================================================
-- INVOICES TABLES - Clean Migration
-- Version: 18.5.0
-- Datum: 2025-10-22
-- ============================================================================

-- Drop existing objects if they exist (idempotent)
DROP TRIGGER IF EXISTS set_invoice_number ON public.invoices;
DROP TRIGGER IF EXISTS set_invoice_due_date ON public.invoices;
DROP TRIGGER IF EXISTS update_invoice_overdue_status ON public.invoices;
DROP TRIGGER IF EXISTS set_invoice_line_total ON public.invoice_items;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;

DROP FUNCTION IF EXISTS generate_invoice_number();
DROP FUNCTION IF EXISTS calculate_invoice_due_date();
DROP FUNCTION IF EXISTS check_invoice_overdue();
DROP FUNCTION IF EXISTS calculate_invoice_line_total();

-- Drop policies
DROP POLICY IF EXISTS "Users can view invoices of their company" ON public.invoices;
DROP POLICY IF EXISTS "Users can create invoices for their company" ON public.invoices;
DROP POLICY IF EXISTS "Users can update invoices of their company" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete invoices of their company" ON public.invoices;
DROP POLICY IF EXISTS "Users can view invoice items of their company" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can manage invoice items of their company" ON public.invoice_items;

-- Drop tables (CASCADE to remove dependencies)
DROP TABLE IF EXISTS public.invoice_items CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP SEQUENCE IF EXISTS invoice_number_seq;

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- Tabelle: invoices
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  
  -- Verknüpfungen
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Rechnungsdaten
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  payment_terms INTEGER NOT NULL DEFAULT 14,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'sent', 'paid', 'overdue', 'cancelled'
  )),
  
  -- Beträge (in Cent)
  subtotal INTEGER NOT NULL,
  tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 19.00,
  tax_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  
  -- Zahlungsinformationen
  payment_method TEXT CHECK (payment_method IN (
    'cash', 'card', 'bank_transfer', 'paypal', 'invoice'
  )),
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  
  -- Dokumente
  pdf_url TEXT,
  
  -- Notizen
  notes TEXT,
  internal_notes TEXT,
  
  -- System
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX idx_invoices_booking ON public.invoices(booking_id);
CREATE INDEX idx_invoices_company ON public.invoices(company_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_invoice_date ON public.invoices(invoice_date DESC);

-- Tabelle: invoice_items
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
  unit_price INTEGER NOT NULL,
  line_total INTEGER NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoice_items_invoice ON public.invoice_items(invoice_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

CREATE SEQUENCE invoice_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'INV-' || TO_CHAR(now(), 'YYYY') || '-' || 
      LPAD(NEXTVAL('invoice_number_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_invoice_number
BEFORE INSERT ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION generate_invoice_number();

CREATE OR REPLACE FUNCTION calculate_invoice_due_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_date IS NULL THEN
    NEW.due_date := NEW.invoice_date + (NEW.payment_terms || ' days')::INTERVAL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_invoice_due_date
BEFORE INSERT ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION calculate_invoice_due_date();

CREATE OR REPLACE FUNCTION check_invoice_overdue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sent' AND NEW.due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_invoice_overdue_status
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION check_invoice_overdue();

CREATE OR REPLACE FUNCTION calculate_invoice_line_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.line_total := (NEW.quantity * NEW.unit_price)::INTEGER;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_invoice_line_total
BEFORE INSERT OR UPDATE ON public.invoice_items
FOR EACH ROW
EXECUTE FUNCTION calculate_invoice_line_total();

CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invoices of their company" 
ON public.invoices FOR SELECT 
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create invoices for their company" 
ON public.invoices FOR INSERT 
WITH CHECK (
  company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
  AND created_by = auth.uid()
);

CREATE POLICY "Users can update invoices of their company" 
ON public.invoices FOR UPDATE 
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete invoices of their company" 
ON public.invoices FOR DELETE 
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can view invoice items of their company" 
ON public.invoice_items FOR SELECT 
USING (invoice_id IN (
  SELECT id FROM invoices WHERE company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Users can manage invoice items of their company" 
ON public.invoice_items FOR ALL 
USING (invoice_id IN (
  SELECT id FROM invoices WHERE company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
));