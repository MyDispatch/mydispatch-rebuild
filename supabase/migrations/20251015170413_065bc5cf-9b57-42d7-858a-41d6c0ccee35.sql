-- ==================================================================================
-- PHASE 1A: FAHRZEUGKLASSEN-UPDATE (P0)
-- ==================================================================================
-- Neue Fahrzeugklassen nach Geschäftsführer-Vorgabe:
-- "Economy Class (1-4 Pax)", "Business Class - Limousine (1-4 Pax)",
-- "Business Class - Kombi (1-4 Pax)", "First Class (1-3 Pax)", "Van / SUV (1-8 Pax)"
-- ==================================================================================

-- 1. Neues Enum erstellen
CREATE TYPE vehicle_class_new AS ENUM (
  'Economy Class (1-4 Pax)',
  'Business Class - Limousine (1-4 Pax)',
  'Business Class - Kombi (1-4 Pax)',
  'First Class (1-3 Pax)',
  'Van / SUV (1-8 Pax)'
);

-- 2. Spalte umstellen mit Mapping der alten Werte
ALTER TABLE vehicles 
  ALTER COLUMN vehicle_class TYPE vehicle_class_new 
  USING (
    CASE vehicle_class::text
      WHEN 'limousine' THEN 'Business Class - Limousine (1-4 Pax)'::vehicle_class_new
      WHEN 'van' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'bus' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'taxi' THEN 'Economy Class (1-4 Pax)'::vehicle_class_new
      WHEN 'standard' THEN 'Economy Class (1-4 Pax)'::vehicle_class_new
      ELSE 'Economy Class (1-4 Pax)'::vehicle_class_new
    END
  );

-- 3. Altes Enum löschen
DROP TYPE IF EXISTS vehicle_class;

-- 4. Neues Enum umbenennen
ALTER TYPE vehicle_class_new RENAME TO vehicle_class;

-- 5. Bookings vehicle_type aktualisieren (ist TEXT, kein Enum)
UPDATE bookings 
SET vehicle_type = 'Economy Class (1-4 Pax)' 
WHERE vehicle_type IN ('Standard', 'standard', 'taxi') OR vehicle_type IS NULL;

UPDATE bookings 
SET vehicle_type = 'Business Class - Limousine (1-4 Pax)' 
WHERE vehicle_type = 'limousine';

UPDATE bookings 
SET vehicle_type = 'Van / SUV (1-8 Pax)' 
WHERE vehicle_type IN ('van', 'bus');

-- 6. Zusätzliche Felder für Bookings hinzufügen
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS passengers INTEGER DEFAULT 1 CHECK (passengers >= 1 AND passengers <= 8),
ADD COLUMN IF NOT EXISTS luggage INTEGER DEFAULT 1 CHECK (luggage >= 1 AND luggage <= 8),
ADD COLUMN IF NOT EXISTS is_airport_pickup BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_train_station_pickup BOOLEAN DEFAULT FALSE;

-- 7. Kommentar für Dokumentation
COMMENT ON COLUMN bookings.passengers IS 'Anzahl Passagiere (1-8)';
COMMENT ON COLUMN bookings.luggage IS 'Anzahl Gepäckstücke (1-8)';
COMMENT ON COLUMN bookings.is_airport_pickup IS 'Abholung am Flughafen';
COMMENT ON COLUMN bookings.is_train_station_pickup IS 'Abholung am Bahnhof';