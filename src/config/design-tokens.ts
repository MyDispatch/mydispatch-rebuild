/* ==================================================================================
   DESIGN TOKENS - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ⚠️ KRITISCH: Dies ist die EINZIGE Quelle für alle Design-Werte!
   
   MIGRATION VON: /lib/design-system/unified-design-tokens-v28.ts
   DATUM: 2025-10-28
   GRUND: Single Source of Truth - Config System V28.1
   
   ALLE Farben, Schatten, Spacing zentral hier!
   ================================================================================== */

/**
 * DESIGN TOKENS V28.1 - PROFESSIONAL MINIMALISM
 * 
 * HSL-basierte Farben für maximale Flexibilität
 */
export const designTokens = {
  /**
   * COLORS - VIBRANT PROFESSIONAL PALETTE V45.0 (Premium leuchtendere Farben)
   */
  colors: {
    // Primary (CTA, Icons, Headlines) - Premium Electric Blue
    primary: {
      DEFAULT: 'hsl(220, 90%, 50%)',        // Premium Electric Blue - Leuchtend!
      hover: 'hsl(220, 95%, 40%)',          // Premium Darker Electric Blue
      light: 'hsl(220, 95%, 97%)',          // Premium Light Blue BG
    },
    
    // Slate Scale (Premium Business Grays) - Aufgehellt für besseren Kontrast
    slate: {
      50: 'hsl(210, 45%, 99%)',             // Premium Canvas
      100: 'hsl(214, 30%, 96%)',            // Premium Border Light
      200: 'hsl(214, 30%, 88%)',            // Premium Border
      300: 'hsl(215, 20%, 65%)',            // Premium Text Tertiary
      600: 'hsl(215, 25%, 35%)',            // Premium Text Secondary
      700: 'hsl(220, 25%, 30%)',            // Premium Darker
      900: 'hsl(222, 45%, 18%)',            // Premium Text Primary
    },
    
    // Accent (Success, Highlights) - Premium leuchtenderes Grün
    accent: {
      DEFAULT: 'hsl(142, 80%, 48%)',        // Premium Success Green - Leuchtend!
      light: 'hsl(142, 85%, 96%)',          // Premium Light Success BG
    },
    
    // Vibrant Color System - Premium leuchtendere UI-Elemente
    vibrant: {
      blue: 'hsl(220, 95%, 60%)',           // Premium Electric Blue
      green: 'hsl(142, 85%, 48%)',          // Premium Vibrant Green
      purple: 'hsl(262, 80%, 65%)',         // Premium Vibrant Purple
      orange: 'hsl(25, 98%, 58%)',          // Premium Vibrant Orange
      red: 'hsl(0, 90%, 65%)',              // Premium Vibrant Red
      teal: 'hsl(175, 85%, 48%)',           // Premium Vibrant Teal
      // NEU: Premium Business Farben
      gold: 'hsl(45, 95%, 55%)',            // Premium Business Gold
      business: 'hsl(215, 25%, 45%)',      // Premium Business Gray
    },
    
    // Status Colors - Premium leuchtender für bessere Sichtbarkeit
    status: {
      success: 'hsl(142, 80%, 48%)',        // Premium Vibrant Success
      warning: 'hsl(38, 95%, 52%)',         // Premium Vibrant Warning
      error: 'hsl(0, 90%, 65%)',            // Premium Vibrant Error
      info: 'hsl(205, 90%, 58%)',           // Premium Vibrant Info
      // NEU: Premium Business Status
      premium: 'hsl(45, 95%, 55%)',         // Premium Gold Status
    },
    
    // Surface
    white: 'hsl(0, 0%, 100%)',              // Premium Card BG
    glass: 'rgba(255, 255, 255, 0.8)',      // Premium Glassmorphism
    
    // Legacy Mappings (Premium optimiert)
    text: {
      primary: 'hsl(222, 45%, 18%)',        // = Premium slate.900
      secondary: 'hsl(215, 25%, 35%)',      // = Premium slate.600
      tertiary: 'hsl(215, 20%, 65%)',       // = Premium slate.300
    },
    bg: {
      primary: 'hsl(0, 0%, 100%)',          // = Premium white
      canvas: 'hsl(210, 45%, 99%)',         // = Premium slate.50
    },
    border: {
      DEFAULT: 'hsl(214, 30%, 88%)',        // = Premium slate.200
      light: 'hsl(214, 30%, 96%)',          // = Premium slate.100
    },
  },
  
  /**
   * SHADOWS - Subtle Elevation System
   */
  shadows: {
    none: 'shadow-none',
    sm: 'shadow-sm',           // 0 1px 2px rgba(0,0,0,0.05)
    base: 'shadow',            // 0 1px 3px rgba(0,0,0,0.1)
    md: 'shadow-md',           // 0 4px 6px rgba(0,0,0,0.1)
    lg: 'shadow-lg',           // 0 10px 15px rgba(0,0,0,0.1)
    xl: 'shadow-xl',           // 0 20px 25px rgba(0,0,0,0.1)
    '2xl': 'shadow-2xl',       // 0 25px 50px rgba(0,0,0,0.25)
    glow: '0 0 0 3px rgba(147, 51, 234, 0.1)',  // Violet Ring
  },
  
  /**
   * SPACING - Consistent Spacing Scale
   */
  spacing: {
    xs: '4px',    // gap-1, p-1
    sm: '8px',    // gap-2, p-2
    md: '16px',   // gap-4, p-4
    lg: '24px',   // gap-6, p-6
    xl: '32px',   // gap-8, p-8
    '2xl': '48px', // gap-12, p-12
  },
  
  /**
   * BORDER RADIUS - Flat Design (minimal)
   */
  radius: {
    none: '0',
    sm: '0.125rem',    // 2px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    full: '9999px',
  },
  
  /**
   * Z-INDEX - Hierarchical Layer System
   */
  zIndex: {
    modal: 100,
    cookieConsent: 60,
    mobileHeader: 50,
    sidebar: 40,
    header: 30,
    quickActionsPanel: 25, // Zwischen Footer und Header
    footer: 20,
    content: 10,
    base: 0,
  },
} as const;

/**
 * HELPER: Get Color by Path
 * @example getColor('primary.DEFAULT') → 'hsl(215, 16%, 47%)'
 */
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return typeof value === 'string' ? value : '';
};

/**
 * HELPER: Get Shadow Class
 * @example getShadow('lg') → 'shadow-lg'
 */
export const getShadow = (key: keyof typeof designTokens.shadows): string => {
  return designTokens.shadows[key];
};

// Export Type
export type DesignTokens = typeof designTokens;

export default designTokens;
