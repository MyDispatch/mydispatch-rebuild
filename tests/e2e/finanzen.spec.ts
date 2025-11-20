/* ==================================================================================
   E2E TESTS: FINANZEN (FINANCIAL DASHBOARD)
   ================================================================================== */

import { test, expect } from "@playwright/test";

test.describe("Finanzen - Financial Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/finanzen");
  });

  test("should display financial KPI cards", async ({ page }) => {
    // Financial KPIs should be visible
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible({ timeout: 10000 });

    // Should show at least revenue metrics
    await expect(page.locator("text=/Umsatz|Revenue/i")).toBeVisible();
  });

  test("should display revenue chart", async ({ page }) => {
    // Revenue chart should be present
    const chart = page.locator('[data-testid="revenue-chart"], .recharts-wrapper').first();
    await expect(chart).toBeVisible({ timeout: 10000 });
  });

  test("should show financial period filters", async ({ page }) => {
    // Period filters (today, week, month, year)
    const filters = page.locator("text=/Heute|Diese Woche|Dieser Monat|Jahr/i").first();
    await expect(filters).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile should show KPI cards in single column
    const kpiCards = page.locator('[data-testid="stat-card"]');
    await expect(kpiCards.first()).toBeVisible();
  });

  test("should display financial data without errors", async ({ page }) => {
    // Check console for errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);

    // Filter out non-critical errors
    const criticalErrors = errors.filter(
      (err) => !err.includes("tile load error") && !err.includes("favicon")
    );

    expect(criticalErrors.length).toBe(0);
  });
});
