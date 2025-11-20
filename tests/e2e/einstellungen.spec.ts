/* ==================================================================================
   E2E TESTS: EINSTELLUNGEN (SETTINGS DASHBOARD)
   ================================================================================== */

import { test, expect } from "@playwright/test";

test.describe("Einstellungen - Settings Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/einstellungen");
  });

  test("should display settings sections", async ({ page }) => {
    // Settings sections should be visible
    await expect(
      page.locator("text=/Allgemein|Profil|Unternehmen|Benachrichtigungen/i").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should show company settings form", async ({ page }) => {
    // Company settings should have form fields
    const formFields = page.locator("input, select, textarea").first();
    await expect(formFields).toBeVisible({ timeout: 10000 });
  });

  test("should display save button", async ({ page }) => {
    const saveButton = page.locator("text=/Speichern|Save/i").first();
    await expect(saveButton).toBeVisible();
  });

  test("should handle mobile view", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Settings should be accessible on mobile
    const settingsContent = page.locator('main, [role="main"]');
    await expect(settingsContent).toBeVisible();
  });

  test("should show navigation tabs or sections", async ({ page }) => {
    // Settings should have multiple sections
    const sections = page.locator("text=/Allgemein|Profil|Sicherheit|Benachrichtigungen/i");
    const count = await sections.count();

    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("should be responsive across breakpoints", async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });

      const content = page.locator('main, [role="main"]');
      await expect(content).toBeVisible();
    }
  });
});
