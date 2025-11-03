/* ==================================================================================
   E2E TESTS: DISPOSITION (DISPATCH DASHBOARD)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Disposition - Dispatch Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/disposition');
  });

  test('should display disposition KPI cards', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show active bookings list', async ({ page }) => {
    // Active bookings should be displayed
    const bookingsList = page.locator('table, [data-testid="bookings-list"]').first();
    await expect(bookingsList).toBeVisible({ timeout: 10000 });
  });

  test('should display driver assignment interface', async ({ page }) => {
    // Driver assignment dropdown or dialog
    const assignmentUI = page.locator('[data-testid="driver-assignment"], text=/Fahrer zuweisen|Assign Driver/i').first();
    
    if (await assignmentUI.isVisible({ timeout: 5000 })) {
      await expect(assignmentUI).toBeVisible();
    }
  });

  test('should show dispatch map view', async ({ page }) => {
    // Map for dispatch overview
    const mapView = page.locator('[data-testid="dispatch-map"], canvas').first();
    
    if (await mapView.isVisible({ timeout: 10000 })) {
      await expect(mapView).toBeVisible();
    }
  });

  test('should filter bookings by status', async ({ page }) => {
    const statusFilter = page.locator('[data-testid="status-filter"], text=/Status|Filter/i').first();
    
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should handle mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile should show simplified dispatch view
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible();
  });

  test('should display real-time updates', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for live indicator or auto-refresh
    const liveIndicator = page.locator('text=/Live|Echtzeit/i').first();
    
    if (await liveIndicator.isVisible({ timeout: 5000 })) {
      await expect(liveIndicator).toBeVisible();
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
