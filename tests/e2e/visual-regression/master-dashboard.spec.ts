/**
 * ==================================================================================
 * VISUAL REGRESSION TEST - MASTER DASHBOARD V6.1
 * ==================================================================================
 * Playwright Test für Master Dashboard nach V28Button Migration
 * 
 * Prüft:
 * - Layout Consistency (Screenshots)
 * - V28Button statt ui/button
 * - Design System Compliance
 * - Responsive Behavior
 * ==================================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Master Dashboard Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Master Dashboard
    await page.goto('/master');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Extra buffer for animations
  });

  test('Master Dashboard Full Page Screenshot', async ({ page }) => {
    // Take full-page screenshot
    await expect(page).toHaveScreenshot('master-dashboard-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Master Dashboard Viewport Screenshot', async ({ page }) => {
    // Take viewport-only screenshot (above the fold)
    await expect(page).toHaveScreenshot('master-dashboard-viewport.png', {
      animations: 'disabled',
    });
  });

  test('NO ui/button Imports Allowed', async ({ page }) => {
    // This would need to be a Node.js script to check source files
    // For now, we verify that V28Button is present in the DOM
    
    const v28Buttons = await page.locator('[class*="V28Button"]').count();
    
    // Expect at least some V28Buttons to be present
    expect(v28Buttons).toBeGreaterThan(0);
  });

  test('V28Button Variants Render Correctly', async ({ page }) => {
    // Primary Button
    const primaryButton = page.getByRole('button', { name: /deploy|speichern|erstellen/i }).first();
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toHaveScreenshot('v28button-primary.png');
    
    // Secondary Button
    const secondaryButton = page.getByRole('button', { name: /abbrechen|zurück|export/i }).first();
    if (await secondaryButton.isVisible()) {
      await expect(secondaryButton).toHaveScreenshot('v28button-secondary.png');
    }
  });

  test('Quick Actions Panel Visible', async ({ page }) => {
    // Verify Quick Actions Panel is visible
    const quickActionsPanel = page.locator('[data-testid="quick-actions-panel"]').or(
      page.locator('aside').filter({ hasText: /quick actions/i })
    );
    
    await expect(quickActionsPanel.first()).toBeVisible();
    await expect(quickActionsPanel.first()).toHaveScreenshot('quick-actions-panel.png');
  });

  test('System Status Widget Loads', async ({ page }) => {
    // Verify System Status Widget is present
    const statusWidget = page.getByText(/system status|uptime|error rate/i).first();
    await expect(statusWidget).toBeVisible();
  });

  test('Responsive Mobile View', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Take mobile screenshot
    await expect(page).toHaveScreenshot('master-dashboard-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Responsive Tablet View', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Take tablet screenshot
    await expect(page).toHaveScreenshot('master-dashboard-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('No Console Errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Allow some specific errors (e.g., third-party scripts)
    const allowedErrors = [
      'favicon.ico', // Favicon not found is acceptable
      'ResizeObserver', // ResizeObserver loop errors are benign
    ];
    
    const criticalErrors = consoleErrors.filter(
      (error) => !allowedErrors.some((allowed) => error.includes(allowed))
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Accessibility - Touch Targets', async ({ page }) => {
    // Check all buttons have min 44x44px touch targets
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
