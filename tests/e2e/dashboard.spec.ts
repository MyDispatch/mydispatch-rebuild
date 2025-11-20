/* ==================================================================================
   E2E TESTS: DASHBOARD (GOLDEN TEMPLATE GENOM A)
   ================================================================================== */

import { test, expect } from "@playwright/test";

test.describe("Dashboard - Golden Template Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display all KPI cards", async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible();
  });

  test("should show live time display", async ({ page }) => {
    const timeDisplay = page.locator("text=/\\d{2}:\\d{2}:\\d{2}/");
    await expect(timeDisplay).toBeVisible();
  });

  test("should display quick actions section", async ({ page }) => {
    await expect(page.locator("text=Quick Actions")).toBeVisible();
  });

  test("should show map container", async ({ page }) => {
    const mapContainer = page.locator('[data-testid="map-container"]');
    await expect(mapContainer).toBeVisible();
  });

  test("should display mobile dashboard on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const mobileDashboard = page.locator('[data-testid="mobile-dashboard"]');
    await expect(mobileDashboard).toBeVisible();
  });
});
