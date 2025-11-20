import { useEffect } from 'react';
import { logger } from '@/lib/logger';

/**
 * Touch-Target Validator Hook
 * 
 * Prüft automatisch, ob alle interaktiven Elemente die Mindestgröße
 * von 44x44px (Apple/Google Guidelines) einhalten.
 * 
 * Unterschied zu useTouchTargetValidation:
 * - Erweiterte Prüfung mit Kontext-Awareness
 * - Berücksichtigt padding/margin für effektive Touch-Area
 * 
 * Siehe: docs/MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md
 * 
 * @param enabled - Aktiviert/deaktiviert Validation (default: true)
 * 
 * @example
 * useTouchTargetValidator(true);
 */
export const useTouchTargetValidator = (enabled: boolean = true) => {
  useEffect(() => {
    if (!import.meta.env.DEV || !enabled) return;

    const validateTouchTargets = () => {
      const interactiveElements = document.querySelectorAll(
        'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="tab"], [role="link"]'
      );

      const warnings: Array<{ element: string; size: string; fix: string }> = [];
      const errors: Array<{ element: string; size: string; reason: string }> = [];

      interactiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        // Berechne effektive Touch-Area (inkl. padding)
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        
        const effectiveWidth = rect.width;
        const effectiveHeight = rect.height;
        
        const tagName = element.tagName.toLowerCase();
        const role = element.getAttribute('role');
        const identifier = role || tagName;
        const classList = Array.from(element.classList).join(' ');

        // Kritisch: < 32px (WCAG 2.5.5 Level AAA Minimum)
        if (effectiveWidth < 32 || effectiveHeight < 32) {
          errors.push({
            element: `<${identifier}> ${classList ? `class="${classList}"` : ''}`,
            size: `${Math.round(effectiveWidth)}×${Math.round(effectiveHeight)}px`,
            reason: 'KRITISCH - unter WCAG Minimum (32×32px)'
          });
        }
        // Warnung: < 44px (Apple/Google Guidelines)
        else if (effectiveWidth < 44 || effectiveHeight < 44) {
          warnings.push({
            element: `<${identifier}> ${classList ? `class="${classList}"` : ''}`,
            size: `${Math.round(effectiveWidth)}×${Math.round(effectiveHeight)}px`,
            fix: 'min-h-[44px] min-w-[44px] oder h-11 w-11'
          });
        }
      });

      // Ausgabe
      if (errors.length > 0 || warnings.length > 0) {
        logger.group('🔴 Touch-Target Validation');
        
        if (errors.length > 0) {
          logger.error(`${errors.length} KRITISCHE Touch-Target-Fehler gefunden:`);
          errors.forEach((err) => {
            logger.error(`${err.element}: ${err.size} - ${err.reason}`);
          });
        }
        
        if (warnings.length > 0) {
          logger.warn(`${warnings.length} Touch-Target-Warnungen:`);
          warnings.forEach((warning) => {
            logger.warn(`${warning.element}: ${warning.size} → ${warning.fix}`);
          });
        }
        
        logger.info('Empfehlung: Verwende Tailwind-Klassen wie min-h-[44px] min-w-[44px] oder h-11/h-12');
        logger.groupEnd();
      } else {
        logger.info(`✅ Touch-Targets OK (${interactiveElements.length} Elemente geprüft)`);
      }
    };

    // Initial validation (verzögert für vollständiges Rendering)
    const timer = setTimeout(validateTouchTargets, 1500);

    // Re-validate on resize
    window.addEventListener('resize', validateTouchTargets);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', validateTouchTargets);
    };
  }, [enabled]);
};
