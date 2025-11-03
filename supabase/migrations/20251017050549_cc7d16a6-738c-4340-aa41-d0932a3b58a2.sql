-- Fix Security Warning für neue Funktion
CREATE OR REPLACE FUNCTION update_special_accounts_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public  -- FIX: Search path explizit setzen
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;