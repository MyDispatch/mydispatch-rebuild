import { test, expect } from '@playwright/test';

test.describe('Localization Compliance', () => {
  test('Currency format EUR', async ({ page }) => {
    await page.goto('/financials');
    const prices = page.locator('text=/€|EUR/');
    expect(await prices.count()).toBeGreaterThan(0);
  });

  test('German date format DD.MM.YYYY', async ({ page }) => {
    await page.goto('/bookings');
    const dates = page.locator('text=/\\d{2}\\.\\d{2}\\.\\d{4}/');
    if (await dates.count() > 0) {
      expect(dates.first()).toBeVisible();
    }
  });

  test('24-hour time format', async ({ page }) => {
    await page.goto('/bookings');
    const times = page.locator('text=/\\d{2}:\\d{2}/');
    if (await times.count() > 0) {
      const timeText = await times.first().textContent();
      expect(timeText?.toLowerCase()).not.toContain('am');
      expect(timeText?.toLowerCase()).not.toContain('pm');
    }
  });

  test('German UI language', async ({ page }) => {
    await page.goto('/');
    const german = page.locator('text=/Dashboard|Aufträge|Finanzen/');
    expect(await german.count()).toBeGreaterThan(0);
  });

  test('No Lorem Ipsum placeholders', async ({ page }) => {
    await page.goto('/');
    const body = await page.textContent('body');
    expect(body?.toLowerCase()).not.toContain('lorem ipsum');
  });
});
