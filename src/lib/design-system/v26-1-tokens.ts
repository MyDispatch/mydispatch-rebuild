/* ==================================================================================
   V26.1 DESIGN TOKEN SYSTEM - HERO-QUALITÄT SYSTEMWEIT
   ==================================================================================
   ✅ Basierend auf Production-Ready Hero (Home.tsx)
   ✅ 100% HSL-BASIERT (KEINE HEX-FARBEN!)
   ✅ 300ms Transitions für snappy, synchrone UX
   ✅ Icon-System: Dunkelblau Background + Beige Icon
   ✅ Performance-Badges: Beige Background + Dunkelblau Text
   ✅ Status-Badges: Ampel-System (Grün/Gelb/Rot) NUR für Status
   ================================================================================== */

/**
 * 1. KERNFARBEN V26.1 (MANDATORY - HSL)
 */
export const KERNFARBEN_V26_1 = {
  // Core Brand Colors
  dunkelblau: "hsl(225, 31%, 28%)", // #323D5E → HSL
  dunkelblau_hover: "hsl(225, 31%, 35%)", // #3F4C70 → HSL
  dunkelblau_lighter: "hsl(225, 31%, 42%)", // #4A5A85 → HSL
  beige: "hsl(42, 49%, 78%)", // #EADEBD → HSL
  weiss: "hsl(0, 0%, 100%)", // #FFFFFF → HSL
  canvas: "hsl(220, 14%, 98%)", // #F8F9FB → HSL

  // Text Colors
  text_primary: "hsl(225, 31%, 28%)", // #323D5E → HSL
  text_secondary: "hsl(215, 20%, 55%)", // #64748B → HSL
  text_tertiary: "hsl(214, 16%, 68%)", // #94A3B8 → HSL

  // Border Colors
  border_neutral: "hsl(214, 32%, 91%)", // #E2E8F0 → HSL
  border_neutral_soft: "hsl(210, 40%, 96%)", // #F1F5F9 → HSL

  // Status Colors (NUR für Ampel-System)
  status_success: "hsl(142, 71%, 45%)", // #22C55E → HSL
  status_warning: "hsl(43, 96%, 56%)", // #F59E0B → HSL
  status_error: "hsl(0, 72%, 51%)", // #EF4444 → HSL
} as const;

/**
 * 2. GRADIENTS V26.1 (HSL-basiert)
 */
export const GRADIENTS_V26_1 = {
  // Hero Background
  hero_primary:
    "linear-gradient(135deg, hsl(225, 31%, 28%) 0%, hsl(225, 31%, 35%) 50%, hsl(225, 31%, 42%) 100%)",

  // Subtle Backgrounds
  beige_subtle: "linear-gradient(180deg, rgba(234, 222, 189, 0.05), rgba(234, 222, 189, 0.02))",
  dunkelblau_subtle: "linear-gradient(180deg, rgba(50, 61, 94, 0.05), rgba(50, 61, 94, 0.02))",
} as const;

/**
 * 3. MOTION V26.1 (BEST PRACTICE)
 */
export const MOTION_V26_1 = {
  // Duration (Best Practice für snappy UX)
  duration: {
    instant: "100ms",
    fast: "200ms",
    default: "300ms", // ← Hauptwert für Sidebar/Header/Footer
    slow: "400ms", // ← Reduziert von 600ms
    slower: "600ms", // ← Reduziert von 800ms
  },

  // Timing Functions
  timing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Transitions (Fertige Strings)
  transition_sidebar: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_header:
    "left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_footer:
    "left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_content: "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_default: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

/**
 * 4. ELEVATION V26.1
 */
export const ELEVATION_V26_1 = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",

  // Hero-spezifische Elevations
  dashboard_preview:
    "0 0 60px rgba(234, 222, 189, 0.19), 0 25px 80px rgba(50, 61, 94, 0.5), 0 40px 120px rgba(0,0,0,0.4)",
  icon_box: "0 0 15px rgba(234, 222, 189, 0.19), inset 0 0 15px rgba(234, 222, 189, 0.06)",
  kpi_card: "0 0 15px rgba(50, 61, 94, 0.05)",
  kpi_card_hover: "0 0 20px rgba(234, 222, 189, 0.12)",
} as const;

/**
 * 5. SPACING V26.1
 */
export const SPACING_V26_1 = {
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px

  // Container-Spacing
  container_padding_mobile: "1rem",
  container_padding_tablet: "1.5rem",
  container_padding_desktop: "2rem",
} as const;

/**
 * 6. RADIUS V26.1
 */
export const RADIUS_V26_1 = {
  none: "0",
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",

  // Component-spezifisch
  card: "1rem",
  button: "0.5rem",
  icon_box: "0.75rem",
} as const;

/**
 * 7. ICON & BADGE SYSTEM V26.1
 */
export const ICON_SYSTEM_V26_1 = {
  // Icon-Box (Dunkelblau Background + Beige Icon)
  icon_box_bg: KERNFARBEN_V26_1.dunkelblau,
  icon_box_color: KERNFARBEN_V26_1.beige,
  icon_box_shadow: ELEVATION_V26_1.icon_box,

  // Performance-Badge (Beige Background + Dunkelblau Text)
  performance_badge_bg: "rgba(234, 222, 189, 0.15)",
  performance_badge_border: "rgba(234, 222, 189, 0.3)",
  performance_badge_text: KERNFARBEN_V26_1.dunkelblau,

  // Status-Badge (Ampel-System)
  status_badge_success_bg: "rgba(34, 197, 94, 0.15)",
  status_badge_success_border: "rgba(34, 197, 94, 0.3)",
  status_badge_success_text: "hsl(142, 77%, 29%)", // #15803D → HSL

  status_badge_warning_bg: "rgba(245, 158, 11, 0.15)",
  status_badge_warning_border: "rgba(245, 158, 11, 0.3)",
  status_badge_warning_text: "hsl(30, 92%, 37%)", // #B45309 → HSL

  status_badge_error_bg: "rgba(239, 68, 68, 0.15)",
  status_badge_error_border: "rgba(239, 68, 68, 0.3)",
  status_badge_error_text: "hsl(0, 77%, 42%)", // #B91C1C → HSL
} as const;

/**
 * EXPORT: Alle V26.1 Design-Tokens als ein Objekt
 */
export const DESIGN_TOKENS_V26_1 = {
  colors: KERNFARBEN_V26_1,
  gradients: GRADIENTS_V26_1,
  motion: MOTION_V26_1,
  elevation: ELEVATION_V26_1,
  spacing: SPACING_V26_1,
  radius: RADIUS_V26_1,
  iconSystem: ICON_SYSTEM_V26_1,
} as const;

/**
 * TYPE EXPORTS
 */
export type KernfarbenV26_1Type = typeof KERNFARBEN_V26_1;
export type GradientsV26_1Type = typeof GRADIENTS_V26_1;
export type MotionV26_1Type = typeof MOTION_V26_1;
export type ElevationV26_1Type = typeof ELEVATION_V26_1;
export type SpacingV26_1Type = typeof SPACING_V26_1;
export type RadiusV26_1Type = typeof RADIUS_V26_1;
export type IconSystemV26_1Type = typeof ICON_SYSTEM_V26_1;
export type DesignTokensV26_1Type = typeof DESIGN_TOKENS_V26_1;

/**
 * USAGE EXAMPLE:
 *
 * import { DESIGN_TOKENS_V26_1 } from '@/lib/design-system/v26-1-tokens';
 *
 * // In Component:
 * <div
 *   style={{
 *     backgroundColor: DESIGN_TOKENS_V26_1.colors.dunkelblau,
 *     color: DESIGN_TOKENS_V26_1.colors.beige,
 *     transition: DESIGN_TOKENS_V26_1.motion.transition_default,
 *     boxShadow: DESIGN_TOKENS_V26_1.elevation.icon_box,
 *   }}
 * >
 *   Content
 * </div>
 */
