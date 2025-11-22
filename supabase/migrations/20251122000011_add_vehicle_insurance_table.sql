-- ========================================
-- TASK 5: KFZ-Versicherung Verwaltung
-- ========================================
-- Neue Tabelle vehicle_insurance für umfassende Versicherungsverwaltung
-- mit SF-Klassen, Selbstbeteiligung, Ablauferinnerungen

-- ============================================================================
-- PART 1: VEHICLE INSURANCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vehicle_insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,

  -- Versicherungsunternehmen
  insurance_company TEXT NOT NULL,
  policy_number TEXT NOT NULL,

  -- SF-Klassen (Schadensfreiheitsklassen)
  sf_class_liability INTEGER CHECK (sf_class_liability >= 0 AND sf_class_liability <= 50),
  sf_class_comprehensive INTEGER CHECK (sf_class_comprehensive >= 0 AND sf_class_comprehensive <= 50),

  -- Selbstbeteiligung
  deductible_partial_comprehensive NUMERIC(10,2) DEFAULT 0.00,
  deductible_fully_comprehensive NUMERIC(10,2) DEFAULT 0.00,

  -- Laufzeit
  start_date DATE NOT NULL,
  end_date DATE NOT NULL CHECK (end_date > start_date),

  -- Dokumentenverwaltung
  document_url TEXT,

  -- Status & Tracking
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  reminder_sent_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Constraints
  UNIQUE(vehicle_id, policy_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_insurance_vehicle_id ON public.vehicle_insurance(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_insurance_company_id ON public.vehicle_insurance(company_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_insurance_end_date ON public.vehicle_insurance(end_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_insurance_status ON public.vehicle_insurance(status);

-- Comments
COMMENT ON TABLE public.vehicle_insurance IS 'KFZ-Versicherungsverwaltung mit SF-Klassen und Selbstbeteiligung';
COMMENT ON COLUMN public.vehicle_insurance.sf_class_liability IS 'SF-Klasse Haftpflicht (0-50)';
COMMENT ON COLUMN public.vehicle_insurance.sf_class_comprehensive IS 'SF-Klasse Kasko (0-50)';
COMMENT ON COLUMN public.vehicle_insurance.deductible_partial_comprehensive IS 'Selbstbeteiligung Teilkasko (€)';
COMMENT ON COLUMN public.vehicle_insurance.deductible_fully_comprehensive IS 'Selbstbeteiligung Vollkasko (€)';

-- ============================================================================
-- PART 2: ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.vehicle_insurance ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view insurance for their company's vehicles
CREATE POLICY "Users can view own vehicle insurance"
ON public.vehicle_insurance FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can insert insurance for their company's vehicles
CREATE POLICY "Users can create vehicle insurance"
ON public.vehicle_insurance FOR INSERT
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
  AND vehicle_id IN (
    SELECT id FROM vehicles WHERE company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  )
);

-- Policy: Users can update insurance for their company's vehicles
CREATE POLICY "Users can update own vehicle insurance"
ON public.vehicle_insurance FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can delete insurance for their company's vehicles
CREATE POLICY "Users can delete own vehicle insurance"
ON public.vehicle_insurance FOR DELETE
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- ============================================================================
-- PART 3: AUTO-UPDATE TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_insurance_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-expire insurance if end_date passed
  IF NEW.end_date < CURRENT_DATE AND NEW.status = 'active' THEN
    NEW.status := 'expired';
  END IF;

  -- Update updated_at timestamp
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_insurance_status ON public.vehicle_insurance;
CREATE TRIGGER trigger_update_insurance_status
  BEFORE UPDATE ON public.vehicle_insurance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_insurance_status();

-- ============================================================================
-- PART 4: EXPIRATION WARNING FUNCTION
-- ============================================================================

-- Function: Get insurances expiring soon (within X days)
CREATE OR REPLACE FUNCTION public.get_expiring_insurances(
  p_company_id UUID,
  p_days_ahead INTEGER DEFAULT 60
)
RETURNS TABLE (
  insurance_id UUID,
  vehicle_license_plate TEXT,
  insurance_company TEXT,
  policy_number TEXT,
  end_date DATE,
  days_until_expiration INTEGER,
  sf_class_liability INTEGER,
  sf_class_comprehensive INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    vi.id,
    v.license_plate,
    vi.insurance_company,
    vi.policy_number,
    vi.end_date,
    (vi.end_date - CURRENT_DATE)::INTEGER,
    vi.sf_class_liability,
    vi.sf_class_comprehensive
  FROM public.vehicle_insurance vi
  JOIN public.vehicles v ON vi.vehicle_id = v.id
  WHERE vi.company_id = p_company_id
    AND vi.status = 'active'
    AND vi.end_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + p_days_ahead)
  ORDER BY vi.end_date ASC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_expiring_insurances IS 'Gibt KFZ-Versicherungen zurück, die innerhalb der nächsten X Tage ablaufen';

-- ============================================================================
-- PART 5: STORAGE BUCKET FOR INSURANCE DOCUMENTS
-- ============================================================================

-- Create storage bucket for insurance documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('insurance_documents', 'insurance_documents', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Users can upload insurance documents for their company
CREATE POLICY IF NOT EXISTS "Users can upload insurance documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'insurance_documents'
  AND auth.uid() IN (
    SELECT user_id FROM profiles
    WHERE company_id IN (
      SELECT company_id FROM vehicle_insurance
      WHERE id::text = (storage.foldername(name))[1]
    )
  )
);

-- RLS Policy: Users can view insurance documents for their company
CREATE POLICY IF NOT EXISTS "Users can view insurance documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'insurance_documents'
  AND auth.uid() IN (
    SELECT user_id FROM profiles
    WHERE company_id IN (
      SELECT company_id FROM vehicle_insurance
      WHERE id::text = (storage.foldername(name))[1]
    )
  )
);

-- ============================================================================
-- PART 6: VALIDATION QUERIES
-- ============================================================================

-- Check vehicle insurances with expiration dates
-- SELECT
--   v.license_plate,
--   vi.insurance_company,
--   vi.policy_number,
--   vi.sf_class_liability,
--   vi.sf_class_comprehensive,
--   vi.deductible_partial_comprehensive,
--   vi.deductible_fully_comprehensive,
--   vi.start_date,
--   vi.end_date,
--   vi.status,
--   CASE
--     WHEN vi.end_date < CURRENT_DATE THEN 'Abgelaufen'
--     WHEN vi.end_date <= CURRENT_DATE + INTERVAL '60 days' THEN 'Läuft bald ab'
--     ELSE 'Aktiv'
--   END as expiration_warning
-- FROM public.vehicle_insurance vi
-- JOIN public.vehicles v ON vi.vehicle_id = v.id
-- ORDER BY vi.end_date ASC;

-- Test expiring insurances function
-- SELECT * FROM get_expiring_insurances(
--   '<your-company-id>'::UUID,
--   60 -- days ahead
-- );
