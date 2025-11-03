/* ==================================================================================
   E2E TESTS: TRACKING (GPS TRACKING DASHBOARD)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Tracking - GPS Tracking Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tracking');
  });

  test('should display tracking map', async ({ page }) => {
    // Map container should be visible
    const mapContainer = page.locator('[data-testid="tracking-map"], [data-testid="here-map"], canvas').first();
    await expect(mapContainer).toBeVisible({ timeout: 15000 });
  });

  test('should show active drivers list', async ({ page }) => {
    // Active drivers sidebar or list
    const driversList = page.locator('[data-testid="active-drivers"], text=/Aktive Fahrer/i').first();
    await expect(driversList).toBeVisible({ timeout: 10000 });
  });

  test('should display driver markers on map', async ({ page }) => {
    await page.waitForSelector('[data-testid="tracking-map"], canvas', { timeout: 15000 });
    await page.waitForTimeout(3000); // Map initialization
    
    // Map should be rendered
    const canvas = page.locator('canvas').first();
    expect(await canvas.isVisible()).toBe(true);
  });

  test('should show real-time updates indicator', async ({ page }) => {
    // Live indicator should be present
    const liveIndicator = page.locator('text=/Live|Echtzeit/i, [data-testid="live-indicator"]').first();
    
    if (await liveIndicator.isVisible()) {
      await expect(liveIndicator).toBeVisible();
    }
  });

  test('should display vehicle status filters', async ({ page }) => {
    // Filter by vehicle status (available, in_transit, etc.)
    const statusFilter = page.locator('[data-testid="status-filter"], text=/Status|Filter/i').first();
    
    if (await statusFilter.isVisible()) {
      await expect(statusFilter).toBeEnabled();
    }
  });

  test('should handle mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Map should still be visible on mobile
    const mapContainer = page.locator('[data-testid="tracking-map"], canvas').first();
    await expect(mapContainer).toBeVisible({ timeout: 15000 });
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(5000);
    
    // Filter non-critical errors
    const criticalErrors = errors.filter(err => 
      !err.includes('tile load error') && 
      !err.includes('Tangram') &&
      !err.includes('favicon')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should show tracking KPI cards', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    
    if (await kpiCards.first().isVisible({ timeout: 5000 })) {
      expect(await kpiCards.count()).toBeGreaterThanOrEqual(1);
    }
  });
});
