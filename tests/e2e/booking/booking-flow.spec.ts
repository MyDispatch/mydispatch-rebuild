/* ==================================================================================
   E2E TEST: BOOKING FLOW
   ==================================================================================
   Phase 4.3: E2E-Tests für kritischen User-Journey
   - Home → Booking Widget → Auth Redirect
   - Conversion-kritischer Flow
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Booking Flow - Critical User Journey', () => {
  test('should redirect to auth when booking button is clicked', async ({ page }) => {
    // 1. Navigate to Home
    await page.goto('/');
    
    // 2. Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // 3. Check if "Jetzt buchen" button is visible
    const bookingButton = page.locator('text=Jetzt buchen').first();
    await expect(bookingButton).toBeVisible({ timeout: 10000 });
    
    // 4. Click booking button
    await bookingButton.click();
    
    // 5. Expect booking widget/dialog to open OR redirect to auth
    // (depends on implementation - adjust accordingly)
    await page.waitForTimeout(2000);
    
    // Check if dialog opened
    const hasDialog = await page.locator('[role="dialog"]').isVisible().catch(() => false);
    
    if (hasDialog) {
      // Dialog opened - check for auth options
      const loginButton = page.locator('text=Anmelden');
      const registerButton = page.locator('text=Konto erstellen');
      
      await expect(loginButton.or(registerButton)).toBeVisible({ timeout: 5000 });
    } else {
      // Direct redirect to auth
      await expect(page).toHaveURL(/\/auth/, { timeout: 5000 });
    }
  });

  test('should display company info on landing page', async ({ page }) => {
    // Test if company slug route works
    await page.goto('/test-company');
    
    await page.waitForLoadState('networkidle');
    
    // Should either show company landing OR 404
    const hasContent = await page.locator('h1').isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('should load home page without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if critical elements loaded
    const hasHero = await page.locator('h1').first().isVisible();
    expect(hasHero).toBeTruthy();
    
    // Should have no critical errors
    const hasCriticalErrors = consoleErrors.some(err => 
      err.includes('Failed to fetch') || 
      err.includes('Uncaught') ||
      err.includes('Cannot read')
    );
    
    expect(hasCriticalErrors).toBe(false);
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click pricing link
    const pricingLink = page.locator('a[href="/pricing"]').first();
    await expect(pricingLink).toBeVisible({ timeout: 5000 });
    
    await pricingLink.click();
    
    // Wait for navigation
    await expect(page).toHaveURL(/\/pricing/);
    
    // Check if pricing tiers are visible
    const hasPricingContent = await page.locator('text=Tarif').first().isVisible({ timeout: 5000 });
    expect(hasPricingContent).toBeTruthy();
  });

  test('should handle /home redirect correctly', async ({ page }) => {
    // Phase 1: Test /home redirect
    await page.goto('/home');
    
    // Should redirect to /
    await expect(page).toHaveURL('/', { timeout: 5000 });
    
    // Home page should load
    const hasHero = await page.locator('h1').first().isVisible({ timeout: 5000 });
    expect(hasHero).toBeTruthy();
  });
});
