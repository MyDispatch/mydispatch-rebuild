-- ==================================================================================
-- TARIFF SYSTEM V2 - SINGLE SOURCE OF TRUTH
-- ==================================================================================
-- Created: 2025-01-30 14:45:00 UTC
-- Version: 2.0.0
-- Purpose: Zentrale Tarif-Datenbank als Single Source of Truth

-- Table: tariff_system_v2
CREATE TABLE IF NOT EXISTS tariff_system_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tariff_id text UNIQUE NOT NULL,
  
  -- Pricing
  price_monthly numeric NOT NULL,
  price_yearly numeric NOT NULL,
  currency text DEFAULT '€',
  discount_yearly_percent numeric DEFAULT 20,
  
  -- Limits
  limit_drivers integer NOT NULL,
  limit_vehicles integer NOT NULL,
  limit_users integer NOT NULL,
  limit_bookings_monthly integer,
  
  -- Features (JSONB Array)
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  -- Stripe Integration
  stripe_product_ids text[] NOT NULL,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  
  -- Marketing Texts
  marketing_title text NOT NULL,
  marketing_subtitle text,
  marketing_description text,
  marketing_cta_text text DEFAULT 'Jetzt starten',
  
  -- Meta
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: add_ons
CREATE TABLE IF NOT EXISTS add_ons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  add_on_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price_monthly numeric NOT NULL,
  price_yearly numeric,
  applicable_to_tariffs text[] NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  stripe_product_id text,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE tariff_system_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;

-- Public read access (alle können Tarife lesen)
CREATE POLICY "Public read access on tariff_system_v2" 
ON tariff_system_v2 FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public read access on add_ons" 
ON add_ons FOR SELECT 
USING (is_active = true);

-- Master accounts can manage (nur Master-Accounts können editieren)
CREATE POLICY "Service role can manage tariff_system_v2" 
ON tariff_system_v2 FOR ALL 
USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage add_ons" 
ON add_ons FOR ALL 
USING (auth.jwt()->>'role' = 'service_role');

-- Initial Data: Starter Tarif
INSERT INTO tariff_system_v2 (
  tariff_id,
  price_monthly,
  price_yearly,
  currency,
  discount_yearly_percent,
  limit_drivers,
  limit_vehicles,
  limit_users,
  limit_bookings_monthly,
  features,
  stripe_product_ids,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  marketing_title,
  marketing_subtitle,
  marketing_description,
  marketing_cta_text,
  is_active,
  display_order
) VALUES (
  'starter',
  39,
  374.40,
  '€',
  20,
  5,
  10,
  5,
  NULL,
  '[
    "GPS-Echtzeit-Tracking",
    "Auftragsverwaltung",
    "Kundenverwaltung",
    "Fahrzeugverwaltung",
    "Basis-Reporting",
    "Mobile App",
    "E-Mail Support"
  ]'::jsonb,
  ARRAY['prod_TEeg0ykplmGKd0', 'prod_TF5cFE5Fi5rBCz'],
  'price_1QdUFJF0naDR2yqh7JKLgHZs',
  'price_1QdUFlF0naDR2yqhCqL7H3TM',
  'Starter',
  'Perfekt für kleine Unternehmen',
  'Idealer Einstieg für Einzelunternehmer und kleine Flotten bis 10 Fahrzeuge.',
  'Jetzt starten',
  true,
  1
) ON CONFLICT (tariff_id) DO NOTHING;

-- Initial Data: Business Tarif
INSERT INTO tariff_system_v2 (
  tariff_id,
  price_monthly,
  price_yearly,
  currency,
  discount_yearly_percent,
  limit_drivers,
  limit_vehicles,
  limit_users,
  limit_bookings_monthly,
  features,
  stripe_product_ids,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  marketing_title,
  marketing_subtitle,
  marketing_description,
  marketing_cta_text,
  is_active,
  display_order
) VALUES (
  'business',
  99,
  950.40,
  '€',
  20,
  -1,
  -1,
  -1,
  NULL,
  '[
    "Alle Starter-Features",
    "Unbegrenzte Fahrzeuge & Fahrer",
    "Partner-Management",
    "Erweiterte Analysen & Reports",
    "API-Zugang",
    "Schichtplanung",
    "Team-Chat",
    "Premium-Support (Telefon & E-Mail)",
    "Individuelle Schulung"
  ]'::jsonb,
  ARRAY['prod_TEegHmtpPZOZcG', 'prod_TF5cnWFZYEQUsG'],
  'price_1QdUF3F0naDR2yqh7dg17sL1',
  'price_1QdUFPF0naDR2yqhLdHGfqfG',
  'Business',
  'Für wachsende Unternehmen',
  'Professionelle Lösung mit unbegrenzten Ressourcen und Premium-Support.',
  'Jetzt starten',
  true,
  2
) ON CONFLICT (tariff_id) DO NOTHING;

-- Initial Data: Fleet & Driver Add-On
INSERT INTO add_ons (
  add_on_id,
  name,
  description,
  price_monthly,
  price_yearly,
  applicable_to_tariffs,
  features,
  stripe_product_id,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  is_active,
  display_order
) VALUES (
  'fleet_driver_addon',
  'Fleet & Driver Add-On',
  'Erweitern Sie Ihre Flotte flexibel: Pauschale 9 € pro Monat für unbegrenzte Fahrzeuge und Fahrer über die Starter-Limits hinaus.',
  9,
  86.40,
  ARRAY['starter'],
  '[
    "Unbegrenzte Fahrzeuge",
    "Unbegrenzte Fahrer",
    "Keine versteckten Kosten",
    "Sofort aktivierbar",
    "Monatlich kündbar"
  ]'::jsonb,
  'prod_addon_fleet_driver',
  'price_addon_fleet_driver_monthly',
  'price_addon_fleet_driver_yearly',
  true,
  1
) ON CONFLICT (add_on_id) DO NOTHING;

-- Trigger: Auto-Update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tariff_system_v2_updated_at
BEFORE UPDATE ON tariff_system_v2
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_add_ons_updated_at
BEFORE UPDATE ON add_ons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();