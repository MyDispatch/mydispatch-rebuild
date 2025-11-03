-- Create ai_self_reports table for V5.0 Self-Monitoring
CREATE TABLE IF NOT EXISTS public.ai_self_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  period TEXT NOT NULL, -- 'last_7_days', 'last_30_days', etc.
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb, -- hallucination_rate, knowledge_check_compliance, etc.
  identified_gaps TEXT[] DEFAULT '{}', -- Array of identified knowledge gaps
  improvement_plan JSONB DEFAULT '[]'::jsonb, -- Array of improvement actions
  new_tools_suggested TEXT[] DEFAULT '{}', -- Suggested new tools to create
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_self_reports ENABLE ROW LEVEL SECURITY;

-- AI can insert self-reports
CREATE POLICY "AI can insert self reports"
  ON public.ai_self_reports
  FOR INSERT
  WITH CHECK (true);

-- AI can read self-reports
CREATE POLICY "AI can read self reports"
  ON public.ai_self_reports
  FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_ai_self_reports_report_date ON public.ai_self_reports(report_date DESC);
CREATE INDEX idx_ai_self_reports_period ON public.ai_self_reports(period);

-- Comment
COMMENT ON TABLE public.ai_self_reports IS 'V5.0: AI Self-Monitoring Reports - Weekly/Monthly Performance Metrics';