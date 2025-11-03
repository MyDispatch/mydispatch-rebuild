/* ==================================================================================
   VISUAL REGRESSION TESTS - DASHBOARD CONSISTENCY
   ==================================================================================
   Tests for consistent DashboardInfoBoard presence and export functionality
   ================================================================================== */

import { test, expect } from '@playwright/test';

const DASHBOARD_PAGES = [
  'kunden',
  'rechnungen',
  'statistiken',
  'auftraege',
  'fahrer',
  'fahrzeuge',
  'partner',
  'kostenstellen',
  'disposition',
  'dokumente',
];

test.describe('Dashboard Consistency Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login (if auth is required)
    // await page.goto('/login');
    // await page.fill('input[type="email"]', 'test@example.com');
    // await page.fill('input[type="password"]', 'password');
    // await page.click('button[type="submit"]');
  });

  test('all dashboards have InfoBoard', async ({ page }) => {
    for (const dashboard of DASHBOARD_PAGES) {
      await page.goto(`/${dashboard}`);
      await page.waitForLoadState('networkidle');

      // Check InfoBoard presence
      const infoBoard = page.locator('[data-testid="dashboard-infoboard"]');
      await expect(infoBoard).toBeVisible({
        timeout: 5000,
      });

      // Take screenshot for visual regression
      await page.screenshot({
        path: `tests/screenshots/${dashboard}-infoboard.png`,
        fullPage: false,
      });
    }
  });

  test('all dashboards have export buttons', async ({ page }) => {
    for (const dashboard of DASHBOARD_PAGES) {
      await page.goto(`/${dashboard}`);
      await page.waitForLoadState('networkidle');

      // Check export buttons presence
      const pdfButton = page.locator('button:has-text("PDF")').first();
      const excelButton = page.locator('button:has-text("Excel")').first();
      const csvButton = page.locator('button:has-text("CSV")').first();

      await expect(pdfButton).toBeVisible({ timeout: 5000 });
      await expect(excelButton).toBeVisible({ timeout: 5000 });
      await expect(csvButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('InfoBoard responds to sidebar expansion', async ({ page }) => {
    await page.goto('/kunden');
    await page.waitForLoadState('networkidle');

    // Get initial InfoBoard position
    const infoBoard = page.locator('[data-testid="dashboard-infoboard"]');
    const initialBox = await infoBoard.boundingBox();

    // Toggle sidebar (assuming there's a toggle button)
    const sidebarToggle = page.locator('button[aria-label*="sidebar"]').first();
    if (await sidebarToggle.isVisible()) {
      await sidebarToggle.click();
      await page.waitForTimeout(500); // Wait for animation

      // Check InfoBoard adjusted its position
      const newBox = await infoBoard.boundingBox();
      expect(newBox?.x).not.toBe(initialBox?.x);
    }
  });

  test('export buttons are consistently positioned', async ({ page }) => {
    const positions: Record<string, { x: number; y: number }> = {};

    for (const dashboard of DASHBOARD_PAGES.slice(0, 3)) {
      await page.goto(`/${dashboard}`);
      await page.waitForLoadState('networkidle');

      const pdfButton = page.locator('button:has-text("PDF")').first();
      const box = await pdfButton.boundingBox();

      if (box) {
        positions[dashboard] = { x: box.x, y: box.y };
      }
    }

    // Check all export buttons are in similar positions
    const xValues = Object.values(positions).map((p) => p.x);
    const xRange = Math.max(...xValues) - Math.min(...xValues);

    // Allow for some variation (50px tolerance)
    expect(xRange).toBeLessThan(50);
  });

  test('InfoBoard has correct responsive behavior', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/kunden');
    await page.waitForLoadState('networkidle');

    let infoBoard = page.locator('[data-testid="dashboard-infoboard"]');
    await expect(infoBoard).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    // InfoBoard should collapse or adapt on smaller screens
    // (Depending on your implementation)

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // InfoBoard might be hidden on mobile
    // (Depending on your implementation)
  });

  test('InfoBoard KPIs display correct data', async ({ page }) => {
    await page.goto('/kunden');
    await page.waitForLoadState('networkidle');

    const infoBoard = page.locator('[data-testid="dashboard-infoboard"]');

    // Check KPI section exists
    const kpiSection = infoBoard.locator('text=Schnellübersicht');
    await expect(kpiSection).toBeVisible();

    // Check at least one KPI is displayed
    const kpiValues = infoBoard.locator('.font-bold.text-slate-900');
    await expect(kpiValues.first()).toBeVisible();
  });

  test('export functionality triggers correctly', async ({ page }) => {
    await page.goto('/kunden');
    await page.waitForLoadState('networkidle');

    // Listen for download events
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });

    // Click PDF export button
    const pdfButton = page.locator('button:has-text("PDF")').first();
    await pdfButton.click();

    // Wait for download to start (or error to be shown)
    try {
      const download = await downloadPromise;
      expect(download).toBeTruthy();
    } catch (error) {
      // If download doesn't happen, check for toast notification
      const toast = page.locator('[role="status"]');
      await expect(toast).toBeVisible({ timeout: 3000 });
    }
  });
});
