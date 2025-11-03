-- ==================================================================================
-- FOREIGN KEY FIX: bookings -> partners Relationship
-- ==================================================================================
-- Behebt: "Could not find a relationship between 'bookings' and 'partners'"
-- ==================================================================================

-- Add foreign key constraint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'bookings_partner_id_fkey'
  ) THEN
    ALTER TABLE bookings 
    ADD CONSTRAINT bookings_partner_id_fkey 
    FOREIGN KEY (partner_id) 
    REFERENCES partners(id) 
    ON DELETE SET NULL;
  END IF;
END $$;