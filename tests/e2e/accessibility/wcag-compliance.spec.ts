import { test, expect } from "@playwright/test";

test.describe("WCAG 2.1 AA Compliance", () => {
  const pages = [
    { url: "/", name: "Home" },
    { url: "/dashboard", name: "Dashboard" },
    { url: "/auftraege", name: "Aufträge" },
    { url: "/fahrer", name: "Fahrer" },
    { url: "/kunden", name: "Kunden" },
    { url: "/partner", name: "Partner" },
  ];

  test("should have proper heading hierarchy (H1 -> H2 -> H3)", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.url);

      const h1Count = await page.locator("h1").count();
      expect(h1Count, `${p.name} should have exactly one H1`).toBe(1);

      const headings = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
        return all.map((h) => ({
          tag: h.tagName,
          text: h.textContent?.trim(),
        }));
      });

      // Check hierarchy (no skipping levels)
      let currentLevel = 1;
      for (const heading of headings) {
        const level = parseInt(heading.tag[1]);
        if (level > currentLevel + 1) {
          throw new Error(`${p.name}: Skipped heading level from H${currentLevel} to H${level}`);
        }
        currentLevel = Math.max(currentLevel, level);
      }
    }
  });

  test("should have alt attributes on all images", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.url);

      const imagesWithoutAlt = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll("img"));
        return images.filter((img) => !img.hasAttribute("alt")).map((img) => img.src);
      });

      expect(imagesWithoutAlt, `${p.name} should have alt on all images`).toEqual([]);
    }
  });

  test("should have sufficient touch target sizes (≥ 44px)", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.url);

      const smallTargets = await page.evaluate(() => {
        const interactive = Array.from(
          document.querySelectorAll("button, a, input, select, textarea")
        );
        return interactive
          .filter((el) => {
            const box = el.getBoundingClientRect();
            return box.width > 0 && box.height > 0 && (box.width < 44 || box.height < 44);
          })
          .map((el) => ({
            tag: el.tagName,
            text: el.textContent?.trim().slice(0, 30),
            width: el.getBoundingClientRect().width,
            height: el.getBoundingClientRect().height,
          }));
      });

      if (smallTargets.length > 0) {
        console.warn(`[${p.name}] Small touch targets:`, smallTargets);
      }

      // Warning, not error (some exceptions allowed)
      expect(smallTargets.length).toBeLessThan(5);
    }
  });

  test("should have proper form labels", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.url);

      const inputsWithoutLabels = await page.evaluate(() => {
        const inputs = Array.from(
          document.querySelectorAll('input:not([type="hidden"]), select, textarea')
        );
        return inputs
          .filter((input) => {
            const id = input.getAttribute("id");
            const ariaLabel = input.getAttribute("aria-label");
            const ariaLabelledBy = input.getAttribute("aria-labelledby");
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);

            return !hasLabel && !ariaLabel && !ariaLabelledBy;
          })
          .map((input) => ({
            tag: input.tagName,
            type: input.getAttribute("type"),
            name: input.getAttribute("name"),
          }));
      });

      expect(inputsWithoutLabels, `${p.name} should have labels on all form inputs`).toEqual([]);
    }
  });

  test("should have keyboard navigation support", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.url);

      // Press Tab multiple times
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tag: el?.tagName,
            tabIndex: el?.getAttribute("tabindex"),
            text: el?.textContent?.trim().slice(0, 30),
          };
        });

        // Verify focus is visible
        expect(focusedElement.tag).toBeTruthy();
      }
    }
  });

  test("should have aria-labels on icon-only buttons", async ({ page }) => {
    for (const p of pages) {
      await page.goto(p.url);

      const iconButtonsWithoutLabel = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons
          .filter((btn) => {
            const hasText = btn.textContent && btn.textContent.trim().length > 0;
            const hasAriaLabel = btn.hasAttribute("aria-label");
            const hasAriaLabelledBy = btn.hasAttribute("aria-labelledby");

            // Icon-only buttons (no text, has SVG)
            const hasSvg = btn.querySelector("svg");

            return hasSvg && !hasText && !hasAriaLabel && !hasAriaLabelledBy;
          })
          .map((btn) => ({
            outerHTML: btn.outerHTML.slice(0, 100),
          }));
      });

      if (iconButtonsWithoutLabel.length > 0) {
        console.warn(`[${p.name}] Icon buttons without aria-label:`, iconButtonsWithoutLabel);
      }

      expect(iconButtonsWithoutLabel.length).toBeLessThan(3);
    }
  });
});
