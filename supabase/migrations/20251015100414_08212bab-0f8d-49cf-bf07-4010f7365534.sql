-- ==================================================================================
-- PHASE 1A: FAHRZEUGKLASSEN-UPDATE & BOOKING-ERWEITERUNGEN
-- ==================================================================================
-- Neue vehicle_class Enum-Werte + Passengers/Luggage Felder
-- ==================================================================================

-- 1. Neues Enum für Fahrzeugklassen erstellen
CREATE TYPE vehicle_class_new AS ENUM (
  'Economy Class (1-4 Pax)',
  'Business Class - Limousine (1-4 Pax)',
  'Business Class - Kombi (1-4 Pax)',
  'First Class (1-3 Pax)',
  'Van / SUV (1-8 Pax)'
);

-- 2. Vehicles Tabelle: vehicle_class umstellen
ALTER TABLE vehicles 
  ALTER COLUMN vehicle_class TYPE vehicle_class_new 
  USING (
    CASE vehicle_class::text
      WHEN 'Economy Class (1-4 Pax)' THEN 'Economy Class (1-4 Pax)'::vehicle_class_new
      WHEN 'Business Class - Limousine (1-4 Pax)' THEN 'Business Class - Limousine (1-4 Pax)'::vehicle_class_new
      WHEN 'Business Class - Kombi (1-4 Pax)' THEN 'Business Class - Kombi (1-4 Pax)'::vehicle_class_new
      WHEN 'First Class (1-3 Pax)' THEN 'First Class (1-3 Pax)'::vehicle_class_new
      WHEN 'Van / SUV (1-8 Pax)' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      ELSE 'Economy Class (1-4 Pax)'::vehicle_class_new
    END
  );

-- 3. Altes Enum löschen und umbenennen
DROP TYPE IF EXISTS vehicle_class;
ALTER TYPE vehicle_class_new RENAME TO vehicle_class;

-- 4. Bookings: vehicle_type aktualisieren (TEXT, kein Enum)
UPDATE bookings 
SET vehicle_type = 'Economy Class (1-4 Pax)' 
WHERE vehicle_type IS NULL OR vehicle_type = '' OR vehicle_type = 'Standard';

-- 5. Bookings: Passagiere & Gepäck Felder hinzufügen
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS passengers INTEGER DEFAULT 1 CHECK (passengers >= 1 AND passengers <= 8);

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS luggage INTEGER DEFAULT 0 CHECK (luggage >= 0 AND luggage <= 8);

-- 6. Bestehende Zeilen: Default-Werte setzen
UPDATE bookings 
SET passengers = 1 
WHERE passengers IS NULL;

UPDATE bookings 
SET luggage = 0 
WHERE luggage IS NULL;