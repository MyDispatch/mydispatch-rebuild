// Simple env check for Supabase configuration
const fs = require('fs');

function readEnvLocal() {
  try {
    const content = fs.readFileSync('.env.local', 'utf-8');
    return content;
  } catch {
    return null;
  }
}

function main() {
  const env = readEnvLocal();
  const ref = process.env.VITE_SUPABASE_URL || '';
  const anon = process.env.VITE_SUPABASE_ANON_KEY || '';
  const publishable = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

  console.log('VITE_SUPABASE_URL:', ref || '(env var not set)');
  console.log('VITE_SUPABASE_ANON_KEY:', anon ? '(set)' : '(not set)');
  console.log('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY:', publishable ? '(set)' : '(not set)');
  if (!env) {
    console.warn('No .env.local found. Please create one based on .env.local.example');
  } else {
    const hasUrl = /VITE_SUPABASE_URL\s*=/.test(env);
    const hasAnon = /VITE_SUPABASE_ANON_KEY\s*=/.test(env);
    const hasPublishable = /VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY\s*=/.test(env);
    console.log('.env.local contains URL:', hasUrl, 'ANON:', hasAnon, 'PUBLISHABLE_DEFAULT:', hasPublishable);
  }
}

main();
