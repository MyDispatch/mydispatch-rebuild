/* ==================================================================================
   INVOICES API LAYER - PHASE 3 DATA FLOW
   ==================================================================================
   ✅ Generic API functions for invoices CRUD
   ✅ Type-safe with TypeScript
   ✅ Error handling via handleSupabaseError
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { Invoice } from '@/types/db'; // Annahme, dass dieser Typ existiert
import { handleSupabaseQuery } from './base';

export const invoicesApi = {
  async getInvoices(companyId: string) {
    return handleSupabaseQuery(
      supabase.from('invoices').select('*, customers(*)').eq('company_id', companyId)
    );
  },

  async createInvoice(invoiceData: Partial<Invoice>) {
    return handleSupabaseQuery(
      supabase.from('invoices').insert(invoiceData as any)
    );
  },

  async updateInvoice(id: string, updates: Partial<Invoice>) {
    return handleSupabaseQuery(
      supabase.from('invoices').update(updates as any).eq('id', id)
    );
  },
};
