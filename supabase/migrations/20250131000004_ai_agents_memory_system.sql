-- ==================================================================================
-- AI AGENTS MEMORY SYSTEM - Persistentes Gedächtnis für alle AI-Agenten
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Zentrales Memory-System für NeXify AI MASTER und zukünftige AI-Agenten
-- Autor: NeXify AI MASTER
-- ==================================================================================

-- ==================================================================================
-- 1. AI AGENTS MEMORY (Agent-spezifisches Memory)
-- ==================================================================================

CREATE TABLE IF NOT EXISTS ai_agents_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL, -- 'nexify-master', 'code-specialist', 'design-expert', etc.
  agent_name TEXT NOT NULL,
  memory_key TEXT NOT NULL,
  memory_value JSONB NOT NULL,
  category TEXT NOT NULL, -- 'preference', 'knowledge', 'skill', 'pattern', 'decision'
  importance_score NUMERIC(3,2) DEFAULT 0.5, -- 0.0 = niedrig, 1.0 = kritisch
  confidence_score NUMERIC(3,2) DEFAULT 1.0,
  access_count INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, memory_key)
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_ai_agents_memory_agent_id ON ai_agents_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_memory_category ON ai_agents_memory(category);
CREATE INDEX IF NOT EXISTS idx_ai_agents_memory_importance ON ai_agents_memory(importance_score DESC);

-- ==================================================================================
-- 2. AI AGENTS SHARED MEMORY (Geteiltes Memory zwischen Agenten)
-- ==================================================================================

CREATE TABLE IF NOT EXISTS ai_agents_shared_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_key TEXT NOT NULL UNIQUE,
  memory_value JSONB NOT NULL,
  category TEXT NOT NULL, -- 'knowledge', 'best_practice', 'pattern', 'rule', 'decision'
  shared_with TEXT[] NOT NULL, -- Array von agent_ids
  importance_score NUMERIC(3,2) DEFAULT 0.5,
  access_count INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL, -- agent_id
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_ai_agents_shared_memory_category ON ai_agents_shared_memory(category);
CREATE INDEX IF NOT EXISTS idx_ai_agents_shared_memory_importance ON ai_agents_shared_memory(importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_agents_shared_memory_shared_with ON ai_agents_shared_memory USING GIN(shared_with);

-- ==================================================================================
-- 3. AI AGENTS REGISTRY (Registrierung aller AI-Agenten)
-- ==================================================================================

CREATE TABLE IF NOT EXISTS ai_agents_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL UNIQUE,
  agent_name TEXT NOT NULL,
  agent_type TEXT NOT NULL, -- 'master', 'specialist', 'helper', 'validator'
  description TEXT,
  capabilities TEXT[], -- Array von Fähigkeiten
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'deprecated'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initiale Registrierung: NeXify AI MASTER
INSERT INTO ai_agents_registry (agent_id, agent_name, agent_type, description, capabilities)
VALUES (
  'nexify-master',
  'NeXify AI MASTER',
  'master',
  'Pascal''s direkter AI-Ansprechpartner für Planung, Diskussion und Gesamtumsetzung',
  ARRAY['planning', 'discussion', 'implementation', 'project-management', 'quality-assurance']
) ON CONFLICT (agent_id) DO NOTHING;

-- ==================================================================================
-- 4. HELPER FUNCTIONS
-- ==================================================================================

-- Funktion: Lade Memory für einen Agent
CREATE OR REPLACE FUNCTION load_agent_memory(_agent_id TEXT)
RETURNS JSONB AS $$
DECLARE
  agent_memory JSONB;
  shared_memory JSONB;
  result JSONB;
BEGIN
  -- Lade Agent-spezifisches Memory
  SELECT jsonb_agg(
    jsonb_build_object(
      'key', memory_key,
      'value', memory_value,
      'category', category,
      'importance', importance_score
    ) ORDER BY importance_score DESC, last_accessed_at DESC
  ) INTO agent_memory
  FROM ai_agents_memory
  WHERE agent_id = _agent_id;

  -- Lade Shared Memory (für diesen Agent relevant)
  SELECT jsonb_agg(
    jsonb_build_object(
      'key', memory_key,
      'value', memory_value,
      'category', category,
      'importance', importance_score,
      'created_by', created_by
    ) ORDER BY importance_score DESC, last_accessed_at DESC
  ) INTO shared_memory
  FROM ai_agents_shared_memory
  WHERE _agent_id = ANY(shared_with);

  -- Kombiniere Memory
  result := jsonb_build_object(
    'agent_id', _agent_id,
    'agent_memory', COALESCE(agent_memory, '[]'::jsonb),
    'shared_memory', COALESCE(shared_memory, '[]'::jsonb),
    'loaded_at', NOW()
  );

  -- Update access_count
  UPDATE ai_agents_memory
  SET access_count = access_count + 1,
      last_accessed_at = NOW()
  WHERE agent_id = _agent_id;

  UPDATE ai_agents_shared_memory
  SET access_count = access_count + 1,
      last_accessed_at = NOW()
  WHERE _agent_id = ANY(shared_with);

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion: Speichere Memory für einen Agent
CREATE OR REPLACE FUNCTION save_agent_memory(
  _agent_id TEXT,
  _memory_key TEXT,
  _memory_value JSONB,
  _category TEXT,
  _importance_score NUMERIC DEFAULT 0.5
)
RETURNS UUID AS $$
DECLARE
  memory_id UUID;
BEGIN
  INSERT INTO ai_agents_memory (
    agent_id,
    agent_name,
    memory_key,
    memory_value,
    category,
    importance_score
  )
  VALUES (
    _agent_id,
    (SELECT agent_name FROM ai_agents_registry WHERE agent_id = _agent_id),
    _memory_key,
    _memory_value,
    _category,
    _importance_score
  )
  ON CONFLICT (agent_id, memory_key)
  DO UPDATE SET
    memory_value = EXCLUDED.memory_value,
    category = EXCLUDED.category,
    importance_score = EXCLUDED.importance_score,
    updated_at = NOW()
  RETURNING id INTO memory_id;

  RETURN memory_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion: Speichere Shared Memory
CREATE OR REPLACE FUNCTION save_shared_memory(
  _memory_key TEXT,
  _memory_value JSONB,
  _category TEXT,
  _shared_with TEXT[],
  _created_by TEXT,
  _importance_score NUMERIC DEFAULT 0.5
)
RETURNS UUID AS $$
DECLARE
  memory_id UUID;
BEGIN
  INSERT INTO ai_agents_shared_memory (
    memory_key,
    memory_value,
    category,
    shared_with,
    created_by,
    importance_score
  )
  VALUES (
    _memory_key,
    _memory_value,
    _category,
    _shared_with,
    _created_by,
    _importance_score
  )
  ON CONFLICT (memory_key)
  DO UPDATE SET
    memory_value = EXCLUDED.memory_value,
    category = EXCLUDED.category,
    shared_with = EXCLUDED.shared_with,
    importance_score = EXCLUDED.importance_score,
    updated_at = NOW()
  RETURNING id INTO memory_id;

  RETURN memory_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================================================
-- 5. RLS POLICIES
-- ==================================================================================

ALTER TABLE ai_agents_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents_shared_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents_registry ENABLE ROW LEVEL SECURITY;

-- Master kann alles sehen
CREATE POLICY "Masters can view all agent memory"
ON ai_agents_memory FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'master'
  )
);

CREATE POLICY "Masters can manage all agent memory"
ON ai_agents_memory FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'master'
  )
);

-- Shared Memory ist für alle Agenten lesbar
CREATE POLICY "All agents can view shared memory"
ON ai_agents_shared_memory FOR SELECT
USING (true);

-- Registry ist für alle lesbar
CREATE POLICY "All can view agent registry"
ON ai_agents_registry FOR SELECT
USING (true);

-- ==================================================================================
-- 6. KOMMENTARE
-- ==================================================================================

COMMENT ON TABLE ai_agents_memory IS 'Agent-spezifisches Memory für persistentes Gedächtnis';
COMMENT ON TABLE ai_agents_shared_memory IS 'Geteiltes Memory zwischen AI-Agenten';
COMMENT ON TABLE ai_agents_registry IS 'Registrierung aller AI-Agenten im System';
COMMENT ON FUNCTION load_agent_memory IS 'Lädt Memory für einen spezifischen Agent';
COMMENT ON FUNCTION save_agent_memory IS 'Speichert Memory für einen Agent';
COMMENT ON FUNCTION save_shared_memory IS 'Speichert Shared Memory für mehrere Agenten';











