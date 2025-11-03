-- ROADMAP SYSTEM V5.0 - FOUNDATION (3 Tabellen, 28 Tasks)

CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('content', 'design', 'page_migration', 'component', 'testing', 'documentation')),
  priority TEXT NOT NULL CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
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
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  current_phase TEXT CHECK (current_phase IN ('planning', 'implementation', 'testing', 'documentation', 'review', 'completed')),
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
  ai_decision TEXT CHECK (ai_decision IN ('proceed_with_opportunistic', 'skip_no_match', 'requires_approval'))
);

CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_status ON roadmap_tasks(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_priority ON roadmap_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_auto_checkable ON roadmap_tasks(auto_checkable) WHERE auto_checkable = true;
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_task_id ON roadmap_progress(task_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_auto_check_timestamp ON roadmap_auto_check_log(check_timestamp DESC);

CREATE OR REPLACE FUNCTION update_roadmap_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS roadmap_tasks_updated_at ON roadmap_tasks;
CREATE TRIGGER roadmap_tasks_updated_at BEFORE UPDATE ON roadmap_tasks
FOR EACH ROW EXECUTE FUNCTION update_roadmap_tasks_updated_at();

ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_auto_check_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read roadmap_tasks" ON roadmap_tasks;
CREATE POLICY "Allow authenticated users to read roadmap_tasks"
  ON roadmap_tasks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert roadmap_tasks" ON roadmap_tasks;
CREATE POLICY "Allow authenticated users to insert roadmap_tasks"
  ON roadmap_tasks FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update roadmap_tasks" ON roadmap_tasks;
CREATE POLICY "Allow authenticated users to update roadmap_tasks"
  ON roadmap_tasks FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to read roadmap_progress" ON roadmap_progress;
CREATE POLICY "Allow authenticated users to read roadmap_progress"
  ON roadmap_progress FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert roadmap_progress" ON roadmap_progress;
CREATE POLICY "Allow authenticated users to insert roadmap_progress"
  ON roadmap_progress FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read roadmap_auto_check_log" ON roadmap_auto_check_log;
CREATE POLICY "Allow authenticated users to read roadmap_auto_check_log"
  ON roadmap_auto_check_log FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert roadmap_auto_check_log" ON roadmap_auto_check_log;
CREATE POLICY "Allow authenticated users to insert roadmap_auto_check_log"
  ON roadmap_auto_check_log FOR INSERT TO authenticated WITH CHECK (true);

INSERT INTO roadmap_tasks (task_id, title, description, category, priority, status, estimated_hours, auto_checkable, affected_files, completion_criteria) VALUES
('CONTENT-001', 'Heroes-Section erweitern', '7 Seiten', 'content', 'P0', 'pending', 0.13, true, ARRAY['src/lib/content/de-DE.ts'], '{"checklist": ["Heroes definiert"]}'),
('CONTENT-002', 'Features-Section erstellen', '6 Module', 'content', 'P0', 'pending', 0.42, true, ARRAY['src/lib/content/de-DE.ts'], '{"checklist": ["6 Module vollständig"]}'),
('CONTENT-003', 'Testimonials-Integration', '20+ Testimonials', 'content', 'P1', 'pending', 0.25, true, ARRAY['src/lib/content/de-DE.ts'], '{"checklist": ["20+ Testimonials"]}'),
('CONTENT-004', 'Trust-Elements', 'Certifications + Stats', 'content', 'P1', 'pending', 0.08, true, ARRAY['src/lib/content/de-DE.ts'], '{"checklist": ["Certifications"]}'),
('CONTENT-005', 'Legal-Content-Migration', 'DSGVO/AGB/Impressum', 'content', 'P2', 'pending', 0.33, true, ARRAY['src/lib/content/de-DE.ts'], '{"checklist": ["Datenschutz migriert"]}'),
('CONTENT-006', 'Content-Types', 'Interfaces', 'content', 'P0', 'pending', 0.13, true, ARRAY['src/lib/content/types.ts'], '{"checklist": ["HeroContent"]}'),
('CONTENT-007', 'CTAs eliminieren', 'Kontextualisieren', 'content', 'P1', 'pending', 0.17, true, ARRAY['src/lib/content/de-DE.ts'], '{"checklist": ["Keine generischen CTAs"]}'),
('CONTENT-008', 'Benefits quantifizierbar', 'Impact-Statements', 'content', 'P1', 'pending', 0.25, true, ARRAY['src/lib/content/de-DE.ts'], '{"checklist": ["Impact vorhanden"]}')
ON CONFLICT (task_id) DO NOTHING;

INSERT INTO roadmap_tasks (task_id, title, description, category, priority, status, estimated_hours, auto_checkable, affected_files, related_pages, completion_criteria) VALUES
('DESIGN-001', 'Design-Prinzipien', 'V28.1', 'design', 'P0', 'pending', 0.17, true, ARRAY['docs/V28.1_DESIGN_PRINCIPLES.md'], ARRAY[]::text[], '{"checklist": ["Dokumentiert"]}'),
('DESIGN-002', 'KI-Workflow', 'generate-hero-images.ts', 'design', 'P0', 'pending', 0.33, true, ARRAY['scripts/generate-hero-images.ts'], ARRAY[]::text[], '{"checklist": ["Script funktionsfähig"]}'),
('DESIGN-003', 'Image-Prompts', '8 Prompts', 'design', 'P0', 'pending', 0.25, true, ARRAY['scripts/image-prompts.json'], ARRAY[]::text[], '{"checklist": ["8 Prompts"]}'),
('DESIGN-004', 'Hero: Contact', 'Team-Szene', 'design', 'P1', 'pending', 0.13, true, ARRAY[]::text[], ARRAY['contact'], '{"checklist": ["Generiert"]}'),
('DESIGN-005', 'Hero: FAQ', 'Knowledge-Base', 'design', 'P1', 'pending', 0.13, true, ARRAY[]::text[], ARRAY['faq'], '{"checklist": ["Generiert"]}'),
('DESIGN-006', 'Hero: Aufträge', 'Order-Mgmt', 'design', 'P1', 'pending', 0.13, true, ARRAY[]::text[], ARRAY['features/auftragsverwaltung'], '{"checklist": ["Generiert"]}'),
('DESIGN-007', 'Hero: Fuhrpark', 'Fleet-Mgmt', 'design', 'P1', 'pending', 0.13, true, ARRAY[]::text[], ARRAY['features/fuhrpartverwaltung'], '{"checklist": ["Generiert"]}'),
('DESIGN-008', 'Hero: Fahrer', 'Driver-Mgmt', 'design', 'P1', 'pending', 0.13, true, ARRAY[]::text[], ARRAY['features/fahrermanagement'], '{"checklist": ["Generiert"]}'),
('DESIGN-009', 'Hero: Rechnungen', 'Invoice-System', 'design', 'P1', 'pending', 0.13, true, ARRAY[]::text[], ARRAY['features/rechnungswesen'], '{"checklist": ["Generiert"]}'),
('DESIGN-010', 'Auth-Grafik', 'Optimierung', 'design', 'P1', 'pending', 0.33, true, ARRAY['src/pages/Auth.tsx'], ARRAY['auth'], '{"checklist": ["Optimiert"]}')
ON CONFLICT (task_id) DO NOTHING;

INSERT INTO roadmap_tasks (task_id, title, description, category, priority, status, estimated_hours, auto_checkable, affected_files, related_pages, completion_criteria) VALUES
('PAGE-001', 'Routing', '/features/*', 'page_migration', 'P0', 'pending', 0.08, true, ARRAY['src/App.tsx'], ARRAY[]::text[], '{"checklist": ["7 Routes"]}'),
('PAGE-002', 'FeatureDetailPage', 'Template', 'component', 'P0', 'pending', 0.58, true, ARRAY['src/components/templates/FeatureDetailPage.tsx'], ARRAY[]::text[], '{"checklist": ["Erstellt"]}'),
('PAGE-003', 'Page: Aufträge', '/features/auftragsverwaltung', 'page_migration', 'P1', 'pending', 0.12, true, ARRAY['src/pages/features/Auftragsverwaltung.tsx'], ARRAY['features/auftragsverwaltung'], '{"checklist": ["Implementiert"]}'),
('PAGE-004', 'Page: Fuhrpark', '/features/fuhrpartverwaltung', 'page_migration', 'P1', 'pending', 0.12, true, ARRAY['src/pages/features/Fuhrpartverwaltung.tsx'], ARRAY['features/fuhrpartverwaltung'], '{"checklist": ["Implementiert"]}'),
('PAGE-005', 'Page: Fahrer', '/features/fahrermanagement', 'page_migration', 'P1', 'pending', 0.12, true, ARRAY['src/pages/features/Fahrermanagement.tsx'], ARRAY['features/fahrermanagement'], '{"checklist": ["Implementiert"]}'),
('PAGE-006', 'Page: Rechnungen', '/features/rechnungswesen', 'page_migration', 'P1', 'pending', 0.12, true, ARRAY['src/pages/features/Rechnungswesen.tsx'], ARRAY['features/rechnungswesen'], '{"checklist": ["Implementiert"]}'),
('PAGE-007', 'Features-Dropdown', 'Navigation', 'component', 'P1', 'pending', 0.25, true, ARRAY['src/components/layout/MarketingLayout.tsx'], ARRAY[]::text[], '{"checklist": ["Dropdown"]}')
ON CONFLICT (task_id) DO NOTHING;

INSERT INTO roadmap_tasks (task_id, title, description, category, priority, status, estimated_hours, auto_checkable, affected_files, completion_criteria) VALUES
('DOC-001', 'PAGES_DESIGN_OVERVIEW', 'Inventar', 'documentation', 'P0', 'pending', 0.5, true, ARRAY['docs/PAGES_DESIGN_OVERVIEW.md'], '{"checklist": ["Dokumentiert"]}'),
('DOC-002', 'IMPLEMENTATION_CHECKLIST', '10-Punkte', 'documentation', 'P0', 'pending', 0.42, true, ARRAY['docs/PAGE_IMPLEMENTATION_CHECKLIST.md'], '{"checklist": ["Erstellt"]}'),
('TEST-001', 'E2E-Tests', 'Playwright', 'testing', 'P2', 'pending', 0.5, true, ARRAY['tests/e2e/features/*.spec.ts'], '{"checklist": ["6 Tests"]}')
ON CONFLICT (task_id) DO NOTHING;