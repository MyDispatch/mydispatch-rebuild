/**
 * RLS Policy Coverage Checker
 * Verifies that all public tables have RLS enabled
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLSCoverage() {
  console.log('🛡️ Checking RLS Policy Coverage...\n');

  try {
    // Get all tables in public schema
    const { data: tables, error } = await supabase.rpc('get_tables_without_rls');

    if (error) {
      console.error('❌ Error checking RLS:', error.message);
      process.exit(1);
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
    process.exit(1);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

checkRLSCoverage();
