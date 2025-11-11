#!/usr/bin/env node
/**
 * Seed Master Users into Supabase using the Service Role Key.
 * - Creates or updates three master users
 * - Upserts corresponding entries in public.profiles and public.user_roles
 * - Marks email as confirmed for reliable login
 */

const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');

// Load environment variables from local files
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
  { email: 'courbois1981@gmail.com', password: '1def!xO2022!!', name: 'Pascal Courbois' },
  { email: 'pascal@nexify.ai', password: '1def!xO2022!!', name: 'Pascal Nexify' },
  { email: 'master@nexify.ai', password: '1def!xO2022!!', name: 'Master Admin' },
];

function splitName(fullName) {
  if (!fullName) return { first: null, last: null };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: null };
  return { first: parts.slice(0, -1).join(' '), last: parts.slice(-1)[0] };
}

async function ensureUser(u) {
  // Check if user exists
  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list?.users?.find((usr) => usr.email === u.email);
  const { first, last } = splitName(u.name);

  if (!existing) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { first_name: first, last_name: last, company_name: 'Nexify Test GmbH' },
    });
    if (error) throw new Error(`Create user failed (${u.email}): ${error.message}`);
    console.log(`✅ Created user ${u.email}`);
    return data.user;
  } else {
    // Update password and confirm email
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: u.password,
      email_confirm: true,
      user_metadata: { first_name: first, last_name: last, company_name: 'Nexify Test GmbH' },
    });
    if (error) throw new Error(`Update user failed (${u.email}): ${error.message}`);
    console.log(`♻️ Updated user ${u.email}`);
    return data.user;
  }
}

async function upsertProfile(user) {
  const first = user.user_metadata?.first_name || null;
  const last = user.user_metadata?.last_name || null;
  const { error } = await supabase.from('profiles').upsert({
    user_id: user.id,
    first_name: first,
    last_name: last,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw new Error(`Upsert profile failed (${user.email}): ${error.message}`);
  console.log(`✅ Profile upserted for ${user.email}`);
}

async function upsertUserRole(user) {
  const { error } = await supabase.from('user_roles').upsert({
    user_id: user.id,
    role: 'admin',
  }, { onConflict: 'user_id,role' });
  if (error) throw new Error(`Upsert role failed (${user.email}): ${error.message}`);
  console.log(`✅ Role upserted for ${user.email}`);
}

async function main() {
  console.log('🔧 Seeding master users into Supabase...');
  for (const u of USERS) {
    const user = await ensureUser(u);
    await upsertProfile(user);
    await upsertUserRole(user);
  }
  console.log('🎉 Master users seeded successfully.');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
