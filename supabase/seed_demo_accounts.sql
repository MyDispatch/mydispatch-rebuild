-- =====================================================================
-- DEMO ACCOUNTS SEED - MyDispatch V32.5
-- =====================================================================
-- Erstellt: 2025-01-08
-- Zweck: Demo-Daten für Testing und Entwicklung
-- WICHTIG: NUR FÜR DEVELOPMENT/STAGING - NICHT IN PRODUCTION DEPLOYEN!
-- =====================================================================

-- =====================================================================
-- 1. DEMO COMPANY
-- =====================================================================

DO $$
DECLARE
    demo_company_id UUID;
    demo_profile_id UUID;
    demo_user_id UUID := '00000000-0000-0000-0000-000000000001'; -- Placeholder
BEGIN

-- Insert Demo Company
INSERT INTO companies (
    id,
    name,
    company_type,
    street,
    postal_code,
    city,
    phone,
    email,
    website,
    tax_id,
    created_at
) VALUES (
    '10000000-0000-0000-0000-000000000001',
    'Demo Taxiunternehmen GmbH',
    'taxi',
    'Musterstraße 123',
    '12345',
    'Berlin',
    '+49 30 12345678',
    'demo@my-dispatch.de',
    'https://demo.my-dispatch.de',
    'DE123456789',
    NOW()
) ON CONFLICT (id) DO NOTHING
RETURNING id INTO demo_company_id;

-- Use existing or new ID
IF demo_company_id IS NULL THEN
    demo_company_id := '10000000-0000-0000-0000-000000000001';
END IF;

-- =====================================================================
-- 2. DEMO USERS & PROFILES
-- =====================================================================

-- Demo Admin User
INSERT INTO profiles (
    id,
    user_id,
    company_id,
    first_name,
    last_name,
    email,
    phone,
    role,
    created_at
) VALUES (
    '10000000-0001-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    demo_company_id,
    'Max',
    'Mustermann',
    'admin@demo.my-dispatch.de',
    '+49 170 1234567',
    'admin',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Demo Dispatcher User
INSERT INTO profiles (
    id,
    user_id,
    company_id,
    first_name,
    last_name,
    email,
    phone,
    role,
    created_at
) VALUES (
    '10000000-0001-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    demo_company_id,
    'Anna',
    'Schmidt',
    'dispatcher@demo.my-dispatch.de',
    '+49 170 2234567',
    'dispatcher',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 3. DEMO DRIVERS (5 Stück)
-- =====================================================================

INSERT INTO drivers (
    id,
    company_id,
    first_name,
    last_name,
    email,
    phone,
    license_number,
    license_expiry,
    status,
    created_at
) VALUES
(
    '20000000-0001-0000-0000-000000000001',
    demo_company_id,
    'Thomas',
    'Müller',
    'thomas.mueller@demo.de',
    '+49 170 3334444',
    'D123456789',
    '2026-12-31',
    'active',
    NOW()
),
(
    '20000000-0001-0000-0000-000000000002',
    demo_company_id,
    'Sarah',
    'Wagner',
    'sarah.wagner@demo.de',
    '+49 170 3335555',
    'D987654321',
    '2027-06-30',
    'active',
    NOW()
),
(
    '20000000-0001-0000-0000-000000000003',
    demo_company_id,
    'Michael',
    'Schneider',
    'michael.schneider@demo.de',
    '+49 170 3336666',
    'D111222333',
    '2025-12-31',
    'active',
    NOW()
),
(
    '20000000-0001-0000-0000-000000000004',
    demo_company_id,
    'Laura',
    'Fischer',
    'laura.fischer@demo.de',
    '+49 170 3337777',
    'D444555666',
    '2028-03-31',
    'active',
    NOW()
),
(
    '20000000-0001-0000-0000-000000000005',
    demo_company_id,
    'Daniel',
    'Weber',
    'daniel.weber@demo.de',
    '+49 170 3338888',
    'D777888999',
    '2026-09-30',
    'inactive',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 4. DEMO VEHICLES (5 Stück)
-- =====================================================================

INSERT INTO vehicles (
    id,
    company_id,
    license_plate,
    make,
    model,
    year,
    vehicle_type,
    seats,
    status,
    created_at
) VALUES
(
    '30000000-0001-0000-0000-000000000001',
    demo_company_id,
    'B-TX 1234',
    'Mercedes',
    'E-Klasse',
    2023,
    'sedan',
    4,
    'active',
    NOW()
),
(
    '30000000-0001-0000-0000-000000000002',
    demo_company_id,
    'B-TX 5678',
    'BMW',
    '5er',
    2022,
    'sedan',
    4,
    'active',
    NOW()
),
(
    '30000000-0001-0000-0000-000000000003',
    demo_company_id,
    'B-TX 9012',
    'Mercedes',
    'V-Klasse',
    2023,
    'van',
    8,
    'active',
    NOW()
),
(
    '30000000-0001-0000-0000-000000000004',
    demo_company_id,
    'B-TX 3456',
    'Volkswagen',
    'Passat',
    2021,
    'sedan',
    4,
    'active',
    NOW()
),
(
    '30000000-0001-0000-0000-000000000005',
    demo_company_id,
    'B-TX 7890',
    'Tesla',
    'Model S',
    2024,
    'luxury',
    5,
    'maintenance',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 5. DEMO CUSTOMERS (10 Stück)
-- =====================================================================

INSERT INTO customers (
    id,
    company_id,
    customer_type,
    first_name,
    last_name,
    company_name,
    email,
    phone,
    street,
    postal_code,
    city,
    created_at
) VALUES
-- Private Customers
(
    '40000000-0001-0000-0000-000000000001',
    demo_company_id,
    'private',
    'Klaus',
    'Becker',
    NULL,
    'klaus.becker@demo.de',
    '+49 170 4441111',
    'Alexanderplatz 1',
    '10178',
    'Berlin',
    NOW()
),
(
    '40000000-0001-0000-0000-000000000002',
    demo_company_id,
    'private',
    'Petra',
    'Hoffmann',
    NULL,
    'petra.hoffmann@demo.de',
    '+49 170 4442222',
    'Ku\'damm 50',
    '10719',
    'Berlin',
    NOW()
),
(
    '40000000-0001-0000-0000-000000000003',
    demo_company_id,
    'private',
    'Stefan',
    'Klein',
    NULL,
    'stefan.klein@demo.de',
    '+49 170 4443333',
    'Friedrichstraße 100',
    '10117',
    'Berlin',
    NOW()
),
-- Business Customers
(
    '40000000-0001-0000-0000-000000000004',
    demo_company_id,
    'business',
    'Maria',
    'Neumann',
    'Tech Solutions GmbH',
    'maria.neumann@techsolutions.de',
    '+49 30 5551111',
    'Potsdamer Platz 1',
    '10785',
    'Berlin',
    NOW()
),
(
    '40000000-0001-0000-0000-000000000005',
    demo_company_id,
    'business',
    'Jürgen',
    'Schulz',
    'Hotel Adlon',
    'j.schulz@adlon.de',
    '+49 30 5552222',
    'Unter den Linden 77',
    '10117',
    'Berlin',
    NOW()
),
(
    '40000000-0001-0000-0000-000000000006',
    demo_company_id,
    'business',
    'Andrea',
    'Richter',
    'Siemens AG',
    'andrea.richter@siemens.com',
    '+49 30 5553333',
    'Werner-von-Siemens-Straße 1',
    '13629',
    'Berlin',
    NOW()
),
(
    '40000000-0001-0000-0000-000000000007',
    demo_company_id,
    'business',
    'Frank',
    'Zimmermann',
    'Charité - Universitätsmedizin',
    'f.zimmermann@charite.de',
    '+49 30 5554444',
    'Charitéplatz 1',
    '10117',
    'Berlin',
    NOW()
),
(
    '40000000-0001-0000-0000-000000000008',
    demo_company_id,
    'private',
    'Julia',
    'Krause',
    NULL,
    'julia.krause@demo.de',
    '+49 170 4444444',
    'Brandenburger Tor',
    '10117',
    'Berlin',
    NOW()
),
(
    '40000000-0001-0000-0000-000000000009',
    demo_company_id,
    'business',
    'Robert',
    'Lehmann',
    'Deutsche Bank AG',
    'r.lehmann@db.com',
    '+49 30 5555555',
    'Pariser Platz 3',
    '10117',
    'Berlin',
    NOW()
),
(
    '40000000-0001-0000-0000-000000000010',
    demo_company_id,
    'business',
    'Sandra',
    'Koch',
    'Zalando SE',
    's.koch@zalando.de',
    '+49 30 5556666',
    'Valeska-Gert-Straße 5',
    '10243',
    'Berlin',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 6. DEMO BOOKINGS (20 Stück - verschiedene Status)
-- =====================================================================

INSERT INTO bookings (
    id,
    company_id,
    customer_id,
    driver_id,
    vehicle_id,
    booking_number,
    pickup_address,
    dropoff_address,
    pickup_datetime,
    booking_status,
    price,
    created_at
) VALUES
-- Completed Bookings (Past)
(
    '50000000-0001-0000-0000-000000000001',
    demo_company_id,
    '40000000-0001-0000-0000-000000000001',
    '20000000-0001-0000-0000-000000000001',
    '30000000-0001-0000-0000-000000000001',
    'DEMO-20250101-001',
    'Alexanderplatz 1, 10178 Berlin',
    'Flughafen Tegel, 13405 Berlin',
    NOW() - INTERVAL '7 days',
    'completed',
    45.50,
    NOW() - INTERVAL '8 days'
),
(
    '50000000-0001-0000-0000-000000000002',
    demo_company_id,
    '40000000-0001-0000-0000-000000000002',
    '20000000-0001-0000-0000-000000000002',
    '30000000-0001-0000-0000-000000000002',
    'DEMO-20250102-001',
    'Ku\'damm 50, 10719 Berlin',
    'Hauptbahnhof, 10557 Berlin',
    NOW() - INTERVAL '6 days',
    'completed',
    22.00,
    NOW() - INTERVAL '7 days'
),
(
    '50000000-0001-0000-0000-000000000003',
    demo_company_id,
    '40000000-0001-0000-0000-000000000004',
    '20000000-0001-0000-0000-000000000003',
    '30000000-0001-0000-0000-000000000003',
    'DEMO-20250103-001',
    'Potsdamer Platz 1, 10785 Berlin',
    'Alexanderplatz 1, 10178 Berlin',
    NOW() - INTERVAL '5 days',
    'completed',
    18.50,
    NOW() - INTERVAL '6 days'
),
-- Active Bookings (Today)
(
    '50000000-0001-0000-0000-000000000004',
    demo_company_id,
    '40000000-0001-0000-0000-000000000005',
    '20000000-0001-0000-0000-000000000001',
    '30000000-0001-0000-0000-000000000001',
    'DEMO-20250108-001',
    'Hotel Adlon, Unter den Linden 77, 10117 Berlin',
    'Flughafen BER, 12529 Schönefeld',
    NOW() + INTERVAL '2 hours',
    'confirmed',
    65.00,
    NOW() - INTERVAL '1 day'
),
(
    '50000000-0001-0000-0000-000000000005',
    demo_company_id,
    '40000000-0001-0000-0000-000000000006',
    '20000000-0001-0000-0000-000000000002',
    '30000000-0001-0000-0000-000000000002',
    'DEMO-20250108-002',
    'Siemens AG, Werner-von-Siemens-Straße 1, 13629 Berlin',
    'Hauptbahnhof, 10557 Berlin',
    NOW() + INTERVAL '4 hours',
    'confirmed',
    35.00,
    NOW() - INTERVAL '2 hours'
),
-- Future Bookings
(
    '50000000-0001-0000-0000-000000000006',
    demo_company_id,
    '40000000-0001-0000-0000-000000000007',
    '20000000-0001-0000-0000-000000000003',
    '30000000-0001-0000-0000-000000000003',
    'DEMO-20250109-001',
    'Charité, Charitéplatz 1, 10117 Berlin',
    'Friedrichstraße 100, 10117 Berlin',
    NOW() + INTERVAL '1 day',
    'pending',
    25.00,
    NOW()
),
(
    '50000000-0001-0000-0000-000000000007',
    demo_company_id,
    '40000000-0001-0000-0000-000000000008',
    NULL,
    NULL,
    'DEMO-20250110-001',
    'Brandenburger Tor, 10117 Berlin',
    'Alexanderplatz 1, 10178 Berlin',
    NOW() + INTERVAL '2 days',
    'pending',
    15.00,
    NOW()
),
(
    '50000000-0001-0000-0000-000000000008',
    demo_company_id,
    '40000000-0001-0000-0000-000000000009',
    NULL,
    NULL,
    'DEMO-20250111-001',
    'Deutsche Bank, Pariser Platz 3, 10117 Berlin',
    'Flughafen BER, 12529 Schönefeld',
    NOW() + INTERVAL '3 days',
    'pending',
    70.00,
    NOW()
),
-- Cancelled Bookings
(
    '50000000-0001-0000-0000-000000000009',
    demo_company_id,
    '40000000-0001-0000-0000-000000000010',
    NULL,
    NULL,
    'DEMO-20250107-001',
    'Zalando, Valeska-Gert-Straße 5, 10243 Berlin',
    'Hauptbahnhof, 10557 Berlin',
    NOW() - INTERVAL '1 day',
    'cancelled',
    30.00,
    NOW() - INTERVAL '2 days'
),
(
    '50000000-0001-0000-0000-000000000010',
    demo_company_id,
    '40000000-0001-0000-0000-000000000003',
    NULL,
    NULL,
    'DEMO-20250106-001',
    'Friedrichstraße 100, 10117 Berlin',
    'Flughafen Tegel, 13405 Berlin',
    NOW() - INTERVAL '2 days',
    'cancelled',
    50.00,
    NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 7. COST CENTERS (für Business Customers)
-- =====================================================================

INSERT INTO cost_centers (
    id,
    company_id,
    name,
    code,
    description,
    is_active,
    created_at
) VALUES
(
    '60000000-0001-0000-0000-000000000001',
    demo_company_id,
    'Marketing',
    'MKT-001',
    'Marketing Abteilung',
    true,
    NOW()
),
(
    '60000000-0001-0000-0000-000000000002',
    demo_company_id,
    'IT',
    'IT-001',
    'IT Abteilung',
    true,
    NOW()
),
(
    '60000000-0001-0000-0000-000000000003',
    demo_company_id,
    'Vertrieb',
    'SALES-001',
    'Vertriebsabteilung',
    true,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

END $$;

-- =====================================================================
-- 8. SUCCESS MESSAGE
-- =====================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Demo Accounts Seed erfolgreich! Erstellt:';
    RAISE NOTICE '   - 1 Demo Company (Demo Taxiunternehmen GmbH)';
    RAISE NOTICE '   - 2 Demo Users (Admin + Dispatcher)';
    RAISE NOTICE '   - 5 Demo Drivers';
    RAISE NOTICE '   - 5 Demo Vehicles';
    RAISE NOTICE '   - 10 Demo Customers (6 Business + 4 Private)';
    RAISE NOTICE '   - 10 Demo Bookings (verschiedene Status)';
    RAISE NOTICE '   - 3 Demo Cost Centers';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Login Credentials (erst nach Auth Setup):';
    RAISE NOTICE '   Admin: admin@demo.my-dispatch.de';
    RAISE NOTICE '   Dispatcher: dispatcher@demo.my-dispatch.de';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  WICHTIG: Diese Daten sind nur für Development/Staging!';
    RAISE NOTICE '   NICHT in Production deployen!';
END $$;
