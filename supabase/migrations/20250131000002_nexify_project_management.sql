-- ==================================================================================
-- NEXIFY PROJECT MANAGEMENT - Vollständiges System für Pascal & NeXify AI MASTER
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Projekt-Management, Planung, Angebote, Umsetzung, Betrieb
-- Autor: NeXify AI MASTER
-- ==================================================================================

-- Projekte (Ideen, Planungen, laufende Projekte, abgeschlossene Projekte)
CREATE TABLE IF NOT EXISTS nexify_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code TEXT UNIQUE NOT NULL, -- z.B. "MD-2025-001"
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'feature', 'fix', 'improvement', 'migration', 'new_system'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
  status TEXT NOT NULL DEFAULT 'idea', -- 'idea', 'planning', 'discussion', 'approved', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'
  
  -- Idee & Initiale Planung
  idea_source TEXT, -- 'pascal', 'nexify_suggestion', 'user_feedback', 'system_analysis'
  initial_requirements JSONB,
  business_value TEXT,
  
  -- Besprechung & Planung
  discussion_notes JSONB, -- Array von Discussion Points
  planning_document JSONB, -- Vollständige Planung
  estimated_effort_hours NUMERIC(10,2),
  estimated_complexity TEXT, -- 'simple', 'medium', 'complex', 'very_complex'
  
  -- Angebot
  offer_created BOOLEAN DEFAULT FALSE,
  offer_document JSONB, -- Angebots-Details
  offer_approved BOOLEAN DEFAULT FALSE,
  offer_approved_at TIMESTAMPTZ,
  
  -- Umsetzung
  implementation_plan JSONB, -- Detaillierter Umsetzungsplan
  assigned_ai_agents TEXT[], -- Array von AI Agent IDs
  implementation_started_at TIMESTAMPTZ,
  implementation_notes JSONB,
  
  -- Review & Qualitätssicherung
  review_status TEXT, -- 'pending', 'in_review', 'approved', 'rejected'
  review_notes TEXT,
  quality_score NUMERIC(5,2), -- 0-100
  quality_checks JSONB, -- Array von Quality Checks
  
  -- Betrieb & Maintenance
  operational_status TEXT, -- 'active', 'monitoring', 'stable', 'deprecated'
  maintenance_plan JSONB,
  monitoring_config JSONB,
  
  -- Metadaten
  created_by TEXT DEFAULT 'Pascal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Tags für Kategorisierung
  tags TEXT[],
  
  -- Beziehungen
  related_projects UUID[], -- Array von related project IDs
  dependencies UUID[], -- Array von dependency project IDs
);

-- Projektdiskussionen (Besprechungen zwischen Pascal & NeXify AI MASTER)
CREATE TABLE IF NOT EXISTS nexify_project_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES nexify_projects(id) ON DELETE CASCADE,
  
  discussion_type TEXT NOT NULL, -- 'planning', 'clarification', 'review', 'feedback'
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Teilnehmer
  initiated_by TEXT NOT NULL, -- 'pascal' oder 'nexify_ai_master'
  participants TEXT[] DEFAULT ARRAY['Pascal', 'NeXify AI MASTER'],
  
  -- Entscheidungen
  decisions JSONB, -- Array von Entscheidungen
  action_items JSONB, -- Array von Action Items
  
  -- Status
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'resolved', 'archived'
  resolved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Angebote (Professionelle Angebote für Projekte)
CREATE TABLE IF NOT EXISTS nexify_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES nexify_projects(id) ON DELETE CASCADE,
  offer_number TEXT UNIQUE NOT NULL, -- z.B. "AN-2025-001"
  
  -- Angebots-Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scope TEXT NOT NULL, -- Was wird gemacht
  deliverables JSONB, -- Array von Deliverables
  exclusions TEXT, -- Was NICHT enthalten ist
  
  -- Aufwand & Kosten
  estimated_hours NUMERIC(10,2),
  estimated_complexity TEXT,
  required_ai_agents TEXT[],
  estimated_timeline_days INT,
  
  -- Risiken & Annahmen
  risks JSONB, -- Array von Risiken
  assumptions JSONB, -- Array von Annahmen
  prerequisites JSONB, -- Array von Voraussetzungen
  
  -- Qualität & Standards
  quality_standards JSONB, -- Qualitätsstandards die angewendet werden
  testing_approach TEXT,
  documentation_requirements TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sent', 'approved', 'rejected', 'revised'
  sent_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Versionierung
  version INT DEFAULT 1,
  previous_version_id UUID REFERENCES nexify_offers(id),
  
  created_by TEXT DEFAULT 'NeXify AI MASTER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Umsetzungs-Pläne (Detaillierte Pläne für AI-Team)
CREATE TABLE IF NOT EXISTS nexify_implementation_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES nexify_projects(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES nexify_offers(id),
  
  -- Plan-Struktur
  plan_title TEXT NOT NULL,
  phases JSONB NOT NULL, -- Array von Phasen
  tasks JSONB NOT NULL, -- Array von Tasks
  dependencies JSONB, -- Task-Dependencies
  
  -- Ressourcen
  assigned_ai_agents JSONB NOT NULL, -- Array von {agent_id, role, tasks}
  estimated_effort_per_task JSONB, -- {task_id: hours}
  
  -- Qualität
  quality_gates JSONB, -- Array von Quality Gates
  testing_requirements JSONB,
  documentation_requirements JSONB,
  
  -- Timeline
  start_date DATE,
  estimated_end_date DATE,
  milestones JSONB, -- Array von Milestones
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'approved', 'in_progress', 'completed'
  approved_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_by TEXT DEFAULT 'NeXify AI MASTER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task-Execution (Einzelne Tasks für AI-Team)
CREATE TABLE IF NOT EXISTS nexify_task_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  implementation_plan_id UUID REFERENCES nexify_implementation_plans(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL, -- Referenz zu Task in Plan
  
  -- Task-Details
  task_title TEXT NOT NULL,
  task_description TEXT,
  task_type TEXT NOT NULL, -- 'code', 'test', 'documentation', 'review', 'deployment'
  
  -- Zuweisung
  assigned_to TEXT NOT NULL, -- AI Agent ID oder 'NeXify AI MASTER'
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ausführung
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'review', 'completed', 'blocked'
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  actual_effort_hours NUMERIC(10,2),
  
  -- Ergebnisse
  deliverables JSONB, -- Array von Deliverables (Code, Tests, Docs)
  quality_score NUMERIC(5,2), -- 0-100
  review_notes TEXT,
  review_status TEXT, -- 'pending', 'approved', 'needs_revision'
  
  -- Blockierungen
  blocked_by TEXT[], -- Array von blocking task IDs
  blockers TEXT, -- Beschreibung der Blockierung
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Betrieb & Monitoring (Post-Implementation)
CREATE TABLE IF NOT EXISTS nexify_operational_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES nexify_projects(id) ON DELETE CASCADE,
  
  -- Status
  operational_status TEXT NOT NULL, -- 'active', 'monitoring', 'stable', 'deprecated'
  health_score NUMERIC(5,2), -- 0-100
  performance_metrics JSONB,
  error_rate NUMERIC(5,2),
  uptime_percentage NUMERIC(5,2),
  
  -- Monitoring
  monitoring_enabled BOOLEAN DEFAULT TRUE,
  monitoring_config JSONB,
  alerts_config JSONB,
  
  -- Maintenance
  last_maintenance_at TIMESTAMPTZ,
  next_maintenance_due DATE,
  maintenance_notes JSONB,
  
  -- Issues
  known_issues JSONB, -- Array von bekannten Issues
  incidents JSONB, -- Array von Incidents
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NeXify AI MASTER Session Logs (Alle Interaktionen mit Pascal)
CREATE TABLE IF NOT EXISTS nexify_master_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type TEXT NOT NULL, -- 'planning', 'discussion', 'review', 'general'
  
  -- Kontext
  project_id UUID REFERENCES nexify_projects(id),
  topic TEXT NOT NULL,
  context JSONB, -- Zusätzlicher Kontext
  
  -- Interaktion
  pascal_input TEXT, -- Pascal's Input/Anfrage
  nexify_response TEXT, -- NeXify AI MASTER's Response
  decisions_made JSONB, -- Array von Entscheidungen
  action_items JSONB, -- Array von Action Items
  
  -- Ergebnis
  outcome TEXT, -- 'planning', 'approval', 'revision', 'implementation', 'completed'
  next_steps JSONB,
  
  -- Qualität
  quality_score NUMERIC(5,2), -- NeXify AI MASTER's Selbstbewertung
  feedback_received TEXT, -- Pascal's Feedback (optional)
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nexify_projects_status ON nexify_projects(status);
CREATE INDEX IF NOT EXISTS idx_nexify_projects_priority ON nexify_projects(priority);
CREATE INDEX IF NOT EXISTS idx_nexify_projects_category ON nexify_projects(category);
CREATE INDEX IF NOT EXISTS idx_nexify_project_discussions_project ON nexify_project_discussions(project_id);
CREATE INDEX IF NOT EXISTS idx_nexify_offers_project ON nexify_offers(project_id);
CREATE INDEX IF NOT EXISTS idx_nexify_offers_status ON nexify_offers(status);
CREATE INDEX IF NOT EXISTS idx_nexify_implementation_plans_project ON nexify_implementation_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_nexify_task_executions_plan ON nexify_task_executions(implementation_plan_id);
CREATE INDEX IF NOT EXISTS idx_nexify_task_executions_status ON nexify_task_executions(status);
CREATE INDEX IF NOT EXISTS idx_nexify_master_sessions_project ON nexify_master_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_nexify_master_sessions_type ON nexify_master_sessions(session_type);

-- RLS
ALTER TABLE nexify_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_project_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_implementation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_task_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_operational_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Service Role hat Vollzugriff)
CREATE POLICY "nexify_projects_all_access" ON nexify_projects FOR ALL USING (true);
CREATE POLICY "nexify_project_discussions_all_access" ON nexify_project_discussions FOR ALL USING (true);
CREATE POLICY "nexify_offers_all_access" ON nexify_offers FOR ALL USING (true);
CREATE POLICY "nexify_implementation_plans_all_access" ON nexify_implementation_plans FOR ALL USING (true);
CREATE POLICY "nexify_task_executions_all_access" ON nexify_task_executions FOR ALL USING (true);
CREATE POLICY "nexify_operational_status_all_access" ON nexify_operational_status FOR ALL USING (true);
CREATE POLICY "nexify_master_sessions_all_access" ON nexify_master_sessions FOR ALL USING (true);

-- Helper Functions
CREATE OR REPLACE FUNCTION generate_project_code()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  seq_num INT;
  new_code TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  -- Get next sequence number for this year
  SELECT COALESCE(MAX(CAST(SPLIT_PART(project_code, '-', 3) AS INT)), 0) + 1
  INTO seq_num
  FROM nexify_projects
  WHERE project_code LIKE 'MD-' || year_part || '-%';
  
  new_code := 'MD-' || year_part || '-' || LPAD(seq_num::TEXT, 3, '0');
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_offer_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  seq_num INT;
  new_number TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SPLIT_PART(offer_number, '-', 3) AS INT)), 0) + 1
  INTO seq_num
  FROM nexify_offers
  WHERE offer_number LIKE 'AN-' || year_part || '-%';
  
  new_number := 'AN-' || year_part || '-' || LPAD(seq_num::TEXT, 3, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_nexify_projects_updated_at
  BEFORE UPDATE ON nexify_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

CREATE TRIGGER update_nexify_project_discussions_updated_at
  BEFORE UPDATE ON nexify_project_discussions
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

CREATE TRIGGER update_nexify_offers_updated_at
  BEFORE UPDATE ON nexify_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

CREATE TRIGGER update_nexify_implementation_plans_updated_at
  BEFORE UPDATE ON nexify_implementation_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

CREATE TRIGGER update_nexify_task_executions_updated_at
  BEFORE UPDATE ON nexify_task_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_nexify_updated_at();

-- Comments
COMMENT ON TABLE nexify_projects IS 'Projekte - Von Idee bis Betrieb';
COMMENT ON TABLE nexify_project_discussions IS 'Projektdiskussionen - Besprechungen zwischen Pascal & NeXify AI MASTER';
COMMENT ON TABLE nexify_offers IS 'Angebote - Professionelle Angebote für Projekte';
COMMENT ON TABLE nexify_implementation_plans IS 'Umsetzungs-Pläne - Detaillierte Pläne für AI-Team';
COMMENT ON TABLE nexify_task_executions IS 'Task-Execution - Einzelne Tasks für AI-Team';
COMMENT ON TABLE nexify_operational_status IS 'Betrieb & Monitoring - Post-Implementation Status';
COMMENT ON TABLE nexify_master_sessions IS 'NeXify AI MASTER Session Logs - Alle Interaktionen mit Pascal';











