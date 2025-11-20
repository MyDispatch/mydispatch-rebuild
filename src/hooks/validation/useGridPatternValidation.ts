import { useEffect } from 'react';
import { logger } from '@/lib/logger';

/**
 * Grid-Pattern Validation Hook
 * 
 * Prüft automatisch, ob Mobile-First Grid-Patterns korrekt verwendet werden
 * Warnt bei fehlenden Breakpoints oder falschen Spacing-Werten
 * 
 * Siehe: docs/MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md
 * 
 * @example
 * useGridPatternValidation('HERO-GRID', '.hero-section');
 */
export const useGridPatternValidation = (
  pattern: 'HERO-GRID' | 'TARIF-KARTEN-GRID' | 'DASHBOARD-GRID' | 'MOBILE-GRID-LAYOUT',
  selector?: string
) => {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const validateGridPattern = () => {
      const element = selector ? document.querySelector(selector) : document.body;
      if (!element) return;

      const computedStyle = window.getComputedStyle(element);
      const warnings: string[] = [];

      // Prüfe Grid-Display
      if (pattern.includes('GRID') && !computedStyle.display.includes('grid')) {
        warnings.push(`${pattern}: Element sollte display: grid verwenden`);
      }

      // Prüfe Breakpoints
      const hasResponsiveClasses = element.className.match(/\b(sm:|md:|lg:|xl:)/);
      if (!hasResponsiveClasses) {
        warnings.push(`${pattern}: Keine responsive Breakpoints gefunden (sm:, md:, lg:)`);
      }

      // Prüfe Touch-Targets (min-h-[44px])
      const buttons = element.querySelectorAll('button, a[role="button"]');
      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        if (rect.height < 44) {
          warnings.push(
            `${pattern}: Touch-Target zu klein (${Math.round(rect.height)}px < 44px)`
          );
        }
      });

      // Prüfe Padding/Margin
      const hasContentSpacing = element.className.match(/\b(p-|pt-|pb-|px-|py-)/);
      if (!hasContentSpacing) {
        warnings.push(`${pattern}: Kein Content-Spacing gefunden (p-, pt-, pb-)`);
      }

      if (warnings.length > 0) {
        logger.group(`🔶 Grid-Pattern Validation: ${pattern}`);
        warnings.forEach((warning) => logger.warn(warning, { component: 'useGridPatternValidation', pattern }));
        logger.groupEnd();
      }
    };

    // Initial validation
    validateGridPattern();

    // Re-validate on resize
    window.addEventListener('resize', validateGridPattern);
    return () => window.removeEventListener('resize', validateGridPattern);
  }, [pattern, selector]);
};
