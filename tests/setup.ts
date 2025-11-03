/* ==================================================================================
   PLAYWRIGHT TEST SETUP
   ==================================================================================
   Global setup und utilities für E2E Tests
   ================================================================================== */

import { test as base, expect } from '@playwright/test';

// Extend basic test with custom fixtures
export const test = base.extend({
  // Auto-login fixture for authenticated tests
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login
    await page.goto('/auth');
    
    // Fill login form (adjust selectors based on your implementation)
    await page.fill('input[type="email"]', 'test@mydispatch.de');
    await page.fill('input[type="password"]', 'test123456');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    
    await use(page);
  },
});

export { expect };

// Custom matchers
expect.extend({
  /**
   * Check if element has minimum touch target size (44px)
   */
  async toHaveMinTouchTarget(element: any) {
    const box = await element.boundingBox();
    const pass = box ? box.height >= 44 && box.width >= 44 : false;
    
    return {
      message: () =>
        pass
          ? `expected element to NOT have min 44px touch target`
          : `expected element to have min 44px touch target, but was ${box?.width}x${box?.height}px`,
      pass,
    };
  },

  /**
   * Check if text is responsive (has breakpoint classes)
   */
  toHaveResponsiveText(element: any) {
    const classes = element.getAttribute('class');
    const hasResponsive = /text-(sm|base|lg|xl)/.test(classes) && /(sm|md|lg):text-/.test(classes);
    
    return {
      message: () =>
        hasResponsive
          ? `expected element to NOT have responsive text classes`
          : `expected element to have responsive text classes (e.g., text-sm sm:text-base)`,
      pass: hasResponsive,
    };
  },
});
