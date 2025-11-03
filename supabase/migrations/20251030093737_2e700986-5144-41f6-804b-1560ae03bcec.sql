-- Create RPC function to increment best_practice usage_count
CREATE OR REPLACE FUNCTION public.increment_best_practice_usage(practice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.best_practices 
  SET 
    usage_count = usage_count + 1,
    updated_at = now()
  WHERE id = practice_id;
END;
$$;