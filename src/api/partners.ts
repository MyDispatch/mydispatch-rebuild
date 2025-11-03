/* ==================================================================================
   PARTNERS API LAYER - PHASE 3 DATA FLOW
   ==================================================================================
   ✅ Generic API functions for partners CRUD
   ✅ Type-safe with TypeScript
   ✅ Error handling via handleSupabaseError
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from './base';

export interface Partner {
  id?: string;
  company_id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  provision_amount: number;
  online_access_enabled: boolean;
  created_at?: string;
  updated_at?: string;
  archived?: boolean;
}

export const partnersAPI = {
  async getAll(companyId: string): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('company_id', companyId)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  },

  async getById(id: string, companyId: string): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },

  async create(partner: Omit<Partner, 'id'>, companyId: string): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .insert({
        ...partner,
        company_id: companyId,
      })
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },

  async update(id: string, updates: Partial<Partner>, companyId: string): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },

  async archive(id: string, companyId: string): Promise<void> {
    const { error } = await supabase
      .from('partners')
      .update({ archived: true })
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw handleSupabaseError(error);
  },
};
