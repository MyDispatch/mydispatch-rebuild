-- ========================================
-- Task 10: Fahrzeugflotte - Fehlende Felder
-- ========================================
-- Adds comprehensive vehicle data fields:
-- - manufacturer, model, vin (Fahrzeug-Identifikationsnummer)
-- - hsn, tsn (Schlüsselnummern für deutsche Fahrzeuge)
-- - power_kw, power_ps (Leistungsangaben)
-- - color (Fahrzeugfarbe)
-- - build_year (Baujahr), first_registration (Erstzulassung)
-- - mileage (Kilometerstand)
-- - registration_document_url (Fahrzeugschein-Upload)
-- - photos (max. 10 Fotos als JSON array)

ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS vin TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS hsn TEXT,
ADD COLUMN IF NOT EXISTS tsn TEXT,
ADD COLUMN IF NOT EXISTS power_kw INTEGER,
ADD COLUMN IF NOT EXISTS power_ps INTEGER,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS build_year INTEGER,
ADD COLUMN IF NOT EXISTS first_registration DATE,
ADD COLUMN IF NOT EXISTS mileage INTEGER,
ADD COLUMN IF NOT EXISTS registration_document_url TEXT,
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::JSONB;

-- Comments for documentation
COMMENT ON COLUMN public.vehicles.manufacturer IS 'Vehicle manufacturer (e.g., Mercedes-Benz, BMW, VW)';
COMMENT ON COLUMN public.vehicles.model IS 'Vehicle model (e.g., E-Class, 5 Series, Passat)';
COMMENT ON COLUMN public.vehicles.vin IS 'Vehicle Identification Number (Fahrzeug-Identifikationsnummer) - unique identifier';
COMMENT ON COLUMN public.vehicles.hsn IS 'Herstellerschlüsselnummer (4 digits for German vehicles)';
COMMENT ON COLUMN public.vehicles.tsn IS 'Typschlüsselnummer (3 digits for German vehicles)';
COMMENT ON COLUMN public.vehicles.power_kw IS 'Engine power in kilowatts (KW)';
COMMENT ON COLUMN public.vehicles.power_ps IS 'Engine power in horsepower (PS) - calculated as kw × 1.36';
COMMENT ON COLUMN public.vehicles.color IS 'Vehicle color (exterior)';
COMMENT ON COLUMN public.vehicles.build_year IS 'Year of manufacture (Baujahr)';
COMMENT ON COLUMN public.vehicles.first_registration IS 'Date of first registration (Erstzulassung)';
COMMENT ON COLUMN public.vehicles.mileage IS 'Current mileage in kilometers (Kilometerstand)';
COMMENT ON COLUMN public.vehicles.registration_document_url IS 'URL to uploaded vehicle registration document (Fahrzeugschein) in Supabase Storage';
COMMENT ON COLUMN public.vehicles.photos IS 'JSON array of photo URLs (max. 10 photos) - format: [{"url": "...", "order": 1}, ...]';

-- Constraints for data integrity
ALTER TABLE public.vehicles
ADD CONSTRAINT check_hsn_length CHECK (hsn IS NULL OR LENGTH(hsn) = 4),
ADD CONSTRAINT check_tsn_length CHECK (tsn IS NULL OR LENGTH(tsn) = 3),
ADD CONSTRAINT check_power_positive CHECK (power_kw IS NULL OR power_kw > 0),
ADD CONSTRAINT check_build_year_range CHECK (build_year IS NULL OR (build_year >= 1900 AND build_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1)),
ADD CONSTRAINT check_mileage_positive CHECK (mileage IS NULL OR mileage >= 0),
ADD CONSTRAINT check_photos_array CHECK (jsonb_array_length(photos) <= 10);

-- Index for VIN lookup (frequently used for vehicle identification)
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON public.vehicles(vin) WHERE vin IS NOT NULL;

-- Index for manufacturer/model search
CREATE INDEX IF NOT EXISTS idx_vehicles_manufacturer_model ON public.vehicles(manufacturer, model) WHERE manufacturer IS NOT NULL;
