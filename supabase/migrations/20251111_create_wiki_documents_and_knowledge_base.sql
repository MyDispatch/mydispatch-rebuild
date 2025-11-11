-- ==================================================================================
-- MyDispatch Knowledge System: knowledge_base + wiki_documents + sync_runs
-- ==================================================================================
-- Datum: 2025-11-11
-- Zweck: Generische Wissenseinträge und MD-2024-Dokumentensync mit RLS
-- ==================================================================================

-- 0) Utility: Ensure update_updated_at_column exists (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER LANGUAGE plpgsql AS $$
    BEGIN
      NEW.updated_at := NOW();
      RETURN NEW;
    END;
    $$;
  END IF;
END $$;

-- 1) Generic knowledge_base table (catch-all entries)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  tags TEXT[],
  confidence_score NUMERIC DEFAULT 1.0,
  source TEXT,
  doc_version TEXT,
  is_deprecated BOOLEAN DEFAULT FALSE,
  superseded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kb_select_authenticated"
  ON knowledge_base FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "kb_write_service_role"
  ON knowledge_base FOR ALL
  TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_kb_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_kb_title ON knowledge_base(title);
CREATE INDEX IF NOT EXISTS idx_kb_tags ON knowledge_base USING GIN(tags);

DROP TRIGGER IF EXISTS trg_kb_updated_at ON knowledge_base;
CREATE TRIGGER trg_kb_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2) MD-2024 wiki_documents (repository docs snapshot & metadata)
CREATE TABLE IF NOT EXISTS wiki_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL UNIQUE,                    -- relative path in repo (e.g., docs/README.md)
  title TEXT NOT NULL,                          -- MD-2024 Titel
  status TEXT CHECK (status IN ('Draft','Production-Ready')),
  version TEXT,                                 -- x.y.z
  date DATE,                                    -- YYYY-MM-DD
  author TEXT,
  summary TEXT,
  sections JSONB,                               -- keyed sections content (e.g., Details, Validierung)
  references JSONB,                             -- array of referenced file paths / docs
  tags TEXT[],
  content_md TEXT,                              -- full markdown content for search
  content_hash TEXT,                            -- sha256 of file for change detection
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wiki_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wiki_docs_select_authenticated"
  ON wiki_documents FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "wiki_docs_write_service_role"
  ON wiki_documents FOR ALL
  TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_wiki_docs_path ON wiki_documents(path);
CREATE INDEX IF NOT EXISTS idx_wiki_docs_title ON wiki_documents(title);
CREATE INDEX IF NOT EXISTS idx_wiki_docs_tags ON wiki_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_wiki_docs_hash ON wiki_documents(content_hash);

DROP TRIGGER IF EXISTS trg_wiki_docs_updated_at ON wiki_documents;
CREATE TRIGGER trg_wiki_docs_updated_at
  BEFORE UPDATE ON wiki_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3) Sync run audit
CREATE TABLE IF NOT EXISTS wiki_sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at TIMESTAMPTZ DEFAULT NOW(),
  initiated_by UUID,                 -- optional: auth.users.id
  environment TEXT,                  -- e.g., github_actions, local
  files_processed INTEGER DEFAULT 0,
  inserted_count INTEGER DEFAULT 0,
  updated_count INTEGER DEFAULT 0,
  errors JSONB,                      -- { path: string, message: string }[]
  notes TEXT
);

ALTER TABLE wiki_sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wiki_sync_select_authenticated"
  ON wiki_sync_runs FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "wiki_sync_write_service_role"
  ON wiki_sync_runs FOR ALL
  TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_wiki_sync_runs_run_at ON wiki_sync_runs(run_at);

-- ==================================================================================
-- SUCCESS MESSAGE
-- ==================================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ knowledge_base & wiki_documents erstellt mit RLS';
END $$;

