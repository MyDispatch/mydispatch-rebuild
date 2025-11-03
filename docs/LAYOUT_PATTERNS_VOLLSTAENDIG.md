# 🎨 VOLLSTÄNDIGE LAYOUT PATTERNS & SECTION STANDARDS
## KONSISTENTE AUSRICHTUNG FÜR HERO, SECTIONS, GRIDS & CO.

---

## 🎯 MISSION

Erstelle **standardisierte, wiederverwendbare Layout-Patterns** für alle Sections (Hero, Features, Pricing, etc.) mit:
- ✅ **Konsistente Abstände** (Spacing System)
- ✅ **Perfekte Ausrichtung** (Grid & Flex)
- ✅ **Responsive Design** (Mobile → Desktop)
- ✅ **Wiederverwendbarkeit** (Components)
- ✅ **Accessibility** (Semantic HTML)

**ABSOLUTE REGEL:**
- ❌ **NIEMALS** inline Styles mit hardcoded values
- ❌ **NIEMALS** inkonsistente Abstände
- ✅ **IMMER** Design Tokens nutzen
- ✅ **IMMER** Layout Components nutzen

---

## 📐 PHASE 1: LAYOUT FOUNDATION

### 1.1 Container System

**Erstelle: `/src/components/ui/layout/Container/Container.tsx`**

// Container.types.ts
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface ContainerProps {
/** Maximum width of the container */
size?: ContainerSize

/** Padding (responsive) */
padding?: ContainerPadding

/** Center content horizontally */
center?: boolean

/** Remove default padding on mobile */
noPaddingMobile?: boolean

/** Children */
children: React.ReactNode

/** Additional classes */
className?: string

/** HTML element */
as?: 'div' | 'section' | 'article' | 'main' | 'aside'
}

text
undefined
// Container.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { designTokens } from '@/config/design-tokens'
import type { ContainerProps } from './Container.types'

/**

Container Component

Provides consistent max-width and padding for content sections.

Uses Design System spacing for responsive padding.

@example

tsx
undefined
<Container size="lg" padding="lg">
<Hero />
</Container>
text
undefined
*/
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
(
{
size = 'xl',
padding = 'md',
center = true,
noPaddingMobile = false,
children,
className,
as: Component = 'div',
},
ref
) => {
// Max Width Mapping (Design System Breakpoints)
const sizeClasses = {
sm: 'max-w-screen-sm', // 640px
md: 'max-w-screen-md', // 768px
lg: 'max-w-screen-lg', // 1024px
xl: 'max-w-screen-xl', // 1280px
'2xl': 'max-w-screen-2xl', // 1536px
full: 'max-w-full',
}

text
// Responsive Padding (Design System Spacing)
const paddingClasses = {
  none: '',
  sm: 'px-4 py-6 md:px-6 md:py-8',           // 16px/24px → 24px/32px
  md: 'px-4 py-8 md:px-8 md:py-12',          // 16px/32px → 32px/48px
  lg: 'px-6 py-12 md:px-12 md:py-16',        // 24px/48px → 48px/64px
  xl: 'px-6 py-16 md:px-16 md:py-24',        // 24px/64px → 64px/96px
}

return (
  <Component
    ref={ref}
    className={cn(
      // Max Width
      sizeClasses[size],
      
      // Centering
      center && 'mx-auto',
      
      // Padding
      !noPaddingMobile && paddingClasses[padding],
      noPaddingMobile && cn(
        'px-0 py-0 md:px-8 md:py-12' // No padding on mobile
      ),
      
      // Custom className
      className
    )}
  >
    {children}
  </Component>
)
}
)

Container.displayName = 'Container'

text

### 1.2 Section Wrapper

**Erstelle: `/src/components/ui/layout/Section/Section.tsx`**

// Section.types.ts
export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type SectionBackground = 'white' | 'gray' | 'gradient' | 'primary' | 'transparent'

export interface SectionProps {
/** Vertical spacing (padding top/bottom) */
spacing?: SectionSpacing

/** Background variant */
background?: SectionBackground

/** Container size */
containerSize?: ContainerSize

/** Full width (no container) */
fullWidth?: boolean

/** Children */
children: React.ReactNode

/** Additional classes */
className?: string

/** HTML ID for anchor links */
id?: string
}

text
undefined
// Section.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { Container } from '../Container'
import type { SectionProps } from './Section.types'

/**

Section Component

Wraps content sections with consistent spacing and backgrounds.

Automatically includes Container unless fullWidth is true.

@example

tsx
undefined
<Section spacing="xl" background="gray">
<Heading>Features</Heading>

<FeatureGrid />
</Section>
text
undefined
*/
export const Section = forwardRef<HTMLElement, SectionProps>(
(
{
spacing = 'lg',
background = 'transparent',
containerSize = 'xl',
fullWidth = false,
children,
className,
id,
},
ref
) => {
// Vertical Spacing (Design System)
const spacingClasses = {
none: '',
sm: 'py-8 md:py-12', // 32px → 48px
md: 'py-12 md:py-16', // 48px → 64px
lg: 'py-16 md:py-24', // 64px → 96px
xl: 'py-20 md:py-32', // 80px → 128px
'2xl': 'py-24 md:py-40', // 96px → 160px
}

text
// Background Variants
const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50',
  primary: 'bg-primary text-white',
  transparent: 'bg-transparent',
}

const content = fullWidth ? (
  children
) : (
  <Container size={containerSize} padding="none">
    {children}
  </Container>
)

return (
  <section
    ref={ref}
    id={id}
    className={cn(
      // Spacing
      spacingClasses[spacing],
      
      // Background
      backgroundClasses[background],
      
      // Custom className
      className
    )}
  >
    {content}
  </section>
)
}
)

Section.displayName = 'Section'

text

### 1.3 Grid System

**Erstelle: `/src/components/ui/layout/Grid/Grid.tsx`**

// Grid.types.ts
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface GridProps {
/** Number of columns (responsive) */
cols?: {
default?: GridColumns
sm?: GridColumns
md?: GridColumns
lg?: GridColumns
xl?: GridColumns
} | GridColumns

/** Gap between grid items */
gap?: GridGap

/** Children */
children: React.ReactNode

/** Additional classes */
className?: string
}

text
undefined
// Grid.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import type { GridProps, GridColumns } from './Grid.types'

/**

Grid Component

Responsive CSS Grid with consistent gap spacing.

Supports different column counts per breakpoint.

@example

tsx
undefined
<Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">

<Card />
<Card />
<Card />
</Grid>
text
undefined
*/
export const Grid = forwardRef<HTMLDivElement, GridProps>(
(
{
cols = 1,
gap = 'md',
children,
className,
},
ref
) => {
// Gap Mapping (Design System Spacing)
const gapClasses = {
none: 'gap-0',
xs: 'gap-2', // 8px
sm: 'gap-4', // 16px
md: 'gap-6', // 24px
lg: 'gap-8', // 32px
xl: 'gap-12', // 48px
'2xl': 'gap-16', // 64px
}

text
// Column Classes
const getColClass = (num: GridColumns, breakpoint?: string) => {
  const prefix = breakpoint ? `${breakpoint}:` : ''
  return `${prefix}grid-cols-${num}`
}

// Build responsive column classes
const colClasses = typeof cols === 'number'
  ? getColClass(cols)
  : cn(
      cols.default && getColClass(cols.default),
      cols.sm && getColClass(cols.sm, 'sm'),
      cols.md && getColClass(cols.md, 'md'),
      cols.lg && getColClass(cols.lg, 'lg'),
      cols.xl && getColClass(cols.xl, 'xl'),
    )

return (
  <div
    ref={ref}
    className={cn(
      'grid',
      colClasses,
      gapClasses[gap],
      className
    )}
  >
    {children}
  </div>
)
}
)

Grid.displayName = 'Grid'

text

### 1.4 Flex Component

**Erstelle: `/src/components/ui/layout/Flex/Flex.tsx`**

// Flex.types.ts
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse'
export type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse'
export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface FlexProps {
/** Flex direction */
direction?: FlexDirection

/** Justify content */
justify?: FlexJustify

/** Align items */
align?: FlexAlign

/** Wrap behavior */
wrap?: FlexWrap

/** Gap between items */
gap?: FlexGap

/** Children */
children: React.ReactNode

/** Additional classes */
className?: string
}

text
undefined
// Flex.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import type { FlexProps } from './Flex.types'

/**

Flex Component

Flexible box layout with consistent spacing.

@example

tsx
undefined
<Flex direction="row" justify="between" align="center" gap="md">
<Logo />
<Navigation />
</Flex>
text
undefined
*/
export const Flex = forwardRef<HTMLDivElement, FlexProps>(
(
{
direction = 'row',
justify = 'start',
align = 'start',
wrap = 'nowrap',
gap = 'none',
children,
className,
},
ref
) => {
const directionClasses = {
row: 'flex-row',
'row-reverse': 'flex-row-reverse',
col: 'flex-col',
'col-reverse': 'flex-col-reverse',
}

text
const justifyClasses = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
}

const wrapClasses = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
}

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
  '2xl': 'gap-16',
}

return (
  <div
    ref={ref}
    className={cn(
      'flex',
      directionClasses[direction],
      justifyClasses[justify],
      alignClasses[align],
      wrapClasses[wrap],
      gapClasses[gap],
      className
    )}
  >
    {children}
  </div>
)
}
)

Flex.displayName = 'Flex'

text

### 1.5 Stack Component

**Erstelle: `/src/components/ui/layout/Stack/Stack.tsx`**

// Stack.types.ts
export type StackDirection = 'vertical' | 'horizontal'
export type StackSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch'

export interface StackProps {
/** Stack direction */
direction?: StackDirection

/** Spacing between items */
spacing?: StackSpacing

/** Alignment */
align?: StackAlign

/** Show dividers between items */
divider?: boolean

/** Children */
children: React.ReactNode

/** Additional classes */
className?: string
}

text
undefined
// Stack.tsx
'use client'

import { forwardRef, Children } from 'react'
import { cn } from '@/lib/utils/cn'
import { Divider } from '../../content/Divider'
import type { StackProps } from './Stack.types'

/**

Stack Component

Vertical or horizontal stack with consistent spacing.

Optionally shows dividers between items.

@example

tsx
undefined
<Stack spacing="lg" divider>
<Text>Item 1</Text>

<Text>Item 2</Text>

<Text>Item 3</Text>

</Stack>
text
undefined
*/
export const Stack = forwardRef<HTMLDivElement, StackProps>(
(
{
direction = 'vertical',
spacing = 'md',
align = 'start',
divider = false,
children,
className,
},
ref
) => {
const spacingClasses = {
none: 'gap-0',
xs: 'gap-2',
sm: 'gap-4',
md: 'gap-6',
lg: 'gap-8',
xl: 'gap-12',
'2xl': 'gap-16',
}

text
const alignClasses = {
  start: direction === 'vertical' ? 'items-start' : 'justify-start',
  center: direction === 'vertical' ? 'items-center' : 'justify-center',
  end: direction === 'vertical' ? 'items-end' : 'justify-end',
  stretch: direction === 'vertical' ? 'items-stretch' : 'justify-stretch',
}

const childrenArray = Children.toArray(children)

return (
  <div
    ref={ref}
    className={cn(
      'flex',
      direction === 'vertical' ? 'flex-col' : 'flex-row',
      !divider && spacingClasses[spacing],
      alignClasses[align],
      className
    )}
  >
    {divider
      ? childrenArray.map((child, index) => (
          <div key={index}>
            {child}
            {index < childrenArray.length - 1 && (
              <Divider orientation={direction === 'vertical' ? 'horizontal' : 'vertical'} />
            )}
          </div>
        ))
      : children}
  </div>
)
}
)

Stack.displayName = 'Stack'

text

---

## 🎭 PHASE 2: SECTION PATTERNS

### 2.1 Hero Pattern

**Erstelle: `/src/components/ui/patterns/Hero/Hero.tsx`**

// Hero.types.ts
export type HeroVariant = 'default' | 'centered' | 'split'
export type HeroSize = 'md' | 'lg' | 'xl'

export interface HeroProps {
/** Hero variant */
variant?: HeroVariant

/** Hero size (min-height) */
size?: HeroSize

/** Title */
title: string

/** Subtitle/Description */
subtitle?: string

/** Call to action buttons */
actions?: React.ReactNode

/** Image/Visual */
visual?: React.ReactNode

/** Background (gradient, image, etc.) */
background?: 'white' | 'gray' | 'gradient' | 'image'

/** Additional classes */
className?: string
}

text
undefined
// Hero.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { Container } from '../../layout/Container'
import { Flex } from '../../layout/Flex'
import { Stack } from '../../layout/Stack'
import { Heading } from '../../typography/Heading'
import { Text } from '../../typography/Text'
import type { HeroProps } from './Hero.types'

/**

Hero Section Pattern

Standardized hero section with consistent layout and spacing.

Supports multiple variants: default (left-aligned), centered, split (image/text).

@example

tsx
undefined
<Hero

variant="split"

title="Intelligente Flottensteuerung"

subtitle="KI-gestützte Disposition für Taxi & Mietwagen"

actions={

text
<>
text
  <Button variant="primary" size="lg">Demo anfragen</Button>
text
  <Button variant="outline" size="lg">Mehr erfahren</Button>
text
</>
}

visual={<img src="/hero.png" alt="Dashboard" />}

/>

text
undefined
*/
export const Hero = forwardRef<HTMLElement, HeroProps>(
(
{
variant = 'default',
size = 'lg',
title,
subtitle,
actions,
visual,
background = 'white',
className,
},
ref
) => {
// Size Mapping (min-height)
const sizeClasses = {
md: 'min-h-[400px] md:min-h-[500px]',
lg: 'min-h-[500px] md:min-h-[600px]',
xl: 'min-h-[600px] md:min-h-[700px]',
}

text
// Background Variants
const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  gradient: 'bg-gradient-to-br from-primary-50 via-white to-secondary-50',
  image: 'bg-cover bg-center',
}

// Variant Layouts
const renderContent = () => {
  const content = (
    <Stack spacing="xl" align={variant === 'centered' ? 'center' : 'start'}>
      {/* Title */}
      <Heading
        level={1}
        className={cn(
          'max-w-4xl',
          variant === 'centered' && 'text-center'
        )}
      >
        {title}
      </Heading>

      {/* Subtitle */}
      {subtitle && (
        <Text
          size="xl"
          className={cn(
            'max-w-2xl text-gray-600',
            variant === 'centered' && 'text-center'
          )}
        >
          {subtitle}
        </Text>
      )}

      {/* Actions */}
      {actions && (
        <Flex
          gap="md"
          wrap="wrap"
          className={variant === 'centered' ? 'justify-center' : ''}
        >
          {actions}
        </Flex>
      )}
    </Stack>
  )

  if (variant === 'split' && visual) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Content */}
        <div>{content}</div>

        {/* Visual */}
        <div className="relative">
          {visual}
        </div>
      </div>
    )
  }

  if (variant === 'centered') {
    return (
      <div className="flex flex-col items-center">
        {content}
        {visual && (
          <div className="mt-12 w-full max-w-4xl">
            {visual}
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className="max-w-4xl">
      {content}
      {visual && (
        <div className="mt-12">
          {visual}
        </div>
      )}
    </div>
  )
}

return (
  <section
    ref={ref}
    className={cn(
      'relative',
      sizeClasses[size],
      backgroundClasses[background],
      'flex items-center',
      className
    )}
  >
    <Container size="xl">
      {renderContent()}
    </Container>
  </section>
)
}
)

Hero.displayName = 'Hero'

text

### 2.2 Feature Grid Pattern

**Erstelle: `/src/components/ui/patterns/FeatureGrid/FeatureGrid.tsx`**

// FeatureGrid.types.ts
export interface Feature {
id: string
icon: React.ReactNode
title: string
description: string
}

export interface FeatureGridProps {
/** Features to display */
features: Feature[]

/** Number of columns */
columns?: {
default?: 1 | 2 | 3 | 4
md?: 1 | 2 | 3 | 4
lg?: 1 | 2 | 3 | 4
}

/** Additional classes */
className?: string
}

text
undefined
// FeatureGrid.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { Grid } from '../../layout/Grid'
import { Stack } from '../../layout/Stack'
import { Heading } from '../../typography/Heading'
import { Text } from '../../typography/Text'
import type { FeatureGridProps } from './FeatureGrid.types'

/**

Feature Grid Pattern

Displays features in a responsive grid.

@example

tsx
undefined
<FeatureGrid

columns={{ default: 1, md: 2, lg: 3 }}

features={[

text
{
text
  id: 'gps',
text
  icon: <MapPin />,
text
  title: 'GPS-Tracking',
text
  description: 'Echtzeit-Tracking Ihrer Flotte'
text
},
text
// ... more features
]}

/>

text
undefined
/
export const FeatureGrid = forwardRef<HTMLDivElement, FeatureGridProps>(
(
{
features,
columns = { default: 1, md: 2, lg: 3 },
className,
},
ref
) => {
return (
<Grid ref={ref} cols={columns} gap="lg" className={className} >
{features.map((feature) => (
<Stack key={feature.id} spacing="md" className="p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
{/ Icon */}
<div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
{feature.icon}
</div>

text
        {/* Title */}
        <Heading level={3} className="text-xl">
          {feature.title}
        </Heading>

        {/* Description */}
        <Text className="text-gray-600">
          {feature.description}
        </Text>
      </Stack>
    ))}
  </Grid>
)
}
)

FeatureGrid.displayName = 'FeatureGrid'

text

### 2.3 CTA Section Pattern

**Erstelle: `/src/components/ui/patterns/CTASection/CTASection.tsx`**

// CTASection.types.ts
export interface CTASectionProps {
/** Title */
title: string

/** Description */
description?: string

/** Call to action buttons */
actions: React.ReactNode

/** Background variant */
background?: 'primary' | 'gradient' | 'gray'

/** Additional classes */
className?: string
}

text
undefined
// CTASection.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { Section } from '../../layout/Section'
import { Stack } from '../../layout/Stack'
import { Flex } from '../../layout/Flex'
import { Heading } from '../../typography/Heading'
import { Text } from '../../typography/Text'
import type { CTASectionProps } from './CTASection.types'

/**

CTA Section Pattern

Call-to-action section with consistent styling.

@example

tsx
undefined
<CTASection

background="primary"

title="Starten Sie noch heute"

description="Unverbindliche Demo anfragen"

actions={

text
<Button variant="secondary" size="lg">
text
  Demo anfragen
text
</Button>
}

/>

text
undefined
*/
export const CTASection = forwardRef<HTMLElement, CTASectionProps>(
(
{
title,
description,
actions,
background = 'primary',
className,
},
ref
) => {
const backgroundClasses = {
primary: 'bg-primary text-white',
gradient: 'bg-gradient-to-r from-primary to-secondary text-white',
gray: 'bg-gray-50 text-gray-900',
}

text
return (
  <Section
    ref={ref}
    spacing="xl"
    background="transparent"
    className={cn(
      'rounded-2xl',
      backgroundClasses[background],
      className
    )}
  >
    <Stack spacing="xl" align="center" className="text-center">
      {/* Title */}
      <Heading level={2} className="max-w-3xl">
        {title}
      </Heading>

      {/* Description */}
      {description && (
        <Text size="lg" className="max-w-2xl opacity-90">
          {description}
        </Text>
      )}

      {/* Actions */}
      <Flex gap="md" wrap="wrap" justify="center">
        {actions}
      </Flex>
    </Stack>
  </Section>
)
}
)

CTASection.displayName = 'CTASection'

text

---

## 📚 PHASE 3: PATTERN DOCUMENTATION

**Erstelle: `/docs/LAYOUT_PATTERNS.md`**

📐 LAYOUT PATTERNS GUIDE
Overview
Standardisierte Layout-Patterns für konsistente Sections.

SPACING SYSTEM
Vertikale Abstände (Section Spacing):

text
none:  0px
sm:    32px → 48px   (Mobile → Desktop)
md:    48px → 64px
lg:    64px → 96px
xl:    80px → 128px
2xl:   96px → 160px
Horizontale Abstände (Container Padding):

text
sm:  16px/24px → 24px/32px
md:  16px/32px → 32px/48px
lg:  24px/48px → 48px/64px
xl:  24px/64px → 64px/96px
Grid/Flex Gaps:

text
none: 0px
xs:   8px
sm:   16px
md:   24px
lg:   32px
xl:   48px
2xl:  64px
SECTION ANATOMY
Standard Section Structure
tsx
<Section spacing="lg" background="white">
  <Container size="xl">
    {/* Section Header (optional) */}
    <Stack spacing="md" align="center" className="text-center mb-12">
      <Badge>Features</Badge>
      <Heading level={2}>Unsere Features</Heading>
      <Text size="lg" className="max-w-2xl">
        Beschreibung der Section
      </Text>
    </Stack>

    {/* Section Content */}
    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
      {/* Cards, Features, etc. */}
    </Grid>
  </Container>
</Section>
HERO PATTERNS
Pattern 1: Default Hero (Left-aligned)
tsx
<Hero
  variant="default"
  size="lg"
  title="Intelligente Flottensteuerung"
  subtitle="KI-gestützte Disposition für moderne Taxi- und Mietwagenunternehmen"
  actions={
    <>
      <Button variant="primary" size="lg">Demo anfragen</Button>
      <Button variant="outline" size="lg">Mehr erfahren</Button>
    </>
  }
  visual={<Image src="/hero.png" alt="Dashboard" />}
/>
Wann nutzen:

Standard Landing Pages

Produkt-Seiten

Feature-Pages

Pattern 2: Centered Hero
tsx
<Hero
  variant="centered"
  size="xl"
  background="gradient"
  title="Willkommen bei MyDispatch"
  subtitle="Die Zukunft der Flottensteuerung"
  actions={<Button variant="primary" size="xl">Jetzt starten</Button>}
/>
Wann nutzen:

Marketing Pages

Campaign Landing Pages

Event Pages

Pattern 3: Split Hero (Image/Text)
tsx
<Hero
  variant="split"
  size="lg"
  title="GPS-Echtzeit-Tracking"
  subtitle="Vollständige Transparenz über Ihre Flotte in Echtzeit"
  actions={<Button variant="primary">Mehr erfahren</Button>}
  visual={
    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
      <Image src="/gps-tracking.png" alt="GPS Tracking" fill />
    </div>
  }
/>
Wann nutzen:

Feature Detail Pages

Product Pages

Case Studies

SECTION PATTERNS
Pattern 1: Feature Grid (3-Column)
tsx
<Section spacing="xl" background="white">
  <Container>
    {/* Header */}
    <Stack spacing="md" align="center" className="text-center mb-16">
      <Heading level={2}>Unsere Features</Heading>
      <Text size="lg" className="max-w-2xl text-gray-600">
        Alles was Sie für effiziente Flottensteuerung brauchen
      </Text>
    </Stack>

    {/* Grid */}
    <FeatureGrid
      columns={{ default: 1, md: 2, lg: 3 }}
      features={FEATURES}
    />
  </Container>
</Section>
Pattern 2: Alternating Content (Image/Text)
tsx
<Section spacing="xl">
  <Container>
    <Stack spacing="2xl">
      {/* Row 1: Image Left, Text Right */}
      <Grid cols={{ default: 1, lg: 2 }} gap="xl" className="items-center">
        <div>
          <Image src="/feature-1.png" alt="Feature 1" />
        </div>
        <Stack spacing="md">
          <Heading level={3}>Feature Name</Heading>
          <Text>Description...</Text>
          <Button variant="outline">Mehr erfahren</Button>
        </Stack>
      </Grid>

      {/* Row 2: Text Left, Image Right */}
      <Grid cols={{ default: 1, lg: 2 }} gap="xl" className="items-center">
        <Stack spacing="md" className="lg:order-1">
          <Heading level={3}>Another Feature</Heading>
          <Text>Description...</Text>
        </Stack>
        <div className="lg:order-2">
          <Image src="/feature-2.png" alt="Feature 2" />
        </div>
      </Grid>
    </Stack>
  </Container>
</Section>
Pattern 3: Pricing Table
tsx
<Section spacing="xl" background="gray">
  <Container>
    {/* Header */}
    <Stack spacing="md" align="center" className="text-center mb-16">
      <Heading level={2}>Flexible Preise</Heading>
      <Text size="lg">Für jede Flottengröße</Text>
    </Stack>

    {/* Pricing Grid */}
    <Grid cols={{ default: 1, md: 2, lg: 4 }} gap="lg">
      {PRICING_PLANS.map(plan => (
        <PricingCard key={plan.id} {...plan} />
      ))}
    </Grid>
  </Container>
</Section>
Pattern 4: Testimonials
tsx
<Section spacing="xl" background="white">
  <Container>
    <Heading level={2} className="text-center mb-16">
      Was unsere Kunden sagen
    </Heading>

    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
      {TESTIMONIALS.map(testimonial => (
        <TestimonialCard key={testimonial.id} {...testimonial} />
      ))}
    </Grid>
  </Container>
</Section>
Pattern 5: CTA Section
tsx
<CTASection
  background="gradient"
  title="Starten Sie noch heute mit MyDispatch"
  description="Unverbindliche Demo anfragen und selbst überzeugen"
  actions={<Button variant="secondary" size="xl">Demo anfragen</Button>}
/>
RESPONSIVE GUIDELINES
Mobile (< 640px)
1 column layouts

Vertical stacks

Full-width buttons

Reduced spacing (use sm variants)

Tablet (640px - 1024px)
2 column layouts

Side-by-side CTAs

Medium spacing (use md variants)

Desktop (> 1024px)
3-4 column layouts

Full grid layouts

Large spacing (use lg, xl variants)

ACCESSIBILITY
Semantic HTML
tsx
✅ CORRECT:
<Section as="section">
  <Heading level={2}>Title</Heading>
  <Text as="p">Content</Text>
</Section>

❌ WRONG:
<div>
  <div className="text-2xl">Title</div>
  <span>Content</span>
</div>
Heading Hierarchy
text
H1: Page title (once per page)
H2: Section titles
H3: Subsection titles
H4: Minor headings
Never skip heading levels!

ENFORCEMENT
❌ NIEMALS:

Hardcoded spacing values

Inconsistent section structures

Non-semantic HTML

Skipped heading levels

✅ IMMER:

Layout Components nutzen

Design System Spacing

Semantic HTML

Proper heading hierarchy

text

---

## ✅ FINAL CHECKLIST

LAYOUT PATTERN CHECKLIST:

COMPONENTS ERSTELLT:
□ Container
□ Section
□ Grid
□ Flex
□ Stack
□ Hero
□ FeatureGrid
□ CTASection

SPACING KONSISTENT:
□ Alle Sections nutzen Section Component
□ Alle Grids nutzen Grid Component
□ Keine hardcoded spacing values
□ Design Tokens überall verwendet

RESPONSIVE:
□ Mobile-first approach
□ Breakpoints korrekt
□ Touch-friendly (min 44x44px)
□ Lesbarkeit auf allen Devices

ACCESSIBILITY:
□ Semantic HTML
□ Proper heading hierarchy
□ Keyboard navigable
□ Screen reader friendly

DOCUMENTATION:
□ LAYOUT_PATTERNS.md vollständig
□ Usage Examples für alle Patterns
□ Do's and Don'ts dokumentiert