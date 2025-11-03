-- Add manual provision override field to bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS partner_provision_manual NUMERIC;

COMMENT ON COLUMN bookings.partner_provision_manual IS 'Manuell eingegebener Provisions-Betrag (überschreibt automatische Berechnung)';