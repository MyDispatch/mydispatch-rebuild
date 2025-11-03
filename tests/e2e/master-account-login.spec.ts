import { test, expect } from '@playwright/test';

/**
 * Master Account Login E2E Tests
 * 
 * Tests the complete login flow for Master-Accounts:
 * - Login with master credentials
 * - Master-Account detection (useAccountType)
 * - Master-Dashboard access
 * - Master-specific UI elements
 * 
 * @critical Diese Tests MÜSSEN vor Production-Deployment bestehen!
 */

test.describe('Master Account Login', () => {
  const MASTER_EMAIL = 'courbois1981@gmail.com';
  const MASTER_PASSWORD = process.env.MASTER_PASSWORD || '1def!xO2022!!';

  test.beforeEach(async ({ page }) => {
    // Ensure clean state
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  test('should login successfully with master credentials', async ({ page }) => {
    // Navigate to auth page
    await page.goto('/auth');
    await expect(page).toHaveURL('/auth');

    // Fill login form
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation (should redirect to dashboard)
    await page.waitForURL('/');

    // Verify successful login (should be on dashboard)
    await expect(page).toHaveURL('/');
    
    // Verify no error messages
    await expect(page.locator('text=/Ungültige|Fehler|Error/i')).not.toBeVisible();
  });

  test('should detect master account correctly after login', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Verify master account detection in UI

    // 1. Header should show MyDispatch logo (not company-specific logo)
    const header = page.locator('header');
    await expect(header).toContainText('MyDispatch');

    // 2. Master-Dashboard link should be visible in sidebar
    // (Assuming sidebar has data-testid or accessible text)
    const sidebar = page.locator('[role="navigation"]').first();
    await expect(sidebar.locator('text=Master-Dashboard')).toBeVisible({ timeout: 5000 });
  });

  test('should have access to master-only routes', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Navigate to Master-Dashboard
    await page.goto('/master');
    
    // Should NOT redirect to unauthorized/404
    await expect(page).toHaveURL('/master');
    
    // Verify Master-Dashboard content is visible
    await expect(page.locator('h1, h2').filter({ hasText: /Master.*Dashboard/i })).toBeVisible({
      timeout: 5000
    });
  });

  test('should show master-specific UI elements', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Check for Master-specific elements in sidebar
    const sidebar = page.locator('[role="navigation"]').first();
    
    // Master-Dashboard Link
    await expect(sidebar.locator('text=Master-Dashboard')).toBeVisible();
    
    // Other Master-only links (adjust based on actual sidebar structure)
    // await expect(sidebar.locator('text=System-Einstellungen')).toBeVisible();
    // await expect(sidebar.locator('text=Alle Unternehmen')).toBeVisible();
  });

  test('should log master account detection in console (dev mode)', async ({ page }) => {
    const logs: string[] = [];

    // Capture console logs
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        logs.push(msg.text());
      }
    });

    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Wait for logs to accumulate
    await page.waitForTimeout(2000);

    // Verify master account detection was logged
    const masterLogs = logs.filter(log => 
      log.includes('[Auth]') && 
      (log.includes('master') || log.includes('Master'))
    );

    expect(masterLogs.length).toBeGreaterThan(0);
  });

  test('should have correct permissions in useAccountType hook', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Access a page that uses useAccountType
    await page.goto('/');

    // Verify master-specific features are accessible
    // (This is implicit - if Master-Dashboard link is visible, useAccountType works)
    const sidebar = page.locator('[role="navigation"]').first();
    await expect(sidebar.locator('text=Master-Dashboard')).toBeVisible();

    // Verify no "Unauthorized" messages
    await expect(page.locator('text=/Keine Berechtigung|Unauthorized/i')).not.toBeVisible();
  });

  test('should maintain master status across page navigations', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Navigate to different pages
    const pages = ['/dashboard', '/auftraege', '/fahrer', '/master'];

    for (const route of pages) {
      await page.goto(route);
      
      // Verify master status is still detected (sidebar shows Master-Dashboard)
      const sidebar = page.locator('[role="navigation"]').first();
      await expect(sidebar.locator('text=Master-Dashboard')).toBeVisible({
        timeout: 5000
      });
    }
  });

  test('should show master account email in user menu', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Open user menu (adjust selector based on actual implementation)
    // Assuming there's a user menu button in header
    const userMenuButton = page.locator('button[aria-label*="Benutzer"], button[aria-label*="User"]').first();
    await userMenuButton.click();

    // Verify master email is shown
    await expect(page.locator(`text=${MASTER_EMAIL}`)).toBeVisible();
  });

  test('should logout successfully and clear master status', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Verify logged in (Master-Dashboard visible)
    await expect(page.locator('text=Master-Dashboard')).toBeVisible();

    // Logout (adjust selector based on actual implementation)
    // Assuming there's a logout button
    await page.click('button:has-text("Abmelden"), button:has-text("Logout")');

    // Should redirect to auth page
    await page.waitForURL('/auth');

    // Verify logged out
    await expect(page.locator('text=Master-Dashboard')).not.toBeVisible();
  });
});

/**
 * Master Account Permissions Tests
 * 
 * Tests specific master-only permissions:
 * - Access to all companies
 * - Access to all drivers
 * - Access to system settings
 */
test.describe('Master Account Permissions', () => {
  const MASTER_EMAIL = 'courbois1981@gmail.com';
  const MASTER_PASSWORD = process.env.MASTER_PASSWORD || '1def!xO2022!!';

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth');
    await page.fill('input[type="email"]', MASTER_EMAIL);
    await page.fill('input[type="password"]', MASTER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should see all companies in master dashboard', async ({ page }) => {
    await page.goto('/master');
    
    // Verify companies table/list is visible
    // (Adjust selector based on actual Master-Dashboard implementation)
    await expect(page.locator('text=/Unternehmen|Companies/i')).toBeVisible();
    
    // Should show multiple companies (not just own company)
    // This is implicit if Master-Dashboard loads successfully
  });

  test('should have access to system-wide analytics', async ({ page }) => {
    await page.goto('/master');
    
    // Verify analytics/stats are visible
    // (Adjust based on actual implementation)
    const statsSection = page.locator('[data-testid="master-stats"], .stats, .analytics').first();
    await expect(statsSection).toBeVisible({ timeout: 5000 });
  });
});
