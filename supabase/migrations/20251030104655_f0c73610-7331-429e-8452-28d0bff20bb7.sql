-- Fix Security Warning: Set search_path for function
CREATE OR REPLACE FUNCTION update_roadmap_tasks_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;