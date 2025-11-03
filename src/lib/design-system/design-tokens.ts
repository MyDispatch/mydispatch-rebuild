/* ==================================================================================
   MYDISPATCH DESIGN TOKEN SYSTEM V19.0.0
   ==================================================================================
   ✅ Zentrale Design-Tokens für skalierbare, konsistente UI
   ✅ Basiert auf MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md
   ✅ NIEMALS direkte Tailwind-Klassen - nur diese Tokens verwenden!
   ✅ 100% HSL-BASIERT (KEINE HEX-FARBEN!)
   ================================================================================== */

/**
 * 1. FARBEN (Colors) - Pure HSL Values
 */
const BASE_COLORS = {
  dunkelblau: 'hsl(225, 31%, 28%)',
  beige: 'hsl(42, 49%, 78%)',
  weiss: 'hsl(0, 0%, 100%)',
  canvas: 'hsl(220, 14%, 98%)',
  text_primary: 'rgba(50, 61, 94, 1)',
  text_secondary: 'rgba(50, 61, 94, 0.8)',
  text_tertiary: 'rgba(50, 61, 94, 0.6)',
  border_neutral: 'hsl(220, 13%, 91%)',
  border_neutral_soft: 'rgba(229, 231, 235, 0.3)',
};

export const COLORS = {
  ...BASE_COLORS,
  
  // Nested kernfarben structure for backward compatibility
  kernfarben: BASE_COLORS,
  
  // Nested text structure
  text: {
    primary: BASE_COLORS.text_primary,
    secondary: BASE_COLORS.text_secondary,
    tertiary: BASE_COLORS.text_tertiary,
  },
  
  // Nested border structure
  border: {
    DEFAULT: BASE_COLORS.border_neutral,
    soft: BASE_COLORS.border_neutral_soft,
  },
  
  // Core colors
  background: BASE_COLORS.weiss,
  surface: BASE_COLORS.weiss,
  
  // Interactive States
  hover_primary: `${BASE_COLORS.dunkelblau}E6`, // 90% opacity
  hover_secondary: `${BASE_COLORS.dunkelblau}1A`, // 10% opacity
  focus_outline: BASE_COLORS.dunkelblau,
  active_state: 'hsl(225, 31%, 35%)', // #3F4C70 → HSL
  
  // Status Colors (für Feedback, Alerts)
  success: 'hsl(142, 76%, 36%)',      // #10B981 → HSL
  success_bg: 'hsl(142, 80%, 90%)',   // #D1FAE5 → HSL
  warning: 'hsl(43, 96%, 53%)',       // #F59E0B → HSL
  warning_bg: 'hsl(48, 96%, 89%)',    // #FEF3C7 → HSL
  error: 'hsl(0, 84%, 60%)',          // #EF4444 → HSL
  error_bg: 'hsl(0, 93%, 94%)',       // #FEE2E2 → HSL
  info: 'hsl(221, 83%, 53%)',         // #3B82F6 → HSL
  info_bg: 'hsl(214, 95%, 93%)',      // #DBEAFE → HSL
} as const;

/**
 * 2. SPACING (Abstände)
 * Semantische Spacing-Tokens basierend auf 8px-Grid
 */
export const SPACING = {
  // Basis-Spacing (8px-Grid)
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  
  // Sektion-Spacing
  section_padding_mobile: '5rem', // 80px (py-20)
  section_padding_desktop: '6rem', // 96px (py-24)
  section_padding_hero_mobile: '5rem', // 80px (py-20)
  section_padding_hero_desktop: '7rem', // 112px (py-28)
  
  // Container-Spacing
  container_padding_mobile: '1rem', // 16px (px-4)
  container_padding_tablet: '1.5rem', // 24px (px-6)
  container_padding_desktop: '2rem', // 32px (px-8)
  
  // Card-Spacing
  card_padding_mobile: '1.5rem', // 24px (p-6)
  card_padding_desktop: '2rem', // 32px (p-8)
  card_gap: '2rem', // 32px (gap-8)
  
  // Element-Spacing
  element_gap_sm: '0.75rem', // 12px (gap-3)
  element_gap_md: '1rem', // 16px (gap-4)
  element_gap_lg: '1.25rem', // 20px (gap-5)
} as const;

/**
 * 3. ELEVATION (Schatten)
 * Semantische Shadow-Tokens für verschiedene Elevations-Stufen
 */
export const ELEVATION = {
  // Standard-Elevations
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
  
  // Spezifische Elevations
  card_default: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
  card_hover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
  card_highlighted: `0 20px 25px -5px rgba(50, 61, 94, 0.15)`, // shadow-xl mit Dunkelblau (15% opacity)
  button_primary: `0 0 25px rgba(50, 61, 94, 0.4)`, // 40% opacity
  
  // Subtle Shadow für neutrale Elemente
  neutral_subtle: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)', // Sehr leicht
} as const;

/**
 * 4. RADIUS (Abrundungen)
 * Semantische Border-Radius-Tokens
 */
export const RADIUS = {
  none: '0',
  sm: '0.375rem', // 6px (rounded-md)
  md: '0.5rem', // 8px (rounded-lg)
  lg: '0.75rem', // 12px (rounded-xl)
  xl: '1rem', // 16px (rounded-2xl)
  full: '9999px', // rounded-full
  
  // Spezifische Radius
  card: '1rem', // 16px (rounded-2xl)
  button: '9999px', // rounded-full
  input: '0.5rem', // 8px (rounded-lg)
  badge: '9999px', // rounded-full
  icon_container: '0.5rem', // 8px (rounded-lg) oder 9999px (rounded-full)
} as const;

/**
 * 5. MOTION (Animationen & Übergänge)
 * Semantische Animation-Tokens
 */
export const MOTION = {
  // Nested duration structure
  duration: {
    instant: '100ms',
    fast: '200ms',
    default: '300ms',
    slow: '600ms', // Erhöht für sanftere Sidebar-Transitions
    slower: '800ms',
  },
  
  // Nested timing structure
  timing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Flat structure for backward compatibility
  duration_instant: '100ms',
  duration_fast: '200ms',
  duration_default: '300ms',
  duration_slow: '600ms', // Erhöht für sanftere Sidebar-Transitions
  duration_slower: '800ms',
  
  ease_default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  ease_in: 'cubic-bezier(0.4, 0, 1, 1)',
  ease_out: 'cubic-bezier(0, 0, 0.2, 1)',
  ease_smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  transition_default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transition_fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  transition_transform: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transition_opacity: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transition_shadow: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  delay_0: '0ms',
  delay_50: '50ms',
  delay_100: '100ms',
  delay_150: '150ms',
  delay_200: '200ms',
} as const;

/**
 * 6. TYPOGRAPHY (Typografie)
 * Semantische Typografie-Tokens (Fluid Typography)
 */
export const TYPOGRAPHY = {
  // Font Families
  font_family_base: 'Inter, system-ui, -apple-system, sans-serif',
  
  // Font Sizes (Fluid Typography mit clamp)
  font_size_h1_mobile: '3rem', // 48px (text-5xl)
  font_size_h1_desktop: '3.75rem', // 60px (text-6xl)
  font_size_h2_mobile: '2.25rem', // 36px (text-4xl)
  font_size_h2_desktop: '3rem', // 48px (text-5xl)
  font_size_h3: '1.5rem', // 24px (text-2xl)
  font_size_price_large: '3rem', // 48px (text-5xl)
  font_size_price_small: '1.875rem', // 30px (text-3xl)
  font_size_body_large: '1.125rem', // 18px (text-lg)
  font_size_body: '1rem', // 16px (text-base)
  font_size_small: '0.875rem', // 14px (text-sm)
  font_size_tiny: '0.75rem', // 12px (text-xs)
  
  // Line Heights
  line_height_tight: '1.25', // leading-tight
  line_height_normal: '1.5', // leading-normal
  line_height_relaxed: '1.625', // leading-relaxed
  line_height_loose: '1.75', // leading-loose
  
  // Font Weights
  font_weight_normal: '400',
  font_weight_medium: '500',
  font_weight_semibold: '600',
  font_weight_bold: '700',
  font_weight_extrabold: '800',
  
  // Letter Spacing
  letter_spacing_tight: '-0.025em', // tracking-tight
  letter_spacing_normal: '0em', // tracking-normal
  letter_spacing_wide: '0.025em', // tracking-wide
} as const;

/**
 * 7. INTERACTIVE (Interaktive Elemente)
 * Tokens für Buttons, Links, Inputs
 */
export const INTERACTIVE = {
  // Touch Targets (Mobile-First)
  min_touch_target: '44px', // Mindestgröße für Touch-Elemente
  button_height: '48px', // Standard-Button-Höhe (h-12)
  input_height: '44px', // Standard-Input-Höhe
  
  // Button States
  button_primary_bg: BASE_COLORS.dunkelblau,
  button_primary_text: BASE_COLORS.beige,
  button_primary_hover_bg: 'hsl(225, 31%, 35%)', // #3F4C70 → HSL
  button_primary_hover_shadow: `0 0 25px rgba(50, 61, 94, 0.4)`,
  button_primary_hover_scale: '1.02',
  
  button_secondary_bg: BASE_COLORS.weiss,
  button_secondary_text: BASE_COLORS.dunkelblau,
  button_secondary_border: BASE_COLORS.dunkelblau,
  button_secondary_border_width: '2px',
  button_secondary_hover_bg: `rgba(50, 61, 94, 0.1)`,
  button_secondary_hover_scale: '1.02',
  
  button_ghost_bg: 'transparent',
  button_ghost_text: BASE_COLORS.dunkelblau,
  button_ghost_hover_bg: `rgba(50, 61, 94, 0.1)`,
  
  // Focus States
  focus_ring_color: BASE_COLORS.dunkelblau,
  focus_ring_width: '2px',
  focus_ring_offset: '2px',
  
  // Disabled States
  disabled_opacity: '0.5',
  disabled_cursor: 'not-allowed',
} as const;

/**
 * 8. BREAKPOINTS (Responsive)
 * Semantische Breakpoints
 */
export const BREAKPOINTS = {
  sm: '640px', // Tablet
  md: '768px', // Desktop Small
  lg: '1024px', // Desktop Medium
  xl: '1280px', // Desktop Large
  '2xl': '1536px', // Desktop XL
} as const;

/**
 * 9. Z-INDEX (Layering)
 * Semantische Z-Index-Werte
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal_backdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
} as const;

/**
 * EXPORT: Alle Design-Tokens als ein Objekt
 */
export const DESIGN_TOKENS = {
  colors: COLORS,
  spacing: SPACING,
  elevation: ELEVATION,
  radius: RADIUS,
  motion: MOTION,
  typography: TYPOGRAPHY,
  interactive: INTERACTIVE,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
} as const;

/**
 * TYPE EXPORTS
 */
export type ColorsType = typeof COLORS;
export type SpacingType = typeof SPACING;
export type ElevationType = typeof ELEVATION;
export type RadiusType = typeof RADIUS;
export type MotionType = typeof MOTION;
export type TypographyType = typeof TYPOGRAPHY;
export type InteractiveType = typeof INTERACTIVE;
export type BreakpointsType = typeof BREAKPOINTS;
export type ZIndexType = typeof Z_INDEX;
export type DesignTokensType = typeof DESIGN_TOKENS;

/**
 * HELPER FUNCTIONS
 */

/**
 * Generiert ein CSS-Custom-Property-Objekt für die Design-Tokens
 * Verwendung: style={generateCSSVariables()}
 */
export function generateCSSVariables() {
  return {
    // Colors
    '--color-primary': COLORS.beige,
    '--color-foreground': COLORS.dunkelblau,
    '--color-background': COLORS.weiss,
    '--color-canvas': COLORS.canvas,
    '--color-text-primary': COLORS.text_primary,
    '--color-text-secondary': COLORS.text_secondary,
    '--color-text-tertiary': COLORS.text_tertiary,
    
    // Spacing
    '--spacing-xs': SPACING.xs,
    '--spacing-sm': SPACING.sm,
    '--spacing-md': SPACING.md,
    '--spacing-lg': SPACING.lg,
    '--spacing-xl': SPACING.xl,
    
    // Elevation
    '--elevation-card': ELEVATION.card_default,
    '--elevation-card-hover': ELEVATION.card_hover,
    
    // Radius
    '--radius-card': RADIUS.card,
    '--radius-button': RADIUS.button,
    
    // Motion
    '--transition-default': MOTION.transition_default,
    '--duration-default': MOTION.duration_default,
    '--ease-default': MOTION.ease_default,
    
    // Typography
    '--font-family': TYPOGRAPHY.font_family_base,
    
    // Interactive
    '--min-touch-target': INTERACTIVE.min_touch_target,
  } as React.CSSProperties;
}

/**
 * Generiert eine Media-Query für responsive Design
 * Verwendung: const mediaQuery = getMediaQuery('md'); // "@media (min-width: 768px)"
 */
export function getMediaQuery(breakpoint: keyof typeof BREAKPOINTS): string {
  return `@media (min-width: ${BREAKPOINTS[breakpoint]})`;
}

/**
 * USAGE EXAMPLE:
 * 
 * import { DESIGN_TOKENS, generateCSSVariables } from '@/lib/design-system/design-tokens';
 * 
 * // In Component:
 * <div 
 *   style={{
 *     backgroundColor: DESIGN_TOKENS.colors.dunkelblau,
 *     padding: DESIGN_TOKENS.spacing.card_padding_mobile,
 *     borderRadius: DESIGN_TOKENS.radius.card,
 *     boxShadow: DESIGN_TOKENS.elevation.card_default,
 *     transition: DESIGN_TOKENS.motion.transition_default,
 *   }}
 * >
 *   Content
 * </div>
 */
