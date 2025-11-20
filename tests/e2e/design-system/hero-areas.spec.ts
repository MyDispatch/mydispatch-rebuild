import { test, expect } from "@playwright/test";

/**
 * Hero-Bereich E2E Tests V18.5.1
 *
 * Validiert APP_PAGE_TEMPLATE V18.5.1 Hero-Requirements:
 * - Tailwind CSS Design (KEINE JPG/PNG Bilder!)
 * - bg-gradient-to-br from-primary via-primary/80 to-secondary/30
 * - Icon aus Lucide React (h-16 w-16 sm:h-20 sm:w-20)
 * - Responsive Height: h-[200px] sm:h-[250px] lg:h-[300px]
 * - Keine <img> Tags im Hero-Bereich
 */

test.describe("Hero-Bereich Design V18.5.1", () => {
  test("Aufträge Hero-Bereich verwendet Tailwind CSS", async ({ page }) => {
    // Login
    await page.goto("/auth");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@example.com");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "password");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    // Navigate to Aufträge
    await page.goto("/auftraege");
    await page.waitForLoadState("networkidle");

    // Find Hero-Bereich (first element with bg-gradient-to-br)
    const hero = page.locator(".bg-gradient-to-br").first();
    await expect(hero).toBeVisible();

    // Check for correct Tailwind gradient classes
    const heroClasses = await hero.getAttribute("class");
    expect(heroClasses).toContain("bg-gradient-to-br");
    expect(heroClasses).toContain("from-primary");
    expect(heroClasses).toMatch(/via-primary\/(80|90)/);
    expect(heroClasses).toMatch(/to-secondary\/(20|30)/);

    // Check responsive height classes
    expect(heroClasses).toContain("h-[200px]");
    expect(heroClasses).toContain("sm:h-[250px]");
    expect(heroClasses).toContain("lg:h-[300px]");

    // KRITISCH: KEINE <img> Tags im Hero-Bereich!
    const heroImages = await hero.locator("img").count();
    expect(heroImages).toBe(0);

    // Check for Lucide Icon (svg element)
    const icon = hero.locator("svg").first();
    await expect(icon).toBeVisible();

    const iconClasses = await icon.getAttribute("class");
    expect(iconClasses).toMatch(/h-16.*w-16/);
    expect(iconClasses).toMatch(/sm:h-20.*sm:w-20/);
  });

  test("Partner Hero-Bereich verwendet Tailwind CSS", async ({ page }) => {
    // Login
    await page.goto("/auth");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@example.com");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "password");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    // Navigate to Partner
    await page.goto("/partner");
    await page.waitForLoadState("networkidle");

    // Find Hero-Bereich
    const hero = page.locator(".bg-gradient-to-br").first();
    await expect(hero).toBeVisible();

    // Check for correct Tailwind gradient classes
    const heroClasses = await hero.getAttribute("class");
    expect(heroClasses).toContain("bg-gradient-to-br");
    expect(heroClasses).toContain("from-primary");

    // KRITISCH: KEINE <img> Tags!
    const heroImages = await hero.locator("img").count();
    expect(heroImages).toBe(0);

    // Check for Lucide Icon
    const icon = hero.locator("svg").first();
    await expect(icon).toBeVisible();
  });

  test("Dashboard Hero-Bereich (falls vorhanden) verwendet Tailwind CSS", async ({ page }) => {
    // Login
    await page.goto("/auth");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@example.com");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "password");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    // Check if Hero exists on Dashboard
    const hero = page.locator(".bg-gradient-to-br").first();
    const heroExists = await hero.isVisible().catch(() => false);

    if (heroExists) {
      // Validate Tailwind CSS Design
      const heroClasses = await hero.getAttribute("class");
      expect(heroClasses).toContain("bg-gradient-to-br");

      // KRITISCH: KEINE <img> Tags!
      const heroImages = await hero.locator("img").count();
      expect(heroImages).toBe(0);
    }
  });

  test("Hero-Bereiche sind responsive auf allen Breakpoints", async ({ page }) => {
    // Login
    await page.goto("/auth");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@example.com");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "password");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    // Navigate to Aufträge
    await page.goto("/auftraege");
    await page.waitForLoadState("networkidle");

    // Test Mobile (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    const heroMobile = page.locator(".bg-gradient-to-br").first();
    await expect(heroMobile).toBeVisible();
    const heroMobileBox = await heroMobile.boundingBox();
    expect(heroMobileBox?.height).toBeGreaterThanOrEqual(190); // ~200px with some tolerance

    // Test Tablet (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    const heroTablet = page.locator(".bg-gradient-to-br").first();
    await expect(heroTablet).toBeVisible();
    const heroTabletBox = await heroTablet.boundingBox();
    expect(heroTabletBox?.height).toBeGreaterThanOrEqual(240); // ~250px

    // Test Desktop (1920px)
    await page.setViewportSize({ width: 1920, height: 1080 });
    const heroDesktop = page.locator(".bg-gradient-to-br").first();
    await expect(heroDesktop).toBeVisible();
    const heroDesktopBox = await heroDesktop.boundingBox();
    expect(heroDesktopBox?.height).toBeGreaterThanOrEqual(290); // ~300px
  });
});
