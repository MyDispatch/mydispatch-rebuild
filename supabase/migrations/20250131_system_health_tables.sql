-- ==================================================================================
-- SYSTEM HEALTH TABLES - Für automatisches Monitoring (2x täglich)
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: System Health Logs und Auto-Fix Logs
-- Autor: NeXify AI MASTER
-- ==================================================================================

-- System Health Logs Table
CREATE TABLE IF NOT EXISTS system_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  overall_status TEXT NOT NULL CHECK (overall_status IN ('healthy', 'warning', 'critical')),
  checks JSONB NOT NULL,
  issues TEXT[] DEFAULT '{}',
  fixes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto Fix Logs Table
CREATE TABLE IF NOT EXISTS auto_fix_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fixes JSONB NOT NULL,
  summary JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_system_health_logs_timestamp ON system_health_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_logs_status ON system_health_logs(overall_status);
CREATE INDEX IF NOT EXISTS idx_auto_fix_logs_timestamp ON auto_fix_logs(timestamp DESC);

-- RLS Policies
ALTER TABLE system_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_fix_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Nur Service Role kann lesen/schreiben
CREATE POLICY "Service role can manage system_health_logs"
  ON system_health_logs
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage auto_fix_logs"
  ON auto_fix_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- Kommentare
COMMENT ON TABLE system_health_logs IS 'System Health Logs für automatische Monitoring (2x täglich)';
COMMENT ON TABLE auto_fix_logs IS 'Auto-Fix Logs für automatische Fehlerbehebung (2x täglich)';

