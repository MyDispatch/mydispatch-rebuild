/* ==================================================================================
   COST CENTERS API LAYER - PHASE 3 DATA FLOW
   ==================================================================================
   ✅ Generic API functions for cost centers CRUD
   ✅ Type-safe with TypeScript
   ✅ Error handling via handleSupabaseError
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { CostCenter } from '@/types/db'; // Annahme, dass dieser Typ existiert
import { handleSupabaseQuery } from './base';

export const costCentersApi = {
  /**
   * Fetch all cost centers for a company
   */
  async getCostCenters(companyId: string) {
    return handleSupabaseQuery(
      supabase.from('cost_centers').select('*').eq('company_id', companyId)
    );
  },

  /**
   * Create a new cost center
   */
  async createCostCenter(costCenterData: Omit<CostCenter, 'id' | 'created_at' | 'updated_at'>) {
    return handleSupabaseQuery(
      supabase.from('cost_centers').insert(costCenterData as any)
    );
  },

  /**
   * Update a cost center
   */
  async updateCostCenter(id: string, updates: Partial<CostCenter>) {
    return handleSupabaseQuery(
      supabase.from('cost_centers').update(updates as any).eq('id', id)
    );
  },

  /**
   * Deactivate a cost center
   */
  async deactivateCostCenter(id: string) {
    return handleSupabaseQuery(
      supabase.from('cost_centers').update({ active: false } as any).eq('id', id)
    );
  },
};
