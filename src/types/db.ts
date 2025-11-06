// Re-export Supabase generated types (vollständige Typdefinitionen)
export type { Database } from '@/integrations/supabase/database.types';

// Type aliases für häufig verwendete Typen
export type Booking = Database['public']['Tables']['bookings']['Row'];

// Hinzufügen des CostCenter-Typs
export interface CostCenter {
  id: string;
  company_id: string;
  name: string;
  description?: string | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Hinzufügen des Invoice-Typs
export interface Invoice {
  id: string;
  company_id: string;
  customer_id: string;
  booking_id?: string | null;
  invoice_number: string;
  invoice_date: string;
  due_date?: string | null;
  status: string;
  total_amount: number;
  [key: string]: any; // Für zusätzliche Flexibilität
}

// Hinzufügen des Partner-Typs
export interface Partner {
  id: string;
  company_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  provision_amount: number;
  online_access_enabled: boolean;
  created_at?: string;
  updated_at?: string;
  archived?: boolean;
}
