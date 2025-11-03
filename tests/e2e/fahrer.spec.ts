/* ==================================================================================
   E2E TESTS: FAHRER (VIEWPORT & SIDEBAR VALIDATION)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Fahrer - Viewport & Sidebar Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fahrer');
  });

  test('mobile: should show direct StatCards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile should show StatCards directly
    const statCards = page.locator('[data-testid="stat-card"]');
    await expect(statCards.first()).toBeVisible();
    
    // Should NOT show PageHeaderWithKPIs on mobile
    const pageHeader = page.locator('[data-testid="page-header-with-kpis"]');
    await expect(pageHeader).not.toBeVisible();
  });

  test('desktop: should show PageHeaderWithKPIs', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Desktop should show PageHeaderWithKPIs
    const pageHeader = page.locator('[data-testid="page-header-with-kpis"]');
    await expect(pageHeader).toBeVisible();
  });

  test('should display right sidebar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const sidebar = page.locator('[data-testid="right-sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Should have sections
    await expect(page.locator('text=Schicht-Übersicht')).toBeVisible();
  });

  test('should toggle between Fahrer and Fahrzeuge tabs', async ({ page }) => {
    await page.click('text=Fahrzeuge');
    
    // Wait for tab content to change
    await page.waitForTimeout(500);
    
    // Should show vehicle data
    await expect(page.locator('text=Kennzeichen')).toBeVisible();
  });

  test('should filter drivers by status', async ({ page }) => {
    await page.click('[data-testid="status-filter"]');
    await page.click('text=Verfügbar');
    
    await page.waitForTimeout(500);
    
    // Table should filter
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('should open driver detail dialog', async ({ page }) => {
    // Click on first driver row
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
    
    // Dialog should open
    const dialog = page.locator('role=dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('text=Fahrer-Details')).toBeVisible();
  });
});
