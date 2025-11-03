-- Fix Function Search Path Security Warning
DROP TRIGGER IF EXISTS trigger_entities_queue_updated_at ON public.entities_queue;
DROP FUNCTION IF EXISTS update_entities_queue_updated_at();

CREATE OR REPLACE FUNCTION update_entities_queue_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_entities_queue_updated_at
  BEFORE UPDATE ON public.entities_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_entities_queue_updated_at();