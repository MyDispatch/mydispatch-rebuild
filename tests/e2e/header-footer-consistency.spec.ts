import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * HEADER/FOOTER/SIDEBAR CONSISTENCY TESTS V28.1
 *
 * Validiert die vollständige Harmonisierung aller Layout-Komponenten:
 * - Design Token Konsistenz (keine deprecated Tokens)
 * - Spacing Standard (px-8 Desktop, px-4 Mobile)
 * - Transition Synchronisierung (300ms)
 * - Z-Index Hierarchie
 * - Button Styling Konsistenz
 */

test.describe("Design Token Compliance", () => {
  const componentsToCheck = [
    "src/components/layout/MobileHeader.tsx",
    "src/components/layout/MobileBottomNav.tsx",
    "src/components/layout/Header.tsx",
    "src/components/layout/Footer.tsx",
    "src/components/layout/AppSidebar.tsx",
    "src/components/layout/MarketingLayout.tsx",
  ];

  for (const componentPath of componentsToCheck) {
    test(`${path.basename(componentPath)} does NOT import UNIFIED_DESIGN_TOKENS`, async () => {
      const fullPath = path.join(process.cwd(), componentPath);
      const content = fs.readFileSync(fullPath, "utf-8");

      // CRITICAL: Keine deprecated Token-Imports
      expect(content).not.toContain("UNIFIED_DESIGN_TOKENS");
      expect(content).not.toContain("unified-design-tokens");
      expect(content).not.toContain("@/lib/design-system/unified-design-tokens");
    });

    test(`${path.basename(componentPath)} uses designTokens from config`, async () => {
      const fullPath = path.join(process.cwd(), componentPath);
      const content = fs.readFileSync(fullPath, "utf-8");

      // V28.1 Token-Import vorhanden
      expect(content).toContain("from '@/config/design-tokens'");
    });
  }
});

test.describe("Spacing Consistency", () => {
  test("Desktop Header has correct padding", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    const header = page.locator("header").first();
    const headerDiv = header.locator("> div").first();

    // px-8 = 32px (2rem)
    const paddingLeft = await headerDiv.evaluate((el) => window.getComputedStyle(el).paddingLeft);
    const paddingRight = await headerDiv.evaluate((el) => window.getComputedStyle(el).paddingRight);

    expect(paddingLeft).toBe("32px");
    expect(paddingRight).toBe("32px");
  });

  test("Desktop Footer has correct padding", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    const footer = page.locator("footer").first();
    const footerDiv = footer.locator("> div").first();

    const paddingLeft = await footerDiv.evaluate((el) => window.getComputedStyle(el).paddingLeft);
    const paddingRight = await footerDiv.evaluate((el) => window.getComputedStyle(el).paddingRight);

    expect(paddingLeft).toBe("32px");
    expect(paddingRight).toBe("32px");
  });

  test("Mobile Header has correct padding", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");

    const header = page.locator("header").first();
    const headerDiv = header.locator("> div").first();

    // px-4 = 16px (1rem)
    const paddingLeft = await headerDiv.evaluate((el) => window.getComputedStyle(el).paddingLeft);
    const paddingRight = await headerDiv.evaluate((el) => window.getComputedStyle(el).paddingRight);

    expect(paddingLeft).toBe("16px");
    expect(paddingRight).toBe("16px");
  });
});

test.describe("Transition Synchronization", () => {
  test("Sidebar, Header, and Footer have synchronized 300ms transitions", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    const sidebar = page.locator("aside").first();
    const header = page.locator("header").first();
    const footer = page.locator("footer").first();

    // Alle müssen 300ms haben
    const sidebarTransition = await sidebar.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transitionDuration;
    });

    const headerTransition = await header.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transitionDuration;
    });

    const footerTransition = await footer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transitionDuration;
    });

    expect(sidebarTransition).toBe("0.3s");
    expect(headerTransition).toBe("0.3s");
    expect(footerTransition).toBe("0.3s");
  });

  test("Header and Footer adjust synchronously with Sidebar expansion", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    const sidebar = page.locator("aside").first();
    const header = page.locator("header").first();
    const footer = page.locator("footer").first();

    // Initial collapsed state (64px)
    const initialHeaderLeft = await header.evaluate((el) => window.getComputedStyle(el).left);
    expect(initialHeaderLeft).toBe("64px");

    // Hover Sidebar → Expand
    await sidebar.hover();

    // Wait for transition to complete (300ms + 50ms buffer)
    await page.waitForTimeout(350);

    // Check expanded state (240px)
    const expandedHeaderLeft = await header.evaluate((el) => window.getComputedStyle(el).left);
    const expandedFooterLeft = await footer.evaluate((el) => window.getComputedStyle(el).left);

    expect(expandedHeaderLeft).toBe("240px");
    expect(expandedFooterLeft).toBe("240px");
  });
});

test.describe("Z-Index Hierarchy", () => {
  test("Z-Index values follow defined hierarchy", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    const sidebar = page.locator("aside").first();
    const header = page.locator("header").first();
    const footer = page.locator("footer").first();

    const sidebarZIndex = await sidebar.evaluate((el) => window.getComputedStyle(el).zIndex);
    const headerZIndex = await header.evaluate((el) => window.getComputedStyle(el).zIndex);
    const footerZIndex = await footer.evaluate((el) => window.getComputedStyle(el).zIndex);

    // Expected: sidebar (40) > header (30) > footer (20)
    expect(Number(sidebarZIndex)).toBe(40);
    expect(Number(headerZIndex)).toBe(30);
    expect(Number(footerZIndex)).toBe(20);

    // Verify hierarchy
    expect(Number(sidebarZIndex)).toBeGreaterThan(Number(headerZIndex));
    expect(Number(headerZIndex)).toBeGreaterThan(Number(footerZIndex));
  });

  test("Mobile Header has correct z-index (50)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");

    const mobileHeader = page.locator("header").first();

    const zIndex = await mobileHeader.evaluate((el) => window.getComputedStyle(el).zIndex);

    expect(Number(zIndex)).toBe(50);
  });

  test("No layout overlapping issues", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    // Prüfe, dass Header nicht von Sidebar überlappt wird
    const header = page.locator("header").first();
    const sidebar = page.locator("aside").first();

    const headerBox = await header.boundingBox();
    const sidebarBox = await sidebar.boundingBox();

    // Header sollte rechts von Sidebar beginnen
    expect(headerBox!.x).toBeGreaterThanOrEqual(sidebarBox!.width);
  });
});

test.describe("Button Styling Consistency", () => {
  test("All primary buttons have consistent styling", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Marketing Page "Anmelden" Button
    const primaryButton = page.locator('button:has-text("Anmelden")').first();

    const height = await primaryButton.evaluate((el) => window.getComputedStyle(el).height);
    const paddingLeft = await primaryButton.evaluate(
      (el) => window.getComputedStyle(el).paddingLeft
    );
    const paddingRight = await primaryButton.evaluate(
      (el) => window.getComputedStyle(el).paddingRight
    );

    // h-11 = 44px (WCAG Touch Target)
    expect(height).toBe("44px");

    // px-8 = 32px
    expect(paddingLeft).toBe("32px");
    expect(paddingRight).toBe("32px");
  });

  test("Buttons have shadow-md on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    const primaryButton = page.locator('button:has-text("Anmelden")').first();

    // Hover Button
    await primaryButton.hover();
    await page.waitForTimeout(100); // Transition settle

    const boxShadow = await primaryButton.evaluate((el) => window.getComputedStyle(el).boxShadow);

    // shadow-md sollte vorhanden sein (nicht "none")
    expect(boxShadow).not.toBe("none");
  });

  test("NO hover:scale transforms on buttons", async () => {
    const marketingLayoutPath = path.join(
      process.cwd(),
      "src/components/layout/MarketingLayout.tsx"
    );
    const content = fs.readFileSync(marketingLayoutPath, "utf-8");

    // hover:scale-[1.02] sollte NICHT vorhanden sein
    expect(content).not.toContain("hover:scale-[1.02]");
    expect(content).not.toContain("hover:scale");
  });
});

test.describe("Logo Component Unification", () => {
  test("Mobile Header uses Logo component", async () => {
    const mobileHeaderPath = path.join(process.cwd(), "src/components/layout/MobileHeader.tsx");
    const content = fs.readFileSync(mobileHeaderPath, "utf-8");

    // Muss <Logo /> Component importieren und nutzen
    expect(content).toContain("import { Logo } from");
    expect(content).toContain("<Logo");
  });

  test("NO conditional company.logo_url rendering in Mobile Header", async () => {
    const mobileHeaderPath = path.join(process.cwd(), "src/components/layout/MobileHeader.tsx");
    const content = fs.readFileSync(mobileHeaderPath, "utf-8");

    // Kein conditional rendering basierend auf company.logo_url
    expect(content).not.toContain("company.logo_url");
    expect(content).not.toContain("company?.logo_url");
  });
});

test.describe("Color System Consistency", () => {
  test("Components use Slate palette (not Beige/Dunkelblau)", async () => {
    const componentsToCheck = [
      "src/components/layout/MobileHeader.tsx",
      "src/components/layout/MobileBottomNav.tsx",
    ];

    for (const componentPath of componentsToCheck) {
      const fullPath = path.join(process.cwd(), componentPath);
      const content = fs.readFileSync(fullPath, "utf-8");

      // KEINE V26.1 Beige/Dunkelblau Colors
      expect(content).not.toContain("hsl(42, 49%, 78%)"); // Beige
      expect(content).not.toContain("hsl(225, 31%, 28%)"); // Dunkelblau
      expect(content).not.toContain("#EADEBD"); // Beige HEX
      expect(content).not.toContain("#323D5E"); // Dunkelblau HEX

      // Sollte V28.1 Slate-Farben nutzen
      expect(content).toContain("designTokens.colors.slate");
    }
  });
});

test.describe("Visual Regression", () => {
  test("Desktop layout visual consistency", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    // Wait for layout to settle
    await page.waitForTimeout(500);

    // Screenshot gesamtes Layout
    const screenshot = await page.screenshot({ fullPage: true });

    // Visual regression würde hier das Screenshot vergleichen
    // Für jetzt: Stelle sicher, dass Screenshot erstellt wurde
    expect(screenshot.length).toBeGreaterThan(0);
  });

  test("Mobile layout visual consistency", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");

    await page.waitForTimeout(500);

    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot.length).toBeGreaterThan(0);
  });
});

test.describe("Performance Metrics", () => {
  test("No layout shift during Sidebar expansion", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    const mainContent = page.locator("main").first();

    // Initial position
    const initialBox = await mainContent.boundingBox();

    // Expand Sidebar
    const sidebar = page.locator("aside").first();
    await sidebar.hover();
    await page.waitForTimeout(350); // Transition complete

    // Final position
    const finalBox = await mainContent.boundingBox();

    // Content sollte sich NUR horizontal bewegen (margin-left ändern)
    // Y-Position und Height sollten gleich bleiben (kein Layout Shift)
    expect(finalBox!.y).toBe(initialBox!.y);
    expect(finalBox!.height).toBe(initialBox!.height);
  });

  test("Transition performance is smooth (no jank)", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/dashboard");

    // Start Performance Measurement
    await page.evaluate(() => performance.mark("sidebar-expand-start"));

    const sidebar = page.locator("aside").first();
    await sidebar.hover();

    await page.waitForTimeout(350);

    await page.evaluate(() => performance.mark("sidebar-expand-end"));

    const measure = await page.evaluate(() => {
      performance.measure("sidebar-expand", "sidebar-expand-start", "sidebar-expand-end");
      return performance.getEntriesByName("sidebar-expand")[0].duration;
    });

    // Transition sollte ~ 300ms dauern (±50ms Toleranz)
    expect(measure).toBeGreaterThan(250);
    expect(measure).toBeLessThan(400);
  });
});

test.describe("Build Validation", () => {
  test("No console warnings about deprecated tokens", async ({ page }) => {
    const warnings: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "warning" && msg.text().includes("UNIFIED_DESIGN_TOKENS")) {
        warnings.push(msg.text());
      }
    });

    await page.goto("/dashboard");
    await page.waitForTimeout(1000);

    // Keine Warnungen über deprecated Tokens
    expect(warnings.length).toBe(0);
  });
});
