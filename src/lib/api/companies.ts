/**
 * HYPERION PHASE 2: Companies API Module
 */

import { TypedSupabaseClient, handleApiError } from "./client";
import { Tables } from "@/integrations/supabase/types";

export type Company = Tables<"companies">;

export interface CompanyFilters {
  search?: string;
}

export interface CompaniesApi {
  list: (filters?: CompanyFilters) => Promise<Company[]>;
  getById: (id: string) => Promise<Company>;
  update: (id: string, data: Partial<Company>) => Promise<Company>;
}

export function createCompaniesApi(supabase: TypedSupabaseClient): CompaniesApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase.from("companies").select("*").order("name");

        if (filters.search) {
          query = query.ilike("name", `%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) handleApiError(error, "companies.list");
        return data || [];
      } catch (error) {
        handleApiError(error, "companies.list");
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();

        if (error) handleApiError(error, "companies.getById");
        return data!;
      } catch (error) {
        handleApiError(error, "companies.getById");
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from("companies")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) handleApiError(error, "companies.update");
        return data!;
      } catch (error) {
        handleApiError(error, "companies.update");
      }
    },
  };
}
