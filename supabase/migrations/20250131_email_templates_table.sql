-- ==================================================================================
-- EMAIL TEMPLATES TABLE - Für Template-Management
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: E-Mail-Templates in Supabase DB speichern
-- Autor: NeXify AI MASTER
-- ==================================================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code TEXT NOT NULL UNIQUE, -- 'AUTH-01', 'BOOKING-01', etc.
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('auth', 'booking', 'invoice', 'driver', 'customer', 'partner', 'document', 'admin')),
  subject_template TEXT NOT NULL,
  html_template TEXT NOT NULL,
  text_template TEXT NOT NULL,
  
  -- Variables
  variables JSONB DEFAULT '[]'::jsonb, -- ['companyName', 'userName', 'bookingId', etc.]
  
  -- Branding
  supports_company_branding BOOLEAN DEFAULT true,
  supports_white_label BOOLEAN DEFAULT false, -- Business/Enterprise only
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT false, -- Required templates can't be deleted
  
  -- Metadata
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT template_code_format CHECK (template_code ~ '^[A-Z]+-[0-9]+$')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_templates_code ON email_templates(template_code);

-- RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Service Role kann alles
CREATE POLICY "Service role can manage email_templates"
  ON email_templates
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Authenticated users können lesen
CREATE POLICY "Authenticated users can read email_templates"
  ON email_templates
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Kommentare
COMMENT ON TABLE email_templates IS 'E-Mail-Templates für alle E-Mail-Typen';
COMMENT ON COLUMN email_templates.template_code IS 'Eindeutiger Code (z.B. AUTH-01, BOOKING-01)';
COMMENT ON COLUMN email_templates.supports_company_branding IS 'Template unterstützt Company-Logo und Farben';
COMMENT ON COLUMN email_templates.supports_white_label IS 'Template unterstützt White-Label (Business/Enterprise)';

