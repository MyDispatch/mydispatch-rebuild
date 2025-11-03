-- Migration 1: Fahrzeugklassen-Update
-- Neue Enum-Werte für Fahrzeugklassen

-- 1. Neues Enum erstellen mit korrekten Werten
CREATE TYPE vehicle_class_new AS ENUM (
  'Economy Class (1-4 Pax)',
  'Business Class - Limousine (1-4 Pax)',
  'Business Class - Kombi (1-4 Pax)',
  'First Class (1-3 Pax)',
  'Van / SUV (1-8 Pax)'
);

-- 2. Spalte umstellen mit Mapping der alten Werte
ALTER TABLE vehicles 
  ALTER COLUMN vehicle_class TYPE vehicle_class_new 
  USING (
    CASE vehicle_class::text
      WHEN 'limousine' THEN 'Business Class - Limousine (1-4 Pax)'::vehicle_class_new
      WHEN 'van' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'bus' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      ELSE 'Economy Class (1-4 Pax)'::vehicle_class_new
    END
  );

-- 3. Altes Enum löschen
DROP TYPE vehicle_class;

-- 4. Neues Enum umbenennen
ALTER TYPE vehicle_class_new RENAME TO vehicle_class;

-- 5. Bookings vehicle_type aktualisieren (TEXT-Spalte, kein Enum)
UPDATE bookings 
SET vehicle_type = 'Economy Class (1-4 Pax)' 
WHERE vehicle_type IN ('Standard', 'standard') OR vehicle_type IS NULL;

UPDATE bookings 
SET vehicle_type = 'Business Class - Limousine (1-4 Pax)' 
WHERE vehicle_type = 'limousine';

UPDATE bookings 
SET vehicle_type = 'Van / SUV (1-8 Pax)' 
WHERE vehicle_type IN ('van', 'bus');

-- Migration 2: Terminierungs-System für Master-Accounts
CREATE TABLE IF NOT EXISTS termination_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('reminder', 'warning', 'block', 'unblock', 'note')),
  performed_by UUID NOT NULL REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy für termination_logs (nur Master-Accounts)
ALTER TABLE termination_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only master accounts can manage termination logs"
ON termination_logs FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE email IN ('info@simsek.cc', 'nexify.login@gmail.com')
  )
);

-- Migration 3: GPS-Tracking für Live-Map
CREATE TABLE IF NOT EXISTS vehicle_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  speed NUMERIC(5,2), -- km/h
  heading NUMERIC(5,2), -- Grad (0-360)
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE
);

-- Index für schnelle Queries (letzte Position pro Fahrzeug)
CREATE INDEX IF NOT EXISTS idx_vehicle_positions_latest 
ON vehicle_positions (vehicle_id, timestamp DESC);

-- RLS Policy für vehicle_positions
ALTER TABLE vehicle_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company isolation for vehicle positions"
ON vehicle_positions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Drivers can insert their own positions"
ON vehicle_positions FOR INSERT
WITH CHECK (
  driver_id = auth.uid() AND
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Migration 4: Onboarding-Tracking
CREATE TABLE IF NOT EXISTS onboarding_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT '{}',
  skipped BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ
);

-- RLS Policy für onboarding_progress
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own onboarding"
ON onboarding_progress FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());