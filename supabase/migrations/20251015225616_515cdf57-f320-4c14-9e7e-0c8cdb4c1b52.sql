-- ==================================================================================
-- SECURITY FIX: Function Search Path für alle Trigger-Funktionen
-- ==================================================================================

-- Fix für generate_driver_address()
CREATE OR REPLACE FUNCTION generate_driver_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.street IS NOT NULL AND NEW.street_number IS NOT NULL 
     AND NEW.postal_code IS NOT NULL AND NEW.city IS NOT NULL THEN
    NEW.address := NEW.street || ' ' || NEW.street_number || ', ' || NEW.postal_code || ' ' || NEW.city;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;