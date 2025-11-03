-- V18.5.1: Add missing columns to performance_metrics

ALTER TABLE public.performance_metrics
ADD COLUMN IF NOT EXISTS rating TEXT,
ADD COLUMN IF NOT EXISTS route TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS company_id UUID,
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Update existing records mit Defaults
UPDATE public.performance_metrics 
SET 
  rating = 'good',
  route = '/',
  user_agent = 'unknown'
WHERE rating IS NULL;

-- Constraints für neue Spalten
ALTER TABLE public.performance_metrics
ALTER COLUMN rating SET DEFAULT 'good',
ALTER COLUMN route SET DEFAULT '/';

-- Zusätzliche Indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_route ON public.performance_metrics(route);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_company ON public.performance_metrics(company_id);

COMMENT ON COLUMN public.performance_metrics.rating IS 'good, needs-improvement, poor';
COMMENT ON COLUMN public.performance_metrics.route IS 'URL-Pfad der gemessenen Seite';