-- ============================================================================
-- COOKIE CONSENTS TABLE - DSGVO-KONFORM
-- ============================================================================
-- CRITICAL FIX: Security Finding #6
-- Erstelle Tabelle für Cookie-Präferenzen mit RLS

CREATE TABLE IF NOT EXISTS public.cookie_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  necessary BOOLEAN DEFAULT true NOT NULL,
  functional BOOLEAN DEFAULT false NOT NULL,
  analytics BOOLEAN DEFAULT false NOT NULL,
  consented_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users können nur eigene Cookie-Präferenzen sehen/ändern
CREATE POLICY "Users can view own cookie preferences"
  ON public.cookie_consents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cookie preferences"
  ON public.cookie_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cookie preferences"
  ON public.cookie_consents
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cookie preferences"
  ON public.cookie_consents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index für Performance
CREATE INDEX IF NOT EXISTS idx_cookie_consents_user_id 
  ON public.cookie_consents(user_id);

-- Update Trigger
CREATE OR REPLACE FUNCTION update_cookie_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cookie_consents_updated_at_trigger
  BEFORE UPDATE ON public.cookie_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_cookie_consents_updated_at();