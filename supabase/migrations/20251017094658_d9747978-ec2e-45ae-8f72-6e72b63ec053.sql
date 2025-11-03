-- ============================================================================
-- SECURITY HARDENING PART 1: Add moderator role
-- ============================================================================

-- Add 'moderator' to app_role enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'moderator' 
    AND enumtypid = 'app_role'::regtype
  ) THEN
    ALTER TYPE app_role ADD VALUE 'moderator';
  END IF;
END $$;