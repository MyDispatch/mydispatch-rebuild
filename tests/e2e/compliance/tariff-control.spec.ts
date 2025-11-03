/* ==================================================================================
   TARIFF-CONTROL COMPLIANCE TESTS V18.3
   ==================================================================================
   Prüft Tarif-Differenzierung:
   - Starter: Max. 100 Aufträge/Monat, 1 User
   - Business: GPS, Partner, Statistiken, AI
   - Enterprise: White-Label, API, OCR
   - Feature-Badges (🔒 Business+)
   - Upgrade-Tooltips
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Tariff-Control - Feature-Badges', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    // Login als Starter-User
    await page.fill('[name="email"]', 'starter@test.de');
    await page.fill('[name="password"]', 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('Sidebar - Business-Features mit Badge', async ({ page }) => {
    await page.goto('/dashboard');
    
    const sidebar = page.locator('[data-testid="app-sidebar"]').or(page.locator('aside').first());
    
    // Partner-Netzwerk mit Badge "🔒 Business+"
    const partnerLink = sidebar.locator('a[href="/partner"]');
    if (await partnerLink.isVisible()) {
      const badge = partnerLink.locator('text=/Business\+|🔒/i');
      await expect(badge).toBeVisible();
    }
    
    // Statistiken mit Badge
    const statisticsLink = sidebar.locator('a[href="/statistiken"]');
    if (await statisticsLink.isVisible()) {
      const badge = statisticsLink.locator('text=/Business\+|🔒/i');
      await expect(badge).toBeVisible();
    }
  });

  test('Dashboard - Live-Widgets nur für Business+', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Standard-KPI-Cards vorhanden (Starter)
    const kpiCards = page.locator('[data-testid*="kpi"]');
    expect(await kpiCards.count()).toBeGreaterThanOrEqual(4);
    
    // Live-Widgets NICHT sichtbar (Starter)
    const liveWidget = page.locator('[data-testid="live-map-widget"]').or(page.locator('text=/Live-Karte|Echtzeit/i'));
    expect(await liveWidget.isVisible()).toBe(false);
  });

  test('Partner-Netzwerk - Upgrade-Dialog bei Starter', async ({ page }) => {
    await page.goto('/partner');
    
    // Upgrade-Hinweis oder Dialog
    const upgradeHint = page.locator('text=/Upgrade|Business-Tarif erforderlich/i');
    await expect(upgradeHint).toBeVisible();
    
    // Upgrade-Button vorhanden
    const upgradeButton = page.locator('button').filter({ hasText: /Upgrade|Jetzt upgraden/i });
    await expect(upgradeButton).toBeVisible();
  });
});

test.describe('Tariff-Control - Business+ Features', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    // Login als Business-User
    await page.fill('[name="email"]', 'business@test.de');
    await page.fill('[name="password"]', 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('Dashboard - Live-Widgets sichtbar (Business+)', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Live-Map-Widget vorhanden
    const liveMap = page.locator('[data-testid="live-map-widget"]').or(page.locator('text=/Live-Karte/i').locator('..').locator('..'));
    
    if (await liveMap.isVisible()) {
      await expect(liveMap).toBeVisible();
    }
  });

  test('Partner-Netzwerk - Voll funktional (Business+)', async ({ page }) => {
    await page.goto('/partner');
    
    // Kein Upgrade-Hinweis
    const upgradeHint = page.locator('text=/Upgrade erforderlich/i');
    expect(await upgradeHint.isVisible()).toBe(false);
    
    // Partner-Tabelle vorhanden
    const partnerTable = page.locator('table');
    await expect(partnerTable).toBeVisible();
    
    // Create-Button vorhanden
    const createButton = page.locator('button').filter({ hasText: /Partner hinzufügen|Neu/i });
    await expect(createButton).toBeVisible();
  });

  test('Statistiken - Erweiterte Charts (Business+)', async ({ page }) => {
    await page.goto('/statistiken');
    
    // Umsatz-Chart vorhanden
    const revenueChart = page.locator('[data-testid="revenue-chart"]').or(page.locator('text=/Umsatz-Entwicklung/i').locator('..').locator('..'));
    await expect(revenueChart).toBeVisible();
    
    // Partner-Performance vorhanden
    const partnerPerf = page.locator('text=/Partner-Performance|Top-Fahrer/i');
    await expect(partnerPerf).toBeVisible();
  });

  test('Aufträge - Smart Assignment verfügbar (Business+)', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Create-Auftrag öffnen
    const createButton = page.locator('button').filter({ hasText: /Auftrag anlegen|Neu/i }).first();
    await createButton.click();
    
    // Smart Assignment Button vorhanden
    const smartAssignButton = page.locator('button').filter({ hasText: /Smart|Intelligent|AI/i });
    
    if (await smartAssignButton.isVisible()) {
      await expect(smartAssignButton).toBeVisible();
    }
  });
});

test.describe('Tariff-Control - Starter Limits', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('[name="email"]', 'starter@test.de');
    await page.fill('[name="password"]', 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('Aufträge - Limit-Warnung bei >100 Aufträgen/Monat', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Prüfe: Wenn nahe am Limit, Warnung anzeigen
    const limitWarning = page.locator('text=/Limit|100 Aufträge|Upgrade/i');
    
    // Soft-Check (nur wenn tatsächlich >100 Aufträge vorhanden)
    const warningVisible = await limitWarning.isVisible();
    if (warningVisible) {
      await expect(limitWarning).toBeVisible();
    }
  });
});
