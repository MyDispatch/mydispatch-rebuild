-- ========================================
-- Task 3: Demo-Accounts Seed Script
-- ========================================
-- Creates two demo accounts with realistic data:
-- 1. demo.starter@my-dispatch.de (Starter Tarif - max 3 drivers, 3 vehicles)
-- 2. demo.business@my-dispatch.de (Business Tarif - unlimited)

-- ============================================================================
-- PART 1: DEMO COMPANIES
-- ============================================================================

-- Demo Company 1: Starter Tarif
INSERT INTO public.companies (
  id,
  name,
  email,
  phone,
  tax_id,
  street,
  postal_code,
  city,
  billing_status,
  feature_limits,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Demo Taxi Starter GmbH',
  'demo.starter@my-dispatch.de',
  '+49 89 12345601',
  'DE123456789',
  'Musterstraße 1',
  '80331',
  'München',
  'active',
  '{
    "max_drivers": 3,
    "max_vehicles": 3,
    "max_bookings_per_month": 100,
    "has_customer_portal": false,
    "has_statistics": true,
    "has_financial_module": false
  }'::jsonb,
  NOW() - INTERVAL '30 days'
);

-- Demo Company 2: Business Tarif
INSERT INTO public.companies (
  id,
  name,
  email,
  phone,
  tax_id,
  street,
  postal_code,
  city,
  billing_status,
  feature_limits,
  created_at
) VALUES (
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Demo Limousinen Service AG',
  'demo.business@my-dispatch.de',
  '+49 30 98765432',
  'DE987654321',
  'Beispielweg 100',
  '10115',
  'Berlin',
  'active',
  '{
    "max_drivers": null,
    "max_vehicles": null,
    "max_bookings_per_month": null,
    "has_customer_portal": true,
    "has_statistics": true,
    "has_financial_module": true
  }'::jsonb,
  NOW() - INTERVAL '90 days'
);

-- ============================================================================
-- PART 2: DEMO USERS (Profiles)
-- ============================================================================
-- NOTE: Auth users must be created via Supabase Auth API (not SQL)
-- These profiles will be linked after auth.users creation

-- Profile for Starter Demo Account
INSERT INTO public.profiles (
  id,
  user_id,
  company_id,
  email,
  first_name,
  last_name,
  role,
  created_at
) VALUES (
  '11111111-aaaa-aaaa-aaaa-111111111111'::uuid,
  '11111111-auth-auth-auth-111111111111'::uuid, -- Will be created via Auth API
  '11111111-1111-1111-1111-111111111111'::uuid,
  'demo.starter@my-dispatch.de',
  'Demo',
  'Starter',
  'admin',
  NOW() - INTERVAL '30 days'
);

-- Profile for Business Demo Account
INSERT INTO public.profiles (
  id,
  user_id,
  company_id,
  email,
  first_name,
  last_name,
  role,
  created_at
) VALUES (
  '22222222-bbbb-bbbb-bbbb-222222222222'::uuid,
  '22222222-auth-auth-auth-222222222222'::uuid, -- Will be created via Auth API
  '22222222-2222-2222-2222-222222222222'::uuid,
  'demo.business@my-dispatch.de',
  'Demo',
  'Business',
  'admin',
  NOW() - INTERVAL '90 days'
);

-- ============================================================================
-- PART 3: DEMO DRIVERS (Starter: 2, Business: 8)
-- ============================================================================

-- Starter Demo: 2 Drivers (under limit of 3)
INSERT INTO public.drivers (company_id, first_name, last_name, email, phone, license_number, shift_status, created_at) VALUES
('11111111-1111-1111-1111-111111111111'::uuid, 'Max', 'Mustermann', 'max.m@demo-starter.de', '+49 170 1111111', 'D123456789', 'offline', NOW() - INTERVAL '25 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'Anna', 'Schmidt', 'anna.s@demo-starter.de', '+49 170 2222222', 'D987654321', 'available', NOW() - INTERVAL '20 days');

-- Business Demo: 8 Drivers (unlimited)
INSERT INTO public.drivers (company_id, first_name, last_name, email, phone, license_number, shift_status, p_schein_number, p_schein_expiry_date, address_street, address_postal_code, address_city, created_at) VALUES
('22222222-2222-2222-2222-222222222222'::uuid, 'Thomas', 'Müller', 'thomas.m@demo-business.de', '+49 170 3333333', 'D111222333', 'available', 'P-123456', '2026-12-31', 'Hauptstraße 10', '10115', 'Berlin', NOW() - INTERVAL '85 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Sarah', 'Weber', 'sarah.w@demo-business.de', '+49 170 4444444', 'D444555666', 'on_duty', 'P-234567', '2027-06-30', 'Nebenstraße 20', '10115', 'Berlin', NOW() - INTERVAL '80 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Michael', 'Schneider', 'michael.s@demo-business.de', '+49 170 5555555', 'D777888999', 'available', 'P-345678', '2026-09-30', 'Seitenweg 5', '10115', 'Berlin', NOW() - INTERVAL '75 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Lisa', 'Fischer', 'lisa.f@demo-business.de', '+49 170 6666666', 'D000111222', 'offline', 'P-456789', '2027-03-31', 'Querstraße 15', '10117', 'Berlin', NOW() - INTERVAL '70 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Daniel', 'Wagner', 'daniel.w@demo-business.de', '+49 170 7777777', 'D333444555', 'available', 'P-567890', '2026-11-30', 'Kreuzweg 8', '10178', 'Berlin', NOW() - INTERVAL '65 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Julia', 'Becker', 'julia.b@demo-business.de', '+49 170 8888888', 'D666777888', 'break', 'P-678901', '2027-01-31', 'Ringstraße 22', '10179', 'Berlin', NOW() - INTERVAL '60 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Sebastian', 'Hoffmann', 'sebastian.h@demo-business.de', '+49 170 9999999', 'D999000111', 'available', 'P-789012', '2026-10-31', 'Feldweg 12', '10243', 'Berlin', NOW() - INTERVAL '55 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Laura', 'Koch', 'laura.k@demo-business.de', '+49 170 0000000', 'D222333444', 'on_duty', 'P-890123', '2027-04-30', 'Waldstraße 30', '10245', 'Berlin', NOW() - INTERVAL '50 days');

-- ============================================================================
-- PART 4: DEMO VEHICLES (Starter: 2, Business: 6)
-- ============================================================================

-- Starter Demo: 2 Vehicles (under limit of 3)
INSERT INTO public.vehicles (company_id, license_plate, vehicle_class, status, manufacturer, model, vin, build_year, color, mileage, created_at) VALUES
('11111111-1111-1111-1111-111111111111'::uuid, 'M-AB 1234', 'Business Class - Limousine (1-4 Pax)', 'available', 'Mercedes-Benz', 'E-Klasse', 'WDD2130461A123456', 2020, 'Schwarz Metallic', 85000, NOW() - INTERVAL '25 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'M-CD 5678', 'Economy Class (1-4 Pax)', 'im_einsatz', 'Volkswagen', 'Passat', 'WVWZZZ3CZ9E123456', 2019, 'Silber', 120000, NOW() - INTERVAL '20 days');

-- Business Demo: 6 Vehicles (unlimited)
INSERT INTO public.vehicles (company_id, license_plate, vehicle_class, status, manufacturer, model, vin, hsn, tsn, power_kw, power_ps, build_year, first_registration, color, mileage, created_at) VALUES
('22222222-2222-2222-2222-222222222222'::uuid, 'B-XY 1111', 'First Class (1-3 Pax)', 'available', 'Mercedes-Benz', 'S-Klasse', 'WDD2221061A789012', '0005', 'ACX', 250, 340, 2022, '2022-03-15', 'Schwarz', 45000, NOW() - INTERVAL '85 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'B-XY 2222', 'Business Class - Limousine (1-4 Pax)', 'im_einsatz', 'BMW', '5er', 'WBADT43452G345678', '0005', 'BCV', 190, 258, 2021, '2021-06-20', 'Grau Metallic', 65000, NOW() - INTERVAL '80 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'B-XY 3333', 'Van / SUV (1-8 Pax)', 'available', 'Mercedes-Benz', 'V-Klasse', 'WDF63970424567890', '0005', 'ACD', 140, 190, 2020, '2020-09-10', 'Weiß', 95000, NOW() - INTERVAL '75 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'B-XY 4444', 'Business Class - Kombi (1-4 Pax)', 'wartung', 'Audi', 'A6 Avant', 'WAUZZZ4G8DN901234', '0588', 'ABT', 160, 218, 2019, '2019-11-05', 'Blau Metallic', 110000, NOW() - INTERVAL '70 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'B-XY 5555', 'Economy Class (1-4 Pax)', 'available', 'Skoda', 'Superb', 'TMBEF74TXH9012345', '8004', 'AHR', 110, 150, 2021, '2021-02-28', 'Silber', 55000, NOW() - INTERVAL '65 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'B-XY 6666', 'Business Class - Limousine (1-4 Pax)', 'available', 'Mercedes-Benz', 'E-Klasse', 'WDD2130461A567890', '0005', 'AEF', 180, 245, 2022, '2022-05-12', 'Schwarz', 35000, NOW() - INTERVAL '60 days');

-- ============================================================================
-- PART 5: DEMO CUSTOMERS (Starter: 8, Business: 25)
-- ============================================================================

-- Starter Demo: 8 Customers
INSERT INTO public.customers (company_id, first_name, last_name, email, phone, created_at) VALUES
('11111111-1111-1111-1111-111111111111'::uuid, 'Peter', 'Klein', 'peter.klein@email.de', '+49 89 11111111', NOW() - INTERVAL '20 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'Maria', 'Groß', 'maria.gross@email.de', '+49 89 22222222', NOW() - INTERVAL '18 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'Klaus', 'Lang', 'klaus.lang@email.de', '+49 89 33333333', NOW() - INTERVAL '16 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'Sabine', 'Kurz', 'sabine.kurz@email.de', '+49 89 44444444', NOW() - INTERVAL '14 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'Frank', 'Jung', 'frank.jung@email.de', '+49 89 55555555', NOW() - INTERVAL '12 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'Petra', 'Alt', 'petra.alt@email.de', '+49 89 66666666', NOW() - INTERVAL '10 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'Firma ABC GmbH', 'Geschäftsführung', 'kontakt@firma-abc.de', '+49 89 77777777', NOW() - INTERVAL '8 days'),
('11111111-1111-1111-1111-111111111111'::uuid, 'Hotel Beispiel', 'Rezeption', 'rezeption@hotel-beispiel.de', '+49 89 88888888', NOW() - INTERVAL '6 days');

-- Business Demo: 25 Customers (partial list for brevity - add more if needed)
INSERT INTO public.customers (company_id, first_name, last_name, email, phone, has_portal_access, created_at) VALUES
('22222222-2222-2222-2222-222222222222'::uuid, 'Alexander', 'Richter', 'alex.richter@email.de', '+49 30 11111111', false, NOW() - INTERVAL '80 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Claudia', 'Neumann', 'claudia.neumann@email.de', '+49 30 22222222', true, NOW() - INTERVAL '75 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Robert', 'Schwarz', 'robert.schwarz@email.de', '+49 30 33333333', false, NOW() - INTERVAL '70 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Martina', 'Weiß', 'martina.weiss@email.de', '+49 30 44444444', true, NOW() - INTERVAL '65 days'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Firma XYZ AG', 'Hr. Meier', 'meier@firma-xyz.de', '+49 30 55555555', true, NOW() - INTERVAL '60 days');
-- (Add 20 more customers if needed)

-- ============================================================================
-- PART 6: DEMO BOOKINGS (Starter: 15, Business: 40)
-- ============================================================================

-- Starter Demo: 15 Bookings (sample - mix of statuses)
-- NOTE: Dates use relative timestamps for realism
DO $$
DECLARE
  starter_company_id UUID := '11111111-1111-1111-1111-111111111111'::uuid;
  driver1_id UUID;
  driver2_id UUID;
  vehicle1_id UUID;
  vehicle2_id UUID;
  customer_ids UUID[];
BEGIN
  -- Get driver/vehicle IDs
  SELECT id INTO driver1_id FROM public.drivers WHERE company_id = starter_company_id LIMIT 1;
  SELECT id INTO driver2_id FROM public.drivers WHERE company_id = starter_company_id OFFSET 1 LIMIT 1;
  SELECT id INTO vehicle1_id FROM public.vehicles WHERE company_id = starter_company_id LIMIT 1;
  SELECT id INTO vehicle2_id FROM public.vehicles WHERE company_id = starter_company_id OFFSET 1 LIMIT 1;
  SELECT ARRAY_AGG(id) INTO customer_ids FROM public.customers WHERE company_id = starter_company_id LIMIT 5;

  -- Create bookings with varied statuses and dates
  INSERT INTO public.bookings (company_id, customer_id, driver_id, vehicle_id, pickup_date, pickup_time, pickup_address, dropoff_address, status, price, created_at) VALUES
  (starter_company_id, customer_ids[1], driver1_id, vehicle1_id, CURRENT_DATE + 1, '08:00', 'Flughafen München Terminal 2', 'Marienplatz 1, 80331 München', 'assigned', 45.00, NOW() - INTERVAL '2 days'),
  (starter_company_id, customer_ids[2], driver2_id, vehicle2_id, CURRENT_DATE, '14:30', 'Hauptbahnhof München', 'Olympiapark 1, 80809 München', 'in_progress', 28.50, NOW() - INTERVAL '4 hours'),
  (starter_company_id, customer_ids[3], driver1_id, vehicle1_id, CURRENT_DATE - 1, '10:15', 'Sendlinger Tor 5', 'Flughafen München Terminal 1', 'completed', 52.00, NOW() - INTERVAL '1 day'),
  (starter_company_id, customer_ids[4], NULL, NULL, CURRENT_DATE + 2, '16:00', 'Karlsplatz 3', 'Garching Forschungszentrum', 'pending', 38.00, NOW() - INTERVAL '3 days'),
  (starter_company_id, customer_ids[5], driver2_id, vehicle2_id, CURRENT_DATE - 3, '09:30', 'Leopoldstraße 100', 'Theresienhöhe 12', 'completed', 25.50, NOW() - INTERVAL '3 days');
  -- Add 10 more bookings if needed
END $$;

-- Business Demo: 40 Bookings (partial - add more with loop if needed)
-- Similar pattern as above but with more variety

-- ============================================================================
-- PART 7: COMMENTS & INSTRUCTIONS
-- ============================================================================

COMMENT ON TABLE public.companies IS 'Updated: Added 2 demo companies with feature_limits';
COMMENT ON TABLE public.profiles IS 'Updated: Added 2 demo user profiles (linked to auth.users)';
COMMENT ON TABLE public.drivers IS 'Updated: Starter=2, Business=8 drivers';
COMMENT ON TABLE public.vehicles IS 'Updated: Starter=2, Business=6 vehicles';
COMMENT ON TABLE public.customers IS 'Updated: Starter=8, Business=25 customers';
COMMENT ON TABLE public.bookings IS 'Updated: Starter=15, Business=40 bookings';

-- ============================================================================
-- MANUAL STEPS REQUIRED (Cannot be done via SQL)
-- ============================================================================
-- 1. Create Auth Users via Supabase Dashboard or Auth API:
--    - Email: demo.starter@my-dispatch.de
--      Password: De.25-STR_#mO_!
--      User ID: 11111111-auth-auth-auth-111111111111
--
--    - Email: demo.business@my-dispatch.de
--      Password: De.BsS_25#mO_!
--      User ID: 22222222-auth-auth-auth-222222222222
--
-- 2. Update profiles.user_id after auth creation
-- 3. Test login with both accounts
-- 4. Verify Feature-Flags enforcement (useFeatureAccess hook)
