/* ==================================================================================
   INVOICES API LAYER - PHASE 3 DATA FLOW
   ==================================================================================
   ✅ Generic API functions for invoices CRUD
   ✅ Type-safe with TypeScript
   ✅ Error handling via handleSupabaseError
   ================================================================================== */

import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "./base";

export interface Invoice {
  id?: string;
  company_id?: string;
  customer_id: string;
  booking_id?: string | null;
  invoice_number: string;
  invoice_date: string;
  due_date?: string | null;
  status: string;
  subtotal: number;
  tax_amount: number;
  tax_rate: number;
  total_amount: number;
  currency?: string;
  payment_method?: string | null;
  payment_date?: string | null;
  payment_reference?: string | null;
  payment_terms?: number;
  notes?: string | null;
  internal_notes?: string | null;
  pdf_url?: string | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const invoicesAPI = {
  async getAll(companyId: string): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  },

  async getById(id: string, companyId: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },

  async create(invoice: Omit<Invoice, "id">, companyId: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from("invoices")
      .insert({
        ...invoice,
        company_id: companyId,
      })
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },

  async update(id: string, updates: Partial<Invoice>, companyId: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from("invoices")
      .update(updates)
      .eq("id", id)
      .eq("company_id", companyId)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  },
};
