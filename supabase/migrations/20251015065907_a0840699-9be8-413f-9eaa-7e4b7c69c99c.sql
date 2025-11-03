-- ==================================================================================
-- KRITISCHER FIX V2: RLS Infinite Recursion - Security Definer Lösung
-- ==================================================================================
-- Problem: Auch die neue Policy hat Rekursion durch profiles-Subquery
-- Lösung: Security Definer Funktion verwenden
-- ==================================================================================

-- 1. Security Definer Funktion erstellen (umgeht RLS)
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.profiles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- 2. Alte rekursive Policy entfernen
DROP POLICY IF EXISTS "users_select_profile" ON public.profiles;

-- 3. Neue Policy OHNE Rekursion (verwendet Security Definer Funktion)
CREATE POLICY "users_select_profile" 
ON public.profiles 
FOR SELECT 
USING (
  -- User kann sein eigenes Profil sehen
  auth.uid() = user_id
  OR
  -- User kann Profile der gleichen Company sehen (KEINE Rekursion!)
  company_id = public.get_user_company_id(auth.uid())
);