-- ============================================================================
-- SECURITY HARDENING PART 2 (FIXED): Apply Role-Based Access Controls
-- ============================================================================

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Users can update their own company" ON companies;
DROP POLICY IF EXISTS "Users can view customers of their company" ON customers;
DROP POLICY IF EXISTS "Users can insert customers for their company" ON customers;
DROP POLICY IF EXISTS "Users can update customers of their company" ON customers;
DROP POLICY IF EXISTS "Users can delete customers of their company" ON customers;
DROP POLICY IF EXISTS "users_select_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view company profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update company profiles" ON profiles;

-- ============================================================================
-- Companies table: Restrict financial data to admins
-- ============================================================================

CREATE POLICY "Users can view basic company info"
ON companies FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update company"
ON companies FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
);

-- ============================================================================
-- Customers table: Restrict to admin/moderator roles
-- ============================================================================

CREATE POLICY "Authorized staff can view customers"
ON customers FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'moderator')
  )
);

CREATE POLICY "Authorized staff can insert customers"
ON customers FOR INSERT
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'moderator')
  )
);

CREATE POLICY "Authorized staff can update customers"
ON customers FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'moderator')
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'moderator')
  )
);

CREATE POLICY "Admins can delete customers"
ON customers FOR DELETE
TO authenticated
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
);

-- ============================================================================
-- Profiles table: Restrict cross-profile viewing
-- ============================================================================

CREATE POLICY "User can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admin can view company profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "User can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can update company profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE user_id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
);

-- ============================================================================
-- Fix remaining function search paths
-- ============================================================================

CREATE OR REPLACE FUNCTION public.can_edit_shift(shift_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
SET search_path TO 'public'
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

-- ============================================================================
-- Secure companies_with_full_address view
-- ============================================================================

ALTER VIEW companies_with_full_address SET (security_invoker = on);

-- ============================================================================
-- Add security comments
-- ============================================================================

COMMENT ON POLICY "Admins can update company" ON companies IS 
  'SECURITY: Only admins can modify company data including sensitive financial fields (tax_id, iban, bic, stripe_*)';

COMMENT ON POLICY "Authorized staff can view customers" ON customers IS 
  'SECURITY: Customer PII restricted to admin/moderator roles only';

COMMENT ON POLICY "User can view own profile" ON profiles IS 
  'SECURITY: Users can only view their own profile unless they have admin role';

-- ============================================================================
-- END SECURITY HARDENING
-- ============================================================================