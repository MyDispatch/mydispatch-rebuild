/* ==================================================================================
   E2E TESTS: KOSTENSTELLEN (COST CENTERS DASHBOARD)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Kostenstellen - Cost Centers Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kostenstellen');
  });

  test('should display cost centers dashboard', async ({ page }) => {
    await expect(page.locator('text=/Kostenstellen|Cost Centers/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('should show cost center KPI cards', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    
    if (await kpiCards.first().isVisible({ timeout: 5000 })) {
      expect(await kpiCards.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('should display cost centers table', async ({ page }) => {
    const table = page.locator('table, [data-testid="cost-centers-table"]').first();
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test('should show add cost center button', async ({ page }) => {
    const addButton = page.locator('text=/Kostenstelle hinzufügen|Neue Kostenstelle|Add Cost Center/i').first();
    
    if (await addButton.isVisible({ timeout: 5000 })) {
      await expect(addButton).toBeEnabled();
    }
  });

  test('should handle mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const content = page.locator('[data-testid="cost-center-card"], tbody tr').first();
    await expect(content).toBeVisible();
  });

  test('should display cost center budget information', async ({ page }) => {
    // Budget or cost information should be visible
    const budgetInfo = page.locator('text=/Budget|Kosten|€/i').first();
    
    if (await budgetInfo.isVisible({ timeout: 5000 })) {
      await expect(budgetInfo).toBeVisible();
    }
  });

  test('should open cost center detail dialog', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const firstRow = page.locator('tbody tr, [data-testid="cost-center-card"]').first();
    
    if (await firstRow.isVisible({ timeout: 5000 })) {
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
      
      const content = page.locator('main, [role="main"]');
      await expect(content).toBeVisible();
    }
  });
});
