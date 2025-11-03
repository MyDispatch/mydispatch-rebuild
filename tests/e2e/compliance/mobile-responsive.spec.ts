import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness (V18.3.27)', () => {
  test.use(devices['iPhone 12']);

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || '');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('Touch targets are at least 44x44px', async ({ page }) => {
    await page.goto('/dashboard');
    
    const smallTargets = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('button, a, input, select, [role="button"]');
      const violations: string[] = [];
      
      interactiveElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        
        if (rect.width < 44 || rect.height < 44) {
          const text = el.textContent?.trim().substring(0, 30) || el.getAttribute('aria-label') || 'unnamed';
          violations.push(`${el.tagName} "${text}": ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
        }
      });
      
      return violations;
    });
    
    expect(smallTargets).toEqual([]);
  });

  test('Navigation menu works on mobile', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu"]').first();
    await expect(menuButton).toBeVisible();
    
    // Open menu
    await menuButton.click();
    
    // Verify menu items are visible
    await expect(page.locator('nav a, nav button').first()).toBeVisible();
    
    // Check all navigation links are accessible
    const navLinks = await page.locator('nav a').count();
    expect(navLinks).toBeGreaterThan(3);
  });

  test('Tables are scrollable on mobile', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 5000 });
    
    const tableScrollable = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      const violations: string[] = [];
      
      tables.forEach((table, index) => {
        const container = table.parentElement;
        if (!container) return;
        
        const overflow = window.getComputedStyle(container).overflow;
        const overflowX = window.getComputedStyle(container).overflowX;
        
        if (overflow !== 'auto' && overflowX !== 'auto' && overflow !== 'scroll' && overflowX !== 'scroll') {
          violations.push(`Table ${index + 1} is not scrollable on mobile`);
        }
      });
      
      return violations;
    });
    
    expect(tableScrollable).toEqual([]);
  });

  test('Font sizes are readable on mobile', async ({ page }) => {
    await page.goto('/dashboard');
    
    const fontSizes = await page.evaluate(() => {
      const allText = document.querySelectorAll('p, span, div, a, button, label');
      const tooSmall: string[] = [];
      
      allText.forEach((el) => {
        const computed = window.getComputedStyle(el);
        const fontSize = parseFloat(computed.fontSize);
        
        // Minimum 14px for body text on mobile
        if (fontSize < 14 && el.textContent?.trim()) {
          const text = el.textContent.trim().substring(0, 30);
          tooSmall.push(`${el.tagName}: ${fontSize}px - "${text}"`);
        }
      });
      
      return tooSmall.slice(0, 10);
    });
    
    expect(fontSizes).toEqual([]);
  });

  test('Forms are usable on mobile', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Look for any form
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
    
    // Check input fields have proper spacing
    const inputSpacing = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, select, textarea');
      const violations: string[] = [];
      
      inputs.forEach((input) => {
        const rect = input.getBoundingClientRect();
        
        // Input should be at least 44px tall for touch
        if (rect.height < 44) {
          violations.push(`${input.getAttribute('name') || 'unnamed'}: ${Math.round(rect.height)}px height`);
        }
      });
      
      return violations;
    });
    
    expect(inputSpacing).toEqual([]);
  });

  test('Modal dialogs are responsive', async ({ page }) => {
    await page.goto('/auftraege');
    
    // Try to open a dialog/modal
    const addButton = page.locator('button').filter({ hasText: /neu|add|create/i }).first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Wait for dialog
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible({ timeout: 3000 });
      
      // Check dialog fits in viewport
      const dialogFits = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) return true;
        
        const rect = dialog.getBoundingClientRect();
        return rect.width <= window.innerWidth && rect.height <= window.innerHeight;
      });
      
      expect(dialogFits).toBe(true);
    }
  });

  test('Images are responsive', async ({ page }) => {
    await page.goto('/dashboard');
    
    const imageIssues = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const violations: string[] = [];
      
      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        
        // Image should not overflow viewport
        if (rect.width > window.innerWidth) {
          violations.push(`Image ${img.src} overflows: ${Math.round(rect.width)}px`);
        }
        
        // Image should have alt text
        if (!img.alt && img.src) {
          violations.push(`Image ${img.src} missing alt text`);
        }
      });
      
      return violations;
    });
    
    expect(imageIssues).toEqual([]);
  });

  test('Viewport meta tag is set correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    const viewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta?.getAttribute('content') || '';
    });
    
    expect(viewportMeta).toContain('width=device-width');
    expect(viewportMeta).toContain('initial-scale=1');
  });

  test('No horizontal scrolling on mobile', async ({ page }) => {
    await page.goto('/dashboard');
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });
});

test.describe('Tablet Responsiveness', () => {
  test.use(devices['iPad Pro']);

  test('Layout adapts for tablet', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || '');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    await page.goto('/auftraege');
    
    // Tablet should show more content than mobile
    const contentVisible = await page.evaluate(() => {
      const columns = document.querySelectorAll('table th, table td');
      return columns.length > 4; // Should have more columns visible on tablet
    });
    
    expect(contentVisible).toBe(true);
  });
});
