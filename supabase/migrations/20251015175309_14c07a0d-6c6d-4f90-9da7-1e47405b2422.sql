-- Tabelle für Dokumentvorlagen (Rechnungen, Angebote, Mahnungen, etc.)
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Abrechnung', 'Vertrieb', etc.
  template_type TEXT NOT NULL, -- 'invoice', 'quote', 'reminder_1', 'reminder_2', 'contract', 'confirmation'
  subject TEXT,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view templates of their company"
ON public.document_templates FOR SELECT
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can insert templates for their company"
ON public.document_templates FOR INSERT
WITH CHECK (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update templates of their company"
ON public.document_templates FOR UPDATE
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete templates of their company"
ON public.document_templates FOR DELETE
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

-- Trigger für updated_at
CREATE TRIGGER update_document_templates_updated_at
BEFORE UPDATE ON public.document_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index für bessere Performance
CREATE INDEX idx_document_templates_company_id ON public.document_templates(company_id);
CREATE INDEX idx_document_templates_type ON public.document_templates(template_type);