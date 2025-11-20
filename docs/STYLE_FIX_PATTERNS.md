# 🎨 STYLE-FIX-PATTERNS V40.19

**Datum:** 2025-10-27  
**Phase:** Sample-Fix → Batch-Fix  
**Ziel:** Inline-Style-Violations → Semantic Tokens

---

## 📊 IDENTIFIZIERTE PATTERNS

### Pattern 1: White Text Opacity

```tsx
// ❌ BEFORE
className = "v26-text-white-80";

// ✅ AFTER
className = "text-muted-foreground";
```

**Reason:** Semantic token für Secondary-Text, Theme-kompatibel

---

### Pattern 2: White Background

```tsx
// ❌ BEFORE
className = "v26-bg-white";

// ✅ AFTER
className = "bg-card";
```

**Reason:** Semantic token für Card-Backgrounds, Dark-Mode-ready

---

### Pattern 3: Direct Text White (Context-Dependent)

```tsx
// ❌ BEFORE (auf dunklem Hintergrund)
className = "text-white";

// ✅ AFTER
className = "text-foreground"; // oder text-primary-foreground (Hero)
```

**Reason:** Kontext-basiert - auf Hero-Sections oft korrekt, sonst semantic

---

### Pattern 4: White Overlays (Glassmorphism)

```tsx
// ⚠️ ACCEPTABLE (spezifische Opacity für Glassmorphism)
className = "v26-bg-white-overlay-06";
```

**Reason:** Spezifische Design-Requirement für Backdrop-Blur-Effekte

---

## 📈 SAMPLE-FIX RESULTS

**Datei:** `src/components/hero/HeroTrustStats.tsx`

**Violations:**

- BEFORE: 1 (v26-text-white-80)
- AFTER: 0

**Fix:**

- Line 44: `v26-text-white-80` → `text-muted-foreground`

**Build Status:** ✅ Success  
**Visual Test:** ⚠️ Auth-Limited (Login-Page only)

---

## 🎯 BATCH-FIX PLAN

**Target Files (13):**

1. `src/components/dashboard/CollapsibleDashboardSection.tsx`
2. `src/components/dashboard/DashboardInfoPanel.tsx`
3. `src/components/design-system/V26AuthCard.tsx`
4. `src/components/design-system/V26AuthInput.tsx`
5. `src/components/design-system/V26Button.tsx`
6. `src/components/design-system/V26Dialog.tsx` ⚠️ Needs context check
7. `src/components/design-system/V26MarketingCard.tsx`
8. `src/components/hero/HeroTrustStats.tsx` ✅ DONE
9. `src/components/home/V26FeatureCard.tsx`
10. `src/components/layout/Header.tsx`
11. `src/components/master/CIGuidelineModal.tsx` (Example only)
12. `src/components/pricing/V26AddonCard.tsx`
13. `src/pages/Home.tsx`

**Estimated Reduction:** 17 violations → ~5 violations (~71% reduction)

---

## 🔧 FIX STRATEGY

### Step-by-Step:

1. **Context Analysis**: Check if `text-white` is on dark background (Hero) → Keep
2. **Replace**: Apply Pattern 1-3 based on context
3. **Validate**: Build + Visual (if accessible)
4. **Document**: Update this file with results

### Auto-Fix Candidates:

- `v26-text-white-80` → `text-muted-foreground` (100% safe)
- `v26-bg-white` → `bg-card` (95% safe, check context)
- `text-white` → Context-dependent (Manual review)

---

---

## 🎯 PHASE 4A: ICON SIZING STANDARDIZATION

**Datum:** 2025-10-27  
**Status:** Sample-Fix Complete (3/94 files)

### Pattern 5: Icon Sizing Standard

```tsx
// ❌ BEFORE (inconsistent)
className = "h-5 w-5"; // or h-3 w-3, h-6 w-6

// ✅ AFTER (standard)
className = "h-4 w-4 text-muted-foreground";
```

**Reason:** Consistent icon sizing across all UI, better visual hierarchy

### Exceptions:

```tsx
// ✅ ACCEPTABLE (specific use cases)
h-12 w-12  // Large decorative icons (empty states)
h-6 w-6    // Prominent icon boxes (card headers, metrics)
h-8 w-8    // Medium emphasis icons
```

### Sample-Fix Results (3 Files):

- `AlertDashboard.tsx` - 6 violations fixed
- `V26KPICard.tsx` - 1 violation fixed
- `MetricCard.tsx` - 0 fixes (h-6 w-6 kept as exception)

**Remaining:** 202 violations in 91 files

---

**Next:** Phase 4a Batch-Fix (91 remaining files) - Awaiting approval
