import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Supabase Client', () => {
  beforeEach(() => {
    // Reset modules before each test
    vi.resetModules();
    // Clear environment variables
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
  });

  it('sollte Fehler werfen wenn VITE_SUPABASE_URL fehlt', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-key');

    await expect(async () => {
      await import('./client');
    }).rejects.toThrow('Supabase URL ist nicht konfiguriert');
  });

  it('sollte Fehler werfen wenn VITE_SUPABASE_ANON_KEY fehlt', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

    await expect(async () => {
      await import('./client');
    }).rejects.toThrow('Supabase Anon Key ist nicht konfiguriert');
  });

  it('sollte erfolgreich initialisieren mit gültigen Environment-Variablen', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

    const { supabase } = await import('./client');

    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
    expect(supabase.storage).toBeDefined();
    expect(supabase.functions).toBeDefined();
  });

  it('sollte korrekte Auth-Konfiguration haben', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

    // Mock createClient to inspect config
    const createClientMock = vi.fn((url, key, options) => ({
      auth: {},
      from: vi.fn(),
      storage: {},
      functions: {},
    }));

    vi.doMock('@supabase/supabase-js', () => ({
      createClient: createClientMock
    }));

    await import('./client');

    expect(createClientMock).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        auth: expect.objectContaining({
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        })
      })
    );
  });

  it('sollte aussagekräftige Fehlermeldungen haben', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

    try {
      await import('./client');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('nicht konfiguriert');
      expect(error.message).toContain('Bitte überprüfen Sie Ihre .env.local Datei');
    }
  });
});
