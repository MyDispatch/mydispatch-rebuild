// Unit-Test Skeleton for nexify-api
// Requires: Vitest or Jest; set env PROJECT_REF and ANON_KEY
// This skeleton is safe to skip when env is missing.

const PROJECT_REF = process.env.PROJECT_REF;
const ANON_KEY = process.env.ANON_KEY;

describe('nexify-api', () => {
  const skip = !PROJECT_REF || !ANON_KEY;
  const base = `https://${PROJECT_REF}.supabase.co/functions/v1/nexify-api`;

  const fetchJson = async (path: string) => {
    const res = await fetch(base + path, {
      headers: {
        apikey: ANON_KEY!,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });
    const json = await res.json();
    return { status: res.status, json };
  };

  (skip ? test.skip : test)('GET /wiki/session-init returns success', async () => {
    const { status, json } = await fetchJson('/wiki/session-init');
    expect(status).toBeLessThan(400);
    expect(json.success).toBe(true);
    expect(json.data?.session_data).toBeDefined();
  });

  (skip ? test.skip : test)('GET /wiki/search returns array', async () => {
    const { status, json } = await fetchJson('/wiki/search?q=test&limit=2');
    expect(status).toBeLessThan(400);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data?.results)).toBe(true);
  });
});

