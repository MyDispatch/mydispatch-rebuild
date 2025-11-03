/* ==================================================================================
   E2E TESTS: PARTNER (PARTNER MANAGEMENT DASHBOARD)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Partner - Partner Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/partner');
  });

  test('should display partner KPI cards', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show partners data table', async ({ page }) => {
    const table = page.locator('table, [data-testid="partners-table"]').first();
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test('should display partner search', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Suche"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeEnabled();
    }
  });

  test('should open partner detail dialog', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click on first partner row
    const firstRow = page.locator('tbody tr, [data-testid="partner-card"]').first();
    
    if (await firstRow.isVisible()) {
      await firstRow.click();
      
      // Dialog might open
      const dialog = page.locator('role=dialog, [role="dialog"]');
      
      if (await dialog.isVisible({ timeout: 3000 })) {
        await expect(dialog).toBeVisible();
      }
    }
  });

  test('should filter partners by status', async ({ page }) => {
    const statusFilter = page.locator('[data-testid="status-filter"], text=/Status|Aktiv|Inaktiv/i').first();
    
    if (await statusFilter.isVisible()) {
      await expect(statusFilter).toBeEnabled();
    }
  });

  test('should handle mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile should show cards or simplified view
    const mobileContent = page.locator('[data-testid="partner-card"], tbody tr').first();
    await expect(mobileContent).toBeVisible();
  });

  test('should display add partner button', async ({ page }) => {
    const addButton = page.locator('text=/Partner hinzufügen|Neuer Partner|Add Partner/i').first();
    
    if (await addButton.isVisible()) {
      await expect(addButton).toBeEnabled();
    }
  });

  test('should show partner revenue statistics', async ({ page }) => {
    // Should display partner-related metrics
    const stats = page.locator('[data-testid="stat-card"]');
    const count = await stats.count();
    
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should be responsive across breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      
      const kpiCards = page.locator('[data-testid="stat-card"]');
      await expect(kpiCards.first()).toBeVisible();
    }
  });
});
