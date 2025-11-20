/* ==================================================================================
   DRIVERS API MODULE - HYPERION PHASE 2
   ==================================================================================
   ✅ Zentrale Abstraktion für Fahrer-Operationen
   ✅ Type-safe mit Supabase-Schema
   ✅ Konsistentes Error-Handling
   ================================================================================== */

import { TypedSupabaseClient, handleApiError } from "./client";
import { Tables } from "@/integrations/supabase/types";

export type Driver = Tables<"drivers">;
export type DriverInsert = Omit<Driver, "id" | "created_at" | "updated_at">;
export type DriverUpdate = Partial<DriverInsert>;

export interface DriverFilters {
  shift_status?: string;
  archived?: boolean;
}

export interface DriversApi {
  list: (filters?: DriverFilters) => Promise<Driver[]>;
  getById: (id: string) => Promise<Driver>;
  create: (data: DriverInsert) => Promise<Driver>;
  update: (id: string, data: DriverUpdate) => Promise<Driver>;
  archive: (id: string) => Promise<void>;
}

export function createDriversApi(supabase: TypedSupabaseClient): DriversApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase
          .from("drivers")
          .select("*")
          .eq("archived", filters.archived ?? false)
          .order("created_at", { ascending: false });

        if (filters.shift_status) {
          query = query.eq("shift_status", filters.shift_status as any);
        }

        const { data, error } = await query;
        if (error) handleApiError(error, "drivers.list");
        return data || [];
      } catch (error) {
        handleApiError(error, "drivers.list");
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase.from("drivers").select("*").eq("id", id).single();

        if (error) handleApiError(error, "drivers.getById");
        return data!;
      } catch (error) {
        handleApiError(error, "drivers.getById");
      }
    },

    async create(input) {
      try {
        const { data, error } = await supabase.from("drivers").insert([input]).select().single();

        if (error) handleApiError(error, "drivers.create");
        return data!;
      } catch (error) {
        handleApiError(error, "drivers.create");
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from("drivers")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) handleApiError(error, "drivers.update");
        return data!;
      } catch (error) {
        handleApiError(error, "drivers.update");
      }
    },

    async archive(id) {
      try {
        const { error } = await supabase.from("drivers").update({ archived: true }).eq("id", id);

        if (error) handleApiError(error, "drivers.archive");
      } catch (error) {
        handleApiError(error, "drivers.archive");
      }
    },
  };
}
