# 💾 DATABASE SCHEMA COMPLETE V28.2.0

**Status:** ✅ PRODUCTION  
**Letzte Aktualisierung:** 2025-10-29  
**Version:** 28.2.0  
**Database:** PostgreSQL 15 (Supabase)  
**Total Tables:** 56

---

## 📋 TABLE OF CONTENTS

1. [Core Tables](#core-tables) (8)
2. [Booking & Operations](#booking--operations) (12)
3. [Finance & Accounting](#finance--accounting) (8)
4. [Communication & Documents](#communication--documents) (6)
5. [Administration & Settings](#administration--settings) (10)
6. [Integrations & External](#integrations--external) (5)
7. [Realtime Tables](#realtime-tables) (4)
8. [Database Functions](#database-functions) (20+)
9. [Triggers](#triggers) (15+)
10. [RLS Policies](#rls-policies)

---

## 🏢 CORE TABLES (8)

### 1. companies
**Zweck:** Zentrale Company-Verwaltung (Multi-Tenant Isolation)

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'DE',
  tax_id TEXT,
  company_number TEXT,
  logo_url TEXT,
  headquarter_lat DOUBLE PRECISION,
  headquarter_lng DOUBLE PRECISION,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'starter', 'professional', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trialing')),
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_companies_subscription ON companies(subscription_plan, subscription_status);
```

**RLS Policy:**
```sql
-- Users can only view own company
CREATE POLICY "Users view own company"
ON companies FOR SELECT
USING (id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- Admins can update own company
CREATE POLICY "Admins update own company"
ON companies FOR UPDATE
USING (
  id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()) AND
  (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
);
```

---

### 2. profiles
**Zweck:** User Profiles (extends auth.users)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'dispatcher', 'user')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'de',
  timezone TEXT DEFAULT 'Europe/Berlin',
  notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_company_id ON profiles(company_id);
CREATE INDEX idx_profiles_role ON profiles(role);
```

**RLS Policy:**
```sql
-- Users can view profiles in own company
CREATE POLICY "Users view own company profiles"
ON profiles FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- Users can update own profile
CREATE POLICY "Users update own profile"
ON profiles FOR UPDATE
USING (user_id = auth.uid());
```

**Trigger:**
```sql
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, company_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'company_id',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 3. customers
**Zweck:** Kunden-Verwaltung

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_type TEXT DEFAULT 'private' CHECK (customer_type IN ('private', 'business')),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'DE',
  tax_id TEXT,
  payment_terms TEXT DEFAULT 'immediate',
  credit_limit DECIMAL(10,2),
  notes TEXT,
  portal_access BOOLEAN DEFAULT false,
  portal_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_portal_user_id ON customers(portal_user_id);
```

**RLS Policy:**
```sql
-- Company-Isolation
CREATE POLICY "Users manage own company customers"
ON customers FOR ALL
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

---

### 4. drivers
**Zweck:** Fahrer-Verwaltung

```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_expires_at DATE NOT NULL,
  license_type TEXT[] DEFAULT ARRAY['B'],
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline', 'break')),
  current_location POINT,
  hourly_rate DECIMAL(10,2),
  emergency_contact TEXT,
  emergency_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_drivers_company_id ON drivers(company_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
```

**RLS Policy:**
```sql
CREATE POLICY "Users manage own company drivers"
ON drivers FOR ALL
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

**Realtime Enabled:** ✅ YES

---

### 5. vehicles
**Zweck:** Fahrzeug-Verwaltung

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  vehicle_type TEXT DEFAULT 'sedan' CHECK (vehicle_type IN ('sedan', 'suv', 'van', 'minibus', 'bus', 'limousine')),
  license_plate TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  seats INTEGER NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'offline')),
  current_driver_id UUID REFERENCES drivers(id),
  mileage INTEGER DEFAULT 0,
  fuel_type TEXT CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  insurance_number TEXT,
  insurance_expires_at DATE,
  inspection_expires_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
```

**RLS Policy:**
```sql
CREATE POLICY "Users manage own company vehicles"
ON vehicles FOR ALL
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

**Realtime Enabled:** ✅ YES

---

## 📦 BOOKING & OPERATIONS (12)

### 6. bookings
**Zweck:** Haupttabelle für Aufträge/Buchungen

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  pickup_address TEXT NOT NULL,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  dropoff_address TEXT NOT NULL,
  dropoff_lat DOUBLE PRECISION,
  dropoff_lng DOUBLE PRECISION,
  pickup_time TIMESTAMPTZ NOT NULL,
  dropoff_time TIMESTAMPTZ,
  distance_km DECIMAL(10,2),
  duration_minutes INTEGER,
  price DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'invoice', 'account')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partially_paid', 'refunded')),
  invoice_id UUID,
  notes TEXT,
  internal_notes TEXT,
  special_requests TEXT,
  passengers INTEGER DEFAULT 1,
  luggage INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bookings_company_id ON bookings(company_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_pickup_time ON bookings(pickup_time);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Partitioning by month for performance
CREATE TABLE bookings_2025_01 PARTITION OF bookings
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
-- ... weitere Partitionen
```

**RLS Policy:**
```sql
CREATE POLICY "Users manage own company bookings"
ON bookings FOR ALL
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

**Realtime Enabled:** ✅ YES

---

## 💰 FINANCE & ACCOUNTING (8)

### 14. invoices
**Zweck:** Rechnungen

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 19.00,
  tax_amount DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  payment_date DATE,
  payment_method TEXT,
  notes TEXT,
  pdf_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
```

**RLS Policy:**
```sql
CREATE POLICY "Users manage own company invoices"
ON invoices FOR ALL
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

---

## 📱 COMMUNICATION & DOCUMENTS (6)

### 22. chat_messages
**Zweck:** Team-Chat

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  read_by UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
```

**RLS Policy:**
```sql
-- Users can only view messages in conversations they're part of
CREATE POLICY "Users view own conversations"
ON chat_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
  )
);
```

**Realtime Enabled:** ✅ YES

---

## ⚙️ DATABASE FUNCTIONS (20+)

### get_dashboard_stats_for_company
**Zweck:** KPI Statistiken für Dashboard

```sql
CREATE OR REPLACE FUNCTION get_dashboard_stats_for_company(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  todays_bookings BIGINT,
  todays_revenue DECIMAL,
  available_drivers BIGINT,
  available_vehicles BIGINT,
  pending_bookings BIGINT,
  active_bookings BIGINT
) AS $$
DECLARE
  user_company_id UUID;
BEGIN
  SELECT company_id INTO user_company_id 
  FROM profiles 
  WHERE user_id = auth.uid();

  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE b.created_at::date = target_date) as todays_bookings,
    COALESCE(SUM(b.price) FILTER (WHERE b.created_at::date = target_date), 0) as todays_revenue,
    COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'available') as available_drivers,
    COUNT(DISTINCT v.id) FILTER (WHERE v.status = 'available') as available_vehicles,
    COUNT(*) FILTER (WHERE b.status = 'pending') as pending_bookings,
    COUNT(*) FILTER (WHERE b.status IN ('confirmed', 'in_progress')) as active_bookings
  FROM bookings b
  LEFT JOIN drivers d ON d.company_id = user_company_id
  LEFT JOIN vehicles v ON v.company_id = user_company_id
  WHERE b.company_id = user_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage:**
```typescript
const { data } = await supabase.rpc('get_dashboard_stats_for_company');
```

---

## 🔄 TRIGGERS (15+)

### update_updated_at_column
**Zweck:** Automatisches Updated_at Timestamp Update

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (apply to all 56 tables)
```

---

## 🔐 RLS POLICIES

**Universal Policy Pattern:**

```sql
-- All tables follow this pattern for multi-tenant isolation:

-- SELECT
CREATE POLICY "users_select_own_company_[table]"
ON [table] FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- INSERT
CREATE POLICY "users_insert_own_company_[table]"
ON [table] FOR INSERT
WITH CHECK (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- UPDATE
CREATE POLICY "users_update_own_company_[table]"
ON [table] FOR UPDATE
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- DELETE (meist nur für Admins)
CREATE POLICY "admins_delete_own_company_[table]"
ON [table] FOR DELETE
USING (
  company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()) AND
  (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
);
```

**Enforcement:** ✅ RLS enabled auf ALLEN 56 Tables

---

## ⚡ REALTIME TABLES (4)

**Enabled Tables:**
1. **bookings** - Dashboard, Aufträge, Map
2. **drivers** - Dashboard, Fahrer, Map
3. **vehicles** - Dashboard, Fahrzeuge, Map
4. **chat_messages** - Team-Chat

**Enable Command:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
```

---

## 📊 MATERIALIZED VIEWS (3)

### dashboard_stats_view
**Zweck:** Pre-aggregated Dashboard Stats

```sql
CREATE MATERIALIZED VIEW dashboard_stats_view AS
SELECT 
  company_id,
  COUNT(*) as total_bookings,
  SUM(price) as total_revenue,
  COUNT(DISTINCT customer_id) as unique_customers,
  AVG(price) as avg_booking_price
FROM bookings
WHERE status = 'completed'
GROUP BY company_id;

CREATE UNIQUE INDEX idx_dashboard_stats_company ON dashboard_stats_view(company_id);

-- Refresh every hour
SELECT cron.schedule(
  'refresh_dashboard_stats',
  '0 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats_view;'
);
```

---

## 🔍 INDEXES (Performance Critical)

**All Foreign Keys have indexes:**
```sql
-- Examples
CREATE INDEX idx_bookings_company_id ON bookings(company_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
```

**Composite Indexes:**
```sql
-- Fast status + date queries
CREATE INDEX idx_bookings_company_status_date 
ON bookings(company_id, status, pickup_time DESC);

-- Fast driver availability queries
CREATE INDEX idx_drivers_company_status 
ON drivers(company_id, status) WHERE status = 'available';
```

---

**Version:** 28.2.0  
**Status:** ✅ PRODUCTION  
**Schema Migrations:** 47 applied  
**Next Review:** Bei Schema-Änderungen
