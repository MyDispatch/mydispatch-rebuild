import { test, expect } from '@playwright/test';

test.describe('Performance - Load Times', () => {
  const pages = [
    { url: '/', name: 'Home', maxLoadTime: 3000 },
    { url: '/dashboard', name: 'Dashboard', maxLoadTime: 3000 },
    { url: '/auftraege', name: 'Aufträge', maxLoadTime: 3000 },
    { url: '/fahrer', name: 'Fahrer', maxLoadTime: 3000 }
  ];

  for (const page of pages) {
    test(`should load ${page.name} in under ${page.maxLoadTime}ms`, async ({ page: browserPage }) => {
      const startTime = Date.now();
      
      await browserPage.goto(page.url);
      await browserPage.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      console.log(`[${page.name}] Load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(page.maxLoadTime);
    });

    test(`should have no console errors on ${page.name}`, async ({ page: browserPage }) => {
      const errors: string[] = [];
      
      browserPage.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await browserPage.goto(page.url);
      await browserPage.waitForLoadState('networkidle');
      
      // Filter irrelevante Errors (z.B. HERE Maps Tile-Errors)
      const relevantErrors = errors.filter(err => 
        !err.includes('tile load error') && 
        !err.includes('Tangram') &&
        !err.includes('favicon')
      );
      
      expect(relevantErrors.length).toBe(0);
    });

    test(`should have good Lighthouse score on ${page.name}`, async ({ page: browserPage }) => {
      await browserPage.goto(page.url);
      await browserPage.waitForLoadState('networkidle');
      
      // Core Web Vitals prüfen (via Performance API)
      const metrics = await browserPage.evaluate(() => {
        const perfEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: perfEntries.domContentLoadedEventEnd - perfEntries.domContentLoadedEventStart,
          loadComplete: perfEntries.loadEventEnd - perfEntries.loadEventStart,
          ttfb: perfEntries.responseStart - perfEntries.requestStart
        };
      });
      
      console.log(`[${page.name}] Metrics:`, metrics);
      
      // Time to First Byte < 800ms
      expect(metrics.ttfb).toBeLessThan(800);
      
      // DOM Content Loaded < 1500ms
      expect(metrics.domContentLoaded).toBeLessThan(1500);
    });
  }
});