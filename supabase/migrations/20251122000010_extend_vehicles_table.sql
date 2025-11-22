-- ========================================
-- TASK 4: Fahrzeugflotte - Erweiterte Felder
-- ========================================
-- vehicles table um 11 neue Spalten erweitern
-- für vollständige Fahrzeug-Dokumentation

-- ============================================================================
-- PART 1: VEHICLES TABLE - Add Extended Columns
-- ============================================================================

ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS vin TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS hsn TEXT,
ADD COLUMN IF NOT EXISTS tsn TEXT,
ADD COLUMN IF NOT EXISTS power_kw INTEGER,
ADD COLUMN IF NOT EXISTS power_ps INTEGER,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS year_built INTEGER CHECK (year_built >= 1900 AND year_built <= EXTRACT(YEAR FROM NOW()) + 1),
ADD COLUMN IF NOT EXISTS first_registration DATE,
ADD COLUMN IF NOT EXISTS mileage INTEGER CHECK (mileage >= 0),
ADD COLUMN IF NOT EXISTS document_url TEXT,
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.vehicles.manufacturer IS 'Hersteller (z.B. Mercedes-Benz, BMW, Volkswagen)';
COMMENT ON COLUMN public.vehicles.model IS 'Modell (z.B. E-Klasse, 5er, Passat)';
COMMENT ON COLUMN public.vehicles.vin IS 'Fahrzeug-Identifikationsnummer (VIN/FIN) - UNIQUE';
COMMENT ON COLUMN public.vehicles.hsn IS 'Herstellerschlüsselnummer (deutsche Typenschlüssel)';
COMMENT ON COLUMN public.vehicles.tsn IS 'Typschlüsselnummer (deutsche Typenschlüssel)';
COMMENT ON COLUMN public.vehicles.power_kw IS 'Motorleistung in Kilowatt (kW)';
COMMENT ON COLUMN public.vehicles.power_ps IS 'Motorleistung in PS (Pferdestärke)';
COMMENT ON COLUMN public.vehicles.color IS 'Fahrzeugfarbe';
COMMENT ON COLUMN public.vehicles.year_built IS 'Baujahr des Fahrzeugs';
COMMENT ON COLUMN public.vehicles.first_registration IS 'Datum der Erstzulassung';
COMMENT ON COLUMN public.vehicles.mileage IS 'Aktueller Kilometerstand';
COMMENT ON COLUMN public.vehicles.document_url IS 'URL zu Fahrzeugschein (Supabase Storage)';
COMMENT ON COLUMN public.vehicles.photos IS 'Array von Foto-URLs (max. 10 Fotos)';

-- ============================================================================
-- PART 2: STORAGE BUCKET - Vehicle Documents & Photos
-- ============================================================================

-- Create storage bucket for vehicle documents (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle_documents', 'vehicle_documents', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Users can upload documents for their company's vehicles
CREATE POLICY IF NOT EXISTS "Users can upload vehicle documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle_documents' 
  AND auth.uid() IN (
    SELECT user_id FROM profiles 
    WHERE company_id IN (
      SELECT company_id FROM vehicles 
      WHERE id::text = (storage.foldername(name))[1]
    )
  )
);

-- RLS Policy: Users can view documents for their company's vehicles
CREATE POLICY IF NOT EXISTS "Users can view vehicle documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'vehicle_documents'
  AND auth.uid() IN (
    SELECT user_id FROM profiles 
    WHERE company_id IN (
      SELECT company_id FROM vehicles 
      WHERE id::text = (storage.foldername(name))[1]
    )
  )
);

-- ============================================================================
-- PART 3: VALIDATION FUNCTIONS
-- ============================================================================

-- Function: Validate VIN (17 characters, alphanumeric, no I, O, Q)
CREATE OR REPLACE FUNCTION public.validate_vin(p_vin TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF p_vin IS NULL THEN
    RETURN TRUE; -- VIN is optional
  END IF;
  
  -- VIN must be exactly 17 characters
  IF LENGTH(p_vin) != 17 THEN
    RETURN FALSE;
  END IF;
  
  -- VIN must not contain I, O, Q (to avoid confusion with 1, 0)
  IF p_vin ~ '[IOQ]' THEN
    RETURN FALSE;
  END IF;
  
  -- VIN must be alphanumeric
  IF p_vin !~ '^[A-HJ-NPR-Z0-9]{17}$' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add constraint for VIN validation
ALTER TABLE public.vehicles
ADD CONSTRAINT check_valid_vin CHECK (validate_vin(vin));

-- Function: Calculate PS from KW (1 kW = 1.35962 PS)
CREATE OR REPLACE FUNCTION public.kw_to_ps(p_kw INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN ROUND(p_kw * 1.35962);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Calculate KW from PS
CREATE OR REPLACE FUNCTION public.ps_to_kw(p_ps INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN ROUND(p_ps / 1.35962);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.validate_vin IS 'Validiert VIN (17 Zeichen, kein I/O/Q)';
COMMENT ON FUNCTION public.kw_to_ps IS 'Konvertiert kW zu PS';
COMMENT ON FUNCTION public.ps_to_kw IS 'Konvertiert PS zu kW';

-- ============================================================================
-- PART 4: AUTO-SYNC KW/PS TRIGGER
-- ============================================================================

-- Trigger function: Auto-sync power_kw <-> power_ps
CREATE OR REPLACE FUNCTION public.sync_vehicle_power()
RETURNS TRIGGER AS $$
BEGIN
  -- If only KW provided, calculate PS
  IF NEW.power_kw IS NOT NULL AND NEW.power_ps IS NULL THEN
    NEW.power_ps := kw_to_ps(NEW.power_kw);
  END IF;
  
  -- If only PS provided, calculate KW
  IF NEW.power_ps IS NOT NULL AND NEW.power_kw IS NULL THEN
    NEW.power_kw := ps_to_kw(NEW.power_ps);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_sync_vehicle_power ON public.vehicles;
CREATE TRIGGER trigger_sync_vehicle_power
  BEFORE INSERT OR UPDATE OF power_kw, power_ps ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vehicle_power();

-- ============================================================================
-- PART 5: VALIDATION QUERIES
-- ============================================================================

-- Check vehicles with new fields
-- SELECT 
--   license_plate,
--   manufacturer,
--   model,
--   vin,
--   hsn,
--   tsn,
--   power_kw || ' kW / ' || power_ps || ' PS' as power,
--   color,
--   year_built,
--   first_registration,
--   mileage,
--   jsonb_array_length(COALESCE(photos, '[]'::jsonb)) as photo_count
-- FROM public.vehicles
-- LIMIT 10;

-- Test VIN validation
-- SELECT validate_vin('WVWZZZ3CZ9E123456'); -- Should return TRUE
-- SELECT validate_vin('INVALID'); -- Should return FALSE

-- Test power conversion
-- SELECT kw_to_ps(100); -- Should return 136
-- SELECT ps_to_kw(136); -- Should return 100
