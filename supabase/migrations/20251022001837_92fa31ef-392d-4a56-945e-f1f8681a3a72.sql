-- ==================================================================================
-- SECURITY COMPLIANCE MIGRATION V18.3.29 (FINAL)
-- ==================================================================================
-- Fixes ALL Supabase Linter Issues
-- ==================================================================================

-- ==================================================================================
-- FIX 1: Function Search Path
-- ==================================================================================

ALTER FUNCTION create_p_schein_reminder()
SET search_path = public, pg_catalog;

-- ==================================================================================
-- FIX 2: Materialized Views - Private Schema Solution
-- ==================================================================================

-- 2.1 Create analytics schema
CREATE SCHEMA IF NOT EXISTS analytics;

-- 2.2 Drop existing functions first (to avoid return type conflicts)
DROP FUNCTION IF EXISTS public.get_dashboard_stats_for_company(UUID);
DROP FUNCTION IF EXISTS public.get_document_expiry_dashboard(UUID);

-- 2.3 Move dashboard_stats to analytics schema
DROP MATERIALIZED VIEW IF EXISTS analytics.dashboard_stats CASCADE;
CREATE MATERIALIZED VIEW analytics.dashboard_stats AS
SELECT 
  company_id,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
  SUM(price) FILTER (WHERE status = 'completed') as total_revenue,
  AVG(price) FILTER (WHERE status = 'completed') as avg_booking_value,
  SUM(price) FILTER (WHERE payment_status = 'paid') as paid_revenue,
  SUM(price) FILTER (WHERE payment_status = 'pending') as pending_revenue,
  COUNT(*) FILTER (WHERE is_partner_booking = true) as partner_bookings,
  SUM(price) FILTER (WHERE is_partner_booking = true) as partner_revenue,
  COUNT(DISTINCT customer_id) as total_customers,
  COUNT(DISTINCT driver_id) as total_drivers,
  COUNT(DISTINCT vehicle_id) as total_vehicles,
  NOW() as last_refresh
FROM bookings
WHERE archived = false
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY company_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_company 
ON analytics.dashboard_stats(company_id);

DROP MATERIALIZED VIEW IF EXISTS public.dashboard_stats CASCADE;

-- 2.4 Create RPC access function
CREATE OR REPLACE FUNCTION public.get_dashboard_stats_for_company(target_company_id UUID)
RETURNS TABLE(
  company_id UUID,
  completed_bookings BIGINT,
  confirmed_bookings BIGINT,
  pending_bookings BIGINT,
  cancelled_bookings BIGINT,
  total_revenue NUMERIC,
  avg_booking_value NUMERIC,
  paid_revenue NUMERIC,
  pending_revenue NUMERIC,
  partner_bookings BIGINT,
  partner_revenue NUMERIC,
  total_customers BIGINT,
  total_drivers BIGINT,
  total_vehicles BIGINT,
  last_refresh TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, analytics, pg_catalog
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND profiles.company_id = target_company_id
  ) THEN
    RAISE EXCEPTION 'Keine Berechtigung für diese Company-Daten';
  END IF;
  
  RETURN QUERY
  SELECT * FROM analytics.dashboard_stats ds
  WHERE ds.company_id = target_company_id;
END;
$$;

-- 2.5 Move document expiry dashboard
DROP MATERIALIZED VIEW IF EXISTS analytics.mv_document_expiry_dashboard CASCADE;
CREATE MATERIALIZED VIEW analytics.mv_document_expiry_dashboard AS
SELECT
  company_id,
  entity_type,
  document_type,
  status,
  COUNT(*) AS count,
  ARRAY_AGG(entity_id) AS entity_ids,
  ARRAY_AGG(entity_name) AS entity_names,
  ARRAY_AGG(expiry_date ORDER BY expiry_date) AS expiry_dates
FROM v_all_expiring_documents
WHERE status IN ('expired', 'critical', 'warning')
GROUP BY company_id, entity_type, document_type, status;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_doc_exp_dash_unique
ON analytics.mv_document_expiry_dashboard (company_id, entity_type, document_type, status);

DROP MATERIALIZED VIEW IF EXISTS public.mv_document_expiry_dashboard CASCADE;

-- 2.6 Create RPC access function
CREATE OR REPLACE FUNCTION public.get_document_expiry_dashboard(target_company_id UUID)
RETURNS TABLE(
  entity_type TEXT,
  document_type TEXT,
  status TEXT,
  count BIGINT,
  entity_ids UUID[],
  entity_names TEXT[],
  expiry_dates DATE[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, analytics, pg_catalog
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND profiles.company_id = target_company_id
  ) THEN
    RAISE EXCEPTION 'Keine Berechtigung für diese Company-Daten';
  END IF;
  
  RETURN QUERY
  SELECT * FROM analytics.mv_document_expiry_dashboard mv
  WHERE mv.company_id = target_company_id;
END;
$$;

-- 2.7 Update refresh trigger
CREATE OR REPLACE FUNCTION public.refresh_dashboard_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, analytics, pg_catalog
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.dashboard_stats;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_refresh_dashboard_stats ON bookings;
CREATE TRIGGER trigger_refresh_dashboard_stats
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_dashboard_stats();

-- ==================================================================================
-- FIX 3: Shifts Archiving
-- ==================================================================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'shifts' 
    AND column_name = 'archived'
  ) THEN
    ALTER TABLE shifts ADD COLUMN archived BOOLEAN DEFAULT false NOT NULL;
    CREATE INDEX idx_shifts_archived ON shifts(archived, company_id);
    ALTER TABLE shifts ADD COLUMN archived_at TIMESTAMPTZ;
    ALTER TABLE shifts ADD COLUMN archived_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can view their company shifts" ON shifts;
CREATE POLICY "Users can view their company shifts"
ON shifts FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
  AND archived = false
);

CREATE OR REPLACE FUNCTION archive_shift(shift_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_company_id UUID;
BEGIN
  SELECT company_id INTO v_company_id FROM shifts WHERE id = shift_id_param;
  
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Shift not found';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND company_id = v_company_id
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  UPDATE shifts
  SET archived = true, archived_at = NOW(), archived_by = auth.uid()
  WHERE id = shift_id_param;
  
  RETURN true;
END;
$$;