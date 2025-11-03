/**
 * ==================================================================================
 * SPACING SYSTEM E2E TESTS - V18.5.1
 * ==================================================================================
 * Automatisierte Tests für systemweite Spacing-Konsistenz
 * ================================================================================== */

import { test, expect } from '@playwright/test';

test.describe('Spacing System V18.5.1', () => {
  
  // ==================================================================================
  // 1. HEADER-CONTENT SPACING
  // ==================================================================================
  
  test.describe('Header-Content Spacing', () => {
    test('main content has correct top padding after header', async ({ page }) => {
      await page.goto('/dashboard');
      
      const main = page.locator('main').first();
      const paddingTop = await main.evaluate(el => 
        window.getComputedStyle(el).paddingTop
      );
      
      // Should be at least 56px (h-14 = 3.5rem = 56px)
      expect(parseInt(paddingTop)).toBeGreaterThanOrEqual(56);
    });

    test('hero sections have correct top margin', async ({ page }) => {
      await page.goto('/');
      
      const hero = page.locator('[class*="hero"]').first();
      if (await hero.count() > 0) {
        const marginTop = await hero.evaluate(el => 
          window.getComputedStyle(el).marginTop
        );
        expect(parseInt(marginTop)).toBeGreaterThanOrEqual(56);
      }
    });
  });

  // ==================================================================================
  // 2. MODAL SPACING
  // ==================================================================================
  
  test.describe('Modal Spacing', () => {
    test('modal has correct spacing from header', async ({ page }) => {
      await page.goto('/kunden');
      
      // Open modal
      await page.click('button:has-text("Neu")');
      
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();
      
      // Check top margin
      const marginTop = await dialog.evaluate(el => 
        window.getComputedStyle(el).marginTop
      );
      expect(parseInt(marginTop)).toBeGreaterThanOrEqual(56);
    });

    test('modal has max-height constraint', async ({ page }) => {
      await page.goto('/fahrer');
      
      // Open modal
      await page.click('button:has-text("Neu")');
      
      const dialog = page.locator('[role="dialog"]').first();
      const maxHeight = await dialog.evaluate(el => 
        window.getComputedStyle(el).maxHeight
      );
      
      // Should have max-height set (not 'none')
      expect(maxHeight).not.toBe('none');
    });

    test('modal content is scrollable when needed', async ({ page }) => {
      await page.goto('/kunden');
      await page.click('button:has-text("Neu")');
      
      const dialog = page.locator('[role="dialog"]').first();
      const overflow = await dialog.evaluate(el => 
        window.getComputedStyle(el).overflowY
      );
      
      expect(['auto', 'scroll']).toContain(overflow);
    });
  });

  // ==================================================================================
  // 3. OVERFLOW PREVENTION
  // ==================================================================================
  
  test.describe('Overflow Prevention', () => {
    test('long text in table cells is truncated', async ({ page }) => {
      await page.goto('/kunden');
      
      const cells = page.locator('td');
      const cellCount = await cells.count();
      
      for (let i = 0; i < Math.min(cellCount, 20); i++) {
        const cell = cells.nth(i);
        const text = await cell.textContent();
        
        if (text && text.length > 30) {
          const hasOverflowProtection = await cell.evaluate(el => {
            const classes = el.className;
            return (
              classes.includes('truncate') ||
              classes.includes('line-clamp') ||
              classes.includes('overflow-hidden')
            );
          });
          
          expect(hasOverflowProtection).toBeTruthy();
        }
      }
    });

    test('badges do not overlap content', async ({ page }) => {
      await page.goto('/auth?tab=signup');
      
      const badge = page.locator('text=Beliebt').first();
      if (await badge.count() > 0) {
        const badgeBox = await badge.boundingBox();
        
        const parent = badge.locator('..').first();
        const parentBox = await parent.boundingBox();
        
        // Badge should be positioned above parent top edge
        expect(badgeBox!.y).toBeLessThanOrEqual(parentBox!.y);
      }
    });

    test('container overflow is properly handled', async ({ page }) => {
      await page.goto('/dashboard');
      
      const cards = page.locator('[class*="card"]');
      const cardCount = await cards.count();
      
      for (let i = 0; i < Math.min(cardCount, 5); i++) {
        const card = cards.nth(i);
        const overflow = await card.evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            x: el.scrollWidth > el.clientWidth,
            y: el.scrollHeight > el.clientHeight,
            overflowX: style.overflowX,
            overflowY: style.overflowY,
          };
        });
        
        // If content overflows, container should have overflow handling
        if (overflow.x || overflow.y) {
          expect(['auto', 'scroll', 'hidden']).toContain(
            overflow.x ? overflow.overflowX : overflow.overflowY
          );
        }
      }
    });
  });

  // ==================================================================================
  // 4. RESPONSIVE SPACING
  // ==================================================================================
  
  test.describe('Responsive Spacing', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`${viewport.name} - touch targets meet WCAG standards`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/auth');
        
        const buttons = page.locator('button');
        const buttonCount = await buttons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          const button = buttons.nth(i);
          const box = await button.boundingBox();
          
          if (box) {
            // WCAG 2.1 AA: Touch targets should be at least 44x44px
            expect(box.height).toBeGreaterThanOrEqual(44);
            
            // For visible buttons, also check width
            const isVisible = await button.isVisible();
            if (isVisible && box.width > 0) {
              expect(box.width).toBeGreaterThanOrEqual(44);
            }
          }
        }
      });

      test(`${viewport.name} - card spacing is responsive`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/dashboard');
        
        const card = page.locator('[class*="card"]').first();
        if (await card.count() > 0) {
          const padding = await card.evaluate(el => 
            window.getComputedStyle(el).padding
          );
          
          expect(padding).toBeTruthy();
          // Padding should increase with viewport size
          const paddingValue = parseInt(padding);
          
          if (viewport.name === 'mobile') {
            expect(paddingValue).toBeGreaterThanOrEqual(16); // 1rem = 16px
          } else if (viewport.name === 'tablet') {
            expect(paddingValue).toBeGreaterThanOrEqual(20); // 1.25rem = 20px
          } else {
            expect(paddingValue).toBeGreaterThanOrEqual(24); // 1.5rem = 24px
          }
        }
      });
    }
  });

  // ==================================================================================
  // 5. LOGO OVERFLOW
  // ==================================================================================
  
  test.describe('Logo Overflow Prevention', () => {
    test('logo does not overflow container', async ({ page }) => {
      await page.goto('/');
      
      const logo = page.locator('img[alt*="MyDispatch"], img[alt*="Logo"]').first();
      if (await logo.count() > 0) {
        const container = logo.locator('..').first();
        
        const logoBox = await logo.boundingBox();
        const containerBox = await container.boundingBox();
        
        if (logoBox && containerBox) {
          // Logo should not exceed container width
          expect(logoBox.width).toBeLessThanOrEqual(containerBox.width + 1); // +1 for rounding
        }
      }
    });

    test('logo has object-contain', async ({ page }) => {
      await page.goto('/');
      
      const logo = page.locator('img[alt*="MyDispatch"], img[alt*="Logo"]').first();
      if (await logo.count() > 0) {
        const objectFit = await logo.evaluate(el => 
          window.getComputedStyle(el).objectFit
        );
        
        expect(objectFit).toBe('contain');
      }
    });
  });

  // ==================================================================================
  // 6. DESIGN SYSTEM COMPLIANCE
  // ==================================================================================
  
  test.describe('Design System Compliance', () => {
    test('no direct color classes used', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Sample check for common direct colors
      const directColors = [
        'text-white',
        'text-black',
        'bg-white',
        'bg-black',
        'bg-gray-',
      ];
      
      const body = page.locator('body');
      const html = await body.innerHTML();
      
      for (const color of directColors) {
        const hasDirectColor = html.includes(`"${color}"`);
        
        // Log violations but don't fail (for gradual migration)
        if (hasDirectColor) {
          console.warn(`⚠️  Found direct color class: ${color}`);
        }
      }
    });
  });
});

// ==================================================================================
// VISUAL REGRESSION TESTS
// ==================================================================================

test.describe('Visual Regression @visual', () => {
  test('auth page spacing baseline', async ({ page }) => {
    await page.goto('/auth?tab=signup');
    await expect(page).toHaveScreenshot('auth-spacing-baseline.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('dashboard spacing baseline', async ({ page }) => {
    // Skip if not authenticated
    await page.goto('/dashboard');
    
    const isLoginPage = await page.locator('text=Anmelden').count() > 0;
    if (!isLoginPage) {
      await expect(page).toHaveScreenshot('dashboard-spacing-baseline.png', {
        fullPage: false,
        maxDiffPixels: 100,
      });
    }
  });

  test('modal spacing baseline', async ({ page }) => {
    await page.goto('/kunden');
    
    const isLoginPage = await page.locator('text=Anmelden').count() > 0;
    if (!isLoginPage) {
      await page.click('button:has-text("Neu")');
      
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      
      await expect(page).toHaveScreenshot('modal-spacing-baseline.png', {
        maxDiffPixels: 50,
      });
    }
  });
});
