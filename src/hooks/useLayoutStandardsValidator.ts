import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Layout Standards Validator Hook
 * 
 * Prüft automatisch, ob korrekte Grid-Patterns und Spacing-Standards
 * gemäß V18.5.1 Mobile-First Grid System verwendet werden.
 * 
 * Siehe: docs/MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md
 * 
 * @param pageName - Name der Page zur Identifikation
 * @param selector - Optionaler CSS-Selector für spezifische Section
 * 
 * @example
 * useLayoutStandardsValidator('Auftraege', '.main-content');
 */
export const useLayoutStandardsValidator = (pageName: string, selector?: string) => {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const validateLayoutStandards = async () => {
      const element = selector ? document.querySelector(selector) : document.body;
      if (!element) return;

      const warnings: string[] = [];
      const classes = element.className;

      // Lade Page-spezifische Layout-Standards aus Knowledge-Base
      const { data: layoutSpecs } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('category', 'page_layout_spec')
        .contains('tags', [pageName.toLowerCase()])
        .limit(1);

      // Prüfe Grid-Pattern
      const hasGrid = classes.includes('grid');
      const hasResponsiveGrid = /\b(sm:grid-cols-|md:grid-cols-|lg:grid-cols-)/.test(classes);
      
      if (hasGrid && !hasResponsiveGrid) {
        warnings.push(`${pageName}: Fehlendes responsive Grid-Pattern (sm:, md:, lg:)`);
      }

      // Prüfe Spacing-Konsistenz
      const gapMatches = classes.match(/gap-(\d+)/g);
      const paddingMatches = classes.match(/p[xytblr]?-(\d+)/g);
      
      if (gapMatches && new Set(gapMatches).size > 3) {
        warnings.push(`${pageName}: Inkonsistente gap-Werte (>3 verschiedene) - vereinheitlichen!`);
      }

      if (paddingMatches && new Set(paddingMatches).size > 4) {
        warnings.push(`${pageName}: Inkonsistente padding-Werte (>4 verschiedene) - vereinheitlichen!`);
      }

      // Prüfe gegen registrierte Standards
      if (layoutSpecs && layoutSpecs.length > 0) {
        const spec = layoutSpecs[0];
        const content = spec.content as any;
        const expectedPattern = content?.recommended_pattern;
        
        if (expectedPattern && typeof expectedPattern === 'string' && !classes.includes(expectedPattern)) {
          warnings.push(
            `${pageName}: Empfohlenes Pattern "${expectedPattern}" fehlt (siehe Knowledge-Base)`
          );
        }
      }

      // Container-Width Check
      const hasMaxWidth = /\b(max-w-|container)/.test(classes);
      if (!hasMaxWidth && element.tagName !== 'BODY') {
        warnings.push(`${pageName}: Fehlende max-width Begrenzung für Content-Container`);
      }

      // Ausgabe
      if (warnings.length > 0) {
        logger.group(`🔶 Layout Standards Validation: ${pageName}`);
        warnings.forEach((warning) => logger.warn(warning));
        logger.info('Empfehlung: Prüfe docs/MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md');
        logger.groupEnd();
      } else {
        logger.info(`✅ Layout Standards OK: ${pageName}`);
      }
    };

    // Initial validation
    setTimeout(validateLayoutStandards, 1000); // Wait for full render

    // Re-validate on resize
    window.addEventListener('resize', validateLayoutStandards);
    return () => window.removeEventListener('resize', validateLayoutStandards);
  }, [pageName, selector]);
};
