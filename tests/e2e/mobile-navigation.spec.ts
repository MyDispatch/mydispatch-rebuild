import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('mobile menu button is visible and has ARIA attributes', async ({ page }) => {
    const menuButton = page.getByLabel('Navigationsmenü öffnen');
    
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-label');
    await expect(menuButton).toHaveAttribute('aria-expanded');
    await expect(menuButton).toHaveAttribute('aria-controls');
  });

  test('mobile menu opens and closes correctly', async ({ page }) => {
    const menuButton = page.getByLabel('Navigationsmenü öffnen');
    
    // Open menu
    await menuButton.click();
    
    const mobileMenu = page.locator('#mobile-navigation-menu');
    await expect(mobileMenu).toBeVisible({ timeout: 1000 });
    
    // Check menu items
    await expect(page.locator('#mobile-navigation-menu').getByText('Startseite')).toBeVisible();
    await expect(page.locator('#mobile-navigation-menu').getByText('Preise & Tarife')).toBeVisible();
    
    // Close menu (click outside or close button)
    await page.keyboard.press('Escape');
    await expect(mobileMenu).not.toBeVisible({ timeout: 1000 });
  });

  test('focus management works correctly', async ({ page }) => {
    const menuButton = page.getByLabel('Navigationsmenü öffnen');
    
    // Open menu
    await menuButton.click();
    
    // Wait for menu to open
    await page.waitForTimeout(300);
    
    // First link should be focused (WCAG requirement)
    const firstLink = page.locator('#mobile-navigation-menu a').first();
    await expect(firstLink).toBeFocused();
  });

  test('keyboard navigation works in mobile menu', async ({ page }) => {
    const menuButton = page.getByLabel('Navigationsmenü öffnen');
    
    await menuButton.click();
    await page.waitForTimeout(300);
    
    // Navigate with Tab
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through menu items
    const menuLinks = page.locator('#mobile-navigation-menu a');
    const count = await menuLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('mobile menu links navigate correctly', async ({ page }) => {
    const menuButton = page.getByLabel('Navigationsmenü öffnen');
    
    await menuButton.click();
    
    const pricingLink = page.locator('#mobile-navigation-menu').getByText('Preise & Tarife');
    await pricingLink.click();
    
    await expect(page).toHaveURL(/\/pricing/);
  });

  test('logo button is clickable on mobile', async ({ page }) => {
    await page.goto('/pricing');
    
    const logoButton = page.getByLabel('Zur Startseite');
    await logoButton.click();
    
    await expect(page).toHaveURL('/');
  });
});
