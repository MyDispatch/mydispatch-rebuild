-- ==================================================================================
-- KRITISCHE RLS POLICIES FÜR NEUE ENTITIES
-- Sprint 1 - P0 Priorität  
-- ==================================================================================
-- Diese Migration erstellt RLS Policies für:
-- - cost_centers (bereits existierend, Policies fehlen)
-- - documents (bereits existierend, Policies fehlen)
-- - shifts (bereits existierend, Policies fehlen)
-- - payment_reminders (bereits existierend, Policies fehlen)
-- ==================================================================================

-- ==================================================================================
-- VERIFY RLS IS ENABLED FIRST
-- ==================================================================================
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;

-- ==================================================================================
-- DROP EXISTING POLICIES IF ANY (to avoid conflicts)
-- ==================================================================================
DROP POLICY IF EXISTS "Users can view cost_centers of their company" ON public.cost_centers;
DROP POLICY IF EXISTS "Users can insert cost_centers for their company" ON public.cost_centers;
DROP POLICY IF EXISTS "Users can update cost_centers of their company" ON public.cost_centers;
DROP POLICY IF EXISTS "Users can delete cost_centers of their company" ON public.cost_centers;

DROP POLICY IF EXISTS "Users can view documents of their company" ON public.documents;
DROP POLICY IF EXISTS "Users can insert documents for their company" ON public.documents;
DROP POLICY IF EXISTS "Users can update documents of their company" ON public.documents;
DROP POLICY IF EXISTS "Users can delete documents of their company" ON public.documents;

DROP POLICY IF EXISTS "Users can view shifts of their company" ON public.shifts;
DROP POLICY IF EXISTS "Users can insert shifts for their company" ON public.shifts;
DROP POLICY IF EXISTS "Users can update shifts of their company" ON public.shifts;
DROP POLICY IF EXISTS "Users can delete shifts of their company" ON public.shifts;

DROP POLICY IF EXISTS "Users can view payment_reminders of their company" ON public.payment_reminders;
DROP POLICY IF EXISTS "Users can insert payment_reminders for their company" ON public.payment_reminders;
DROP POLICY IF EXISTS "Users can update payment_reminders of their company" ON public.payment_reminders;
DROP POLICY IF EXISTS "Users can delete payment_reminders of their company" ON public.payment_reminders;

-- ==================================================================================
-- RLS POLICIES: COST_CENTERS
-- ==================================================================================
CREATE POLICY "Users can view cost_centers of their company"
ON public.cost_centers
FOR SELECT
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert cost_centers for their company"
ON public.cost_centers
FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update cost_centers of their company"
ON public.cost_centers
FOR UPDATE
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete cost_centers of their company"
ON public.cost_centers
FOR DELETE
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- ==================================================================================
-- RLS POLICIES: DOCUMENTS
-- ==================================================================================
CREATE POLICY "Users can view documents of their company"
ON public.documents
FOR SELECT
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert documents for their company"
ON public.documents
FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update documents of their company"
ON public.documents
FOR UPDATE
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete documents of their company"
ON public.documents
FOR DELETE
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- ==================================================================================
-- RLS POLICIES: SHIFTS (Schichtzettel)
-- ==================================================================================
CREATE POLICY "Users can view shifts of their company"
ON public.shifts
FOR SELECT
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert shifts for their company"
ON public.shifts
FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update shifts of their company"
ON public.shifts
FOR UPDATE
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete shifts of their company"
ON public.shifts
FOR DELETE
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- ==================================================================================
-- RLS POLICIES: PAYMENT_REMINDERS (Zahlungserinnerungen)
-- ==================================================================================
CREATE POLICY "Users can view payment_reminders of their company"
ON public.payment_reminders
FOR SELECT
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert payment_reminders for their company"
ON public.payment_reminders
FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update payment_reminders of their company"
ON public.payment_reminders
FOR UPDATE
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete payment_reminders of their company"
ON public.payment_reminders
FOR DELETE
USING (
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);
