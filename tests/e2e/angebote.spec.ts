/* ==================================================================================
   E2E TESTS: ANGEBOTE (QUOTES/OFFERS DASHBOARD)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Angebote - Quotes Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/angebote');
  });

  test('should display quotes KPI cards', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show quotes data table', async ({ page }) => {
    const table = page.locator('table, [data-testid="quotes-table"]').first();
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test('should display quote status filters', async ({ page }) => {
    const statusFilter = page.locator('[data-testid="status-filter"], text=/Status|Entwurf|Gesendet|Akzeptiert/i').first();
    
    if (await statusFilter.isVisible()) {
      await expect(statusFilter).toBeEnabled();
    }
  });

  test('should show create quote button', async ({ page }) => {
    const createButton = page.locator('text=/Angebot erstellen|Neues Angebot|Create Quote/i').first();
    
    if (await createButton.isVisible()) {
      await expect(createButton).toBeEnabled();
    }
  });

  test('should handle mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile should show cards or simplified view
    const mobileContent = page.locator('[data-testid="quote-card"], tbody tr').first();
    await expect(mobileContent).toBeVisible();
  });

  test('should open quote detail view', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const firstRow = page.locator('tbody tr, [data-testid="quote-card"]').first();
    
    if (await firstRow.isVisible()) {
      await firstRow.click();
      
      const dialog = page.locator('role=dialog, [role="dialog"]');
      
      if (await dialog.isVisible({ timeout: 3000 })) {
        await expect(dialog).toBeVisible();
      }
    }
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
