import { test, expect } from '@playwright/test';

/**
 * Tab-System E2E Tests V18.5.1
 * 
 * Validiert APP_PAGE_TEMPLATE V18.5.1 Tab-System Requirements:
 * - Volle Breite (w-full)
 * - Gleichmäßige Verteilung (flex-1)
 * - Keine Rundungen zwischen Tabs (rounded-none)
 * - Nur erste Tab: rounded-tl-lg
 * - Nur letzte Tab: rounded-tr-lg
 */

test.describe('Tab-System Design V18.5.1', () => {
  test('Aufträge Tab-System ist vollfächig', async ({ page }) => {
    // Login first (required for /auftraege)
    await page.goto('/auth');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to Aufträge
    await page.goto('/auftraege');
    await page.waitForLoadState('networkidle');

    // Check TabsList has w-full
    const tabsList = page.locator('[role="tablist"]').first();
    await expect(tabsList).toBeVisible();

    const tabsListClasses = await tabsList.getAttribute('class');
    expect(tabsListClasses).toContain('w-full');

    // Check all TabsTriggers have flex-1 and rounded-none
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();

    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      const classes = await tab.getAttribute('class');

      expect(classes).toContain('flex-1');
      expect(classes).toContain('rounded-none');

      // First tab should have rounded-tl-lg
      if (i === 0) {
        expect(classes).toContain('first:rounded-tl-lg');
      }

      // Last tab should have rounded-tr-lg
      if (i === tabCount - 1) {
        expect(classes).toContain('last:rounded-tr-lg');
      }
    }
  });

  test('Partner Tab-System ist vollfächig', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to Partner
    await page.goto('/partner');
    await page.waitForLoadState('networkidle');

    // Check TabsList has w-full
    const tabsList = page.locator('[role="tablist"]').first();
    if (await tabsList.isVisible()) {
      const tabsListClasses = await tabsList.getAttribute('class');
      expect(tabsListClasses).toContain('w-full');

      // Check TabsTriggers
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();

      for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        const classes = await tab.getAttribute('class');

        expect(classes).toContain('flex-1');
        expect(classes).toContain('rounded-none');
      }
    }
  });

  test('Tab-Switches funktionieren korrekt', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to Aufträge
    await page.goto('/auftraege');
    await page.waitForLoadState('networkidle');

    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();

    // Test switching between tabs
    for (let i = 0; i < tabCount; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute('data-state', 'active');
    }
  });

  test('Touch-Targets sind mindestens 44px hoch', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to Aufträge
    await page.goto('/auftraege');
    await page.waitForLoadState('networkidle');

    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();

    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      const classes = await tab.getAttribute('class');

      // Check for min-h-[44px]
      expect(classes).toMatch(/min-h-\[44px\]/);
    }
  });
});
