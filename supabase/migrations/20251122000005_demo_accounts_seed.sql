-- ========================================
-- Task 3: Demo-Accounts Seed Data
-- ========================================
-- Creates two demo accounts with realistic test data
-- 1. demo.starter@my-dispatch.de (Starter Tarif: 3 Fahrer max, 3 Fahrzeuge max)
-- 2. demo.business@my-dispatch.de (Business Tarif: unlimited)

-- ============================================================================
-- DEMO COMPANIES
-- ============================================================================

-- Starter Demo Company
INSERT INTO public.companies (
  id,
  name,
  email,
  phone,
  address_street,
  address_postal_code,
  address_city,
  tax_id,
  billing_status,
  feature_limits,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'Demo Taxi Starter GmbH',
  'demo.starter@my-dispatch.de',
  '+49 89 12345001',
  'Demostraße 1',
  '80331',
  'München',
  'DE123456789',
  'active',
  '{
    "max_drivers": 3,
    "max_vehicles": 3,
    "max_bookings_per_month": 100,
    "has_customer_portal": false,
    "has_statistics": true,
    "has_financial_module": false
  }'::JSONB,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  feature_limits = EXCLUDED.feature_limits,
  billing_status = EXCLUDED.billing_status;

-- Business Demo Company
INSERT INTO public.companies (
  id,
  name,
  email,
  phone,
  address_street,
  address_postal_code,
  address_city,
  tax_id,
  billing_status,
  feature_limits,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000002'::UUID,
  'Demo Limousinen Service Business GmbH',
  'demo.business@my-dispatch.de',
  '+49 89 12345002',
  'Business Allee 10',
  '80333',
  'München',
  'DE987654321',
  'active',
  '{
    "max_drivers": null,
    "max_vehicles": null,
    "max_bookings_per_month": null,
    "has_customer_portal": true,
    "has_statistics": true,
    "has_financial_module": true
  }'::JSONB,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  feature_limits = EXCLUDED.feature_limits,
  billing_status = EXCLUDED.billing_status;

-- ============================================================================
-- DEMO DRIVERS (Starter: 5 total, Business: 10 total)
-- ============================================================================

-- Starter Drivers (5 Fahrer - 2 active, 3 für Limit-Test)
INSERT INTO public.drivers (company_id, first_name, last_name, email, phone, license_number, shift_status, address_street, address_postal_code, address_city, p_schein_number, p_schein_expiry_date) VALUES
('00000000-0000-0000-0000-000000000001'::UUID, 'Max', 'Mustermann', 'max@demo-starter.de', '+49 170 1111111', 'B1234567', 'available', 'Musterweg 1', '80331', 'München', 'P-111111', '2026-12-31'),
('00000000-0000-0000-0000-000000000001'::UUID, 'Anna', 'Schmidt', 'anna@demo-starter.de', '+49 170 2222222', 'B2345678', 'offline', 'Beispielstr. 2', '80333', 'München', 'P-222222', '2026-06-30'),
('00000000-0000-0000-0000-000000000001'::UUID, 'Thomas', 'Müller', 'thomas@demo-starter.de', '+49 170 3333333', 'B3456789', 'offline', 'Testweg 3', '80335', 'München', 'P-333333', '2025-12-31'),
('00000000-0000-0000-0000-000000000001'::UUID, 'Julia', 'Weber', 'julia@demo-starter.de', '+49 170 4444444', 'B4567890', 'offline', 'Demostr. 4', '80337', 'München', 'P-444444', '2026-03-31'),
('00000000-0000-0000-0000-000000000001'::UUID, 'Michael', 'Fischer', 'michael@demo-starter.de', '+49 170 5555555', 'B5678901', 'offline', 'Beispielweg 5', '80339', 'München', 'P-555555', '2026-09-30')
ON CONFLICT DO NOTHING;

-- Business Drivers (10 Fahrer - 5 active)
INSERT INTO public.drivers (company_id, first_name, last_name, email, phone, license_number, shift_status, address_street, address_postal_code, address_city, p_schein_number, p_schein_expiry_date) VALUES
('00000000-0000-0000-0000-000000000002'::UUID, 'Robert', 'Meyer', 'robert@demo-business.de', '+49 170 6666666', 'B6789012', 'available', 'Business Str. 10', '80333', 'München', 'P-666666', '2027-12-31'),
('00000000-0000-0000-0000-000000000002'::UUID, 'Sarah', 'Becker', 'sarah@demo-business.de', '+49 170 7777777', 'B7890123', 'on_duty', 'Premium Allee 20', '80333', 'München', 'P-777777', '2027-06-30'),
('00000000-0000-0000-0000-000000000002'::UUID, 'Stefan', 'Hoffmann', 'stefan@demo-business.de', '+49 170 8888888', 'B8901234', 'available', 'First Class Weg 30', '80335', 'München', 'P-888888', '2026-12-31'),
('00000000-0000-0000-0000-000000000002'::UUID, 'Laura', 'Schulz', 'laura@demo-business.de', '+49 170 9999999', 'B9012345', 'on_duty', 'Luxus Str. 40', '80337', 'München', 'P-999999', '2027-03-31'),
('00000000-0000-0000-0000-000000000002'::UUID, 'David', 'Zimmermann', 'david@demo-business.de', '+49 171 1111111', 'B0123456', 'available', 'VIP Allee 50', '80339', 'München', 'P-101010', '2027-09-30'),
('00000000-0000-0000-0000-000000000002'::UUID, 'Lisa', 'Koch', 'lisa@demo-business.de', '+49 171 2222222', 'B1234568', 'offline', 'Elite Str. 60', '80331', 'München', 'P-111111', '2026-12-31'),
('00000000-0000-0000-0000-000000000002'::UUID, 'Daniel', 'Richter', 'daniel@demo-business.de', '+49 171 3333333', 'B2345679', 'offline', 'Premium Weg 70', '80333', 'München', 'P-121212', '2027-06-30'),
('00000000-0000-0000-0000-000000000002'::UUID, 'Nina', 'Wolf', 'nina@demo-business.de', '+49 171 4444444', 'B3456780', 'offline', 'Business Str. 80', '80335', 'München', 'P-131313', '2026-12-31'),
('00000000-0000-0000-0000-000000000002'::UUID, 'Patrick', 'Schröder', 'patrick@demo-business.de', '+49 171 5555555', 'B4567891', 'offline', 'Luxus Allee 90', '80337', 'München', 'P-141414', '2027-03-31'),
('00000000-0000-0000-0000-000000000002'::UUID, 'Sandra', 'Neumann', 'sandra@demo-business.de', '+49 171 6666666', 'B5678902', 'offline', 'First Class Str. 100', '80339', 'München', 'P-151515', '2027-09-30')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO VEHICLES (Starter: 3, Business: 8)
-- ============================================================================

-- Starter Vehicles (3 - at limit)
INSERT INTO public.vehicles (company_id, license_plate, vehicle_class, status, manufacturer, model, build_year, vin, power_kw, power_ps, color) VALUES
('00000000-0000-0000-0000-000000000001'::UUID, 'M-ST 1001', 'Economy Class (1-4 Pax)', 'available', 'Volkswagen', 'Passat', 2020, 'WVW123456789DEMO1', 110, 150, 'Silber'),
('00000000-0000-0000-0000-000000000001'::UUID, 'M-ST 1002', 'Business Class - Limousine (1-4 Pax)', 'im_einsatz', 'Mercedes-Benz', 'E-Klasse', 2021, 'WDD123456789DEMO2', 145, 197, 'Schwarz'),
('00000000-0000-0000-0000-000000000001'::UUID, 'M-ST 1003', 'Economy Class (1-4 Pax)', 'available', 'Skoda', 'Octavia', 2019, 'TMB123456789DEMO3', 85, 116, 'Weiß')
ON CONFLICT DO NOTHING;

-- Business Vehicles (8 - diverse fleet)
INSERT INTO public.vehicles (company_id, license_plate, vehicle_class, status, manufacturer, model, build_year, vin, power_kw, power_ps, color) VALUES
('00000000-0000-0000-0000-000000000002'::UUID, 'M-BS 2001', 'First Class (1-3 Pax)', 'available', 'Mercedes-Benz', 'S-Klasse', 2023, 'WDD223456789DEMO1', 270, 367, 'Obsidianschwarz Metallic'),
('00000000-0000-0000-0000-000000000002'::UUID, 'M-BS 2002', 'Business Class - Limousine (1-4 Pax)', 'im_einsatz', 'BMW', '7er', 2022, 'WBA323456789DEMO2', 210, 286, 'Saphirschwarz Metallic'),
('00000000-0000-0000-0000-000000000002'::UUID, 'M-BS 2003', 'Van / SUV (1-8 Pax)', 'available', 'Mercedes-Benz', 'V-Klasse', 2023, 'WDF423456789DEMO3', 140, 190, 'Kavansitblau Metallic'),
('00000000-0000-0000-0000-000000000002'::UUID, 'M-BS 2004', 'Business Class - Kombi (1-4 Pax)', 'available', 'Audi', 'A6 Avant', 2022, 'WAU523456789DEMO4', 150, 204, 'Mythosschwarz Metallic'),
('00000000-0000-0000-0000-000000000002'::UUID, 'M-BS 2005', 'First Class (1-3 Pax)', 'wartung', 'Audi', 'A8', 2023, 'WAU623456789DEMO5', 250, 340, 'Firmamentblau Metallic'),
('00000000-0000-0000-0000-000000000002'::UUID, 'M-BS 2006', 'Van / SUV (1-8 Pax)', 'available', 'Mercedes-Benz', 'Vito', 2021, 'WDF723456789DEMO6', 120, 163, 'Brillantsilber Metallic'),
('00000000-0000-0000-0000-000000000002'::UUID, 'M-BS 2007', 'Business Class - Limousine (1-4 Pax)', 'available', 'BMW', '5er', 2022, 'WBA823456789DEMO7', 180, 245, 'Mineralgrau Metallic'),
('00000000-0000-0000-0000-000000000002'::UUID, 'M-BS 2008', 'Business Class - Kombi (1-4 Pax)', 'available', 'Mercedes-Benz', 'E-Klasse T-Modell', 2023, 'WDD923456789DEMO8', 155, 211, 'Selenitgrau Metallic')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO CUSTOMERS (Starter: 10, Business: 30)
-- ============================================================================

-- Starter Customers (10 - mix of private/business)
INSERT INTO public.customers (company_id, first_name, last_name, email, phone, has_portal_access, credit_limit) VALUES
('00000000-0000-0000-0000-000000000001'::UUID, 'Hans', 'Meier', 'hans.meier@example.com', '+49 89 11111111', false, 0),
('00000000-0000-0000-0000-000000000001'::UUID, 'Maria', 'Schmidt', 'maria.schmidt@example.com', '+49 89 22222222', false, 0),
('00000000-0000-0000-0000-000000000001'::UUID, 'Klaus', 'Wagner', 'klaus.wagner@example.com', '+49 89 33333333', false, 500),
('00000000-0000-0000-0000-000000000001'::UUID, 'Petra', 'Becker', 'petra.becker@example.com', '+49 89 44444444', false, 0),
('00000000-0000-0000-0000-000000000001'::UUID, 'Jürgen', 'Hoffmann', 'juergen.hoffmann@example.com', '+49 89 55555555', false, 0),
('00000000-0000-0000-0000-000000000001'::UUID, 'Sabine', 'Koch', 'sabine.koch@example.com', '+49 89 66666666', false, 1000),
('00000000-0000-0000-0000-000000000001'::UUID, 'Wolfgang', 'Richter', 'wolfgang.richter@example.com', '+49 89 77777777', false, 0),
('00000000-0000-0000-0000-000000000001'::UUID, 'Monika', 'Wolf', 'monika.wolf@example.com', '+49 89 88888888', false, 0),
('00000000-0000-0000-0000-000000000001'::UUID, 'Bernd', 'Schröder', 'bernd.schroeder@example.com', '+49 89 99999999', false, 0),
('00000000-0000-0000-0000-000000000001'::UUID, 'Ute', 'Neumann', 'ute.neumann@example.com', '+49 89 10101010', false, 0)
ON CONFLICT DO NOTHING;

-- Business Customers (30 - more business customers with portal access)
INSERT INTO public.customers (company_id, first_name, last_name, email, phone, has_portal_access, credit_limit) VALUES
('00000000-0000-0000-0000-000000000002'::UUID, 'Dr. Alexander', 'Hartmann', 'a.hartmann@business-demo.com', '+49 89 20111111', true, 5000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Prof. Claudia', 'Fischer', 'c.fischer@business-demo.com', '+49 89 20222222', true, 8000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Marcus', 'Bergmann', 'm.bergmann@business-demo.com', '+49 89 20333333', true, 3000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Stephanie', 'Zimmermann', 's.zimmermann@business-demo.com', '+49 89 20444444', true, 4000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Oliver', 'Krüger', 'o.krueger@business-demo.com', '+49 89 20555555', true, 6000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Andrea', 'Lange', 'a.lange@business-demo.com', '+49 89 20666666', false, 2000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Matthias', 'Werner', 'm.werner@business-demo.com', '+49 89 20777777', true, 7000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Christine', 'Vogel', 'c.vogel@business-demo.com', '+49 89 20888888', false, 1500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Sebastian', 'Schwarz', 's.schwarz@business-demo.com', '+49 89 20999999', true, 5500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Katrin', 'Krämer', 'k.kraemer@business-demo.com', '+49 89 21010101', false, 2500)
ON CONFLICT DO NOTHING;

-- Additional 20 Business Customers (abbreviated for brevity)
INSERT INTO public.customers (company_id, first_name, last_name, email, phone, has_portal_access, credit_limit) VALUES
('00000000-0000-0000-0000-000000000002'::UUID, 'Frank', 'Baumann', 'f.baumann@business-demo.com', '+49 89 21111111', false, 1000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Silke', 'Sommer', 's.sommer@business-demo.com', '+49 89 21222222', true, 4500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Ralf', 'Winter', 'r.winter@business-demo.com', '+49 89 21333333', false, 2000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Martina', 'Groß', 'm.gross@business-demo.com', '+49 89 21444444', true, 3500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Peter', 'Herrmann', 'p.herrmann@business-demo.com', '+49 89 21555555', false, 1500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Birgit', 'Kaiser', 'b.kaiser@business-demo.com', '+49 89 21666666', true, 5000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Carsten', 'Möller', 'c.moeller@business-demo.com', '+49 89 21777777', false, 2500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Nicole', 'Lehmann', 'n.lehmann@business-demo.com', '+49 89 21888888', true, 6500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Torsten', 'Fuchs', 't.fuchs@business-demo.com', '+49 89 21999999', false, 1000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Heike', 'Huber', 'h.huber@business-demo.com', '+49 89 22010101', true, 4000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Jörg', 'Graf', 'j.graf@business-demo.com', '+49 89 22111111', false, 1500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Kerstin', 'Dietrich', 'k.dietrich@business-demo.com', '+49 89 22222222', true, 3000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Uwe', 'Frank', 'u.frank@business-demo.com', '+49 89 22333333', false, 2000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Angelika', 'Brandt', 'a.brandt@business-demo.com', '+49 89 22444444', true, 5500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Dirk', 'Schulze', 'd.schulze@business-demo.com', '+49 89 22555555', false, 1000),
('00000000-0000-0000-0000-000000000002'::UUID, 'Gisela', 'Roth', 'g.roth@business-demo.com', '+49 89 22666666', true, 4500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Holger', 'Peters', 'h.peters@business-demo.com', '+49 89 22777777', false, 2500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Ingrid', 'Lang', 'i.lang@business-demo.com', '+49 89 22888888', true, 3500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Jan', 'Scholz', 'j.scholz@business-demo.com', '+49 89 22999999', false, 1500),
('00000000-0000-0000-0000-000000000002'::UUID, 'Karin', 'Vogt', 'k.vogt@business-demo.com', '+49 89 23010101', true, 6000)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTE: BOOKINGS omitted for brevity - will be added via separate script
-- Reason: Bookings require complex data (pickup/dropoff addresses, prices, statuses)
-- and would make this migration too large (200+ lines vs 500+ with bookings)
-- ============================================================================

COMMENT ON TABLE public.companies IS 'Demo accounts seeded: demo.starter@my-dispatch.de (Starter), demo.business@my-dispatch.de (Business)';
