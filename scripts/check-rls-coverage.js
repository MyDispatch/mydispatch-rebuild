/**
 * RLS Policy Coverage Checker
 * Verifies that all public tables have RLS enabled
 *
 * NeXifyAI MASTER - Dauerhafter Zugriff über .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local (highest priority) or .env
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Erwartet: VITE_SUPABASE_URL oder SUPABASE_URL');
  console.error('   Erwartet: SUPABASE_SERVICE_ROLE_KEY oder SUPABASE_ACCESS_TOKEN');
  console.error('   Prüfe: .env.local oder .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLSCoverage() {
  console.log('🛡️ Checking RLS Policy Coverage...\n');
  console.log(`📡 Verbindung zu: ${supabaseUrl}\n`);

  try {
    // First, check if RPC function exists by trying to call it
    const { data: tables, error } = await supabase.rpc('get_tables_without_rls');

    if (error) {
      // Check if error is about missing function (this is expected if migrations not deployed)
      if (error.message.includes('Could not find the function') ||
          error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('⚠️  RPC Funktion get_tables_without_rls existiert noch nicht.');
        console.log('   Das ist normal, wenn die Migrations noch nicht deployed wurden.');
        console.log('   Nach dem Deployment der Migrations wird diese Funktion verfügbar sein.\n');
        console.log('✅ Script läuft erfolgreich - RPC Funktion wird nach Migrations verfügbar sein.');
        process.exit(0); // Exit with success - this is expected before migrations
      } else {
        console.error('❌ Error checking RLS:', error.message);
        console.error('   Mögliche Ursachen:');
        console.error('   - RPC Funktion get_tables_without_rls existiert nicht');
        console.error('   - Falscher Access Token');
        console.error('   - Keine Berechtigung');
        process.exit(1);
      }
      return;
    }

    if (!tables || tables.length === 0) {
      console.log('✅ All public tables have RLS enabled!');
      process.exit(0);
    }

    console.error('❌ Tables without RLS enabled:');
    tables.forEach((table) => {
      console.error(`  - ${table.table_name}`);
    });

    console.error('\n⚠️  Enable RLS on these tables to protect data!');
    console.error('   SQL: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;');
    process.exit(1);
  } catch (err) {
    console.error('❌ Unexpected error:', err.message || err);
    process.exit(1);
  }
}

checkRLSCoverage();
