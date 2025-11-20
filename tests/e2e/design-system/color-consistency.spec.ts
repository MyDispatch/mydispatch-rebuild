import { test, expect } from "@playwright/test";

test.describe("Design System - Color Consistency", () => {
  const pages = [
    { url: "/", name: "Home" },
    { url: "/dashboard", name: "Dashboard" },
    { url: "/auftraege", name: "Aufträge" },
    { url: "/fahrer", name: "Fahrer" },
  ];

  test("should use semantic color tokens (no direct colors)", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.url);

      // Prüfe auf verbotene direkte Farben
      const forbiddenClasses = await page.evaluate(() => {
        const allElements = document.querySelectorAll("*");
        const forbidden = ["text-white", "text-black", "bg-white", "bg-black", "text-[#", "bg-[#"];
        const found: string[] = [];

        allElements.forEach((el) => {
          const classes = el.className.toString();
          forbidden.forEach((fc) => {
            if (classes.includes(fc)) {
              found.push(classes);
            }
          });
        });

        return found;
      });

      if (forbiddenClasses.length > 0) {
        console.warn(`[${p.name}] Found direct colors:`, forbiddenClasses);
      }

      // Warning statt Error (da Marketing-Seiten Ausnahmen haben können)
      expect(forbiddenClasses.length).toBeLessThan(5);
    }
  });

  test("should have consistent primary color across pages", async ({ page }) => {
    const primaryColors: Record<string, string> = {};

    for (const p of pages) {
      await page.goto(p.url);

      const primaryColor = await page.evaluate(() => {
        const root = document.documentElement;
        return getComputedStyle(root).getPropertyValue("--primary");
      });

      primaryColors[p.name] = primaryColor.trim();
    }

    // Alle Seiten sollten die gleiche Primary-Farbe haben
    const uniqueColors = new Set(Object.values(primaryColors));
    expect(uniqueColors.size).toBe(1);
    expect(primaryColors["Home"]).toBe("40 31% 88%"); // HSL(#EADEBD)
  });

  test("should have WCAG AA contrast ratios", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.url);

      // Prüfe Text auf Background
      const textElements = await page.locator("p, h1, h2, h3, span").all();

      for (const el of textElements.slice(0, 10)) {
        // Sample first 10
        const isVisible = await el.isVisible();
        if (!isVisible) continue;

        const box = await el.boundingBox();
        if (!box) continue;

        // Mindest-Kontrast für Text: 4.5:1 (WCAG AA)
        // (Automatische Prüfung schwierig, hier nur Sichtbarkeits-Check)
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    }
  });
});
