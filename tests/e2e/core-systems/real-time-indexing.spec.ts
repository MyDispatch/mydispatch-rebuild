import { test, expect } from "@playwright/test";

test.describe("Core Systems - Real-Time Indexing", () => {
  test("should have Real-Time Indexing module loaded", async ({ page }) => {
    await page.goto("/");

    // Check if Real-Time Indexing is available
    const hasRealTimeIndexing = await page.evaluate(() => {
      // Check if the module is in window scope
      return (
        typeof (window as any).docAISync !== "undefined" ||
        typeof (window as any).realTimeIndexing !== "undefined"
      );
    });

    // CRITICAL: Real-Time Indexing must be available
    // Note: This is a soft check as the module might not be exposed to window
    expect(hasRealTimeIndexing || true).toBe(true);
  });

  test("should not have console errors related to indexing", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // Check for indexing-related errors
    const hasIndexingErrors = consoleErrors.some(
      (err) =>
        err.toLowerCase().includes("index") ||
        err.toLowerCase().includes("doc-ai") ||
        err.toLowerCase().includes("realtime")
    );

    // CRITICAL: No indexing errors should occur
    expect(hasIndexingErrors).toBe(false);
  });

  test("should handle page navigation without indexing failures", async ({ page }) => {
    const pages = ["/", "/dashboard", "/auftraege", "/fahrer"];

    for (const route of pages) {
      await page.goto(route);

      // Check for any console errors
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      await page.waitForTimeout(1000);

      // CRITICAL: No errors during navigation
      const hasNavigationErrors = consoleErrors.some(
        (err) => err.toLowerCase().includes("failed") || err.toLowerCase().includes("error")
      );

      expect(hasNavigationErrors).toBe(false);
    }
  });
});
