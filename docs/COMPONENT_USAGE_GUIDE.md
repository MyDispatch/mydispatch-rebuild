# 🎨 COMPONENT USAGE GUIDE - V28.1
## Wie du das Design System richtig nutzt

> **Version:** 28.1  
> **Status:** PRODUCTION  
> **Basis:** Design System V28.1 Professional Minimalism

---

## 🚨 ABSOLUTE RULES

### REGEL 1: NIEMALS Components außerhalb der Library erstellen

❌ **VERBOTEN:**
```tsx
// page.tsx
function MyPage() {
  return (
    <button className="bg-slate-700 text-white px-8 py-3 rounded-xl">
      Click me
    </button>
  );
}
```

✅ **RICHTIG:**
```tsx
// page.tsx
import { V28Button } from '@/components/design-system/V28Button';

function MyPage() {
  return (
    <V28Button variant="primary">
      Click me
    </V28Button>
  );
}
```

---

### REGEL 2: IMMER ZUERST Component Registry prüfen

**WORKFLOW:**
1. ✅ Brauchst du ein UI-Element?
2. ✅ Öffne `docs/COMPONENT_REGISTRY.md`
3. ✅ Suche nach ähnlicher Component (Ctrl+F / Cmd+F)
4. ✅ Existiert sie? → **NUTZEN!**
5. ✅ Existiert sie NICHT? → Zur Library hinzufügen (siehe unten)

---

### REGEL 3: Keine Hardcoded Values

❌ **VERBOTEN:**
```tsx
// Hardcoded Farben
<div style={{ color: '#334155' }}>Text</div>
<div className="text-[#334155]">Text</div>

// Hardcoded Spacing
<div className="py-20 mt-10 gap-5">Content</div>
<div style={{ padding: '80px' }}>Content</div>
```

✅ **RICHTIG:**
```tsx
// Design Tokens
import { designTokens } from '@/config/design-tokens';
<div style={{ color: designTokens.colors.primary.DEFAULT }}>Text</div>

// Semantic Classes
<div className="text-slate-700">Text</div>

// Layout Components
<Section spacing="xl">Content</Section>
```

---

### REGEL 4: Props statt Customization

❌ **VERBOTEN:**
```tsx
// Override mit wichtigen CSS
<V28Button className="!bg-red-500">Delete</V28Button>

// Inline styles überschreiben
<V28Button style={{ backgroundColor: 'red' }}>Delete</V28Button>
```

✅ **RICHTIG:**
```tsx
// Falls Variant fehlt → Component erweitern
<V28Button variant="danger">Delete</V28Button>

// Oder: Neue Variant zur Component hinzufügen
```

**Falls Variant fehlt:**
1. Component erweitern (neue Variant hinzufügen)
2. NICHT mit className/style überschreiben!

---

## 🎯 BEST PRACTICES

### Component Composition Pattern

✅ **Nutze Component Composition:**
```tsx
<V28MarketingCard>
  <Flex direction="col" gap="md">
    <V28IconBox icon={Truck} variant="primary" />
    <h3 className="text-2xl font-semibold text-slate-900">
      Feature Title
    </h3>
    <p className="text-slate-600 leading-relaxed">
      Feature description here...
    </p>
    <V28Button variant="secondary">Learn More</V28Button>
  </Flex>
</V28MarketingCard>
```

---

### Layout Pattern System

✅ **Nutze Layout Components für ALLE Layouts:**
```tsx
// Page Structure
<Section spacing="xl" background="white">
  <Container size="xl" padding="lg">
    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
      {items.map(item => (
        <V28MarketingCard key={item.id}>
          {/* Content */}
        </V28MarketingCard>
      ))}
    </Grid>
  </Container>
</Section>
```

❌ **NIEMALS:**
```tsx
// Hardcoded Layout
<div className="py-20 md:py-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Content */}
    </div>
  </div>
</div>
```

---

### Semantic HTML

✅ **Nutze semantische Components:**
```tsx
<Section spacing="xl" background="white" as="main">
  <Container size="xl">
    <Stack spacing="lg">
      <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
        Title
      </h1>
      <p className="text-lg text-slate-600">Description</p>
    </Stack>
  </Container>
</Section>
```

---

## 🆕 NEUE COMPONENT HINZUFÜGEN

### Workflow

#### 1. Prüfe Necessity
- ✅ Brauchst du wirklich eine neue Component?
- ✅ Kann bestehende Component angepasst werden?
- ✅ Ist Component wiederverwendbar?

#### 2. Erstelle Component

**Ordner-Struktur:**
```
src/components/design-system/V28NewComponent.tsx
```

**Component Template:**
```tsx
/* ==================================================================================
   V28 NEW COMPONENT - BESCHREIBUNG
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ Design Tokens verwendet
   ✅ Responsive
   ✅ Accessible
   ================================================================================== */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/config/design-tokens';

interface V28NewComponentProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function V28NewComponent({
  children,
  variant = 'primary',
  className,
}: V28NewComponentProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-6',
        variant === 'primary' && 'bg-slate-100 text-slate-900',
        variant === 'secondary' && 'bg-white border border-slate-200',
        className
      )}
    >
      {children}
    </div>
  );
}
```

#### 3. Tests schreiben (Optional, aber empfohlen)
```tsx
// src/components/design-system/V28NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { V28NewComponent } from './V28NewComponent';

describe('V28NewComponent', () => {
  it('renders children correctly', () => {
    render(<V28NewComponent>Test Content</V28NewComponent>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    const { container } = render(
      <V28NewComponent>Content</V28NewComponent>
    );
    expect(container.firstChild).toHaveClass('bg-slate-100');
  });
});
```

#### 4. Dokumentiere

**Update COMPONENT_REGISTRY.md:**
```markdown
### V28NewComponent
- **Path:** `src/components/design-system/V28NewComponent.tsx`
- **Status:** ✅ PRODUCTION
- **Purpose:** [Beschreibung]
- **Props:**
  - `children: ReactNode`
  - `variant?: 'primary' | 'secondary'`
  - `className?: string`
- **Usage:**
  ```tsx
  <V28NewComponent variant="primary">
    Content
  </V28NewComponent>
  ```
```

**Update CHANGELOG.md:**
```markdown
### [2025-10-28] V28.1 Component Library
- Added: V28NewComponent - [Beschreibung]
```

#### 5. Export

**Update export file:**
```tsx
// src/components/design-system/index.ts
export { V28NewComponent } from './V28NewComponent';
```

#### 6. Review

**Self-Review Checklist:**
- [ ] Alle Design Tokens genutzt?
- [ ] Type-safe (keine `any` types)?
- [ ] Accessible (ARIA labels, semantic HTML)?
- [ ] Responsive für alle Breakpoints?
- [ ] Props Interface dokumentiert?
- [ ] Component exportiert?
- [ ] COMPONENT_REGISTRY.md updated?
- [ ] CHANGELOG.md updated?

---

## 📊 IMPORT PATTERNS

### Richtige Imports

✅ **Design System Components:**
```tsx
// V28 Components
import { V28Button } from '@/components/design-system/V28Button';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';

// Layout Components
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout';

// Pricing Components
import { 
  V28PricingCard, 
  V28PricingHero, 
  V28AddonCard 
} from '@/components/pricing';

// Home Components
import { 
  V28HeroBackground, 
  V28DashboardPreview 
} from '@/components/home';

// Design Tokens
import { designTokens } from '@/config/design-tokens';
```

❌ **FALSCH:**
```tsx
// Relative Imports
import { V28Button } from '../../../components/design-system/V28Button';

// V26 Components (DEPRECATED!)
import { V26Button } from '@/components/design-system/V26Button';
```

---

## 🎨 STYLING PATTERNS

### Design Tokens Usage

✅ **RICHTIG:**
```tsx
import { designTokens } from '@/config/design-tokens';

// Inline Styles mit Tokens
<div style={{
  color: designTokens.colors.text.primary,
  backgroundColor: designTokens.colors.bg.canvas,
  padding: designTokens.spacing[6],
}}>
  Content
</div>

// Tailwind Classes (preferred)
<div className="text-slate-900 bg-canvas p-6">
  Content
</div>
```

---

### Responsive Design

✅ **Mobile-First:**
```tsx
<div className="
  text-base md:text-lg lg:text-xl
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  Content
</div>
```

---

## 🚫 ANTI-PATTERNS

### 1. Component Duplication

❌ **FALSCH:**
```tsx
// Neue Button Component erstellen
export function MyButton({ children }: { children: ReactNode }) {
  return (
    <button className="bg-slate-700 text-white px-8 py-3 rounded-xl">
      {children}
    </button>
  );
}
```

✅ **RICHTIG:**
```tsx
// Bestehende Component nutzen
import { V28Button } from '@/components/design-system/V28Button';
<V28Button variant="primary">{children}</V28Button>
```

---

### 2. Fehlende Type Definitions

❌ **FALSCH:**
```tsx
export function MyComponent(props: any) {
  return <div>{props.children}</div>;
}
```

✅ **RICHTIG:**
```tsx
interface MyComponentProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function MyComponent({ 
  children, 
  variant = 'primary' 
}: MyComponentProps) {
  return <div>{children}</div>;
}
```

---

### 3. Inline Styles ohne Tokens

❌ **FALSCH:**
```tsx
<div style={{ 
  color: '#334155',
  fontSize: '18px',
  padding: '24px'
}}>
  Content
</div>
```

✅ **RICHTIG:**
```tsx
import { designTokens } from '@/config/design-tokens';

<div style={{
  color: designTokens.colors.primary.DEFAULT,
  fontSize: designTokens.typography.fontSize.lg,
  padding: designTokens.spacing[6]
}}>
  Content
</div>

// ODER Tailwind (preferred):
<div className="text-slate-700 text-lg p-6">
  Content
</div>
```

---

## 📚 QUICK REFERENCE

### Häufig genutzte Components

| Component | Import | Usage |
|-----------|--------|-------|
| Button | `import { V28Button } from '@/components/design-system/V28Button'` | `<V28Button variant="primary">Text</V28Button>` |
| Card | `import { V28MarketingCard } from '@/components/design-system/V28MarketingCard'` | `<V28MarketingCard>{children}</V28MarketingCard>` |
| IconBox | `import { V28IconBox } from '@/components/design-system/V28IconBox'` | `<V28IconBox icon={Truck} variant="primary" />` |
| Section | `import { Section } from '@/components/ui/layout'` | `<Section spacing="xl">{children}</Section>` |
| Grid | `import { Grid } from '@/components/ui/layout'` | `<Grid cols={{ md: 2, lg: 3 }}>{children}</Grid>` |

---

## ✅ FINAL CHECKLIST

Vor JEDEM Commit:
- [ ] Keine hardcoded Farben
- [ ] Keine hardcoded Spacings
- [ ] Layout Components verwendet
- [ ] V28 Components verwendet
- [ ] Design Tokens genutzt
- [ ] Type-safe (keine `any`)
- [ ] Responsive
- [ ] Accessible
- [ ] COMPONENT_REGISTRY.md gecheckt
- [ ] Keine V26 Components verwendet

---

**LAST UPDATE:** 2025-10-28  
**VERSION:** 28.1  
**STATUS:** PRODUCTION
