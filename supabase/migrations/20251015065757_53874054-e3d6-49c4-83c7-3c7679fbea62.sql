-- ==================================================================================
-- KRITISCHER FIX: RLS Infinite Recursion auf profiles-Tabelle
-- ==================================================================================
-- Problem: "infinite recursion detected in policy for relation profiles"
-- Ursache: Policy "Users can view company profiles" ruft sich selbst auf
-- Lösung: Policies bereinigen und vereinfachen
-- ==================================================================================

-- Alte fehlerhafte Policies entfernen
DROP POLICY IF EXISTS "Users can view company profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Neue vereinfachte SELECT Policy (ohne Rekursion)
CREATE POLICY "users_select_profile" 
ON public.profiles 
FOR SELECT 
USING (
  -- User kann sein eigenes Profil sehen
  auth.uid() = user_id
  OR
  -- User kann Profile der gleichen Company sehen (OHNE Subquery auf profiles!)
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.company_id = profiles.company_id
  )
);

-- Duplikate bei UPDATE/INSERT/DELETE Policies entfernen
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Policies bleiben unverändert (keine Duplikate):
-- ✅ "Users can update own profile"
-- ✅ "Users can insert own profile"
-- ✅ "Users can delete own profile"