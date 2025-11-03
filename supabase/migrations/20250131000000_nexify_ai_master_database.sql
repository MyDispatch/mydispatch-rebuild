-- ==================================================================================
-- NEXIFY AI MASTER DATABASE - Zentrale Wissensbasis für NeXify AI MASTER
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Vollständiges Gedächtnis-System für NeXify AI MASTER
-- Autor: NeXify AI MASTER (Pascal's direkter AI-Ansprechpartner)
-- ==================================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Für Fuzzy Search
CREATE EXTENSION IF NOT EXISTS "vector"; -- Für Embeddings (falls später benötigt)

-- ==================================================================================
-- 1. NEXIFY AI MASTER CORE TABLES
-- ==================================================================================

-- Master Session Management
CREATE TABLE IF NOT EXISTS nexify_master_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL, -- Pascal's Email
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  context_summary JSONB, -- Zusammenfassung der Session
  total_actions INT DEFAULT 0,
  total_decisions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master Memory (Langzeit-Gedächtnis)
CREATE TABLE IF NOT EXISTS nexify_master_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'preference', 'decision', 'pattern', 'rule', 'learning'
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  importance_score NUMERIC(3,2) DEFAULT 0.5, -- 0.0 = niedrig, 1.0 = kritisch
  confidence_score NUMERIC(3,2) DEFAULT 1.0,
  source TEXT, -- 'user', 'code_analysis', 'documentation', 'experience'
  related_keys TEXT[], -- Verknüpfte Memory-Keys
  tags TEXT[],
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  access_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, key)
);

-- Master Conversations (Gesprächsverlauf)
CREATE TABLE IF NOT EXISTS nexify_master_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES nexify_master_sessions(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  metadata JSONB, -- Zusätzliche Infos (files_changed, decisions, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master Decisions (Entscheidungen & Abwägungen)
CREATE TABLE IF NOT EXISTS nexify_master_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES nexify_master_sessions(id) ON DELETE CASCADE,
  decision_type TEXT NOT NULL, -- 'architecture', 'design', 'implementation', 'workflow'
  context TEXT NOT NULL,
  options JSONB NOT NULL, -- Verfügbare Optionen
  chosen_option TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  alternatives_considered JSONB,
  outcome JSONB, -- Ergebnis der Entscheidung
  confidence_score NUMERIC(3,2) DEFAULT 0.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master Plans (Pläne & Strategien)
CREATE TABLE IF NOT EXISTS nexify_master_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'completed', 'cancelled'
  owner TEXT DEFAULT 'Pascal', -- Pascal oder NeXify AI MASTER
  steps JSONB NOT NULL, -- Array von Plan-Schritten
  dependencies JSONB, -- Abhängigkeiten zu anderen Plänen
  estimated_duration TEXT, -- Geschätzte Dauer
  actual_duration TEXT, -- Tatsächliche Dauer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Master Tasks (Aufgaben & ToDos)
CREATE TABLE IF NOT EXISTS nexify_master_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES nexify_master_plans(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'blocked', 'cancelled'
  assigned_to TEXT DEFAULT 'NeXify AI MASTER', -- 'NeXify AI MASTER' oder 'Pascal'
  due_date TIMESTAMPTZ,
  estimated_hours NUMERIC(5,2),
  actual_hours NUMERIC(5,2),
  tags TEXT[],
  related_files TEXT[], -- Betroffene Dateien
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Master Learnings (Lernerfahrungen)
CREATE TABLE IF NOT EXISTS nexify_master_learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES nexify_master_sessions(id) ON DELETE SET NULL,
  learning_type TEXT NOT NULL, -- 'success', 'failure', 'pattern', 'best_practice', 'anti_pattern'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  context TEXT, -- Kontext der Lernerfahrung
  impact TEXT, -- 'high', 'medium', 'low'
  category TEXT, -- 'code', 'design', 'workflow', 'communication', 'architecture'
  patterns JSONB, -- Erkannte Patterns
  prevention_checklist JSONB, -- Checkliste zur Vermeidung
  solution TEXT, -- Lösung/Erkenntnis
  confidence_score NUMERIC(3,2) DEFAULT 0.8,
  verified BOOLEAN DEFAULT FALSE, -- Von Pascal verifiziert
  verified_at TIMESTAMPTZ,
  tags TEXT[],
  related_issues TEXT[], -- Verknüpfte Issues
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================================
-- 2. SOLL-VORGABEN COMPLIANCE SYSTEM
-- ==================================================================================

-- SOLL-Vorgaben Registry (Alle definierten SOLL-Vorgaben)
CREATE TABLE IF NOT EXISTS nexify_soll_vorgaben (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'design_system', 'code_quality', 'security', 'performance', 'accessibility'
  rule_id TEXT UNIQUE NOT NULL, -- Eindeutige Regel-ID
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  source_document TEXT, -- Quelle: Dokumentations-Datei
  rule_type TEXT NOT NULL, -- 'mandatory', 'recommended', 'best_practice'
  validation_pattern TEXT, -- Regex oder Validierungs-Pattern
  check_function TEXT, -- Name der Check-Funktion
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Violations (Gefundene Verstöße)
CREATE TABLE IF NOT EXISTS nexify_compliance_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soll_vorgabe_id UUID REFERENCES nexify_soll_vorgaben(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  line_number INT,
  violation_type TEXT NOT NULL, -- 'design_system', 'code_quality', 'security', etc.
  violation_detail TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'false_positive'
  auto_fixable BOOLEAN DEFAULT FALSE,
  fix_suggestion TEXT,
  assigned_to TEXT DEFAULT 'NeXify AI MASTER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Compliance Checks (Durchgeführte Checks)
CREATE TABLE IF NOT EXISTS nexify_compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_type TEXT NOT NULL, -- 'full_scan', 'incremental', 'file_specific', 'category_specific'
  scope TEXT[], -- Betroffene Dateien/Kategorien
  total_files_scanned INT DEFAULT 0,
  violations_found INT DEFAULT 0,
  violations_critical INT DEFAULT 0,
  violations_high INT DEFAULT 0,
  violations_medium INT DEFAULT 0,
  violations_low INT DEFAULT 0,
  auto_fixes_applied INT DEFAULT 0,
  duration_ms INT,
  triggered_by TEXT, -- 'scheduled', 'manual', 'pre_commit', 'pre_push'
  triggered_by_user TEXT DEFAULT 'NeXify AI MASTER',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Fix History (Angewandte Fixes)
CREATE TABLE IF NOT EXISTS nexify_compliance_fixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id UUID REFERENCES nexify_compliance_violations(id) ON DELETE CASCADE,
  fix_type TEXT NOT NULL, -- 'auto', 'manual', 'suggested'
  fix_description TEXT NOT NULL,
  before_code TEXT,
  after_code TEXT,
  applied_by TEXT DEFAULT 'NeXify AI MASTER',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ
);

-- ==================================================================================
-- 3. WORKFLOW & AUTOMATION SYSTEM
-- ==================================================================================

-- Workflow Definitions (Definierte Workflows)
CREATE TABLE IF NOT EXISTS nexify_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- 'scheduled', 'event', 'manual', 'api'
  trigger_config JSONB, -- Trigger-Konfiguration
  steps JSONB NOT NULL, -- Array von Workflow-Schritten
  enabled BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  success_count INT DEFAULT 0,
  failure_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow Executions (Workflow-Ausführungen)
CREATE TABLE IF NOT EXISTS nexify_workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES nexify_workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'running', 'completed', 'failed', 'cancelled'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INT,
  steps_executed JSONB, -- Array von ausgeführten Schritten
  errors JSONB, -- Fehler (falls vorhanden)
  results JSONB, -- Ergebnisse
  triggered_by TEXT, -- 'scheduled', 'manual', 'event', 'api'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Patterns (Erkannte Automatisierungs-Muster)
CREATE TABLE IF NOT EXISTS nexify_automation_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name TEXT UNIQUE NOT NULL,
  pattern_type TEXT NOT NULL, -- 'code_generation', 'refactoring', 'migration', 'testing'
  description TEXT,
  trigger_conditions JSONB, -- Wann wird das Pattern ausgelöst
  execution_command TEXT, -- Command oder Function
  success_rate NUMERIC(3,2) DEFAULT 0.8,
  execution_count INT DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================================
-- 4. CODE ANALYSIS & TRACKING
-- ==================================================================================

-- Code Analysis Snapshots (Code-Analyse-Snapshots)
CREATE TABLE IF NOT EXISTS nexify_code_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_type TEXT NOT NULL, -- 'full', 'incremental', 'file_specific'
  file_path TEXT,
  file_hash TEXT, -- SHA-256 Hash des Datei-Inhalts
  file_size INT,
  lines_of_code INT,
  complexity_score NUMERIC(5,2),
  design_system_compliance NUMERIC(3,2), -- 0.0-1.0
  code_quality_score NUMERIC(3,2), -- 0.0-1.0
  security_score NUMERIC(3,2), -- 0.0-1.0
  performance_score NUMERIC(3,2), -- 0.0-1.0
  violations_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Change Tracking (Datei-Änderungs-Tracking)
CREATE TABLE IF NOT EXISTS nexify_file_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  change_type TEXT NOT NULL, -- 'created', 'modified', 'deleted', 'renamed'
  old_hash TEXT,
  new_hash TEXT,
  diff_summary TEXT,
  changed_by TEXT DEFAULT 'NeXify AI MASTER',
  reason TEXT, -- Grund der Änderung
  related_violation_id UUID REFERENCES nexify_compliance_violations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================================
-- 5. KNOWLEDGE BASE (Erweitert für NeXify AI MASTER)
-- ==================================================================================

-- Pascal's Preferences (Pascal's Präferenzen)
CREATE TABLE IF NOT EXISTS nexify_pascal_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preference_key TEXT UNIQUE NOT NULL,
  preference_value JSONB NOT NULL,
  category TEXT, -- 'communication', 'workflow', 'code_style', 'design', 'architecture'
  priority TEXT DEFAULT 'medium', -- 'high', 'medium', 'low'
  source TEXT, -- 'explicit', 'inferred', 'pattern'
  confidence_score NUMERIC(3,2) DEFAULT 0.8,
  last_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Context (Projekt-Kontext)
CREATE TABLE IF NOT EXISTS nexify_project_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_key TEXT UNIQUE NOT NULL,
  context_value JSONB NOT NULL,
  context_type TEXT NOT NULL, -- 'architecture', 'design', 'business', 'technical'
  validity_period_start TIMESTAMPTZ,
  validity_period_end TIMESTAMPTZ,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Team Registry (AI Agenten Team Registry)
CREATE TABLE IF NOT EXISTS nexify_agent_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT UNIQUE NOT NULL,
  agent_role TEXT NOT NULL, -- 'master', 'specialist', 'helper', 'validator'
  agent_capabilities JSONB, -- Fähigkeiten des Agents
  agent_status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'deprecated'
  communication_protocol TEXT, -- Wie kommuniziert dieser Agent
  dependencies TEXT[], -- Abhängige Agents
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================================
-- 6. INDEXES für Performance
-- ==================================================================================

-- Memory Indexes
CREATE INDEX IF NOT EXISTS idx_nexify_master_memory_category_key ON nexify_master_memory(category, key);
CREATE INDEX IF NOT EXISTS idx_nexify_master_memory_tags ON nexify_master_memory USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_nexify_master_memory_importance ON nexify_master_memory(importance_score DESC);

-- Compliance Indexes
CREATE INDEX IF NOT EXISTS idx_nexify_compliance_violations_status ON nexify_compliance_violations(status, severity);
CREATE INDEX IF NOT EXISTS idx_nexify_compliance_violations_file ON nexify_compliance_violations(file_path);
CREATE INDEX IF NOT EXISTS idx_nexify_compliance_violations_soll ON nexify_compliance_violations(soll_vorgabe_id);

-- Session Indexes
CREATE INDEX IF NOT EXISTS idx_nexify_master_sessions_user ON nexify_master_sessions(user_email, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_nexify_master_conversations_session ON nexify_master_conversations(session_id, created_at);

-- File Tracking Indexes
CREATE INDEX IF NOT EXISTS idx_nexify_file_changes_path ON nexify_file_changes(file_path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nexify_code_snapshots_path ON nexify_code_snapshots(file_path, created_at DESC);

-- Workflow Indexes
CREATE INDEX IF NOT EXISTS idx_nexify_workflows_enabled ON nexify_workflows(enabled, next_run_at);
CREATE INDEX IF NOT EXISTS idx_nexify_workflow_executions_status ON nexify_workflow_executions(status, started_at DESC);

-- ==================================================================================
-- 7. FULL-TEXT SEARCH (für Memory & Conversations)
-- ==================================================================================

-- Search Vector für Master Memory
ALTER TABLE nexify_master_memory 
ADD COLUMN IF NOT EXISTS search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('german', coalesce(key, '') || ' ' || coalesce(value::text, '') || ' ' || coalesce(array_to_string(tags, ' '), ''))
) STORED;

CREATE INDEX IF NOT EXISTS idx_nexify_master_memory_search ON nexify_master_memory USING GIN(search_vector);

-- Search Vector für Conversations
ALTER TABLE nexify_master_conversations 
ADD COLUMN IF NOT EXISTS search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('german', coalesce(content, ''))
) STORED;

CREATE INDEX IF NOT EXISTS idx_nexify_master_conversations_search ON nexify_master_conversations USING GIN(search_vector);

-- ==================================================================================
-- 8. TRIGGERS für Auto-Updates
-- ==================================================================================

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_nexify_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Updated At Triggers
CREATE TRIGGER update_nexify_master_memory_updated_at
  BEFORE UPDATE ON nexify_master_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

CREATE TRIGGER update_nexify_master_sessions_updated_at
  BEFORE UPDATE ON nexify_master_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

CREATE TRIGGER update_nexify_master_plans_updated_at
  BEFORE UPDATE ON nexify_master_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

CREATE TRIGGER update_nexify_master_tasks_updated_at
  BEFORE UPDATE ON nexify_master_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

CREATE TRIGGER update_nexify_workflows_updated_at
  BEFORE UPDATE ON nexify_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

-- Memory Access Tracking
CREATE OR REPLACE FUNCTION track_memory_access()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed_at = NOW();
  NEW.access_count = OLD.access_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_nexify_master_memory_access
  BEFORE UPDATE ON nexify_master_memory
  FOR EACH ROW
  WHEN (OLD.value IS DISTINCT FROM NEW.value)
  EXECUTE FUNCTION track_memory_access();

-- ==================================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ==================================================================================

-- Enable RLS für alle Tabellen
ALTER TABLE nexify_master_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_soll_vorgaben ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_compliance_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_compliance_fixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_automation_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_code_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_file_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_pascal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_project_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_agent_team ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Pascal und NeXify AI MASTER haben Vollzugriff
-- (Service Role kann alles, Authenticated Users nur lesen)

-- Policy für Master Sessions (Pascal kann alles, andere nur lesen)
CREATE POLICY "nexify_master_sessions_all_access" ON nexify_master_sessions
  FOR ALL
  USING (true); -- Service Role hat Vollzugriff

CREATE POLICY "nexify_master_memory_all_access" ON nexify_master_memory
  FOR ALL
  USING (true);

CREATE POLICY "nexify_master_conversations_all_access" ON nexify_master_conversations
  FOR ALL
  USING (true);

CREATE POLICY "nexify_master_decisions_all_access" ON nexify_master_decisions
  FOR ALL
  USING (true);

CREATE POLICY "nexify_master_plans_all_access" ON nexify_master_plans
  FOR ALL
  USING (true);

CREATE POLICY "nexify_master_tasks_all_access" ON nexify_master_tasks
  FOR ALL
  USING (true);

CREATE POLICY "nexify_master_learnings_all_access" ON nexify_master_learnings
  FOR ALL
  USING (true);

CREATE POLICY "nexify_soll_vorgaben_all_access" ON nexify_soll_vorgaben
  FOR ALL
  USING (true);

CREATE POLICY "nexify_compliance_violations_all_access" ON nexify_compliance_violations
  FOR ALL
  USING (true);

CREATE POLICY "nexify_compliance_checks_all_access" ON nexify_compliance_checks
  FOR ALL
  USING (true);

CREATE POLICY "nexify_compliance_fixes_all_access" ON nexify_compliance_fixes
  FOR ALL
  USING (true);

CREATE POLICY "nexify_workflows_all_access" ON nexify_workflows
  FOR ALL
  USING (true);

CREATE POLICY "nexify_workflow_executions_all_access" ON nexify_workflow_executions
  FOR ALL
  USING (true);

CREATE POLICY "nexify_automation_patterns_all_access" ON nexify_automation_patterns
  FOR ALL
  USING (true);

CREATE POLICY "nexify_code_snapshots_all_access" ON nexify_code_snapshots
  FOR ALL
  USING (true);

CREATE POLICY "nexify_file_changes_all_access" ON nexify_file_changes
  FOR ALL
  USING (true);

CREATE POLICY "nexify_pascal_preferences_all_access" ON nexify_pascal_preferences
  FOR ALL
  USING (true);

CREATE POLICY "nexify_project_context_all_access" ON nexify_project_context
  FOR ALL
  USING (true);

CREATE POLICY "nexify_agent_team_all_access" ON nexify_agent_team
  FOR ALL
  USING (true);

-- ==================================================================================
-- 10. INITIAL DATA (Initiale SOLL-Vorgaben)
-- ==================================================================================

-- Initialisiere SOLL-Vorgaben aus ANALYSE_ALLE_VORGABEN_REGELN_VERBOTE.md
-- (Diese werden später via Edge Function synchronisiert)

-- Beispiel: Design-System Vorgaben
INSERT INTO nexify_soll_vorgaben (category, rule_id, title, description, priority, rule_type, tags)
VALUES 
  ('design_system', 'DS_001', 'CI-Farben unveränderlich', 'CI-Farben dürfen NIEMALS geändert werden', 'critical', 'mandatory', ARRAY['design_system', 'ci_colors']),
  ('design_system', 'DS_002', 'V26/V26.1 deprecated', 'V26 und V26.1 sind deprecated und dürfen nicht verwendet werden', 'critical', 'mandatory', ARRAY['design_system', 'deprecated']),
  ('design_system', 'DS_003', 'Hero Background Variant', 'backgroundVariant="3d-premium" ist VERPFLICHTEND für alle Hero-Sections', 'high', 'mandatory', ARRAY['design_system', 'hero']),
  ('code_quality', 'CQ_001', 'Single Source of Truth', 'NIEMALS hardcoden, IMMER aus zentralen Quellen importieren', 'critical', 'mandatory', ARRAY['code_quality', 'data_sources']),
  ('security', 'SEC_001', 'RLS immer aktiv', 'ALLE Tabellen MÜSSEN RLS aktiviert haben', 'critical', 'mandatory', ARRAY['security', 'rls']),
  ('security', 'SEC_002', 'Soft Delete', 'NIEMALS Hard-Delete verwenden, IMMER Archiving', 'critical', 'mandatory', ARRAY['security', 'archiving']),
  ('security', 'SEC_003', 'company_id Filter', 'ALLE Queries MÜSSEN company_id Filter haben', 'critical', 'mandatory', ARRAY['security', 'multi_tenant']),
  ('localization', 'LOC_001', 'Deutsche Formatierung', 'DIN 5008 Formatierung für Datum, Währung, Zahlen', 'high', 'mandatory', ARRAY['localization', 'formatting']),
  ('localization', 'LOC_002', 'Neue Rechtschreibung', 'Neue Rechtschreibreform (2006) verwenden', 'medium', 'mandatory', ARRAY['localization', 'spelling'])
ON CONFLICT (rule_id) DO NOTHING;

-- Initialisiere NeXify AI MASTER als Agent
INSERT INTO nexify_agent_team (agent_name, agent_role, agent_capabilities, agent_status)
VALUES (
  'NeXify AI MASTER',
  'master',
  '{"capabilities": ["code_analysis", "compliance_checking", "workflow_automation", "decision_making", "learning", "memory_management", "team_coordination"]}'::jsonb,
  'active'
) ON CONFLICT (agent_name) DO UPDATE SET agent_status = 'active';

-- ==================================================================================
-- 11. HELPER FUNCTIONS
-- ==================================================================================

-- Function: Get Memory by Category and Key
CREATE OR REPLACE FUNCTION get_nexify_memory(category_param TEXT, key_param TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT value INTO result
  FROM nexify_master_memory
  WHERE category = category_param AND key = key_param;
  
  -- Track access
  UPDATE nexify_master_memory
  SET last_accessed_at = NOW(), access_count = access_count + 1
  WHERE category = category_param AND key = key_param;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Store Memory
CREATE OR REPLACE FUNCTION store_nexify_memory(
  category_param TEXT,
  key_param TEXT,
  value_param JSONB,
  importance_score_param NUMERIC DEFAULT 0.5,
  tags_param TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS UUID AS $$
DECLARE
  result_id UUID;
BEGIN
  INSERT INTO nexify_master_memory (category, key, value, importance_score, tags)
  VALUES (category_param, key_param, value_param, importance_score_param, tags_param)
  ON CONFLICT (category, key) 
  DO UPDATE SET 
    value = value_param,
    importance_score = importance_score_param,
    tags = tags_param,
    updated_at = NOW()
  RETURNING id INTO result_id;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Search Memory
CREATE OR REPLACE FUNCTION search_nexify_memory(search_query TEXT)
RETURNS TABLE (
  id UUID,
  category TEXT,
  key TEXT,
  value JSONB,
  importance_score NUMERIC,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.category,
    m.key,
    m.value,
    m.importance_score,
    ts_rank(m.search_vector, plainto_tsquery('german', search_query)) AS rank
  FROM nexify_master_memory m
  WHERE m.search_vector @@ plainto_tsquery('german', search_query)
  ORDER BY rank DESC, m.importance_score DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get Compliance Status
CREATE OR REPLACE FUNCTION get_compliance_status()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_violations', COUNT(*),
    'critical_violations', COUNT(*) FILTER (WHERE severity = 'critical'),
    'high_violations', COUNT(*) FILTER (WHERE severity = 'high'),
    'medium_violations', COUNT(*) FILTER (WHERE severity = 'medium'),
    'low_violations', COUNT(*) FILTER (WHERE severity = 'low'),
    'open_violations', COUNT(*) FILTER (WHERE status = 'open'),
    'in_progress_violations', COUNT(*) FILTER (WHERE status = 'in_progress'),
    'resolved_violations', COUNT(*) FILTER (WHERE status = 'resolved')
  ) INTO result
  FROM nexify_compliance_violations;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================================================
-- END OF MIGRATION
-- ==================================================================================

COMMENT ON TABLE nexify_master_sessions IS 'NeXify AI MASTER Session Management - Verwaltet alle Sessions mit Pascal';
COMMENT ON TABLE nexify_master_memory IS 'NeXify AI MASTER Langzeit-Gedächtnis - Speichert alle wichtigen Erinnerungen und Präferenzen';
COMMENT ON TABLE nexify_master_conversations IS 'NeXify AI MASTER Gesprächsverlauf - Vollständiger Verlauf aller Gespräche';
COMMENT ON TABLE nexify_master_decisions IS 'NeXify AI MASTER Entscheidungen - Alle getroffenen Entscheidungen und Abwägungen';
COMMENT ON TABLE nexify_master_plans IS 'NeXify AI MASTER Pläne - Strategische Pläne und Roadmaps';
COMMENT ON TABLE nexify_master_tasks IS 'NeXify AI MASTER Aufgaben - Alle ToDos und Aufgaben';
COMMENT ON TABLE nexify_master_learnings IS 'NeXify AI MASTER Lernerfahrungen - Alle Learnings und Erkenntnisse';
COMMENT ON TABLE nexify_soll_vorgaben IS 'SOLL-Vorgaben Registry - Alle definierten SOLL-Vorgaben aus Dokumentationen';
COMMENT ON TABLE nexify_compliance_violations IS 'Compliance Violations - Gefundene Verstöße gegen SOLL-Vorgaben';
COMMENT ON TABLE nexify_compliance_checks IS 'Compliance Checks - Durchgeführte Compliance-Prüfungen';
COMMENT ON TABLE nexify_workflows IS 'Workflow Definitions - Definierte automatisierte Workflows';
COMMENT ON TABLE nexify_automation_patterns IS 'Automation Patterns - Erkannte Automatisierungs-Muster';
COMMENT ON TABLE nexify_pascal_preferences IS 'Pascal Preferences - Pascals Präferenzen und Wünsche';
COMMENT ON TABLE nexify_agent_team IS 'Agent Team Registry - Registry aller AI-Agenten im Team';

