import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('home page has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('pricing page has no accessibility violations', async ({ page }) => {
    await page.goto('/pricing');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('FAQ page has no accessibility violations', async ({ page }) => {
    await page.goto('/faq');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('auth page has no accessibility violations', async ({ page }) => {
    await page.goto('/auth');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works for main interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    
    // Logo should be focusable
    const logoButton = page.getByLabel('Zur Startseite');
    await logoButton.focus();
    await expect(logoButton).toBeFocused();
    
    // CTA button should be focusable
    await page.keyboard.press('Tab');
    const ctaButton = page.getByRole('button', { name: /Jetzt kostenlos testen/i });
    await expect(ctaButton).toBeFocused();
  });

  test('slider controls are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    const pauseButton = page.getByLabel(/Automatische Wiedergabe/);
    await pauseButton.focus();
    await expect(pauseButton).toBeFocused();
    
    await page.keyboard.press('Enter');
    // Should toggle pause state
    await expect(page.getByLabel('Automatische Wiedergabe starten')).toBeVisible();
  });

  test('mobile menu is keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuButton = page.getByLabel('Navigationsmenü öffnen');
    await menuButton.focus();
    await expect(menuButton).toBeFocused();
    
    await page.keyboard.press('Enter');
    
    // Menu should open
    await expect(page.locator('#mobile-navigation-menu')).toBeVisible({ timeout: 1000 });
  });

  test('all interactive elements have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('button, a, input')
      .analyze();
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });

  test('all buttons have accessible labels', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const hasLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(hasLabel || hasText).toBeTruthy();
    }
  });
});
