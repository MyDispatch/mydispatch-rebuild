-- ============================================================================
-- FIX REMAINING FUNCTION SEARCH PATHS
-- ============================================================================

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

-- Note: get_company_full_address is IMMUTABLE and already has search_path set via table function definition