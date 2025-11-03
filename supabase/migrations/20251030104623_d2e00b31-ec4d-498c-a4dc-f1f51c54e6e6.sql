-- ROADMAP SYSTEM V5.0 - Database Tables
CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  dependencies TEXT[],
  affected_files TEXT[],
  related_pages TEXT[],
  blockers JSONB,
  completion_criteria JSONB,
  auto_checkable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT REFERENCES roadmap_tasks(task_id) ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0,
  current_phase TEXT,
  notes TEXT,
  ai_agent_id TEXT DEFAULT 'nexify',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_auto_check_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_timestamp TIMESTAMPTZ DEFAULT NOW(),
  current_task_description TEXT,
  checked_roadmap_tasks TEXT[],
  opportunistic_tasks_found TEXT[],
  tasks_completed TEXT[],
  execution_time_ms INTEGER,
  ai_decision TEXT
);

CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_status ON roadmap_tasks(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_priority ON roadmap_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_task_id ON roadmap_progress(task_id);

CREATE OR REPLACE FUNCTION update_roadmap_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS roadmap_tasks_updated_at ON roadmap_tasks;
CREATE TRIGGER roadmap_tasks_updated_at
BEFORE UPDATE ON roadmap_tasks
FOR EACH ROW
EXECUTE FUNCTION update_roadmap_tasks_updated_at();

ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_auto_check_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roadmap_tasks_select" ON roadmap_tasks;
CREATE POLICY "roadmap_tasks_select" ON roadmap_tasks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "roadmap_tasks_insert" ON roadmap_tasks;
CREATE POLICY "roadmap_tasks_insert" ON roadmap_tasks FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "roadmap_tasks_update" ON roadmap_tasks;
CREATE POLICY "roadmap_tasks_update" ON roadmap_tasks FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "roadmap_progress_select" ON roadmap_progress;
CREATE POLICY "roadmap_progress_select" ON roadmap_progress FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "roadmap_progress_insert" ON roadmap_progress;
CREATE POLICY "roadmap_progress_insert" ON roadmap_progress FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "roadmap_auto_check_log_select" ON roadmap_auto_check_log;
CREATE POLICY "roadmap_auto_check_log_select" ON roadmap_auto_check_log FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "roadmap_auto_check_log_insert" ON roadmap_auto_check_log;
CREATE POLICY "roadmap_auto_check_log_insert" ON roadmap_auto_check_log FOR INSERT TO authenticated WITH CHECK (true);

-- Initial 8 P0 Tasks
INSERT INTO roadmap_tasks (task_id, title, description, category, priority, estimated_hours, auto_checkable, affected_files, related_pages, completion_criteria) VALUES
('CONTENT-001', 'Heroes-Section erweitern', '7 Seiten Heroes', 'content', 'P0', 0.13, true, ARRAY['src/lib/content/de-DE.ts'], ARRAY[]::TEXT[], '{"checklist": ["Heroes definiert"]}'),
('CONTENT-002', 'Features-Section erstellen', '6 Feature-Module', 'content', 'P0', 0.42, true, ARRAY['src/lib/content/de-DE.ts'], ARRAY[]::TEXT[], '{"checklist": ["Module vollständig"]}'),
('CONTENT-006', 'Content-Types erweitern', 'Neue Interfaces', 'content', 'P0', 0.13, true, ARRAY['src/lib/content/types.ts'], ARRAY[]::TEXT[], '{"checklist": ["Interfaces erstellt"]}'),
('DESIGN-001', 'Design-Prinzipien', 'V28.1 Docs', 'design', 'P0', 0.17, true, ARRAY['docs/V28.1_DESIGN_PRINCIPLES.md'], ARRAY[]::TEXT[], '{"checklist": ["Dokumentiert"]}'),
('PAGE-001', 'Routing erweitern', 'Features Routes', 'page_migration', 'P0', 0.08, true, ARRAY['src/App.tsx'], ARRAY[]::TEXT[], '{"checklist": ["Routes hinzugefügt"]}'),
('PAGE-002', 'FeatureDetailPage Template', 'Wiederverwendbar', 'component', 'P0', 0.58, true, ARRAY['src/components/templates/FeatureDetailPage.tsx'], ARRAY[]::TEXT[], '{"checklist": ["Component erstellt"]}'),
('DOC-001', 'PAGES_DESIGN_OVERVIEW', 'Inventar', 'documentation', 'P0', 0.5, true, ARRAY['docs/PAGES_DESIGN_OVERVIEW.md'], ARRAY[]::TEXT[], '{"checklist": ["Dokumentiert"]}'),
('DOC-002', 'IMPLEMENTATION_CHECKLIST', 'Checklist', 'documentation', 'P0', 0.42, true, ARRAY['docs/PAGE_IMPLEMENTATION_CHECKLIST.md'], ARRAY[]::TEXT[], '{"checklist": ["Template erstellt"]}')
ON CONFLICT (task_id) DO NOTHING;