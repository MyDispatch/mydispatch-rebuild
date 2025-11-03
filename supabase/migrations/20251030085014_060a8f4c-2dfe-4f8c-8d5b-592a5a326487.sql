-- ============================================
-- V5.0 OPTIMIZATION - PHASE 4 (FINAL FIX)
-- Generate Test Data for Self-Learning
-- ============================================

-- ============================================
-- Simuliere Pattern-Usage für code_snippets
-- ============================================
UPDATE code_snippets
SET 
  usage_count = FLOOR(RANDOM() * 50 + 10)::INTEGER,
  last_used = NOW() - (RANDOM() * INTERVAL '30 days'),
  success_rate = 0.85 + (RANDOM() * 0.15)  -- 85-100%
WHERE pattern_name IN (
  'Zod Form Validation',
  'Supabase Query Pattern',
  'React Query Hook',
  'Safe User Property Access'
);

-- ============================================
-- Simuliere Automation Pattern Runs
-- success_rate wird AUTOMATISCH berechnet (GENERATED column)
-- ============================================
UPDATE automation_patterns
SET 
  usage_count = FLOOR(RANDOM() * 100 + 50)::INTEGER,
  success_count = FLOOR(RANDOM() * 80 + 40)::INTEGER,
  failure_count = FLOOR(RANDOM() * 20 + 5)::INTEGER,
  last_used = NOW() - (RANDOM() * INTERVAL '7 days'),
  avg_duration_seconds = FLOOR(RANDOM() * 60 + 10)::INTEGER
WHERE pattern_name IN (
  'TypeScript Compilation Check',
  'Security Audit',
  'RLS Policy Validation'
);

-- ============================================
-- AI Learning Pattern Test-Inserts
-- ============================================
INSERT INTO ai_learning_patterns (
  pattern_type,
  context,
  success,
  learnings,
  confidence,
  files_changed,
  patterns_used,
  issues_encountered,
  learned_at,
  applied_count
) VALUES 
(
  'component_creation',
  '{"task": "Created V28Button", "duration_seconds": 45}'::jsonb,
  true,
  'Successfully used V28Button pattern from component_registry. No recreation needed.',
  0.95,
  ARRAY['src/pages/TestPage.tsx'],
  ARRAY['V28Button', 'Zod Form Validation'],
  ARRAY[]::TEXT[],
  NOW() - INTERVAL '2 days',
  3
),
(
  'bug_fix',
  '{"task": "Fixed RLS policy on bookings table", "duration_seconds": 120}'::jsonb,
  true,
  'Applied RLS Policy Pattern from code_snippets. Used security definer pattern.',
  0.92,
  ARRAY['supabase/migrations/20250130_fix_rls.sql'],
  ARRAY['RLS Policy Pattern'],
  ARRAY['Missing policy for INSERT'],
  NOW() - INTERVAL '1 day',
  1
),
(
  'feature_implementation',
  '{"task": "Implemented chat feature with Supabase Realtime", "duration_seconds": 300}'::jsonb,
  true,
  'Used Supabase Realtime pattern. Enabled realtime on chat_messages table successfully.',
  0.88,
  ARRAY['src/components/Chat.tsx', 'src/hooks/useChat.ts'],
  ARRAY['Supabase Query Pattern', 'React Query Hook'],
  ARRAY['Initial subscription timeout - fixed by proper cleanup'],
  NOW() - INTERVAL '5 hours',
  2
),
(
  'pattern_application',
  '{"task": "Applied V28.1 Design System to dashboard", "duration_seconds": 180}'::jsonb,
  true,
  'Migrated from designTokens to slate-palette. All components now use semantic tokens.',
  0.97,
  ARRAY['src/pages/Dashboard.tsx', 'src/components/DashboardCard.tsx'],
  ARRAY['V28Card', 'V28IconBox'],
  ARRAY[]::TEXT[],
  NOW() - INTERVAL '3 days',
  5
)
ON CONFLICT DO NOTHING;