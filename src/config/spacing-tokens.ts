/* ==================================================================================
   SPACING TOKENS - Global Spacing System
   ==================================================================================
   Konsistentes Spacing für das gesamte Design System
   ================================================================================== */

/**
 * Base Spacing Units (in rem)
 * 1rem = 16px bei Standard-Browser-Einstellungen
 */
export const spacing = {
  // Atomic Spacing Units
  xs: '0.25rem',    // 4px - Minimal spacing
  sm: '0.5rem',     // 8px - Small spacing
  md: '1rem',       // 16px - Medium spacing (base)
  lg: '1.5rem',     // 24px - Large spacing
  xl: '2rem',       // 32px - Extra large spacing
  '2xl': '3rem',    // 48px - Double extra large
  '3xl': '4rem',    // 64px - Triple extra large
  '4xl': '6rem',    // 96px - Quadruple extra large
  
  // Component-Specific Spacing
  button: {
    paddingX: '1.5rem',     // 24px horizontal
    paddingY: '0.75rem',    // 12px vertical
    gap: '0.5rem',          // 8px between icon and text
  },
  
  card: {
    padding: '1.5rem',      // 24px all sides
    paddingMobile: '1rem',  // 16px mobile
    gap: '1rem',            // 16px between elements
  },
  
  navigation: {
    itemPaddingX: '1rem',   // 16px horizontal
    itemPaddingY: '0.75rem', // 12px vertical
    itemGap: '0.75rem',     // 12px between icon and text
    sectionGap: '0.5rem',   // 8px between nav items
  },
  
  form: {
    fieldGap: '1.5rem',     // 24px between form fields
    labelGap: '0.5rem',     // 8px between label and input
    inputPaddingX: '1rem',  // 16px horizontal
    inputPaddingY: '0.75rem', // 12px vertical
  },
  
  modal: {
    padding: '2rem',        // 32px all sides
    paddingMobile: '1.5rem', // 24px mobile
    headerGap: '1rem',      // 16px below header
    footerGap: '1.5rem',    // 24px above footer
  },
  
  section: {
    paddingY: '4rem',       // 64px vertical
    paddingYMobile: '2rem', // 32px vertical mobile
    paddingX: '2rem',       // 32px horizontal
    paddingXMobile: '1rem', // 16px horizontal mobile
  },
} as const;

/**
 * Responsive Spacing Multipliers
 */
export const responsiveMultipliers = {
  mobile: 0.75,   // 75% of desktop spacing
  tablet: 0.875,  // 87.5% of desktop spacing
  desktop: 1,     // 100% base spacing
} as const;

/**
 * Helper function to get responsive spacing
 */
export function getResponsiveSpacing(
  baseSpacing: keyof typeof spacing | string,
  breakpoint: keyof typeof responsiveMultipliers = 'desktop'
): string {
  const value = typeof baseSpacing === 'string' && baseSpacing in spacing 
    ? spacing[baseSpacing as keyof typeof spacing]
    : baseSpacing;
    
  if (typeof value !== 'string') return '1rem';
  
  const numValue = parseFloat(value);
  const unit = value.replace(/[\d.]/g, '');
  const multiplier = responsiveMultipliers[breakpoint];
  
  return `${numValue * multiplier}${unit}`;
}

/**
 * Tailwind-compatible spacing classes
 */
export const spacingClasses = {
  // Padding
  'p-xs': 'p-1',      // 4px
  'p-sm': 'p-2',      // 8px
  'p-md': 'p-4',      // 16px
  'p-lg': 'p-6',      // 24px
  'p-xl': 'p-8',      // 32px
  'p-2xl': 'p-12',    // 48px
  
  // Padding X-axis
  'px-xs': 'px-1',    // 4px
  'px-sm': 'px-2',    // 8px
  'px-md': 'px-4',    // 16px
  'px-lg': 'px-6',    // 24px
  'px-xl': 'px-8',    // 32px
  'px-2xl': 'px-12',  // 48px
  
  // Padding Y-axis
  'py-xs': 'py-1',    // 4px
  'py-sm': 'py-2',    // 8px
  'py-md': 'py-4',    // 16px
  'py-lg': 'py-6',    // 24px
  'py-xl': 'py-8',    // 32px
  'py-2xl': 'py-12',  // 48px
  
  // Gap
  'gap-xs': 'gap-1',  // 4px
  'gap-sm': 'gap-2',  // 8px
  'gap-md': 'gap-4',  // 16px
  'gap-lg': 'gap-6',  // 24px
  'gap-xl': 'gap-8',  // 32px
  'gap-2xl': 'gap-12', // 48px
  
  // Margin
  'm-xs': 'm-1',      // 4px
  'm-sm': 'm-2',      // 8px
  'm-md': 'm-4',      // 16px
  'm-lg': 'm-6',      // 24px
  'm-xl': 'm-8',      // 32px
  'm-2xl': 'm-12',    // 48px
} as const;

export default spacing;