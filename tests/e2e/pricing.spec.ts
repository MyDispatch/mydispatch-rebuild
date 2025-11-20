import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("has correct page title and SEO", async ({ page }) => {
    await expect(page).toHaveTitle(/Preise & Tarife/);

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
  });

  test("displays all pricing tiers", async ({ page }) => {
    await expect(page.locator("text=Starter")).toBeVisible();
    await expect(page.locator("text=Business")).toBeVisible();
    await expect(page.locator("text=Enterprise")).toBeVisible();
  });

  test("billing toggle works", async ({ page }) => {
    const toggle = page.locator('[role="switch"]').first();
    await expect(toggle).toBeVisible();

    // Check monthly prices initially
    await expect(page.locator("text=/39.*€/").first()).toBeVisible();

    // Switch to yearly
    await toggle.click();

    // Check yearly prices
    await expect(page.locator("text=/374.*€/").first()).toBeVisible();
  });

  test("CTA buttons work correctly", async ({ page }) => {
    const starterButton = page
      .getByRole("button", { name: /Jetzt starten|Starter wählen/i })
      .first();
    await expect(starterButton).toBeVisible();
    await expect(starterButton).toBeEnabled();

    await starterButton.click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test("shows feature comparison table", async ({ page }) => {
    await expect(page.locator("text=Detaillierter Vergleich")).toBeVisible();
  });

  test("displays add-ons section", async ({ page }) => {
    await expect(page.locator("text=Erweiterungen")).toBeVisible();
    await expect(page.locator("text=Fleet & Driver Add-On")).toBeVisible();
  });

  test("FAQ section is present", async ({ page }) => {
    await expect(page.locator("text=Häufig gestellte Fragen")).toBeVisible();
  });

  test("legal notices are displayed", async ({ page }) => {
    await expect(page.locator("text=/DSGVO|Datenschutz/")).toBeVisible();
    await expect(page.locator("text=/Made in Germany/")).toBeVisible();
  });

  test("responsive design on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator("text=Klar. Fair. Zukunftssicher.")).toBeVisible();
    await expect(page.locator("text=Starter")).toBeVisible();
  });

  test('feature dialog opens when "Mehr anzeigen" is clicked', async ({ page }) => {
    const moreButton = page.getByText("Mehr anzeigen").first();

    if (await moreButton.isVisible()) {
      await moreButton.click();

      // Dialog should open
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 1000 });
    }
  });
});
