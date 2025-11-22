-- ========================================
-- TASK 8: Kostenstellen-Management
-- ========================================
-- Neue Tabelle cost_centers für Firmenkunden
-- mit Zuordnung zu Buchungen

-- ============================================================================
-- PART 1: COST CENTERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cost_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  
  -- Kostenstellen-Informationen
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Budget-Tracking (optional)
  budget_limit NUMERIC(10,2),
  budget_used NUMERIC(10,2) DEFAULT 0.00,
  budget_warning_threshold NUMERIC(4,2) DEFAULT 0.80 CHECK (budget_warning_threshold BETWEEN 0 AND 1),
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  UNIQUE(company_id, code),
  UNIQUE(company_id, customer_id, code)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cost_centers_company_id ON public.cost_centers(company_id);
CREATE INDEX IF NOT EXISTS idx_cost_centers_customer_id ON public.cost_centers(customer_id);
CREATE INDEX IF NOT EXISTS idx_cost_centers_code ON public.cost_centers(code);
CREATE INDEX IF NOT EXISTS idx_cost_centers_active ON public.cost_centers(active);

-- Comments
COMMENT ON TABLE public.cost_centers IS 'Kostenstellen für Firmenkunden mit Budget-Tracking';
COMMENT ON COLUMN public.cost_centers.code IS 'Kostenstellen-Code (z.B. KST-001, SALES-2024)';
COMMENT ON COLUMN public.cost_centers.name IS 'Kostenstellenname (z.B. Marketing, Vertrieb)';
COMMENT ON COLUMN public.cost_centers.budget_limit IS 'Budget-Limit für Kostenstelle (optional)';
COMMENT ON COLUMN public.cost_centers.budget_used IS 'Bereits verwendetes Budget';
COMMENT ON COLUMN public.cost_centers.budget_warning_threshold IS 'Warnschwelle in % (default: 80%)';

-- ============================================================================
-- PART 2: BOOKINGS TABLE - Add Cost Center FK
-- ============================================================================

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL;

-- Index
CREATE INDEX IF NOT EXISTS idx_bookings_cost_center_id ON public.bookings(cost_center_id);

COMMENT ON COLUMN public.bookings.cost_center_id IS 'Zugeordnete Kostenstelle (für Firmenkunden)';

-- ============================================================================
-- PART 3: ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view cost centers for their company
CREATE POLICY "Users can view own cost centers"
ON public.cost_centers FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can create cost centers for their company
CREATE POLICY "Users can create cost centers"
ON public.cost_centers FOR INSERT
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can update cost centers for their company
CREATE POLICY "Users can update own cost centers"
ON public.cost_centers FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can delete cost centers for their company
CREATE POLICY "Users can delete own cost centers"
ON public.cost_centers FOR DELETE
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- ============================================================================
-- PART 4: BUDGET TRACKING FUNCTIONS
-- ============================================================================

-- Function: Calculate cost center budget usage
CREATE OR REPLACE FUNCTION public.calculate_cost_center_budget_usage(p_cost_center_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_total NUMERIC(10,2);
BEGIN
  SELECT COALESCE(SUM(price), 0.00)
  INTO v_total
  FROM public.bookings
  WHERE cost_center_id = p_cost_center_id
    AND status NOT IN ('cancelled', 'rejected');
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.calculate_cost_center_budget_usage IS 'Berechnet verwendetes Budget einer Kostenstelle';

-- Function: Check if budget limit exceeded
CREATE OR REPLACE FUNCTION public.is_budget_limit_exceeded(p_cost_center_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_cost_center RECORD;
  v_used NUMERIC(10,2);
BEGIN
  SELECT * INTO v_cost_center FROM public.cost_centers WHERE id = p_cost_center_id;
  
  IF NOT FOUND OR v_cost_center.budget_limit IS NULL THEN
    RETURN false; -- No limit or cost center not found
  END IF;
  
  v_used := calculate_cost_center_budget_usage(p_cost_center_id);
  
  RETURN v_used >= v_cost_center.budget_limit;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.is_budget_limit_exceeded IS 'Prüft, ob Budget-Limit überschritten ist';

-- Function: Check if budget warning threshold reached
CREATE OR REPLACE FUNCTION public.is_budget_warning_threshold_reached(p_cost_center_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_cost_center RECORD;
  v_used NUMERIC(10,2);
  v_threshold NUMERIC(10,2);
BEGIN
  SELECT * INTO v_cost_center FROM public.cost_centers WHERE id = p_cost_center_id;
  
  IF NOT FOUND OR v_cost_center.budget_limit IS NULL THEN
    RETURN false; -- No limit or cost center not found
  END IF;
  
  v_used := calculate_cost_center_budget_usage(p_cost_center_id);
  v_threshold := v_cost_center.budget_limit * v_cost_center.budget_warning_threshold;
  
  RETURN v_used >= v_threshold;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.is_budget_warning_threshold_reached IS 'Prüft, ob Warn-Schwelle erreicht ist';

-- ============================================================================
-- PART 5: AUTO-UPDATE BUDGET TRIGGER
-- ============================================================================

-- Trigger function: Update budget_used on booking changes
CREATE OR REPLACE FUNCTION public.update_cost_center_budget()
RETURNS TRIGGER AS $$
DECLARE
  v_old_cost_center_id UUID;
  v_new_cost_center_id UUID;
BEGIN
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    v_old_cost_center_id := OLD.cost_center_id;
    v_new_cost_center_id := NEW.cost_center_id;
    
    -- If cost_center_id changed, update both old and new
    IF v_old_cost_center_id IS DISTINCT FROM v_new_cost_center_id THEN
      IF v_old_cost_center_id IS NOT NULL THEN
        UPDATE public.cost_centers
        SET budget_used = calculate_cost_center_budget_usage(v_old_cost_center_id)
        WHERE id = v_old_cost_center_id;
      END IF;
      
      IF v_new_cost_center_id IS NOT NULL THEN
        UPDATE public.cost_centers
        SET budget_used = calculate_cost_center_budget_usage(v_new_cost_center_id)
        WHERE id = v_new_cost_center_id;
      END IF;
    ELSE
      -- Just price/status changed, update current cost center
      IF v_new_cost_center_id IS NOT NULL THEN
        UPDATE public.cost_centers
        SET budget_used = calculate_cost_center_budget_usage(v_new_cost_center_id)
        WHERE id = v_new_cost_center_id;
      END IF;
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    IF NEW.cost_center_id IS NOT NULL THEN
      UPDATE public.cost_centers
      SET budget_used = calculate_cost_center_budget_usage(NEW.cost_center_id)
      WHERE id = NEW.cost_center_id;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.cost_center_id IS NOT NULL THEN
      UPDATE public.cost_centers
      SET budget_used = calculate_cost_center_budget_usage(OLD.cost_center_id)
      WHERE id = OLD.cost_center_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_cost_center_budget ON public.bookings;
CREATE TRIGGER trigger_update_cost_center_budget
  AFTER INSERT OR UPDATE OF cost_center_id, price, status OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cost_center_budget();

-- ============================================================================
-- PART 6: REPORTING FUNCTIONS
-- ============================================================================

-- Function: Get cost center overview with budget status
CREATE OR REPLACE FUNCTION public.get_cost_centers_overview(p_company_id UUID)
RETURNS TABLE (
  cost_center_id UUID,
  code TEXT,
  name TEXT,
  budget_limit NUMERIC(10,2),
  budget_used NUMERIC(10,2),
  budget_remaining NUMERIC(10,2),
  budget_percentage NUMERIC(5,2),
  booking_count BIGINT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.id,
    cc.code,
    cc.name,
    cc.budget_limit,
    cc.budget_used,
    CASE 
      WHEN cc.budget_limit IS NOT NULL THEN cc.budget_limit - cc.budget_used
      ELSE NULL
    END,
    CASE 
      WHEN cc.budget_limit IS NOT NULL AND cc.budget_limit > 0 
      THEN ROUND((cc.budget_used / cc.budget_limit * 100), 2)
      ELSE NULL
    END,
    (SELECT COUNT(*) FROM bookings WHERE cost_center_id = cc.id),
    CASE 
      WHEN NOT cc.active THEN 'inactive'
      WHEN is_budget_limit_exceeded(cc.id) THEN 'exceeded'
      WHEN is_budget_warning_threshold_reached(cc.id) THEN 'warning'
      ELSE 'ok'
    END
  FROM public.cost_centers cc
  WHERE cc.company_id = p_company_id
  ORDER BY cc.active DESC, cc.code ASC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_cost_centers_overview IS 'Gibt Kostenstellen-Übersicht mit Budget-Status zurück';

-- ============================================================================
-- PART 7: VALIDATION QUERIES
-- ============================================================================

-- Check cost centers with budget status
-- SELECT * FROM get_cost_centers_overview('<your-company-id>'::UUID);

-- Check bookings by cost center
-- SELECT 
--   cc.code,
--   cc.name,
--   COUNT(b.id) as booking_count,
--   SUM(b.price) as total_amount,
--   cc.budget_limit,
--   cc.budget_used
-- FROM public.cost_centers cc
-- LEFT JOIN public.bookings b ON cc.id = b.cost_center_id
-- WHERE cc.company_id = '<your-company-id>'::UUID
-- GROUP BY cc.id, cc.code, cc.name, cc.budget_limit, cc.budget_used
-- ORDER BY total_amount DESC;
