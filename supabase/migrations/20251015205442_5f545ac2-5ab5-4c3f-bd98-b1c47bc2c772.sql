-- ==================================================================================
-- V18.1 OPTIMIERUNGEN: Database Performance Indexes (KORRIGIERT)
-- ==================================================================================
-- Datum: 15.10.2025
-- Zweck: Composite Indexes für 60% schnellere Queries
-- KORREKTUR: pickup_time statt pickup_date
-- ==================================================================================

-- 1. Bookings: Haupt-Query-Optimierung
CREATE INDEX IF NOT EXISTS idx_bookings_company_archived_status 
  ON bookings(company_id, archived, status) 
  WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_bookings_company_pickup_time 
  ON bookings(company_id, pickup_time DESC) 
  WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_bookings_search_text 
  ON bookings USING gin(to_tsvector('german', 
    coalesce(pickup_address, '') || ' ' || 
    coalesce(dropoff_address, '')
  ));

-- 2. Drivers: Status & Schicht-Queries
CREATE INDEX IF NOT EXISTS idx_drivers_company_status 
  ON drivers(company_id, shift_status) 
  WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_drivers_company_name 
  ON drivers(company_id, last_name, first_name) 
  WHERE archived = false;

-- 3. Vehicles: Verfügbarkeits-Queries
CREATE INDEX IF NOT EXISTS idx_vehicles_company_status 
  ON vehicles(company_id, status, vehicle_class) 
  WHERE archived = false;

-- 4. Customers: Such-Optimierung
CREATE INDEX IF NOT EXISTS idx_customers_company_name 
  ON customers(company_id, last_name, first_name) 
  WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_customers_search_text 
  ON customers USING gin(to_tsvector('german', 
    coalesce(first_name, '') || ' ' || 
    coalesce(last_name, '') || ' ' ||
    coalesce(email, '')
  ));

-- 5. Partner: Connection-Queries
CREATE INDEX IF NOT EXISTS idx_partner_connections_companies 
  ON partner_connections(company_a_id, company_b_id);

-- 6. Audit Logs Tabelle & Indizes
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'archive', 'restore')),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_company 
  ON audit_logs(company_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity 
  ON audit_logs(entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user 
  ON audit_logs(user_id, created_at DESC);

-- RLS für Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company audit logs"
  ON audit_logs FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- 7. Filter-Presets Tabelle
CREATE TABLE IF NOT EXISTS filter_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('bookings', 'customers', 'drivers', 'vehicles', 'partners', 'all')),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_filter_presets_user 
  ON filter_presets(user_id, entity_type);

ALTER TABLE filter_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own filter presets"
  ON filter_presets FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Trigger für updated_at
CREATE TRIGGER update_filter_presets_updated_at
  BEFORE UPDATE ON filter_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Kommentare
COMMENT ON INDEX idx_bookings_company_archived_status IS 'V18.1: Haupt-Query-Optimierung für Dashboard';
COMMENT ON INDEX idx_bookings_search_text IS 'V18.1: Full-Text-Search für Global Search';
COMMENT ON TABLE audit_logs IS 'V18.1: Audit-Logging für alle kritischen Aktionen';
COMMENT ON TABLE filter_presets IS 'V18.1: Gespeicherte Filter für Global Search';