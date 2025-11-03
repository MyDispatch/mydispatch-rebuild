-- ==================================================================================
-- KRITISCHER FIX: Entferne RLS Recursion in profiles-Policies
-- ==================================================================================
-- Problem: Policies nutzen Subquery auf profiles → Endlosschleife
-- Lösung: Nutze get_user_company_id() SECURITY DEFINER Funktion

-- Entferne problematische Policies
DROP POLICY IF EXISTS profile_select_admin ON public.profiles;
DROP POLICY IF EXISTS profile_update_admin ON public.profiles;

-- Neu: Nutze SECURITY DEFINER Funktion statt Subquery
CREATE POLICY profile_select_admin ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    company_id = get_user_company_id(auth.uid()) 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY profile_update_admin ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    company_id = get_user_company_id(auth.uid()) 
    AND has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    company_id = get_user_company_id(auth.uid()) 
    AND has_role(auth.uid(), 'admin'::app_role)
  );