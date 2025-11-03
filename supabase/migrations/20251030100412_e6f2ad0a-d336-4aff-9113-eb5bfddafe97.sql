-- ==================================================================================
-- V5.0 REST-MIGRATION: Fehlende Docs-Daten in Knowledge-Base einfügen
-- ==================================================================================
-- Basierend auf Schema-Check: Erlaubte Werte identifiziert
-- knowledge_base.category: design_system, component_pattern, bug_fix, best_practice, 
--                          anti_pattern, custom_hook, autonomous_tool, edge_function
-- known_issues.issue_type: hallucinated_function, missing_import, type_error, 
--                          rls_violation, design_inconsistency, performance_issue
-- ==================================================================================

-- ============================
-- 1. CUSTOM HOOKS (NEU)
-- ============================
INSERT INTO public.knowledge_base (category, title, content, tags, confidence_score, source, importance_level, complexity_level)
VALUES 
(
  'custom_hook',
  'useLayoutStandardsValidator Hook',
  '{"hook_path": "src/hooks/useLayoutStandardsValidator.ts", "purpose": "Automatically validates mobile-first grid patterns and spacing standards", "usage": "useLayoutStandardsValidator(''PageName'')", "dev_only": true, "validates": ["responsive_grid_patterns", "consistent_spacing", "max_width_constraints"]}',
  ARRAY['hooks', 'validation', 'development', 'v5.0'],
  1.0,
  'docs_sync',
  5,
  3
),
(
  'custom_hook',
  'useTouchTargetValidator Hook',
  '{"hook_path": "src/hooks/useTouchTargetValidator.ts", "purpose": "Validates touch targets meet WCAG/Apple 44px minimum", "usage": "useTouchTargetValidator()", "dev_only": true, "validates": ["touch_target_size", "accessibility", "mobile_usability"]}',
  ARRAY['hooks', 'validation', 'accessibility', 'v5.0'],
  1.0,
  'docs_sync',
  5,
  2
);

-- ============================
-- 2. EDGE FUNCTIONS (NEU)
-- ============================
INSERT INTO public.knowledge_base (category, title, content, tags, confidence_score, source, importance_level, complexity_level)
VALUES 
(
  'edge_function',
  'mandatory-knowledge-check Edge Function',
  '{"path": "supabase/functions/mandatory-knowledge-check", "purpose": "VERPFLICHTEND vor jeder Implementierung - prüft Knowledge-Base", "usage": "await supabase.functions.invoke(''mandatory-knowledge-check'', {body: {task_description, task_type, affected_files}})", "returns": ["relevant_knowledge", "code_snippets", "best_practices", "known_issues", "existing_components", "checklist"], "critical": true}',
  ARRAY['edge-function', 'knowledge-base', 'mandatory', 'v5.0'],
  1.0,
  'docs_sync',
  5,
  4
),
(
  'edge_function',
  'auto-learn-from-actions Edge Function',
  '{"path": "supabase/functions/auto-learn-from-actions", "purpose": "Automatisches Learning aus allen AI-Aktionen", "usage": "await supabase.functions.invoke(''auto-learn-from-actions'', {body: {action_type, success, context, learnings, confidence}})", "triggered_by": "mandatory-knowledge-check after success", "stores_in": ["ai_learning_patterns", "code_snippets.usage_count"]}',
  ARRAY['edge-function', 'auto-learning', 'ai', 'v5.0'],
  1.0,
  'docs_sync',
  5,
  4
);

-- ============================
-- 3. BUG-FIX PATTERNS (NEU)
-- ============================
INSERT INTO public.knowledge_base (category, title, content, tags, confidence_score, source, importance_level, complexity_level)
VALUES 
(
  'bug_fix',
  'Check Constraint Validation Trigger Pattern',
  '{"problem": "CHECK constraints müssen immutable sein - Zeitbasierte Validierungen (expire_at > now()) scheitern", "solution": "Nutze Validation Triggers statt CHECK constraints für zeitbasierte oder dynamische Validierungen", "example": "CREATE TRIGGER validate_expire_date BEFORE INSERT OR UPDATE ON table FOR EACH ROW EXECUTE FUNCTION validate_expire_fn();"}',
  ARRAY['bug-fix', 'database', 'triggers', 'validation'],
  0.95,
  'error_analysis',
  4,
  3
),
(
  'bug_fix',
  'Enum Check Constraint Error Prevention',
  '{"problem": "INSERT/UPDATE scheitert mit ''new row violates check constraint'' bei unbekannten Enum-Werten", "solution": "Immer Schema prüfen: SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid=''table''::regclass", "prevention": ["Query erlaubte Werte VOR Insert", "Nutze nur validierte Enum-Werte", "Dokumentiere erlaubte Werte in Knowledge-Base"]}',
  ARRAY['bug-fix', 'database', 'enum', 'constraints'],
  1.0,
  'error_analysis',
  5,
  2
);

-- ============================
-- 4. KNOWN ISSUES ERGÄNZUNG
-- ============================
INSERT INTO public.known_issues (issue_type, description, solution, prevention_checklist, severity, occurrences, tags)
VALUES 
(
  'missing_import',
  'Validation Hooks nicht importiert obwohl verwendet',
  'Import hinzufügen: import { useLayoutStandardsValidator, useTouchTargetValidator } from ''@/hooks/validation''',
  ARRAY['Immer prüfen ob Hook-Imports vorhanden sind', 'Nutze lov-search-files um Dependencies zu finden', 'Achte auf barrel exports (index.ts)'],
  'medium',
  1,
  ARRAY['imports', 'hooks', 'validation']
),
(
  'performance_issue',
  'Validation Hooks laufen in Production (Performance Impact)',
  'Hooks enthalten process.env.NODE_ENV !== ''development'' Check - aber Code könnte trotzdem gebundled werden. Prüfe ob Tree-Shaking funktioniert.',
  ARRAY['Validation-Hooks nur in Development nutzen', 'Prüfe Vite Build Output auf Dev-Only Code', 'Erwäge separate Dev-Dependencies'],
  'low',
  0,
  ARRAY['performance', 'development', 'build']
);

-- ============================
-- 5. COMPONENT REGISTRY UPDATE
-- ============================
UPDATE public.component_registry
SET 
  description = 'V28 Marketing Card mit Slate-Palette - NIEMALS neu erstellen!',
  props_schema = '{"variant": ["default", "highlight"], "icon": "LucideIcon", "title": "string", "description": "string"}',
  tags = ARRAY['v28', 'marketing', 'card', 'slate-palette'],
  last_verified = NOW(),
  verification_status = 'active'
WHERE component_name = 'V28MarketingCard';

UPDATE public.component_registry
SET 
  description = 'V28 Icon Box Container mit konsistenten Styles',
  props_schema = '{"icon": "LucideIcon", "size": "sm|md|lg", "variant": "default|primary"}',
  tags = ARRAY['v28', 'icon', 'container', 'slate-palette'],
  last_verified = NOW(),
  verification_status = 'active'
WHERE component_name = 'V28IconBox';

UPDATE public.component_registry
SET 
  description = 'V28 Button Component - Primary UI Element',
  props_schema = '{"variant": ["default", "outline", "ghost", "secondary"], "size": ["sm", "md", "lg"], "disabled": "boolean"}',
  tags = ARRAY['v28', 'button', 'core', 'slate-palette'],
  last_verified = NOW(),
  verification_status = 'active'
WHERE component_name = 'V28Button';

-- ============================
-- 6. BEST PRACTICES UPDATE
-- ============================
UPDATE public.best_practices
SET 
  example_code = 'useLayoutStandardsValidator(''Index''); // Prüft Grid-Patterns automatisch
useTouchTargetValidator(); // Prüft Touch-Target-Größen',
  reasoning = 'In Development: Automatische Validierung verhindert Design-Inkonsistenzen. In Production: Code wird nicht ausgeführt (NODE_ENV Check).',
  usage_count = 0
WHERE title = 'Grid-Pattern-Validation Hook';

UPDATE public.best_practices
SET 
  example_code = 'const { data } = await supabase.functions.invoke(''mandatory-knowledge-check'', {
  body: { task_description: ''Create Button'', task_type: ''component_creation'', affected_files: [...] }
});',
  reasoning = 'VERPFLICHTEND vor jeder Implementierung - verhindert Halluzinationen und doppelte Components.',
  usage_count = 0
WHERE category = 'component_creation' AND title ILIKE '%knowledge%';

-- ============================
-- SUCCESS VALIDATION
-- ============================
DO $$
DECLARE
  kb_count INT;
  issues_count INT;
  practices_count INT;
BEGIN
  SELECT COUNT(*) INTO kb_count FROM knowledge_base;
  SELECT COUNT(*) INTO issues_count FROM known_issues;
  SELECT COUNT(*) INTO practices_count FROM best_practices;
  
  RAISE NOTICE '✅ Migration completed:';
  RAISE NOTICE '   - knowledge_base: % entries', kb_count;
  RAISE NOTICE '   - known_issues: % entries', issues_count;
  RAISE NOTICE '   - best_practices: % entries', practices_count;
END $$;