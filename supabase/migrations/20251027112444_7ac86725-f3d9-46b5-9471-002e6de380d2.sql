-- Drop und neu erstelle Dashboard Stats Funktion (Fix für 406 Error)
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
  pending_revenue NUMERIC,
  partner_bookings BIGINT,
  partner_revenue NUMERIC,
  total_customers BIGINT,
  total_drivers BIGINT,
  total_vehicles BIGINT,
  last_refresh TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auth-Check
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND profiles.company_id = target_company_id
  ) THEN
    RAISE EXCEPTION 'Keine Berechtigung für diese Company-Daten';
  END IF;
  
  -- WICHTIG: Garantiere IMMER mindestens 1 Zeile (auch bei leerer DB)
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
    COALESCE((SELECT SUM(price) FROM bookings WHERE bookings.company_id = target_company_id AND payment_status IN ('pending', 'unpaid')), 0)::NUMERIC,
    COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.company_id = target_company_id AND is_partner_booking = true), 0)::BIGINT,
    COALESCE((SELECT SUM(price) FROM bookings WHERE bookings.company_id = target_company_id AND is_partner_booking = true), 0)::NUMERIC,
    COALESCE((SELECT COUNT(*) FROM customers WHERE customers.company_id = target_company_id AND archived = false), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM drivers WHERE drivers.company_id = target_company_id AND archived = false), 0)::BIGINT,
    COALESCE((SELECT COUNT(*) FROM vehicles WHERE vehicles.company_id = target_company_id AND archived = false), 0)::BIGINT,
    NOW();
END;
$$;

COMMENT ON FUNCTION public.get_dashboard_stats_for_company IS 'Returns exactly 1 row with dashboard stats (0-values if no data)';

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats_for_company(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats_for_company(UUID) TO anon;