/* ==================================================================================
   DIRECT MIGRATIONS DEPLOYMENT
   ==================================================================================
   Führt Migrations direkt via Supabase Client aus (stabiler als CLI)
   ================================================================================== */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Supabase Client Setup
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🚀 DIRECT MIGRATIONS DEPLOYMENT GESTARTET...\n');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Service Key:', supabaseKey ? '✅ Vorhanden' : '❌ FEHLT');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ FEHLER: Supabase-Credentials fehlen in .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Migrations-Dateien
const migrations = [
  '20250131000000_nexify_ai_master_database.sql',
  '20250131_system_health_tables.sql',
  '20250131_storage_letterheads.sql',
  '20250131_cron_jobs.sql',
];

async function executeMigration(filename) {
  const filepath = path.join(__dirname, '..', 'supabase', 'migrations', filename);

  console.log(`\n📋 Führe aus: ${filename}`);

  if (!fs.existsSync(filepath)) {
    console.log(`   ⚠️  Datei nicht gefunden: ${filename}`);
    return false;
  }

  const sql = fs.readFileSync(filepath, 'utf8');

  try {
    // SQL direkt ausführen über rpc
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.log(`   ❌ Fehler: ${error.message}`);
      return false;
    }

    console.log(`   ✅ Erfolgreich ausgeführt`);
    return true;
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('\n📦 Deploye Migrations...\n');

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    const success = await executeMigration(migration);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n========================================');
  console.log(`✅ Erfolgreich: ${successCount}`);
  console.log(`❌ Fehlgeschlagen: ${failCount}`);
  console.log('========================================\n');

  if (failCount > 0) {
    console.log('⚠️  Einige Migrations sind fehlgeschlagen.');
    console.log('💡 Versuche manuelles Deployment via Supabase Dashboard.\n');
  } else {
    console.log('🎉 ALLE MIGRATIONS ERFOLGREICH DEPLOYED!\n');
  }
}

main().catch(err => {
  console.error('\n❌ KRITISCHER FEHLER:', err);
  process.exit(1);
});
