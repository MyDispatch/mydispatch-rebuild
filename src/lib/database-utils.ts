/* ==================================================================================
   DATABASE UTILITIES V18.5.0 - MULTI-TENANT DATA ISOLATION
   ==================================================================================
   Production-Ready Utilities für sichere DB-Operationen
   
   Features:
   - Automatische company_id Filter (ZWINGEND!)
   - Soft-Delete statt Hard-Delete
   - Type-Safe Query Builder
   - Error-Handling & Logging
   - Performance Monitoring mit Datadoc
   
   ABSOLUTE REGEL: Jede DB-Query MUSS company_id Filter haben!
   ================================================================================== */

import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./error-handler";
import { datadoc } from "./datadoc-client";

/**
 * FEHLER-002 LÖSUNG: Automatischer company_id Filter
 * Stellt sicher, dass ALLE Queries company-spezifisch sind
 */
export const withCompanyFilter = <T>(
  query: any,
  companyId: string | null | undefined
) => {
  if (!companyId) {
    throw new Error('company_id is required for data isolation');
  }
  return query.eq('company_id', companyId) as T;
};

/**
 * FEHLER-003 LÖSUNG: Soft Delete statt Hard Delete
 * Markiert Datensätze als gelöscht, behält aber Daten für Wiederherstellung
 */
export const softDelete = async (
  table: any,
  id: string,
  companyId: string
): Promise<{ success: boolean; error?: Error }> => {
  try {
    const { error } = await (supabase as any)
      .from(table)
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('company_id', companyId); // SECURITY: company_id Filter

    if (error) throw error;

    // Success - no logging needed (handleError already logs failures)

    return { success: true };
  } catch (error) {
    const errorMessage = `Failed to soft delete ${table}/${id}`;
    handleError(error as Error, errorMessage);
    return { success: false, error: error as Error };
  }
};

/**
 * Soft-Delete für mehrere Datensätze
 */
export const softDeleteBulk = async (
  table: any,
  ids: string[],
  companyId: string
): Promise<{ success: boolean; count: number; error?: Error }> => {
  try {
    const { error, count } = await (supabase as any)
      .from(table)
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .in('id', ids)
      .eq('company_id', companyId);

    if (error) throw error;

    // Success - no logging needed

    return { success: true, count: count || 0 };
  } catch (error) {
    const errorMessage = `Failed to bulk soft delete from ${table}`;
    handleError(error as Error, errorMessage);
    return { success: false, count: 0, error: error as Error };
  }
};

/**
 * Datensatz wiederherstellen (Soft-Delete rückgängig machen)
 */
export const restore = async (
  table: any,
  id: string,
  companyId: string
): Promise<{ success: boolean; error?: Error }> => {
  try {
    const { error } = await (supabase as any)
      .from(table)
      .update({ 
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw error;

    // Success - no logging needed

    return { success: true };
  } catch (error) {
    const errorMessage = `Failed to restore ${table}/${id}`;
    handleError(error as Error, errorMessage);
    return { success: false, error: error as Error };
  }
};

/**
 * Type-Safe Query Builder mit automatischem company_id Filter
 */
export class CompanyQuery<T> {
  private query: any;
  private table: any;
  private companyId: string;

  constructor(table: any, companyId: string) {
    if (!companyId) {
      throw new Error('company_id is required');
    }
    this.table = table;
    this.companyId = companyId;
    this.query = (supabase as any)
      .from(table)
      .select('*')
      .eq('company_id', companyId)
      .is('deleted_at', null); // Exclude soft-deleted records
  }

  select(columns: string) {
    this.query = (supabase as any)
      .from(this.table)
      .select(columns)
      .eq('company_id', this.companyId)
      .is('deleted_at', null);
    return this;
  }

  eq(column: string, value: any) {
    this.query = this.query.eq(column, value);
    return this;
  }

  neq(column: string, value: any) {
    this.query = this.query.neq(column, value);
    return this;
  }

  in(column: string, values: unknown[]) {
    this.query = this.query.in(column, values);
    return this;
  }

  order(column: string, ascending: boolean = true) {
    this.query = this.query.order(column, { ascending });
    return this;
  }

  limit(count: number) {
    this.query = this.query.limit(count);
    return this;
  }

  async single() {
    try {
      const { data, error } = await this.query.maybeSingle();
      if (error) throw error;
      return { data: data as T | null, error: null };
    } catch (error) {
      handleError(error as Error, `Query failed on ${this.table}`);
      return { data: null, error: error as Error };
    }
  }

  async execute() {
    try {
      const { data, error } = await this.query;
      if (error) throw error;
      return { data: (data || []) as T[], error: null };
    } catch (error) {
      handleError(error as Error, `Query failed on ${this.table}`);
      return { data: [], error: error as Error };
    }
  }
}

/**
 * Helper: Query Builder erstellen
 */
export const createCompanyQuery = <T>(table: any, companyId: string) => {
  return new CompanyQuery<T>(table, companyId);
};

/**
 * Helper: Prüfen ob Datensatz existiert
 */
export const exists = async (
  table: any,
  id: string,
  companyId: string
): Promise<boolean> => {
  try {
    const { data } = await (supabase as any)
      .from(table)
      .select('id')
      .eq('id', id)
      .eq('company_id', companyId)
      .is('deleted_at', null)
      .maybeSingle();
    
    return !!data;
  } catch {
    return false;
  }
};

/**
 * Helper: Zähle Datensätze
 */
export const count = async (
  table: any,
  companyId: string,
  filters?: Record<string, unknown>
): Promise<number> => {
  try {
    let query = (supabase as any)
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .is('deleted_at', null);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { count: resultCount } = await query;
    return resultCount || 0;
  } catch {
    return 0;
  }
};
