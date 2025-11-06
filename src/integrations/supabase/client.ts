/**
 * Supabase Client Configuration
 *
 * Diese Datei initialisiert den Supabase-Client mit korrekter Validierung
 * der Environment-Variablen für Vite.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment Variables für Vite (müssen mit VITE_ beginnen)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validierung mit aussagekräftigen Fehlermeldungen
if (!supabaseUrl) {
  const errorMessage = `
    VITE_SUPABASE_URL ist nicht definiert!

    Bitte füge folgende Zeile in deine .env.local Datei ein:
    VITE_SUPABASE_URL=https://your-project.supabase.co

    Die Datei sollte sich im Projektroot befinden: .env.local
  `;
  console.error(errorMessage);
  throw new Error('VITE_SUPABASE_URL ist nicht definiert');
}

if (!supabaseAnonKey) {
  const errorMessage = `
    VITE_SUPABASE_ANON_KEY ist nicht definiert!

    Bitte füge folgende Zeile in deine .env.local Datei ein:
    VITE_SUPABASE_ANON_KEY=your-anon-key-here

    Die Datei sollte sich im Projektroot befinden: .env.local
  `;
  console.error(errorMessage);
  throw new Error('VITE_SUPABASE_ANON_KEY ist nicht definiert');
}

// Supabase Client erstellen mit korrekten Parametern
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
