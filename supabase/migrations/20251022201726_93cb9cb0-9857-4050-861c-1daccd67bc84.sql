-- ============================================================================
-- FIX: Invoices RLS Policies - Explicit Auth Check
-- Version: 18.5.0
-- Datum: 2025-10-22
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view invoices of their company" ON public.invoices;
DROP POLICY IF EXISTS "Users can create invoices for their company" ON public.invoices;
DROP POLICY IF EXISTS "Users can update invoices of their company" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete invoices of their company" ON public.invoices;
DROP POLICY IF EXISTS "Users can view invoice items of their company" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can manage invoice items of their company" ON public.invoice_items;

-- Invoices Policies - Mit explizitem Auth-Check
CREATE POLICY "Users can view invoices of their company" 
ON public.invoices 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create invoices for their company" 
ON public.invoices 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
  AND created_by = auth.uid()
);

CREATE POLICY "Users can update invoices of their company" 
ON public.invoices 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete invoices of their company" 
ON public.invoices 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Invoice Items Policies - Mit explizitem Auth-Check
CREATE POLICY "Users can view invoice items of their company" 
ON public.invoice_items 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND invoice_id IN (
    SELECT id FROM invoices WHERE company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can manage invoice items of their company" 
ON public.invoice_items 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND invoice_id IN (
    SELECT id FROM invoices WHERE company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  )
);