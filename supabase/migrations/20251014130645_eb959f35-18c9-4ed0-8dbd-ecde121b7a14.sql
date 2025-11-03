-- ==================================================================================
-- MyDispatch Complete Database Schema - Version 13.1 FINAL
-- Reihenfolge: Enums → Companies → Profiles → User Roles → Entities
-- ==================================================================================

-- ==================================================================================
-- 1. ENUMS
-- ==================================================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'dispatcher', 'driver');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE vehicle_status AS ENUM ('available', 'im_einsatz', 'wartung', 'defekt');
CREATE TYPE vehicle_class AS ENUM ('limousine', 'van', 'bus');
CREATE TYPE shift_status AS ENUM ('offline', 'on_duty', 'break', 'available', 'busy');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue', 'cancelled');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE payment_reminder_status AS ENUM ('pending', 'sent', 'paid', 'overdue');
CREATE TYPE document_entity_type AS ENUM ('driver', 'vehicle', 'customer');
CREATE TYPE document_type AS ENUM ('fuehrerschein', 'p_schein', 'fahrzeugschein', 'tuev', 'versicherung', 'sonstiges');

-- ==================================================================================
-- 2. COMPANIES TABLE (ZUERST!)
-- ==================================================================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  tax_id TEXT NOT NULL,
  is_kleinunternehmer BOOLEAN DEFAULT false,
  
  company_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  billing_status TEXT DEFAULT 'active',
  trial_ends_at TIMESTAMPTZ,
  last_billing_check TIMESTAMPTZ,
  
  total_bookings INTEGER DEFAULT 0,
  total_drivers INTEGER DEFAULT 0,
  total_vehicles INTEGER DEFAULT 0,
  monthly_revenue NUMERIC(10,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- ==================================================================================
-- 3. PROFILES TABLE
-- ==================================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==================================================================================
-- 4. USER ROLES TABLE
-- ==================================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ==================================================================================
-- 5. FUNCTIONS
-- ==================================================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
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

-- Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_company_id UUID;
BEGIN
  -- Create company
  INSERT INTO public.companies (
    name,
    email,
    tax_id
  ) VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Neues Unternehmen'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'tax_id', 'TEMP-' || substring(NEW.id::text, 1, 8))
  ) RETURNING id INTO new_company_id;

  -- Create profile
  INSERT INTO public.profiles (
    user_id,
    company_id,
    first_name,
    last_name
  ) VALUES (
    NEW.id,
    new_company_id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');

  RETURN NEW;
END;
$$;

-- ==================================================================================
-- 6. TRIGGERS
-- ==================================================================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================================================
-- 7. RLS POLICIES
-- ==================================================================================

-- Companies
CREATE POLICY "Users can view their own company"
  ON public.companies FOR SELECT
  USING (id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own company"
  ON public.companies FOR UPDATE
  USING (id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

-- Profiles
CREATE POLICY "Users can view profiles in their company"
  ON public.profiles FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

-- User Roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());