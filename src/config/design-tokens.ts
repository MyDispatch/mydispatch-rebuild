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
   * COLORS - Professional Gray-Blue Palette
   */
  colors: {
    // Primary (CTA, Icons, Headlines) - Professional Gray-Blue
    primary: {
      DEFAULT: 'hsl(215, 16%, 47%)',        // Gray-Blue (dezent)
      hover: 'hsl(215, 20%, 40%)',          // Darker Gray-Blue
      light: 'hsl(215, 25%, 96%)',          // Very Light Gray BG
    },
    
    // Slate Scale (Neutral Grays)
    slate: {
      50: 'hsl(210, 40%, 98%)',             // Canvas
      100: 'hsl(214, 32%, 91%)',            // Border Light
      200: 'hsl(214, 32%, 83%)',            // Border
      300: 'hsl(215, 20%, 65%)',            // Text Tertiary
      600: 'hsl(215, 25%, 27%)',            // Text Secondary
      700: 'hsl(220, 25%, 25%)',            // Darker
      900: 'hsl(222, 47%, 11%)',            // Text Primary
    },
    
    // Accent (Success, Highlights)
    accent: {
      DEFAULT: 'hsl(142, 71%, 45%)',        // Success Green
      light: 'hsl(142, 76%, 96%)',          // Success BG
    },
    
    // Surface
    white: 'hsl(0, 0%, 100%)',              // Card BG
    glass: 'rgba(255, 255, 255, 0.7)',      // Glassmorphism
    
    // Legacy Mappings (für einfachere Migration)
    text: {
      primary: 'hsl(222, 47%, 11%)',        // = slate.900
      secondary: 'hsl(215, 25%, 27%)',      // = slate.600
      tertiary: 'hsl(215, 20%, 65%)',       // = slate.300
    },
    bg: {
      primary: 'hsl(0, 0%, 100%)',          // = white
      canvas: 'hsl(210, 40%, 98%)',         // = slate.50
    },
    border: {
      DEFAULT: 'hsl(214, 32%, 83%)',        // = slate.200
      light: 'hsl(214, 32%, 91%)',          // = slate.100
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
