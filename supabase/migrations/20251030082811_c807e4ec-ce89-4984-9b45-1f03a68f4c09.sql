-- =====================================================================
-- V5.0 KNOWLEDGE-BASE MIGRATION
-- Phase 1-2: automation_patterns + knowledge_base Schema Extension
-- =====================================================================

-- 1. CREATE automation_patterns TABLE
CREATE TABLE IF NOT EXISTS public.automation_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name TEXT NOT NULL UNIQUE,
  pattern_type TEXT NOT NULL, -- 'ci_cd' | 'build' | 'test' | 'security' | 'monitoring'
  description TEXT,
  code TEXT NOT NULL,
  trigger_condition TEXT, -- 'on_push' | 'on_pr' | 'scheduled' | 'on_error'
  execution_command TEXT NOT NULL,
  expected_duration_seconds INTEGER DEFAULT 60,
  usage_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  avg_duration_seconds INTEGER,
  success_rate NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN usage_count > 0 THEN (success_count::NUMERIC / usage_count::NUMERIC * 100)
      ELSE 0
    END
  ) STORED,
  metadata JSONB DEFAULT '{}'::jsonb,
  optimization_suggestions TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tags TEXT[] DEFAULT '{}'::text[]
);

-- 2. EXTEND knowledge_base TABLE
ALTER TABLE public.knowledge_base 
  ADD COLUMN IF NOT EXISTS original_file_path TEXT,
  ADD COLUMN IF NOT EXISTS importance_level INTEGER DEFAULT 3 CHECK (importance_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS complexity_level INTEGER DEFAULT 3 CHECK (complexity_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS parent_knowledge_ids UUID[],
  ADD COLUMN IF NOT EXISTS related_knowledge_ids UUID[];

-- 3. ADD FULL-TEXT SEARCH to knowledge_base
ALTER TABLE public.knowledge_base 
  ADD COLUMN IF NOT EXISTS search_vector tsvector 
  GENERATED ALWAYS AS (
    to_tsvector('german', title || ' ' || COALESCE(CAST(content AS TEXT), ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_knowledge_base_search 
  ON public.knowledge_base USING GIN (search_vector);

-- 4. CREATE INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON public.knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_importance ON public.knowledge_base(importance_level DESC);

CREATE INDEX IF NOT EXISTS idx_automation_patterns_type ON public.automation_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_automation_patterns_active ON public.automation_patterns(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_automation_patterns_success_rate ON public.automation_patterns(success_rate DESC);

-- 5. CREATE TRIGGER for automation_patterns updated_at
CREATE OR REPLACE FUNCTION update_automation_patterns_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_automation_patterns_updated_at
BEFORE UPDATE ON public.automation_patterns
FOR EACH ROW
EXECUTE FUNCTION update_automation_patterns_timestamp();

-- 6. CREATE RPC FUNCTION to increment pattern usage
CREATE OR REPLACE FUNCTION public.increment_pattern_usage(pattern_id UUID, success BOOLEAN, duration INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.automation_patterns
  SET 
    usage_count = usage_count + 1,
    success_count = success_count + CASE WHEN success THEN 1 ELSE 0 END,
    failure_count = failure_count + CASE WHEN success THEN 0 ELSE 1 END,
    last_used = now(),
    avg_duration_seconds = CASE 
      WHEN avg_duration_seconds IS NULL THEN duration
      ELSE ((avg_duration_seconds * usage_count) + duration) / (usage_count + 1)
    END
  WHERE id = pattern_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. RLS POLICIES for automation_patterns
ALTER TABLE public.automation_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI can read automation patterns"
ON public.automation_patterns FOR SELECT
USING (true);

CREATE POLICY "AI can insert automation patterns"
ON public.automation_patterns FOR INSERT
WITH CHECK (true);

CREATE POLICY "AI can update automation patterns"
ON public.automation_patterns FOR UPDATE
USING (true);

-- 8. INITIAL DATA: 10 Critical CI/CD Patterns
INSERT INTO public.automation_patterns (pattern_name, pattern_type, description, code, trigger_condition, execution_command, expected_duration_seconds, tags) VALUES
('TypeScript Compilation Check', 'ci_cd', 'Validates TypeScript code compiles without errors', 'tsc --noEmit', 'on_push', 'npm run type-check', 30, ARRAY['typescript', 'compilation', 'critical']),
('Console.log Detection', 'ci_cd', 'Scans for console.log statements in production code', 'grep -r "console\\.log" src/', 'on_pr', 'npm run check-console', 10, ARRAY['code-quality', 'linting']),
('Bundle Size Analysis', 'build', 'Checks if bundle size exceeds threshold', 'du -sh dist/', 'on_build', 'npm run analyze-bundle', 20, ARRAY['performance', 'build']),
('Security Audit', 'security', 'Runs npm audit for vulnerabilities', 'npm audit --audit-level=moderate', 'scheduled', 'npm audit', 45, ARRAY['security', 'dependencies']),
('RLS Policy Validation', 'security', 'Validates all tables have RLS enabled', 'SELECT tablename FROM pg_tables WHERE schemaname = ''public'' AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = pg_tables.tablename)', 'on_migration', 'npm run check-rls', 15, ARRAY['security', 'database', 'critical']),
('Dead Code Detection', 'ci_cd', 'Identifies unused exports and imports', 'ts-prune', 'scheduled', 'npm run find-dead-code', 60, ARRAY['code-quality', 'maintenance']),
('Component Prop Validation', 'test', 'Validates all components have proper TypeScript props', 'grep -r "export.*function" src/components/ | grep -v "interface.*Props"', 'on_pr', 'npm run validate-props', 25, ARRAY['typescript', 'components']),
('Import Path Consistency', 'ci_cd', 'Checks for relative vs absolute imports', 'grep -r "from ''\\.\\./" src/', 'on_pr', 'npm run check-imports', 15, ARRAY['code-quality', 'imports']),
('Error Boundary Coverage', 'test', 'Validates error boundaries exist in critical paths', 'grep -r "ErrorBoundary" src/pages/', 'scheduled', 'npm run check-error-boundaries', 20, ARRAY['reliability', 'error-handling']),
('Accessibility Audit', 'test', 'Runs axe-core accessibility checks', 'npx @axe-core/cli dist/', 'on_build', 'npm run test:a11y', 40, ARRAY['accessibility', 'quality']);

COMMENT ON TABLE public.automation_patterns IS 'V5.0 - Stores CI/CD patterns with autonomous optimization tracking';
COMMENT ON COLUMN public.automation_patterns.success_rate IS 'Auto-calculated: (success_count / usage_count) * 100';
COMMENT ON COLUMN public.knowledge_base.search_vector IS 'Full-text search vector (German) for title + content';