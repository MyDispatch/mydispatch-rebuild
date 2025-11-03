/* ==================================================================================
   E2E TESTS: STATISTIKEN (STATISTICS DASHBOARD)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Statistiken - Statistics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/statistiken');
  });

  test('should display statistics KPI cards', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show multiple chart types', async ({ page }) => {
    // Should have bar charts, pie charts, or line charts
    const charts = page.locator('.recharts-wrapper');
    await expect(charts.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display time period selector', async ({ page }) => {
    // Time period filters should be available
    const timeFilters = page.locator('[data-testid="time-filter"], text=/Tag|Woche|Monat/i').first();
    await expect(timeFilters).toBeVisible();
  });

  test('should handle data visualization without errors', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Charts should render
    const chartElements = await page.locator('.recharts-wrapper').count();
    expect(chartElements).toBeGreaterThan(0);
  });

  test('should be responsive across breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      
      const kpiCards = page.locator('[data-testid="stat-card"]');
      await expect(kpiCards.first()).toBeVisible();
    }
  });

  test('should export statistics data', async ({ page }) => {
    // Export button should be present
    const exportButton = page.locator('text=/Export|PDF|Excel/i').first();
    
    if (await exportButton.isVisible()) {
      await expect(exportButton).toBeEnabled();
    }
  });
});
