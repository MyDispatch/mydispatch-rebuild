-- NeXify AI MASTER - Projekt-Management System
-- Migration: 20250131_nexify_master_system.sql

-- Schema erstellen (falls nicht vorhanden)
CREATE SCHEMA IF NOT EXISTS nexify_ai_master_knowledge_base;

-- Tabelle: nexify_projects
CREATE TABLE IF NOT EXISTS nexify_ai_master_knowledge_base.nexify_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL UNIQUE,
  project_code TEXT NOT NULL UNIQUE,
  project_type TEXT NOT NULL CHECK (project_type IN ('saas', 'website', 'app', 'automation', 'other')),
  description TEXT,
  website_url TEXT,
  github_repo TEXT,
  supabase_project_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'on_hold')),
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  
  -- Projekt-Metadaten
  tech_stack JSONB DEFAULT '[]'::jsonb,
  team_members JSONB DEFAULT '[]'::jsonb,
  client_info JSONB DEFAULT '{}'::jsonb,
  
  -- Kennzahlen
  total_sessions INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  total_components INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT project_code_format CHECK (project_code ~ '^[a-z0-9-]+$')
);

-- Tabelle: nexify_project_history
CREATE TABLE IF NOT EXISTS nexify_ai_master_knowledge_base.nexify_project_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES nexify_ai_master_knowledge_base.nexify_projects(id) ON DELETE CASCADE,
  
  -- Session-Info
  session_date DATE NOT NULL,
  session_version TEXT,
  session_title TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('development', 'bugfix', 'feature', 'refactoring', 'documentation', 'maintenance')),
  
  -- Content
  description TEXT,
  changes JSONB DEFAULT '[]'::jsonb,
  root_causes JSONB DEFAULT '[]'::jsonb,
  technical_details JSONB DEFAULT '{}'::jsonb,
  impact JSONB DEFAULT '{}'::jsonb,
  
  -- Dokumentation
  documentation_files TEXT[] DEFAULT '{}',
  test_files TEXT[] DEFAULT '{}',
  
  -- Metadaten
  duration_minutes INTEGER,
  files_changed INTEGER DEFAULT 0,
  lines_added INTEGER DEFAULT 0,
  lines_removed INTEGER DEFAULT 0,
  components_created INTEGER DEFAULT 0,
  components_updated INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: nexify_project_context
CREATE TABLE IF NOT EXISTS nexify_ai_master_knowledge_base.nexify_project_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES nexify_ai_master_knowledge_base.nexify_projects(id) ON DELETE CASCADE,
  
  -- Kontext-Kategorien
  context_type TEXT NOT NULL CHECK (context_type IN ('architecture', 'design_system', 'dependencies', 'deployment', 'known_issues', 'best_practices', 'components', 'api', 'database')),
  context_key TEXT NOT NULL,
  context_value JSONB NOT NULL,
  
  -- Metadaten
  importance_score NUMERIC(3,2) DEFAULT 0.5 CHECK (importance_score >= 0.0 AND importance_score <= 1.0),
  last_verified_at TIMESTAMPTZ,
  verified_by TEXT CHECK (verified_by IN ('ai', 'pascal', 'system')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, context_type, context_key)
);

-- Tabelle: nexify_project_tasks
CREATE TABLE IF NOT EXISTS nexify_ai_master_knowledge_base.nexify_project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES nexify_ai_master_knowledge_base.nexify_projects(id) ON DELETE CASCADE,
  
  -- Task-Info
  task_title TEXT NOT NULL,
  task_description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('feature', 'bugfix', 'refactoring', 'documentation', 'maintenance', 'testing', 'deployment')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'blocked')),
  assigned_to TEXT,
  
  -- Dependencies
  depends_on UUID[] DEFAULT '{}',
  blocks UUID[] DEFAULT '{}',
  
  -- Schätzungen
  estimated_hours NUMERIC(5,2),
  actual_hours NUMERIC(5,2),
  
  -- Metadaten
  tags TEXT[] DEFAULT '{}',
  related_components TEXT[] DEFAULT '{}',
  related_files TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  due_date DATE
);

-- Indizes erstellen
CREATE INDEX IF NOT EXISTS idx_nexify_projects_status ON nexify_ai_master_knowledge_base.nexify_projects(status);
CREATE INDEX IF NOT EXISTS idx_nexify_projects_code ON nexify_ai_master_knowledge_base.nexify_projects(project_code);
CREATE INDEX IF NOT EXISTS idx_nexify_project_history_project ON nexify_ai_master_knowledge_base.nexify_project_history(project_id);
CREATE INDEX IF NOT EXISTS idx_nexify_project_history_date ON nexify_ai_master_knowledge_base.nexify_project_history(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_nexify_project_history_type ON nexify_ai_master_knowledge_base.nexify_project_history(session_type);
CREATE INDEX IF NOT EXISTS idx_nexify_project_context_project ON nexify_ai_master_knowledge_base.nexify_project_context(project_id);
CREATE INDEX IF NOT EXISTS idx_nexify_project_context_type ON nexify_ai_master_knowledge_base.nexify_project_context(context_type);
CREATE INDEX IF NOT EXISTS idx_nexify_project_tasks_project ON nexify_ai_master_knowledge_base.nexify_project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_nexify_project_tasks_status ON nexify_ai_master_knowledge_base.nexify_project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_nexify_project_tasks_priority ON nexify_ai_master_knowledge_base.nexify_project_tasks(priority);

-- RLS Policies (Master-Zugriff)
ALTER TABLE nexify_ai_master_knowledge_base.nexify_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_ai_master_knowledge_base.nexify_project_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_ai_master_knowledge_base.nexify_project_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_ai_master_knowledge_base.nexify_project_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Service Role hat Vollzugriff
CREATE POLICY "Service role full access" ON nexify_ai_master_knowledge_base.nexify_projects
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON nexify_ai_master_knowledge_base.nexify_project_history
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON nexify_ai_master_knowledge_base.nexify_project_context
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON nexify_ai_master_knowledge_base.nexify_project_tasks
  FOR ALL USING (auth.role() = 'service_role');

-- MyDispatch Projekt initialisieren
INSERT INTO nexify_ai_master_knowledge_base.nexify_projects (
  project_name,
  project_code,
  project_type,
  description,
  website_url,
  github_repo,
  supabase_project_id,
  status,
  priority,
  tech_stack,
  client_info
) VALUES (
  'MyDispatch',
  'mydispatch',
  'saas',
  'Dispositionslösung für Taxi & Mietwagen Unternehmen',
  'https://my-dispatch.de',
  'mydispatch-rebuild',
  'vsbqyqhzxmwezlhzdmfd',
  'active',
  10,
  '["react", "typescript", "vite", "supabase", "tailwindcss", "tanstack-query"]'::jsonb,
  '{"name": "RideHub Solutions", "type": "client", "relationship": "development_and_maintenance"}'::jsonb
) ON CONFLICT (project_code) DO NOTHING;

-- Initiale Projekt-Kontext-Daten für MyDispatch
DO $$
DECLARE
  project_id_var UUID;
BEGIN
  SELECT id INTO project_id_var FROM nexify_ai_master_knowledge_base.nexify_projects WHERE project_code = 'mydispatch';
  
  IF project_id_var IS NOT NULL THEN
    -- Design System Kontext
    INSERT INTO nexify_ai_master_knowledge_base.nexify_project_context (
      project_id, context_type, context_key, context_value, importance_score, verified_by
    ) VALUES (
      project_id_var,
      'design_system',
      'v28_slate_palette',
      '{"version": "V28.1", "colors": ["slate-50", "slate-100", "slate-200", "slate-600", "slate-700", "slate-900"], "transitions": "300ms", "spacing": {"desktop": "px-8", "mobile": "px-4"}}'::jsonb,
      1.0,
      'system'
    ) ON CONFLICT (project_id, context_type, context_key) DO NOTHING;
    
    -- Architecture Kontext
    INSERT INTO nexify_ai_master_knowledge_base.nexify_project_context (
      project_id, context_type, context_key, context_value, importance_score, verified_by
    ) VALUES (
      project_id_var,
      'architecture',
      'layout_system',
      '{"version": "V32.5", "type": "2-sidebar", "components": ["AppSidebar", "DashboardSidebar", "MainLayout"], "content_margin": {"expanded": "560px", "collapsed": "384px"}}'::jsonb,
      1.0,
      'system'
    ) ON CONFLICT (project_id, context_type, context_key) DO NOTHING;
    
    -- Deployment Kontext
    INSERT INTO nexify_ai_master_knowledge_base.nexify_project_context (
      project_id, context_type, context_key, context_value, importance_score, verified_by
    ) VALUES (
      project_id_var,
      'deployment',
      'supabase_config',
      '{"project_id": "vsbqyqhzxmwezlhzdmfd", "region": "EU (Frankfurt)", "database": "PostgreSQL 15"}'::jsonb,
      1.0,
      'system'
    ) ON CONFLICT (project_id, context_type, context_key) DO NOTHING;
  END IF;
END $$;

-- Updated_at Trigger
CREATE OR REPLACE FUNCTION nexify_ai_master_knowledge_base.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nexify_projects_updated_at
  BEFORE UPDATE ON nexify_ai_master_knowledge_base.nexify_projects
  FOR EACH ROW
  EXECUTE FUNCTION nexify_ai_master_knowledge_base.update_updated_at_column();

CREATE TRIGGER update_nexify_project_history_updated_at
  BEFORE UPDATE ON nexify_ai_master_knowledge_base.nexify_project_history
  FOR EACH ROW
  EXECUTE FUNCTION nexify_ai_master_knowledge_base.update_updated_at_column();

CREATE TRIGGER update_nexify_project_context_updated_at
  BEFORE UPDATE ON nexify_ai_master_knowledge_base.nexify_project_context
  FOR EACH ROW
  EXECUTE FUNCTION nexify_ai_master_knowledge_base.update_updated_at_column();

CREATE TRIGGER update_nexify_project_tasks_updated_at
  BEFORE UPDATE ON nexify_ai_master_knowledge_base.nexify_project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION nexify_ai_master_knowledge_base.update_updated_at_column();

