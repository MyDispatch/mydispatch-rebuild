
-- ==================================================================================
-- MIGRATION: Erweitere app_role Enum + user_roles Tabelle
-- Erstellt: 24.10.2025
-- Zweck: Master-Dashboard Zugriffskontrolle (V18.5.1)
-- ==================================================================================

-- 1. Füge 'master' und 'customer' zum app_role Enum hinzu
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'master';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';

-- 2. user_roles Tabelle erstellen (falls noch nicht vorhanden)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 3. RLS aktivieren (nur wenn Tabelle existiert)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Security Definer Function (CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. RLS Policies (mit DROP IF EXISTS zur Sicherheit)
DROP POLICY IF EXISTS "Masters can manage roles" ON public.user_roles;
CREATE POLICY "Masters can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'master'))
WITH CHECK (public.has_role(auth.uid(), 'master'));

DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 6. Pascal als Master markieren
INSERT INTO public.user_roles (user_id, role)
VALUES ('ff04e5d2-aea1-4d3c-9926-a22d0dfff380', 'master')
ON CONFLICT (user_id, role) DO NOTHING;

-- 7. Pascal auch als admin markieren (für volle Rechte)
INSERT INTO public.user_roles (user_id, role)
VALUES ('ff04e5d2-aea1-4d3c-9926-a22d0dfff380', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 8. KOMMENTAR: Migration erfolgreich
COMMENT ON TABLE public.user_roles IS 'RBAC Tabelle für Master-Dashboard Zugriffskontrolle (V18.5.1)';
