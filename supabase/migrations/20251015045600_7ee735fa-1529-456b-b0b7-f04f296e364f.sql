-- ==================================================================================
-- KRITISCHE RLS-FIX: Profiles Infinite Recursion beheben
-- ==================================================================================
-- Problem: Zirkuläre Abhängigkeiten in RLS Policies
-- Lösung: Policies vereinfachen und auth.uid() direkt nutzen
-- ==================================================================================

-- Alle bestehenden Policies für profiles entfernen
DROP POLICY IF EXISTS "company_isolation_select_profiles" ON profiles;
DROP POLICY IF EXISTS "company_isolation_insert_profiles" ON profiles;
DROP POLICY IF EXISTS "company_isolation_update_profiles" ON profiles;
DROP POLICY IF EXISTS "company_isolation_delete_profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- ✅ SICHERE RLS POLICIES ohne Rekursion
-- Regel: Nutzer sehen/editieren NUR ihr eigenes Profil

-- SELECT: Eigenes Profil anzeigen
CREATE POLICY "users_select_own_profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- INSERT: Eigenes Profil erstellen (via Trigger)
CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Eigenes Profil aktualisieren
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: Eigenes Profil löschen (in der Regel nicht erlaubt)
CREATE POLICY "users_delete_own_profile" ON profiles
  FOR DELETE
  USING (auth.uid() = id);

-- LOGGING für Debugging
DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies für profiles erfolgreich neu erstellt';
  RAISE NOTICE '   - Keine Rekursion mehr';
  RAISE NOTICE '   - Nutzer können nur ihr eigenes Profil sehen/editieren';
END $$;