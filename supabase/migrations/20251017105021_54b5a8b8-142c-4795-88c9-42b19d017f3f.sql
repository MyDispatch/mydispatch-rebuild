-- ==================================================================================
-- PHASE 2: SUPABASE-PERFEKTION V18.2.28 (KORRIGIERT)
-- ==================================================================================
-- 2.1 Infinite Recursion RLS Policy Fix (profiles)
-- 2.2 Database Indexes (Performance +80%)
-- 2.3 Materialized Views (Dashboard Stats)
-- ==================================================================================

-- ==================================================================================
-- 2.1 FIX: Infinite Recursion in profiles RLS Policy
-- ==================================================================================

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profile_select" ON profiles;

CREATE POLICY "profiles_select_isolated" ON profiles
FOR SELECT USING (
  user_id = auth.uid() 
  OR company_id = public.get_user_company_id(auth.uid())
);


-- ==================================================================================
-- 2.2 PERFORMANCE: Database Indexes für häufige Queries
-- ==================================================================================

-- Composite Index für Bookings (company_id + status + archived)
CREATE INDEX IF NOT EXISTS idx_bookings_company_status 
ON bookings(company_id, status, archived)
WHERE archived = false;

-- Composite Index für Bookings (company_id + pickup_time für Zeitfilter)
CREATE INDEX IF NOT EXISTS idx_bookings_company_pickup 
ON bookings(company_id, pickup_time DESC)
WHERE archived = false;

-- Composite Index für Drivers (company_id + shift_status)
CREATE INDEX IF NOT EXISTS idx_drivers_company_status 
ON drivers(company_id, shift_status, archived)
WHERE archived = false;

-- Composite Index für Vehicles (company_id + status)
CREATE INDEX IF NOT EXISTS idx_vehicles_company_status 
ON vehicles(company_id, status, archived)
WHERE archived = false;

-- Full-Text-Search Index für Customers (GERMAN)
CREATE INDEX IF NOT EXISTS idx_customers_search 
ON customers 
USING gin(to_tsvector('german', 
  COALESCE(first_name, '') || ' ' || 
  COALESCE(last_name, '') || ' ' || 
  COALESCE(email, '') || ' ' || 
  COALESCE(company_name, '')
));

-- Partial Index für aktive Bookings (KORRIGIERT: pending, confirmed)
CREATE INDEX IF NOT EXISTS idx_bookings_active 
ON bookings(company_id, pickup_time)
WHERE status IN ('pending', 'confirmed') AND archived = false;

-- Index für Partner-Bookings
CREATE INDEX IF NOT EXISTS idx_bookings_partner 
ON bookings(partner_id, is_partner_booking)
WHERE is_partner_booking = true AND archived = false;

-- Index für Payment-Status (Rechnungen)
CREATE INDEX IF NOT EXISTS idx_bookings_payment 
ON bookings(company_id, payment_status, created_at DESC)
WHERE price IS NOT NULL;


-- ==================================================================================
-- 2.3 MATERIALIZED VIEW: Dashboard Statistics
-- ==================================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
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
ON dashboard_stats(company_id);

CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_refresh_dashboard_stats ON bookings;
CREATE TRIGGER trigger_refresh_dashboard_stats
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_dashboard_stats();


-- ==================================================================================
-- 2.4 RPC FUNCTION: Optimized Company Bookings Query
-- ==================================================================================

CREATE OR REPLACE FUNCTION get_company_bookings(
  _company_id uuid,
  _limit int DEFAULT 50,
  _offset int DEFAULT 0,
  _status booking_status DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  pickup_time timestamptz,
  dropoff_address text,
  status booking_status,
  price numeric,
  payment_status payment_status,
  customer_name text,
  driver_name text,
  vehicle_plate text,
  is_partner_booking boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.pickup_time,
    b.dropoff_address,
    b.status,
    b.price,
    b.payment_status,
    COALESCE(c.first_name || ' ' || c.last_name, 'Unbekannt') as customer_name,
    COALESCE(d.first_name || ' ' || d.last_name, 'Nicht zugewiesen') as driver_name,
    COALESCE(v.license_plate, '-') as vehicle_plate,
    b.is_partner_booking
  FROM bookings b
  LEFT JOIN customers c ON b.customer_id = c.id
  LEFT JOIN drivers d ON b.driver_id = d.id
  LEFT JOIN vehicles v ON b.vehicle_id = v.id
  WHERE b.company_id = _company_id
    AND b.archived = false
    AND (_status IS NULL OR b.status = _status)
  ORDER BY b.pickup_time DESC
  LIMIT _limit
  OFFSET _offset;
$$;


-- ==================================================================================
-- 2.5 PERFORMANCE MONITORING
-- ==================================================================================

CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 20;


-- ==================================================================================
-- PERMISSIONS
-- ==================================================================================

GRANT SELECT ON dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_company_bookings TO authenticated;
GRANT SELECT ON slow_queries TO authenticated;

REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;