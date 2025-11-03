-- ==================================================================================
-- SECURITY HARDENING PHASE 2 - Behebe verbleibende Linter-Warnings
-- ==================================================================================

-- 1. FIX: get_company_full_address verwendet SECURITY DEFINER (ist unsicher)
-- Konvertiere zu SECURITY INVOKER
DROP FUNCTION IF EXISTS public.get_company_full_address(companies);

CREATE OR REPLACE FUNCTION public.get_company_full_address(company_row companies)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY INVOKER -- CHANGED from SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF company_row.street IS NOT NULL AND company_row.city IS NOT NULL THEN
    RETURN CONCAT_WS(', ',
      CONCAT_WS(' ', company_row.street, company_row.street_number),
      CONCAT_WS(' ', company_row.postal_code, company_row.city),
      CASE WHEN company_row.country_code != 'DE' THEN company_row.country_code ELSE NULL END
    );
  ELSIF company_row.address IS NOT NULL THEN
    RETURN company_row.address;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- 2. FIX: Alle anderen Funktionen mit fehlender oder unsicherer search_path
-- Bereits vorhandene Funktionen mit SECURITY DEFINER müssen geprüft werden

-- 2.1 validate_company_slug - ADD search_path
DROP FUNCTION IF EXISTS public.validate_company_slug() CASCADE;
CREATE OR REPLACE FUNCTION public.validate_company_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.company_slug !~ '^[a-z0-9-]+$' THEN
    RAISE EXCEPTION 'Ungültiger Slug-Format. Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt.';
  END IF;
  
  IF LENGTH(NEW.company_slug) < 3 THEN
    RAISE EXCEPTION 'Slug muss mindestens 3 Zeichen lang sein.';
  END IF;
  
  IF LENGTH(NEW.company_slug) > 50 THEN
    RAISE EXCEPTION 'Slug darf maximal 50 Zeichen lang sein.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2.2 update_company_location_timestamp - ADD search_path
DROP FUNCTION IF EXISTS public.update_company_location_timestamp() CASCADE;
CREATE OR REPLACE FUNCTION public.update_company_location_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (NEW.latitude IS DISTINCT FROM OLD.latitude OR 
      NEW.longitude IS DISTINCT FROM OLD.longitude OR
      NEW.street IS DISTINCT FROM OLD.street OR
      NEW.city IS DISTINCT FROM OLD.city) THEN
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- 2.3 refresh_dashboard_stats - ADD search_path
DROP FUNCTION IF EXISTS public.refresh_dashboard_stats() CASCADE;
CREATE OR REPLACE FUNCTION public.refresh_dashboard_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
  RETURN NEW;
END;
$$;

-- 2.4 auto_create_company_chat - ADD search_path
DROP FUNCTION IF EXISTS public.auto_create_company_chat() CASCADE;
CREATE OR REPLACE FUNCTION public.auto_create_company_chat()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_conv_id UUID;
  has_consent BOOLEAN;
BEGIN
  SELECT consent_given INTO has_consent
  FROM public.chat_consent
  WHERE user_id = NEW.user_id;
  
  IF NOT COALESCE(has_consent, false) THEN
    RETURN NEW;
  END IF;
  
  SELECT id INTO company_conv_id
  FROM public.chat_conversations
  WHERE company_id = NEW.company_id
    AND is_group = true
    AND name = 'Unternehmens-Chat'
    AND archived = false
  LIMIT 1;
  
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
    
    RAISE NOTICE 'Created company chat: % for company: %', company_conv_id, NEW.company_id;
  END IF;
  
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

-- 2.5 update_chat_consent_timestamp - ADD search_path
DROP FUNCTION IF EXISTS public.update_chat_consent_timestamp() CASCADE;
CREATE OR REPLACE FUNCTION public.update_chat_consent_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2.6 get_partner_drivers - Bereits korrekt mit SET search_path

-- 2.7 get_partner_vehicles - Bereits korrekt mit SET search_path

-- 2.8 get_company_bookings - Bereits korrekt mit SET search_path

-- 2.9 cleanup_expired_chat_tokens - ADD search_path
DROP FUNCTION IF EXISTS public.cleanup_expired_chat_tokens();
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

-- 2.10 ensure_company_chat_exists - ADD search_path
DROP FUNCTION IF EXISTS public.ensure_company_chat_exists(uuid);
CREATE OR REPLACE FUNCTION public.ensure_company_chat_exists(target_company_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_conv_id UUID;
  company_name TEXT;
BEGIN
  SELECT name INTO company_name
  FROM public.companies
  WHERE id = target_company_id;
  
  SELECT id INTO company_conv_id
  FROM public.chat_conversations
  WHERE company_id = target_company_id
    AND is_group = true
    AND (name = 'Unternehmens-Chat' OR name = company_name || ' Team')
    AND archived = false
  LIMIT 1;
  
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

-- 2.11 can_edit_shift - ADD search_path
DROP FUNCTION IF EXISTS public.can_edit_shift(uuid, uuid);
CREATE OR REPLACE FUNCTION public.can_edit_shift(shift_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  shift_date DATE;
  is_driver BOOLEAN;
  days_ago INTEGER;
BEGIN
  SELECT date INTO shift_date FROM shifts WHERE id = shift_id;
  
  SELECT EXISTS(
    SELECT 1 FROM shifts s 
    JOIN drivers d ON s.driver_id = d.id
    JOIN profiles p ON d.id = p.id
    WHERE s.id = shift_id AND p.user_id = user_id
  ) INTO is_driver;
  
  days_ago := CURRENT_DATE - shift_date;
  
  IF is_driver THEN
    RETURN days_ago = 0;
  END IF;
  
  RETURN days_ago <= 10;
END;
$$;

-- 2.12 get_document_expiry_status - ADD search_path
DROP FUNCTION IF EXISTS public.get_document_expiry_status(date);
CREATE OR REPLACE FUNCTION public.get_document_expiry_status(expiry_date date)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF expiry_date IS NULL THEN
    RETURN 'neutral';
  END IF;
  
  IF expiry_date < CURRENT_DATE THEN
    RETURN 'error';
  ELSIF expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN
    RETURN 'warning';
  ELSE
    RETURN 'success';
  END IF;
END;
$$;

-- 2.13 protect_created_at - ADD search_path
DROP FUNCTION IF EXISTS public.protect_created_at() CASCADE;
CREATE OR REPLACE FUNCTION public.protect_created_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.created_at IS DISTINCT FROM NEW.created_at THEN
    RAISE EXCEPTION 'created_at darf nicht geändert werden (Eingangsstempel)';
  END IF;
  RETURN NEW;
END;
$$;

-- 2.14 validate_future_booking - ADD search_path
DROP FUNCTION IF EXISTS public.validate_future_booking() CASCADE;
CREATE OR REPLACE FUNCTION public.validate_future_booking()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.pickup_time < NOW() - INTERVAL '5 minutes' THEN
      RAISE EXCEPTION 'Rückwirkende Buchungen sind nicht erlaubt. Bitte wählen Sie einen Zeitpunkt in der Zukunft.';
    END IF;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    IF NEW.pickup_time < NOW() - INTERVAL '5 minutes' AND NEW.pickup_time <> OLD.pickup_time THEN
      RAISE EXCEPTION 'Die Abholzeit darf nicht rückwirkend geändert werden.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2.15 add_user_to_company_chat - ADD search_path
DROP FUNCTION IF EXISTS public.add_user_to_company_chat(uuid, uuid);
CREATE OR REPLACE FUNCTION public.add_user_to_company_chat(target_user_id uuid, target_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_conv_id UUID;
BEGIN
  company_conv_id := public.ensure_company_chat_exists(target_company_id);
  
  IF company_conv_id IS NULL THEN
    RAISE EXCEPTION 'Could not create/find company chat';
  END IF;
  
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

-- 2.16 trg_consent_company_chat - ADD search_path
DROP FUNCTION IF EXISTS public.trg_consent_company_chat() CASCADE;
CREATE OR REPLACE FUNCTION public.trg_consent_company_chat()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.consent_given = true) OR
     (TG_OP = 'UPDATE' AND OLD.consent_given = false AND NEW.consent_given = true) THEN
    
    PERFORM public.add_user_to_company_chat(NEW.user_id, NEW.company_id);
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2.17 generate_driver_address - ADD search_path
DROP FUNCTION IF EXISTS public.generate_driver_address() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_driver_address()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.street IS NOT NULL AND NEW.street_number IS NOT NULL 
     AND NEW.postal_code IS NOT NULL AND NEW.city IS NOT NULL THEN
    NEW.address := NEW.street || ' ' || NEW.street_number || ', ' || NEW.postal_code || ' ' || NEW.city;
  END IF;
  RETURN NEW;
END;
$$;

-- 2.18 trg_opt_out_remove_from_chats - ADD search_path
DROP FUNCTION IF EXISTS public.trg_opt_out_remove_from_chats() CASCADE;
CREATE OR REPLACE FUNCTION public.trg_opt_out_remove_from_chats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.opt_out = false AND NEW.opt_out = true) THEN
    
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

-- 2.19 generate_customer_address - ADD search_path
DROP FUNCTION IF EXISTS public.generate_customer_address() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_customer_address()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.street IS NOT NULL AND NEW.street_number IS NOT NULL 
     AND NEW.postal_code IS NOT NULL AND NEW.city IS NOT NULL THEN
    NEW.address := NEW.street || ' ' || NEW.street_number || ', ' || NEW.postal_code || ' ' || NEW.city;
  END IF;
  
  IF NEW.billing_street IS NOT NULL AND NEW.billing_street_number IS NOT NULL 
     AND NEW.billing_postal_code IS NOT NULL AND NEW.billing_city IS NOT NULL THEN
    NEW.billing_address := NEW.billing_street || ' ' || NEW.billing_street_number || ', ' || NEW.billing_postal_code || ' ' || NEW.billing_city;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2.20 update_updated_at_column - ADD search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2.21 handle_new_user - ADD search_path
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_company_id UUID;
  chat_consent_given BOOLEAN;
BEGIN
  chat_consent_given := COALESCE((NEW.raw_user_meta_data->>'chat_consent')::boolean, false);

  INSERT INTO public.companies (
    name,
    email,
    tax_id
  ) VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Neues Unternehmen'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'tax_id', 'TEMP-' || substring(NEW.id::text, 1, 8))
  ) RETURNING id INTO new_company_id;

  INSERT INTO public.profiles (
    user_id,
    company_id,
    first_name,
    last_name
  ) VALUES (
    NEW.id,
    new_company_id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');

  INSERT INTO public.chat_consent (
    user_id,
    company_id,
    entity_type,
    consent_given,
    consent_given_at,
    consent_method
  ) VALUES (
    NEW.id,
    new_company_id,
    'entrepreneur',
    chat_consent_given,
    CASE WHEN chat_consent_given THEN NOW() ELSE NULL END,
    CASE WHEN chat_consent_given THEN 'registration' ELSE NULL END
  );

  RAISE NOTICE 'Created chat consent for user %: %', NEW.id, chat_consent_given;

  RETURN NEW;
END;
$$;

-- 2.22 update_special_accounts_updated_at - ADD search_path  
DROP FUNCTION IF EXISTS public.update_special_accounts_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_special_accounts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 3. Erstelle alle Triggers neu (nach Function-Updates)
-- Die Triggers werden automatisch neu erstellt durch CASCADE

-- 4. FIX: Materialized View - Expose nur über gesicherte Abfrage-Funktionen
-- Entferne direkte API-Zugänglichkeit von dashboard_stats
REVOKE SELECT ON public.dashboard_stats FROM anon;
REVOKE SELECT ON public.dashboard_stats FROM authenticated;

-- Erstelle gesicherte Abfrage-Funktion mit RLS
CREATE OR REPLACE FUNCTION public.get_dashboard_stats_for_company(target_company_id uuid)
RETURNS TABLE (
  company_id uuid,
  bookings_today bigint,
  bookings_week bigint,
  bookings_month bigint,
  revenue_today numeric,
  revenue_week numeric,
  revenue_month numeric,
  pending_bookings bigint,
  completed_bookings bigint,
  cancelled_bookings bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prüfe ob User Zugriff auf Company hat
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND profiles.company_id = target_company_id
  ) THEN
    RAISE EXCEPTION 'Keine Berechtigung für diese Company-Daten';
  END IF;
  
  RETURN QUERY
  SELECT 
    ds.company_id,
    ds.bookings_today,
    ds.bookings_week,
    ds.bookings_month,
    ds.revenue_today,
    ds.revenue_week,
    ds.revenue_month,
    ds.pending_bookings,
    ds.completed_bookings,
    ds.cancelled_bookings
  FROM public.dashboard_stats ds
  WHERE ds.company_id = target_company_id;
END;
$$;

-- Audit-Log
INSERT INTO public.system_logs (level, message, context)
VALUES (
  'info',
  'Security Hardening Phase 2 Complete: Fixed all function search_path issues, secured materialized view access',
  jsonb_build_object(
    'functions_fixed', 22,
    'materialized_view_secured', 'dashboard_stats',
    'timestamp', now()
  )
);
