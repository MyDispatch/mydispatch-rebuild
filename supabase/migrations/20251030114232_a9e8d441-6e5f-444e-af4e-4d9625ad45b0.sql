-- Phase 1-3: Extend knowledge_base for historical docs and AI memory
ALTER TABLE public.knowledge_base
ADD COLUMN IF NOT EXISTS doc_version text DEFAULT 'V19.0.0',
ADD COLUMN IF NOT EXISTS is_deprecated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS superseded_by uuid REFERENCES public.knowledge_base(id),
ADD COLUMN IF NOT EXISTS source_file text,
ADD COLUMN IF NOT EXISTS related_entries uuid[] DEFAULT '{}';

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_doc_version ON public.knowledge_base(doc_version);
CREATE INDEX IF NOT EXISTS idx_knowledge_deprecated ON public.knowledge_base(is_deprecated);
CREATE INDEX IF NOT EXISTS idx_knowledge_source_file ON public.knowledge_base(source_file);

-- Function to check knowledge freshness
CREATE OR REPLACE FUNCTION public.check_knowledge_freshness()
RETURNS TABLE(
  entry_id uuid,
  title text,
  days_old integer,
  last_accessed timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    kb.id,
    kb.title,
    EXTRACT(DAY FROM (NOW() - kb.updated_at))::integer as days_old,
    kb.last_accessed
  FROM public.knowledge_base kb
  WHERE 
    kb.updated_at < NOW() - INTERVAL '30 days'
    AND kb.confidence_score < 0.8
  ORDER BY kb.updated_at ASC
  LIMIT 20;
END;
$$;

-- Trigger to warn about outdated knowledge
CREATE OR REPLACE FUNCTION public.warn_outdated_knowledge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.updated_at < NOW() - INTERVAL '90 days' AND NEW.confidence_score < 0.7 THEN
    NEW.metadata = jsonb_set(
      COALESCE(NEW.metadata, '{}'::jsonb),
      '{warning}',
      '"VERALTET - Bitte reviewen!"'::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_warn_outdated_knowledge ON public.knowledge_base;
CREATE TRIGGER trigger_warn_outdated_knowledge
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.warn_outdated_knowledge();

COMMENT ON COLUMN public.knowledge_base.doc_version IS 'Version des Ursprungs-Dokuments (z.B. V19.0.0, V18.5.1)';
COMMENT ON COLUMN public.knowledge_base.is_deprecated IS 'Markiert veraltete Einträge, die durch neuere Version ersetzt wurden';
COMMENT ON COLUMN public.knowledge_base.superseded_by IS 'UUID des Eintrags, der diesen ersetzt hat';
COMMENT ON COLUMN public.knowledge_base.source_file IS 'Original-Dateipfad (z.B. docs/PROJECT_MEMORY.md)';
COMMENT ON COLUMN public.knowledge_base.related_entries IS 'Array von UUIDs verwandter Knowledge-Base Einträge';