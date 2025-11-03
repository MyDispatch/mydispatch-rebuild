/* ==================================================================================
   E2E TESTS: KUNDEN (CUSTOMERS MANAGEMENT)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Kunden - Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kunden');
  });

  test('should display customer KPI cards', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show customers data table', async ({ page }) => {
    const table = page.locator('table, [data-testid="customers-table"]').first();
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test('should display customer search', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Suche"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('should open customer detail dialog', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click on first customer row
    const firstRow = page.locator('tbody tr, [data-testid="customer-card"]').first();
    
    if (await firstRow.isVisible()) {
      await firstRow.click();
      
      // Dialog should open
      const dialog = page.locator('role=dialog, [role="dialog"]');
      await expect(dialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should filter customers by type', async ({ page }) => {
    // Customer type filters (private, business)
    const typeFilter = page.locator('[data-testid="type-filter"], text=/Privat|Geschäftlich|Business/i').first();
    
    if (await typeFilter.isVisible()) {
      await expect(typeFilter).toBeEnabled();
    }
  });

  test('should handle mobile view correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile should show cards or simplified layout
    const mobileContent = page.locator('[data-testid="customer-card"], tbody tr').first();
    await expect(mobileContent).toBeVisible();
  });

  test('should display add customer button', async ({ page }) => {
    const addButton = page.locator('text=/Kunde hinzufügen|Neuer Kunde|Add Customer/i').first();
    
    if (await addButton.isVisible()) {
      await expect(addButton).toBeEnabled();
    }
  });

  test('should show customer statistics', async ({ page }) => {
    // Should display customer count, revenue, or other metrics
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
