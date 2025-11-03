-- ==================================================================================
-- PHASE 1A: Fahrzeugklassen-Update
-- ==================================================================================
-- Neue Fahrzeugklassen laut Geschäftsführer-Vorgabe:
-- - Economy Class (1-4 Pax)
-- - Business Class - Limousine (1-4 Pax)
-- - Business Class - Kombi (1-4 Pax)
-- - First Class (1-3 Pax)
-- - Van / SUV (1-8 Pax)
-- ==================================================================================

-- 1. Neues Enum erstellen
CREATE TYPE vehicle_class_new AS ENUM (
  'Economy Class (1-4 Pax)',
  'Business Class - Limousine (1-4 Pax)',
  'Business Class - Kombi (1-4 Pax)',
  'First Class (1-3 Pax)',
  'Van / SUV (1-8 Pax)'
);

-- 2. Spalte umstellen mit CASE-Migration
ALTER TABLE vehicles 
  ALTER COLUMN vehicle_class TYPE vehicle_class_new 
  USING (
    CASE vehicle_class::text
      WHEN 'limousine' THEN 'Business Class - Limousine (1-4 Pax)'::vehicle_class_new
      WHEN 'van' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'bus' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'suv' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'standard' THEN 'Economy Class (1-4 Pax)'::vehicle_class_new
      WHEN 'kombi' THEN 'Business Class - Kombi (1-4 Pax)'::vehicle_class_new
      WHEN 'first_class' THEN 'First Class (1-3 Pax)'::vehicle_class_new
      ELSE 'Economy Class (1-4 Pax)'::vehicle_class_new
    END
  );

-- 3. Altes Enum löschen
DROP TYPE vehicle_class;

-- 4. Umbenennen des neuen Enums
ALTER TYPE vehicle_class_new RENAME TO vehicle_class;

-- 5. Bookings vehicle_type aktualisieren (ist TEXT, kein Enum)
-- Bereinige existierende Daten
UPDATE bookings 
SET vehicle_type = 'Economy Class (1-4 Pax)' 
WHERE vehicle_type = 'Standard' OR vehicle_type = 'standard' OR vehicle_type IS NULL;

UPDATE bookings 
SET vehicle_type = 'Business Class - Limousine (1-4 Pax)' 
WHERE vehicle_type = 'limousine' OR vehicle_type = 'Limousine';

UPDATE bookings 
SET vehicle_type = 'Business Class - Kombi (1-4 Pax)' 
WHERE vehicle_type = 'kombi' OR vehicle_type = 'Kombi';

UPDATE bookings 
SET vehicle_type = 'First Class (1-3 Pax)' 
WHERE vehicle_type = 'first_class' OR vehicle_type = 'First Class';

UPDATE bookings 
SET vehicle_type = 'Van / SUV (1-8 Pax)' 
WHERE vehicle_type = 'van' OR vehicle_type = 'Van' OR vehicle_type = 'suv' OR vehicle_type = 'SUV' OR vehicle_type = 'bus';