-- ==================================================================================
-- BATCH 9: INTELLIGENT ALERT-SYSTEM V18.5.1
-- ==================================================================================
-- Purpose: Email-Benachrichtigung bei CRITICAL Findings (via Resend)
-- ==================================================================================

-- 1. Alert Policies (Wer bekommt welche Alerts?)
CREATE TABLE IF NOT EXISTS public.alert_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('critical', 'warning', 'info')),
  email_recipients TEXT[] NOT NULL DEFAULT '{}',
  slack_webhook_url TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT alert_policies_recipients_check CHECK (array_length(email_recipients, 1) > 0)
);

-- 2. Alert Logs (Historie aller Alerts)
CREATE TABLE IF NOT EXISTS public.alert_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('critical', 'warning', 'info')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  source TEXT NOT NULL, -- 'watchdog-ai' | 'central-brain' | 'manual'
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_recipients TEXT[],
  email_error TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_alert_policies_company ON public.alert_policies(company_id);
CREATE INDEX IF NOT EXISTS idx_alert_policies_enabled ON public.alert_policies(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_alert_logs_created_at ON public.alert_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_logs_resolved ON public.alert_logs(resolved) WHERE resolved = false;
CREATE INDEX IF NOT EXISTS idx_alert_logs_severity ON public.alert_logs(severity);

-- RLS Policies
ALTER TABLE public.alert_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;

-- Alert Policies: Nur eigene Company sehen/ändern
CREATE POLICY "Users can view their company alert policies"
ON public.alert_policies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.company_id = alert_policies.company_id
  )
);

CREATE POLICY "Admins can manage alert policies"
ON public.alert_policies FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.user_id
    WHERE profiles.user_id = auth.uid()
    AND user_roles.role = 'admin'
    AND profiles.company_id = alert_policies.company_id
  )
);

-- Alert Logs: Nur eigene Company sehen
CREATE POLICY "Users can view their company alert logs"
ON public.alert_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- Admins können Alerts als resolved markieren
CREATE POLICY "Admins can resolve alerts"
ON public.alert_logs FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.user_id
    WHERE profiles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION public.update_alert_policies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_alert_policies_updated_at
BEFORE UPDATE ON public.alert_policies
FOR EACH ROW
EXECUTE FUNCTION public.update_alert_policies_updated_at();

-- Default Alert Policy für System-Alerts (Master-Account)
INSERT INTO public.alert_policies (
  company_id,
  alert_type,
  email_recipients,
  enabled
)
SELECT 
  c.id,
  'critical',
  ARRAY['admin@my-dispatch.de'],
  true
FROM public.companies c
WHERE NOT EXISTS (
  SELECT 1 FROM public.alert_policies ap
  WHERE ap.company_id = c.id AND ap.alert_type = 'critical'
)
LIMIT 1;

-- Cleanup-Function (alte Alerts >90 Tage löschen)
CREATE OR REPLACE FUNCTION public.cleanup_old_alert_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.alert_logs
  WHERE created_at < NOW() - INTERVAL '90 days'
  AND resolved = true;
  
  RAISE NOTICE 'Cleaned up resolved alert logs older than 90 days';
END;
$$;