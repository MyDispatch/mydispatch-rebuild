-- ========================================
-- TASK 9: Demo-Accounts (Starter & Business)
-- ========================================
-- Erstelle vollständige Demo-Accounts mit realistischen Demo-Daten
-- für Präsentationszwecke

-- ============================================================================
-- PART 1: DEMO COMPANIES
-- ============================================================================

-- Demo Company 1: STARTER TARIF
INSERT INTO public.companies (
  id,
  name,
  legal_name,
  email,
  phone,
  street,
  house_number,
  postal_code,
  city,
  country,
  settings,
  subscription_plan,
  subscription_status,
  subscription_start,
  subscription_end,
  created_at
) VALUES (
  'aaaaaaaa-0001-4000-8000-000000000001'::UUID, -- Fixed UUID for demo starter
  'DEMO Taxi Starter',
  'DEMO Taxi Starter GmbH',
  'demo.starter@my-dispatch.de',
  '+49 30 12345001',
  'Demostraße',
  '1',
  '10115',
  'Berlin',
  'Deutschland',
  jsonb_build_object(
    'minimum_lead_time_minutes', 30,
    'accepted_payment_methods', jsonb_build_array('bar', 'rechnung'),
    'demo_mode', true
  ),
  'starter',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  subscription_plan = EXCLUDED.subscription_plan,
  updated_at = NOW();

-- Demo Company 2: BUSINESS TARIF
INSERT INTO public.companies (
  id,
  name,
  legal_name,
  email,
  phone,
  street,
  house_number,
  postal_code,
  city,
  country,
  settings,
  subscription_plan,
  subscription_status,
  subscription_start,
  subscription_end,
  created_at
) VALUES (
  'bbbbbbbb-0002-4000-8000-000000000002'::UUID, -- Fixed UUID for demo business
  'DEMO Limousinen Business',
  'DEMO Limousinen Business GmbH',
  'demo.business@my-dispatch.de',
  '+49 89 98765002',
  'Geschäftsallee',
  '99',
  '80331',
  'München',
  'Deutschland',
  jsonb_build_object(
    'minimum_lead_time_minutes', 120,
    'accepted_payment_methods', jsonb_build_array('bar', 'kreditkarte', 'rechnung'),
    'demo_mode', true
  ),
  'business',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  subscription_plan = EXCLUDED.subscription_plan,
  updated_at = NOW();

-- ============================================================================
-- PART 2: DEMO USER PROFILES (Auth Users müssen manuell erstellt werden)
-- ============================================================================

-- HINWEIS: Auth Users müssen ZUERST via Supabase Dashboard erstellt werden:
--
-- User 1: demo.starter@my-dispatch.de, Passwort: De.25-STR_#mO_!
-- User 2: demo.business@my-dispatch.de, Passwort: De.BsS_25#mO_!

-- Nach Auth-User-Erstellung:
/*
INSERT INTO public.profiles (
  id,
  user_id,
  company_id,
  email,
  first_name,
  last_name,
  role,
  salutation,
  active,
  created_at
) VALUES
  (
    gen_random_uuid(),
    '<AUTH_USER_ID_STARTER>',
    'aaaaaaaa-0001-4000-8000-000000000001'::UUID,
    'demo.starter@my-dispatch.de',
    'Demo',
    'Starter',
    'admin',
    'Herr',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    '<AUTH_USER_ID_BUSINESS>',
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'demo.business@my-dispatch.de',
    'Demo',
    'Business',
    'admin',
    'Herr',
    true,
    NOW()
  )
ON CONFLICT (user_id) DO NOTHING;
*/

-- ============================================================================
-- PART 3: DEMO DRIVERS (Starter: 3, Business: 8)
-- ============================================================================

-- STARTER: 3 Fahrer (max. limit)
INSERT INTO public.drivers (
  id,
  company_id,
  first_name,
  last_name,
  salutation,
  email,
  phone,
  street,
  house_number,
  postal_code,
  city,
  license_number,
  license_expires_at,
  p_license_number,
  p_license_issued_at,
  p_license_expires_at,
  active,
  created_at
) VALUES
  (
    gen_random_uuid(),
    'aaaaaaaa-0001-4000-8000-000000000001'::UUID,
    'Max',
    'Mustermann',
    'Herr',
    'max.mustermann@demo-starter.de',
    '+49 172 1234001',
    'Fahrerstraße',
    '10',
    '10115',
    'Berlin',
    'B123456789',
    CURRENT_DATE + INTERVAL '2 years',
    'P-2024-001-DEMO',
    CURRENT_DATE - INTERVAL '1 year',
    CURRENT_DATE + INTERVAL '4 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'aaaaaaaa-0001-4000-8000-000000000001'::UUID,
    'Anna',
    'Schmidt',
    'Frau',
    'anna.schmidt@demo-starter.de',
    '+49 172 1234002',
    'Fahrerstraße',
    '11',
    '10115',
    'Berlin',
    'B987654321',
    CURRENT_DATE + INTERVAL '3 years',
    'P-2024-002-DEMO',
    CURRENT_DATE - INTERVAL '2 years',
    CURRENT_DATE + INTERVAL '3 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'aaaaaaaa-0001-4000-8000-000000000001'::UUID,
    'Thomas',
    'Weber',
    'Herr',
    'thomas.weber@demo-starter.de',
    '+49 172 1234003',
    'Fahrerstraße',
    '12',
    '10115',
    'Berlin',
    'B456789123',
    CURRENT_DATE + INTERVAL '1 year',
    'P-2024-003-DEMO',
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE + INTERVAL '4.5 years',
    true,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- BUSINESS: 8 Fahrer (unbegrenzt, aber 8 für Demo)
INSERT INTO public.drivers (
  id,
  company_id,
  first_name,
  last_name,
  salutation,
  email,
  phone,
  street,
  house_number,
  postal_code,
  city,
  license_number,
  license_expires_at,
  p_license_number,
  p_license_issued_at,
  p_license_expires_at,
  active,
  created_at
) VALUES
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'Michael',
    'Bauer',
    'Herr',
    'michael.bauer@demo-business.de',
    '+49 172 9876001',
    'Chauffeurweg',
    '20',
    '80331',
    'München',
    'M123456789',
    CURRENT_DATE + INTERVAL '2 years',
    'P-2024-004-DEMO',
    CURRENT_DATE - INTERVAL '1 year',
    CURRENT_DATE + INTERVAL '4 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'Sarah',
    'Fischer',
    'Frau',
    'sarah.fischer@demo-business.de',
    '+49 172 9876002',
    'Chauffeurweg',
    '21',
    '80331',
    'München',
    'M987654321',
    CURRENT_DATE + INTERVAL '3 years',
    'P-2024-005-DEMO',
    CURRENT_DATE - INTERVAL '2 years',
    CURRENT_DATE + INTERVAL '3 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'Daniel',
    'Wagner',
    'Herr',
    'daniel.wagner@demo-business.de',
    '+49 172 9876003',
    'Chauffeurweg',
    '22',
    '80331',
    'München',
    'M456789123',
    CURRENT_DATE + INTERVAL '1 year',
    'P-2024-006-DEMO',
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE + INTERVAL '4.5 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'Julia',
    'Hoffmann',
    'Frau',
    'julia.hoffmann@demo-business.de',
    '+49 172 9876004',
    'Chauffeurweg',
    '23',
    '80331',
    'München',
    'M789123456',
    CURRENT_DATE + INTERVAL '2 years',
    'P-2024-007-DEMO',
    CURRENT_DATE - INTERVAL '1.5 years',
    CURRENT_DATE + INTERVAL '3.5 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'Markus',
    'Schneider',
    'Herr',
    'markus.schneider@demo-business.de',
    '+49 172 9876005',
    'Chauffeurweg',
    '24',
    '80331',
    'München',
    'M321654987',
    CURRENT_DATE + INTERVAL '3 years',
    'P-2024-008-DEMO',
    CURRENT_DATE - INTERVAL '3 years',
    CURRENT_DATE + INTERVAL '2 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'Laura',
    'Koch',
    'Frau',
    'laura.koch@demo-business.de',
    '+49 172 9876006',
    'Chauffeurweg',
    '25',
    '80331',
    'München',
    'M654987321',
    CURRENT_DATE + INTERVAL '1 year',
    'P-2024-009-DEMO',
    CURRENT_DATE - INTERVAL '8 months',
    CURRENT_DATE + INTERVAL '4 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'Sebastian',
    'Richter',
    'Herr',
    'sebastian.richter@demo-business.de',
    '+49 172 9876007',
    'Chauffeurweg',
    '26',
    '80331',
    'München',
    'M147258369',
    CURRENT_DATE + INTERVAL '2 years',
    'P-2024-010-DEMO',
    CURRENT_DATE - INTERVAL '1 year',
    CURRENT_DATE + INTERVAL '4 years',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'Nina',
    'Braun',
    'Frau',
    'nina.braun@demo-business.de',
    '+49 172 9876008',
    'Chauffeurweg',
    '27',
    '80331',
    'München',
    'M963852741',
    CURRENT_DATE + INTERVAL '3 years',
    'P-2024-011-DEMO',
    CURRENT_DATE - INTERVAL '2 years',
    CURRENT_DATE + INTERVAL '3 years',
    true,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PART 4: DEMO VEHICLES (Starter: 3, Business: 10)
-- ============================================================================

-- STARTER: 3 Fahrzeuge (max. limit)
INSERT INTO public.vehicles (
  id,
  company_id,
  license_plate,
  manufacturer,
  model,
  vin,
  year_built,
  first_registration,
  color,
  power_kw,
  mileage,
  vehicle_class,
  tuv_expires_at,
  active,
  created_at
) VALUES
  (
    gen_random_uuid(),
    'aaaaaaaa-0001-4000-8000-000000000001'::UUID,
    'B-TX 1001',
    'Mercedes-Benz',
    'E-Klasse T-Modell',
    'WDD2130121A123456',
    2021,
    '2021-03-15',
    'Schwarz',
    143,
    45000,
    'kombi',
    CURRENT_DATE + INTERVAL '18 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'aaaaaaaa-0001-4000-8000-000000000001'::UUID,
    'B-TX 1002',
    'Volkswagen',
    'Passat Variant',
    'WVWZZZ3CZ9E234567',
    2020,
    '2020-08-22',
    'Silber',
    110,
    62000,
    'kombi',
    CURRENT_DATE + INTERVAL '10 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'aaaaaaaa-0001-4000-8000-000000000001'::UUID,
    'B-TX 1003',
    'Skoda',
    'Superb Combi',
    'TMBEF74L0A8345678',
    2022,
    '2022-01-10',
    'Weiß',
    140,
    28000,
    'kombi',
    CURRENT_DATE + INTERVAL '26 months',
    true,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- BUSINESS: 10 Fahrzeuge (unbegrenzt, aber 10 für Demo)
INSERT INTO public.vehicles (
  id,
  company_id,
  license_plate,
  manufacturer,
  model,
  vin,
  year_built,
  first_registration,
  color,
  power_kw,
  mileage,
  vehicle_class,
  tuv_expires_at,
  active,
  created_at
) VALUES
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2001',
    'Mercedes-Benz',
    'S-Klasse',
    'WDD2221071A456789',
    2023,
    '2023-06-01',
    'Schwarz',
    250,
    15000,
    'limo',
    CURRENT_DATE + INTERVAL '30 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2002',
    'BMW',
    '7er',
    'WBAYF8108HDZ67890',
    2023,
    '2023-04-15',
    'Weiß',
    290,
    18000,
    'limo',
    CURRENT_DATE + INTERVAL '28 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2003',
    'Audi',
    'A8',
    'WAUZZZ4H9DN078901',
    2022,
    '2022-11-20',
    'Grau',
    210,
    25000,
    'limo',
    CURRENT_DATE + INTERVAL '22 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2004',
    'Mercedes-Benz',
    'V-Klasse',
    'WDF4470001X189012',
    2023,
    '2023-02-10',
    'Schwarz',
    176,
    20000,
    'van',
    CURRENT_DATE + INTERVAL '26 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2005',
    'Mercedes-Benz',
    'E-Klasse Limousine',
    'WDD2130301A290123',
    2022,
    '2022-09-05',
    'Silber',
    145,
    32000,
    'limo',
    CURRENT_DATE + INTERVAL '20 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2006',
    'BMW',
    '5er Touring',
    'WBA5R110209X01234',
    2023,
    '2023-01-12',
    'Blau',
    180,
    22000,
    'kombi',
    CURRENT_DATE + INTERVAL '24 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2007',
    'Audi',
    'A6 Avant',
    'WAUZZZ4G8EN112345',
    2022,
    '2022-07-18',
    'Schwarz',
    150,
    35000,
    'kombi',
    CURRENT_DATE + INTERVAL '18 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2008',
    'Mercedes-Benz',
    'EQS',
    'WDD2970001X223456',
    2024,
    '2024-03-01',
    'Weiß',
    265,
    8000,
    'limo',
    CURRENT_DATE + INTERVAL '32 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2009',
    'BMW',
    'iX',
    'WBY1Z810909X34567',
    2024,
    '2024-01-20',
    'Grau',
    240,
    5000,
    'suv',
    CURRENT_DATE + INTERVAL '34 months',
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0002-4000-8000-000000000002'::UUID,
    'M-LX 2010',
    'Audi',
    'e-tron GT',
    'WAUZZZ9K9NA045678',
    2023,
    '2023-10-05',
    'Schwarz',
    350,
    12000,
    'coupe',
    CURRENT_DATE + INTERVAL '28 months',
    true,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PART 5: DEMO CUSTOMERS (10 pro Company)
-- ============================================================================

-- STARTER: 10 Privatkunden
INSERT INTO public.customers (
  company_id,
  first_name,
  last_name,
  salutation,
  email,
  phone,
  customer_type,
  active,
  created_at
) VALUES
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Peter', 'Müller', 'Herr', 'peter.mueller@demo.de', '+49 172 1111001', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Maria', 'Schneider', 'Frau', 'maria.schneider@demo.de', '+49 172 1111002', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Hans', 'Fischer', 'Herr', 'hans.fischer@demo.de', '+49 172 1111003', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Sabine', 'Weber', 'Frau', 'sabine.weber@demo.de', '+49 172 1111004', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Klaus', 'Wagner', 'Herr', 'klaus.wagner@demo.de', '+49 172 1111005', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Petra', 'Becker', 'Frau', 'petra.becker@demo.de', '+49 172 1111006', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Wolfgang', 'Schulz', 'Herr', 'wolfgang.schulz@demo.de', '+49 172 1111007', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Monika', 'Hoffmann', 'Frau', 'monika.hoffmann@demo.de', '+49 172 1111008', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Jürgen', 'Koch', 'Herr', 'juergen.koch@demo.de', '+49 172 1111009', 'private', true, NOW()),
  ('aaaaaaaa-0001-4000-8000-000000000001'::UUID, 'Andrea', 'Richter', 'Frau', 'andrea.richter@demo.de', '+49 172 1111010', 'private', true, NOW())
ON CONFLICT DO NOTHING;

-- BUSINESS: 10 Geschäftskunden mit Ansprechpartnern
INSERT INTO public.customers (
  company_id,
  company_name,
  customer_type,
  email,
  phone,
  active,
  created_at
) VALUES
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'Siemens AG', 'business', 'kontakt@siemens-demo.de', '+49 89 6360001', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'BMW Group', 'business', 'kontakt@bmw-demo.de', '+49 89 3820002', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'Allianz SE', 'business', 'kontakt@allianz-demo.de', '+49 89 3800003', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'Deutsche Bank AG', 'business', 'kontakt@db-demo.de', '+49 69 9100004', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'Lufthansa AG', 'business', 'kontakt@lh-demo.de', '+49 69 6960005', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'BASF SE', 'business', 'kontakt@basf-demo.de', '+49 621 6000006', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'Bosch GmbH', 'business', 'kontakt@bosch-demo.de', '+49 711 4000007', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'SAP SE', 'business', 'kontakt@sap-demo.de', '+49 6227 7400008', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'Volkswagen AG', 'business', 'kontakt@vw-demo.de', '+49 5361 9000009', true, NOW()),
  ('bbbbbbbb-0002-4000-8000-000000000002'::UUID, 'Telekom AG', 'business', 'kontakt@telekom-demo.de', '+49 228 1810010', true, NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PART 6: DEMO BOOKINGS (10 pro Company)
-- ============================================================================

-- NOTE: Bookings require customer_ids which are auto-generated
-- These will be added via Edge Function after customer creation

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================

-- Check Demo Companies
-- SELECT id, name, email, subscription_plan, subscription_status FROM public.companies WHERE settings->>'demo_mode' = 'true';

-- Check Demo Drivers
-- SELECT company_id, COUNT(*) as driver_count FROM public.drivers WHERE company_id IN ('aaaaaaaa-0001-4000-8000-000000000001', 'bbbbbbbb-0002-4000-8000-000000000002') GROUP BY company_id;

-- Check Demo Vehicles
-- SELECT company_id, COUNT(*) as vehicle_count FROM public.vehicles WHERE company_id IN ('aaaaaaaa-0001-4000-8000-000000000001', 'bbbbbbbb-0002-4000-8000-000000000002') GROUP BY company_id;

-- Check Demo Customers
-- SELECT company_id, COUNT(*) as customer_count FROM public.customers WHERE company_id IN ('aaaaaaaa-0001-4000-8000-000000000001', 'bbbbbbbb-0002-4000-8000-000000000002') GROUP BY company_id;

-- ============================================================================
-- MANUAL STEPS REQUIRED
-- ============================================================================

-- [ ] 1. Supabase Auth: Create user demo.starter@my-dispatch.de (Password: De.25-STR_#mO_!)
-- [ ] 2. Supabase Auth: Create user demo.business@my-dispatch.de (Password: De.BsS_25#mO_!)
-- [ ] 3. Insert profiles for both demo users (see PART 2)
-- [ ] 4. Test login with demo accounts
-- [ ] 5. Add demo bookings via Edge Function (requires customer_ids)
