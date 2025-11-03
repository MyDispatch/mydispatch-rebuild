/* ==================================================================================
   PORTAL THEMES - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ⚠️ KRITISCH: Einheitliches Theming für alle Portale!
   
   PHASE 6: Portal-Specific Harmonization
   ================================================================================== */

export type PortalType = 'entrepreneur' | 'customer' | 'driver';

export interface PortalTheme {
  /** Portal Name */
  name: string;
  
  /** Primary Color */
  primaryColor: string;
  
  /** Accent Color */
  accentColor: string;
  
  /** Background Color */
  backgroundColor: string;
  
  /** Text Color */
  textColor: string;
  
  /** Border Color */
  borderColor: string;
  
  /** Layout Type */
  layout: 'sidebar' | 'minimal' | 'mobile-first';
  
  /** Button Styles */
  buttonStyle: {
    default: string;
    hover: string;
    active: string;
  };
  
  /** Card Styles */
  cardStyle: {
    background: string;
    border: string;
    shadow: string;
  };
}

// ============================================================================
// PORTAL THEMES
// ============================================================================

export const PORTAL_THEMES: Record<PortalType, PortalTheme> = {
  entrepreneur: {
    name: 'Unternehmer-Dashboard',
    primaryColor: '#3B82F6', // Blue
    accentColor: '#10B981', // Green
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    borderColor: '#E5E7EB',
    layout: 'sidebar',
    buttonStyle: {
      default: 'bg-primary hover:bg-primary-600 text-white',
      hover: 'hover:bg-primary-600',
      active: 'active:bg-primary-700',
    },
    cardStyle: {
      background: 'bg-white',
      border: 'border border-slate-200',
      shadow: 'shadow-sm hover:shadow-md',
    },
  },
  
  customer: {
    name: 'Kunden-Portal',
    primaryColor: '#EADEBD', // Beige (configurable per company!)
    accentColor: '#D4AF37', // Gold
    backgroundColor: '#F9FAFB',
    textColor: '#1F2937',
    borderColor: '#D1D5DB',
    layout: 'minimal',
    buttonStyle: {
      default: 'bg-[#EADEBD] hover:bg-[#D4C9A8] text-gray-900',
      hover: 'hover:bg-[#D4C9A8]',
      active: 'active:bg-[#C4B998]',
    },
    cardStyle: {
      background: 'bg-white',
      border: 'border border-[#EADEBD]',
      shadow: 'shadow hover:shadow-lg',
    },
  },
  
  driver: {
    name: 'Fahrer-Portal',
    primaryColor: '#8B5CF6', // Purple
    accentColor: '#EC4899', // Pink
    backgroundColor: '#F3F4F6',
    textColor: '#111827',
    borderColor: '#E5E7EB',
    layout: 'mobile-first',
    buttonStyle: {
      default: 'bg-purple-600 hover:bg-purple-700 text-white',
      hover: 'hover:bg-purple-700',
      active: 'active:bg-purple-800',
    },
    cardStyle: {
      background: 'bg-white',
      border: 'border border-purple-200',
      shadow: 'shadow-md hover:shadow-xl',
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
    background: theme.backgroundColor,
    text: theme.textColor,
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
    classes.push(`bg-[${theme.backgroundColor}]`);
  }
  
  return classes.join(' ');
};

/**
 * Check if Portal Theme is Dark Mode
 */
export const isPortalDarkMode = (portal: PortalType): boolean => {
  const theme = PORTAL_THEMES[portal];
  // Simple heuristic: check if background is dark
  return theme.backgroundColor.toLowerCase().includes('dark') || 
         theme.backgroundColor === '#000000' ||
         theme.backgroundColor === '#111827';
};
