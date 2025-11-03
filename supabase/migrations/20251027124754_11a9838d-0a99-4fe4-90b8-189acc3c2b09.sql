-- ==================================================================================
-- CHECKER REPORTS TABLE V1.0 - Claude 4.5 Code/DB Review Integration
-- ==================================================================================

-- Checker Reports Table (für Git/DB/Code Review Results)
CREATE TABLE IF NOT EXISTS public.checker_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('git', 'database', 'code', 'full')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'error', 'warning')),
  
  -- Review Results (von Claude 4.5)
  issues JSONB DEFAULT '[]'::jsonb,  -- [{type: 'bug', severity: 'high', file: '...', line: 123, description: '...', fix: '...'}]
  fixes JSONB DEFAULT '[]'::jsonb,   -- [{issue_id: '...', suggested_code: '...', confidence: 0.95}]
  summary TEXT,
  
  -- Source Info
  source_type TEXT CHECK (source_type IN ('manual', 'webhook', 'trigger', 'scheduled')),
  source_metadata JSONB DEFAULT '{}'::jsonb,  -- {repo: '...', branch: '...', commit: '...'}
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Claude Model Info
  model_used TEXT DEFAULT 'claude-sonnet-4-5',
  tokens_used INTEGER,
  
  CONSTRAINT valid_issues_format CHECK (jsonb_typeof(issues) = 'array'),
  CONSTRAINT valid_fixes_format CHECK (jsonb_typeof(fixes) = 'array')
);

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_checker_reports_company ON public.checker_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_checker_reports_created ON public.checker_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checker_reports_status ON public.checker_reports(status);

-- RLS Policies
ALTER TABLE public.checker_reports ENABLE ROW LEVEL SECURITY;

-- Checker Reports: Company-based Access
CREATE POLICY "Users can view own company checker reports"
  ON public.checker_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.company_id = checker_reports.company_id
    )
  );

CREATE POLICY "Users can create checker reports for own company"
  ON public.checker_reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.company_id = checker_reports.company_id
    )
  );

-- Master accounts can see all reports
CREATE POLICY "Master accounts can view all checker reports"
  ON public.checker_reports FOR SELECT
  USING (public.is_master_account(auth.uid()));

-- Trigger für completed_at
CREATE OR REPLACE FUNCTION update_checker_reports_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status AND NEW.status IN ('success', 'error', 'warning') THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_checker_reports_timestamp
  BEFORE UPDATE ON public.checker_reports
  FOR EACH ROW
  WHEN (OLD.status = 'pending' AND NEW.status != 'pending')
  EXECUTE FUNCTION update_checker_reports_completed_at();

COMMENT ON TABLE public.checker_reports IS 'Claude 4.5 code/DB review reports with issues and fixes';