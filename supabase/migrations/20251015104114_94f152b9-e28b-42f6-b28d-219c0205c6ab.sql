-- Phase 1A: Fahrzeugklassen-Update
-- Neue Fahrzeugklassen gem. Vorgabe Geschäftsführer

-- 1. Neues Enum mit finalen Fahrzeugklassen erstellen
CREATE TYPE vehicle_class_new AS ENUM (
  'Economy Class (1-4 Pax)',
  'Business Class - Limousine (1-4 Pax)',
  'Business Class - Kombi (1-4 Pax)',
  'First Class (1-3 Pax)',
  'Van / SUV (1-8 Pax)'
);

-- 2. Spalte vehicles.vehicle_class auf neues Enum umstellen
ALTER TABLE vehicles 
  ALTER COLUMN vehicle_class TYPE vehicle_class_new 
  USING (
    CASE vehicle_class::text
      WHEN 'limousine' THEN 'Business Class - Limousine (1-4 Pax)'::vehicle_class_new
      WHEN 'van' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'bus' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'Economy Class (1-4 Pax)' THEN 'Economy Class (1-4 Pax)'::vehicle_class_new
      WHEN 'Business Class - Limousine (1-4 Pax)' THEN 'Business Class - Limousine (1-4 Pax)'::vehicle_class_new
      WHEN 'Business Class - Kombi (1-4 Pax)' THEN 'Business Class - Kombi (1-4 Pax)'::vehicle_class_new
      WHEN 'First Class (1-3 Pax)' THEN 'First Class (1-3 Pax)'::vehicle_class_new
      WHEN 'Van / SUV (1-8 Pax)' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      ELSE 'Economy Class (1-4 Pax)'::vehicle_class_new
    END
  );

-- 3. Altes Enum löschen und neues umbenennen
DROP TYPE vehicle_class;
ALTER TYPE vehicle_class_new RENAME TO vehicle_class;

-- 4. Bookings vehicle_type aktualisieren (ist TEXT, kein Enum)
-- Alte Werte auf neue Fahrzeugklassen mappen
UPDATE bookings 
SET vehicle_type = CASE 
  WHEN vehicle_type = 'Standard' OR vehicle_type = 'standard' THEN 'Economy Class (1-4 Pax)'
  WHEN vehicle_type = 'limousine' OR vehicle_type = 'Limousine' THEN 'Business Class - Limousine (1-4 Pax)'
  WHEN vehicle_type = 'van' OR vehicle_type = 'Van' THEN 'Van / SUV (1-8 Pax)'
  WHEN vehicle_type = 'bus' OR vehicle_type = 'Bus' THEN 'Van / SUV (1-8 Pax)'
  WHEN vehicle_type IS NULL THEN 'Economy Class (1-4 Pax)'
  ELSE vehicle_type
END;

-- Kommentar: Migration abgeschlossen
COMMENT ON TYPE vehicle_class IS 'Fahrzeugklassen gem. Geschäftsführer-Vorgabe vom 15.10.2025';