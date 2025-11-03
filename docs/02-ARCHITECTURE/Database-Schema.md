# 🗄️ Database Schema

> **Datenbank-Design für MyDispatch**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 Database-Architektur

### Multi-Tenancy Pattern

**Jede Tabelle hat `company_id` für strikte Tenant-Isolation.**

```sql
-- Beispiel: bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  -- ... weitere Felder
);

-- RLS Policy für Tenant-Isolation
CREATE POLICY "Users see own company bookings"
ON bookings FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

---

## 📊 Kern-Tabellen

### 1. profiles (User-Profile)

**Zweck:** Custom User-Daten (ergänzt auth.users)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Index für Performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_company_id ON profiles(company_id);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (user_id = auth.uid());
```

### 2. companies (Firmen)

**Zweck:** Firmen-Stammdaten (Multi-Tenancy Root)

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'DE',
  phone TEXT,
  email TEXT,
  website TEXT,
  tax_id TEXT, -- Steuernummer (für Rechnungen)
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX idx_companies_name ON companies(name);

-- RLS Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own company"
ON companies FOR SELECT
USING (
  id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update own company"
ON companies FOR UPDATE
USING (
  id IN (
    SELECT company_id FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

### 3. bookings (Buchungen)

**Zweck:** Taxi-Buchungen

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  
  -- Adress-Daten
  pickup_address TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  dropoff_address TEXT NOT NULL,
  dropoff_lat DECIMAL(10, 8),
  dropoff_lng DECIMAL(11, 8),
  
  -- Zeit-Daten
  pickup_time TIMESTAMPTZ NOT NULL,
  dropoff_time TIMESTAMPTZ,
  
  -- Buchungs-Details
  passengers INTEGER NOT NULL DEFAULT 1 CHECK (passengers >= 1 AND passengers <= 8),
  luggage INTEGER NOT NULL DEFAULT 0 CHECK (luggage >= 0 AND luggage <= 8),
  special_requests TEXT,
  
  -- Preis-Daten
  estimated_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  currency TEXT DEFAULT 'EUR',
  
  -- Status
  status booking_status NOT NULL DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_passengers CHECK (passengers BETWEEN 1 AND 8),
  CONSTRAINT valid_luggage CHECK (luggage BETWEEN 0 AND 8),
  CONSTRAINT pickup_before_dropoff CHECK (pickup_time < dropoff_time)
);

-- Enums
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled'
);

-- Indexes
CREATE INDEX idx_bookings_company_id ON bookings(company_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_pickup_time ON bookings(pickup_time);
CREATE INDEX idx_bookings_status ON bookings(status);

-- RLS Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own company bookings"
ON bookings FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own company bookings"
ON bookings FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own company bookings"
ON bookings FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

### 4. customers (Kunden)

**Zweck:** Kunden-Stammdaten

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  
  -- Adresse (optional)
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'DE',
  
  -- DSGVO
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  gdpr_consent_date TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Index
CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);

-- RLS Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own company customers"
ON customers FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own company customers"
ON customers FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

### 5. vehicles (Fahrzeuge)

**Zweck:** Fahrzeug-Stammdaten

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  make TEXT NOT NULL, -- Hersteller (z.B. Mercedes)
  model TEXT NOT NULL, -- Modell (z.B. E-Klasse)
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  license_plate TEXT NOT NULL,
  
  -- Fahrzeug-Details
  color TEXT,
  seats INTEGER NOT NULL DEFAULT 4 CHECK (seats >= 1 AND seats <= 8),
  vehicle_type vehicle_type NOT NULL DEFAULT 'sedan',
  
  -- Status
  status vehicle_status NOT NULL DEFAULT 'available',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(company_id, license_plate)
);

-- Enums
CREATE TYPE vehicle_type AS ENUM ('sedan', 'suv', 'van', 'luxury');
CREATE TYPE vehicle_status AS ENUM ('available', 'in_use', 'maintenance', 'unavailable');

-- Index
CREATE INDEX idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- RLS Policies
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own company vehicles"
ON vehicles FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

### 6. drivers (Fahrer)

**Zweck:** Fahrer-Stammdaten

```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional: Fahrer-Login
  
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  
  -- Führerschein
  license_number TEXT NOT NULL,
  license_expiry DATE NOT NULL CHECK (license_expiry > CURRENT_DATE),
  
  -- Status
  status driver_status NOT NULL DEFAULT 'available',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(company_id, license_number)
);

-- Enum
CREATE TYPE driver_status AS ENUM ('available', 'on_duty', 'off_duty', 'inactive');

-- Index
CREATE INDEX idx_drivers_company_id ON drivers(company_id);
CREATE INDEX idx_drivers_status ON drivers(status);

-- RLS Policies
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own company drivers"
ON drivers FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

---

## 🔐 RLS Policy Templates

### SELECT Policy (Tenant-Isolation)

```sql
CREATE POLICY "policy_name_select"
ON table_name FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

### INSERT Policy

```sql
CREATE POLICY "policy_name_insert"
ON table_name FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

### UPDATE Policy

```sql
CREATE POLICY "policy_name_update"
ON table_name FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

### DELETE Policy (Admins only)

```sql
CREATE POLICY "policy_name_delete"
ON table_name FOR DELETE
USING (
  company_id IN (
    SELECT company_id FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

---

## 🔄 Database Functions

### 1. update_updated_at_column()

**Zweck:** Auto-update `updated_at` bei Änderungen

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger für bookings
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. validate_booking_input()

**Zweck:** Server-side Input Validation

```sql
CREATE OR REPLACE FUNCTION validate_booking_input()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.passengers < 1 OR NEW.passengers > 8 THEN
    RAISE EXCEPTION 'Passengers must be between 1 and 8';
  END IF;
  
  IF LENGTH(NEW.pickup_address) > 500 THEN
    RAISE EXCEPTION 'Address too long (DoS prevention)';
  END IF;
  
  IF NEW.pickup_time < now() THEN
    RAISE EXCEPTION 'Pickup time cannot be in the past';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER validate_booking
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION validate_booking_input();
```

---

## 📊 Indexes & Performance

### Critical Indexes

```sql
-- Foreign Keys (PFLICHT für Performance!)
CREATE INDEX idx_bookings_company_id ON bookings(company_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);

-- Frequent Queries
CREATE INDEX idx_bookings_pickup_time ON bookings(pickup_time);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Composite Index (für komplexe Queries)
CREATE INDEX idx_bookings_company_status ON bookings(company_id, status);
```

---

## 🗃️ Migrations

### Migration erstellen

```bash
# Neue Migration
supabase migration new add_bookings_table

# Migration lokal testen
supabase db reset

# Migration deployen
supabase db push
```

### Migration-Template

```sql
-- Migration: add_bookings_table
-- Created: 2025-01-26

-- 1. Create Table
CREATE TABLE bookings (
  -- ... Schema
);

-- 2. Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "..." ON bookings FOR SELECT USING (...);

-- 4. Create Indexes
CREATE INDEX idx_bookings_company_id ON bookings(company_id);

-- 5. Create Triggers
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🚨 Security Best Practices

### 1. IMMER RLS aktivieren

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### 2. Security Definer Functions

```sql
CREATE OR REPLACE FUNCTION function_name()
RETURNS ...
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog  -- KRITISCH!
AS $$
BEGIN
  -- Authorization Check
  IF NOT EXISTS (...) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Logic
END;
$$;
```

### 3. Input Validation (Triggers)

```sql
CREATE OR REPLACE FUNCTION validate_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Length checks (DoS prevention)
  IF LENGTH(NEW.field) > 500 THEN
    RAISE EXCEPTION 'Input too long';
  END IF;
  
  -- Type checks
  -- Range checks
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## ✅ Database Checklist

Vor jedem Deployment:

```
[ ] RLS auf allen Tabellen aktiviert
[ ] Policies für SELECT/INSERT/UPDATE/DELETE
[ ] Indexes auf Foreign Keys
[ ] Validation Triggers für Input
[ ] updated_at Trigger
[ ] Constraints (NOT NULL, CHECK, UNIQUE)
[ ] Security Definer Functions mit search_path
[ ] Supabase Linter ohne kritische Fehler
```

---

## 📚 Weitere Ressourcen

- [Security Guidelines](../04-GOVERNANCE/Security.md) - RLS, RBAC
- [Legal Compliance](../04-GOVERNANCE/Legal-Compliance.md) - DSGVO, PBefG
- [Supabase Docs](https://supabase.com/docs/guides/database) - Official Docs

---

## 📝 Changelog

### V18.5.0 (2025-01-26)
- Erstversion Database Schema
- Kern-Tabellen dokumentiert (profiles, companies, bookings, customers, vehicles, drivers)
- RLS Policy Templates
- Database Functions & Triggers
- Security Best Practices

---

**KRITISCH:** Diese Database-Guidelines sind SYSTEMWEIT und AUSNAHMSLOS zu befolgen.
