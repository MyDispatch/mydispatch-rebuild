/* ==================================================================================
   USE PORTAL THEME HOOK V1.0
   ==================================================================================
   React Hook für Portal-Theme-Management
   - Automatisches Theme-Loading
   - Window-Global-Caching (__portalCompany)
   - Type-Safe Theme-Zugriff
   ================================================================================== */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createPortalTheme, type PortalTheme } from '@/lib/portal-theme';

interface UsePortalThemeOptions {
  companyId?: string | null;
  enableCache?: boolean; // Default: true
}

interface UsePortalThemeReturn {
  theme: PortalTheme | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook für Portal-Theme-Zugriff
 * 
 * @example
 * ```tsx
 * const { theme, isLoading } = usePortalTheme({ companyId });
 * 
 * if (theme) {
 *   return <div style={{ color: theme.primaryColor }}>{theme.companyName}</div>;
 * }
 * ```
 */
export function usePortalTheme(
  options: UsePortalThemeOptions = {}
): UsePortalThemeReturn {
  const { companyId, enableCache = true } = options;
  const [theme, setTheme] = useState<PortalTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    // ✅ Cache-Check: Prüfe Window-Global
    if (enableCache && (window as any).__portalCompany) {
      const cached = (window as any).__portalCompany;
      if (cached.id === companyId) {
        setTheme(createPortalTheme(cached));
        setIsLoading(false);
        return;
      }
    }

    // ✅ Fetch from Supabase
    const fetchTheme = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('companies')
          .select('id, name, logo_url, primary_color, landingpage_title, landingpage_hero_text, landingpage_description')
          .eq('id', companyId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Company not found');

        const portalTheme = createPortalTheme(data);
        setTheme(portalTheme);

        // ✅ Cache in Window-Global
        if (enableCache) {
          (window as any).__portalCompany = data;
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setTheme(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheme();
  }, [companyId, enableCache]);

  return { theme, isLoading, error };
}

/**
 * Hook für direkten Zugriff auf gecachtes Portal-Theme (ohne Fetch)
 * Nutzt nur Window-Global-Cache
 */
export function useCachedPortalTheme(): PortalTheme | null {
  const [theme, setTheme] = useState<PortalTheme | null>(null);

  useEffect(() => {
    const cached = (window as any).__portalCompany;
    if (cached) {
      setTheme(createPortalTheme(cached));
    }
  }, []);

  return theme;
}
