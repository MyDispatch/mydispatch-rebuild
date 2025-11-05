/* ==================================================================================
   BRAIN-SYNC - Gedächtnis-Synchronisation
   ==================================================================================
   Synchronisiert lokales Gedächtnis mit Supabase Database
   ================================================================================== */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🧠 NeXify AI MASTER - Brain Sync Started...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncMemory() {
  try {
    // 1. Lade aktuelle Learnings aus Database
    const { data: learnings, error } = await supabase
      .from('ai_learning_patterns')
      .select('*')
      .order('learned_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('❌ Fehler beim Laden:', error.message);
      return;
    }

    // 2. Speichere lokal als Cache
    const memoryPath = path.join(__dirname, '..', '..', '.nexify', 'memory', 'brain-cache.json');
    const memoryData = {
      last_sync: new Date().toISOString(),
      learnings: learnings || [],
      total_learnings: learnings?.length || 0
    };

    fs.writeFileSync(memoryPath, JSON.stringify(memoryData, null, 2));

    console.log(`✅ Brain Sync erfolgreich!`);
    console.log(`   Learnings: ${learnings?.length || 0}`);
    console.log(`   Cache: ${memoryPath}\n`);

    return memoryData;
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
}

syncMemory();
