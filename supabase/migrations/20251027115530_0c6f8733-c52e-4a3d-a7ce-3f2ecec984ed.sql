-- FIX: Invalid ENUM value 'unpaid' in get_dashboard_stats_for_company
-- payment_status ENUM has: 'cancelled', 'overdue', 'paid', 'pending'
-- Replace 'unpaid' with 'pending' and 'overdue' for unpaid calculations

DROP FUNCTION IF EXISTS public.get_dashboard_stats_for_company(UUID);

CREATE OR REPLACE FUNCTION public.get_dashboard_stats_for_company(target_company_id UUID)
RETURNS TABLE (
  company_id UUID,
  completed_bookings BIGINT,
  confirmed_bookings BIGINT,
  pending_bookings BIGINT,
  cancelled_bookings BIGINT,
  total_revenue NUMERIC,
  avg_booking_value NUMERIC,
  paid_revenue NUMERIC,
  unpaid_revenue NUMERIC,
  partner_bookings BIGINT,
  partner_revenue NUMERIC,
  total_customers BIGINT,
  total_drivers BIGINT,
  total_vehicles BIGINT,
  last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Genau 1 Row zurückgeben (auch wenn keine Daten)
  RETURN QUERY
  SELECT 
    target_company_id,
    COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.company_id = target_company_id AND status = 'completed'), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.company_id = target_company_id AND status = 'confirmed'), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.company_id = target_company_id AND status = 'pending'), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.company_id = target_company_id AND status = 'cancelled'), 0)::BIGINT,
    COALESCE((SELECT SUM(price) FROM bookings WHERE bookings.company_id = target_company_id AND price IS NOT NULL), 0)::NUMERIC,
    COALESCE((SELECT AVG(price) FROM bookings WHERE bookings.company_id = target_company_id AND price IS NOT NULL), 0)::NUMERIC,
    COALESCE((SELECT SUM(price) FROM bookings WHERE bookings.company_id = target_company_id AND payment_status = 'paid'), 0)::NUMERIC,
    -- FIX: Changed from 'unpaid' to 'pending' and 'overdue' (both represent unpaid bookings)
    COALESCE((SELECT SUM(price) FROM bookings WHERE bookings.company_id = target_company_id AND payment_status IN ('pending', 'overdue', 'cancelled')), 0)::NUMERIC,
    COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.company_id = target_company_id AND is_partner_booking = true), 0)::BIGINT,
    COALESCE((SELECT SUM(price) FROM bookings WHERE bookings.company_id = target_company_id AND is_partner_booking = true), 0)::NUMERIC,
    COALESCE((SELECT COUNT(*) FROM customers WHERE customers.company_id = target_company_id AND archived = false), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM drivers WHERE drivers.company_id = target_company_id AND archived = false), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM vehicles WHERE vehicles.company_id = target_company_id AND archived = false), 0)::BIGINT,
    NOW();
END;
$$;

COMMENT ON FUNCTION public.get_dashboard_stats_for_company IS 'Returns exactly 1 row with dashboard stats (0-values if no data). Fixed: replaced invalid ''unpaid'' with valid ENUM values.';

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats_for_company(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats_for_company(UUID) TO anon;