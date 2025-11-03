-- ==================== BATCH 1: RECHTLICHE COMPLIANCE ====================
-- Cookie Consents Tabelle (DSGVO Art. 7)
CREATE TABLE IF NOT EXISTS public.cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  necessary BOOLEAN NOT NULL DEFAULT true,
  functional BOOLEAN NOT NULL DEFAULT false,
  analytics BOOLEAN NOT NULL DEFAULT false,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  CONSTRAINT unique_user_consent UNIQUE (user_id)
);

-- RLS für cookie_consents
ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consent"
  ON public.cookie_consents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent"
  ON public.cookie_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consent"
  ON public.cookie_consents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_cookie_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cookie_consents_updated_at
  BEFORE UPDATE ON public.cookie_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_cookie_consents_updated_at();

-- Index für Performance
CREATE INDEX idx_cookie_consents_user_id ON public.cookie_consents(user_id);
CREATE INDEX idx_cookie_consents_consented_at ON public.cookie_consents(consented_at);

COMMENT ON TABLE public.cookie_consents IS 'DSGVO Art. 7: Einwilligungsnachweise für Cookie-Nutzung';
COMMENT ON COLUMN public.cookie_consents.necessary IS 'Technisch notwendige Cookies (immer aktiv)';
COMMENT ON COLUMN public.cookie_consents.functional IS 'Funktionale Cookies (optional)';
COMMENT ON COLUMN public.cookie_consents.analytics IS 'Analytische Cookies / Google Analytics (optional)';
COMMENT ON COLUMN public.cookie_consents.ip_address IS 'IP-Adresse zum Zeitpunkt der Einwilligung (anonymisiert nach 30 Tagen)';
COMMENT ON COLUMN public.cookie_consents.user_agent IS 'Browser-Info zum Zeitpunkt der Einwilligung';