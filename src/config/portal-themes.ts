/* ==================================================================================
   PORTAL THEMES - SINGLE SOURCE OF TRUTH (V28.1 DESIGN TOKEN SYSTEM)
   ==================================================================================
   ✅ VOLLSTÄNDIG TOKENISIERT: Alle Farben nutzen Tailwind Design Tokens
   ✅ KEINE HARDCODIERTEN FARBEN: Alle Hex-Werte entfernt
   ✅ KONSISTENT: Einheitliches Theming für alle Portale
   
   PHASE 6: Portal-Specific Harmonization - Design Token Migration
   ================================================================================== */

export type PortalType = 'entrepreneur' | 'customer' | 'driver';

export interface PortalTheme {
  /** Portal Name */
  name: string;
  
  /** Primary Color (Tailwind Token) */
  primaryColor: string;
  
  /** Accent Color (Tailwind Token) */
  accentColor: string;
  
  /** Background Color (Tailwind Token) */
  backgroundColor: string;
  
  /** Text Color (Tailwind Token) */
  textColor: string;
  
  /** Border Color (Tailwind Token) */
  borderColor: string;
  
  /** Layout Type */
  layout: 'sidebar' | 'minimal' | 'mobile-first';
  
  /** Button Styles (Tailwind Classes) */
  buttonStyle: {
    default: string;
    hover: string;
    active: string;
  };
  
  /** Card Styles (Tailwind Classes) */
  cardStyle: {
    background: string;
    border: string;
    shadow: string;
  };
}

// ============================================================================
// PORTAL THEMES - V28.1 DESIGN TOKEN SYSTEM
// ============================================================================

export const PORTAL_THEMES: Record<PortalType, PortalTheme> = {
  entrepreneur: {
    name: 'Unternehmer-Dashboard',
    primaryColor: 'primary', // Uses --primary CSS variable
    accentColor: 'status-success', // Uses --status-success CSS variable
    backgroundColor: 'background', // Uses --background CSS variable
    textColor: 'foreground', // Uses --foreground CSS variable
    borderColor: 'border', // Uses --border CSS variable
    layout: 'sidebar',
    buttonStyle: {
      default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      hover: 'hover:bg-primary/90',
      active: 'active:bg-primary/80',
    },
    cardStyle: {
      background: 'bg-card',
      border: 'border border-border',
      shadow: 'shadow-card hover:shadow-card-hover',
    },
  },
  
  customer: {
    name: 'Kunden-Portal',
    primaryColor: 'portal-customer', // Uses portal-customer token (beige)
    accentColor: 'portal-customer-hover', // Uses portal-customer-hover token
    backgroundColor: 'background', // Uses --background CSS variable
    textColor: 'foreground', // Uses --foreground CSS variable
    borderColor: 'border', // Uses --border CSS variable
    layout: 'minimal',
    buttonStyle: {
      default: 'bg-portal-customer hover:bg-portal-customer-hover text-gray-900',
      hover: 'hover:bg-portal-customer-hover',
      active: 'active:bg-portal-customer-hover/90',
    },
    cardStyle: {
      background: 'bg-card',
      border: 'border border-portal-customer',
      shadow: 'shadow-card hover:shadow-card-hover',
    },
  },
  
  driver: {
    name: 'Fahrer-Portal',
    primaryColor: 'portal-driver', // Uses portal-driver token (purple)
    accentColor: 'portal-driver-hover', // Uses portal-driver-hover token
    backgroundColor: 'background', // Uses --background CSS variable
    textColor: 'foreground', // Uses --foreground CSS variable
    borderColor: 'border', // Uses --border CSS variable
    layout: 'mobile-first',
    buttonStyle: {
      default: 'bg-portal-driver hover:bg-portal-driver-hover text-white',
      hover: 'hover:bg-portal-driver-hover',
      active: 'active:bg-portal-driver-hover/90',
    },
    cardStyle: {
      background: 'bg-card',
      border: 'border border-border',
      shadow: 'shadow-card hover:shadow-card-hover',
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Portal Theme
 */
export const getPortalTheme = (portal: PortalType): PortalTheme => {
  return PORTAL_THEMES[portal];
};

/**
 * Get Portal Theme Classes
 * Returns Tailwind classes for easy use in components
 */
export const getPortalThemeClasses = (portal: PortalType) => {
  const theme = PORTAL_THEMES[portal];
  
  return {
    button: {
      primary: theme.buttonStyle.default,
      outline: `border-2 ${theme.cardStyle.border} ${theme.buttonStyle.hover}`,
      ghost: `bg-transparent ${theme.buttonStyle.hover}`,
    },
    card: `${theme.cardStyle.background} ${theme.cardStyle.border} ${theme.cardStyle.shadow} rounded-lg`,
    background: `bg-${theme.backgroundColor}`,
    text: `text-${theme.textColor}`,
  };
};

/**
 * Apply Portal Theme to Component
 * 
 * @example
 * const themeClasses = applyPortalTheme('customer', {
 *   button: true,
 *   card: false,
 * });
 */
export const applyPortalTheme = (
  portal: PortalType,
  options: {
    button?: boolean;
    card?: boolean;
    background?: boolean;
  } = {}
): string => {
  const theme = PORTAL_THEMES[portal];
  const classes: string[] = [];
  
  if (options.button) {
    classes.push(theme.buttonStyle.default);
  }
  
  if (options.card) {
    classes.push(theme.cardStyle.background, theme.cardStyle.border, theme.cardStyle.shadow);
  }
  
  if (options.background) {
    classes.push(`bg-${theme.backgroundColor}`);
  }
  
  return classes.join(' ');
};

/**
 * Check if Portal Theme is Dark Mode
 */
export const isPortalDarkMode = (portal: PortalType): boolean => {
  // Since we're using design tokens, check against known dark themes
  // This is a simplified check - in production, you'd check the actual CSS variable values
  return false; // All current portals use light mode
};
