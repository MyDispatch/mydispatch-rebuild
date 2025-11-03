-- ============================================================================
-- INVOICES & INVOICE ITEMS TABLES
-- Version: 18.5.0
-- Datum: 2025-10-22
-- ============================================================================

-- Tabelle: invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  
  -- Verknüpfungen
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Rechnungsdaten
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  payment_terms INTEGER NOT NULL DEFAULT 14, -- Tage
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',      -- Entwurf
    'sent',       -- Versendet
    'paid',       -- Bezahlt
    'overdue',    -- Überfällig
    'cancelled'   -- Storniert
  )),
  
  -- Beträge (in Cent für Präzision)
  subtotal INTEGER NOT NULL, -- Netto
  tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 19.00, -- Steuersatz in %
  tax_amount INTEGER NOT NULL, -- Steuerbetrag
  total_amount INTEGER NOT NULL, -- Brutto
  currency TEXT NOT NULL DEFAULT 'EUR',
  
  -- Zahlungsinformationen
  payment_method TEXT CHECK (payment_method IN (
    'cash',
    'card',
    'bank_transfer',
    'paypal',
    'invoice'
  )),
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT, -- Referenz/Transaktions-ID
  
  -- Dokumente
  pdf_url TEXT,
  
  -- Notizen
  notes TEXT,
  internal_notes TEXT, -- Nur für Staff sichtbar
  
  -- System
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indizes für invoices
CREATE INDEX idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX idx_invoices_booking ON public.invoices(booking_id);
CREATE INDEX idx_invoices_company ON public.invoices(company_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_invoice_date ON public.invoices(invoice_date DESC);

-- Tabelle: invoice_items
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  
  -- Position
  position INTEGER NOT NULL, -- Reihenfolge
  
  -- Artikel/Service
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
  unit_price INTEGER NOT NULL, -- in Cent
  
  -- Berechnung
  line_total INTEGER NOT NULL, -- quantity * unit_price
  
  -- Optional: Verknüpfung zu Auftrag
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indizes für invoice_items
CREATE INDEX idx_invoice_items_invoice ON public.invoice_items(invoice_id);

-- ============================================================================
-- SEQUENCES & AUTO-GENERATION
-- ============================================================================

-- Invoice Number Sequence
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START WITH 1;

-- Auto-generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'INV-' || TO_CHAR(now(), 'YYYY') || '-' || 
    LPAD(NEXTVAL('invoice_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_invoice_number
BEFORE INSERT ON public.invoices
FOR EACH ROW
WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
EXECUTE FUNCTION generate_invoice_number();

-- Auto-calculate due_date
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

-- Auto-update status to overdue
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

-- Auto-calculate line_total for invoice_items
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

-- Auto-update timestamp für invoices
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Invoices Policies
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

-- Invoice Items Policies
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

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.invoices IS 'Rechnungen für Kunden mit automatischer Nummerierung und Status-Tracking';
COMMENT ON TABLE public.invoice_items IS 'Einzelne Positionen einer Rechnung';
COMMENT ON COLUMN public.invoices.subtotal IS 'Nettobetrag in Cent';
COMMENT ON COLUMN public.invoices.tax_amount IS 'Steuerbetrag in Cent';
COMMENT ON COLUMN public.invoices.total_amount IS 'Bruttobetrag in Cent';
COMMENT ON COLUMN public.invoice_items.unit_price IS 'Einzelpreis in Cent';
COMMENT ON COLUMN public.invoice_items.line_total IS 'Zeilensumme in Cent';