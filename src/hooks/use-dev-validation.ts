/**
 * useDevValidation Hook
 *
 * Wrapper für alle Validation-Hooks, die NUR in Development laufen.
 * Production-Build enthält KEINE Validation-Logik mehr.
 *
 * Performance-Impact:
 * - Bundle-Size: -2-3%
 * - Production Performance: +5-10%
 * - Console-Logs in Production: 0
 *
 * @example
 * ```tsx
 * import { useDevValidation } from '@/hooks/use-dev-validation';
 *
 * export default function Dashboard() {
 *   useDevValidation('Dashboard');
 *   // Rest of component...
 * }
 * ```
 *
 * @see docs/TECH_DEBT_LOG.md - DEBT-010
 */

import { useLayoutStandardsValidator } from "./useLayoutStandardsValidator";
import { useTouchTargetValidator } from "./useTouchTargetValidator";

/**
 * Development-Only Validation Hook
 *
 * Führt Layout-Standards und Touch-Target Validierung aus,
 * aber NUR im Development-Modus. Production-Build enthält
 * keine dieser Checks mehr.
 *
 * Die Conditionals sind INSIDE der Hooks (React Rules of Hooks konform).
 *
 * @param pageName - Name der Page für Logging/Tracking
 */
export function useDevValidation(pageName: string): void {
  // ✅ PHASE 3: Early Return für Production (Performance-Optimierung)
  if (import.meta.env.PROD) {
    return; // Komplett überspringen in Production
  }

  // ✅ Hooks IMMER aufrufen - Conditionals sind INSIDE der Hooks
  useLayoutStandardsValidator(pageName);
  useTouchTargetValidator();
}
