-- KRITISCHER FIX: RLS Infinite Recursion in profiles beheben
-- Problem: Die Policy "Users can view profiles in their company" verursacht Rekursion

-- Alte Policy entfernen
DROP POLICY IF EXISTS "Users can view profiles in their company" ON profiles;

-- Neue sichere Policy erstellen (ohne Rekursion)
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view company profiles"
  ON profiles FOR SELECT
  USING (
    company_id IN (
      SELECT company_id 
      FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Profiles Update Policy korrigieren
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Profiles Insert Policy korrigieren  
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Profiles Delete Policy korrigieren
DROP POLICY IF EXISTS "users_delete_own_profile" ON profiles;
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (user_id = auth.uid());