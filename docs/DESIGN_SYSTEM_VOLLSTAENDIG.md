# 🎨 VOLLSTÄNDIGE DESIGN SYSTEM & COMPONENT LIBRARY ERSTELLUNG
## MIT STRIKTER ENFORCEMENT & DOKUMENTATIONS-PFLICHT

---

## 🎯 MISSION DIESER AUFGABE

Erstelle eine **vollständige, konsistente, wiederverwendbare Component Library** die als **EINZIGE Quelle** für alle UI-Elemente dient.

**ABSOLUTES GESETZ:**
- ❌ **NIEMALS** Components außerhalb der Library erstellen
- ❌ **NIEMALS** direkt in Pages hardcoded UI schreiben
- ✅ **IMMER** zuerst Library prüfen
- ✅ **IMMER** neue Components zur Library hinzufügen
- ✅ **IMMER** bestehende Components nutzen

---

## 📋 PHASE 1: DESIGN FOUNDATION

### 1.1 Design Tokens Setup (ABSOLUTES FUNDAMENT)

**Erstelle: `/config/design-tokens.ts`**

/**

DESIGN TOKENS - V28.1

⚠️ KRITISCH: Dies ist die EINZIGE Quelle für alle Design-Werte!

REGELN:

NIEMALS Farben/Spacings/etc. direkt im Code hardcoden

ALLE Components MÜSSEN diese Tokens nutzen

Änderungen NUR hier vornehmen

Nach Änderungen: Alle Components testen
*/

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
// Primary
primary: {
DEFAULT: '#3B82F6',
50: '#EFF6FF',
100: '#DBEAFE',
200: '#BFDBFE',
300: '#93C5FD',
400: '#60A5FA',
500: '#3B82F6',
600: '#2563EB',
700: '#1D4ED8',
800: '#1E40AF',
900: '#1E3A8A',
950: '#172554',
},

// Secondary
secondary: {
DEFAULT: '#10B981',
50: '#ECFDF5',
100: '#D1FAE5',
200: '#A7F3D0',
300: '#6EE7B7',
400: '#34D399',
500: '#10B981',
600: '#059669',
700: '#047857',
800: '#065F46',
900: '#064E3B',
950: '#022C22',
},

// Accent
accent: {
DEFAULT: '#F59E0B',
50: '#FFFBEB',
100: '#FEF3C7',
200: '#FDE68A',
300: '#FCD34D',
400: '#FBBF24',
500: '#F59E0B',
600: '#D97706',
700: '#B45309',
800: '#92400E',
900: '#78350F',
950: '#451A03',
},

// Semantic Colors
success: {
DEFAULT: '#10B981',
light: '#34D399',
dark: '#059669',
},

warning: {
DEFAULT: '#F59E0B',
light: '#FBBF24',
dark: '#D97706',
},

danger: {
DEFAULT: '#EF4444',
light: '#F87171',
dark: '#DC2626',
},

info: {
DEFAULT: '#3B82F6',
light: '#60A5FA',
dark: '#2563EB',
},

// Neutrals (Gray Scale)
gray: {
DEFAULT: '#6B7280',
50: '#F9FAFB',
100: '#F3F4F6',
200: '#E5E7EB',
300: '#D1D5DB',
400: '#9CA3AF',
500: '#6B7280',
600: '#4B5563',
700: '#374151',
800: '#1F2937',
900: '#111827',
950: '#030712',
},

// Black & White
black: '#000000',
white: '#FFFFFF',

// Background Colors (Semantic)
bg: {
primary: '#FFFFFF',
secondary: '#F9FAFB',
tertiary: '#F3F4F6',
inverse: '#111827',
},

// Text Colors (Semantic)
text: {
primary: '#111827',
secondary: '#6B7280',
tertiary: '#9CA3AF',
inverse: '#FFFFFF',
link: '#3B82F6',
linkHover: '#2563EB',
},

// Border Colors
border: {
DEFAULT: '#E5E7EB',
light: '#F3F4F6',
dark: '#D1D5DB',
focus: '#3B82F6',
},
} as const

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
// Font Families
fontFamily: {
primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
},

// Font Sizes (rem based)
fontSize: {
xs: '0.75rem', // 12px
sm: '0.875rem', // 14px
base: '1rem', // 16px
lg: '1.125rem', // 18px
xl: '1.25rem', // 20px
'2xl': '1.5rem', // 24px
'3xl': '1.875rem', // 30px
'4xl': '2.25rem', // 36px
'5xl': '3rem', // 48px
'6xl': '3.75rem', // 60px
'7xl': '4.5rem', // 72px
'8xl': '6rem', // 96px
'9xl': '8rem', // 128px
},

// Font Weights
fontWeight: {
thin: 100,
extralight: 200,
light: 300,
normal: 400,
medium: 500,
semibold: 600,
bold: 700,
extrabold: 800,
black: 900,
},

// Line Heights
lineHeight: {
none: 1,
tight: 1.25,
snug: 1.375,
normal: 1.5,
relaxed: 1.625,
loose: 2,
},

// Letter Spacing
letterSpacing: {
tighter: '-0.05em',
tight: '-0.025em',
normal: '0em',
wide: '0.025em',
wider: '0.05em',
widest: '0.1em',
},
} as const

// ============================================================================
// SPACING (4px Grid System)
// ============================================================================

export const spacing = {
0: '0',
px: '1px',
0.5: '0.125rem', // 2px
1: '0.25rem', // 4px
1.5: '0.375rem', // 6px
2: '0.5rem', // 8px
2.5: '0.625rem', // 10px
3: '0.75rem', // 12px
3.5: '0.875rem', // 14px
4: '1rem', // 16px
5: '1.25rem', // 20px
6: '1.5rem', // 24px
7: '1.75rem', // 28px
8: '2rem', // 32px
9: '2.25rem', // 36px
10: '2.5rem', // 40px
11: '2.75rem', // 44px
12: '3rem', // 48px
14: '3.5rem', // 56px
16: '4rem', // 64px
20: '5rem', // 80px
24: '6rem', // 96px
28: '7rem', // 112px
32: '8rem', // 128px
36: '9rem', // 144px
40: '10rem', // 160px
44: '11rem', // 176px
48: '12rem', // 192px
52: '13rem', // 208px
56: '14rem', // 224px
60: '15rem', // 240px
64: '16rem', // 256px
72: '18rem', // 288px
80: '20rem', // 320px
96: '24rem', // 384px
} as const

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
none: '0',
sm: '0.125rem', // 2px
DEFAULT: '0.25rem', // 4px
md: '0.375rem', // 6px
lg: '0.5rem', // 8px
xl: '0.75rem', // 12px
'2xl': '1rem', // 16px
'3xl': '1.5rem', // 24px
full: '9999px',
} as const

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
none: 'none',
sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
none: 'none',
all: 'all 150ms ease-in-out',
fast: '150ms ease-in-out',
normal: '250ms ease-in-out',
slow: '350ms ease-in-out',
slower: '500ms ease-in-out',
} as const

export const transitionProperty = {
none: 'none',
all: 'all',
DEFAULT: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
colors: 'background-color, border-color, color, fill, stroke',
opacity: 'opacity',
shadow: 'box-shadow',
transform: 'transform',
} as const

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
sm: '640px',
md: '768px',
lg: '1024px',
xl: '1280px',
'2xl': '1536px',
} as const

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
auto: 'auto',
0: 0,
10: 10,
20: 20,
30: 30,
40: 40,
50: 50,
// Semantic z-index
dropdown: 1000,
sticky: 1020,
fixed: 1030,
modalBackdrop: 1040,
modal: 1050,
popover: 1060,
tooltip: 1070,
notification: 1080,
} as const

// ============================================================================
// ANIMATION
// ============================================================================

export const animation = {
none: 'none',
spin: 'spin 1s linear infinite',
ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
bounce: 'bounce 1s infinite',
fadeIn: 'fadeIn 0.3s ease-in',
fadeOut: 'fadeOut 0.3s ease-out',
slideIn: 'slideIn 0.3s ease-out',
slideOut: 'slideOut 0.3s ease-in',
} as const

// ============================================================================
// BLUR
// ============================================================================

export const blur = {
none: '0',
sm: '4px',
DEFAULT: '8px',
md: '12px',
lg: '16px',
xl: '24px',
'2xl': '40px',
'3xl': '64px',
} as const

// ============================================================================
// EXPORTS & TYPES
// ============================================================================

export const designTokens = {
colors,
typography,
spacing,
borderRadius,
shadows,
transitions,
transitionProperty,
breakpoints,
zIndex,
animation,
blur,
} as const

// Type Exports
export type DesignTokens = typeof designTokens
export type ColorToken = keyof typeof colors
export type SpacingToken = keyof typeof spacing
export type FontSizeToken = keyof typeof typography.fontSize
export type FontWeightToken = keyof typeof typography.fontWeight

// Helper Types
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

// Default Export
export default designTokens

text

### 1.2 Tailwind Config Integration

**Erstelle: `/tailwind.config.ts`**

import type { Config } from 'tailwindcss'
import { designTokens } from './config/design-tokens'

const config: Config = {
content: [
'./src/pages//*.{js,ts,jsx,tsx,mdx}',
'./src/components//.{js,ts,jsx,tsx,mdx}',
'./src/app/**/.{js,ts,jsx,tsx,mdx}',
],
theme: {
extend: {
colors: designTokens.colors,
spacing: designTokens.spacing,
fontSize: designTokens.typography.fontSize,
fontWeight: designTokens.typography.fontWeight,
fontFamily: designTokens.typography.fontFamily,
lineHeight: designTokens.typography.lineHeight,
letterSpacing: designTokens.typography.letterSpacing,
borderRadius: designTokens.borderRadius,
boxShadow: designTokens.shadows,
transitionDuration: designTokens.transitions,
transitionProperty: designTokens.transitionProperty,
zIndex: designTokens.zIndex,
animation: designTokens.animation,
backdropBlur: designTokens.blur,
},
},
plugins: [],
}

export default config

text

### 1.3 Font Setup

**Erstelle: `/app/fonts.ts`**

import { Inter, JetBrains_Mono } from 'next/font/google'

// Primary Font: Inter
export const inter = Inter({
subsets: ['latin'],
display: 'swap',
variable: '--font-inter',
weight: ['400', '500', '600', '700', '800'],
})

// Mono Font: JetBrains Mono
export const jetbrainsMono = JetBrains_Mono({
subsets: ['latin'],
display: 'swap',
variable: '--font-jetbrains-mono',
weight: ['400', '500', '600', '700'],
})

// Export className helper
export const fontVariables = ${inter.variable} ${jetbrainsMono.variable}

text

**Integration in Root Layout:**

// app/layout.tsx
import { fontVariables } from './fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="de" className={fontVariables}>
<body className="font-primary">
{children}
</body>
</html>
)
}

text

---

## 📚 PHASE 2: COMPONENT LIBRARY STRUKTUR

### 2.1 Library Ordnerstruktur

**Erstelle exakt diese Struktur:**

/src/components/ui/
├─ foundation/ # Basis Components
│ ├─ Button/
│ │ ├─ Button.tsx
│ │ ├─ Button.types.ts
│ │ ├─ Button.test.tsx
│ │ ├─ Button.stories.tsx
│ │ └─ index.ts
│ │
│ ├─ Input/
│ ├─ Textarea/
│ ├─ Select/
│ ├─ Checkbox/
│ ├─ Radio/
│ ├─ Toggle/
│ └─ Label/
│
├─ layout/ # Layout Components
│ ├─ Container/
│ ├─ Grid/
│ ├─ Flex/
│ ├─ Stack/
│ └─ Spacer/
│
├─ navigation/ # Navigation
│ ├─ Header/
│ ├─ NavLink/
│ ├─ DropdownMenu/
│ ├─ Breadcrumb/
│ ├─ Tabs/
│ └─ Footer/
│
├─ content/ # Content Components
│ ├─ Card/
│ ├─ Hero/
│ ├─ FeatureGrid/
│ ├─ PricingTable/
│ ├─ Testimonial/
│ ├─ Badge/
│ ├─ Tag/
│ ├─ Avatar/
│ └─ Divider/
│
├─ feedback/ # Feedback Components
│ ├─ Alert/
│ ├─ Toast/
│ ├─ Modal/
│ ├─ Tooltip/
│ ├─ Popover/
│ ├─ ProgressBar/
│ ├─ Spinner/
│ └─ Skeleton/
│
├─ forms/ # Form Components
│ ├─ Form/
│ ├─ FormField/
│ ├─ DatePicker/
│ ├─ FileUpload/
│ ├─ Slider/
│ └─ RichTextEditor/
│
├─ data/ # Data Display
│ ├─ Table/
│ ├─ List/
│ ├─ Accordion/
│ ├─ Stats/
│ └─ Timeline/
│
├─ utility/ # Utility Components
│ ├─ Icon/
│ ├─ Logo/
│ ├─ Image/
│ ├─ Video/
│ ├─ Link/
│ └─ ScrollToTop/
│
├─ complex/ # Complex/Composed
│ ├─ CookieBanner/
│ ├─ CookieSettings/
│ ├─ Search/
│ ├─ NewsletterSignup/
│ ├─ ContactForm/
│ ├─ ComparisonTable/
│ ├─ FAQ/
│ ├─ Carousel/
│ └─ CTASection/
│
└─ index.ts # Central Export

text

### 2.2 Component Template (GENAU SO verwenden!)

**Für JEDE neue Component:**

// components/ui/foundation/Button/Button.types.ts
import { ReactNode, MouseEvent } from 'react'

/**

Button Variants

Definiert die visuellen Styles des Buttons
*/
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'

/**

Button Sizes

Definiert die Größe des Buttons
*/
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**

Button Props

@example

tsx
undefined
<Button variant="primary" size="lg" onClick={handleClick}>
Click me

</Button>
text
undefined
/
export interface ButtonProps {
/* Visual variant of the button */
variant?: ButtonVariant

/** Size of the button */
size?: ButtonSize

/** Disabled state */
disabled?: boolean

/** Loading state (shows spinner, disables button) */
loading?: boolean

/** Full width button */
fullWidth?: boolean

/** Icon element */
icon?: ReactNode

/** Icon position */
iconPosition?: 'left' | 'right'

/** Click handler */
onClick?: (event: MouseEvent<HTMLButtonElement>) => void

/** Button type */
type?: 'button' | 'submit' | 'reset'

/** Button content */
children: ReactNode

/** Additional CSS classes */
className?: string

/** ARIA label (for accessibility) */
'aria-label'?: string
}

text
undefined
// components/ui/foundation/Button/Button.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { designTokens } from '@/config/design-tokens'
import { Spinner } from '@/components/ui/feedback/Spinner'
import type { ButtonProps } from './Button.types'

/**

Button Component

Ein wiederverwendbarer Button mit verschiedenen Variants und Sizes.

Nutzt Design Tokens für konsistentes Styling.

@example

tsx
undefined
<Button variant="primary" size="lg">
Jetzt starten

</Button>
<Button variant="outline" icon={<ArrowRight />} iconPosition="right">

Mehr erfahren

</Button>
text
undefined
*/
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
(
{
variant = 'primary',
size = 'md',
disabled = false,
loading = false,
fullWidth = false,
icon,
iconPosition = 'left',
onClick,
type = 'button',
children,
className,
'aria-label': ariaLabel,
},
ref
) => {
// Variant Styles (using Design Tokens)
const variantStyles = {
primary: bg-primary text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ,
secondary: bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 ,
outline: border-2 border-primary text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ,
ghost: bg-transparent text-primary hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ,
link: bg-transparent text-primary underline-offset-4 hover:underline focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ,
danger: bg-danger text-white hover:bg-danger-dark active:bg-danger-700 focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 ,
}

text
// Size Styles (using Design Tokens)
const sizeStyles = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
  xl: 'px-10 py-4 text-xl',
}

// Icon Size Mapping
const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
}

const isDisabled = disabled || loading

return (
  <button
    ref={ref}
    type={type}
    disabled={isDisabled}
    onClick={onClick}
    aria-label={ariaLabel}
    aria-busy={loading}
    className={cn(
      // Base Styles
      'inline-flex items-center justify-center',
      'font-semibold',
      'rounded-lg',
      'transition-all duration-150',
      'focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // Variant
      variantStyles[variant],
      
      // Size
      sizeStyles[size],
      
      // Full Width
      fullWidth && 'w-full',
      
      // Custom className
      className
    )}
  >
    {/* Loading Spinner */}
    {loading && (
      <Spinner size={size} className="mr-2" />
    )}
    
    {/* Icon (Left) */}
    {!loading && icon && iconPosition === 'left' && (
      <span className={cn(iconSizes[size], 'mr-2')}>
        {icon}
      </span>
    )}
    
    {/* Children */}
    {children}
    
    {/* Icon (Right) */}
    {!loading && icon && iconPosition === 'right' && (
      <span className={cn(iconSizes[size], 'ml-2')}>
        {icon}
      </span>
    )}
  </button>
)
}
)

Button.displayName = 'Button'

text
undefined
// components/ui/foundation/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
it('renders children correctly', () => {
render(<Button>Click me</Button>)
expect(screen.getByText('Click me')).toBeInTheDocument()
})

it('calls onClick when clicked', async () => {
const onClick = vi.fn()
render(<Button onClick={onClick}>Click</Button>)

text
await userEvent.click(screen.getByText('Click'))
expect(onClick).toHaveBeenCalledTimes(1)
})

it('is disabled when disabled prop is true', () => {
render(<Button disabled>Disabled</Button>)
expect(screen.getByRole('button')).toBeDisabled()
})

it('shows loading spinner when loading', () => {
render(<Button loading>Loading</Button>)
expect(screen.getByRole('button')).toBeDisabled()
expect(screen.getByRole('status')).toBeInTheDocument() // Spinner
})

it('applies correct variant class', () => {
const { container } = render(<Button variant="primary">Primary</Button>)
const button = container.querySelector('button')
expect(button).toHaveClass('bg-primary')
})

it('applies correct size class', () => {
const { container } = render(<Button size="lg">Large</Button>)
const button = container.querySelector('button')
expect(button).toHaveClass('px-8', 'py-3', 'text-lg')
})

it('renders icon in correct position', () => {
const { rerender } = render(
<Button icon={<span data-testid="icon">→</span>} iconPosition="left">
With Icon
</Button>
)

text
const button = screen.getByRole('button')
const icon = screen.getByTestId('icon')

// Icon should be before text
expect(button.firstChild).toContain(icon)

// Change position
rerender(
  <Button icon={<span data-testid="icon">→</span>} iconPosition="right">
    With Icon
  </Button>
)

// Icon should be after text
expect(button.lastChild).toContain(icon)
})
})

text
undefined
// components/ui/foundation/Button/index.ts
export { Button } from './Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types'

text

---

## 📖 PHASE 3: COMPONENT DOCUMENTATION

### 3.1 Component Registry (PFLICHT-DOKUMENT!)

**Erstelle: `/docs/COMPONENT_REGISTRY.md`**

📚 COMPONENT REGISTRY
⚠️ KRITISCH: Dieses Dokument MUSS vor jeder Component-Erstellung geprüft werden!

ABSOLUTE REGEL:

BEVOR du eine neue Component erstellst → HIER prüfen!

Falls Component existiert → NUTZEN, nicht neu erstellen!

Falls neue Component → HIER dokumentieren!

🔍 QUICK SEARCH
Nutze Ctrl+F / Cmd+F um zu suchen!

Häufig gesucht:

Button → foundation/Button

Input → foundation/Input

Card → content/Card

Modal → feedback/Modal

📦 FOUNDATION COMPONENTS
Button
Path: components/ui/foundation/Button/Button.tsx

Status: ✅ Implemented

Variants: primary, secondary, outline, ghost, link, danger

Sizes: xs, sm, md, lg, xl

Features:

✅ Loading state

✅ Disabled state

✅ Icon support (left/right)

✅ Full width option

✅ Accessible (WCAG 2.1 AA)

Tests: ✅ 100% Coverage

Usage:

tsx
import { Button } from '@/components/ui/foundation/Button'

<Button variant="primary" size="lg">
  Jetzt starten
</Button>
⚠️ NIEMALS neu implementieren! Immer diese Component nutzen!

Input
Path: components/ui/foundation/Input/Input.tsx

Status: ✅ Implemented

Types: text, email, password, number, tel, url, search

Features:

✅ Error states

✅ Disabled state

✅ Prefix/Suffix icons

✅ Clear button

✅ Character counter (optional)

✅ Accessible

Tests: ✅ 97% Coverage

Usage:

tsx
import { Input } from '@/components/ui/foundation/Input'

<Input
  type="email"
  placeholder="E-Mail"
  error="Ungültige E-Mail"
/>
[... ALLE Components dokumentieren ...]

📊 STATISTICS
Total Components: 47
Foundation: 8
Layout: 5
Navigation: 6
Content: 9
Feedback: 8
Forms: 5
Data: 5
Utility: 6
Complex: 9

Test Coverage: 94.3%
Accessibility: 100% WCAG 2.1 AA compliant

🔄 UPDATE LOG
[2025-10-28]

Added: Button component

Added: Input component

Added: Card component

[2025-10-27]

Updated: Button - Added loading state

Fixed: Input - Focus ring color

LAST UPDATE: [Timestamp]

text

### 3.2 Component Usage Guidelines

**Erstelle: `/docs/COMPONENT_USAGE_GUIDE.md`**

🎨 COMPONENT USAGE GUIDE
🚨 ABSOLUTE RULES
REGEL 1: NIEMALS Components außerhalb der Library erstellen
❌ VERBOTEN:

tsx
// page.tsx
function MyPage() {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      Click me
    </button>
  )
}
✅ RICHTIG:

tsx
// page.tsx
import { Button } from '@/components/ui/foundation/Button'

function MyPage() {
  return (
    <Button variant="primary">
      Click me
    </Button>
  )
}
REGEL 2: IMMER ZUERST Component Registry prüfen
WORKFLOW:

Brauchst du ein UI-Element?

→ Öffne COMPONENT_REGISTRY.md

→ Suche nach ähnlicher Component

→ Existiert sie? → NUTZEN!

→ Existiert sie NICHT? → Zur Library hinzufügen

REGEL 3: Keine Hardcoded Values
❌ VERBOTEN:

tsx
<div style={{ color: '#3B82F6' }}>
  Text
</div>
✅ RICHTIG:

tsx
import { designTokens } from '@/config/design-tokens'

<div style={{ color: designTokens.colors.primary.DEFAULT }}>
  Text
</div>

// ODER mit Tailwind:
<div className="text-primary">
  Text
</div>
REGEL 4: Props statt Customization
❌ VERBOTEN:

tsx
<Button className="!bg-red-500">
  Delete
</Button>
✅ RICHTIG:

tsx
<Button variant="danger">
  Delete
</Button>
Falls Variant fehlt → Component erweitern, nicht überschreiben!

🎯 BEST PRACTICES
Composition Pattern
✅ Nutze Component Composition:

tsx
<Card>
  <Card.Header>
    <Heading level={3}>Title</Heading>
    <Badge>New</Badge>
  </Card.Header>
  
  <Card.Body>
    <Text>Content here</Text>
  </Card.Body>
  
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
Semantic HTML
✅ Nutze semantische Components:

tsx
<Header>
  <Nav>
    <NavLink href="/">Home</NavLink>
  </Nav>
</Header>

<main>
  <Hero>...</Hero>
  <Section>...</Section>
</main>

<Footer>...</Footer>
🆕 NEUE COMPONENT HINZUFÜGEN
WORKFLOW:

Prüfe Necessity:

Brauchst du wirklich eine neue Component?

Kann bestehende Component angepasst werden?

Erstelle Component:

Nutze Component Template (siehe oben)

Folge Naming Conventions

Nutze Design Tokens

TypeScript strict mode

Tests schreiben:

Unit Tests (> 80% Coverage)

Accessibility Tests

Visual Regression Tests

Dokumentiere:

JSDoc Comments im Code

COMPONENT_REGISTRY.md updaten

Usage Examples hinzufügen

Review:

Self-Review gegen Checklist

Alle Design Tokens genutzt?

Type-safe?

Accessible?

Integration:

Export in /components/ui/index.ts

Commit mit aussagekräftiger Message

text

---

## 🔒 PHASE 4: ENFORCEMENT MECHANISMS

### 4.1 Pre-Commit Hook (ESLint Rule)

**Erstelle: `.eslintrc.js`**

module.exports = {
rules: {
// Verhindere hardcoded colors
'no-restricted-syntax': [
'error',
{
selector: "Literal[value=/#[0-9A-Fa-f]{3,6}/]",
message: 'Hardcoded hex colors are not allowed. Use design tokens from @/config/design-tokens instead.',
},
],

text
// Verhindere inline styles mit hardcoded values
'react/forbid-dom-props': [
  'error',
  {
    forbid: [
      {
        propName: 'style',
        message: 'Inline styles with hardcoded values are discouraged. Use Tailwind classes or design tokens.',
      },
    ],
  },
],

// Erzwinge Button Import aus Library
'no-restricted-imports': [
  'error',
  {
    patterns: [
      {
        group: ['**/pages/**/*', '**/app/**/*'],
        importNames: ['button'],
        message: 'Import Button from @/components/ui/foundation/Button instead of creating custom buttons.',
      },
    ],
  },
],
},
}

text

### 4.2 Component Creation Checklist

**Erstelle: `/docs/NEW_COMPONENT_CHECKLIST.md`**

✅ NEW COMPONENT CHECKLIST
Nutze diese Checklist für JEDE neue Component!

PRE-CREATION
□ Component Registry geprüft?
□ Ähnliche Component existiert NICHT?
□ Sicher dass neue Component nötig?
□ Alternative: Bestehende Component erweitern?

CREATION
□ Component Template verwendet?
□ Ordner-Struktur korrekt? (ComponentName/ComponentName.tsx)
□ Types in separate .types.ts Datei?
□ Alle Design Tokens verwendet (KEINE hardcoded values)?
□ TypeScript strict mode (keine any types)?
□ Props Interface vollständig dokumentiert?
□ JSDoc Comments für Component?

STYLING
□ Tailwind mit Design Tokens?
□ Alle Farben aus designTokens.colors?
□ Alle Spacings aus designTokens.spacing?
□ Alle Font-Sizes aus designTokens.typography.fontSize?
□ Responsive für alle Breakpoints?
□ Hover/Focus/Active States definiert?

ACCESSIBILITY
□ Semantic HTML verwendet?
□ ARIA Labels wo nötig?
□ Keyboard Navigation funktioniert?
□ Focus Indicators sichtbar?
□ Screen Reader getestet?
□ Color Contrast > 4.5:1?

FUNCTIONALITY
□ Alle States: Default, Hover, Active, Disabled?
□ Loading State (falls relevant)?
□ Error State (falls relevant)?
□ Empty State (falls relevant)?

TESTING
□ Unit Tests geschrieben?
□ Test Coverage > 80%?
□ Accessibility Tests (axe-core)?
□ Visual Regression Test?
□ Manual Testing (alle Devices)?

DOCUMENTATION
□ JSDoc Comments im Code?
□ COMPONENT_REGISTRY.md updated?
□ Usage Examples hinzugefügt?
□ Props API dokumentiert?
□ Do's and Don'ts dokumentiert?

INTEGRATION
□ Export in /components/ui/[category]/index.ts?
□ Export in /components/ui/index.ts?
□ Import Pfad funktioniert?
□ Tree-shaking funktioniert?

FINAL REVIEW
□ Keine ESLint Errors/Warnings?
□ Keine TypeScript Errors?
□ Keine Console Logs?
□ Keine Hardcoded Values?
□ Folgt Design System V28.1?
□ Performance optimiert?

✅ ALLE CHECKBOXES ✓ → COMPONENT APPROVED!

text

---

## 🎯 PHASE 5: USAGE ENFORCEMENT

### 5.1 Automatic Component Validation

**Erstelle: `/scripts/validate-components.ts`**

/**

Validates that no hardcoded UI elements exist outside of component library
*/
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

const FORBIDDEN_PATTERNS = [
// Hardcoded hex colors
/#[0-9A-Fa-f]{3,6}/,

// Hardcoded pixel values (except in design-tokens.ts)
/\d+px/,

// Inline styles with hardcoded values
/style={{[^}]color:\s['"][^'"]+['"]/,

// Custom button elements (should use Button component)
/<button\s+(?!.*className=['"].*btn)/,
]

async function validateFiles() {
const files = await glob('src/{app,pages}//*.{ts,tsx}', {
ignore: ['/node_modules/', '/.next/**']
})

const violations: { file: string; line: number; pattern: string }[] = []

for (const file of files) {
const content = fs.readFileSync(file, 'utf-8')
const lines = content.split('\n')

text
lines.forEach((line, index) => {
  FORBIDDEN_PATTERNS.forEach((pattern) => {
    if (pattern.test(line)) {
      violations.push({
        file,
        line: index + 1,
        pattern: pattern.toString()
      })
    }
  })
})
}

if (violations.length > 0) {
console.error('❌ Component Library Violations Found:\n')
violations.forEach(({ file, line, pattern }) => {
console.error( ${file}:${line})
console.error( Pattern: ${pattern}\n)
})

text
console.error('\n⚠️  Use components from @/components/ui instead of hardcoded UI elements!')
process.exit(1)
}

console.log('✅ All files follow component library guidelines!')
}

validateFiles()

text

**Integration in `package.json`:**

{
"scripts": {
"validate:components": "tsx scripts/validate-components.ts",
"pre-commit": "npm run validate:components && npm run lint && npm run type-check"
}
}

text

---

## 📚 PHASE 6: COMPLETE COMPONENT LIBRARY

**PFLICHT: Erstelle ALLE diese Components!**

### Foundation Components (8 Components)

1. **Button** ✅ (Template oben)
2. **Input**
3. **Textarea**
4. **Select**
5. **Checkbox**
6. **Radio**
7. **Toggle**
8. **Label**

### Layout Components (5 Components)

9. **Container**
10. **Grid**
11. **Flex**
12. **Stack**
13. **Spacer**

### Navigation Components (6 Components)

14. **Header**
15. **NavLink**
16. **DropdownMenu**
17. **Breadcrumb**
18. **Tabs**
19. **Footer**

### Content Components (9 Components)

20. **Card**
21. **Hero**
22. **FeatureGrid**
23. **PricingTable**
24. **Testimonial**
25. **Badge**
26. **Tag**
27. **Avatar**
28. **Divider**

### Feedback Components (8 Components)

29. **Alert**
30. **Toast**
31. **Modal**
32. **Tooltip**
33. **Popover**
34. **ProgressBar**
35. **Spinner**
36. **Skeleton**

### Form Components (5 Components)

37. **Form**
38. **FormField**
39. **DatePicker**
40. **FileUpload**
41. **Slider**

### Data Components (5 Components)

42. **Table**
43. **List**
44. **Accordion**
45. **Stats**
46. **Timeline**

### Utility Components (6 Components)

47. **Icon**
48. **Logo**
49. **Image**
50. **Video**
51. **Link**
52. **ScrollToTop**

### Complex Components (9 Components)

53. **CookieBanner**
54. **CookieSettings**
55. **Search**
56. **NewsletterSignup**
57. **ContactForm**
58. **ComparisonTable**
59. **FAQ**
60. **Carousel**
61. **CTASection**

---

## 🔄 IMPLEMENTATION WORKFLOW

**FÜR JEDE COMPONENT:**

STEP 1: PREPARATION (5 Min)
□ Component Registry prüfen
□ Design Tokens studieren
□ Ähnliche Components analysieren
□ Props Interface planen

STEP 2: CREATION (30-60 Min)
□ Ordner erstellen
□ Types Datei (.types.ts)
□ Component Datei (.tsx)
□ Nutze Component Template
□ Implementiere alle Variants
□ Implementiere alle Sizes
□ Implementiere alle States

STEP 3: STYLING (15-30 Min)
□ NUR Design Tokens nutzen
□ Responsive Breakpoints
□ Hover/Focus/Active States
□ Disabled State
□ Loading State (falls relevant)

STEP 4: ACCESSIBILITY (15 Min)
□ Semantic HTML
□ ARIA Labels
□ Keyboard Navigation
□ Focus Management
□ Screen Reader Test

STEP 5: TESTING (30 Min)
□ Unit Tests (.test.tsx)
□ Alle Props testen
□ Alle States testen
□ User Interactions testen
□ Accessibility Tests

STEP 6: DOCUMENTATION (15 Min)
□ JSDoc Comments
□ COMPONENT_REGISTRY.md
□ Usage Examples
□ Do's and Don'ts

STEP 7: INTEGRATION (5 Min)
□ Export in index.ts
□ Import Path testen
□ Build testen
□ Commit

TOTAL TIME PER COMPONENT: ~2-3 HOURS
TOTAL TIME FOR 61 COMPONENTS: ~122-183 HOURS (15-23 Arbeitstage)

text

---

## ✅ FINAL VALIDATION

**Nach Completion der Library:**

COMPONENT LIBRARY COMPLETION CHECKLIST:

□ Alle 61 Components implementiert?
□ Alle Components getestet (> 80% Coverage)?
□ COMPONENT_REGISTRY.md vollständig?
□ Alle Components in index.ts exportiert?
□ Design Tokens überall verwendet?
□ Keine Hardcoded Values?
□ WCAG 2.1 AA compliant?
□ Responsive (alle Breakpoints)?
□ Performance optimiert?
□ TypeScript strict mode?
□ ESLint: 0 Errors/Warnings?
□ Alle Components dokumentiert?
□ Usage Guidelines geschrieben?
□ Enforcement Mechanismen aktiv?
□ Validation Script funktioniert?
□ Build erfolgreich?

✅ ALLE ✓ → COMPONENT LIBRARY READY FOR PRODUCTION!