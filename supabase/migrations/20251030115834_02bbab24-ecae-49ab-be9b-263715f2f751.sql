-- Phase 0: Best-Practices Schema Fix (CORRECTED)
-- Add pattern_name as generated column using TITLE (not name)
ALTER TABLE best_practices 
ADD COLUMN IF NOT EXISTS pattern_name TEXT GENERATED ALWAYS AS (title) STORED;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_doc_version ON knowledge_base(doc_version);
CREATE INDEX IF NOT EXISTS idx_component_registry_tags ON component_registry USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_code_snippets_tags ON code_snippets USING GIN(tags);

-- Add missing columns for tracking
ALTER TABLE known_issues 
ADD COLUMN IF NOT EXISTS resolved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;