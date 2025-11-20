import { test, expect } from "@playwright/test";

test.describe("Dashboard KPI Cards", () => {
  test.beforeEach(async ({ page }) => {
    // Login (wenn nötig)
    await page.goto("/dashboard");
  });

  test("should display all KPI cards", async ({ page }) => {
    // Warte auf KPI-Cards
    await page.waitForSelector('[data-testid="kpi-card"]', { timeout: 10000 });

    const kpiCards = await page.locator('[data-testid="kpi-card"]').all();
    expect(kpiCards.length).toBeGreaterThanOrEqual(3);
  });

  test("should have correct touch target sizes (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const buttons = await page.locator("button").all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44); // Apple/Google Guidelines
      }
    }
  });

  test("should display real-time data", async ({ page }) => {
    const auftraegeValue = await page
      .locator("text=Aufträge")
      .locator("..")
      .locator(".text-2xl")
      .textContent();
    expect(auftraegeValue).toBeTruthy();
    expect(parseInt(auftraegeValue || "0")).toBeGreaterThanOrEqual(0);
  });

  test("should navigate to detail pages on click", async ({ page }) => {
    await page.locator('button:has-text("Neuer Auftrag")').click();
    await expect(page).toHaveURL(/auftraege/, { timeout: 5000 });
  });

  test("should be responsive across breakpoints", async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 667, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1920, height: 1080, name: "Desktop" },
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });

      const kpiCards = await page.locator('[data-testid="kpi-card"]').all();
      expect(kpiCards.length).toBeGreaterThanOrEqual(3);

      // Screenshot für visuelle Regression
      await page.screenshot({
        path: `tests/screenshots/dashboard-kpi-${bp.name.toLowerCase()}.png`,
        fullPage: true,
      });
    }
  });
});
