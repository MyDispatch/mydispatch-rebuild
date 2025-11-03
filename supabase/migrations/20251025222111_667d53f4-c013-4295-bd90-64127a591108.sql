-- Wagennummer-Spalte zu vehicles Tabelle hinzufügen
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(20);

-- Kommentar hinzufügen
COMMENT ON COLUMN public.vehicles.vehicle_number IS 'Eindeutige Wagennummer zur Identifikation auf Karte und in Dokumenten';