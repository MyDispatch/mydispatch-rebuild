-- ==================================================================================
-- TEAM-CHAT FIX V18.3.1 - Company-Chat Auto-Creation bei Consent
-- ==================================================================================

-- 1. TRIGGER LÖSCHEN (Altes Konzept: Bei Profile-Creation)
DROP TRIGGER IF EXISTS trg_auto_create_company_chat ON public.profiles;

-- 2. NEUE FUNKTION: Unternehmens-Chat finden oder erstellen
CREATE OR REPLACE FUNCTION public.ensure_company_chat_exists(target_company_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  company_conv_id UUID;
  company_name TEXT;
BEGIN
  -- Hole Company-Namen
  SELECT name INTO company_name
  FROM public.companies
  WHERE id = target_company_id;
  
  -- Prüfe ob bereits ein Unternehmens-Chat existiert
  SELECT id INTO company_conv_id
  FROM public.chat_conversations
  WHERE company_id = target_company_id
    AND is_group = true
    AND (name = 'Unternehmens-Chat' OR name = company_name || ' Team')
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
    ) 
    SELECT 
      target_company_id,
      COALESCE(company_name || ' Team', 'Unternehmens-Chat'),
      true,
      (SELECT user_id FROM public.profiles WHERE company_id = target_company_id LIMIT 1),
      false
    RETURNING id INTO company_conv_id;
    
    RAISE NOTICE 'Created company chat: % for company: %', company_conv_id, target_company_id;
  END IF;
  
  RETURN company_conv_id;
END;
$$;

-- 3. NEUE FUNKTION: User zu Company-Chat hinzufügen
CREATE OR REPLACE FUNCTION public.add_user_to_company_chat(
  target_user_id UUID,
  target_company_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  company_conv_id UUID;
BEGIN
  -- Stelle sicher dass Company-Chat existiert
  company_conv_id := public.ensure_company_chat_exists(target_company_id);
  
  IF company_conv_id IS NULL THEN
    RAISE EXCEPTION 'Could not create/find company chat';
  END IF;
  
  -- Füge User als Participant hinzu (nur wenn noch nicht vorhanden)
  INSERT INTO public.chat_participants (
    conversation_id,
    user_id,
    joined_at
  )
  VALUES (
    company_conv_id,
    target_user_id,
    NOW()
  )
  ON CONFLICT (conversation_id, user_id) DO NOTHING;
  
  RAISE NOTICE 'Added user % to company chat %', target_user_id, company_conv_id;
  
  RETURN TRUE;
END;
$$;

-- 4. NEUER TRIGGER: Bei Consent-Erteilung → Company-Chat beitreten
CREATE OR REPLACE FUNCTION public.trg_consent_company_chat()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Nur wenn Consent NEU gegeben wurde (INSERT oder UPDATE von false → true)
  IF (TG_OP = 'INSERT' AND NEW.consent_given = true) OR
     (TG_OP = 'UPDATE' AND OLD.consent_given = false AND NEW.consent_given = true) THEN
    
    -- Füge User zum Company-Chat hinzu
    PERFORM public.add_user_to_company_chat(NEW.user_id, NEW.company_id);
    
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_consent_company_chat ON public.chat_consent;
CREATE TRIGGER trg_consent_company_chat
  AFTER INSERT OR UPDATE ON public.chat_consent
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_consent_company_chat();

-- 5. OPT-OUT HANDLER: Bei Opt-Out → Aus allen Chats entfernen
CREATE OR REPLACE FUNCTION public.trg_opt_out_remove_from_chats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Nur wenn Opt-Out NEU gesetzt wurde
  IF (TG_OP = 'UPDATE' AND OLD.opt_out = false AND NEW.opt_out = true) THEN
    
    -- Entferne User aus ALLEN Conversations der Company
    DELETE FROM public.chat_participants
    WHERE user_id = NEW.user_id
      AND conversation_id IN (
        SELECT id FROM public.chat_conversations WHERE company_id = NEW.company_id
      );
    
    RAISE NOTICE 'Removed user % from all chats due to opt-out', NEW.user_id;
    
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_opt_out_remove_from_chats ON public.chat_consent;
CREATE TRIGGER trg_opt_out_remove_from_chats
  AFTER UPDATE ON public.chat_consent
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_opt_out_remove_from_chats();

-- 6. BESTEHENDE USER MIGRIEREN (einmalig)
-- Alle User mit Consent → Company-Chat hinzufügen
DO $$
DECLARE
  consent_record RECORD;
BEGIN
  FOR consent_record IN 
    SELECT user_id, company_id 
    FROM public.chat_consent 
    WHERE consent_given = true AND opt_out = false
  LOOP
    PERFORM public.add_user_to_company_chat(
      consent_record.user_id, 
      consent_record.company_id
    );
  END LOOP;
  
  RAISE NOTICE 'Migration complete: Added existing consented users to company chats';
END $$;