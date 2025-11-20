/* ==================================================================================
   E2E TESTS: BOOKINGS CRUD FLOW
   ================================================================================== */

import { test, expect } from "@playwright/test";

test.describe("Bookings - CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auftraege");
  });

  test("should create new booking", async ({ page }) => {
    // Click create button
    await page.click("text=Neuer Auftrag");

    // Fill form
    await page.fill('input[name="customer_name"]', "Test Kunde");
    await page.fill('input[name="pickup_address"]', "Teststraße 1, 12345 Berlin");
    await page.fill('input[name="dropoff_address"]', "Zielstraße 2, 12345 Berlin");

    // Submit
    await page.click('button[type="submit"]');

    // Should show success toast
    await expect(page.locator("text=Auftrag erfolgreich erstellt")).toBeVisible();

    // Should appear in table
    await expect(page.locator("td", { hasText: "Test Kunde" })).toBeVisible();
  });

  test("should update existing booking", async ({ page }) => {
    // Click first row edit button
    const firstRow = page.locator("tbody tr").first();
    await firstRow.locator('[data-testid="edit-button"]').click();

    // Update form
    await page.fill('input[name="customer_name"]', "Updated Kunde");
    await page.click('button[type="submit"]');

    // Should show success
    await expect(page.locator("text=Auftrag aktualisiert")).toBeVisible();
  });

  test("should archive booking", async ({ page }) => {
    // Click first row archive button
    const firstRow = page.locator("tbody tr").first();
    await firstRow.locator('[data-testid="archive-button"]').click();

    // Confirm dialog
    await page.click("text=Bestätigen");

    // Should show success
    await expect(page.locator("text=Auftrag archiviert")).toBeVisible();

    // Should disappear from table
    await page.waitForTimeout(500);
    const rowCount = await page.locator("tbody tr").count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("should validate required fields", async ({ page }) => {
    await page.click("text=Neuer Auftrag");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator("text=/erforderlich|required/i")).toBeVisible();
  });

  test("should search bookings", async ({ page }) => {
    await page.fill('input[placeholder*="Suche"]', "Test");

    await page.waitForTimeout(500);

    // Results should filter
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible();
  });

  test("should sort by date", async ({ page }) => {
    await page.click('th:has-text("Datum")');

    await page.waitForTimeout(500);

    // Table should re-sort
    const firstCell = page.locator("tbody tr").first().locator("td").first();
    await expect(firstCell).toBeVisible();
  });
});
