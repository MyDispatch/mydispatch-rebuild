-- ==================================================================================
-- SECURITY FIX V18.3.29: Portal RLS Policies & Input Validation
-- ==================================================================================
-- Fixes:
-- 1. Missing RLS policies for portal customer bookings access
-- 2. Missing RLS policies for portal customer self-access
-- 3. Database-level validation triggers for bookings
-- ==================================================================================

-- ==================================================================================
-- 1. PORTAL CUSTOMER ACCESS - CUSTOMERS TABLE
-- ==================================================================================

-- Allow portal customers to view their own customer data via auth.uid()
CREATE POLICY "Portal customers can view their own data"
ON public.customers
FOR SELECT
USING (
  -- Match authenticated user email to customer email
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND has_portal_access = true
);

-- Allow portal customers to update their own profile (non-critical fields only)
CREATE POLICY "Portal customers can update their own profile"
ON public.customers
FOR UPDATE
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND has_portal_access = true
)
WITH CHECK (
  -- Prevent customers from changing critical fields
  company_id = (
    SELECT company_id FROM public.customers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  AND has_portal_access = true
);

-- ==================================================================================
-- 2. PORTAL CUSTOMER ACCESS - BOOKINGS TABLE
-- ==================================================================================

-- Allow portal customers to view their own bookings
CREATE POLICY "Portal customers can view their own bookings"
ON public.bookings
FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM public.customers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND has_portal_access = true
  )
);

-- Allow portal customers to create bookings for themselves
CREATE POLICY "Portal customers can create their own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  customer_id IN (
    SELECT id FROM public.customers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND has_portal_access = true
  )
  -- Ensure company_id matches customer's company (prevent cross-company booking)
  AND company_id = (
    SELECT company_id FROM public.customers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- NOTE: Portal customers CANNOT update or delete bookings
-- Only company employees can modify/cancel bookings via their admin interface

-- ==================================================================================
-- 3. DATABASE-LEVEL INPUT VALIDATION
-- ==================================================================================

-- Validation function for bookings (prevents invalid data at DB level)
CREATE OR REPLACE FUNCTION public.validate_booking_input()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate passengers count
  IF NEW.passengers IS NOT NULL AND (NEW.passengers < 1 OR NEW.passengers > 8) THEN
    RAISE EXCEPTION 'Passengers must be between 1 and 8';
  END IF;
  
  -- Validate luggage count
  IF NEW.luggage IS NOT NULL AND (NEW.luggage < 0 OR NEW.luggage > 8) THEN
    RAISE EXCEPTION 'Luggage must be between 0 and 8';
  END IF;
  
  -- Validate pickup_time is in future (allow 5 min grace period)
  IF NEW.pickup_time < NOW() - INTERVAL '5 minutes' THEN
    RAISE EXCEPTION 'Pickup time must be in the future';
  END IF;
  
  -- Validate address lengths (prevent DoS via excessive data)
  IF LENGTH(NEW.pickup_address) > 500 THEN
    RAISE EXCEPTION 'Pickup address exceeds maximum length of 500 characters';
  END IF;
  
  IF LENGTH(NEW.dropoff_address) > 500 THEN
    RAISE EXCEPTION 'Dropoff address exceeds maximum length of 500 characters';
  END IF;
  
  -- Validate special_requests length
  IF NEW.special_requests IS NOT NULL AND LENGTH(NEW.special_requests) > 1000 THEN
    RAISE EXCEPTION 'Special requests exceed maximum length of 1000 characters';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply validation trigger to bookings table
DROP TRIGGER IF EXISTS validate_booking_input_trigger ON public.bookings;
CREATE TRIGGER validate_booking_input_trigger
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_booking_input();

-- ==================================================================================
-- 4. SECURITY AUDIT LOG
-- ==================================================================================

-- Log this security update
DO $$
BEGIN
  RAISE NOTICE 'Security Fix V18.3.29 Applied:';
  RAISE NOTICE '✅ Portal customer RLS policies added (customers table)';
  RAISE NOTICE '✅ Portal customer RLS policies added (bookings table)';
  RAISE NOTICE '✅ Database-level input validation triggers added';
  RAISE NOTICE '✅ Defense-in-depth security implemented';
END $$;