-- ==================================================================================
-- CRITICAL SECURITY FIX V18.3.26 - RLS Policy Corrections (Clean Approach)
-- ==================================================================================

-- ============================================
-- FIX 1: Companies Table - Restrict Public Access
-- ============================================
DROP POLICY IF EXISTS "Public can view landing page info ONLY" ON public.companies;
DROP POLICY IF EXISTS "Public can verify landingpage exists" ON public.companies;
DROP POLICY IF EXISTS "Public can view safe landingpage info" ON public.companies;

-- Neue restriktive Policy - nur Landing-Page-Daten
CREATE POLICY "Public landing page data only"
ON public.companies
FOR SELECT
TO anon
USING (
  landingpage_enabled = true 
  AND company_status = 'active'
);

-- Authenticated users sehen nur ihre eigene Company (bereits vorhanden via company_select_policy)

-- ============================================
-- FIX 2: Customers Table - Add Auth Check
-- ============================================
DROP POLICY IF EXISTS "customer_select_policy" ON public.customers;
DROP POLICY IF EXISTS "customer_insert_policy" ON public.customers;
DROP POLICY IF EXISTS "customer_update_policy" ON public.customers;
DROP POLICY IF EXISTS "customer_delete_policy" ON public.customers;

CREATE POLICY "customer_select_policy"
ON public.customers
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND company_id IN (
    SELECT profiles.company_id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'))
);

CREATE POLICY "customer_insert_policy"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND company_id IN (
    SELECT profiles.company_id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'))
);

CREATE POLICY "customer_update_policy"
ON public.customers
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND company_id IN (
    SELECT profiles.company_id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'))
)
WITH CHECK (
  auth.uid() IS NOT NULL
  AND company_id IN (
    SELECT profiles.company_id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'))
);

CREATE POLICY "customer_delete_policy"
ON public.customers
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND company_id IN (
    SELECT profiles.company_id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  AND has_role(auth.uid(), 'admin')
);

-- ============================================
-- FIX 3: Drivers Table - Add Auth Check
-- ============================================
DROP POLICY IF EXISTS "Users can view drivers of their company" ON public.drivers;

CREATE POLICY "Users can view drivers of their company"
ON public.drivers
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND company_id IN (
    SELECT profiles.company_id FROM profiles WHERE profiles.user_id = auth.uid()
  )
);

-- ============================================
-- FIX 4: Bookings - Customer Portal Policy
-- ============================================
-- Neue Policy: Kunden sehen nur ihre eigenen Buchungen
CREATE POLICY "Customers view own bookings only"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND customer_id IN (
    SELECT c.id FROM customers c
    WHERE c.email IN (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- ==================================================================================
-- MIGRATION COMPLETE - 4 Critical Security Issues Fixed
-- ==================================================================================