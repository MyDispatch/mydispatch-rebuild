import { test, expect } from "@playwright/test";

/**
 * NAVIGATION E2E TESTS V18.5.0
 *
 * Prüft alle Sidebar-Links und kritische Navigation-Flows
 */

test.describe("Sidebar Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/auth");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@mydispatch.de");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "test123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard", { timeout: 10000 });
  });

  const routes = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/auftraege", name: "Aufträge" },
    { path: "/kunden", name: "Kunden" },
    { path: "/fahrer", name: "Fahrer" },
    { path: "/schichtzettel", name: "Schichtzettel" },
    { path: "/rechnungen", name: "Rechnungen" },
    { path: "/kostenstellen", name: "Kostenstellen" },
    { path: "/dokumente", name: "Dokumente" },
    { path: "/kommunikation", name: "Kommunikation" },
    { path: "/einstellungen", name: "Einstellungen" },
  ];

  for (const route of routes) {
    test(`should navigate to ${route.name}`, async ({ page }) => {
      await page.goto(route.path);

      // Prüfe ob URL korrekt
      await expect(page).toHaveURL(route.path);

      // Prüfe ob Seite geladen (keine 404)
      await expect(page.locator("text=/404|Not Found/i")).not.toBeVisible();

      // Prüfe ob aktiver Sidebar-Link markiert ist
      const sidebarLink = page.locator(`aside a[href="${route.path}"]`);
      await expect(sidebarLink).toHaveClass(/bg-primary|active/);
    });
  }
});

test.describe("Public Routes", () => {
  const publicRoutes = [
    { path: "/", name: "Home" },
    { path: "/pricing", name: "Pricing" },
    { path: "/contact", name: "Contact" },
    { path: "/faq", name: "FAQ" },
  ];

  for (const route of publicRoutes) {
    test(`should access ${route.name} without auth`, async ({ page }) => {
      await page.goto(route.path);

      // Prüfe ob Seite lädt (kein Auth-Redirect)
      await expect(page).toHaveURL(route.path);
      await expect(page.locator("text=/404|Not Found/i")).not.toBeVisible();
    });
  }
});
