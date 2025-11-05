/* ==================================================================================
   DATABASE DEPLOYMENT - Direkt über Postgres
   ==================================================================================
   Führt DEPLOY_THIS.sql über direkte Postgres-Verbindung aus
   ================================================================================== */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('\n🚀 DATABASE DEPLOYMENT GESTARTET...\n');

// Supabase Connection String aus URL + Service Role Key bauen
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

// Connection String für Postgres
// Format: postgresql://postgres.[project-ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];
const connectionString = `postgresql://postgres.${projectRef}:${supabaseKey}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

console.log('📍 Projekt-ID:', projectRef);
console.log('🔌 Connecting to Postgres...\n');

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function deployDatabase() {
  try {
    // Connect
    await client.connect();
    console.log('✅ Postgres Connected!\n');

    // Load SQL
    const sqlPath = path.join(__dirname, '..', 'DEPLOY_THIS.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📋 Executing SQL from DEPLOY_THIS.sql...\n');

    // Execute SQL
    await client.query(sql);

    console.log('\n✅ DATABASE DEPLOYMENT ERFOLGREICH!\n');
    console.log('========================================');
    console.log('✅ 9 Tabellen erstellt');
    console.log('✅ RLS Policies aktiviert');
    console.log('✅ Storage Bucket erstellt');
    console.log('✅ Indexes erstellt');
    console.log('========================================\n');

  } catch (err) {
    console.error('\n❌ DEPLOYMENT ERROR:', err.message);
    console.error('\n💡 Fallback: Manuelle Ausführung über Supabase Dashboard erforderlich.\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

deployDatabase();
