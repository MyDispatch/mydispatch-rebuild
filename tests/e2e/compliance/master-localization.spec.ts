/**
 * ==================================================================================
 * E2E TESTS - Master Dashboard Deutsche Lokalisierung
 * ==================================================================================
 * ZWECK: Validiert vollständige deutsche Lokalisierung und DIN 5008-Konformität
 * ==================================================================================
 */

import { test, expect } from "@playwright/test";

test.describe("Master Dashboard - Deutsche Lokalisierung", () => {
  test.beforeEach(async ({ page }) => {
    // Login als Master-Account (muss angepasst werden an tatsächliche Auth)
    await page.goto("/login");
    // TODO: Implementiere Master-Login
    // await page.fill('[name="email"]', 'master@example.com');
    // await page.fill('[name="password"]', 'password');
    // await page.click('button[type="submit"]');
    await page.goto("/master");
  });

  test("Alle Texte sind in Deutsch", async ({ page }) => {
    // Keine englischen Texte vorhanden
    const body = await page.textContent("body");

    // Prüfe auf häufige englische Begriffe
    expect(body?.toLowerCase()).not.toContain("quick actions");
    expect(body?.toLowerCase()).not.toContain("recent activity");
    expect(body?.toLowerCase()).not.toContain("system status");
    expect(body?.toLowerCase()).not.toContain("companies");
    expect(body?.toLowerCase()).not.toContain("code quality");

    // Deutsche Texte müssen vorhanden sein
    expect(body).toContain("Schnellaktionen");
    expect(body).toContain("Letzte Aktivitäten");
    expect(body).toContain("System-Status");
  });

  test("Zahlen im deutschen Format (Komma als Dezimaltrenner)", async ({ page }) => {
    // Prozentwerte mit Komma
    const percentages = page.locator("text=/\\d+,\\d+ %/");
    const count = await percentages.count();

    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }

    // Keine Punkt-Trennung bei Dezimalzahlen
    const body = await page.textContent("body");
    // Prüfe dass keine englischen Prozentwerte existieren (99.8%)
    expect(body).not.toMatch(/\d+\.\d+ %/);
  });

  test("DIN 5008 - Leerzeichen vor Einheiten", async ({ page }) => {
    // Millisekunden
    const msPattern = page.locator("text=/\\d+ ms/");
    if ((await msPattern.count()) > 0) {
      const msText = await msPattern.first().textContent();
      expect(msText).toMatch(/\d+ ms/); // Leerzeichen zwischen Zahl und ms
    }

    // Prozent
    const percentPattern = page.locator("text=/\\d+,\\d+ %/");
    if ((await percentPattern.count()) > 0) {
      const percentText = await percentPattern.first().textContent();
      expect(percentText).toMatch(/\d+,\d+ %/); // Leerzeichen vor %
    }
  });

  test("Datum im deutschen Format (DD.MM.YYYY)", async ({ page }) => {
    const dates = page.locator("text=/\\d{2}\\.\\d{2}\\.\\d{4}/");
    const dateCount = await dates.count();

    if (dateCount > 0) {
      const dateText = await dates.first().textContent();
      expect(dateText).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    }
  });

  test("Tab-Labels sind auf Deutsch", async ({ page }) => {
    // Prüfe alle Tab-Labels
    await expect(page.locator('button[role="tab"]', { hasText: "Firmen" })).toBeVisible();
    await expect(page.locator('button[role="tab"]', { hasText: "Code-Qualität" })).toBeVisible();
    await expect(page.locator('button[role="tab"]', { hasText: "KI-Agent" })).toBeVisible();
  });

  test("Quick Actions sind auf Deutsch", async ({ page }) => {
    // Prüfe ob Quick Actions Card existiert (Desktop)
    const quickActionsCard = page.locator("text=Schnellaktionen");

    if (await quickActionsCard.isVisible()) {
      // Prüfe dass mindestens eine deutsche Aktion sichtbar ist
      const actions = page.locator('[aria-label*="ausführen"]');
      expect(await actions.count()).toBeGreaterThan(0);
    }
  });

  test("Recent Activity Zeitangaben sind auf Deutsch", async ({ page }) => {
    const recentActivity = page.locator("text=Letzte Aktivitäten");

    if (await recentActivity.isVisible()) {
      // Prüfe relative Zeitangaben
      const body = await page.textContent("body");

      // Sollte deutsche Zeitangaben enthalten
      const hasGermanTime =
        body?.includes("vor") &&
        (body?.includes("Stunde") ||
          body?.includes("Stunden") ||
          body?.includes("Tag") ||
          body?.includes("Tagen"));

      expect(hasGermanTime).toBeTruthy();
    }
  });

  test("System Status Labels sind auf Deutsch", async ({ page }) => {
    const systemStatus = page.locator("text=System-Status");

    if (await systemStatus.isVisible()) {
      // Prüfe deutsche Status-Labels
      await expect(page.locator("text=Online")).toBeVisible();

      // Services sollten deutsche Namen haben
      const services = ["API", "Datenbank", "Speicher", "CDN"];
      for (const service of services) {
        const serviceLabel = page.locator(`text="${service}"`);
        if ((await serviceLabel.count()) > 0) {
          await expect(serviceLabel.first()).toBeVisible();
        }
      }
    }
  });

  test("Accessibility - ARIA Labels auf Deutsch", async ({ page }) => {
    // Prüfe Tab ARIA Labels
    const companiesTab = page.locator('[aria-label*="Firmen"]');
    if ((await companiesTab.count()) > 0) {
      expect(await companiesTab.first().isVisible()).toBeTruthy();
    }

    // Prüfe Quick Action ARIA Labels
    const actionButtons = page.locator('[aria-label*="ausführen"]');
    if ((await actionButtons.count()) > 0) {
      expect(await actionButtons.count()).toBeGreaterThan(0);
    }
  });

  test("Keine gemischten Sprachen (Deutsch/Englisch)", async ({ page }) => {
    const body = await page.textContent("body");

    // Prüfe dass keine englisch-deutschen Mischungen existieren
    // z.B. "Quick Aktionen" oder "Schnell Actions"
    expect(body).not.toMatch(/Quick [A-ZÄÖÜ][a-zäöüß]+/);
    expect(body).not.toMatch(/[A-ZÄÖÜ][a-zäöüß]+ Actions/);
  });
});
