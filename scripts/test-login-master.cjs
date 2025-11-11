#!/usr/bin/env node
/**
 * Quick login test for seeded master users using anon key.
 * - Signs in with email/password
 * - Fetches profile and roles
 */

const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');
const https = require('https');

config({ path: '.env.local' });
config({ path: '.env' });

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const ANON_KEY = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const SR_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN || '').trim();

if (!SUPABASE_URL || (!ANON_KEY && !SR_KEY)) {
  console.error('❌ Missing required env: SUPABASE_URL and at least one key (VITE_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

// Prefer anon key; fallback to service role if anon fails validation
let activeKey = ANON_KEY || SR_KEY;
let keyType = ANON_KEY ? 'anon' : 'service_role';
let supabase = createClient(SUPABASE_URL, activeKey, { auth: { persistSession: false } });

const TEST_USER = { email: 'courbois1981@gmail.com', password: '1def!xO2022!!' };

async function validateKey(url, key) {
  return new Promise((resolve) => {
    const req = https.request(new URL(`${url}/auth/v1/settings`), {
      method: 'GET',
      headers: { apikey: key },
    }, (res) => {
      resolve(res.statusCode && res.statusCode >= 200 && res.statusCode < 300);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function main() {
  const safeAnon = ANON_KEY ? ANON_KEY.slice(0, 12) + '...' : '<none>';
  const safeSr = SR_KEY ? SR_KEY.slice(0, 12) + '...' : '<none>';
  console.log('ℹ️ Using URL:', SUPABASE_URL);
  console.log('ℹ️ Anon key (prefix):', safeAnon);
  console.log('ℹ️ Service role key (prefix):', safeSr);

  // Validate anon key first; if invalid, fallback to service role
  if (ANON_KEY) {
    const anonValid = await validateKey(SUPABASE_URL, ANON_KEY);
    console.log('🔎 Anon key valid:', anonValid ? 'Yes' : 'No');
    if (!anonValid && SR_KEY) {
      console.log('↪️ Falling back to service role key for test');
      activeKey = SR_KEY;
      keyType = 'service_role';
      supabase = createClient(SUPABASE_URL, activeKey, { auth: { persistSession: false } });
    }
  } else if (SR_KEY) {
    const srValid = await validateKey(SUPABASE_URL, SR_KEY);
    console.log('🔎 Service role key valid:', srValid ? 'Yes' : 'No');
  }

  console.log('🔐 Testing login for', TEST_USER.email, `(key: ${keyType})`);
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword(TEST_USER);
  if (authErr) {
    console.error('❌ Login failed:', authErr.message);
    process.exit(1);
  }
  console.log('✅ Login OK, user id:', auth.user.id);

  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name, company_id')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (profErr) {
    console.error('❌ Profile fetch error:', profErr.message);
    process.exit(1);
  }
  console.log('📇 Profile:', profile || 'not found');

  const { data: roles, error: roleErr } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', auth.user.id);
  if (roleErr) {
    console.error('❌ Roles fetch error:', roleErr.message);
    process.exit(1);
  }
  console.log('🛡️ Roles:', roles.map(r => r.role));

  const isAdmin = roles.some(r => r.role === 'admin');
  if (!isAdmin) {
    console.error('⚠️ Admin role missing.');
    process.exit(2);
  }
  console.log('🎉 Login test successful with admin role.');
}

main().catch((e) => {
  console.error('❌ Unexpected error:', e.message);
  process.exit(1);
});
