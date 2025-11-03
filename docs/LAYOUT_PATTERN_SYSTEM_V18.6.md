# 🎨 LAYOUT PATTERN SYSTEM V18.6 - MANDATORY STANDARD

**Status:** 🔒 **PFLICHT FÜR ALLE BEREICHE**  
**Gültig für:** Alle Seiten (vor & nach Login)  
**Version:** 18.6  
**Datum:** 2025-10-28

---

## 🎯 MISSION

Dieses Dokument definiert das **verbindliche Layout-Pattern-System** für MyDispatch.

**ABSOLUTE REGEL:**
- ❌ **NIEMALS** inline Styles mit hardcoded values
- ❌ **NIEMALS** inkonsistente Abstände
- ✅ **IMMER** Layout Components nutzen
- ✅ **IMMER** Design System Spacing

---

## 📐 LAYOUT FOUNDATION COMPONENTS

### 1. Container

**Zweck:** Konsistente max-width und padding für Content-Bereiche

**Location:** `src/components/ui/layout/Container.tsx`

**Props:**
```typescript
interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
  noPaddingMobile?: boolean
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article' | 'main' | 'aside'
}
```

**Usage:**
```tsx
<Container size="xl" padding="lg">
  {/* Content */}
</Container>
```

**Size Mapping:**
- `sm`: 640px (max-w-screen-sm)
- `md`: 768px (max-w-screen-md)
- `lg`: 1024px (max-w-screen-lg)
- `xl`: 1280px (max-w-screen-xl) - **DEFAULT**
- `2xl`: 1536px (max-w-screen-2xl)
- `full`: 100% (max-w-full)

**Padding Mapping:**
- `none`: Kein Padding
- `sm`: 16px/24px → 24px/32px (Mobile → Desktop)
- `md`: 16px/32px → 32px/48px
- `lg`: 24px/48px → 48px/64px
- `xl`: 24px/64px → 64px/96px

---

### 2. Section

**Zweck:** Wrapper für Content-Sections mit konsistenten Abständen

**Location:** `src/components/ui/layout/Section.tsx`

**Props:**
```typescript
interface SectionProps {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  background?: 'white' | 'gray' | 'gradient' | 'primary' | 'transparent'
  containerSize?: ContainerSize
  fullWidth?: boolean
  children: ReactNode
  className?: string
  id?: string
}
```

**Usage:**
```tsx
<Section spacing="xl" background="white">
  {/* Content */}
</Section>
```

**Spacing Mapping (Vertical):**
- `none`: 0
- `sm`: 32px → 48px (py-8 md:py-12)
- `md`: 48px → 64px (py-12 md:py-16)
- `lg`: 64px → 96px (py-16 md:py-24) - **DEFAULT**
- `xl`: 80px → 128px (py-20 md:py-32)
- `2xl`: 96px → 160px (py-24 md:py-40)

---

### 3. Grid

**Zweck:** Responsive CSS Grid mit konsistenten Gaps

**Location:** `src/components/ui/layout/Grid.tsx`

**Props:**
```typescript
interface GridProps {
  cols?: {
    default?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  } | number
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  children: ReactNode
  className?: string
}
```

**Usage:**
```tsx
<Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
  <Card />
  <Card />
  <Card />
</Grid>
```

**Gap Mapping:**
- `none`: 0
- `xs`: 8px (gap-2)
- `sm`: 16px (gap-4)
- `md`: 24px (gap-6) - **DEFAULT**
- `lg`: 32px (gap-8)
- `xl`: 48px (gap-12)
- `2xl`: 64px (gap-16)

---

### 4. Flex

**Zweck:** Flexbox Layout mit konsistenten Abständen

**Location:** `src/components/ui/layout/Flex.tsx`

**Props:**
```typescript
interface FlexProps {
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  children: ReactNode
  className?: string
}
```

**Usage:**
```tsx
<Flex direction="row" justify="between" align="center" gap="md">
  <Logo />
  <Navigation />
</Flex>
```

---

### 5. Stack

**Zweck:** Vertical/Horizontal Stack mit konsistenten Abständen

**Location:** `src/components/ui/layout/Stack.tsx`

**Props:**
```typescript
interface StackProps {
  direction?: 'vertical' | 'horizontal'
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  divider?: boolean
  children: ReactNode
  className?: string
}
```

**Usage:**
```tsx
<Stack spacing="lg" divider>
  <Item />
  <Item />
  <Item />
</Stack>
```

---

## 🎭 STANDARD SECTION PATTERNS

### Pattern 1: Standard Content Section

```tsx
<Section spacing="lg" background="white">
  <Container size="xl">
    {/* Section Header */}
    <Stack spacing="md" align="center" className="text-center mb-12">
      <h2 className="text-3xl font-bold">Section Title</h2>
      <p className="text-lg text-slate-600 max-w-2xl">
        Section Description
      </p>
    </Stack>

    {/* Section Content */}
    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
      {/* Cards */}
    </Grid>
  </Container>
</Section>
```

### Pattern 2: Feature Grid Section

```tsx
<Section spacing="xl" background="gray">
  <Container>
    <Stack spacing="xl" align="center" className="text-center">
      {/* Header */}
      <Stack spacing="md" className="max-w-3xl">
        <h2 className="text-4xl font-bold">Features</h2>
        <p className="text-lg text-slate-600">
          Alles was Sie brauchen
        </p>
      </Stack>

      {/* Grid */}
      <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg" className="w-full">
        {/* Feature Cards */}
      </Grid>
    </Stack>
  </Container>
</Section>
```

### Pattern 3: CTA Section

```tsx
<Section spacing="xl" background="white">
  <Container size="lg">
    <Stack spacing="lg" align="center" className="text-center">
      <h2 className="text-4xl font-bold">
        Starten Sie noch heute
      </h2>
      <p className="text-lg text-slate-600 max-w-2xl">
        Unverbindliche Demo anfragen
      </p>
      <Flex gap="md" justify="center">
        <Button variant="primary" size="lg">Demo anfragen</Button>
        <Button variant="secondary" size="lg">Mehr erfahren</Button>
      </Flex>
    </Stack>
  </Container>
</Section>
```

---

## 📱 RESPONSIVE GUIDELINES

### Mobile (< 640px)
- 1 column layouts (`cols={{ default: 1 }}`)
- Vertical stacks (`direction="vertical"`)
- Full-width buttons
- Reduced spacing (`spacing="sm"` oder `"md"`)

### Tablet (640px - 1024px)
- 2 column layouts (`cols={{ sm: 1, md: 2 }}`)
- Side-by-side CTAs
- Medium spacing (`spacing="md"`)

### Desktop (> 1024px)
- 3-4 column layouts (`cols={{ lg: 3, xl: 4 }}`)
- Full grid layouts
- Large spacing (`spacing="lg"`, `spacing="xl"`)

---

## 🚨 ENFORCEMENT RULES

### ❌ VERBOTEN

1. **Hardcoded Spacing:**
```tsx
// ❌ FALSCH
<div className="py-20 px-10">
  <div className="mt-10 mb-8 gap-4">
```

2. **Inkonsistente Abstände:**
```tsx
// ❌ FALSCH
<div className="mt-10 mb-12">  // Unterschiedliche Top/Bottom
<div className="gap-5">         // Non-standard Gap
```

3. **Non-semantic HTML:**
```tsx
// ❌ FALSCH
<div>
  <div className="text-2xl">Title</div>
  <span>Content</span>
</div>
```

### ✅ ERLAUBT

1. **Layout Components:**
```tsx
// ✅ RICHTIG
<Section spacing="xl">
  <Container size="xl">
    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
```

2. **Konsistente Abstände:**
```tsx
// ✅ RICHTIG
<Stack spacing="lg">  // Konsistent
  <Item />
  <Item />
</Stack>
```

3. **Semantic HTML:**
```tsx
// ✅ RICHTIG
<Section>
  <h2>Title</h2>
  <p>Content</p>
</Section>
```

---

## ✅ IMPLEMENTATION CHECKLIST

**Vor JEDER neuen Seite/Component:**

### Layout Foundation
- [ ] Nutze `Section` für alle Sections
- [ ] Nutze `Container` für Content-Bereiche
- [ ] Nutze `Grid` für responsive Layouts
- [ ] Nutze `Flex` für flexible Layouts
- [ ] Nutze `Stack` für vertikale/horizontale Stacks

### Spacing
- [ ] KEINE hardcoded spacing values
- [ ] KEINE inkonsistenten Abstände
- [ ] Verwende nur Design System Spacing
- [ ] Responsive Spacing überall

### HTML Structure
- [ ] Semantic HTML Elements
- [ ] Proper Heading Hierarchy (H1 → H2 → H3)
- [ ] Accessibility-konform

### Responsive Design
- [ ] Mobile-first Approach
- [ ] Breakpoints korrekt
- [ ] Touch-friendly (min 44x44px)
- [ ] Lesbarkeit auf allen Devices

---

## 📋 MIGRATION GUIDE

### Bestehende Seiten migrieren

**Schritt 1: Section ersetzen**
```tsx
// ❌ VORHER
<div className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4">

// ✅ NACHHER
<Section spacing="xl" background="white">
  <Container size="xl">
```

**Schritt 2: Grid ersetzen**
```tsx
// ❌ VORHER
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// ✅ NACHHER
<Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
```

**Schritt 3: Flex ersetzen**
```tsx
// ❌ VORHER
<div className="flex justify-between items-center gap-4">

// ✅ NACHHER
<Flex justify="between" align="center" gap="md">
```

---

## 🎓 TRAINING & EXAMPLES

### Complete Page Example

```tsx
import { Section, Container, Grid, Stack, Flex } from '@/components/ui/layout';

export function FeaturePage() {
  return (
    <>
      {/* Hero Section */}
      <Section spacing="xl" background="gradient">
        <Container size="lg">
          <Stack spacing="xl" align="center" className="text-center">
            <h1 className="text-5xl font-bold">Features</h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Alle Features im Überblick
            </p>
          </Stack>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section spacing="xl" background="white">
        <Container>
          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
            {FEATURES.map(feature => (
              <FeatureCard key={feature.id} {...feature} />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="xl" background="gray">
        <Container size="lg">
          <Stack spacing="lg" align="center" className="text-center">
            <h2 className="text-4xl font-bold">Jetzt starten</h2>
            <Flex gap="md" justify="center">
              <Button>Demo anfragen</Button>
              <Button variant="outline">Mehr erfahren</Button>
            </Flex>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
```

---

## 📚 RELATED DOCUMENTATION

- `docs/DESIGN_SYSTEM_VORGABEN_V18.3.md` - Design System Grundlagen
- `docs/MOBILE_LAYOUT_STANDARDS_V18.3.md` - Mobile-spezifische Standards
- `docs/LAYOUT_FREEZE_PROTECTION_V18.5.1.md` - Layout Freeze Regeln

---

**LAST UPDATE:** 2025-10-28  
**STATUS:** 🟢 AKTIV & PFLICHT  
**GÜLTIG FÜR:** Alle Bereiche (vor & nach Login)
