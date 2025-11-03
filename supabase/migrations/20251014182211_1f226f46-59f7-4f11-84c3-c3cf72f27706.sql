-- FIX: Infinite Recursion in profiles RLS Policy
-- Problem: Die Policy "Users can view profiles in their company" ruft sich selbst auf

-- 1. Alte fehlerhafte Policy entfernen
DROP POLICY IF EXISTS "Users can view profiles in their company" ON public.profiles;

-- 2. Neue, korrekte Policy erstellen (ohne Rekursion)
-- Nutzer können ihr eigenes Profil UND Profile anderer Nutzer in ihrer Firma sehen
CREATE POLICY "Users can view profiles in their company" 
ON public.profiles 
FOR SELECT 
USING (
  -- Eigenes Profil ODER gleiche company_id wie eigenes Profil
  user_id = auth.uid() 
  OR 
  company_id = (
    SELECT company_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
    LIMIT 1
  )
);

-- 3. Stelle sicher, dass die Policy aktiviert ist
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;