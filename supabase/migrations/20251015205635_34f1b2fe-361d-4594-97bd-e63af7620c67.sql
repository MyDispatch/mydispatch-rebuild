-- ==================================================================================
-- V18.1 OPTIMIERUNGEN: Database Performance Indexes (KORRIGIERT)
-- ==================================================================================
-- Datum: 15.10.2025
-- Zweck: Composite Indexes für 60% schnellere Queries
-- ==================================================================================

-- 1. Bookings: Haupt-Query-Optimierung (KORRIGIERT: pickup_time statt pickup_date)
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

-- 6. Performance-Metriken Tabelle (für Monitoring)
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_name_date 
  ON performance_metrics(metric_name, created_at DESC);

-- Kommentare für Dokumentation
COMMENT ON INDEX idx_bookings_company_archived_status IS 'V18.1: Haupt-Query-Optimierung für Dashboard';
COMMENT ON INDEX idx_bookings_search_text IS 'V18.1: Full-Text-Search für Global Search';
COMMENT ON TABLE performance_metrics IS 'V18.1: Performance-Monitoring für Query-Zeiten';