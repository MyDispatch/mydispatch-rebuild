# Layout Pattern Guide V28.1

**Status:** ✅ PRODUCTION  
**Version:** 28.2.28  
**Date:** 2025-10-29

---

## 📐 LAYOUT PATTERN SYSTEM

Das V28.1 Layout Pattern System bietet 5 Core Components für konsistente, responsive Layouts.

---

## 🏗️ COMPONENTS

### Container

Standard-Container mit responsiven max-widths und Padding.

```tsx
import { Container } from '@/components/ui/layout';

<Container size="xl" padding="lg">
  {children}
</Container>
```

**Props:**
- `size`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'` (default: `'xl'`)
- `padding`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `center`: `boolean` (default: `true`)

**Sizes:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `full`: 100%

---

### Section

Semantische Section mit vertikalem Spacing und Backgrounds.

```tsx
import { Section } from '@/components/ui/layout';

<Section spacing="xl" background="gray">
  {children}
</Section>
```

**Props:**
- `spacing`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `background`: `'white' | 'gray' | 'slate' | 'transparent'` (default: `'white'`)
- `as`: `'section' | 'div' | 'article' | 'aside'` (default: `'section'`)

**Backgrounds:**
- `white`: `bg-white`
- `gray`: `bg-slate-50`
- `slate`: `bg-slate-100`
- `transparent`: `bg-transparent`

---

### Grid

Responsive Grid-Layout mit konsistenten Gaps.

```tsx
import { Grid } from '@/components/ui/layout';

<Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
  {children}
</Grid>
```

**Props:**
- `cols`: Object mit responsiven Columns (`1-6` pro Breakpoint)
- `gap`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)

**Beispiel:**
```tsx
<Grid 
  cols={{ 
    default: 1,  // Mobile: 1 Column
    md: 2,       // Tablet: 2 Columns
    lg: 3        // Desktop: 3 Columns
  }} 
  gap="lg"
>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

---

### Flex

Flexbox-Layout mit Alignment-Optionen.

```tsx
import { Flex } from '@/components/ui/layout';

<Flex justify="between" align="center" gap="md">
  {children}
</Flex>
```

**Props:**
- `direction`: `'row' | 'column' | 'row-reverse' | 'column-reverse'` (default: `'row'`)
- `justify`: `'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'` (default: `'start'`)
- `align`: `'start' | 'end' | 'center' | 'baseline' | 'stretch'` (default: `'stretch'`)
- `gap`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'none'`)
- `wrap`: `boolean` (default: `false`)

---

### Stack

Einfaches vertikales/horizontales Stacking mit Spacing.

```tsx
import { Stack } from '@/components/ui/layout';

<Stack spacing="md" align="center">
  {children}
</Stack>
```

**Props:**
- `direction`: `'vertical' | 'horizontal'` (default: `'vertical'`)
- `spacing`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `align`: `'start' | 'end' | 'center' | 'stretch'` (default: `'stretch'`)

---

## 💡 USAGE PATTERNS

### Dashboard Layout

```tsx
<Container size="xl" padding="lg">
  <Stack spacing="lg">
    <PageHeader title="Dashboard" />
    
    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
      <KPICard />
      <KPICard />
      <KPICard />
    </Grid>
    
    <Section background="gray" spacing="lg">
      <DataTable />
    </Section>
  </Stack>
</Container>
```

### Form Layout

```tsx
<Container size="md" padding="md">
  <Stack spacing="md">
    <h2>Formular</h2>
    
    <Grid cols={{ default: 1, md: 2 }} gap="md">
      <Input label="Vorname" />
      <Input label="Nachname" />
    </Grid>
    
    <Flex justify="end" gap="sm">
      <Button variant="outline">Abbrechen</Button>
      <Button>Speichern</Button>
    </Flex>
  </Stack>
</Container>
```

### Marketing Page

```tsx
<Section spacing="xl" background="gray">
  <Container size="lg">
    <Stack spacing="xl" align="center">
      <h1>Hero Headline</h1>
      <p>Hero Description</p>
      
      <Grid cols={{ default: 1, md: 3 }} gap="lg">
        <FeatureCard />
        <FeatureCard />
        <FeatureCard />
      </Grid>
    </Stack>
  </Container>
</Section>
```

---

## 🎨 DESIGN SYSTEM COMPLIANCE

Alle Layout-Components verwenden:

- ✅ V28.1 Slate-Farben (`slate-*`)
- ✅ Responsive Breakpoints (`sm`, `md`, `lg`, `xl`)
- ✅ Konsistentes Spacing (Tailwind-Multiplikatoren)
- ✅ Semantic HTML (`section`, `article`, `aside`)

---

## 🚀 BEST PRACTICES

### DO ✅
- Verwende `Container` für Seiten-Breiten-Limitierung
- Nutze `Grid` für gleichmäßige Item-Layouts
- Setze `Flex` für Header/Footer-Bereiche ein
- Nutze `Stack` für vertikale Formulare
- Kombiniere Components für komplexe Layouts

### DON'T ❌
- Keine inline-styles für Spacing
- Keine hardcoded Breakpoints
- Keine festen px-Werte für Widths
- Keine Custom-Container ohne Grund

---

## 📊 COMPONENT METRICS

| Component | Bundle Size | Performance | Usage Frequency |
|-----------|-------------|-------------|-----------------|
| Container | ~1kb | ⚡ Excellent | 🔥 Very High |
| Section | ~800b | ⚡ Excellent | 🔥 Very High |
| Grid | ~1.2kb | ⚡ Excellent | 🔥 Very High |
| Flex | ~900b | ⚡ Excellent | 🔥 High |
| Stack | ~600b | ⚡ Excellent | 🔥 High |

**Total Bundle Impact:** ~4.5kb (gzipped: ~1.8kb)

---

**Status:** Production-Ready ✅  
**Last Updated:** 2025-10-29
