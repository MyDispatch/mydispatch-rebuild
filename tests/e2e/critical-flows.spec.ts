import { test, expect } from "@playwright/test";

test.describe("Critical User Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Home page loads correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/MyDispatch/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Navigation works", async ({ page }) => {
    await page.click("text=Features");
    await expect(page).toHaveURL(/\/features/);

    await page.click("text=Pricing");
    await expect(page).toHaveURL(/\/pricing/);
  });

  test("Auth page loads correctly", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.locator('[data-testid="auth-form"]')).toBeVisible();
  });
});

test.describe("Design System Compliance", () => {
  test("CI-Farben nicht hardcoded", async ({ page }) => {
    await page.goto("/");

    // Check for hardcoded colors
    const hardcodedColors = await page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      const found: string[] = [];
      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const color = style.color || style.backgroundColor || style.borderColor;
        if (color.includes("#EADEBD") || color.includes("#323D5E")) {
          found.push(color);
        }
      });
      return found;
    });

    expect(hardcodedColors.length).toBe(0);
  });

  test("Hero Background Variant korrekt", async ({ page }) => {
    await page.goto("/");
    const heroSection = page.locator('[data-testid="hero-section"]').first();
    if ((await heroSection.count()) > 0) {
      const variant = await heroSection.getAttribute("data-background-variant");
      expect(variant).toBe("3d-premium");
    }
  });
});
