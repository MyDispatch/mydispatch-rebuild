-- ============================================================================
-- PHASE 1: BACKEND-SICHERHEIT - Verbleibende Kritische Issues
-- ============================================================================

-- 1. FIX: Security Definer View (companies_with_full_address)
--    Problem: View nutzt SECURITY DEFINER, umgeht RLS-Policies
--    Lösung: Entferne SECURITY DEFINER, nutze SECURITY INVOKER

DROP VIEW IF EXISTS companies_with_full_address CASCADE;

CREATE VIEW companies_with_full_address
WITH (security_invoker = true) -- SECURITY INVOKER statt DEFINER
AS
SELECT 
  c.*,
  get_company_full_address(c.*) AS full_address,
  (c.latitude IS NOT NULL AND c.longitude IS NOT NULL) AS has_geocoded_location
FROM companies c;

COMMENT ON VIEW companies_with_full_address IS 
  'SECURITY: View uses SECURITY INVOKER to enforce RLS policies of querying user';

-- 2. FIX: Function Search Path für verbleibende Funktionen
--    Prüfe und fixe alle Funktionen ohne expliziten search_path

-- Funktion: update_special_accounts_updated_at
CREATE OR REPLACE FUNCTION public.update_special_accounts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Funktion: update_company_location_timestamp
CREATE OR REPLACE FUNCTION public.update_company_location_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
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

-- Funktion: get_partner_drivers
CREATE OR REPLACE FUNCTION public.get_partner_drivers(user_company_id uuid)
RETURNS TABLE(driver_id uuid, first_name text, last_name text, partner_company_id uuid, partner_company_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.first_name,
    d.last_name,
    c.id,
    c.name
  FROM drivers d
  JOIN companies c ON d.company_id = c.id
  JOIN partner_connections pc ON (
    (pc.company_a_id = user_company_id AND pc.company_b_id = c.id AND pc.share_drivers = true)
    OR (pc.company_b_id = user_company_id AND pc.company_a_id = c.id AND pc.share_drivers = true)
  )
  WHERE d.archived = false
    AND d.shift_status = 'available';
END;
$$;

-- Funktion: get_partner_vehicles
CREATE OR REPLACE FUNCTION public.get_partner_vehicles(user_company_id uuid)
RETURNS TABLE(vehicle_id uuid, license_plate text, vehicle_class vehicle_class, partner_company_id uuid, partner_company_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.license_plate,
    v.vehicle_class,
    c.id,
    c.name
  FROM vehicles v
  JOIN companies c ON v.company_id = c.id
  JOIN partner_connections pc ON (
    (pc.company_a_id = user_company_id AND pc.company_b_id = c.id AND pc.share_vehicles = true)
    OR (pc.company_b_id = user_company_id AND pc.company_a_id = c.id AND pc.share_vehicles = true)
  )
  WHERE v.archived = false
    AND v.status = 'available';
END;
$$;

-- Funktion: protect_created_at
CREATE OR REPLACE FUNCTION public.protect_created_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.created_at IS DISTINCT FROM NEW.created_at THEN
    RAISE EXCEPTION 'created_at darf nicht geändert werden (Eingangsstempel)';
  END IF;
  RETURN NEW;
END;
$$;

-- Funktion: validate_future_booking
CREATE OR REPLACE FUNCTION public.validate_future_booking()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
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

-- Funktion: generate_driver_address
CREATE OR REPLACE FUNCTION public.generate_driver_address()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.street IS NOT NULL AND NEW.street_number IS NOT NULL 
     AND NEW.postal_code IS NOT NULL AND NEW.city IS NOT NULL THEN
    NEW.address := NEW.street || ' ' || NEW.street_number || ', ' || NEW.postal_code || ' ' || NEW.city;
  END IF;
  RETURN NEW;
END;
$$;

-- Funktion: generate_customer_address
CREATE OR REPLACE FUNCTION public.generate_customer_address()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Hauptadresse
  IF NEW.street IS NOT NULL AND NEW.street_number IS NOT NULL 
     AND NEW.postal_code IS NOT NULL AND NEW.city IS NOT NULL THEN
    NEW.address := NEW.street || ' ' || NEW.street_number || ', ' || NEW.postal_code || ' ' || NEW.city;
  END IF;
  
  -- Rechnungsadresse
  IF NEW.billing_street IS NOT NULL AND NEW.billing_street_number IS NOT NULL 
     AND NEW.billing_postal_code IS NOT NULL AND NEW.billing_city IS NOT NULL THEN
    NEW.billing_address := NEW.billing_street || ' ' || NEW.billing_street_number || ', ' || NEW.billing_postal_code || ' ' || NEW.billing_city;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Funktion: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Funktion: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_company_id UUID;
BEGIN
  -- Create company
  INSERT INTO public.companies (
    name,
    email,
    tax_id
  ) VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Neues Unternehmen'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'tax_id', 'TEMP-' || substring(NEW.id::text, 1, 8))
  ) RETURNING id INTO new_company_id;

  -- Create profile
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

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');

  RETURN NEW;
END;
$$;

-- ============================================================================
-- SECURITY AUDIT COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.update_special_accounts_updated_at() IS 
  'SECURITY: DEFINER function with explicit search_path to prevent privilege escalation';

COMMENT ON FUNCTION public.get_partner_drivers(uuid) IS 
  'SECURITY: DEFINER function with explicit search_path for safe cross-company queries';

COMMENT ON FUNCTION public.get_partner_vehicles(uuid) IS 
  'SECURITY: DEFINER function with explicit search_path for safe cross-company queries';

COMMENT ON FUNCTION public.protect_created_at() IS 
  'SECURITY: Prevents modification of created_at timestamp (audit trail protection)';

COMMENT ON FUNCTION public.validate_future_booking() IS 
  'SECURITY: Prevents backdated bookings (business logic enforcement)';

COMMENT ON FUNCTION public.handle_new_user() IS 
  'SECURITY: DEFINER function for user registration, creates isolated company with admin role';

-- ============================================================================
-- END PHASE 1: BACKEND-SICHERHEIT
-- ============================================================================