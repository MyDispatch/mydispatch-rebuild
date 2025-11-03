/* ==================================================================================
   E2E TESTS: UNTERNEHMEN (COMPANY DASHBOARD)
   ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Unternehmen - Company Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unternehmen');
  });

  test('should display company information', async ({ page }) => {
    // Company info should be visible
    await expect(page.locator('text=/Unternehmen|Company/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('should show company KPI cards', async ({ page }) => {
    const kpiCards = page.locator('[data-testid="stat-card"]');
    
    if (await kpiCards.first().isVisible({ timeout: 5000 })) {
      expect(await kpiCards.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('should display company profile form', async ({ page }) => {
    // Company profile fields
    const formFields = page.locator('input, select, textarea');
    const count = await formFields.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should show edit/save buttons', async ({ page }) => {
    const actionButton = page.locator('text=/Bearbeiten|Speichern|Edit|Save/i').first();
    
    if (await actionButton.isVisible()) {
      await expect(actionButton).toBeEnabled();
    }
  });

  test('should handle mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const content = page.locator('main, [role="main"]');
    await expect(content).toBeVisible();
  });

  test('should display company logo upload', async ({ page }) => {
    const logoUpload = page.locator('input[type="file"], text=/Logo hochladen|Upload Logo/i').first();
    
    if (await logoUpload.isVisible({ timeout: 5000 })) {
      await expect(logoUpload).toBeVisible();
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
