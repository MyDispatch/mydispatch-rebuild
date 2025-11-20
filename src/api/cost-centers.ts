/* ==================================================================================
   COST CENTERS API LAYER - PHASE 3 DATA FLOW
   ==================================================================================
   ✅ Generic API functions for cost centers CRUD
   ✅ Type-safe with TypeScript
   ✅ Error handling via handleSupabaseError
   ================================================================================== */

import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "./base";

export interface CostCenter {
  id?: string;
  company_id?: string;
  name: string;
  description?: string | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export const costCentersAPI = {
  async getAll(companyId: string): Promise<CostCenter[]> {
    const { data, error } = await supabase
      .from("cost_centers")
      .select("*")
      .eq("company_id", companyId)
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) throw handleSupabaseError(error);
    return data || [];
  },

  async getById(id: string, companyId: string): Promise<CostCenter> {
    const { data, error } = await supabase
      .from("cost_centers")
      .select("*")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },

  async create(costCenter: Omit<CostCenter, "id">, companyId: string): Promise<CostCenter> {
    const { data, error } = await supabase
      .from("cost_centers")
      .insert({
        ...costCenter,
        company_id: companyId,
      })
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },

  async update(id: string, updates: Partial<CostCenter>, companyId: string): Promise<CostCenter> {
    const { data, error } = await supabase
      .from("cost_centers")
      .update(updates)
      .eq("id", id)
      .eq("company_id", companyId)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },

  async archive(id: string, companyId: string): Promise<void> {
    const { error } = await supabase
      .from("cost_centers")
      .update({ active: false })
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) throw handleSupabaseError(error);
  },
};
