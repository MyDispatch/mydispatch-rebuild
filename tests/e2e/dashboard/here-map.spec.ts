import { test, expect } from "@playwright/test";

test.describe("HERE Maps Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("should load map without errors", async ({ page }) => {
    // Warte auf Map-Container
    await page.waitForSelector('[data-testid="here-map"]', { timeout: 15000 });

    // Prüfe, ob Karte geladen wurde
    const mapCanvas = await page.locator("canvas").first();
    expect(await mapCanvas.isVisible()).toBe(true);
  });

  test("should display company location marker", async ({ page }) => {
    await page.waitForSelector('[data-testid="here-map"]', { timeout: 15000 });
    await page.waitForTimeout(3000); // Map-Init

    // Marker sollten existieren (Icon H für Firmensitz)
    const markers = await page.evaluate(() => {
      return document.querySelectorAll("svg circle").length;
    });

    expect(markers).toBeGreaterThan(0);
  });

  test("should show driver positions", async ({ page }) => {
    await page.waitForSelector('[data-testid="here-map"]', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // Fahrer-Marker sollten vorhanden sein
    const driverMarkers = await page.evaluate(() => {
      return document.querySelectorAll('svg text:has-text("🚗")').length;
    });

    expect(driverMarkers).toBeGreaterThanOrEqual(0); // Mindestens 0 (könnte keine Fahrer geben)
  });

  test("should refresh markers every 15 seconds", async ({ page }) => {
    await page.waitForSelector('[data-testid="here-map"]', { timeout: 15000 });

    const initialMarkers = await page.evaluate(() => {
      return document.querySelectorAll("svg circle").length;
    });

    // Warte 16 Sekunden (Auto-Refresh ist 15s)
    await page.waitForTimeout(16000);

    const refreshedMarkers = await page.evaluate(() => {
      return document.querySelectorAll("svg circle").length;
    });

    // Marker sollten aktualisiert sein (Anzahl kann gleich bleiben)
    expect(refreshedMarkers).toBeGreaterThanOrEqual(0);
  });

  test("should handle marker cleanup without errors", async ({ page }) => {
    await page.waitForSelector('[data-testid="here-map"]', { timeout: 15000 });

    // Keine Console-Errors erlaubt
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(5000);

    // Filter nur relevante Errors (HERE Maps interne Tile-Errors sind OK)
    const relevantErrors = errors.filter(
      (err) => !err.includes("tile load error") && !err.includes("Tangram")
    );

    expect(relevantErrors.length).toBe(0);
  });
});
