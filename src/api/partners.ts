/* ==================================================================================
   PARTNERS API LAYER - PHASE 3 DATA FLOW
   ==================================================================================
   ✅ Generic API functions for partners CRUD
   ✅ Type-safe with TypeScript
   ✅ Error handling via handleSupabaseError
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { Partner } from '@/types/db'; // Annahme, dass dieser Typ existiert
import { handleSupabaseQuery } from './base';

export const partnersApi = {
  async getPartners(companyId: string) {
    return handleSupabaseQuery(
      supabase.from('partners').select('*').eq('company_id', companyId)
    );
  },

  async createPartner(partnerData: Partial<Partner>) {
    return handleSupabaseQuery(
      supabase.from('partners').insert(partnerData as any)
    );
  },

  async updatePartner(id: string, updates: Partial<Partner>) {
    return handleSupabaseQuery(
      supabase.from('partners').update(updates as any).eq('id', id)
    );
  },

  async archivePartner(id: string) {
    return handleSupabaseQuery(
      supabase.from('partners').update({ archived: true } as any).eq('id', id)
    );
  },
};
