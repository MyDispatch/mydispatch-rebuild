
-- ==================================================================================
-- MIGRATION TEIL 2: user_roles Tabelle & Pascal als Master
-- ==================================================================================

-- 1. user_roles Tabelle erstellen
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 2. RLS aktivieren
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security Definer Function (bereits vorhanden, aber sicherstellen)
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

-- 4. RLS Policies
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

-- 5. Pascal als Master markieren
INSERT INTO public.user_roles (user_id, role)
VALUES ('ff04e5d2-aea1-4d3c-9926-a22d0dfff380', 'master')
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Pascal auch als admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('ff04e5d2-aea1-4d3c-9926-a22d0dfff380', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 7. KOMMENTAR
COMMENT ON TABLE public.user_roles IS 'RBAC für Master-Dashboard Zugriffskontrolle (V18.5.1)';
COMMENT ON FUNCTION public.has_role IS 'Security Definer Function für Role-Checks ohne RLS-Rekursion';
