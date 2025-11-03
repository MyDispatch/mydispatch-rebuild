-- Brain-Query-System: Logs & Analytics

-- Tabelle für Brain-Query-Logs (Analytics)
CREATE TABLE IF NOT EXISTS brain_query_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  categories TEXT[],
  results_count INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID,
  session_id TEXT
);

-- Indices für Performance
CREATE INDEX IF NOT EXISTS idx_brain_query_logs_timestamp ON brain_query_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_brain_query_logs_query ON brain_query_logs USING GIN(to_tsvector('german', query));

-- Agent-Improvement-Logs (Selbst-Learning)
CREATE TABLE IF NOT EXISTS agent_improvement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent TEXT NOT NULL DEFAULT 'lovable-ai-agent-v18.5.0',
  metrics JSONB NOT NULL,
  weaknesses TEXT[],
  improvement_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_improvement_logs_created_at ON agent_improvement_logs(created_at DESC);

-- RLS Policies
ALTER TABLE brain_query_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_improvement_logs ENABLE ROW LEVEL SECURITY;

-- Brain-Query-Logs: Alle können schreiben (für Analytics)
CREATE POLICY "brain_query_logs_insert_policy" ON brain_query_logs
  FOR INSERT
  WITH CHECK (true);

-- Agent-Improvement-Logs: Nur Admins lesen
CREATE POLICY "agent_improvement_logs_read_policy" ON agent_improvement_logs
  FOR SELECT
  USING (
    CASE 
      WHEN auth.jwt() ->> 'role' = 'admin' THEN true
      ELSE false
    END
  );

-- Agent-Improvement-Logs: Alle können schreiben
CREATE POLICY "agent_improvement_logs_insert_policy" ON agent_improvement_logs
  FOR INSERT
  WITH CHECK (true);