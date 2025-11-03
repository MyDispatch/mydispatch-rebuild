-- Fix für generate_customer_address()
CREATE OR REPLACE FUNCTION generate_customer_address()
RETURNS TRIGGER AS $$
BEGIN
  -- Hauptadresse
  IF NEW.street IS NOT NULL AND NEW.street_number IS NOT NULL 
     AND NEW.postal_code IS NOT NULL AND NEW.city IS NOT NULL THEN
    NEW.address := NEW.street || ' ' || NEW.street_number || ', ' || NEW.postal_code || ' ' || NEW.city;
  END IF;
  
  -- Rechnungsadresse
  IF NEW.billing_street IS NOT NULL AND NEW.billing_street_number IS NOT NULL 
     AND NEW.billing_postal_code IS NOT NULL AND NEW.billing_city IS NOT NULL THEN
    NEW.billing_address := NEW.billing_street || ' ' || NEW.billing_street_number || ', ' || NEW.billing_postal_code || ' ' || NEW.billing_city;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;