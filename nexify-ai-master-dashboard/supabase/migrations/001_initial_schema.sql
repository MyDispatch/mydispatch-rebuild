-- NeXifyAI MASTER Dashboard Schema
-- Getrenntes Schema, aber gleicher Supabase-Projekt

-- Schema erstellen
CREATE SCHEMA IF NOT EXISTS nexify_ai_master_dashboard;

-- Dashboard Sessions
CREATE TABLE IF NOT EXISTS nexify_ai_master_dashboard.dashboard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  commands_executed INTEGER DEFAULT 0,
  projects_accessed TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Commands
CREATE TABLE IF NOT EXISTS nexify_ai_master_dashboard.agent_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES nexify_ai_master_dashboard.dashboard_sessions(id),
  command_type TEXT NOT NULL CHECK (command_type IN ('code', 'deploy', 'query', 'update', 'other')),
  command_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'executing', 'completed', 'failed')),
  result JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  project_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Status
CREATE TABLE IF NOT EXISTS nexify_ai_master_dashboard.agent_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  online BOOLEAN DEFAULT false,
  activity TEXT DEFAULT 'idle' CHECK (activity IN ('idle', 'active', 'processing')),
  current_project TEXT,
  last_command TEXT,
  uptime INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cursor Operations
CREATE TABLE IF NOT EXISTS nexify_ai_master_dashboard.cursor_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES nexify_ai_master_dashboard.dashboard_sessions(id),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('read', 'write', 'delete', 'git', 'deploy')),
  file_path TEXT,
  operation_data JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'executing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS aktivieren
ALTER TABLE nexify_ai_master_dashboard.dashboard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_ai_master_dashboard.agent_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_ai_master_dashboard.agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_ai_master_dashboard.cursor_operations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Master-User hat vollen Zugriff)
CREATE POLICY "Master user full access" ON nexify_ai_master_dashboard.dashboard_sessions
  FOR ALL USING (true);

CREATE POLICY "Master user full access" ON nexify_ai_master_dashboard.agent_commands
  FOR ALL USING (true);

CREATE POLICY "Master user full access" ON nexify_ai_master_dashboard.agent_status
  FOR ALL USING (true);

CREATE POLICY "Master user full access" ON nexify_ai_master_dashboard.cursor_operations
  FOR ALL USING (true);

-- Indizes
CREATE INDEX IF NOT EXISTS idx_dashboard_sessions_user ON nexify_ai_master_dashboard.dashboard_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_sessions_start ON nexify_ai_master_dashboard.dashboard_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_agent_commands_session ON nexify_ai_master_dashboard.agent_commands(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_commands_status ON nexify_ai_master_dashboard.agent_commands(status);
CREATE INDEX IF NOT EXISTS idx_cursor_operations_session ON nexify_ai_master_dashboard.cursor_operations(session_id);
