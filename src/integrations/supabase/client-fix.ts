/**
 * SUPABASE CLIENT - FIX VERSION
 * Dieser Fix stellt sicher, dass alle erforderlichen Umgebungsvariablen vorhanden sind
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment Variables für Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validierung mit aussagekräftiger Fehlermeldung
if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL ist nicht definiert. Bitte füge sie in .env.local hinzu.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY ist nicht definiert. Bitte füge sie in .env.local hinzu.'
  );
}

// Supabase Client erstellen
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

