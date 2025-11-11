#!/usr/bin/env node
/**
 * Rollback Script: Remove seeded master users from Supabase auth
 * CAUTION: This permanently deletes users and related data via CASCADE.
 */

const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');

config({ path: '.env.local' });
config({ path: '.env' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const USERS = [
  'courbois1981@gmail.com',
  'pascal@nexify.ai',
  'master@nexify.ai',
];

async function main() {
  console.log('🧯 Rollback: Deleting master users...');
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('❌ Could not list users:', listErr.message);
    process.exit(1);
  }

  for (const email of USERS) {
    const user = list.users.find((u) => u.email === email);
    if (!user) {
      console.log(`ℹ️ User not found: ${email}`);
      continue;
    }
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      console.error(`❌ Delete failed (${email}):`, error.message);
      process.exit(1);
    }
    console.log(`✅ Deleted user ${email}`);
  }

  console.log('🎉 Rollback completed.');
}

main().catch((e) => {
  console.error('❌ Unexpected error:', e.message);
  process.exit(1);
});

