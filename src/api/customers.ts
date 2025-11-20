/* ==================================================================================
   CUSTOMERS API MODULE - HYPERION PHASE 2
   ==================================================================================
   ✅ Zentrale Abstraktion für Kunden-Operationen
   ✅ Type-safe mit Supabase-Schema
   ✅ Konsistentes Error-Handling
   ================================================================================== */

import { TypedSupabaseClient, handleApiError } from "./client";
import { Tables } from "@/integrations/supabase/types";

export type Customer = Tables<"customers">;
export type CustomerInsert = Omit<Customer, "id" | "created_at" | "updated_at">;
export type CustomerUpdate = Partial<CustomerInsert>;

export interface CustomerFilters {
  archived?: boolean;
  has_portal_access?: boolean;
}

export interface CustomersApi {
  list: (filters?: CustomerFilters) => Promise<Customer[]>;
  getById: (id: string) => Promise<Customer>;
  create: (data: CustomerInsert) => Promise<Customer>;
  update: (id: string, data: CustomerUpdate) => Promise<Customer>;
  archive: (id: string) => Promise<void>;
}

export function createCustomersApi(supabase: TypedSupabaseClient): CustomersApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase
          .from("customers")
          .select("*")
          .eq("archived", filters.archived ?? false)
          .order("created_at", { ascending: false });

        if (filters.has_portal_access !== undefined) {
          query = query.eq("has_portal_access", filters.has_portal_access);
        }

        const { data, error } = await query;
        if (error) handleApiError(error, "customers.list");
        return data || [];
      } catch (error) {
        handleApiError(error, "customers.list");
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase.from("customers").select("*").eq("id", id).single();

        if (error) handleApiError(error, "customers.getById");
        return data!;
      } catch (error) {
        handleApiError(error, "customers.getById");
      }
    },

    async create(input) {
      try {
        const { data, error } = await supabase.from("customers").insert([input]).select().single();

        if (error) handleApiError(error, "customers.create");
        return data!;
      } catch (error) {
        handleApiError(error, "customers.create");
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from("customers")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) handleApiError(error, "customers.update");
        return data!;
      } catch (error) {
        handleApiError(error, "customers.update");
      }
    },

    async archive(id) {
      try {
        const { error } = await supabase.from("customers").update({ archived: true }).eq("id", id);

        if (error) handleApiError(error, "customers.archive");
      } catch (error) {
        handleApiError(error, "customers.archive");
      }
    },
  };
}
