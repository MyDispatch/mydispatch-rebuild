import { test, expect } from "@playwright/test";

test.describe("Design System Compliance (V18.3.27)", () => {
  test.beforeEach(async ({ page }) => {
    // Login with test user
    await page.goto("/login");
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || "");
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || "");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test('No "accent" color usage in design system', async ({ page }) => {
    await page.goto("/dashboard");

    // Check computed styles for accent color
    const accentUsage = await page.evaluate(() => {
      const allElements = document.querySelectorAll("*");
      const violations: string[] = [];

      allElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        const props = ["color", "backgroundColor", "borderColor", "fill", "stroke"];

        props.forEach((prop) => {
          const value = computed.getPropertyValue(prop);
          if (value.includes("accent") || value.includes("hsl(var(--accent))")) {
            violations.push(`${el.tagName}.${el.className}: ${prop} = ${value}`);
          }
        });
      });

      return violations;
    });

    expect(accentUsage).toEqual([]);
  });

  test("No traffic light colors on icons", async ({ page }) => {
    await page.goto("/auftraege");

    const iconViolations = await page.evaluate(() => {
      const icons = document.querySelectorAll("svg");
      const violations: string[] = [];
      const trafficColors = [
        "red",
        "yellow",
        "green",
        "rgb(255, 0, 0)",
        "rgb(255, 255, 0)",
        "rgb(0, 255, 0)",
      ];

      icons.forEach((icon) => {
        const computed = window.getComputedStyle(icon);
        const color = computed.color;
        const fill = computed.fill;

        if (trafficColors.some((tc) => color.includes(tc) || fill.includes(tc))) {
          violations.push(
            `Icon with class "${icon.className}" uses traffic light color: ${color || fill}`
          );
        }
      });

      return violations;
    });

    expect(iconViolations).toEqual([]);
  });

  test("All colors use HSL format (no hex or rgb)", async ({ page }) => {
    await page.goto("/dashboard");

    const colorViolations = await page.evaluate(() => {
      const root = document.documentElement;
      const computed = window.getComputedStyle(root);
      const violations: string[] = [];

      // Check CSS variables
      for (let i = 0; i < computed.length; i++) {
        const prop = computed[i];
        if (prop.startsWith("--")) {
          const value = computed.getPropertyValue(prop).trim();

          // Check for hex colors (#fff, #ffffff)
          if (value.match(/#[0-9a-fA-F]{3,6}/)) {
            violations.push(`${prop}: ${value} (hex color detected)`);
          }

          // Check for rgb colors
          if (value.match(/rgb\(/)) {
            violations.push(`${prop}: ${value} (rgb color detected)`);
          }
        }
      }

      return violations;
    });

    expect(colorViolations).toEqual([]);
  });

  test("No direct color usage (text-white, bg-black, etc.)", async ({ page }) => {
    await page.goto("/auftraege");

    const directColorUsage = await page.evaluate(() => {
      const allElements = document.querySelectorAll("*");
      const violations: string[] = [];
      const bannedClasses = [
        "text-white",
        "text-black",
        "bg-white",
        "bg-black",
        "border-white",
        "border-black",
      ];

      allElements.forEach((el) => {
        bannedClasses.forEach((banned) => {
          if (el.classList.contains(banned)) {
            violations.push(`${el.tagName}.${el.className} uses banned class: ${banned}`);
          }
        });
      });

      return violations;
    });

    expect(directColorUsage).toEqual([]);
  });

  test("Semantic color tokens used (primary, foreground, background)", async ({ page }) => {
    await page.goto("/dashboard");

    const semanticTokens = await page.evaluate(() => {
      const root = document.documentElement;
      const computed = window.getComputedStyle(root);
      const requiredTokens = [
        "--primary",
        "--primary-foreground",
        "--background",
        "--foreground",
        "--muted",
        "--muted-foreground",
      ];

      const missing: string[] = [];

      requiredTokens.forEach((token) => {
        const value = computed.getPropertyValue(token);
        if (!value) {
          missing.push(token);
        }
      });

      return missing;
    });

    expect(semanticTokens).toEqual([]);
  });

  test("Typography uses design system tokens", async ({ page }) => {
    await page.goto("/dashboard");

    const typographyCheck = await page.evaluate(() => {
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const violations: string[] = [];

      headings.forEach((heading) => {
        const computed = window.getComputedStyle(heading);
        const fontFamily = computed.fontFamily;

        // Should use CSS variable or system fonts
        if (!fontFamily.includes("var(") && !fontFamily.includes("system-ui")) {
          violations.push(`${heading.tagName}: ${fontFamily} (not using design system)`);
        }
      });

      return violations;
    });

    expect(typographyCheck).toEqual([]);
  });

  test("Spacing uses consistent scale (4px grid)", async ({ page }) => {
    await page.goto("/auftraege");

    const spacingViolations = await page.evaluate(() => {
      const allElements = document.querySelectorAll("*");
      const violations: string[] = [];

      allElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        const margins = ["marginTop", "marginRight", "marginBottom", "marginLeft"];
        const paddings = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];

        [...margins, ...paddings].forEach((prop) => {
          const value = parseFloat(computed[prop as any]);

          // Check if value is divisible by 4 (4px grid)
          if (value > 0 && value % 4 !== 0) {
            violations.push(
              `${el.tagName}.${el.className}: ${prop} = ${value}px (not on 4px grid)`
            );
          }
        });
      });

      return violations.slice(0, 10); // Limit to first 10 violations
    });

    expect(spacingViolations).toEqual([]);
  });

  test("No Lovable/Supabase branding in UI", async ({ page }) => {
    await page.goto("/dashboard");

    const brandingCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText.toLowerCase();
      const violations: string[] = [];

      if (bodyText.includes("lovable")) {
        violations.push("Lovable branding found in UI");
      }

      if (bodyText.includes("supabase") && !bodyText.includes("powered by")) {
        violations.push("Supabase branding found in UI");
      }

      return violations;
    });

    expect(brandingCheck).toEqual([]);
  });

  test("Buttons use proper variants from design system", async ({ page }) => {
    await page.goto("/auftraege");

    const buttonVariants = await page.evaluate(() => {
      const buttons = document.querySelectorAll("button");
      const violations: string[] = [];
      const allowedVariants = ["default", "destructive", "outline", "secondary", "ghost", "link"];

      buttons.forEach((button) => {
        const classes = Array.from(button.classList);
        const hasVariant = allowedVariants.some((variant) =>
          classes.some((cls) => cls.includes(variant))
        );

        if (!hasVariant && button.textContent?.trim()) {
          violations.push(`Button "${button.textContent.trim()}" without proper variant`);
        }
      });

      return violations.slice(0, 5); // Limit violations
    });

    expect(buttonVariants).toEqual([]);
  });

  test("Layout components use Labary system", async ({ page }) => {
    await page.goto("/dashboard");

    const labaryComponents = await page.evaluate(() => {
      // Check for common Labary/shadcn patterns
      const requiredPatterns = [
        "data-radix-", // Radix UI components
        "data-slot", // Headless UI pattern
      ];

      const html = document.documentElement.outerHTML;
      const found = requiredPatterns.filter((pattern) => html.includes(pattern));

      return {
        foundPatterns: found,
        usingLabary: found.length > 0,
      };
    });

    expect(labaryComponents.usingLabary).toBe(true);
  });
});
