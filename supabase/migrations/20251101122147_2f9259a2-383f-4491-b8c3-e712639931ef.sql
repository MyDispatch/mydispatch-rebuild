-- Fix Security Warning: Add search_path to generate_customer_billing_address
CREATE OR REPLACE FUNCTION generate_customer_billing_address()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $$
BEGIN
  IF NEW.billing_street IS NOT NULL AND NEW.billing_street_number IS NOT NULL 
     AND NEW.billing_postal_code IS NOT NULL AND NEW.billing_city IS NOT NULL THEN
    NEW.billing_address := NEW.billing_street || ' ' || NEW.billing_street_number || ', ' 
                          || NEW.billing_postal_code || ' ' || NEW.billing_city;
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trg_generate_customer_billing_address ON customers;
CREATE TRIGGER trg_generate_customer_billing_address
  BEFORE INSERT OR UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION generate_customer_billing_address();