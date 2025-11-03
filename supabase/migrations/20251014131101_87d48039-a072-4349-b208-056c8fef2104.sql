-- ==================================================================================
-- MyDispatch - Fehlende Tabellen erstellen
-- Version: 13.1 FINAL
-- ==================================================================================

-- DRIVERS
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  license_number TEXT,
  shift_status shift_status DEFAULT 'offline',
  archived BOOLEAN DEFAULT false,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view drivers of their company" ON public.drivers FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert drivers for their company" ON public.drivers FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update drivers of their company" ON public.drivers FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete drivers of their company" ON public.drivers FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- VEHICLES
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  license_plate TEXT NOT NULL,
  concession_number TEXT,
  vehicle_class vehicle_class NOT NULL,
  status vehicle_status DEFAULT 'available',
  assigned_driver_id UUID REFERENCES public.drivers(id),
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view vehicles of their company" ON public.vehicles FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert vehicles for their company" ON public.vehicles FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update vehicles of their company" ON public.vehicles FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete vehicles of their company" ON public.vehicles FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  has_portal_access BOOLEAN DEFAULT false,
  credit_limit NUMERIC(10,2) DEFAULT 0,
  outstanding_balance NUMERIC(10,2) DEFAULT 0,
  is_manually_created BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view customers of their company" ON public.customers FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert customers for their company" ON public.customers FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update customers of their company" ON public.customers FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete customers of their company" ON public.customers FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COST CENTERS
CREATE TABLE IF NOT EXISTS public.cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view cost_centers of their company" ON public.cost_centers FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert cost_centers for their company" ON public.cost_centers FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update cost_centers of their company" ON public.cost_centers FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete cost_centers of their company" ON public.cost_centers FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE TRIGGER update_cost_centers_updated_at BEFORE UPDATE ON public.cost_centers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  driver_id UUID REFERENCES public.drivers(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  cost_center_id UUID REFERENCES public.cost_centers(id),
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  pickup_time TIMESTAMPTZ NOT NULL,
  status booking_status DEFAULT 'pending',
  is_offer BOOLEAN DEFAULT false,
  offer_status offer_status,
  price NUMERIC(10,2),
  payment_method TEXT,
  payment_status payment_status DEFAULT 'pending',
  is_partner_booking BOOLEAN DEFAULT false,
  partner_id UUID,
  price_partner_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view bookings of their company" ON public.bookings FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert bookings for their company" ON public.bookings FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update bookings of their company" ON public.bookings FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete bookings of their company" ON public.bookings FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SHIFTS
CREATE TABLE IF NOT EXISTS public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  date DATE NOT NULL,
  shift_start_time TIME NOT NULL,
  shift_end_time TIME,
  pause_start_time TIME,
  pause_end_time TIME,
  km_start NUMERIC(10,2),
  km_end NUMERIC(10,2),
  total_km NUMERIC(10,2),
  cash_earnings NUMERIC(10,2) DEFAULT 0,
  card_earnings NUMERIC(10,2) DEFAULT 0,
  invoice_earnings NUMERIC(10,2) DEFAULT 0,
  approved_by_company BOOLEAN DEFAULT false,
  confirmed_by_driver BOOLEAN DEFAULT false,
  license_plate TEXT,
  concession_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view shifts of their company" ON public.shifts FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert shifts for their company" ON public.shifts FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update shifts of their company" ON public.shifts FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete shifts of their company" ON public.shifts FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON public.shifts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  entity_type document_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  document_type document_type NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  expiry_date DATE,
  reminder_sent BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view documents of their company" ON public.documents FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert documents for their company" ON public.documents FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update documents of their company" ON public.documents FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete documents of their company" ON public.documents FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PAYMENT REMINDERS
CREATE TABLE IF NOT EXISTS public.payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id),
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status payment_reminder_status DEFAULT 'pending',
  reminder_count INTEGER DEFAULT 0,
  last_reminder_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view payment_reminders of their company" ON public.payment_reminders FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert payment_reminders for their company" ON public.payment_reminders FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update payment_reminders of their company" ON public.payment_reminders FOR UPDATE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete payment_reminders of their company" ON public.payment_reminders FOR DELETE
  USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
CREATE TRIGGER update_payment_reminders_updated_at BEFORE UPDATE ON public.payment_reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();