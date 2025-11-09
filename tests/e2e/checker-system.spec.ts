/**
 * CHECKER-SYSTEM E2E TESTS V1.0
 * 
 * Tests für:
 * - Code Checker UI Integration
 * - Auto-Healer Functionality
 * - Dashboard Integration
 */

import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';

test.describe('Checker System', () => {
  test.beforeEach(async ({ page }) => {
    // Login als Test-User
    await page.goto('/');
    // TODO: Implement proper login flow
  });

  test('should display Code Checker Trigger in Dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Warte auf Dashboard-Laden
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });
    
    // Suche nach Checker-Section (kann collapsed sein)
    const checkerSection = page.locator('text=Claude 4.5 Code Checker');
    await expect(checkerSection).toBeVisible({ timeout: 5000 });
  });

  test('should allow selecting Report Types', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Expand Checker Section (falls collapsed)
    const checkerTitle = page.locator('text=Claude 4.5 Code Checker');
    await checkerTitle.scrollIntoViewIfNeeded();
    
    // Check Report-Type Buttons
    await expect(page.locator('button:has-text("Code Review")')).toBeVisible();
    await expect(page.locator('button:has-text("DB Analyse")')).toBeVisible();
    await expect(page.locator('button:has-text("Git Check")')).toBeVisible();
    await expect(page.locator('button:has-text("Full Check")')).toBeVisible();
  });

  test('should run Code Check and display results', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Expand Checker Section
    const checkerTitle = page.locator('text=Claude 4.5 Code Checker');
    await checkerTitle.scrollIntoViewIfNeeded();
    
    // Select Code Review
    await page.click('button:has-text("Code Review")');
    
    // Enter test code
    const textarea = page.locator('textarea');
    await textarea.fill(`
      function buggyFunction() {
        const x = 1;
        console.log(x);
        // Missing return
      }
    `);
    
    // Click Check Button
    await page.click('button:has-text("Mit Claude 4.5 prüfen")');
    
    // Wait for results (max 30s)
    await page.waitForSelector('text=Check abgeschlossen', { timeout: 30000 });
    
    // Verify Results displayed
    const resultsSection = page.locator('div:has-text("Top Issues")');
    await expect(resultsSection).toBeVisible({ timeout: 5000 });
  });

  test('should handle Checker errors gracefully', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Expand Checker Section
    const checkerTitle = page.locator('text=Claude 4.5 Code Checker');
    await checkerTitle.scrollIntoViewIfNeeded();
    
    // Try to check without input
    await page.click('button:has-text("Mit Claude 4.5 prüfen")');
    
    // Should show error toast
    await expect(page.locator('text=Bitte Code eingeben')).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Auto-Healer Integration', () => {
  test('should allow triggering Auto-Heal via Hook', async ({ page }) => {
    // TODO: Implement UI for Auto-Heal trigger
    // For now: Test via API call
    
    await page.goto('/dashboard');
    
    // Check if useAutoHealer Hook is available
    // This requires adding a UI button to trigger healing
    
    // Placeholder: Verify Hook is imported
    const pageContent = await page.content();
    expect(pageContent).toContain('auto-healer'); // Hook should be loaded
  });
});

test.describe('CLI Integration', () => {
  test('CLI script should exist', async () => {
    // Verify CLI script exists
    const cliPath = './scripts/check-code.ts';
    expect(existsSync(cliPath)).toBe(true);
  });
});
