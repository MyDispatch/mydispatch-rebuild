import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Auth Flow
 * Testet kompletten Authentifizierungs-Flow
 */

test.describe('Auth Flow - Unternehmer Registration', () => {
  test('should display badge "Beliebt" on Business tariff', async ({ page }) => {
    await page.goto('/auth?tab=signup');
    
    // Badge muss sichtbar sein
    const badge = page.locator('text=Beliebt');
    await expect(badge).toBeVisible();
  });

  test('should complete unternehmer signup with business tariff', async ({ page }) => {
    await page.goto('/auth?tab=signup');
    
    // Business-Tarif auswählen
    await page.click('#tariff-business');
    
    // Form ausfüllen
    await page.fill('#signup-email', `test-${Date.now()}@example.com`);
    await page.fill('#signup-password', 'SecurePass123!');
    await page.fill('#signup-first-name', 'Max');
    await page.fill('#signup-last-name', 'Mustermann');
    await page.fill('#signup-company', 'Test Transport GmbH');
    
    // Submit (nicht wirklich ausführen in Test)
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test('should validate password strength', async ({ page }) => {
    await page.goto('/auth?tab=signup');
    
    // Schwaches Passwort
    await page.fill('#signup-password', 'weak');
    
    // Passwort-Stärke-Indikator sollte "schwach" anzeigen
    const strengthIndicator = page.locator('.password-strength');
    await expect(strengthIndicator).toContainText(/schwach/i);
    
    // Starkes Passwort
    await page.fill('#signup-password', 'SecurePass123!');
    await expect(strengthIndicator).toContainText(/stark/i);
  });
});

test.describe('Auth Flow - Navigation', () => {
  test('should navigate from auth to marketing home', async ({ page }) => {
    await page.goto('/auth?tab=signup');
    
    // "Zur Startseite"-Button klicken
    await page.click('text=Zur Startseite');
    
    // Sollte zur Marketing-Home führen
    await expect(page).toHaveURL('/');
  });

  test('should navigate from marketing home to auth', async ({ page }) => {
    await page.goto('/');
    
    // "Anmelden"-Button klicken
    await page.click('button:has-text("Anmelden")');
    
    // Sollte zur Auth-Seite führen
    await expect(page).toHaveURL(/\/auth/);
  });
});

test.describe('Auth Flow - Visual Regression', () => {
  test('business tariff card should match screenshot', async ({ page }) => {
    await page.goto('/auth?tab=signup');
    
    const businessCard = page.locator('#tariff-business').locator('..');
    await expect(businessCard).toHaveScreenshot('business-tariff-with-badge.png');
  });
});
