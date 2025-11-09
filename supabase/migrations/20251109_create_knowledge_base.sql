-- ==================================================================================
-- NEXIFY WIKI KNOWLEDGE BASE TABLES
-- ==================================================================================
-- Erstellt: 2025-11-09
-- Zweck: Implementierung des NeXify WiKi Knowledge-First Approach
-- Vorgabe: Zero-Hallucination Protocol, Self-Learning, Component Registry
-- ==================================================================================

-- 1. Component Registry
CREATE TABLE IF NOT EXISTS component_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL UNIQUE,
  component_name TEXT NOT NULL,
  component_type TEXT NOT NULL CHECK (component_type IN ('ui', 'layout', 'page', 'shared', 'feature')),
  description TEXT,
  props_schema JSONB,
  dependencies TEXT[],
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  tags TEXT[]
);

-- 2. Known Issues
CREATE TABLE IF NOT EXISTS known_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hallucinated_function', 'rls_violation', 'import_error', 'type_error', 'runtime_error', 'logic_error')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  solution TEXT,
  prevention_checklist JSONB,
  occurrences INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[]
);

-- 3. Code Snippets
CREATE TABLE IF NOT EXISTS code_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('auth', 'database', 'api', 'ui', 'validation', 'error_handling', 'performance')),
  code TEXT NOT NULL,
  language TEXT DEFAULT 'typescript',
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[]
);

-- 4. Recent Learnings
CREATE TABLE IF NOT EXISTS recent_learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_id TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('component', 'pattern', 'error', 'optimization', 'best_practice')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  context JSONB,
  impact TEXT CHECK (impact IN ('critical', 'high', 'medium', 'low')),
  applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[]
);

-- 5. Best Practices
CREATE TABLE IF NOT EXISTS best_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('code_quality', 'performance', 'security', 'accessibility', 'testing', 'documentation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  examples JSONB,
  priority TEXT CHECK (priority IN ('mandatory', 'recommended', 'optional')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[]
);

-- ==================================================================================
-- ROW LEVEL SECURITY (RLS) - MANDATORY!
-- ==================================================================================

-- Enable RLS on all tables
ALTER TABLE component_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE known_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_practices ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all authenticated users to read
CREATE POLICY "Allow authenticated users to read component_registry"
  ON component_registry FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read known_issues"
  ON known_issues FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read code_snippets"
  ON code_snippets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read recent_learnings"
  ON recent_learnings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read best_practices"
  ON best_practices FOR SELECT
  TO authenticated
  USING (true);

-- Policies: Allow service role to write (for AI agents)
CREATE POLICY "Allow service role to write component_registry"
  ON component_registry FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to write known_issues"
  ON known_issues FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to write code_snippets"
  ON code_snippets FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to write recent_learnings"
  ON recent_learnings FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to write best_practices"
  ON best_practices FOR ALL
  TO service_role
  USING (true);

-- ==================================================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================================================

CREATE INDEX idx_component_registry_file_path ON component_registry(file_path);
CREATE INDEX idx_component_registry_component_type ON component_registry(component_type);
CREATE INDEX idx_component_registry_tags ON component_registry USING GIN(tags);

CREATE INDEX idx_known_issues_type ON known_issues(type);
CREATE INDEX idx_known_issues_severity ON known_issues(severity);
CREATE INDEX idx_known_issues_resolved ON known_issues(resolved);
CREATE INDEX idx_known_issues_tags ON known_issues USING GIN(tags);

CREATE INDEX idx_code_snippets_pattern_name ON code_snippets(pattern_name);
CREATE INDEX idx_code_snippets_category ON code_snippets(category);
CREATE INDEX idx_code_snippets_tags ON code_snippets USING GIN(tags);

CREATE INDEX idx_recent_learnings_category ON recent_learnings(category);
CREATE INDEX idx_recent_learnings_applied ON recent_learnings(applied);
CREATE INDEX idx_recent_learnings_tags ON recent_learnings USING GIN(tags);

CREATE INDEX idx_best_practices_category ON best_practices(category);
CREATE INDEX idx_best_practices_priority ON best_practices(priority);
CREATE INDEX idx_best_practices_tags ON best_practices USING GIN(tags);

-- ==================================================================================
-- INITIAL DATA SEEDING
-- ==================================================================================

-- Seed Known Issues from NeXify WiKi
INSERT INTO known_issues (issue_id, type, severity, title, description, solution, prevention_checklist, tags) VALUES
('afe0b51c-41db-44f0-b92d-295282c9f414', 'hallucinated_function', 'critical', 'Hallucinated Functions', 'AI creates non-existent functions (hallucination)', 'Always check component_registry and code_snippets before creating new functions', '{"checks": ["Check filesExplorer.md", "Query component_registry", "Search code_snippets", "Never code from memory"]}', ARRAY['hallucination', 'functions']),
('8b2d2afa-32dc-4558-9ad0-161386aba049', 'hallucinated_function', 'critical', 'Hallucinated Functions - getUserProfile() Pattern', 'AI creates non-existent functions like getUserProfile() or fetchUserData()', 'Always check component_registry and code_snippets before creating new functions. Query knowledge_base for similar patterns.', '{"checks": ["Check filesExplorer.md", "Query component_registry", "Search code_snippets", "Never code from memory"]}', ARRAY['hallucination', 'functions', 'critical']),
('f498795b-1170-4ab0-b2c4-ee814d5be6b3', 'rls_violation', 'critical', 'RLS Violation - Tables Without Policies', 'Tables without Row Level Security policies', 'Enable RLS immediately: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY', '{"checks": ["Run supabase--linter", "Enable RLS on new tables", "Create CRUD policies", "Test with user roles"]}', ARRAY['security', 'rls', 'database']),
('f46a7bc6-e86a-492b-a596-0d475ace02e7', 'rls_violation', 'critical', 'RLS Violation - Policy Creation Pattern', 'Tables created without Row Level Security policies enabled', 'Always enable RLS immediately after table creation: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY; Then create appropriate policies.', '{"checks": ["Run supabase--linter after migrations", "Enable RLS on every new table", "Create policies for all CRUD operations", "Test with different user roles"]}', ARRAY['security', 'rls', 'database']);

-- ==================================================================================
-- SUCCESS MESSAGE
-- ==================================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Knowledge Base Tables erfolgreich erstellt!';
  RAISE NOTICE '✅ RLS Policies aktiviert!';
  RAISE NOTICE '✅ Indexes erstellt!';
  RAISE NOTICE '✅ Initial Data geseedet!';
END $$;
