/* ==================================================================================
   E2E TESTS: RECHNUNGEN (GOLDEN TEMPLATE GENOM B)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Rechnungen - Golden Template Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rechnungen');
  });

  test('should display page header with KPIs', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Rechnungen' })).toBeVisible();
    
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible();
  });

  test('should show universal export bar', async ({ page }) => {
    const exportBar = page.locator('[data-testid="universal-export-bar"]');
    await expect(exportBar).toBeVisible();
    
    // Should have export buttons
    await expect(page.locator('text=PDF Export')).toBeVisible();
    await expect(page.locator('text=Excel Export')).toBeVisible();
  });

  test('should display data table', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Should have table headers
    await expect(page.locator('th', { hasText: 'Nummer' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Datum' })).toBeVisible();
  });

  test('should show right sidebar', async ({ page }) => {
    const sidebar = page.locator('[data-testid="right-sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Should have sidebar sections
    await expect(page.locator('text=Aktuelle Statistiken')).toBeVisible();
  });

  test('should handle mobile view correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile should show cards instead of table
    const mobileCards = page.locator('[data-testid="mobile-card"]');
    await expect(mobileCards.first()).toBeVisible();
  });

  test('should filter by status', async ({ page }) => {
    await page.click('[data-testid="status-filter"]');
    await page.click('text=Bezahlt');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Table should update
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('bulk selection should work', async ({ page }) => {
    // Select first row
    const firstCheckbox = page.locator('tbody tr').first().locator('input[type="checkbox"]');
    await firstCheckbox.check();
    
    // Bulk action bar should appear
    const bulkBar = page.locator('[data-testid="bulk-action-bar"]');
    await expect(bulkBar).toBeVisible();
  });
});
