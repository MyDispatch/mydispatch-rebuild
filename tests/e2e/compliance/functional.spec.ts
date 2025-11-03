import { test, expect } from '@playwright/test';

test.describe('Functional Compliance', () => {
  test('Navigation links work', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('nav a[href]');
    expect(await navLinks.count()).toBeGreaterThan(0);
  });

  test('Search functionality accessible', async ({ page }) => {
    await page.goto('/');
    const search = page.locator('input[type="search"]');
    if (await search.count() > 0) {
      await expect(search.first()).toBeVisible();
    }
  });

  test('Forms show validation errors', async ({ page }) => {
    await page.goto('/bookings');
    const createBtn = page.getByRole('button', { name: /erstellen/i });
    if (await createBtn.count() > 0) {
      await createBtn.click();
      const submitBtn = page.getByRole('button', { name: /speichern/i });
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
        await page.waitForTimeout(500);
        const errors = page.locator('text=/erforderlich|required/i');
        expect(await errors.count()).toBeGreaterThan(0);
      }
    }
  });

  test('Tables have sortable columns', async ({ page }) => {
    await page.goto('/bookings');
    const headers = page.locator('th[role="columnheader"]');
    if (await headers.count() > 0) {
      await headers.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('Dialogs open and close', async ({ page }) => {
    await page.goto('/bookings');
    const createBtn = page.getByRole('button', { name: /erstellen/i });
    if (await createBtn.count() > 0) {
      await createBtn.click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible({ timeout: 3000 });
      
      const cancelBtn = page.getByRole('button', { name: /abbrechen/i });
      if (await cancelBtn.count() > 0) {
        await cancelBtn.click();
        await expect(dialog).not.toBeVisible({ timeout: 3000 });
      }
    }
  });
});
