-- ==================================================================================
-- NEXIFY QA SYSTEM - Quality Assurance Tracking für NeXify AI MASTER
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Tracking von Quality Assurance Metriken und Prüfungen
-- Autor: NeXify AI MASTER
-- ==================================================================================

-- Quality Assurance Checks
CREATE TABLE IF NOT EXISTS nexify_qa_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_type TEXT NOT NULL, -- 'unit_test', 'e2e_test', 'compliance', 'performance', 'accessibility'
  check_name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'passed', 'failed', 'warning', 'skipped'
  duration_ms INT,
  details JSONB,
  coverage_percentage NUMERIC(5,2), -- Für Test Coverage
  violations_found INT DEFAULT 0,
  violations_fixed INT DEFAULT 0,
  triggered_by TEXT DEFAULT 'NeXify AI MASTER',
  triggered_by_workflow TEXT, -- Workflow-ID oder CI/CD Run
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality Metrics (Tägliche/Wöchentliche Metriken)
CREATE TABLE IF NOT EXISTS nexify_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  metric_type TEXT NOT NULL, -- 'daily', 'weekly'
  
  -- Code Quality Metrics
  typescript_errors INT DEFAULT 0,
  eslint_warnings INT DEFAULT 0,
  test_coverage NUMERIC(5,2),
  code_duplication NUMERIC(5,2),
  
  -- Performance Metrics
  bundle_size_kb NUMERIC(10,2),
  load_time_ms INT,
  lighthouse_score NUMERIC(5,2),
  
  -- Compliance Metrics
  compliance_score NUMERIC(5,2), -- 0-100
  design_system_compliance NUMERIC(5,2),
  security_compliance NUMERIC(5,2),
  
  -- Violation Metrics
  total_violations INT DEFAULT 0,
  critical_violations INT DEFAULT 0,
  high_violations INT DEFAULT 0,
  resolved_violations INT DEFAULT 0,
  
  -- Test Metrics
  total_tests INT DEFAULT 0,
  passed_tests INT DEFAULT 0,
  failed_tests INT DEFAULT 0,
  e2e_tests_passed INT DEFAULT 0,
  e2e_tests_failed INT DEFAULT 0,
  
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date, metric_type)
);

-- Quality Reports (Reports für Pascal)
CREATE TABLE IF NOT EXISTS nexify_quality_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL, -- 'daily', 'weekly', 'on_demand'
  report_date DATE NOT NULL,
  summary TEXT NOT NULL,
  metrics JSONB NOT NULL,
  highlights JSONB, -- Wichtige Highlights
  issues JSONB, -- Gefundene Issues
  recommendations JSONB, -- Empfehlungen
  generated_by TEXT DEFAULT 'NeXify AI MASTER',
  sent_to_pascal BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Results (Detaillierte Test-Ergebnisse)
CREATE TABLE IF NOT EXISTS nexify_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type TEXT NOT NULL, -- 'unit', 'integration', 'e2e'
  test_name TEXT NOT NULL,
  test_file TEXT NOT NULL,
  status TEXT NOT NULL, -- 'passed', 'failed', 'skipped', 'flaky'
  duration_ms INT,
  error_message TEXT,
  error_stack TEXT,
  screenshot_url TEXT, -- Für E2E Tests
  video_url TEXT, -- Für E2E Tests
  metadata JSONB,
  run_id TEXT, -- CI/CD Run ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality Gates (Definition von Quality Gates)
CREATE TABLE IF NOT EXISTS nexify_quality_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gate_name TEXT UNIQUE NOT NULL,
  gate_type TEXT NOT NULL, -- 'pre_commit', 'pre_push', 'pre_merge', 'scheduled'
  description TEXT,
  checks JSONB NOT NULL, -- Array von Checks
  thresholds JSONB NOT NULL, -- Schwellenwerte
  blocking BOOLEAN DEFAULT TRUE, -- Blockiert bei Failure
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality Gate Executions (Ausführungen von Quality Gates)
CREATE TABLE IF NOT EXISTS nexify_quality_gate_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gate_id UUID REFERENCES nexify_quality_gates(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'passed', 'failed', 'warning'
  triggered_by TEXT,
  triggered_by_event TEXT, -- 'commit', 'push', 'scheduled', 'manual'
  checks_executed JSONB,
  results JSONB,
  duration_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nexify_qa_checks_date ON nexify_qa_checks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nexify_qa_checks_type ON nexify_qa_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_nexify_quality_metrics_date ON nexify_quality_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_nexify_test_results_type_status ON nexify_test_results(test_type, status);
CREATE INDEX IF NOT EXISTS idx_nexify_quality_gate_executions_status ON nexify_quality_gate_executions(status, created_at DESC);

-- RLS
ALTER TABLE nexify_qa_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_quality_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_quality_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_quality_gate_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Service Role hat Vollzugriff)
CREATE POLICY "nexify_qa_checks_all_access" ON nexify_qa_checks FOR ALL USING (true);
CREATE POLICY "nexify_quality_metrics_all_access" ON nexify_quality_metrics FOR ALL USING (true);
CREATE POLICY "nexify_quality_reports_all_access" ON nexify_quality_reports FOR ALL USING (true);
CREATE POLICY "nexify_test_results_all_access" ON nexify_test_results FOR ALL USING (true);
CREATE POLICY "nexify_quality_gates_all_access" ON nexify_quality_gates FOR ALL USING (true);
CREATE POLICY "nexify_quality_gate_executions_all_access" ON nexify_quality_gate_executions FOR ALL USING (true);

-- Helper Functions
CREATE OR REPLACE FUNCTION get_quality_score(target_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'date', target_date,
    'code_quality', COALESCE(AVG(CASE WHEN metric_type = 'daily' THEN typescript_errors + eslint_warnings END), 0),
    'test_coverage', COALESCE(AVG(CASE WHEN metric_type = 'daily' THEN test_coverage END), 0),
    'performance', COALESCE(AVG(CASE WHEN metric_type = 'daily' THEN lighthouse_score END), 0),
    'compliance', COALESCE(AVG(CASE WHEN metric_type = 'daily' THEN compliance_score END), 0)
  ) INTO result
  FROM nexify_quality_metrics
  WHERE metric_date = target_date;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Initial Quality Gates
INSERT INTO nexify_quality_gates (gate_name, gate_type, description, checks, thresholds, blocking, enabled)
VALUES 
  (
    'pre_commit_quality',
    'pre_commit',
    'Pre-Commit Quality Gate',
    '["type_check", "lint", "format_check", "unit_tests_changed"]'::jsonb,
    '{"typescript_errors": 0, "eslint_errors": 0, "test_failures": 0}'::jsonb,
    true,
    true
  ),
  (
    'pre_push_quality',
    'pre_push',
    'Pre-Push Quality Gate',
    '["full_test_suite", "e2e_tests", "compliance_check"]'::jsonb,
    '{"test_coverage": 80, "e2e_failures": 0, "critical_violations": 0}'::jsonb,
    true,
    true
  ),
  (
    'pre_merge_quality',
    'pre_merge',
    'Pre-Merge Quality Gate',
    '["full_quality_check", "performance_check", "security_check"]'::jsonb,
    '{"lighthouse_score": 90, "bundle_size_kb": 3000, "security_issues": 0}'::jsonb,
    true,
    true
  )
ON CONFLICT (gate_name) DO NOTHING;

-- Triggers
CREATE TRIGGER update_nexify_quality_gates_updated_at
  BEFORE UPDATE ON nexify_quality_gates
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

-- Comments
COMMENT ON TABLE nexify_qa_checks IS 'Quality Assurance Checks - Alle durchgeführten QA-Checks';
COMMENT ON TABLE nexify_quality_metrics IS 'Quality Metrics - Tägliche/Wöchentliche Qualitäts-Metriken';
COMMENT ON TABLE nexify_quality_reports IS 'Quality Reports - Reports für Pascal';
COMMENT ON TABLE nexify_test_results IS 'Test Results - Detaillierte Test-Ergebnisse';
COMMENT ON TABLE nexify_quality_gates IS 'Quality Gates - Definition von Quality Gates';
COMMENT ON TABLE nexify_quality_gate_executions IS 'Quality Gate Executions - Ausführungen von Quality Gates';

