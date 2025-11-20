# V28 MIGRATION GUIDE

> **Complete migration path from V26 to V28.1 Design System**

---

## 🎯 QUICK REFERENCE

### Color Mapping (V26 → V28)

| V26 Token          | V28 Tailwind Class              | RGB Value                 | Usage                        |
| ------------------ | ------------------------------- | ------------------------- | ---------------------------- |
| `dunkelblau`       | `bg-slate-700`                  | `rgb(51 65 85)`           | Primary backgrounds, buttons |
| `dunkelblau_hover` | `hover:bg-slate-800`            | `rgb(30 41 59)`           | Button hover states          |
| `beige`            | `bg-slate-200`                  | `rgb(226 232 240)`        | Secondary backgrounds        |
| `beige_30`         | `bg-slate-200/30`               | `rgba(226 232 240 / 0.3)` | Subtle backgrounds           |
| `beige_glow_30`    | `shadow-lg shadow-slate-200/50` | -                         | Glow effects                 |
| `text_primary`     | `text-slate-900`                | `rgb(15 23 42)`           | Headings, primary text       |
| `text_secondary`   | `text-slate-600`                | `rgb(71 85 105)`          | Body text, descriptions      |
| `text_muted`       | `text-slate-500`                | `rgb(100 116 139)`        | Placeholder, disabled        |
| `border_neutral`   | `border-slate-200`              | `rgb(226 232 240)`        | Borders, dividers            |
| `weiss`            | `bg-white`                      | `rgb(255 255 255)`        | White backgrounds            |
| `canvas`           | `bg-slate-50`                   | `rgb(248 250 252)`        | Page backgrounds             |

### Component Mapping (V26 → V28)

| V26 Component        | V28 Component         | Import Path                                      | Migration Complexity |
| -------------------- | --------------------- | ------------------------------------------------ | -------------------- |
| `V26Button`          | `Button`              | `@/components/ui/button`                         | 🟢 Easy              |
| `V26Dialog`          | `Dialog`              | `@/components/ui/dialog`                         | 🟡 Medium            |
| `V26Checkbox`        | `Checkbox`            | `@/components/ui/checkbox`                       | 🟢 Easy              |
| `V26Badge`           | `V28Badge`            | `@/components/design-system/V28Badge`            | 🟢 Easy              |
| `V26IconBox`         | `V28IconBox`          | `@/components/design-system/V28IconBox`          | 🟢 Easy              |
| `V26AuthCard`        | `V28AuthCard`         | `@/components/design-system/V28AuthCard`         | 🟢 Easy              |
| `V26MarketingCard`   | `V28MarketingCard`    | `@/components/design-system/V28MarketingCard`    | 🟡 Medium            |
| `V26FeatureCard`     | `Card + FeatureGrid`  | `@/components/ui/card`                           | 🔴 Complex           |
| `V26TestimonialCard` | `TestimonialSlider`   | `@/components/smart-templates/TestimonialSlider` | 🔴 Complex           |
| `V26SliderControls`  | `Carousel`            | `@/components/ui/carousel`                       | 🟡 Medium            |
| `V26Link`            | `Link` (React Router) | `react-router-dom`                               | 🟢 Easy              |
| `V26TabNavigation`   | `Tabs`                | `@/components/ui/tabs`                           | 🟡 Medium            |

---

## 📋 MIGRATION STEPS

### Step 1: Identify V26 Usage

```bash
# Find all V26 component usages
grep -r "V26\|UNIFIED_DESIGN_TOKENS" src/your-component.tsx

# Find hardcoded colors
grep -r "#[0-9A-Fa-f]\{6\}" src/your-component.tsx

# Find inline styles
grep -r "style={{" src/your-component.tsx
```

### Step 2: Choose Migration Strategy

#### Strategy A: Gradual Migration (Recommended)

- ✅ Migrate one component at a time
- ✅ Test after each migration
- ✅ Deploy incrementally

#### Strategy B: Bulk Migration

- ⚠️ Migrate entire feature/page at once
- ⚠️ Higher risk, requires thorough testing
- ✅ Faster completion

### Step 3: Apply Migration Patterns

See detailed examples below.

### Step 4: Validate Changes

```bash
# TypeScript type-check
npx tsc --noEmit

# ESLint (will block V26 imports)
npx eslint src/ --max-warnings 0

# Build check
npm run build

# Test suite
npm run test

# Lighthouse audit
npm run lighthouse:ci
```

---

## 🔄 MIGRATION PATTERNS

### Pattern 1: Button Migration

#### Before (V26)

```typescript
import { V26Button } from '@/components/design-system/V26Button';
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

<V26Button
  variant="primary"
  style={{ backgroundColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau }}
  onClick={handleClick}
>
  Click Me
</V26Button>
```

#### After (V28)

```typescript
import { Button } from '@/components/ui/button';

<Button
  className="bg-slate-700 hover:bg-slate-800 text-white"
  onClick={handleClick}
>
  Click Me
</Button>
```

**Changes:**

- ✅ Import from shadcn/ui
- ✅ Replace inline-styles with Tailwind classes
- ✅ Remove UNIFIED_DESIGN_TOKENS import

---

### Pattern 2: Dialog Migration

#### Before (V26)

```typescript
import { V26Dialog } from '@/components/design-system/V26Dialog';

<V26Dialog open={isOpen} onClose={handleClose}>
  <div className="p-6">
    <h2>Dialog Title</h2>
    <p>Dialog Content</p>
    <button onClick={handleClose}>Close</button>
  </div>
</V26Dialog>
```

#### After (V28)

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p className="text-slate-600">Dialog Content</p>
    <DialogFooter>
      <Button variant="outline" onClick={handleClose}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Changes:**

- ✅ Use DialogContent, DialogHeader, DialogFooter subcomponents
- ✅ `onClose` → `onOpenChange`
- ✅ Structured layout with semantic sections

---

### Pattern 3: Color Migration

#### Before (V26)

```typescript
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

<div style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
  color: UNIFIED_DESIGN_TOKENS.colors.text_primary,
  borderColor: UNIFIED_DESIGN_TOKENS.colors.border_neutral,
  padding: UNIFIED_DESIGN_TOKENS.spacing.lg
}} />
```

#### After (V28)

```typescript
<div className="
  bg-slate-700
  text-slate-900
  border border-slate-200
  p-6
" />
```

**Changes:**

- ✅ Inline-styles → Tailwind classes
- ✅ Color tokens → `slate-*` palette
- ✅ Spacing tokens → Tailwind spacing scale

---

### Pattern 4: Hover States Migration

#### Before (V26)

```typescript
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

<button
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = UNIFIED_DESIGN_TOKENS.colors.beige_30;
    e.currentTarget.style.transform = 'scale(1.05)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.transform = 'scale(1)';
  }}
>
  Hover Me
</button>
```

#### After (V28)

```typescript
<button className="
  hover:bg-slate-200/30
  hover:scale-105
  transition-all duration-200 ease-in-out
  focus:ring-2 focus:ring-slate-400
">
  Hover Me
</button>
```

**Changes:**

- ✅ JavaScript hover → CSS pseudo-classes
- ✅ Inline-transforms → Tailwind utilities
- ✅ Add smooth transitions
- ✅ Add focus-ring for accessibility

---

### Pattern 5: Card Migration

#### Before (V26)

```typescript
import { V26MarketingCard } from '@/components/design-system/V26MarketingCard';
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

<V26MarketingCard
  style={{
    borderColor: UNIFIED_DESIGN_TOKENS.colors.border_neutral,
    boxShadow: `0 0 20px ${UNIFIED_DESIGN_TOKENS.colors.beige_glow_30}`
  }}
>
  <h3>Feature Title</h3>
  <p>Feature description goes here.</p>
</V26MarketingCard>
```

#### After (V28)

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card className="rounded-2xl border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
  <CardHeader>
    <CardTitle className="text-slate-900">Feature Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-slate-600">Feature description goes here.</p>
  </CardContent>
</Card>
```

**Changes:**

- ✅ Structured sections (Header, Content)
- ✅ Semantic Tailwind classes
- ✅ Hover effects via CSS
- ✅ Remove UNIFIED_DESIGN_TOKENS

---

### Pattern 6: Badge Migration

#### Before (V26)

```typescript
import { V26Badge } from '@/components/design-system/V26Badge';

<V26Badge variant="primary">New</V26Badge>
```

#### After (V28)

```typescript
import { V28Badge } from '@/components/design-system/V28Badge';

<V28Badge variant="primary">New</V28Badge>
```

**Changes:**

- ✅ V26Badge → V28Badge (same API, upgraded internals)

---

### Pattern 7: Icon Box Migration

#### Before (V26)

```typescript
import { V26IconBox } from '@/components/design-system/V26IconBox';
import { Zap } from 'lucide-react';

<V26IconBox>
  <Zap className="h-6 w-6" />
</V26IconBox>
```

#### After (V28)

```typescript
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { Zap } from 'lucide-react';

<V28IconBox>
  <Zap className="h-6 w-6" />
</V28IconBox>
```

**Changes:**

- ✅ V26IconBox → V28IconBox (same API, flat design)

---

## 🔍 COMMON EDGE CASES

### Edge Case 1: Dynamic Colors

#### Problem:

```typescript
// ❌ How to migrate dynamic colors?
const status = order.status; // 'pending' | 'completed' | 'cancelled'
<div style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors[`status_${status}`]
}} />
```

#### Solution:

```typescript
// ✅ Use Tailwind with conditional classes
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
} as const;

<div className={statusColors[status]}>
  {status}
</div>
```

---

### Edge Case 2: Complex Shadows

#### Problem:

```typescript
// ❌ Complex shadow with glow
<div style={{
  boxShadow: `0 0 20px ${UNIFIED_DESIGN_TOKENS.colors.beige_glow_30},
              0 4px 6px rgba(0,0,0,0.1)`
}} />
```

#### Solution:

```typescript
// ✅ Tailwind + custom shadow
<div className="shadow-lg shadow-slate-200/50" />

// Or: Define custom shadow in tailwind.config.ts
// theme: {
//   extend: {
//     boxShadow: {
//       'glow': '0 0 20px rgba(226, 232, 240, 0.5), 0 4px 6px rgba(0,0,0,0.1)'
//     }
//   }
// }
<div className="shadow-glow" />
```

---

### Edge Case 3: Responsive Styles

#### Problem:

```typescript
// ❌ Inline responsive styles
<div style={{
  padding: window.innerWidth < 768
    ? UNIFIED_DESIGN_TOKENS.spacing.sm
    : UNIFIED_DESIGN_TOKENS.spacing.lg
}} />
```

#### Solution:

```typescript
// ✅ Tailwind responsive utilities
<div className="p-4 md:p-8" />
```

---

## ⚠️ BREAKING CHANGES

### 1. UNIFIED_DESIGN_TOKENS Import Blocked

**Since:** V28.2.27  
**Impact:** ESLint blocks new imports automatically

```typescript
// ❌ Will be blocked by ESLint:
import { UNIFIED_DESIGN_TOKENS } from "@/lib/design-system/unified-design-tokens";

// ✅ Use Tailwind instead:
className = "bg-slate-700 text-white";
```

**Migration:**

1. Find all UNIFIED_DESIGN_TOKENS usages
2. Replace with Tailwind equivalents (see color mapping table)
3. Remove import

---

### 2. V26-Components Import Blocked

**Since:** V28.2.27  
**Impact:** ESLint blocks new V26 imports

```typescript
// ❌ Will be blocked by ESLint:
import { V26Button } from "@/components/design-system/V26Button";

// ✅ Use V28 components:
import { Button } from "@/components/ui/button";
```

**Exception:** Existing V26 components in codebase still work (backward compatibility), but no new usages allowed.

---

### 3. V29 Complete Removal

**Planned:** V29.0 (Q1 2026)  
**Impact:** All V26 components will be **deleted**

**Action Required:**

- ✅ Migrate ALL V26 usages before V29.0
- ✅ Run migration audit: `grep -r "V26" src/`
- ✅ Test all migrated components

---

## 🧪 TESTING CHECKLIST

### After Migration

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] ESLint passes without warnings (`npx eslint src/ --max-warnings 0`)
- [ ] Build succeeds (`npm run build`)
- [ ] Visual regression test (screenshot comparison)
- [ ] Unit tests pass (`npm run test`)
- [ ] Integration tests pass
- [ ] Lighthouse score >95
- [ ] Manual testing (desktop + mobile)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

---

## 🆘 TROUBLESHOOTING

### Issue 1: ESLint Blocks My Import

**Error:**

```
⛔ UNIFIED_DESIGN_TOKENS ist deprecated!
   Nutze Tailwind slate-* classes.
   Migration Guide: docs/V28_MIGRATION_GUIDE.md
```

**Solution:**

- See color mapping table above
- Replace with Tailwind classes
- Remove UNIFIED_DESIGN_TOKENS import

---

### Issue 2: Component Looks Different After Migration

**Problem:** V28 component doesn't match V26 visual exactly.

**Solution:**

1. Check color mapping (V26 colors → V28 slate-\*)
2. Inspect spacing (V26 used custom spacing)
3. Compare shadows/borders (V28 uses subtle shadows)
4. Add custom classes if needed:
   ```typescript
   <Button className="bg-slate-700 hover:bg-slate-800 shadow-lg">
   ```

---

### Issue 3: TypeScript Errors After Migration

**Problem:** Type errors in migrated component.

**Solution:**

1. Check prop types (V28 components have stricter types)
2. Ensure all required props are provided
3. Use TypeScript-strict-mode for early detection:
   ```json
   { "strict": true }
   ```

---

### Issue 4: Performance Regression

**Problem:** Migrated page loads slower.

**Solution:**

1. Check bundle-size: `npm run build`
2. Use code-splitting: `lazy(() => import(...))`
3. Optimize images: WebP, responsive sizes
4. Run Lighthouse audit: `npm run lighthouse:ci`

---

## 📞 SUPPORT & RESOURCES

### Documentation

- **Component Registry:** `docs/COMPONENT_REGISTRY.md`
- **Lessons Learned:** `docs/LESSONS_LEARNED.md`
- **Project Memory:** `docs/PROJECT_MEMORY.md`

### Tools

- **Design System Linter:** `scripts/design-system-lint.ts`
- **Migration Scripts:** `scripts/` (various)

### Help Channels

- **GitHub Issues:** Tag with `migration` label
- **Code Review:** Request review for migration PRs
- **Team Chat:** #design-system channel

---

## 📊 MIGRATION STATISTICS

### Completed Migrations (as of 2025-10-29)

- **Total Components:** 247 migrated
- **V26 → V28:** 189 components
- **UNIFIED_DESIGN_TOKENS removed:** 156 usages
- **Hardcoded colors removed:** 87 instances

### Remaining Work

- **V26 Components:** 22 deprecated (still functional)
- **Test Coverage:** 67% → 80% target
- **Documentation:** 4/4 guides complete ✅

---

**Last Updated:** 2025-10-29  
**Version:** V28.1  
**Maintainer:** Development Team  
**Status:** ✅ Complete & Production-Ready
