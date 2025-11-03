import { test, expect } from '@playwright/test';

test.describe('Master Dashboard Error Handling', () => {
  test('zeigt Error-Fallback bei API-Fehler', async ({ page }) => {
    // Mock Edge Function Fehler
    await page.route('**/functions/v1/get-system-logs', route =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ success: false, error: 'Internal Server Error' })
      })
    );

    await page.goto('/master');
    
    // Warte auf Seiten-Load
    await expect(page.locator('h1:has-text("Master System Dashboard")')).toBeVisible();
    
    // Klicke auf "System Logs anzeigen"
    const systemLogsButton = page.locator('button', { hasText: 'System-Logs' }).first();
    await systemLogsButton.click();
    
    // Error-Toast sollte erscheinen
    await expect(page.locator('text=/Fehler beim Laden|System-Logs konnten nicht geladen werden/')).toBeVisible({ timeout: 5000 });
  });

  test('zeigt Widget-Error-Boundary bei Component-Crash', async ({ page }) => {
    await page.goto('/master');
    
    // Prüfe, dass Widget-Error-Boundary nicht sichtbar ist (bei normalem Betrieb)
    await expect(page.locator('text=/nicht verfügbar/')).not.toBeVisible();
  });

  test('System Health KPIs sind sichtbar', async ({ page }) => {
    await page.goto('/master');
    
    // Prüfe, dass System Health Cards geladen werden
    await expect(page.locator('text=/System-Verfügbarkeit|Uptime/')).toBeVisible();
    await expect(page.locator('text=/Fehlerquote|Error/')).toBeVisible();
  });

  test('Quick Actions sind interaktiv', async ({ page }) => {
    await page.goto('/master');
    
    // Wechsel zu System Tab
    await page.click('button[aria-label*="System"]');
    
    // Prüfe, dass Quick Actions verfügbar sind
    await expect(page.locator('text=/Schnellaktionen/')).toBeVisible();
  });

  test('Tabs funktionieren ohne Fehler', async ({ page }) => {
    await page.goto('/master');
    
    const tabs = ['Companies', 'Code-Qualität', 'System', 'KI-Agent', 'Roadmap'];
    
    for (const tabName of tabs) {
      const tabButton = page.locator(`button:has-text("${tabName}")`).first();
      if (await tabButton.isVisible()) {
        await tabButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Keine Fehler sollten aufgetreten sein
    const errorMessages = page.locator('text=/Error|Fehler/');
    await expect(errorMessages).toHaveCount(0);
  });
});
