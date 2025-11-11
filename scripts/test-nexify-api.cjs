// Lightweight test script to validate nexify-api endpoints
// Usage: node scripts/test-nexify-api.js <PROJECT_REF> <ANON_KEY>

const https = require('https');

const [projectRef, anonKey] = process.argv.slice(2);
if (!projectRef || !anonKey) {
  console.error('Usage: node scripts/test-nexify-api.js <PROJECT_REF> <ANON_KEY>');
  process.exit(1);
}

const base = `https://${projectRef}.supabase.co/functions/v1/nexify-api`;

const get = (path) => new Promise((resolve, reject) => {
  const url = new URL(base + path);
  const req = https.request({
    method: 'GET',
    hostname: url.hostname,
    path: url.pathname + url.search,
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
    },
  }, (res) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf-8');
      resolve({ status: res.statusCode, body: body });
    });
  });
  req.on('error', reject);
  req.end();
});

async function run() {
  const cases = [
    ['/wiki/session-init'],
    ['/wiki/search?q=component&limit=3'],
    ['/components/active'],
    ['/issues/critical'],
    ['/best-practices/top'],
  ];

  for (const c of cases) {
    const { status, body } = await get(c);
    console.log(`GET ${c} -> ${status}`);
    console.log(body.slice(0, 300));
    console.log('---');
  }
}

run().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
