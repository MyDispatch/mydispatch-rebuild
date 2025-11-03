-- ============================================
-- V5.0 OPTIMIZATION - PHASE 1 & 2
-- Schema Fixes & Known Issues Diversification
-- ============================================

-- ============================================
-- FIX 1.1: Component Registry Pfade korrigieren
-- ============================================
UPDATE component_registry
SET file_path = 'src/components/design-system/V28Button.tsx'
WHERE component_name = 'V28Button';

UPDATE component_registry
SET file_path = 'src/components/design-system/V28IconBox.tsx'
WHERE component_name = 'V28IconBox';

UPDATE component_registry
SET file_path = 'src/components/design-system/V28Card.tsx'
WHERE component_name = 'V28Card';

-- ============================================
-- FIX 1.2: AI Learning Patterns - Spalte umbenennen
-- ============================================
ALTER TABLE ai_learning_patterns
RENAME COLUMN action_type TO pattern_type;

-- ============================================
-- FIX 1.3: Migration Logs Tabelle erstellen
-- ============================================
CREATE TABLE IF NOT EXISTS migration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  records_migrated INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  executed_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE migration_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read for monitoring"
ON migration_logs FOR SELECT
USING (true);

CREATE POLICY "Only service role can insert"
ON migration_logs FOR INSERT
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- ============================================
-- FIX 2: Known Issues Diversifizieren
-- ============================================

-- Hallucinated Functions
UPDATE known_issues
SET issue_type = 'hallucinated_function'
WHERE (description ILIKE '%function%does not exist%'
   OR description ILIKE '%non-existent function%'
   OR description ILIKE '%getUserProfile%'
   OR description ILIKE '%hallucinated%')
  AND issue_type = 'type_error';

-- Missing Imports
UPDATE known_issues
SET issue_type = 'missing_import'
WHERE (description ILIKE '%import%'
   OR description ILIKE '%module%not found%'
   OR description ILIKE '%cannot find%')
  AND issue_type = 'type_error';

-- RLS Violations
UPDATE known_issues
SET issue_type = 'rls_violation'
WHERE (description ILIKE '%RLS%'
   OR description ILIKE '%Row Level Security%'
   OR description ILIKE '%permission denied%'
   OR description ILIKE '%policy%')
  AND issue_type = 'type_error';

-- Design Inconsistencies
UPDATE known_issues
SET issue_type = 'design_inconsistency'
WHERE (description ILIKE '%design%'
   OR description ILIKE '%color%'
   OR description ILIKE '%token%'
   OR description ILIKE '%slate%'
   OR description ILIKE '%palette%')
  AND issue_type = 'type_error';

-- Performance Issues
UPDATE known_issues
SET issue_type = 'performance_issue'
WHERE (description ILIKE '%performance%'
   OR description ILIKE '%slow%'
   OR description ILIKE '%memory%'
   OR description ILIKE '%timeout%')
  AND issue_type = 'type_error';