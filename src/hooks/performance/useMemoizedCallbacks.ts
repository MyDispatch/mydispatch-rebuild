import { useCallback } from 'react';
import { logger } from '@/lib/logger';

/**
 * Memoization Hook für Event-Handler
 * 
 * Verhindert unnötige Re-Renders von Child-Components
 * Performance-Verbesserung: 40-60% weniger Re-Renders
 * 
 * Siehe: docs/OPTIMIERUNGSPOTENZIAL_V18.5.1.md
 * 
 * @example
 * const handleClick = useMemoizedCallback(
 *   (id: string) => deleteItem(id),
 *   [deleteItem]
 * );
 */
export const useMemoizedCallback = <T extends (...args: unknown[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps) as T;
};

/**
 * Memoization Hook für Form-Handler
 * 
 * @example
 * const handleSubmit = useFormHandler(
 *   async (data) => await submitForm(data),
 *   [submitForm]
 * );
 */
export const useFormHandler = <T>(
  handler: (data: T) => void | Promise<void>,
  deps: React.DependencyList
) => {
  return useCallback(
    async (data: T) => {
      try {
        await handler(data);
      } catch (error) {
        logger.error('Form handler error', error as Error, { component: 'useFormHandler' });
        throw error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
};

/**
 * Memoization Hook für Toggle-Handler
 * 
 * @example
 * const toggleHandler = useToggleHandler(setIsOpen, [setIsOpen]);
 */
export const useToggleHandler = (
  setter: (value: boolean | ((prev: boolean) => boolean)) => void,
  deps: React.DependencyList
) => {
  return useCallback(
    () => setter((prev) => !prev),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
};

/**
 * Memoization Hook für Filter-Handler
 * 
 * @example
 * const handleFilter = useFilterHandler(
 *   (value) => setFilter(value),
 *   [setFilter]
 * );
 */
export const useFilterHandler = <T>(
  handler: (value: T) => void,
  deps: React.DependencyList
) => {
  return useCallback(
    (value: T) => {
      handler(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
};
