-- ==================================================================================
-- FIX: Function Search Path Mutable (Security Linter Warning)
-- ==================================================================================
-- Created: 2025-01-30 14:50:00 UTC
-- Purpose: Set explicit search_path für update_updated_at_column()

-- Drop und recreate mit explizitem search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;