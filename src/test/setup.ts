/**
 * Vitest Setup File
 *
 * Wird vor allen Tests ausgeführt.
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup nach jedem Test
afterEach(() => {
  cleanup();
});

// Mock für import.meta.env
globalThis.importMeta = {
  env: {
    VITE_SUPABASE_URL: 'https://test-project.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    DEV: true,
    PROD: false,
    MODE: 'test',
  },
} as unknown as ImportMeta;
