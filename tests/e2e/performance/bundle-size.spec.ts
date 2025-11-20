import { test, expect } from "@playwright/test";

test.describe("Performance Budget - Bundle Size", () => {
  test("should have reasonable initial bundle size (< 1.5MB)", async ({ page }) => {
    // Track all network requests
    const resources: { url: string; size: number; type: string }[] = [];

    page.on("response", async (response) => {
      const url = response.url();
      const type = response.request().resourceType();

      // Only track JS/CSS/Images
      if (["script", "stylesheet", "image", "font"].includes(type)) {
        try {
          const buffer = await response.body();
          resources.push({
            url,
            size: buffer.length,
            type,
          });
        } catch {
          // Ignore errors (e.g., network issues)
        }
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Calculate totals by type
    const totals = resources.reduce(
      (acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + r.size;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalSize = Object.values(totals).reduce((sum, size) => sum + size, 0);
    const totalMB = (totalSize / 1024 / 1024).toFixed(2);

    console.log("Bundle Size Analysis:");
    console.log(`  Scripts: ${((totals.script || 0) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Stylesheets: ${((totals.stylesheet || 0) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Images: ${((totals.image || 0) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Fonts: ${((totals.font || 0) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  TOTAL: ${totalMB} MB`);

    // Budget: 1.5 MB total
    expect(totalSize).toBeLessThan(1.5 * 1024 * 1024);
  });

  test("should load critical resources quickly (< 1s)", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");

    // Wait for main JS to load
    await page.waitForSelector("body");

    const loadTime = Date.now() - startTime;

    console.log(`Critical resources loaded in: ${loadTime}ms`);

    // Critical resources should load in < 1000ms
    expect(loadTime).toBeLessThan(1000);
  });

  test("should use code splitting for routes", async ({ page }) => {
    // Track loaded JS files
    const jsFiles = new Set<string>();

    page.on("response", (response) => {
      const url = response.url();
      if (url.includes(".js") && !url.includes("node_modules")) {
        jsFiles.add(url);
      }
    });

    await page.goto("/");
    const homeJsCount = jsFiles.size;

    await page.goto("/dashboard");
    const dashboardJsCount = jsFiles.size;

    await page.goto("/auftraege");
    const auftraegeJsCount = jsFiles.size;

    console.log(
      `JS files loaded: Home=${homeJsCount}, Dashboard=${dashboardJsCount}, Aufträge=${auftraegeJsCount}`
    );

    // Should load additional chunks for each route (code splitting working)
    expect(dashboardJsCount).toBeGreaterThan(homeJsCount);
    expect(auftraegeJsCount).toBeGreaterThan(dashboardJsCount);
  });

  test("should compress assets (gzip/brotli)", async ({ page }) => {
    const compressedResources: string[] = [];
    const uncompressedResources: string[] = [];

    page.on("response", async (response) => {
      const url = response.url();
      const type = response.request().resourceType();

      if (["script", "stylesheet"].includes(type)) {
        const headers = response.headers();
        const contentEncoding = headers["content-encoding"];

        if (
          contentEncoding &&
          (contentEncoding.includes("gzip") || contentEncoding.includes("br"))
        ) {
          compressedResources.push(url);
        } else {
          uncompressedResources.push(url);
        }
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    console.log(`Compressed resources: ${compressedResources.length}`);
    console.log(`Uncompressed resources: ${uncompressedResources.length}`);

    if (uncompressedResources.length > 0) {
      console.warn("Uncompressed resources:", uncompressedResources.slice(0, 5));
    }

    // Most resources should be compressed (allow some exceptions)
    const compressionRatio =
      compressedResources.length / (compressedResources.length + uncompressedResources.length);
    expect(compressionRatio).toBeGreaterThan(0.7); // 70% compressed
  });
});
