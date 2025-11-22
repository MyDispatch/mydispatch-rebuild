-- ========================================
-- CRITICAL FIXES: Master Account & System Configuration
-- ========================================
-- Task 2: Master Account umstrukturieren
-- Task 3: Impressum aktualisieren
-- Task 5: "Unternehmens-Landingpages" Menü entfernen
-- Date: 2025-11-22
-- Status: CRITICAL PRODUCTION FIX

-- ============================================================================
-- PART 1: MASTER ACCOUNT UPDATE
-- ============================================================================

-- Aktueller Master Account: info@simsek.cc → LÖSCHEN
-- Neuer Master Account: info@my-dispatch.de (Passwort: #25_FS.42-FKS!)

-- Step 1: Info@simsek.cc Role ändern (von master → admin)
UPDATE public.profiles
SET
  role = 'admin',
  updated_at = NOW()
WHERE email = 'info@simsek.cc' AND role = 'master';

-- Step 2: Neuen Master Account erstellen (manuell via Supabase Auth erforderlich)
-- HINWEIS: Auth User muss ZUERST via Supabase Dashboard/Auth API erstellt werden:
-- Email: info@my-dispatch.de
-- Passwort: #25_FS.42-FKS!
-- Dann:
/*
INSERT INTO public.profiles (
  id,
  user_id,
  email,
  first_name,
  last_name,
  role,
  created_at
) VALUES (
  gen_random_uuid(),
  '<USER_ID_FROM_AUTH>', -- Replace with actual auth.users.id
  'info@my-dispatch.de',
  'Master',
  'Admin',
  'master',
  NOW()
);
*/

-- ============================================================================
-- PART 2: COMPANY INFO UPDATE (Impressum)
-- ============================================================================

-- Firmen-Stammdaten aktualisieren (falls company_info table existiert)
-- HINWEIS: Diese Daten werden in Frontend-Komponenten verwendet

COMMENT ON TABLE public.companies IS 'Updated: RideHub Solutions, Ibrahim SIMSEK, Ensbachmühle 4, D-94571 Schaufling';

-- Falls eine zentrale Config-Tabelle existiert:
-- UPDATE public.system_config SET value = 'RideHub Solutions' WHERE key = 'company_name';
-- UPDATE public.system_config SET value = 'Ibrahim SIMSEK' WHERE key = 'company_owner';
-- UPDATE public.system_config SET value = 'Ensbachmühle 4' WHERE key = 'company_street';
-- UPDATE public.system_config SET value = 'D-94571' WHERE key = 'company_postal_code';
-- UPDATE public.system_config SET value = 'Schaufling' WHERE key = 'company_city';
-- UPDATE public.system_config SET value = '+49 170 8004423' WHERE key = 'company_phone';
-- UPDATE public.system_config SET value = 'info@my-dispatch.de' WHERE key = 'company_email';
-- UPDATE public.system_config SET value = false WHERE key = 'show_vat_id'; -- USt-IdNr. ausblenden

-- ============================================================================
-- PART 3: NAVIGATION CLEANUP
-- ============================================================================

-- "Unternehmens-Landingpages" Menüpunkt: Keine DB-Änderungen erforderlich
-- Wird in AppSidebar.tsx Frontend-seitig entfernt

-- ============================================================================
-- PART 4: PRICING UPDATE (Informational - für Stripe Dashboard)
-- ============================================================================

-- Business Tarif Preise:
-- Monatlich: 99,00 EUR
-- Jährlich: 79,20 EUR/Monat (948,00 EUR/Jahr, -20% Rabatt)

-- HINWEIS: Stripe Products/Prices müssen via Stripe Dashboard aktualisiert werden:
-- 1. Stripe Dashboard → Products → Business Tarif
-- 2. Price: 99.00 EUR/month
-- 3. Add Annual Price: 948.00 EUR/year (79.20 EUR/month equivalent)

-- ============================================================================
-- MANUAL STEPS REQUIRED
-- ============================================================================

-- [ ] 1. Supabase Auth: Create user info@my-dispatch.de (Password: #25_FS.42-FKS!)
-- [ ] 2. Insert profile for info@my-dispatch.de with role='master'
-- [ ] 3. Test login with new master account
-- [ ] 4. Stripe Dashboard: Update Business Tarif pricing
-- [ ] 5. Frontend: Update Impressum.tsx with new company data
-- [ ] 6. Frontend: Remove "Unternehmens-Landingpages" from AppSidebar.tsx

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================

-- Check Master Accounts
-- SELECT email, role, first_name, last_name FROM public.profiles WHERE role = 'master';

-- Check Old Master Account (should be admin now)
-- SELECT email, role FROM public.profiles WHERE email = 'info@simsek.cc';

-- Check New Master Account (should exist after manual creation)
-- SELECT email, role FROM public.profiles WHERE email = 'info@my-dispatch.de';
