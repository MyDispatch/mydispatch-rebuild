/**
 * HYPERION PHASE 2: Partners API Module
 */

import { TypedSupabaseClient, handleApiError } from "./client";
import { Tables } from "@/integrations/supabase/types";

export type Partner = Tables<"partners">;

export interface PartnerFilters {
  archived?: boolean;
  search?: string;
}

export interface PartnersApi {
  list: (filters?: PartnerFilters) => Promise<Partner[]>;
  getById: (id: string) => Promise<Partner>;
  create: (
    data: Omit<Partial<Partner>, "id" | "created_at" | "updated_at"> & {
      company_id: string;
      name: string;
    }
  ) => Promise<Partner>;
  update: (id: string, data: Partial<Partner>) => Promise<Partner>;
  archive: (id: string) => Promise<void>;
}

export function createPartnersApi(supabase: TypedSupabaseClient): PartnersApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase
          .from("partners")
          .select("*")
          .eq("archived", filters.archived ?? false)
          .order("name");

        if (filters.search) {
          query = query.ilike("name", `%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) handleApiError(error, "partners.list");
        return data || [];
      } catch (error) {
        handleApiError(error, "partners.list");
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase.from("partners").select("*").eq("id", id).single();

        if (error) handleApiError(error, "partners.getById");
        return data!;
      } catch (error) {
        handleApiError(error, "partners.getById");
      }
    },

    async create(input) {
      try {
        const { data, error } = await supabase.from("partners").insert([input]).select().single();

        if (error) handleApiError(error, "partners.create");
        return data!;
      } catch (error) {
        handleApiError(error, "partners.create");
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from("partners")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) handleApiError(error, "partners.update");
        return data!;
      } catch (error) {
        handleApiError(error, "partners.update");
      }
    },

    async archive(id) {
      try {
        const { error } = await supabase
          .from("partners")
          .update({ archived: true, archived_at: new Date().toISOString() })
          .eq("id", id);

        if (error) handleApiError(error, "partners.archive");
      } catch (error) {
        handleApiError(error, "partners.archive");
      }
    },
  };
}
