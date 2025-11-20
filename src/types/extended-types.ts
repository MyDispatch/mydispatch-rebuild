/* ==================================================================================
   EXTENDED TYPES V40.7 - TYPE-SAFETY LAYER
   ==================================================================================
   Erweiterte Typen für bessere Type-Safety ohne Supabase-Types zu modifizieren
   ================================================================================== */

import type { Database } from '@/integrations/supabase/types';

export type DBCompany = Database['public']['Tables']['companies']['Row'];
export type DBProfile = Database['public']['Tables']['profiles']['Row'];

/**
 * Extended Company Type mit typed Json-Properties
 * WICHTIG: `tarif` wird aus `account_type` gemappt
 */
export type ExtendedCompany = Omit<DBCompany, 'payment_methods' | 'business_hours'> & {
  tarif?: 'starter' | 'business' | 'enterprise';
  payment_methods?: string[];
  business_hours?: Record<string, string>;
};

/**
 * Extended Profile Type mit zusätzlichen Runtime-Properties
 */
export type ExtendedProfile = DBProfile & {
  email?: string;
  company?: ExtendedCompany | null;
  companies?: ExtendedCompany | null;
  user_roles?: Array<{ role: string }>;
};

/**
 * Helper: Parse Json zu Array
 */
export function parseJsonArray<T = string>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Helper: Parse Json zu Object
 */
export function parseJsonObject<T = Record<string, unknown>>(json: unknown): T | null {
  if (typeof json === 'object' && json !== null) return json as T;
  if (typeof json === 'string') {
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Helper: Map account_type zu tarif
 */
function mapAccountTypeToTarif(accountType: string | null): 'starter' | 'business' | 'enterprise' | undefined {
  if (!accountType) return undefined;
  
  const type = accountType.toLowerCase();
  if (type === 'starter') return 'starter';
  if (type === 'business' || type === 'premium') return 'business';
  if (type === 'enterprise') return 'enterprise';
  
  return undefined;
}

/**
 * Helper: Cast DBCompany to ExtendedCompany
 */
export function toExtendedCompany(company: DBCompany | null): ExtendedCompany | null {
  if (!company) return null;
  
  return {
    ...company,
    tarif: mapAccountTypeToTarif(company.account_type),
    payment_methods: parseJsonArray<string>(company.payment_methods),
    business_hours: parseJsonObject<Record<string, string>>(company.business_hours) || undefined,
  };
}
