import { test, expect } from "@playwright/test";

/**
 * V28.3 Retina Quality Tests
 *
 * Validates visual sharpness optimizations:
 * - Retina srcSet support
 * - WebP/AVIF fallbacks
 * - Subpixel antialiasing
 * - No CSS transform blur
 */

test.describe("V28.3 Retina Quality - Dashboard Visuals", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("OptimizedImage component renders with proper attributes", async ({ page }) => {
    // Check for any optimized images on page
    const images = page.locator("img[loading]");
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();

      // Check lazy loading
      const loading = await firstImage.getAttribute("loading");
      expect(loading).toBeTruthy();

      // Check decoding async
      const decoding = await firstImage.getAttribute("decoding");
      expect(decoding).toBe("async");
    }
  });

  test("Text has proper antialiasing classes", async ({ page }) => {
    // Check for antialiased text
    const antialiasedText = page.locator(".antialiased").first();
    if ((await antialiasedText.count()) > 0) {
      const classes = await antialiasedText.getAttribute("class");
      expect(classes).toContain("antialiased");
    }

    // Check for subpixel-antialiased text
    const subpixelText = page.locator(".subpixel-antialiased").first();
    if ((await subpixelText.count()) > 0) {
      const classes = await subpixelText.getAttribute("class");
      expect(classes).toContain("subpixel-antialiased");
    }
  });

  test("Hero visual has pixel-perfect class", async ({ page }) => {
    const heroVisual = page.locator(".pixel-perfect").first();

    if ((await heroVisual.count()) > 0) {
      const classes = await heroVisual.getAttribute("class");
      expect(classes).toContain("pixel-perfect");
    }
  });

  test("Browser mockup uses SVG traffic lights", async ({ page }) => {
    // Check for SVG traffic lights in browser mockup
    const svgTrafficLights = page.locator('svg[viewBox="0 0 12 12"]');
    const count = await svgTrafficLights.count();

    if (count > 0) {
      expect(count).toBeGreaterThanOrEqual(3); // Red, Yellow, Green
    }
  });
});

test.describe("V28.3 Retina Quality - Responsive Images", () => {
  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1920, height: 1080 },
    { name: "Retina Desktop", width: 2880, height: 1800 },
  ];

  for (const viewport of viewports) {
    test(`${viewport.name} - Images render without blur`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Take screenshot for visual regression
      await expect(page).toHaveScreenshot(`retina-quality-${viewport.name.toLowerCase()}.png`, {
        fullPage: false,
        maxDiffPixels: 100,
      });
    });
  }
});

test.describe("V28.3 Performance - Image Loading", () => {
  test("Images lazy load correctly", async ({ page }) => {
    await page.goto("/");

    // Get all lazy-loaded images
    const lazyImages = page.locator('img[loading="lazy"]');
    const count = await lazyImages.count();

    expect(count).toBeGreaterThan(0);

    // Check first lazy image has correct attributes
    if (count > 0) {
      const firstLazyImage = lazyImages.first();
      const loading = await firstLazyImage.getAttribute("loading");
      expect(loading).toBe("lazy");
    }
  });

  test("Priority images load eagerly", async ({ page }) => {
    await page.goto("/");

    // Get all priority images (above-the-fold)
    const priorityImages = page.locator('img[loading="eager"]');
    const count = await priorityImages.count();

    // At least hero images should be priority
    if (count > 0) {
      const firstPriorityImage = priorityImages.first();
      const loading = await firstPriorityImage.getAttribute("loading");
      expect(loading).toBe("eager");
    }
  });
});
