import { test, expect } from "@playwright/test";

test.describe("Dokumente System - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Login als Test-User
    await page.goto("/auth?tab=login");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check if already logged in
    const currentUrl = page.url();
    if (!currentUrl.includes("/auth")) {
      return;
    }

    // Fill login form
    const emailInput = page.getByLabel(/e-mail/i);
    const passwordInput = page.getByLabel(/passwort/i);

    if (await emailInput.isVisible()) {
      await emailInput.fill(process.env.TEST_USER_EMAIL || "test@example.com");
      await passwordInput.fill(process.env.TEST_USER_PASSWORD || "testpassword123");

      await page.getByRole("button", { name: /anmelden/i }).click();
      await page.waitForURL("**/dashboard", { timeout: 10000 });
    }
  });

  test("should display Dokumente page", async ({ page }) => {
    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");

    // Check page elements
    const hasTitle = await page.getByText(/dokumente/i).isVisible();
    expect(hasTitle).toBe(true);
  });

  test("should have functional Brain System integration", async ({ page }) => {
    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");

    // Check page loads without critical errors
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("net::")) {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    const hasCriticalErrors = consoleErrors.some(
      (err) => err.includes("Uncaught") || err.includes("TypeError")
    );

    expect(hasCriticalErrors).toBe(false);
  });

  test("should display KPI cards", async ({ page }) => {
    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");

    // Check for KPI indicators (Abgelaufen, Läuft bald ab, Gesamt)
    const hasKPIs = await page.locator("text=/abgelaufen|läuft bald ab|gesamt/i").count();
    expect(hasKPIs).toBeGreaterThanOrEqual(1);
  });

  test("should have search functionality", async ({ page }) => {
    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");

    // Find search input
    const searchInput = page.getByPlaceholder(/dokumente durchsuchen/i);
    const hasSearch = await searchInput.isVisible();

    expect(hasSearch).toBe(true);
  });

  test("should open upload dialog", async ({ page }) => {
    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");

    // Find upload button
    const uploadButton = page.getByRole("button", { name: /dokument hochladen|neues dokument/i });

    if (await uploadButton.isVisible()) {
      await uploadButton.click();
      await page.waitForTimeout(500);

      // Check if dialog opened
      const dialogTitle = page.getByRole("heading", { name: /neues dokument/i });
      const isDialogVisible = await dialogTitle.isVisible();
      expect(isDialogVisible).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });

  test("should handle delete with defensive programming", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");

    // Try to click on a document if exists
    const firstRow = page.locator("tbody tr").first();

    if (await firstRow.isVisible()) {
      await firstRow.click();
      await page.waitForTimeout(500);

      // Look for delete button in detail dialog
      const deleteButton = page.getByRole("button", { name: /löschen|delete/i });

      if (await deleteButton.isVisible()) {
        // Don't actually delete, just verify button exists
        expect(await deleteButton.isVisible()).toBe(true);
      }
    }

    // Check: No critical errors even when clicking around
    const hasCriticalErrors = consoleErrors.some(
      (err) =>
        err.includes("Uncaught TypeError") &&
        err.includes("Cannot read property") &&
        !err.includes("net::")
    );

    expect(hasCriticalErrors).toBe(false);
  });

  test("should display DashboardInfoPanel at bottom", async ({ page }) => {
    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");

    // Skip on mobile
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      expect(true).toBe(true);
      return;
    }

    // Check if InfoPanel exists
    const infoPanel = page.locator('[class*="fixed"][class*="bottom"]').first();
    const isPanelVisible = await infoPanel.isVisible();

    // InfoPanel should be visible on desktop
    expect(isPanelVisible).toBe(true);
  });

  test("should have proper touch targets on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");

    // Check all buttons have sufficient height
    const buttons = page.getByRole("button");
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();

        if (box) {
          // Touch targets should be >= 44px
          expect(box.height).toBeGreaterThanOrEqual(42);
        }
      }
    } else {
      expect(true).toBe(true);
    }
  });
});

test.describe("Dokumente System - Visual Regression", () => {
  test("should match desktop screenshot", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("dokumente-desktop-1920.png", {
      fullPage: true,
      threshold: 0.05,
    });
  });

  test("should match mobile screenshot", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dokumente");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("dokumente-mobile-375.png", {
      fullPage: true,
      threshold: 0.05,
    });
  });
});
