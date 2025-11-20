/**
 * HYPERION PHASE 2: Invoices API Module
 */

import { TypedSupabaseClient, handleApiError } from "./client";
import { Tables, Enums } from "@/integrations/supabase/types";

export type Invoice = Tables<"invoices">;

export interface InvoiceFilters {
  status?: string;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface CreateInvoiceInput {
  company_id: string;
  customer_id: string;
  invoice_date: string;
  invoice_number: string;
  payment_terms: number;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
}

export interface InvoicesApi {
  list: (filters?: InvoiceFilters) => Promise<Invoice[]>;
  getById: (id: string) => Promise<Invoice>;
  create: (data: CreateInvoiceInput) => Promise<Invoice>;
  update: (id: string, data: Partial<Invoice>) => Promise<Invoice>;
  delete: (id: string) => Promise<void>;
}

export function createInvoicesApi(supabase: TypedSupabaseClient): InvoicesApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase
          .from("invoices")
          .select("*")
          .order("invoice_date", { ascending: false });

        if (filters.status) {
          query = query.eq("status", filters.status);
        }
        if (filters.customer_id) {
          query = query.eq("customer_id", filters.customer_id);
        }
        if (filters.date_from) {
          query = query.gte("invoice_date", filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte("invoice_date", filters.date_to);
        }

        const { data, error } = await query;
        if (error) handleApiError(error, "invoices.list");
        return data || [];
      } catch (error) {
        handleApiError(error, "invoices.list");
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase.from("invoices").select("*").eq("id", id).single();

        if (error) handleApiError(error, "invoices.getById");
        return data!;
      } catch (error) {
        handleApiError(error, "invoices.getById");
      }
    },

    async create(input) {
      try {
        const { data, error } = await supabase.from("invoices").insert([input]).select().single();

        if (error) handleApiError(error, "invoices.create");
        return data!;
      } catch (error) {
        handleApiError(error, "invoices.create");
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from("invoices")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) handleApiError(error, "invoices.update");
        return data!;
      } catch (error) {
        handleApiError(error, "invoices.update");
      }
    },

    async delete(id) {
      try {
        const { error } = await supabase.from("invoices").delete().eq("id", id);

        if (error) handleApiError(error, "invoices.delete");
      } catch (error) {
        handleApiError(error, "invoices.delete");
      }
    },
  };
}
