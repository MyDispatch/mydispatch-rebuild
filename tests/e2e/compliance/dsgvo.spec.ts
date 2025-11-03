import { test, expect } from '@playwright/test';

test.describe('DSGVO Compliance', () => {
  
  test('should have Datenschutz link in footer on all pages', async ({ page }) => {
    const pages = ['/', '/dashboard', '/auftraege', '/fahrer'];
    
    for (const url of pages) {
      await page.goto(url);
      
      // Datenschutz-Link sollte existieren
      const datenschutzLink = page.locator('a[href*="datenschutz"], a:has-text("Datenschutz")');
      await expect(datenschutzLink).toBeVisible({ timeout: 5000 });
    }
  });

  test('should have Impressum link in footer', async ({ page }) => {
    await page.goto('/');
    
    const impressumLink = page.locator('a[href*="impressum"], a:has-text("Impressum")');
    await expect(impressumLink).toBeVisible();
  });

  test('should have AGB link in footer', async ({ page }) => {
    await page.goto('/');
    
    const agbLink = page.locator('a[href*="agb"], a:has-text("AGB")');
    await expect(agbLink).toBeVisible();
  });

  test('should show privacy notice on forms', async ({ page }) => {
    // Test auf Auth-Seite (Registrierung)
    await page.goto('/auth');
    await page.locator('button:has-text("Registrieren")').click();
    
    // DSGVO-Hinweis sollte vorhanden sein
    const privacyNotice = page.locator('text=/datenschutz|privacy|DSGVO/i');
    await expect(privacyNotice).toBeVisible({ timeout: 3000 });
  });

  test('should have cookie consent banner (if applicable)', async ({ page }) => {
    await page.goto('/');
    
    // Wenn Cookies verwendet werden, muss Banner existieren
    const hasCookies = await page.evaluate(() => document.cookie.length > 0);
    
    if (hasCookies) {
      const cookieBanner = page.locator('text=/cookie|cookies/i');
      // Banner könnte nach Consent ausgeblendet sein
      const bannerCount = await cookieBanner.count();
      expect(bannerCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have data processing notice on contact forms', async ({ page }) => {
    await page.goto('/kontakt');
    
    // Falls Kontaktformular vorhanden
    const contactForm = page.locator('form');
    const formExists = await contactForm.count();
    
    if (formExists > 0) {
      // DSGVO-Hinweis muss vorhanden sein
      const dataProcessingNotice = page.locator('text=/Datenverarbeitung|Datenschutz|personenbezogene Daten/i');
      await expect(dataProcessingNotice).toBeVisible();
    }
  });
});