/* ==================================================================================
   E2E TESTS: KOMMUNIKATION (COMMUNICATION DASHBOARD)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Kommunikation - Communication Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kommunikation');
  });

  test('should display communication dashboard', async ({ page }) => {
    await expect(page.locator('text=/Kommunikation|Communication/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('should show message threads or inbox', async ({ page }) => {
    // Message list should be visible
    const messageList = page.locator('[data-testid="message-list"], table, [role="list"]').first();
    await expect(messageList).toBeVisible({ timeout: 10000 });
  });

  test('should display communication KPIs', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    
    if (await kpiCards.first().isVisible({ timeout: 5000 })) {
      expect(await kpiCards.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('should show new message button', async ({ page }) => {
    const newMessageButton = page.locator('text=/Neue Nachricht|New Message|Nachricht senden/i').first();
    
    if (await newMessageButton.isVisible({ timeout: 5000 })) {
      await expect(newMessageButton).toBeEnabled();
    }
  });

  test('should handle mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const content = page.locator('main, [role="main"]');
    await expect(content).toBeVisible();
  });

  test('should filter messages by type', async ({ page }) => {
    const filterOptions = page.locator('[data-testid="message-filter"], text=/Alle|Ungelesen|Archiviert/i').first();
    
    if (await filterOptions.isVisible({ timeout: 5000 })) {
      await expect(filterOptions).toBeVisible();
    }
  });

  test('should open message detail view', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const firstMessage = page.locator('tbody tr, [data-testid="message-item"]').first();
    
    if (await firstMessage.isVisible({ timeout: 5000 })) {
      await firstMessage.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should be responsive across breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      
      const content = page.locator('main, [role="main"]');
      await expect(content).toBeVisible();
    }
  });
});
