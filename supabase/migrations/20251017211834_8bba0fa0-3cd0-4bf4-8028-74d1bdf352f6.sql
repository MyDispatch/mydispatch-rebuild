-- Create n8n webhook logs table
CREATE TABLE n8n_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response JSONB,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'error')),
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create n8n AI conversations table
CREATE TABLE n8n_ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  messages JSONB[] NOT NULL DEFAULT '{}',
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE n8n_webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE n8n_ai_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for n8n_webhook_logs
CREATE POLICY "Users can view their company webhook logs"
  ON n8n_webhook_logs FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert webhook logs for their company"
  ON n8n_webhook_logs FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for n8n_ai_conversations
CREATE POLICY "Users can view their company conversations"
  ON n8n_ai_conversations FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert conversations for their company"
  ON n8n_ai_conversations FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own conversations"
  ON n8n_ai_conversations FOR UPDATE
  USING (user_id = auth.uid());

-- Create index for better performance
CREATE INDEX idx_webhook_logs_company_created ON n8n_webhook_logs(company_id, created_at DESC);
CREATE INDEX idx_ai_conversations_company_created ON n8n_ai_conversations(company_id, created_at DESC);