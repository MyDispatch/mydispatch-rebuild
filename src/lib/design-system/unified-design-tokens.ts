/* ==================================================================================
   UNIFIED DESIGN TOKEN SYSTEM V26.1 - **DEPRECATED**
   ==================================================================================
   ⛔ **DEPRECATED - DO NOT USE IN NEW CODE!**
   
   This file contains V26.1 design tokens (Beige/Dunkelblau color system).
   The project has migrated to V28.1 Slate Design System.
   
   **MIGRATION GUIDE:**
   - Use Tailwind Slate classes (slate-50 to slate-900) instead
   - Primary actions: bg-slate-700 (instead of bg-secondary)
   - Muted text: text-slate-600 (instead of text-secondary)
   - Borders: border-slate-200 (instead of border-secondary)
   
   **WHY DEPRECATED:**
   - V28.1 uses professional Slate-Palette (no Beige/Dunkelblau)
   - Hardcoded RGBA values are replaced by Tailwind semantic tokens
   - Better maintainability and consistency
   
   **FOR BACKWARD COMPATIBILITY ONLY - DO NOT EXTEND!**
   **WILL BE REMOVED IN V29!**
   ================================================================================== */

// Runtime warning for deprecated usage
if (typeof window !== "undefined" && import.meta.env.DEV) {
  console.warn(
    "⚠️ UNIFIED_DESIGN_TOKENS is deprecated!\n" +
      "   Migrate to Tailwind V28.1 Slate classes instead.\n" +
      "   This file will be removed in V29."
  );
}

/**
 * 0. V27.0 NORDIC SKY COLOR PALETTE - Modern, Fresh, Premium
 */
export const PRIMARY_COLORS_V27 = {
  // Nordic Sky Core Colors (100% HSL-BASIERT!)
  indigo: "hsl(220, 40%, 32%)", // Modern Indigo (ersetzt Dunkelblau)
  champagne: "hsl(45, 65%, 88%)", // Warm Champagne (ersetzt Beige)
  sky: "hsl(200, 70%, 60%)", // Fresh Sky-Blue (Accent)
  pearl: "hsl(0, 0%, 98%)", // Pearl White (Canvas)

  // Legacy V26 Colors (für Backward Compatibility)
  _dunkelblau: "hsl(225, 31%, 28%)",
  _beige: "hsl(42, 49%, 78%)",
  _weiss: "hsl(0, 0%, 100%)",
  _canvas: "hsl(42, 49%, 98%)",
} as const;

/**
 * 0. EXTENDED COLOR TOKENS - Glow & Overlay Variants
 */
export const EXTENDED_COLOR_TOKENS = {
  // V27.0 Nordic Sky Colors
  indigo: PRIMARY_COLORS_V27.indigo,
  champagne: PRIMARY_COLORS_V27.champagne,
  sky: PRIMARY_COLORS_V27.sky,
  pearl: PRIMARY_COLORS_V27.pearl,

  // Base Colors (PURE HSL VALUES - NO HEX!)
  dunkelblau: "hsl(225, 31%, 28%)", // #323D5E → HSL
  beige: "hsl(42, 49%, 78%)", // #EADEBD → HSL
  weiss: "hsl(0, 0%, 100%)", // #FFFFFF → HSL
  canvas: "hsl(42, 49%, 98%)", // #F9FAFB → HSL (leichter Beige-Ton)

  // Beige Variants (Extended)
  beige_05: "rgba(234, 222, 189, 0.05)",
  beige_15: "rgba(234, 222, 189, 0.15)",
  beige_20: "rgba(234, 222, 189, 0.20)",
  beige_30: "rgba(234, 222, 189, 0.30)",
  beige_40: "rgba(234, 222, 189, 0.40)",
  beige_50: "rgba(234, 222, 189, 0.50)",
  beige_80: "rgba(234, 222, 189, 0.80)",

  // Beige Glow Variants
  beige_glow_06: "rgba(234, 222, 189, 0.06)",
  beige_glow_08: "rgba(234, 222, 189, 0.08)",
  beige_glow_12: "rgba(234, 222, 189, 0.12)",
  beige_glow_13: "rgba(234, 222, 189, 0.13)",
  beige_glow_15: "rgba(234, 222, 189, 0.15)",
  beige_glow_19: "rgba(234, 222, 189, 0.19)",
  beige_glow_20: "rgba(234, 222, 189, 0.20)",
  beige_glow_21: "rgba(234, 222, 189, 0.21)",
  beige_glow_25: "rgba(234, 222, 189, 0.25)",
  beige_glow_30: "rgba(234, 222, 189, 0.30)",
  beige_glow_40: "rgba(234, 222, 189, 0.40)",
  beige_glow_50: "rgba(234, 222, 189, 0.50)",
  beige_glow_80: "rgba(234, 222, 189, 0.80)",

  // Beige Border Variants
  beige_border_19: "rgba(234, 222, 189, 0.19)",
  beige_border_25: "rgba(234, 222, 189, 0.25)",
  beige_border_30: "rgba(234, 222, 189, 0.30)",
  beige_border_31: "rgba(234, 222, 189, 0.31)",
  beige_border_37: "rgba(234, 222, 189, 0.37)",
  beige_border_40: "rgba(234, 222, 189, 0.40)",

  // Dunkelblau Overlay Variants (Extended)
  dunkelblau_overlay_03: "rgba(50, 61, 94, 0.03)",
  dunkelblau_overlay_05: "rgba(50, 61, 94, 0.05)",
  dunkelblau_overlay_10: "rgba(50, 61, 94, 0.10)",
  dunkelblau_overlay_15: "rgba(50, 61, 94, 0.15)",
  dunkelblau_overlay_25: "rgba(50, 61, 94, 0.25)",
  dunkelblau_overlay_30: "rgba(50, 61, 94, 0.30)",
  dunkelblau_overlay_37: "rgba(50, 61, 94, 0.37)",
  dunkelblau_overlay_50: "rgba(50, 61, 94, 0.50)",
  dunkelblau_overlay_60: "rgba(50, 61, 94, 0.60)",
  dunkelblau_overlay_70: "rgba(50, 61, 94, 0.70)",
  dunkelblau_cc: "rgba(50, 61, 94, 0.80)",

  // Utility Colors
  white: "hsl(0, 0%, 100%)",

  // Interactive States (NEU V32.0)
  active_state: "hsl(225, 31%, 35%)", // #3F4C70 → HSL (Dunkelblau aufgehellt)
  active_state_rgb: "rgba(63, 76, 112, 1)",
  white_10: "rgba(255, 255, 255, 0.1)", // Für Hover auf dunklen Flächen

  // Status Colors Extended (NEU V32.0)
  danger_red: "hsl(0, 84%, 60%)", // Tailwind red-500 → HSL
  warning_orange: "hsl(43, 96%, 53%)", // Tailwind amber-500 → HSL

  // White Overlay Variants
  white_overlay_06: "rgba(255, 255, 255, 0.06)",
  white_overlay_13: "rgba(255, 255, 255, 0.13)",
  white_overlay_80: "rgba(255, 255, 255, 0.80)",
  white_overlay_98: "rgba(255, 255, 255, 0.98)",

  // Border Neutral Variants
  border_neutral: "hsl(220, 13%, 91%)", // #E5E7EB → HSL
  border_neutral_50: "rgba(229, 231, 235, 0.5)",
  border_neutral_66: "rgba(229, 231, 235, 0.66)",
  border_neutral_soft: "rgba(229, 231, 235, 0.3)",
  border_default: "hsl(220, 13%, 91%)", // #E5E7EB → HSL

  // Status Colors (Ampel-System)
  status_success: "hsl(142 71% 45%)",
  status_warning: "hsl(43 96% 56%)",
  status_error: "hsl(0 72% 51%)",

  // Text Colors (Semantic Tokens - HSL)
  text_primary: "hsl(225, 31%, 28%)", // dunkelblau
  text_secondary: "rgba(50, 61, 94, 0.8)", // dunkelblau 80%
  text_tertiary: "rgba(50, 61, 94, 0.6)", // dunkelblau 60%
} as const;

/**
 * 1. BORDER SYSTEM - Systemweite Konsistenz
 */
export const BORDER_SYSTEM = {
  // Border Width
  width: {
    none: "0",
    thin: "1px",
    standard: "2px", // ← STANDARD für alle Cards/Panels
    thick: "3px", // ← Nur für Hero-Elemente (Map)
  },

  // Border Colors mit Transparenz
  color: {
    beige_10: "rgba(234, 222, 189, 0.1)",
    beige_15: "rgba(234, 222, 189, 0.15)",
    beige_20: "rgba(234, 222, 189, 0.2)", // ← STANDARD
    beige_25: "rgba(234, 222, 189, 0.25)",
    beige_30: "rgba(234, 222, 189, 0.3)",
    beige_40: "rgba(234, 222, 189, 0.4)",
    beige_50: "rgba(234, 222, 189, 0.5)",

    dunkelblau_10: "rgba(50, 61, 94, 0.1)",
    dunkelblau_20: "rgba(50, 61, 94, 0.2)",

    status_success: "rgba(34, 197, 94, 0.4)",
    status_warning: "rgba(245, 158, 11, 0.4)",
    status_error: "rgba(239, 68, 68, 0.4)",
  },

  // Fertige Border-Styles (Copy-Paste Ready)
  styles: {
    card_standard: {
      border: "2px solid",
      borderColor: "rgba(234, 222, 189, 0.2)",
    },
    card_hover: {
      border: "2px solid",
      borderColor: "rgba(234, 222, 189, 0.4)",
    },
    panel_header: {
      borderBottom: "2px solid",
      borderColor: "rgba(234, 222, 189, 0.3)",
    },
    hero_map: {
      border: "3px solid",
      borderColor: "rgba(234, 222, 189, 0.25)",
    },
  },
} as const;

/**
 * 2. RADIUS SYSTEM - Systemweite Rundungen
 */
export const RADIUS_SYSTEM = {
  // Base Values
  none: "0",
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px  ← STANDARD für Cards/Panels
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  full: "9999px",

  // Component-Specific (MANDATORY)
  component: {
    card: "0.75rem", // 12px - Alle Cards/Panels
    button: "0.75rem", // 12px - Alle Buttons
    input: "0.5rem", // 8px - Alle Inputs
    badge: "0.5rem", // 8px - Alle Badges
    icon_box: "0.75rem", // 12px - Icon-Container
    modal: "1rem", // 16px - Dialogs/Modals
    hero_map: "1rem", // 16px - Map Container
  },
} as const;

/**
 * 3. SHADOW SYSTEM - Systemweite Elevations
 */
export const SHADOW_SYSTEM = {
  // Base Shadows
  none: "none",
  xs: "0 1px 2px rgba(50, 61, 94, 0.03)",
  sm: "0 2px 4px rgba(50, 61, 94, 0.05)",
  md: "0 4px 8px rgba(50, 61, 94, 0.08)",
  lg: "0 8px 16px rgba(50, 61, 94, 0.1)",
  xl: "0 12px 24px rgba(50, 61, 94, 0.14)",
  "2xl": "0 20px 40px rgba(50, 61, 94, 0.18)",

  // Premium Shadows (Neu: V19.0 - Maximale Klarheit & Schärfe)
  sharp: "0 4px 8px 0 rgba(50, 61, 94, 0.18)", // Scharfe Kanten
  crisp: "0 2px 4px 0 rgba(50, 61, 94, 0.12)", // Knackig-klare Trennung
  elegant: "0 10px 30px -10px rgba(50, 61, 94, 0.35)", // Elegant & definiert
  glow: "0 0 40px rgba(234, 222, 189, 0.6)", // Intensives Gold Glow

  // Component-Specific Shadows (MANDATORY)
  component: {
    // Cards & Panels (V26.1 Modernized - schärfere Multi-Layer)
    card_standard: "0 2px 10px rgba(50, 61, 94, 0.12), 0 4px 20px rgba(50, 61, 94, 0.08)",
    card_hover: "0 8px 30px rgba(50, 61, 94, 0.2), 0 4px 12px rgba(234, 222, 189, 0.15)",
    card_elevated: "0 12px 32px rgba(50, 61, 94, 0.18)",

    // Panels (Optimiert)
    panel_sidebar: "0 8px 32px rgba(50, 61, 94, 0.14), 0 4px 16px rgba(234, 222, 189, 0.12)",
    panel_info: "0 -8px 32px rgba(50, 61, 94, 0.14), 0 -4px 16px rgba(234, 222, 189, 0.12)",

    // Hero Elements (Intensiviert für mehr Präsenz)
    hero_map: `
      0 0 50px rgba(234, 222, 189, 0.2),
      0 20px 60px rgba(50, 61, 94, 0.16),
      0 30px 80px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(234, 222, 189, 0.12)
    `,

    // Icon & Badges (Schärfer)
    icon_box: "0 0 20px rgba(234, 222, 189, 0.25), inset 0 0 15px rgba(234, 222, 189, 0.08)",
    badge: "0 2px 4px rgba(50, 61, 94, 0.14)",

    // Status Glows
    status_success: "0 0 12px rgba(34, 197, 94, 0.2)",
    status_warning: "0 0 12px rgba(245, 158, 11, 0.2)",
    status_error: "0 0 12px rgba(239, 68, 68, 0.2)",
  },
} as const;

/**
 * 4. SPACING SYSTEM - Konsistente Abstände
 */
export const SPACING_SYSTEM = {
  // Base Spacing
  none: "0",
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px

  // Component-Specific Spacing (MANDATORY - DASHBOARD-KONFORM!)
  component: {
    // Card Padding (V26.1 Modernized - mehr Luftigkeit)
    card_padding: "1.5rem", // 24px - Modernized Card Padding (mehr Luft)
    card_padding_sm: "0.5rem", // 8px - Compact Cards (pb-2)
    card_padding_lg: "1rem", // 16px - Large Cards

    // Panel Padding (Dashboard-Standard: gap-3)
    panel_padding_x: "0.75rem", // 12px - Horizontal (Dashboard-konform)
    panel_padding_y: "0.75rem", // 12px - Vertical (Dashboard-konform)

    // Gap between Elements (V26.1 Modernized)
    gap_cards: "1rem", // 16px - Modernized Gap zwischen Cards
    gap_sections: "0.75rem", // 12px - Gap zwischen Sections (space-y-3)
    gap_inline: "0.75rem", // 12px - Gap inline (z.B. Icon + Text)
    gap_compact: "0.5rem", // 8px - Kompakte Gaps (z.B. Badges)
  },
} as const;

/**
 * 5. ICON MAPPING SYSTEM - Konsistente Icon-Nutzung
 */
export const ICON_MAPPING = {
  // MANDATORY: Diese Icons für diese Bedeutungen verwenden

  // Aufträge & Buchungen
  booking: "FileText", // Aufträge allgemein
  booking_new: "Plus", // Neuer Auftrag
  booking_confirmed: "CheckCircle", // Bestätigter Auftrag
  booking_calendar: "Calendar", // Geplante Aufträge

  // Kunden
  customer: "Users", // Kunden allgemein
  customer_new: "UserPlus", // Neuer Kunde
  customer_profile: "User", // Kundenprofil

  // Fahrzeuge
  vehicle: "Car", // Fahrzeuge allgemein
  vehicle_active: "Activity", // Fahrzeug aktiv

  // Fahrer
  driver: "Users", // Fahrer allgemein
  driver_active: "Activity", // Aktiver Fahrer

  // Finanzen
  revenue: "Euro", // Umsatz
  invoice: "Receipt", // Rechnung
  payment: "CreditCard", // Zahlung

  // Navigation & Ortung
  location: "MapPin", // Standort
  navigation: "Navigation", // Navigation
  map: "Map", // Karte

  // Zeit & Datum
  time: "Clock", // Uhrzeit
  date: "Calendar", // Datum

  // Status & Benachrichtigungen
  success: "CheckCircle", // Erfolgreich
  warning: "AlertTriangle", // Warnung
  error: "XCircle", // Fehler
  info: "Info", // Information

  // Aktionen
  add: "Plus", // Hinzufügen
  edit: "Edit", // Bearbeiten
  delete: "Trash2", // Löschen
  search: "Search", // Suchen
  filter: "Filter", // Filtern

  // Kommunikation
  chat: "MessageSquare", // Chat
  notification: "Bell", // Benachrichtigung

  // Wetter & Verkehr
  weather: "Cloud", // Wetter
  traffic: "Navigation", // Verkehr

  // Dokumente
  document: "FileText", // Dokument
  pdf: "FileText", // PDF

  // Einstellungen
  settings: "Settings", // Einstellungen
  help: "HelpCircle", // Hilfe
} as const;

/**
 * 6. LAYOUT POSITIONING SYSTEM - Konsistente Platzierung
 */
export const LAYOUT_SYSTEM = {
  // Panel Positions
  sidebar: {
    left: {
      collapsed: "80px",
      expanded: "384px",
    },
    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  },

  header: {
    height: "64px",
    padding: {
      x: "1.5rem",
      y: "1rem",
    },
  },

  footer: {
    height: "48px",
    padding: {
      x: "1.5rem",
      y: "1rem",
    },
  },

  // Content Area
  content: {
    padding: {
      mobile: "1rem",
      tablet: "1.5rem",
      desktop: "2rem",
    },
    maxWidth: "1920px",
  },

  // Standardized Breakpoints
  breakpoints: {
    mobile: "640px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
    ultra: "1536px",
  },
} as const;

/**
 * 7. GRADIENTS SYSTEM - Hero & Subtle Backgrounds (HSL-basiert)
 */
export const GRADIENTS_SYSTEM = {
  hero_primary:
    "linear-gradient(135deg, hsl(225, 31%, 28%) 0%, hsl(225, 31%, 35%) 50%, hsl(225, 31%, 42%) 100%)",
  beige_subtle: "linear-gradient(180deg, rgba(234, 222, 189, 0.05), rgba(234, 222, 189, 0.02))",
  dunkelblau_subtle: "linear-gradient(180deg, rgba(50, 61, 94, 0.05), rgba(50, 61, 94, 0.02))",
} as const;

/**
 * 8. MOTION SYSTEM - Animations & Transitions
 */
export const MOTION_SYSTEM = {
  duration: {
    instant: "100ms",
    fast: "200ms",
    default: "200ms", // V26.1: 300ms → 200ms (snappier)
    slow: "400ms",
    slower: "600ms",
  },
  timing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  transition_sidebar: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_header:
    "left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_footer:
    "left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_content: "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_default: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

/**
 * 9. ICON SYSTEM - Status Badges & Indicators
 */
export const ICON_SYSTEM = {
  status_badge_success_bg: "hsl(142 80% 96%)",
  status_badge_success_border: "hsl(142 71% 45%)",
  status_badge_success_text: "hsl(142 71% 35%)",
  status_badge_warning_bg: "hsl(43 100% 96%)",
  status_badge_warning_border: "hsl(43 96% 56%)",
  status_badge_warning_text: "hsl(43 96% 36%)",
  status_badge_error_bg: "hsl(0 100% 96%)",
  status_badge_error_border: "hsl(0 72% 51%)",
  status_badge_error_text: "hsl(0 72% 41%)",
} as const;

/**
 * 10. SHADOW ELEVATION HELPERS - Quick Access
 */
export const SHADOW_ELEVATION = {
  md: SHADOW_SYSTEM.md,
  lg: SHADOW_SYSTEM.lg,
  xl: SHADOW_SYSTEM.xl,
  "2xl": SHADOW_SYSTEM["2xl"],
} as const;

/**
 * 11. UNIFIED DESIGN TOKENS - Alles in einem
 */
export const UNIFIED_DESIGN_TOKENS = {
  colors: EXTENDED_COLOR_TOKENS,
  border: BORDER_SYSTEM,
  radius: RADIUS_SYSTEM,
  shadow: {
    ...SHADOW_SYSTEM,
    elevation: SHADOW_ELEVATION,
  },
  spacing: SPACING_SYSTEM,
  icons: ICON_MAPPING,
  layout: LAYOUT_SYSTEM,
  gradients: GRADIENTS_SYSTEM,
  motion: MOTION_SYSTEM,
  iconSystem: ICON_SYSTEM,
} as const;

/**
 * 8. HELPER FUNCTIONS - Quick Access
 */
export const getCardStyle = (variant: "standard" | "hover" | "error" = "standard") => {
  const base = {
    borderRadius: RADIUS_SYSTEM.component.card,
    padding: SPACING_SYSTEM.component.card_padding,
    backgroundColor: "hsl(0, 0%, 100%)", // Weiß in HSL
  };

  switch (variant) {
    case "hover":
      return {
        ...base,
        ...BORDER_SYSTEM.styles.card_hover,
        boxShadow: SHADOW_SYSTEM.component.card_hover,
      };
    case "error":
      return {
        ...base,
        border: "2px solid",
        borderColor: BORDER_SYSTEM.color.status_error,
        boxShadow: SHADOW_SYSTEM.component.status_error,
      };
    default:
      return {
        ...base,
        ...BORDER_SYSTEM.styles.card_standard,
        boxShadow: SHADOW_SYSTEM.component.card_standard,
      };
  }
};

export const getPanelStyle = (type: "sidebar" | "info") => {
  return {
    backgroundColor: "hsl(0, 0%, 100%)", // Weiß in HSL
    borderRadius: type === "sidebar" ? "0" : RADIUS_SYSTEM.component.card,
    padding: `${SPACING_SYSTEM.component.panel_padding_y} ${SPACING_SYSTEM.component.panel_padding_x}`,
    boxShadow:
      type === "sidebar"
        ? SHADOW_SYSTEM.component.panel_sidebar
        : SHADOW_SYSTEM.component.panel_info,
  };
};

/**
 * TYPE EXPORTS
 */
export type BorderSystemType = typeof BORDER_SYSTEM;
export type RadiusSystemType = typeof RADIUS_SYSTEM;
export type ShadowSystemType = typeof SHADOW_SYSTEM;
export type SpacingSystemType = typeof SPACING_SYSTEM;
export type IconMappingType = typeof ICON_MAPPING;
export type LayoutSystemType = typeof LAYOUT_SYSTEM;
export type UnifiedDesignTokensType = typeof UNIFIED_DESIGN_TOKENS;

/**
 * USAGE EXAMPLE:
 *
 * import { UNIFIED_DESIGN_TOKENS, getCardStyle } from '@/lib/design-system/unified-design-tokens';
 *
 * // Quick Card Style
 * <div style={getCardStyle('standard')}>
 *   Card Content
 * </div>
 *
 * // Manual Styling
 * <div style={{
 *   border: UNIFIED_DESIGN_TOKENS.border.width.standard,
 *   borderColor: UNIFIED_DESIGN_TOKENS.border.color.beige_20,
 *   borderRadius: UNIFIED_DESIGN_TOKENS.radius.component.card,
 *   boxShadow: UNIFIED_DESIGN_TOKENS.shadow.component.card_standard,
 * }}>
 *   Content
 * </div>
 */
