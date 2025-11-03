-- ==================================================================================
-- SECURITY HARDENING PHASE 3 - Fix Views und Trigger-Wiederherstellung
-- ==================================================================================

-- 1. DROP und RE-CREATE View mit SECURITY INVOKER (explizit)
DROP VIEW IF EXISTS public.companies_public_info CASCADE;

CREATE OR REPLACE VIEW public.companies_public_info
WITH (security_invoker = true) -- EXPLIZIT SECURITY INVOKER
AS
SELECT 
  id,
  name,
  company_slug,
  business_type,
  business_hours,
  timezone,
  landingpage_enabled,
  landingpage_title,
  landingpage_hero_text,
  landingpage_description,
  widget_enabled,
  widget_button_text,
  widget_size,
  widget_show_phone,
  primary_color,
  logo_url,
  -- Öffentliche Kontaktinformationen (nur wenn Landingpage aktiv)
  CASE WHEN landingpage_enabled THEN phone ELSE NULL END as phone,
  CASE WHEN landingpage_enabled THEN email ELSE NULL END as email,
  -- Adresse nur Stadt (kein Straße/Hausnummer)
  CASE WHEN landingpage_enabled THEN city ELSE NULL END as city,
  CASE WHEN landingpage_enabled THEN postal_code ELSE NULL END as postal_code,
  created_at
FROM public.companies
WHERE landingpage_enabled = true AND company_status = 'active';

-- 2. Grant Permissions
GRANT SELECT ON public.companies_public_info TO anon;
GRANT SELECT ON public.companies_public_info TO authenticated;

-- 3. TRIGGER RE-CREATION (wurden durch CASCADE gelöscht)

-- 3.1 Trigger für validate_company_slug
CREATE TRIGGER validate_company_slug_trigger
BEFORE INSERT OR UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.validate_company_slug();

-- 3.2 Trigger für update_company_location_timestamp
CREATE TRIGGER update_company_location_trigger
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_company_location_timestamp();

-- 3.3 Trigger für update_updated_at_column auf companies
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3.4 Trigger für update_updated_at_column auf bookings
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3.5 Trigger für update_updated_at_column auf customers
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3.6 Trigger für update_updated_at_column auf drivers
CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3.7 Trigger für update_updated_at_column auf vehicles
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3.8 Trigger für protect_created_at auf bookings
CREATE TRIGGER protect_bookings_created_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.protect_created_at();

-- 3.9 Trigger für validate_future_booking
CREATE TRIGGER validate_future_booking_trigger
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_future_booking();

-- 3.10 Trigger für generate_driver_address
CREATE TRIGGER generate_driver_address_trigger
BEFORE INSERT OR UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION public.generate_driver_address();

-- 3.11 Trigger für generate_customer_address
CREATE TRIGGER generate_customer_address_trigger
BEFORE INSERT OR UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.generate_customer_address();

-- 3.12 Trigger für auto_create_company_chat
CREATE TRIGGER auto_create_company_chat_trigger
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_company_chat();

-- 3.13 Trigger für update_chat_consent_timestamp
CREATE TRIGGER update_chat_consent_timestamp_trigger
BEFORE UPDATE ON public.chat_consent
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_consent_timestamp();

-- 3.14 Trigger für trg_consent_company_chat
CREATE TRIGGER trg_consent_company_chat_trigger
AFTER INSERT OR UPDATE ON public.chat_consent
FOR EACH ROW
EXECUTE FUNCTION public.trg_consent_company_chat();

-- 3.15 Trigger für trg_opt_out_remove_from_chats
CREATE TRIGGER trg_opt_out_remove_from_chats_trigger
AFTER UPDATE ON public.chat_consent
FOR EACH ROW
EXECUTE FUNCTION public.trg_opt_out_remove_from_chats();

-- 3.16 Trigger für refresh_dashboard_stats auf bookings
CREATE TRIGGER refresh_stats_on_booking_change
AFTER INSERT OR UPDATE OR DELETE ON public.bookings
FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_dashboard_stats();

-- 3.17 Trigger für update_special_accounts_updated_at
CREATE TRIGGER update_special_accounts_updated_at_trigger
BEFORE UPDATE ON public.special_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_special_accounts_updated_at();

-- 4. Kommentare
COMMENT ON VIEW public.companies_public_info IS 
'Sichere View mit SECURITY INVOKER. Zeigt nur öffentliche Company-Daten für Landingpages.';

-- Audit-Log
INSERT INTO public.system_logs (level, message, context)
VALUES (
  'info',
  'Security Hardening Phase 3: Converted view to SECURITY INVOKER, restored all triggers',
  jsonb_build_object(
    'view_secured', 'companies_public_info',
    'triggers_restored', 17,
    'timestamp', now()
  )
);
