-- =====================================================================
-- PHASE 1: KNOWLEDGE-BASE DATABASE SCHEMA V5.0 (CLEAN VERSION)
-- 8 Tabellen für Autonomous Self-Learning AI Agent
-- =====================================================================

-- Drop existing objects if they exist
DROP INDEX IF EXISTS public.idx_knowledge_base_search CASCADE;
DROP INDEX IF EXISTS public.idx_knowledge_base_tags CASCADE;
DROP INDEX IF EXISTS public.idx_knowledge_base_category CASCADE;
DROP INDEX IF EXISTS public.idx_code_snippets_tags CASCADE;
DROP INDEX IF EXISTS public.idx_code_snippets_usage CASCADE;
DROP INDEX IF EXISTS public.idx_best_practices_category CASCADE;
DROP INDEX IF EXISTS public.idx_best_practices_tags CASCADE;
DROP INDEX IF EXISTS public.idx_component_registry_name CASCADE;
DROP INDEX IF EXISTS public.idx_component_registry_path CASCADE;
DROP INDEX IF EXISTS public.idx_known_issues_type CASCADE;
DROP INDEX IF EXISTS public.idx_known_issues_severity CASCADE;
DROP INDEX IF EXISTS public.idx_known_issues_resolved CASCADE;
DROP INDEX IF EXISTS public.idx_learning_patterns_type CASCADE;
DROP INDEX IF EXISTS public.idx_learning_patterns_success CASCADE;
DROP INDEX IF EXISTS public.idx_learning_patterns_date CASCADE;
DROP INDEX IF EXISTS public.idx_actions_log_type CASCADE;
DROP INDEX IF EXISTS public.idx_actions_log_date CASCADE;
DROP INDEX IF EXISTS public.idx_actions_log_knowledge_check CASCADE;
DROP INDEX IF EXISTS public.idx_validation_log_knowledge CASCADE;
DROP INDEX IF EXISTS public.idx_validation_log_type CASCADE;

DROP TABLE IF EXISTS public.knowledge_validation_log CASCADE;
DROP TABLE IF EXISTS public.ai_actions_log CASCADE;
DROP TABLE IF EXISTS public.ai_learning_patterns CASCADE;
DROP TABLE IF EXISTS public.known_issues CASCADE;
DROP TABLE IF EXISTS public.component_registry CASCADE;
DROP TABLE IF EXISTS public.best_practices CASCADE;
DROP TABLE IF EXISTS public.code_snippets CASCADE;
DROP TABLE IF EXISTS public.knowledge_base CASCADE;

DROP FUNCTION IF EXISTS increment_snippet_usage(UUID) CASCADE;
DROP FUNCTION IF EXISTS increment_knowledge_access(UUID) CASCADE;
DROP FUNCTION IF EXISTS increment_issue_occurrence(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_knowledge_updated_at() CASCADE;

-- 1. KNOWLEDGE_BASE - Hauptwissens-Speicher
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN (
    'design_system', 'component_pattern', 'bug_fix', 'best_practice', 
    'anti_pattern', 'custom_hook', 'autonomous_tool', 'edge_function'
  )),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  source TEXT NOT NULL CHECK (source IN ('docs_sync', 'user_input', 'ai_learned', 'error_analysis')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_accessed TIMESTAMPTZ,
  access_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_knowledge_base_search ON public.knowledge_base USING gin(to_tsvector('english', title || ' ' || (content::text)));
CREATE INDEX idx_knowledge_base_tags ON public.knowledge_base USING gin(tags);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);

-- 2. CODE_SNIPPETS - Wiederverwendbare Code-Patterns
CREATE TABLE public.code_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name TEXT NOT NULL UNIQUE,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'typescript',
  tags TEXT[] NOT NULL DEFAULT '{}',
  usage_count INTEGER NOT NULL DEFAULT 0,
  success_rate NUMERIC(3,2) DEFAULT 1.0 CHECK (success_rate >= 0 AND success_rate <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_code_snippets_tags ON public.code_snippets USING gin(tags);
CREATE INDEX idx_code_snippets_usage ON public.code_snippets(usage_count DESC);

-- 3. BEST_PRACTICES - Do's & Don'ts
CREATE TABLE public.best_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  do_this TEXT NOT NULL,
  dont_this TEXT NOT NULL,
  reasoning TEXT,
  example_code TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_best_practices_category ON public.best_practices(category);
CREATE INDEX idx_best_practices_tags ON public.best_practices USING gin(tags);

-- 4. COMPONENT_REGISTRY - Tracking existierender Components
CREATE TABLE public.component_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  description TEXT,
  props_schema JSONB DEFAULT '{}'::jsonb,
  dependencies TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_verified TIMESTAMPTZ NOT NULL DEFAULT now(),
  verification_status TEXT DEFAULT 'active' CHECK (verification_status IN ('active', 'deprecated', 'removed'))
);

CREATE INDEX idx_component_registry_name ON public.component_registry(component_name);
CREATE INDEX idx_component_registry_path ON public.component_registry(file_path);

-- 5. KNOWN_ISSUES - Bekannte Fehlerquellen & Lösungen
CREATE TABLE public.known_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_type TEXT NOT NULL CHECK (issue_type IN (
    'hallucinated_function', 'missing_import', 'type_error', 
    'rls_violation', 'design_inconsistency', 'performance_issue'
  )),
  description TEXT NOT NULL,
  solution TEXT NOT NULL,
  prevention_checklist TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  occurrences INTEGER NOT NULL DEFAULT 1,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_occurrence TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_known_issues_type ON public.known_issues(issue_type);
CREATE INDEX idx_known_issues_severity ON public.known_issues(severity);
CREATE INDEX idx_known_issues_resolved ON public.known_issues(resolved);

-- 6. AI_LEARNING_PATTERNS - Self-Learning Patterns
CREATE TABLE public.ai_learning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  success BOOLEAN NOT NULL,
  learnings TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence >= 0 AND confidence <= 1),
  files_changed TEXT[] DEFAULT '{}',
  patterns_used TEXT[] DEFAULT '{}',
  issues_encountered TEXT[] DEFAULT '{}',
  learned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  applied_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_learning_patterns_type ON public.ai_learning_patterns(action_type);
CREATE INDEX idx_learning_patterns_success ON public.ai_learning_patterns(success);
CREATE INDEX idx_learning_patterns_date ON public.ai_learning_patterns(learned_at DESC);

-- 7. AI_ACTIONS_LOG - Tracking aller AI Actions
CREATE TABLE public.ai_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  task_description TEXT,
  affected_files TEXT[] DEFAULT '{}',
  knowledge_check_performed BOOLEAN NOT NULL DEFAULT false,
  patterns_applied TEXT[] DEFAULT '{}',
  success BOOLEAN,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_actions_log_type ON public.ai_actions_log(action_type);
CREATE INDEX idx_actions_log_date ON public.ai_actions_log(created_at DESC);
CREATE INDEX idx_actions_log_knowledge_check ON public.ai_actions_log(knowledge_check_performed);

-- 8. KNOWLEDGE_VALIDATION_LOG - Quality Tracking
CREATE TABLE public.knowledge_validation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id UUID REFERENCES public.knowledge_base(id) ON DELETE CASCADE,
  validation_type TEXT NOT NULL CHECK (validation_type IN ('accuracy', 'freshness', 'usage', 'effectiveness')),
  score NUMERIC(3,2) NOT NULL CHECK (score >= 0 AND score <= 1),
  notes TEXT,
  validated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  validator TEXT NOT NULL DEFAULT 'ai_agent'
);

CREATE INDEX idx_validation_log_knowledge ON public.knowledge_validation_log(knowledge_id);
CREATE INDEX idx_validation_log_type ON public.knowledge_validation_log(validation_type);

-- =====================================================================
-- TRIGGERS FÜR AUTO-UPDATE
-- =====================================================================

CREATE OR REPLACE FUNCTION update_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_updated_at();

CREATE TRIGGER trigger_code_snippets_updated_at
  BEFORE UPDATE ON public.code_snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_updated_at();

CREATE TRIGGER trigger_best_practices_updated_at
  BEFORE UPDATE ON public.best_practices
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_updated_at();

CREATE TRIGGER trigger_known_issues_updated_at
  BEFORE UPDATE ON public.known_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.best_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.known_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_validation_log ENABLE ROW LEVEL SECURITY;

-- Public READ access for AI
CREATE POLICY "AI can read all knowledge" ON public.knowledge_base FOR SELECT TO authenticated USING (true);
CREATE POLICY "AI can read all code snippets" ON public.code_snippets FOR SELECT TO authenticated USING (true);
CREATE POLICY "AI can read all best practices" ON public.best_practices FOR SELECT TO authenticated USING (true);
CREATE POLICY "AI can read component registry" ON public.component_registry FOR SELECT TO authenticated USING (true);
CREATE POLICY "AI can read known issues" ON public.known_issues FOR SELECT TO authenticated USING (true);
CREATE POLICY "AI can read learning patterns" ON public.ai_learning_patterns FOR SELECT TO authenticated USING (true);
CREATE POLICY "AI can read actions log" ON public.ai_actions_log FOR SELECT TO authenticated USING (true);

-- WRITE access for AI
CREATE POLICY "AI can insert knowledge" ON public.knowledge_base FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AI can update knowledge" ON public.knowledge_base FOR UPDATE TO authenticated USING (true);
CREATE POLICY "AI can insert code snippets" ON public.code_snippets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AI can update code snippets" ON public.code_snippets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "AI can insert best practices" ON public.best_practices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AI can insert components" ON public.component_registry FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AI can update components" ON public.component_registry FOR UPDATE TO authenticated USING (true);
CREATE POLICY "AI can insert known issues" ON public.known_issues FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AI can update known issues" ON public.known_issues FOR UPDATE TO authenticated USING (true);
CREATE POLICY "AI can insert learning patterns" ON public.ai_learning_patterns FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AI can insert actions log" ON public.ai_actions_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "AI can insert validation log" ON public.knowledge_validation_log FOR INSERT TO authenticated WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins have full access to knowledge" ON public.knowledge_base FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- =====================================================================
-- HELPER FUNCTIONS
-- =====================================================================

CREATE OR REPLACE FUNCTION increment_snippet_usage(snippet_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.code_snippets SET usage_count = usage_count + 1, last_used = now() WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_knowledge_access(knowledge_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.knowledge_base SET access_count = access_count + 1, last_accessed = now() WHERE id = knowledge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_issue_occurrence(issue_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.known_issues SET occurrences = occurrences + 1, last_occurrence = now() WHERE id = issue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE public.knowledge_base IS 'Central knowledge repository for AI agent';
COMMENT ON TABLE public.code_snippets IS 'Reusable code patterns with usage tracking';
COMMENT ON TABLE public.best_practices IS 'Do and Don''t guidelines';
COMMENT ON TABLE public.component_registry IS 'Registry of existing components';
COMMENT ON TABLE public.known_issues IS 'Known bugs and anti-patterns';
COMMENT ON TABLE public.ai_learning_patterns IS 'AI self-learning patterns';
COMMENT ON TABLE public.ai_actions_log IS 'Complete log of AI actions';
COMMENT ON TABLE public.knowledge_validation_log IS 'Quality tracking for knowledge';