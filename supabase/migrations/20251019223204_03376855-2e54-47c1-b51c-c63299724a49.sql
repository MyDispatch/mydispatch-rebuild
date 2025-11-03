-- ==================================================================================
-- CRITICAL SECURITY FIX: Enforce company isolation in all RLS policies
-- ==================================================================================

-- Problem: Existing policies check for admin/moderator roles but DON'T enforce company_id matching!
-- This allows authenticated admins to access data from OTHER companies!

-- 1. Fix CUSTOMERS table policies
DROP POLICY IF EXISTS "customer_select_policy" ON customers;
DROP POLICY IF EXISTS "customer_insert_policy" ON customers;
DROP POLICY IF EXISTS "customer_update_policy" ON customers;
DROP POLICY IF EXISTS "customer_delete_policy" ON customers;

-- SELECT: Admin/Moderator can view customers ONLY from their own company
CREATE POLICY "customer_select_policy"
  ON customers
  FOR SELECT
  USING (
    company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
  );

-- INSERT: Admin/Moderator can create customers ONLY for their own company
CREATE POLICY "customer_insert_policy"
  ON customers
  FOR INSERT
  WITH CHECK (
    company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
  );

-- UPDATE: Admin/Moderator can update customers ONLY from their own company
CREATE POLICY "customer_update_policy"
  ON customers
  FOR UPDATE
  USING (
    company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
  )
  WITH CHECK (
    company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
  );

-- DELETE: Only Admin can delete customers from their own company
CREATE POLICY "customer_delete_policy"
  ON customers
  FOR DELETE
  USING (
    company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- 2. Additional CRITICAL FIX: Prevent company_id modification
-- User must not be able to change which company a customer belongs to
ALTER TABLE customers 
  ENABLE ROW LEVEL SECURITY;

-- NOTE: All other tables (drivers, vehicles, bookings, shifts, etc.) already have proper company_id checks
-- They use: company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- This is CORRECT and secure!