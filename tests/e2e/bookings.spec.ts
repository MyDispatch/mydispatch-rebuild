import { test, expect } from '@playwright/test';

/**
 * BOOKINGS E2E TESTS V18.5.0
 * 
 * Kritische User-Flows:
 * - Auftragsliste laden
 * - Neuen Auftrag erstellen
 * - Auftrag bearbeiten
 * - Auftrag archivieren
 */

test.describe('Booking Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login vor jedem Test
    await page.goto('/auth');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@mydispatch.de');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });
  
  test('should navigate to bookings page', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Prüfe ob Seite geladen
    await expect(page.locator('h1, h2').filter({ hasText: /Aufträge|Buchungen/i })).toBeVisible();
  });
  
  test('should display bookings list', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Warte auf Datenladen (Loading-State oder Daten)
    await page.waitForTimeout(2000);
    
    // Prüfe ob Tabelle oder Cards vorhanden
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    const hasCards = await page.locator('[data-testid="booking-card"]').isVisible().catch(() => false);
    
    expect(hasTable || hasCards).toBeTruthy();
  });
  
  test('should open create booking dialog', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Klick auf "Neuer Auftrag" Button
    await page.click('button:has-text("Neuer Auftrag"), button:has-text("Auftrag erstellen")');
    
    // Prüfe ob Dialog geöffnet
    await expect(page.locator('text=/Neuer Auftrag|Auftrag erstellen/i')).toBeVisible();
  });
  
  test('should validate required booking fields', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Öffne Dialog
    await page.click('button:has-text("Neuer Auftrag"), button:has-text("Auftrag erstellen")');
    
    // Submit ohne Daten
    await page.click('button[type="submit"]:has-text("Erstellen"), button:has-text("Speichern")');
    
    // Erwarte Validierungs-Fehler
    await expect(page.locator('text=/erforderlich|required/i')).toBeVisible({
      timeout: 3000
    });
  });
});
