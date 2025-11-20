/* ==================================================================================
   LAYOUT & SPACING STANDARDS V45.0 - PREMIUM VIBRANT PROFESSIONAL
   ==================================================================================
   ✅ DIN 5008 konforme Abstände
   ✅ Apple HIG Touch-Target-Guidelines (≥44px)
   ✅ Material Design Spacing-System
   ✅ Responsive Breakpoints (320px - 1920px)
   
   ✅ V45.0 PREMIUM VIBRANT PROFESSIONAL DESIGN
   ✅ Premium Vibrant Professional Farbpalette
   ✅ Verbesserte Kontraste und leuchtende Farben
   ✅ Business Tarif Premium Features
   ✅ 100% V45.0 Design System kompatibel
   
   VERWENDUNG:
   ```tsx
   import { LAYOUT_STANDARDS } from '@/config/layout-standards';
   
   <div className={LAYOUT_STANDARDS.gridPatterns['HERO-GRID'].mobile}>
     {content}
   </div>
   ```
   ================================================================================== */

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================
export const BREAKPOINTS = {
  mobile: {
    min: 320,
    max: 767,
    mediaQuery: 'screen and (max-width: 767px)',
    touchTarget: 'min-h-[44px] min-w-[44px]', // Apple HIG Standard
    fontSize: 'text-base', // 16px (iOS Safari default)
    spacing: 'gap-4 p-4',
    containerPadding: 'px-4',
  },
  tablet: {
    min: 768,
    max: 1023,
    mediaQuery: 'screen and (min-width: 768px) and (max-width: 1023px)',
    touchTarget: 'min-h-[48px] min-w-[48px]', // Larger tablets
    fontSize: 'text-base sm:text-lg',
    spacing: 'gap-6 p-6',
    containerPadding: 'px-6',
  },
  desktop: {
    min: 1024,
    max: 1920,
    mediaQuery: 'screen and (min-width: 1024px)',
    fontSize: 'text-lg',
    spacing: 'gap-8 p-8',
    containerPadding: 'px-8',
  },
} as const;

// ============================================================================
// GRID PATTERNS (Mobile-First)
// ============================================================================
export const GRID_PATTERNS = {
  /**
   * HERO-GRID
   * Verwendung: Landing-Pages, Hero-Sections, Feature-Grids
   * Layout: 1-spaltig (Mobile) → 2-spaltig (Tablet) → 3-spaltig (Desktop)
   */
  'HERO-GRID': {
    mobile: 'grid grid-cols-1 gap-6 px-4 py-8',
    tablet: 'sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-12',
    desktop: 'lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-16',
    full: 'grid grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-16',
  },
  
  /**
   * TARIF-KARTEN-GRID
   * Verwendung: Pricing-Pages, Product-Cards
   * Layout: 1-spaltig (Mobile) → 2-spaltig (Tablet) → 3-spaltig (Desktop)
   */
  'TARIF-KARTEN-GRID': {
    mobile: 'grid grid-cols-1 gap-6 px-4',
    tablet: 'sm:grid-cols-2 sm:gap-8 sm:px-6',
    desktop: 'lg:grid-cols-3 lg:gap-10 lg:px-8',
    full: 'grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:grid-cols-3 lg:gap-10 lg:px-8',
  },
  
  /**
   * DASHBOARD-GRID
   * Verwendung: Admin-Dashboards, KPI-Cards
   * Layout: 1-spaltig (Mobile) → 2-spaltig (Tablet) → 4-spaltig (Desktop)
   */
  'DASHBOARD-GRID': {
    mobile: 'grid grid-cols-1 gap-4 p-4',
    tablet: 'sm:grid-cols-2 sm:gap-6 sm:p-6',
    desktop: 'lg:grid-cols-4 lg:gap-8 lg:p-8',
    full: 'grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6 lg:grid-cols-4 lg:gap-8 lg:p-8',
  },
  
  /**
   * LIST-GRID
   * Verwendung: Tabellen, Listen, Data-Grids
   * Layout: 1-spaltig (Mobile) → 1-spaltig (Tablet) → 1-spaltig (Desktop)
   */
  'LIST-GRID': {
    mobile: 'flex flex-col gap-2 px-4',
    tablet: 'sm:gap-3 sm:px-6',
    desktop: 'lg:gap-4 lg:px-8',
    full: 'flex flex-col gap-2 px-4 sm:gap-3 sm:px-6 lg:gap-4 lg:px-8',
  },
  
  /**
   * FORM-GRID
   * Verwendung: Formulare (2-spaltig ab Desktop)
   * Layout: 1-spaltig (Mobile/Tablet) → 2-spaltig (Desktop)
   */
  'FORM-GRID': {
    mobile: 'grid grid-cols-1 gap-4 p-4',
    tablet: 'sm:gap-6 sm:p-6',
    desktop: 'lg:grid-cols-2 lg:gap-8 lg:p-8',
    full: 'grid grid-cols-1 gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2 lg:gap-8 lg:p-8',
  },
} as const;

// ============================================================================
// SPACING PRESETS (DIN 5008 + Material Design)
// ============================================================================
export const SPACING = {
  /**
   * Section Spacing (zwischen Haupt-Sections)
   * DIN 5008: 2-facher Zeilenabstand zwischen Blöcken
   */
  section: 'space-y-12 md:space-y-16 lg:space-y-24',
  
  /**
   * Card Spacing (innerhalb Cards)
   * Standard: 1.5-facher Zeilenabstand
   */
  card: 'space-y-4 md:space-y-6',
  
  /**
   * List Spacing (zwischen Listen-Items)
   * Kompakt für hohe Informationsdichte
   */
  list: 'space-y-2 md:space-y-3',
  
  /**
   * Inline Spacing (horizontal, z.B. Button-Groups)
   */
  inline: 'gap-2 md:gap-3 lg:gap-4',
  
  /**
   * Tight Spacing (sehr kompakt, z.B. Labels + Inputs)
   */
  tight: 'space-y-1 md:space-y-1.5',
  
  /**
   * Loose Spacing (großzügig, z.B. Marketing-Sections)
   */
  loose: 'space-y-16 md:space-y-24 lg:space-y-32',
} as const;

// ============================================================================
// CONTAINER PRESETS
// ============================================================================
export const CONTAINERS = {
  /**
   * Page Container (Haupt-Container für Pages)
   * Max-Width: 1280px (7xl)
   */
  page: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
  
  /**
   * Content Container (für Text-Content)
   * Max-Width: 896px (4xl) - optimale Lesbarkeit
   */
  content: 'max-w-4xl mx-auto px-4 sm:px-6',
  
  /**
   * Narrow Container (für Formulare, Modals)
   * Max-Width: 672px (2xl)
   */
  narrow: 'max-w-2xl mx-auto px-4',
  
  /**
   * Wide Container (für Dashboards, Tabellen)
   * Max-Width: Full Screen
   */
  wide: 'w-full mx-auto px-4 sm:px-6 lg:px-8',
  
  /**
   * Fluid Container (keine Max-Width)
   */
  fluid: 'w-full px-4 sm:px-6 lg:px-8',
} as const;

// ============================================================================
// PADDING PRESETS
// ============================================================================
export const PADDING = {
  /**
   * Card Padding (innerhalb Cards)
   */
  card: 'p-4 sm:p-6 lg:p-8',
  
  /**
   * Section Padding (Sections mit Background)
   */
  section: 'py-8 sm:py-12 lg:py-16',
  
  /**
   * Button Padding (Primary/Secondary Buttons)
   */
  button: 'px-4 py-2 sm:px-6 sm:py-3',
  
  /**
   * Button Padding (Small Buttons)
   */
  buttonSmall: 'px-3 py-1.5 sm:px-4 sm:py-2',
  
  /**
   * Button Padding (Large Buttons)
   */
  buttonLarge: 'px-6 py-3 sm:px-8 sm:py-4',
  
  /**
   * Input Padding (Form-Inputs)
   */
  input: 'px-3 py-2 sm:px-4 sm:py-2.5',
  
  /**
   * Modal Padding
   */
  modal: 'p-6 sm:p-8 lg:p-10',
} as const;

// ============================================================================
// TOUCH-TARGET STANDARDS (Apple HIG + Material Design)
// ============================================================================
export const TOUCH_TARGETS = {
  /**
   * Minimum Touch-Target (iOS Standard)
   * Apple HIG: 44x44pt minimum
   */
  minimum: 'min-h-[44px] min-w-[44px]',
  
  /**
   * Comfortable Touch-Target (Android Material)
   * Material Design: 48x48dp recommended
   */
  comfortable: 'min-h-[48px] min-w-[48px]',
  
  /**
   * Large Touch-Target (Accessibility)
   * WCAG 2.5.5: 44x44px minimum
   */
  large: 'min-h-[56px] min-w-[56px]',
  
  /**
   * Button Standard (Shadcn Default)
   */
  button: 'h-10 px-4 sm:h-11 sm:px-6',
  
  /**
   * Button Small
   */
  buttonSmall: 'h-9 px-3 sm:h-10 sm:px-4',
  
  /**
   * Button Large
   */
  buttonLarge: 'h-11 px-6 sm:h-12 sm:px-8',
  
  /**
   * Icon-Only Button
   */
  iconButton: 'h-10 w-10 sm:h-11 sm:w-11',
} as const;

// ============================================================================
// TYPOGRAPHY SPACING
// ============================================================================
export const TYPOGRAPHY = {
  /**
   * Headline + Paragraph Spacing
   */
  headlineBody: 'space-y-4',
  
  /**
   * Paragraph Spacing
   */
  paragraphs: 'space-y-2',
  
  /**
   * Line Height Standards
   */
  lineHeight: {
    tight: 'leading-tight', // 1.25
    normal: 'leading-normal', // 1.5
    relaxed: 'leading-relaxed', // 1.625
    loose: 'leading-loose', // 2
  },
} as const;

// ============================================================================
// PAGE-SPECIFIC STANDARDS
// ============================================================================
export const PAGE_STANDARDS = {
  /**
   * Landing-Page (Index.tsx)
   */
  landingPage: {
    hero: GRID_PATTERNS['HERO-GRID'].full,
    features: GRID_PATTERNS['TARIF-KARTEN-GRID'].full,
    sectionSpacing: SPACING.section,
    container: CONTAINERS.page,
  },
  
  /**
   * Pricing-Page (NeXifyPricing.tsx)
   */
  pricingPage: {
    grid: GRID_PATTERNS['TARIF-KARTEN-GRID'].full,
    cardPadding: PADDING.card,
    sectionSpacing: SPACING.section,
    container: CONTAINERS.page,
  },
  
  /**
   * Dashboard-Page (Dashboard.tsx)
   */
  dashboardPage: {
    grid: GRID_PATTERNS['DASHBOARD-GRID'].full,
    cardSpacing: SPACING.card,
    container: CONTAINERS.wide,
  },
  
  /**
   * Form-Page (z.B. Booking erstellen)
   */
  formPage: {
    grid: GRID_PATTERNS['FORM-GRID'].full,
    container: CONTAINERS.narrow,
    spacing: SPACING.card,
  },
  
  /**
   * List-Page (z.B. Aufträge, Kunden)
   */
  listPage: {
    grid: GRID_PATTERNS['LIST-GRID'].full,
    container: CONTAINERS.wide,
    spacing: SPACING.list,
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Grid Pattern Classes
 * @param pattern - Grid pattern name
 * @returns Full responsive class string
 */
export function getGridPattern(pattern: keyof typeof GRID_PATTERNS): string {
  return GRID_PATTERNS[pattern].full;
}

/**
 * Get Container Classes
 * @param type - Container type
 * @returns Container class string
 */
export function getContainer(type: keyof typeof CONTAINERS): string {
  return CONTAINERS[type];
}

/**
 * Get Touch-Target Classes
 * @param size - Touch target size
 * @returns Touch target class string
 */
export function getTouchTarget(size: keyof typeof TOUCH_TARGETS): string {
  return TOUCH_TARGETS[size];
}

/**
 * Combine Layout Classes
 * @param grid - Grid pattern
 * @param container - Container type
 * @param spacing - Spacing preset
 * @returns Combined class string
 */
export function combineLayout(
  grid?: keyof typeof GRID_PATTERNS,
  container?: keyof typeof CONTAINERS,
  spacing?: keyof typeof SPACING
): string {
  const classes: string[] = [];
  if (container) classes.push(CONTAINERS[container]);
  if (grid) classes.push(GRID_PATTERNS[grid].full);
  if (spacing) classes.push(SPACING[spacing]);
  return classes.join(' ');
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type GridPattern = keyof typeof GRID_PATTERNS;
export type ContainerType = keyof typeof CONTAINERS;
export type SpacingType = keyof typeof SPACING;
export type TouchTargetSize = keyof typeof TOUCH_TARGETS;
export type PageStandard = keyof typeof PAGE_STANDARDS;

/**
 * Layout Standards Gesamtübersicht
 * Für Knowledge-Base Sync
 */
export const LAYOUT_STANDARDS = {
  breakpoints: BREAKPOINTS,
  gridPatterns: GRID_PATTERNS,
  spacing: SPACING,
  containers: CONTAINERS,
  padding: PADDING,
  touchTargets: TOUCH_TARGETS,
  typography: TYPOGRAPHY,
  pageStandards: PAGE_STANDARDS,
} as const;
