import { test, expect } from '@playwright/test';

/**
 * AUTH E2E TESTS V18.5.0
 * 
 * Kritische User-Flows:
 * - Login
 * - Logout
 * - Signup (disabled in test, but flow exists)
 * - Password-Reset
 */

test.describe('Authentication Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/auth');
    
    // Prüfe ob Login-Form sichtbar
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
  
  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth');
    
    // Submit ohne Daten
    await page.click('button[type="submit"]');
    
    // Erwarte Validierungs-Fehler
    await expect(page.locator('text=/Email|Passwort.*erforderlich/i')).toBeVisible({
      timeout: 5000
    });
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Erwarte Error-Toast
    await expect(page.locator('text=/Ungültig|Fehler|Invalid/i')).toBeVisible({
      timeout: 5000
    });
  });
  
  test('should redirect to dashboard after successful login', async ({ page }) => {
    await page.goto('/auth');
    
    // Verwende Test-User aus Secrets
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@mydispatch.de');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'test123');
    await page.click('button[type="submit"]');
    
    // Warte auf Redirect
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Prüfe ob Dashboard geladen
    await expect(page.locator('text=/Dashboard|Willkommen/i')).toBeVisible();
  });
  
  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@mydispatch.de');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Logout via Settings oder Header-Menu
    await page.click('[aria-label="Menü öffnen"], button:has-text("Menü")').catch(() => {});
    await page.click('text=/Abmelden|Logout/i');
    
    // Prüfe Redirect zu Login
    await page.waitForURL('/auth', { timeout: 5000 });
  });
});
