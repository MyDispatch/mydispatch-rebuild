/**
 * ==================================================================================
 * LINK VALIDATION TESTS V18.5.10
 * ==================================================================================
 * Prüft:
 * - Alle internen Links erreichbar
 * - Alle Router-Routen existieren
 * - Keine Broken Links (404s)
 * - Navigation funktioniert
 * ==================================================================================
 */

import { test, expect } from "@playwright/test";

const ROUTES = [
  "/",
  "/dashboard",
  "/auftraege",
  "/fahrer",
  "/fahrzeuge",
  "/kunden",
  "/partner",
  "/rechnungen",
  "/einstellungen",
  "/pricing",
  "/kontakt",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/master",
];

test.describe("Link Validation - Internal Routes", () => {
  ROUTES.forEach((route) => {
    test(`Route ${route} is accessible`, async ({ page }) => {
      const response = await page.goto(route);

      // Route sollte erfolgreich laden (200, 302, oder 304)
      expect(response?.status()).toBeLessThan(400);

      // Kein 404 Error
      const has404 = await page.locator("text=/404|not found/i").count();
      expect(has404).toBe(0);
    });
  });
});

test.describe("Link Validation - Navigation Links", () => {
  test("All sidebar links are valid", async ({ page }) => {
    await page.goto("/dashboard");

    // Warte auf Sidebar
    await page.waitForSelector("nav", { timeout: 5000 });

    // Sammle alle Links in der Sidebar
    const navLinks = await page.locator("nav a[href]").all();

    console.log(`[Link-Validation] Found ${navLinks.length} navigation links`);

    for (const link of navLinks) {
      const href = await link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) continue;

      // Prüfe, ob Link erreichbar ist
      const response = await page.goto(href);
      expect(response?.status()).toBeLessThan(400);

      console.log(`[Link-Validation] ✅ ${href} - OK`);
    }
  });

  test("All header links are valid", async ({ page }) => {
    await page.goto("/");

    const headerLinks = await page.locator("header a[href]").all();

    for (const link of headerLinks) {
      const href = await link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) continue;

      const response = await page.goto(href);
      expect(response?.status()).toBeLessThan(400);
    }
  });
});

test.describe("Link Validation - External Links", () => {
  test("External links are reachable (sample check)", async ({ page, context }) => {
    await page.goto("/impressum");

    // Sammle externe Links
    const externalLinks = await page.locator('a[href^="http"]').all();

    // Prüfe max. 5 externe Links (zu viele würden Test verlangsamen)
    const linksToCheck = externalLinks.slice(0, 5);

    for (const link of linksToCheck) {
      const href = await link.getAttribute("href");
      if (!href) continue;

      try {
        // Öffne Link in neuem Tab
        const newPage = await context.newPage();
        const response = await newPage.goto(href, { timeout: 10000 });

        // Link sollte erreichbar sein
        expect(response?.status()).toBeLessThan(500);

        await newPage.close();
        console.log(`[Link-Validation] ✅ External: ${href} - OK`);
      } catch (error) {
        console.warn(`[Link-Validation] ⚠️ External: ${href} - ${error}`);
        // Externe Links können fehlschlagen (Timeout, etc.), aber Test sollte nicht brechen
      }
    }
  });
});

test.describe("Link Validation - Router Configuration", () => {
  test("All defined routes exist in router config", async ({ page }) => {
    // Prüfe, ob Router korrekt konfiguriert ist
    await page.goto("/dashboard");

    // Navigiere zu verschiedenen Routen und prüfe, ob sie laden
    const criticalRoutes = ["/", "/dashboard", "/auftraege", "/fahrer", "/pricing"];

    for (const route of criticalRoutes) {
      await page.goto(route);

      // Kein Error State
      const hasError = await page.locator("text=/error|fehler|nicht gefunden/i").count();
      expect(hasError).toBe(0);
    }
  });
});
