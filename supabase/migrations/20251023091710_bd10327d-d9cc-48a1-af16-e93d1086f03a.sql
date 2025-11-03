-- V18.5.1: Performance Metrics Table (Simple Version)

CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  rating TEXT NOT NULL,
  route TEXT NOT NULL,
  user_agent TEXT,
  company_id UUID,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index für Performance-Queries
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON public.performance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON public.performance_metrics(metric_name);

-- RLS Enable
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Simple Public Read Policy
CREATE POLICY "Public read for performance metrics"
  ON public.performance_metrics
  FOR SELECT
  USING (true);

-- System Insert Policy
CREATE POLICY "System insert for performance metrics"
  ON public.performance_metrics
  FOR INSERT
  WITH CHECK (true);