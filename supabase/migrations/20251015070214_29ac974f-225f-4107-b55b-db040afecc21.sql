-- ==================================================================================
-- SYSTEMWEITE ERWEITERUNG: Anrede & Titel für alle Personen-Entitäten
-- ==================================================================================
-- Fügt Anrede (Herr/Frau/Divers) und Titel (Dr./Prof./etc.) hinzu
-- Betrifft: customers, drivers, profiles
-- ==================================================================================

-- 1. Enum für Anrede erstellen
CREATE TYPE public.salutation AS ENUM ('Herr', 'Frau', 'Divers');

-- 2. Customers erweitern
ALTER TABLE public.customers 
  ADD COLUMN IF NOT EXISTS salutation public.salutation,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Drivers erweitern
ALTER TABLE public.drivers 
  ADD COLUMN IF NOT EXISTS salutation public.salutation,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. Profiles erweitern (für User-Accounts)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS salutation public.salutation,
  ADD COLUMN IF NOT EXISTS title TEXT;

-- 5. Indices für Performance (Suche nach Namen)
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_drivers_name ON public.drivers(first_name, last_name);