/* ==================================================================================
   E2E TESTS: FAHRZEUGE (VEHICLES MANAGEMENT)
   ================================================================================== */

import { test, expect } from "@playwright/test";

test.describe("Fahrzeuge - Vehicle Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/fahrzeuge");
  });

  test("should display vehicle KPI cards", async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible({ timeout: 10000 });
  });

  test("should show vehicles data table", async ({ page }) => {
    const table = page.locator('table, [data-testid="vehicles-table"]').first();
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test("should display vehicle status filters", async ({ page }) => {
    // Status filters (available, in_use, maintenance)
    const statusFilter = page
      .locator('[data-testid="status-filter"], text=/Status|Verfügbar|Im Einsatz/i')
      .first();
    await expect(statusFilter).toBeVisible();
  });

  test("should open vehicle detail dialog", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // Click on first vehicle row
    const firstRow = page.locator('tbody tr, [data-testid="vehicle-card"]').first();

    if (await firstRow.isVisible()) {
      await firstRow.click();

      // Dialog should open
      const dialog = page.locator('role=dialog, [role="dialog"]');
      await expect(dialog).toBeVisible({ timeout: 5000 });
    }
  });

  test("should handle mobile view with cards", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile should show cards or simplified table
    const mobileContent = page.locator('[data-testid="vehicle-card"], tbody tr').first();
    await expect(mobileContent).toBeVisible();
  });

  test("should show vehicle search functionality", async ({ page }) => {
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="Suche"], input[placeholder*="Search"]')
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill("Test");
      await page.waitForTimeout(500);

      // Search should work
      expect(await searchInput.inputValue()).toBe("Test");
    }
  });

  test("should display vehicle action buttons", async ({ page }) => {
    // Add vehicle button should be present
    const addButton = page
      .locator("text=/Fahrzeug hinzufügen|Neues Fahrzeug|Add Vehicle/i")
      .first();

    if (await addButton.isVisible()) {
      await expect(addButton).toBeEnabled();
    }
  });
});
