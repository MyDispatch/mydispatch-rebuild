-- Migration: Create NeXifyAI MASTER Agent Schema
-- Created: 2025-11-05
-- Purpose: Separates schema for NeXifyAI MASTER Agent Application
-- Note: Uses same Supabase instance as MyDispatch, but separate schema

-- ================================================================
-- 1. CREATE SCHEMA
-- ================================================================

CREATE SCHEMA IF NOT EXISTS nexify_master_agent;

-- ================================================================
-- 2. AGENT SESSIONS
-- ================================================================

CREATE TABLE nexify_master_agent.agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session Info
  session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  session_duration_seconds INT,
  
  -- Context
  loaded_projects TEXT[] DEFAULT '{}',
  loaded_knowledge JSONB DEFAULT '{}',
  active_tasks INT DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'error')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_agent_sessions_user ON nexify_master_agent.agent_sessions(user_id);
CREATE INDEX idx_agent_sessions_status ON nexify_master_agent.agent_sessions(status);
CREATE INDEX idx_agent_sessions_created ON nexify_master_agent.agent_sessions(created_at DESC);

-- ================================================================
-- 3. AGENT ACTIONS
-- ================================================================

CREATE TABLE nexify_master_agent.agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES nexify_master_agent.agent_sessions(id) ON DELETE CASCADE,
  
  -- Action Info
  action_type TEXT NOT NULL CHECK (action_type IN (
    'code_generation', 'deployment', 'github_commit', 'github_push', 
    'file_edit', 'file_read', 'research', 'knowledge_query',
    'cursor_execute', 'vercel_deploy', 'workflow_execute'
  )),
  action_description TEXT NOT NULL,
  action_input JSONB,
  action_output JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  
  -- Timing
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INT,
  
  -- Metadata
  affected_files TEXT[] DEFAULT '{}',
  affected_projects TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agent_actions_session ON nexify_master_agent.agent_actions(session_id);
CREATE INDEX idx_agent_actions_type ON nexify_master_agent.agent_actions(action_type);
CREATE INDEX idx_agent_actions_status ON nexify_master_agent.agent_actions(status);
CREATE INDEX idx_agent_actions_created ON nexify_master_agent.agent_actions(created_at DESC);

-- ================================================================
-- 4. AGENT CAPABILITIES
-- ================================================================

CREATE TABLE nexify_master_agent.agent_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Capability Info
  capability_name TEXT UNIQUE NOT NULL,
  capability_type TEXT NOT NULL CHECK (capability_type IN ('api', 'tool', 'integration', 'skill')),
  capability_description TEXT,
  
  -- Configuration
  is_enabled BOOLEAN DEFAULT true,
  requires_credentials BOOLEAN DEFAULT false,
  credentials_configured BOOLEAN DEFAULT false,
  
  -- Usage Stats
  usage_count INT DEFAULT 0,
  success_count INT DEFAULT 0,
  error_count INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_agent_capabilities_type ON nexify_master_agent.agent_capabilities(capability_type);
CREATE INDEX idx_agent_capabilities_enabled ON nexify_master_agent.agent_capabilities(is_enabled);

-- ================================================================
-- 5. AGENT CREDENTIALS (Encrypted)
-- ================================================================

CREATE TABLE nexify_master_agent.agent_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Credential Info
  service_name TEXT NOT NULL CHECK (service_name IN (
    'cursor', 'github', 'vercel', 'openai', 'anthropic', 
    'google', 'zapier', 'make', 'n8n'
  )),
  credential_type TEXT NOT NULL CHECK (credential_type IN ('api_key', 'oauth', 'password', 'token')),
  
  -- Encrypted Data (use pgcrypto extension)
  encrypted_value TEXT NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, service_name)
);

-- Index
CREATE INDEX idx_agent_credentials_user ON nexify_master_agent.agent_credentials(user_id);
CREATE INDEX idx_agent_credentials_service ON nexify_master_agent.agent_credentials(service_name);

-- ================================================================
-- 6. AGENT MEMORY (Persistent Context)
-- ================================================================

CREATE TABLE nexify_master_agent.agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Memory Info
  memory_type TEXT NOT NULL CHECK (memory_type IN ('conversation', 'decision', 'learning', 'context', 'preference')),
  memory_key TEXT NOT NULL,
  memory_value JSONB NOT NULL,
  
  -- Relevance
  importance_score NUMERIC(3,2) DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
  access_count INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(memory_type, memory_key)
);

-- Index
CREATE INDEX idx_agent_memory_type ON nexify_master_agent.agent_memory(memory_type);
CREATE INDEX idx_agent_memory_importance ON nexify_master_agent.agent_memory(importance_score DESC);
CREATE INDEX idx_agent_memory_accessed ON nexify_master_agent.agent_memory(last_accessed_at DESC);

-- ================================================================
-- 7. AGENT CHAT MESSAGES
-- ================================================================

CREATE TABLE nexify_master_agent.agent_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES nexify_master_agent.agent_sessions(id) ON DELETE CASCADE,
  
  -- Message Info
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Metadata
  tokens_used INT,
  model_used TEXT,
  response_time_ms INT,
  
  -- Related Actions
  related_action_ids UUID[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agent_chat_session ON nexify_master_agent.agent_chat_messages(session_id);
CREATE INDEX idx_agent_chat_created ON nexify_master_agent.agent_chat_messages(created_at DESC);

-- ================================================================
-- 8. AGENT WORKFLOWS (Automation)
-- ================================================================

CREATE TABLE nexify_master_agent.agent_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Workflow Info
  workflow_name TEXT UNIQUE NOT NULL,
  workflow_description TEXT,
  workflow_steps JSONB NOT NULL, -- [{step: 1, action: 'code_generation', params: {...}}]
  
  -- Triggers
  trigger_type TEXT CHECK (trigger_type IN ('manual', 'schedule', 'event', 'webhook')),
  trigger_config JSONB, -- {cron: '0 9 * * *'} or {event: 'deployment_success'}
  
  -- Status
  is_enabled BOOLEAN DEFAULT true,
  execution_count INT DEFAULT 0,
  last_execution_at TIMESTAMPTZ,
  last_execution_status TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_agent_workflows_enabled ON nexify_master_agent.agent_workflows(is_enabled);
CREATE INDEX idx_agent_workflows_trigger ON nexify_master_agent.agent_workflows(trigger_type);

-- ================================================================
-- 9. RLS POLICIES (Owner-only)
-- ================================================================

-- Enable RLS
ALTER TABLE nexify_master_agent.agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_workflows ENABLE ROW LEVEL SECURITY;

-- Policies for agent_sessions
CREATE POLICY "Users can view own sessions"
  ON nexify_master_agent.agent_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON nexify_master_agent.agent_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON nexify_master_agent.agent_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for agent_actions
CREATE POLICY "Users can view own actions"
  ON nexify_master_agent.agent_actions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM nexify_master_agent.agent_sessions
    WHERE id = agent_actions.session_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create own actions"
  ON nexify_master_agent.agent_actions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM nexify_master_agent.agent_sessions
    WHERE id = agent_actions.session_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update own actions"
  ON nexify_master_agent.agent_actions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM nexify_master_agent.agent_sessions
    WHERE id = agent_actions.session_id AND user_id = auth.uid()
  ));

-- Policies for agent_capabilities (Public Read, Admin Write)
CREATE POLICY "Anyone can view capabilities"
  ON nexify_master_agent.agent_capabilities FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage capabilities"
  ON nexify_master_agent.agent_capabilities FOR ALL
  USING (auth.role() = 'service_role');

-- Policies for agent_credentials
CREATE POLICY "Users can view own credentials"
  ON nexify_master_agent.agent_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own credentials"
  ON nexify_master_agent.agent_credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credentials"
  ON nexify_master_agent.agent_credentials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own credentials"
  ON nexify_master_agent.agent_credentials FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for agent_memory (Public Read for learning)
CREATE POLICY "Anyone can view memory"
  ON nexify_master_agent.agent_memory FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage memory"
  ON nexify_master_agent.agent_memory FOR ALL
  USING (auth.role() = 'service_role');

-- Policies for agent_chat_messages
CREATE POLICY "Users can view own messages"
  ON nexify_master_agent.agent_chat_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM nexify_master_agent.agent_sessions
    WHERE id = agent_chat_messages.session_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create messages"
  ON nexify_master_agent.agent_chat_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM nexify_master_agent.agent_sessions
    WHERE id = agent_chat_messages.session_id AND user_id = auth.uid()
  ));

-- Policies for agent_workflows (Public Read, Owner Write)
CREATE POLICY "Anyone can view workflows"
  ON nexify_master_agent.agent_workflows FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage workflows"
  ON nexify_master_agent.agent_workflows FOR ALL
  USING (auth.role() = 'service_role');

-- ================================================================
-- 10. INITIAL DATA: Capabilities
-- ================================================================

INSERT INTO nexify_master_agent.agent_capabilities (
  capability_name,
  capability_type,
  capability_description,
  requires_credentials,
  is_enabled
) VALUES
  -- APIs
  ('cursor_api', 'api', 'Cursor API Integration - Read/Write Code', true, false),
  ('github_api', 'api', 'GitHub API Integration - Commit, Push, PR, Deploy', true, false),
  ('vercel_api', 'api', 'Vercel API Integration - Deploy Applications', true, false),
  ('openai_api', 'api', 'OpenAI API - GPT Models for Code Generation', true, false),
  ('anthropic_api', 'api', 'Anthropic API - Claude Models for Code Analysis', true, false),
  
  -- Tools
  ('file_operations', 'tool', 'Read/Write Files in Repositories', false, true),
  ('knowledge_query', 'tool', 'Query NeXify Knowledge Base', false, true),
  ('code_editor', 'tool', 'Monaco Code Editor Integration', false, true),
  ('web_search', 'tool', 'Web Search for Research', false, true),
  
  -- Integrations
  ('zapier', 'integration', 'Zapier Automation Integration', true, false),
  ('make', 'integration', 'Make.com Automation Integration', true, false),
  ('n8n', 'integration', 'n8n Workflow Automation', true, false),
  
  -- Skills
  ('code_generation', 'skill', 'Generate Code from Requirements', false, true),
  ('code_review', 'skill', 'Review Code for Quality & Security', false, true),
  ('deployment', 'skill', 'Deploy Applications to Production', false, true),
  ('research', 'skill', 'Web Research & Information Gathering', false, true),
  ('documentation', 'skill', 'Generate Documentation', false, true),
  ('testing', 'skill', 'Generate Tests', false, true),
  ('refactoring', 'skill', 'Refactor Code for Better Quality', false, true),
  ('debugging', 'skill', 'Debug and Fix Errors', false, true)
ON CONFLICT (capability_name) DO NOTHING;

-- ================================================================
-- 11. FUNCTIONS: Update Timestamps
-- ================================================================

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION nexify_master_agent.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables with updated_at
CREATE TRIGGER update_agent_sessions_updated_at
  BEFORE UPDATE ON nexify_master_agent.agent_sessions
  FOR EACH ROW
  EXECUTE FUNCTION nexify_master_agent.update_updated_at_column();

CREATE TRIGGER update_agent_actions_updated_at
  BEFORE UPDATE ON nexify_master_agent.agent_actions
  FOR EACH ROW
  EXECUTE FUNCTION nexify_master_agent.update_updated_at_column();

CREATE TRIGGER update_agent_capabilities_updated_at
  BEFORE UPDATE ON nexify_master_agent.agent_capabilities
  FOR EACH ROW
  EXECUTE FUNCTION nexify_master_agent.update_updated_at_column();

CREATE TRIGGER update_agent_credentials_updated_at
  BEFORE UPDATE ON nexify_master_agent.agent_credentials
  FOR EACH ROW
  EXECUTE FUNCTION nexify_master_agent.update_updated_at_column();

CREATE TRIGGER update_agent_memory_updated_at
  BEFORE UPDATE ON nexify_master_agent.agent_memory
  FOR EACH ROW
  EXECUTE FUNCTION nexify_master_agent.update_updated_at_column();

CREATE TRIGGER update_agent_workflows_updated_at
  BEFORE UPDATE ON nexify_master_agent.agent_workflows
  FOR EACH ROW
  EXECUTE FUNCTION nexify_master_agent.update_updated_at_column();

-- ================================================================
-- 12. COMMENTS (Documentation)
-- ================================================================

COMMENT ON SCHEMA nexify_master_agent IS 'NeXifyAI MASTER Agent Application Schema - Separate from MyDispatch';

COMMENT ON TABLE nexify_master_agent.agent_sessions IS 'Agent Work Sessions with loaded context';
COMMENT ON TABLE nexify_master_agent.agent_actions IS 'All actions performed by the agent';
COMMENT ON TABLE nexify_master_agent.agent_capabilities IS 'Available capabilities (APIs, Tools, Skills)';
COMMENT ON TABLE nexify_master_agent.agent_credentials IS 'Encrypted credentials for external services';
COMMENT ON TABLE nexify_master_agent.agent_memory IS 'Persistent memory (Forget-Proof System)';
COMMENT ON TABLE nexify_master_agent.agent_chat_messages IS 'Chat messages between user and agent';
COMMENT ON TABLE nexify_master_agent.agent_workflows IS 'Automated workflows with triggers';

-- ================================================================
-- MIGRATION COMPLETE ✅
-- ================================================================
