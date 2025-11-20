/* ==================================================================================
   USE-PUBLIC-COMPANY HOOK - React Query für öffentliche Landingpage-Daten
   ==================================================================================
   - Lädt Company-Daten über public RLS Policy
   - Smart Caching mit Auto-Refresh
   - Für nicht-authentifizierte Nutzer
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// 🔒 SECURITY: Type definition matching companies_public_info view (safe fields only)
export interface CompanyData {
  id: string;
  name: string;
  company_slug: string | null;
  logo_url: string | null;
  primary_color: string | null;
  landingpage_title: string | null;
  landingpage_hero_text: string | null;
  landingpage_description: string | null;
  city: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  business_hours: any;
  widget_button_text: string | null;
  widget_size: string | null;
  widget_show_phone: boolean | null;
  landingpage_enabled: boolean | null;
  widget_enabled: boolean | null;
}

export function usePublicCompany(slug?: string, tenantId?: string) {
  return useQuery<CompanyData | null>({
    queryKey: ['public-company', slug, tenantId],
    queryFn: async () => {
      if (!slug && !tenantId) return null;

      // 🔒 SECURITY: Use companies_public_info view (ONLY safe fields exposed)
      let query = supabase
        .from('companies_public_info')
        .select('*');

      if (slug) {
        query = query.eq('company_slug', slug);
      } else if (tenantId) {
        query = query.eq('id', tenantId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data as unknown as CompanyData | null;
    },
    enabled: !!(slug || tenantId),
    staleTime: 10000, // 10s - Kurzes Caching für schnelle Updates
    refetchOnWindowFocus: true, // Auto-Refresh beim Tab-Wechsel
  });
}
