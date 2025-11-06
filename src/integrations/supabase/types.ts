/**
 * Supabase Types Export
 *
 * Re-exportiert Database Types für einfachere Imports
 * Statt: import { Database } from '@/integrations/supabase/database.types'
 * Jetzt: import { Database } from '@/integrations/supabase/types'
 */

export type { Database, Json } from './database.types';

/**
 * Helper Type für einfacheren Zugriff auf Tables
 * Usage: type Customer = Tables<'customers'>
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

/**
 * Helper Type für einfacheren Zugriff auf Enums
 * Usage: type StatusEnum = Enums<'booking_status'>
 */
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

