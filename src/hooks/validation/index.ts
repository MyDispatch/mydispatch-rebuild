/**
 * Validation Hooks
 * 
 * Automatische Validierung von:
 * - Grid-Patterns (Mobile-First)
 * - Legal-Compliance (DSGVO, AI Act, TMG)
 * - Touch-Targets (44x44px Minimum)
 * - Layout-Standards (V18.5.1)
 * - Touch-Target Erweitert (WCAG 2.5.5)
 * 
 * Siehe: docs/OPTIMIERUNGSPOTENZIAL_V18.5.1.md
 */

export { useGridPatternValidation } from './useGridPatternValidation';
export { useLegalComplianceValidation } from './useLegalComplianceValidation';
export { useTouchTargetValidation } from './useTouchTargetValidation';
export { useLayoutStandardsValidator } from '../useLayoutStandardsValidator';
export { useTouchTargetValidator } from '../useTouchTargetValidator';
export { useDevValidation } from '../use-dev-validation';
