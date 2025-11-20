import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title and SEO", async ({ page }) => {
    await expect(page).toHaveTitle(/MyDispatch/);

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
  });

  test("hero section is visible", async ({ page }) => {
    await expect(page.locator("text=Disposition, die Zeit spart und Geld verdient")).toBeVisible();
    await expect(page.locator("text=Jetzt starten")).toBeVisible();
  });

  test("CTA buttons are clickable", async ({ page }) => {
    const ctaButton = page.getByRole("button", { name: /Jetzt starten/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();

    await ctaButton.click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test("features section displays all features", async ({ page }) => {
    await expect(page.locator("text=Intelligente Auftragsverwaltung")).toBeVisible();
    await expect(page.locator("text=Digitale Fuhrpartverwaltung")).toBeVisible();
    await expect(page.locator("text=Fahrermanagement Pro")).toBeVisible();
  });

  test("testimonials slider works", async ({ page }) => {
    // Check if testimonials are visible
    const testimonials = page.locator('[class*="testimonial"]').first();
    await expect(testimonials).toBeVisible({ timeout: 5000 });

    // Check slider controls
    const nextButton = page.getByLabel("Nächstes Testimonial");
    const prevButton = page.getByLabel("Vorheriges Testimonial");
    const pauseButton = page.getByLabel(/Automatische Wiedergabe/);

    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
    await expect(pauseButton).toBeVisible(); // WCAG FIX

    // Test pause button
    await pauseButton.click();
    await expect(page.getByLabel("Automatische Wiedergabe starten")).toBeVisible();
  });

  test("pricing cards display correctly", async ({ page }) => {
    await expect(page.locator("text=Starter")).toBeVisible();
    await expect(page.locator("text=Business")).toBeVisible();
    await expect(page.locator("text=Enterprise")).toBeVisible();
  });

  test("FAQ section is present", async ({ page }) => {
    await expect(page.locator("text=Häufig gestellte Fragen")).toBeVisible();
  });

  test("mobile menu is accessible on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const menuButton = page.getByLabel("Navigationsmenü öffnen");
    await expect(menuButton).toBeVisible();

    await menuButton.click();

    // Check if menu opens
    await expect(page.locator("#mobile-navigation-menu")).toBeVisible({ timeout: 1000 });
  });

  test("logo button is keyboard accessible", async ({ page }) => {
    const logoButton = page.getByLabel("Zur Startseite");
    await expect(logoButton).toBeVisible();

    // Test keyboard navigation
    await logoButton.focus();
    await expect(logoButton).toBeFocused();

    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    // Should navigate to home
    expect(page.url()).toContain("/");
  });

  test("responsive design works correctly", async ({ page }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("text=Disposition, die Zeit spart und Geld verdient")).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("text=Disposition, die Zeit spart und Geld verdient")).toBeVisible();

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("text=Disposition, die Zeit spart und Geld verdient")).toBeVisible();
  });
});
