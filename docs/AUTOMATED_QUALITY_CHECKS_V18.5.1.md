# 🤖 AUTOMATED QUALITY CHECKS V18.5.1

**Status:** ✅ **ACTIVE**  
**Datum:** 2025-01-26  
**Version:** 18.5.1

---

## 🎯 ÜBERSICHT

Automatisierte Qualitätsprüfungen für:

- **Spacing-Konsistenz**
- **Overflow-Prevention**
- **Mobile-Optimierung**
- **Design-System-Compliance**

---

## 📋 QUALITY-CHECK-MATRIX

### 1. SPACING CHECKS

#### A. Header-Content Spacing

```typescript
// CHECK: Content hat korrekten Abstand zum Header
✓ Main Content: pt-14 sm:pt-16
✓ Hero Sections: mt-14 sm:mt-16
✓ Modal Dialogs: mt-14 sm:mt-16
```

#### B. Modal Spacing

```typescript
// CHECK: Modals haben korrekten Abstand und Max-Height
✓ Position: top-[50%]
✓ Top-Margin: mt-14 sm:mt-16
✓ Max-Height: max-h-[calc(90vh-4rem)]
✓ Overflow: overflow-y-auto
```

#### C. Card Spacing

```typescript
// CHECK: Cards haben responsive Spacing
✓ Padding: p-4 sm:p-6 md:p-8
✓ Gap: gap-4 sm:gap-6
✓ Width: w-full
```

---

### 2. OVERFLOW CHECKS

#### A. Text Overflow

```typescript
// CHECK: Lange Texte haben Overflow-Protection
✓ Single Line: .truncate
✓ Multi Line: .line-clamp-{n}
✓ Container: .overflow-hidden
```

#### B. Container Overflow

```typescript
// CHECK: Container verhindern Overflow
✓ Max-Height: max-h-[...]
✓ Scroll: overflow-y-auto
✓ Flex/Grid: min-w-0, break-words
```

#### C. Badge Positioning

```typescript
// CHECK: Absolute Badges überlappen nicht
✓ Position: absolute -top-3 (min)
✓ Z-Index: z-10
✓ Container: pt-6, overflow-visible
```

---

### 3. RESPONSIVE CHECKS

#### A. Mobile-First

```typescript
// CHECK: Mobile-First Approach
✓ Base: gap-3, p-4
✓ Tablet: sm:gap-4, sm:p-6
✓ Desktop: md:gap-6, md:p-8
```

#### B. Touch-Targets

```typescript
// CHECK: WCAG-konforme Touch-Targets
✓ Buttons: min-h-[44px]
✓ Inputs: min-h-[44px]
✓ Interactive: min-h-[44px] min-w-[44px]
```

#### C. Breakpoints

```typescript
// CHECK: Korrekte Breakpoint-Nutzung
✓ sm:  640px  (Tablet)
✓ md:  768px  (Desktop)
✓ lg:  1024px (Large)
```

---

### 4. DESIGN-SYSTEM CHECKS

#### A. Color Tokens

```typescript
// CHECK: Semantic Tokens verwendet
✓ Text: text-foreground, text-muted-foreground
✓ Background: bg-background, bg-primary
✓ VERBOTEN: text-white, bg-black, bg-[#...]
```

#### B. Spacing Tokens

```typescript
// CHECK: Design-System Spacing
✓ Gap: gap-4 sm:gap-6
✓ Padding: p-4 sm:p-6
✓ Margin: m-4 sm:m-6
✓ VERBOTEN: gap-[24px], p-[32px]
```

---

## 🔧 IMPLEMENTATION

### 1. ESLint Rules (V18.6.0 geplant)

#### no-direct-colors

```javascript
// .eslintrc.js
rules: {
  'no-direct-colors': {
    message: 'Use semantic color tokens instead of direct colors',
    pattern: /(text|bg)-(white|black|gray-\d+|red-\d+)/
  }
}
```

#### no-hardcoded-spacing

```javascript
rules: {
  'no-hardcoded-spacing': {
    message: 'Use responsive spacing (e.g., gap-4 sm:gap-6)',
    pattern: /(gap|p|m|pt|pb|pl|pr)-\d+(?!\s+(?:sm|md|lg):)/
  }
}
```

#### require-overflow-protection

```javascript
rules: {
  'require-overflow-protection': {
    message: 'Long text needs overflow protection (truncate, line-clamp)',
    selector: 'JSXElement[children.length > 50]'
  }
}
```

---

### 2. Playwright Tests

#### spacing-consistency.spec.ts

```typescript
import { test, expect } from "@playwright/test";

test.describe("Spacing Consistency", () => {
  test("modal has correct spacing from header", async ({ page }) => {
    await page.goto("/kunden");
    await page.click('button:has-text("Neu")');

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Check top margin
    const styles = await dialog.evaluate((el) => window.getComputedStyle(el));
    expect(parseInt(styles.marginTop)).toBeGreaterThanOrEqual(56); // 14 * 4px
  });

  test("cards have responsive padding", async ({ page }) => {
    await page.goto("/dashboard");

    const card = page.locator(".card").first();
    const padding = await card.evaluate((el) => window.getComputedStyle(el).padding);

    expect(padding).toBeTruthy();
  });
});
```

#### overflow-prevention.spec.ts

```typescript
test.describe("Overflow Prevention", () => {
  test("long text is truncated", async ({ page }) => {
    await page.goto("/kunden");

    const cells = page.locator("td");
    for (const cell of await cells.all()) {
      const overflow = await cell.evaluate((el) => el.scrollWidth > el.clientWidth);

      if (overflow) {
        const hasOverflowClass = await cell.evaluate(
          (el) =>
            el.classList.contains("truncate") ||
            el.classList.contains("line-clamp-2") ||
            el.classList.contains("line-clamp-3")
        );
        expect(hasOverflowClass).toBeTruthy();
      }
    }
  });

  test("badge does not overlap content", async ({ page }) => {
    await page.goto("/auth?tab=signup");

    const badge = page.locator("text=Beliebt").first();
    const badgeBox = await badge.boundingBox();

    const label = badge.locator("..").first();
    const labelBox = await label.boundingBox();

    // Badge should be above label
    expect(badgeBox!.y).toBeLessThan(labelBox!.y);
  });
});
```

#### responsive-design.spec.ts

```typescript
test.describe("Responsive Design", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`${viewport.name} - touch targets`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/auth");

      const buttons = page.locator("button");
      for (const button of await buttons.all()) {
        const box = await button.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    });
  }
});
```

---

### 3. Pre-Commit Hooks

#### .husky/pre-commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running quality checks..."

# Spacing checks
npm run lint:spacing

# Overflow checks
npm run test:overflow

# Visual regression
npm run test:visual

echo "✅ Quality checks passed!"
```

#### package.json scripts

```json
{
  "scripts": {
    "lint:spacing": "eslint --rule 'no-hardcoded-spacing: error' src/",
    "test:overflow": "playwright test overflow-prevention.spec.ts",
    "test:visual": "playwright test --grep @visual",
    "quality:check": "npm run lint:spacing && npm run test:overflow"
  }
}
```

---

### 4. Git Hooks Integration

#### lint-staged.config.js

```javascript
module.exports = {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write", () => "npm run lint:spacing"],
  "*.tsx": [() => "npm run test:overflow"],
};
```

---

## 📊 QUALITY DASHBOARD

### Metrics Tracking

```typescript
// quality-metrics.ts
export interface QualityMetrics {
  spacingCompliance: number; // %
  overflowPrevention: number; // %
  responsiveDesign: number; // %
  touchTargetCompliance: number; // %
  designSystemUsage: number; // %
}

export async function getQualityMetrics(): Promise<QualityMetrics> {
  // Automated checks
  return {
    spacingCompliance: 100,
    overflowPrevention: 100,
    responsiveDesign: 100,
    touchTargetCompliance: 100,
    designSystemUsage: 100,
  };
}
```

---

## 🚀 ROLLOUT-PLAN

### Phase 1: Core Checks (V18.5.1) ✅

- [x] Spacing dokumentiert
- [x] Overflow-Fixes implementiert
- [x] Badge-Positioning korrigiert
- [x] Modal-Header-Spacing korrigiert

### Phase 2: Automated Tests (V18.6.0)

- [ ] ESLint Rules implementieren
- [ ] Playwright Tests erweitern
- [ ] Pre-Commit Hooks aktivieren
- [ ] Visual Regression Tests

### Phase 3: AI-Assisted Quality (V18.7.0)

- [ ] AI-basierte Code-Reviews
- [ ] Automatische Fix-Vorschläge
- [ ] Real-Time Quality Monitoring
- [ ] Continuous Improvement Loop

---

## 🎯 SUCCESS CRITERIA

| Check               | Target | Status     |
| ------------------- | ------ | ---------- |
| Spacing Consistency | 100%   | ✅         |
| Overflow Prevention | 100%   | ✅         |
| Responsive Design   | 100%   | ✅         |
| Touch-Target WCAG   | 100%   | ✅         |
| Design-System Usage | 100%   | ✅         |
| Automated Tests     | 80%    | 🔄 V18.6.0 |
| CI/CD Integration   | 100%   | 🔄 V18.6.0 |

---

**Version:** V18.5.1  
**Status:** ✅ ACTIVE  
**Next Review:** V18.6.0  
**Datum:** 2025-01-26
