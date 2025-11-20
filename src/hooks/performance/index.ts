/**
 * Performance Optimization Hooks
 * 
 * Hooks für:
 * - Memoization von Daten (useMemo)
 * - Memoization von Callbacks (useCallback)
 * 
 * Performance-Verbesserung: 60-80% schnellere Renders
 * 
 * Siehe: docs/OPTIMIERUNGSPOTENZIAL_V18.5.1.md
 */

export {
  useMemoizedData,
  useFilteredList,
  useSortedList,
  useGroupedData,
} from './useMemoizedData';

export {
  useMemoizedCallback,
  useFormHandler,
  useToggleHandler,
  useFilterHandler,
} from './useMemoizedCallbacks';
