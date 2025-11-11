-- ==================================================================================
-- KPI FIXTURES & APP_LOGS TABLE
-- ==================================================================================
-- Datum: 2025-11-10
-- Zweck:
--  1) Erstelle zentrale Tabelle 'app_logs' für strukturierte Application-Logs
--  2) Füge minimale Testdaten (Fixtures) für KPI-Berechnung hinzu
--     - drivers (aktiv/available)
--     - vehicles (available)
--     - bookings (heute, bezahlt, Preise > 0)
-- Governance: Keine Secrets, RLS aktiv, Policies streng
-- ==================================================================================

-- 1) App Logs Tabelle
CREATE TABLE IF NOT EXISTS app_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('info','warn','error')),
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  user_id UUID NULL,
  company_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE app_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Nur authentifizierte Benutzer dürfen eigene Logs schreiben
CREATE POLICY IF NOT EXISTS "app_logs_insert_own"
  ON app_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Benutzer lesen nur eigene Logs
CREATE POLICY IF NOT EXISTS "app_logs_select_own"
  ON app_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Optional: Service Role kann alles (für Edge Functions & Monitoring)
CREATE POLICY IF NOT EXISTS "app_logs_service_role_manage"
  ON app_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Index für Zeit-basierte Abfragen
CREATE INDEX IF NOT EXISTS idx_app_logs_created_at ON app_logs(created_at DESC);

-- 2) KPI Fixtures – DRIVERS
INSERT INTO drivers (id, full_name, phone, license_number, active, shift_status, archived, created_at)
VALUES
  (gen_random_uuid(), 'Max Mustermann', '+49 170 1234567', 'DE-ABC-12345', true, 'available', false, NOW()),
  (gen_random_uuid(), 'Erika Musterfrau', '+49 171 7654321', 'DE-XYZ-67890', true, 'available', false, NOW())
ON CONFLICT DO NOTHING;

-- 3) KPI Fixtures – VEHICLES
INSERT INTO vehicles (id, license_plate, status, archived, created_at)
VALUES
  (gen_random_uuid(), 'B-MD 1234', 'available', false, NOW()),
  (gen_random_uuid(), 'M-MD 5678', 'available', false, NOW())
ON CONFLICT DO NOTHING;

-- 4) KPI Fixtures – BOOKINGS (heute, bezahlt)
-- Hinweis: Fremdschlüssel (driver_id/vehicle_id/customer_id) bleiben NULL, um Referenzfehler zu vermeiden
INSERT INTO bookings (
  id,
  pickup_time,
  pickup_address,
  dropoff_address,
  status,
  payment_status,
  price,
  notes,
  archived,
  created_at,
  updated_at
)
VALUES
  (gen_random_uuid(), NOW() + INTERVAL '1 hour', 'Alexanderplatz, Berlin', 'Potsdamer Platz, Berlin', 'confirmed', 'paid', 49.90, 'Testfahrt A', false, NOW(), NOW()),
  (gen_random_uuid(), NOW() + INTERVAL '2 hours', 'Hauptbahnhof, München', 'Flughafen, München', 'confirmed', 'paid', 89.00, 'Testfahrt B', false, NOW(), NOW()),
  (gen_random_uuid(), NOW() + INTERVAL '3 hours', 'Dom, Köln', 'Messe, Köln', 'confirmed', 'paid', 59.50, 'Testfahrt C', false, NOW(), NOW()),
  (gen_random_uuid(), NOW() - INTERVAL '12 hours', 'Altstadt, Düsseldorf', 'Medienhafen, Düsseldorf', 'confirmed', 'pending', 0.00, 'Unbezahlt – zur Validierung', false, NOW() - INTERVAL '12 hours', NOW()),
  (gen_random_uuid(), NOW() - INTERVAL '26 hours', 'Innenstadt, Hamburg', 'Hafencity, Hamburg', 'completed', 'paid', 39.00, 'Gestern – zur Timeline-Validierung', false, NOW() - INTERVAL '26 hours', NOW() - INTERVAL '26 hours')
ON CONFLICT DO NOTHING;

-- 5) Optionales Seed-Log (zur Emitter-Validierung)
INSERT INTO app_logs (level, message, context)
VALUES ('info', 'Seed: KPI Fixtures und app_logs erstellt', '{"source":"migration","version":"2025-11-10"}')
ON CONFLICT DO NOTHING;

-- ==================================================================================
-- Ende
-- ==================================================================================

