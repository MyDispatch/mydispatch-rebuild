-- Phase 1A: Fahrzeugklassen-Update (P0-KRITISCH)
-- Neue Enum-Werte für vehicle_class gemäß Vorgabe

-- 1. Neues Enum erstellen mit korrekten Fahrzeugklassen
CREATE TYPE vehicle_class_new AS ENUM (
  'Economy Class (1-4 Pax)',
  'Business Class - Limousine (1-4 Pax)',
  'Business Class - Kombi (1-4 Pax)',
  'First Class (1-3 Pax)',
  'Van / SUV (1-8 Pax)'
);

-- 2. Spalte in vehicles Tabelle umstellen
ALTER TABLE vehicles 
  ALTER COLUMN vehicle_class TYPE vehicle_class_new 
  USING (
    CASE vehicle_class::text
      WHEN 'limousine' THEN 'Business Class - Limousine (1-4 Pax)'::vehicle_class_new
      WHEN 'van' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'bus' THEN 'Van / SUV (1-8 Pax)'::vehicle_class_new
      WHEN 'kombi' THEN 'Business Class - Kombi (1-4 Pax)'::vehicle_class_new
      WHEN 'first_class' THEN 'First Class (1-3 Pax)'::vehicle_class_new
      ELSE 'Economy Class (1-4 Pax)'::vehicle_class_new
    END
  );

-- 3. Altes Enum löschen
DROP TYPE IF EXISTS vehicle_class;

-- 4. Neues Enum umbenennen
ALTER TYPE vehicle_class_new RENAME TO vehicle_class;

-- 5. Bookings vehicle_type aktualisieren (TEXT-Spalte, kein Enum)
UPDATE bookings 
SET vehicle_type = 'Economy Class (1-4 Pax)' 
WHERE vehicle_type = 'Standard' OR vehicle_type IS NULL OR vehicle_type = '';

-- 6. Neue Spalten für Passagiere und Gepäck hinzufügen (falls noch nicht vorhanden)
-- HINWEIS: passengers und luggage existieren bereits in bookings laut Schema

-- 7. Kommentar hinzufügen für zukünftige Entwickler
COMMENT ON COLUMN vehicles.vehicle_class IS 'Fahrzeugklasse gemäß MyDispatch-Standard V17.5: Economy, Business (Limousine/Kombi), First Class, Van/SUV';
COMMENT ON COLUMN bookings.passengers IS 'Anzahl Passagiere (1-8)';
COMMENT ON COLUMN bookings.luggage IS 'Anzahl Gepäckstücke (0-8)';