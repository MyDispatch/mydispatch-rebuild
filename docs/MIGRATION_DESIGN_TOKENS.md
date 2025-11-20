# 🔄 DESIGN TOKEN MIGRATION - STATUS LOG

**Created:** 2025-10-28  
**Goal:** Migrate ALL files from `unified-design-tokens-v28.ts` → `design-tokens.ts`  
**Reason:** Single Source of Truth enforcement

---

## ✅ COMPLETED (7/10 Files)

- [x] `src/components/home/V28BrowserMockup.tsx` - 4 replacements
- [x] `src/components/home/V28SliderControls.tsx` - 4 replacements
- [x] `src/components/home/V28DashboardPreview.tsx` - 8 replacements
- [x] `src/components/pricing/TariffFeatureDialog.tsx` - 56 replacements (full rewrite)
- [x] `src/components/design-system/V28Dialog.tsx` - 15 replacements (full rewrite)
- [x] `src/components/layout/Footer.tsx` - 8 replacements (full rewrite)
- [x] `src/components/layout/Header.tsx` - 10 replacements (full rewrite)

## 🔄 IN PROGRESS (2/10 Files - LARGE!)

### `src/components/layout/AppSidebar.tsx`

- **Status:** Import updated, but 21+ usages need replacement
- **Lines affected:** 161, 162, 186, 219-230, 306, 318, 324, 338, 342-343, 346, 359, 375, 379-380, 383
- **Pattern:** `PRIMARY_COLORS_V28.slate200` → `designTokens.colors.slate[200]`

### `src/components/layout/MarketingLayout.tsx`

- **Status:** Import updated, but 69+ usages need replacement
- **Lines affected:** 63-64, 76, 80, 106-108, 111, 116, 141, 148, 159, 163-164, 167, 194-195, 199-200, etc.
- **Pattern:** Same as above

## ⏳ PENDING (1/10 Files)

- [ ] `src/pages/Home.tsx` - ~30 replacements needed
  - Lines: 46, 212, 213, 219, 228, 243, 252, 299, 300, etc.

---

## 📋 MIGRATION PATTERN

```tsx
// ❌ OLD
import { PRIMARY_COLORS_V28, SHADOW_SYSTEM_V28 } from '@/lib/design-system/unified-design-tokens-v28';

style={{ backgroundColor: PRIMARY_COLORS_V28.white }}
style={{ color: PRIMARY_COLORS_V28.slate900 }}

// ✅ NEW
import { designTokens } from '@/config/design-tokens';

style={{ backgroundColor: designTokens.colors.white }}
style={{ color: designTokens.colors.slate[900] }}
```

**Mapping Table:**

- `PRIMARY_COLORS_V28.white` → `designTokens.colors.white`
- `PRIMARY_COLORS_V28.primary` → `designTokens.colors.primary.DEFAULT`
- `PRIMARY_COLORS_V28.primaryHover` → `designTokens.colors.primary.hover`
- `PRIMARY_COLORS_V28.primaryLight` → `designTokens.colors.primary.light`
- `PRIMARY_COLORS_V28.slate200` → `designTokens.colors.slate[200]`
- `PRIMARY_COLORS_V28.slate900` → `designTokens.colors.slate[900]`
- `SHADOW_SYSTEM_V28.lg` → `designTokens.shadows.lg`

---

## ⏭️ NEXT STEPS

1. Complete AppSidebar.tsx (21 replacements)
2. Complete MarketingLayout.tsx (69 replacements)
3. Complete Home.tsx (30 replacements)
4. Delete old file: `/lib/design-system/unified-design-tokens-v28.ts`
5. Update LESSONS_LEARNED.md
6. Update AVOIDABLE_ERRORS.md

---

**ESTIMATED TIME REMAINING:** 45-60 Min  
**TOTAL REPLACEMENTS:** ~220 across 3 files
