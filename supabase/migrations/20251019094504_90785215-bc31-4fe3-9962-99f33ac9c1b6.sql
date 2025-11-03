-- ==================================================================================
-- TEAM-CHAT DSGVO-KONFORMITÄT V18.3
-- ==================================================================================
-- Automatische Chat-Teilnahme mit Einwilligungssystem für Fahrer, Kunden & Unternehmer
-- ==================================================================================

-- 1. Einwilligungs-Tracking Tabelle
CREATE TABLE IF NOT EXISTS public.chat_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('entrepreneur', 'driver', 'customer')),
  entity_id UUID, -- Referenz zu drivers/customers wenn anwendbar
  
  -- Einwilligungs-Status
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_given_at TIMESTAMP WITH TIME ZONE,
  consent_method TEXT CHECK (consent_method IN ('registration', 'email_confirmation', 'manual', 'admin')),
  
  -- Opt-Out
  opt_out BOOLEAN NOT NULL DEFAULT false,
  opt_out_at TIMESTAMP WITH TIME ZONE,
  opt_out_reason TEXT,
  
  -- Email-Bestätigung für manuelle Anlage
  confirmation_email_sent BOOLEAN NOT NULL DEFAULT false,
  confirmation_email_sent_at TIMESTAMP WITH TIME ZONE,
  confirmation_token TEXT UNIQUE,
  confirmation_token_expires_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indizes für Performance
CREATE INDEX idx_chat_consent_user_id ON public.chat_consent(user_id);
CREATE INDEX idx_chat_consent_company_id ON public.chat_consent(company_id);
CREATE INDEX idx_chat_consent_confirmation_token ON public.chat_consent(confirmation_token) WHERE confirmation_token IS NOT NULL;

-- RLS Policies
ALTER TABLE public.chat_consent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consent"
  ON public.chat_consent FOR SELECT
  USING (user_id = auth.uid() OR company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own consent"
  ON public.chat_consent FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert consent records"
  ON public.chat_consent FOR INSERT
  WITH CHECK (true);

-- 2. Automatischer Company-Chat bei Registrierung (Trigger)
CREATE OR REPLACE FUNCTION public.auto_create_company_chat()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_conv_id UUID;
  has_consent BOOLEAN;
BEGIN
  -- Prüfe ob User Consent gegeben hat (aus chat_consent Tabelle)
  SELECT consent_given INTO has_consent
  FROM public.chat_consent
  WHERE user_id = NEW.user_id;
  
  -- Nur fortfahren wenn Consent gegeben
  IF NOT COALESCE(has_consent, false) THEN
    RETURN NEW;
  END IF;
  
  -- Prüfe ob bereits ein Unternehmens-Chat existiert
  SELECT id INTO company_conv_id
  FROM public.chat_conversations
  WHERE company_id = NEW.company_id
    AND is_group = true
    AND name = 'Unternehmens-Chat'
    AND archived = false
  LIMIT 1;
  
  -- Erstelle Unternehmens-Chat wenn nicht vorhanden
  IF company_conv_id IS NULL THEN
    INSERT INTO public.chat_conversations (
      company_id,
      name,
      is_group,
      created_by,
      archived
    ) VALUES (
      NEW.company_id,
      'Unternehmens-Chat',
      true,
      NEW.user_id,
      false
    )
    RETURNING id INTO company_conv_id;
    
    -- Log
    RAISE NOTICE 'Created company chat: % for company: %', company_conv_id, NEW.company_id;
  END IF;
  
  -- Füge User als Participant hinzu (nur wenn noch nicht vorhanden)
  INSERT INTO public.chat_participants (
    conversation_id,
    user_id,
    joined_at
  )
  VALUES (
    company_conv_id,
    NEW.user_id,
    NOW()
  )
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Added user % to company chat %', NEW.user_id, company_conv_id;
  
  RETURN NEW;
END;
$$;

-- Trigger auf profiles (nach handle_new_user)
DROP TRIGGER IF EXISTS auto_create_company_chat_trigger ON public.profiles;
CREATE TRIGGER auto_create_company_chat_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_company_chat();

-- 3. Updated_at Trigger
CREATE OR REPLACE FUNCTION public.update_chat_consent_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_chat_consent_updated_at
  BEFORE UPDATE ON public.chat_consent
  FOR EACH ROW
  EXECUTE FUNCTION public.update_chat_consent_timestamp();

-- 4. Cleanup abgelaufener Confirmation-Tokens (täglich via cron)
CREATE OR REPLACE FUNCTION public.cleanup_expired_chat_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.chat_consent
  SET 
    confirmation_token = NULL,
    confirmation_token_expires_at = NULL
  WHERE confirmation_token_expires_at < NOW()
    AND confirmed_at IS NULL;
  
  RAISE NOTICE 'Cleaned up expired chat confirmation tokens';
END;
$$;