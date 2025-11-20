import { useEffect } from 'react';
import { logger } from '@/lib/logger';

/**
 * Touch-Target Validation Hook
 * 
 * Prüft automatisch, ob alle interaktiven Elemente die Mindestgröße
 * von 44x44px (Apple/Google Guidelines) einhalten
 * 
 * Siehe: docs/MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md
 * 
 * @example
 * useTouchTargetValidation('.interactive-section');
 */
export const useTouchTargetValidation = (selector?: string) => {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const validateTouchTargets = () => {
      const root = selector ? document.querySelector(selector) : document.body;
      if (!root) return;

      const interactiveElements = root.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [role="tab"]'
      );

      const warnings: string[] = [];

      interactiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const tagName = element.tagName.toLowerCase();
        const role = element.getAttribute('role');
        const identifier = role || tagName;

        if (rect.width < 44 || rect.height < 44) {
          warnings.push(
            `<${identifier}> zu klein: ${Math.round(rect.width)}x${Math.round(rect.height)}px (min: 44x44px)`
          );
        }
      });

      if (warnings.length > 0) {
        logger.group('🔶 Touch-Target Validation');
        warnings.forEach((warning) => logger.warn(warning, { component: 'useTouchTargetValidation' }));
        logger.info('Empfehlung: Verwende min-h-[44px] min-w-[44px] oder h-11/h-12', { component: 'useTouchTargetValidation' });
        logger.groupEnd();
      }
    };

    // Initial validation
    validateTouchTargets();

    // Re-validate on resize
    window.addEventListener('resize', validateTouchTargets);
    return () => window.removeEventListener('resize', validateTouchTargets);
  }, [selector]);
};
