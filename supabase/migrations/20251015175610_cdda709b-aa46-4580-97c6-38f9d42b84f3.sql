-- Tabelle für E-Mail-Vorlagen
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- 'booking_confirmation', 'invoice_email', 'reminder', etc.
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view email templates of their company"
ON public.email_templates FOR SELECT
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can insert email templates for their company"
ON public.email_templates FOR INSERT
WITH CHECK (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update email templates of their company"
ON public.email_templates FOR UPDATE
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete email templates of their company"
ON public.email_templates FOR DELETE
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

-- Trigger für updated_at
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index für bessere Performance
CREATE INDEX idx_email_templates_company_id ON public.email_templates(company_id);