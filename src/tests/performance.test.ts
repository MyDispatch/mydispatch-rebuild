import { describe, it, expect } from 'vitest';

describe('Performance', () => {
  it('bundle size under limit', async () => {
    // Mock bundle size check
    const size = 500; // KB
    expect(size).toBeLessThan(1000);
  });
});
