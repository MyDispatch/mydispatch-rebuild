-- Fix Security Warning: Function Search Path für validate_company_slug
CREATE OR REPLACE FUNCTION validate_company_slug()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Slug Format-Validierung
  IF NEW.company_slug !~ '^[a-z0-9-]+$' THEN
    RAISE EXCEPTION 'Ungültiger Slug-Format. Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt.';
  END IF;
  
  -- Mindestlänge
  IF LENGTH(NEW.company_slug) < 3 THEN
    RAISE EXCEPTION 'Slug muss mindestens 3 Zeichen lang sein.';
  END IF;
  
  -- Maximal-Länge
  IF LENGTH(NEW.company_slug) > 50 THEN
    RAISE EXCEPTION 'Slug darf maximal 50 Zeichen lang sein.';
  END IF;
  
  RETURN NEW;
END;
$$;