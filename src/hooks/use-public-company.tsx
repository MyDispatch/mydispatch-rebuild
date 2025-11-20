/* ==================================================================================
   USE-PUBLIC-COMPANY HOOK - React Query für öffentliche Landingpage-Daten
   ==================================================================================
   - Lädt Company-Daten über public RLS Policy
   - Smart Caching mit Auto-Refresh
   - Für nicht-authentifizierte Nutzer
   ================================================================================== */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePublicCompany(slug?: string, tenantId?: string) {
  return useQuery({
    queryKey: ["public-company", slug, tenantId],
    queryFn: async () => {
      if (!slug && !tenantId) return null;

      // 🔒 SECURITY: Use companies_public_info view (ONLY safe fields exposed)
      let query = supabase.from("companies_public_info").select("*");

      if (slug) {
        query = query.eq("company_slug", slug);
      } else if (tenantId) {
        query = query.eq("id", tenantId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!(slug || tenantId),
    staleTime: 10000, // 10s - Kurzes Caching für schnelle Updates
    refetchOnWindowFocus: true, // Auto-Refresh beim Tab-Wechsel
  });
}
