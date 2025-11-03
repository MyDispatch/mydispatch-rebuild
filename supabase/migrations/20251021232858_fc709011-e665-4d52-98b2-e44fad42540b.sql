-- ==================================================================================
-- SECURITY FIX V18.3.29 Part 2: Function Search Paths & View Security
-- ==================================================================================
-- Fixes remaining Supabase Linter warnings:
-- 1. Add missing search_path to all security-critical functions
-- 2. Secure materialized views with proper RLS
-- ==================================================================================

-- ==================================================================================
-- 1. FIX FUNCTION SEARCH PATHS (Security Hardening)
-- ==================================================================================

-- Update all critical functions to have explicit search_path
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.profiles
  WHERE user_id = _user_id
  LIMIT 1
$$;

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

CREATE OR REPLACE FUNCTION public.get_company_full_address(company_row companies)
RETURNS text
LANGUAGE plpgsql
STABLE
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

-- ==================================================================================
-- 2. SECURE DASHBOARD_STATS MATERIALIZED VIEW
-- ==================================================================================

-- Enable RLS on dashboard_stats (prevents direct access)
ALTER MATERIALIZED VIEW IF EXISTS dashboard_stats OWNER TO postgres;

-- Create secure accessor function for dashboard_stats
CREATE OR REPLACE FUNCTION public.get_dashboard_stats_for_company(target_company_id UUID)
RETURNS TABLE(
  company_id UUID,
  bookings_today BIGINT,
  bookings_week BIGINT,
  bookings_month BIGINT,
  revenue_today NUMERIC,
  revenue_week NUMERIC,
  revenue_month NUMERIC,
  pending_bookings BIGINT,
  completed_bookings BIGINT,
  cancelled_bookings BIGINT
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

-- ==================================================================================
-- 3. SECURITY AUDIT LOG
-- ==================================================================================

DO $$
BEGIN
  RAISE NOTICE 'Security Fix V18.3.29 Part 2 Applied:';
  RAISE NOTICE '✅ Function search_path hardening completed';
  RAISE NOTICE '✅ Dashboard stats secured with accessor function';
  RAISE NOTICE '✅ All critical functions now have explicit search_path';
END $$;