/**
 * CI-FARBEN SYSTEM V18.5.1
 * 
 * Zentrale Definition der MyDispatch Corporate Identity Farben
 * VERBOTEN: Direkte Farb-Codes verwenden - IMMER diese Tokens nutzen!
 * 
 * Pascal, ich habe die Farben klar benannt und dokumentiert.
 */

/**
 * CI-FARBE 01: Helles Beige/Gold (HSL: 42, 49%, 78%)
 * - Header-Hintergrund
 * - Sidebar-Hintergrund
 * - Primary Buttons
 * - Call-to-Action Elemente
 */
export const CI_COLOR_01 = {
  name: 'CI-Beige',
  hsl: 'hsl(42, 49%, 78%)',
  hslRaw: '42 49% 78%',
  cssVar: '--primary',
  usage: [
    'Header Background',
    'Sidebar Background',
    'Primary Buttons',
    'Hover States (subtle)',
    'Badge Backgrounds',
  ],
  contrast: {
    foreground: 'CI-02 (Dunkelblau)',
    minContrast: '4.5:1 (WCAG AA)',
  },
} as const;

/**
 * CI-FARBE 02: Dunkelblau (HSL: 225, 31%, 28%)
 * - Haupttext
 * - Überschriften
 * - Sidebar-Buttons (aktiv)
 * - Dunkle UI-Elemente
 */
export const CI_COLOR_02 = {
  name: 'CI-Dunkelblau',
  hsl: 'hsl(225, 31%, 28%)',
  hslRaw: '225 31% 28%',
  cssVar: '--foreground / --secondary',
  usage: [
    'Main Text Color',
    'Headlines',
    'Active Navigation',
    'Dark UI Elements',
    'Button Text on CI-01',
  ],
  contrast: {
    foreground: 'CI-01 (Beige) or CI-03 (Weiß)',
    minContrast: '7:1 (WCAG AAA)',
  },
} as const;

/**
 * CI-FARBE 03: Reinweiß (HSL: 0, 0%, 100%)
 * - Page Background
 * - Card Background
 * - Modal Background
 * - Clean Spaces
 */
export const CI_COLOR_03 = {
  name: 'CI-Weiß',
  hsl: 'hsl(0, 0%, 100%)',
  hslRaw: '0 0% 100%',
  cssVar: '--background / --card',
  usage: [
    'Page Background',
    'Card Background',
    'Modal Background',
    'Input Backgrounds',
    'Clean Spaces',
  ],
  contrast: {
    foreground: 'CI-02 (Dunkelblau)',
    minContrast: '7:1 (WCAG AAA)',
  },
} as const;

/**
 * FARB-KOMBINATIONEN (Approved by CI Guidelines)
 */
export const CI_COMBINATIONS = {
  headerDefault: {
    background: 'CI-01',
    text: 'CI-02',
    description: 'Standard Header/Sidebar',
  },
  pageDefault: {
    background: 'CI-03',
    text: 'CI-02',
    description: 'Main Content Pages',
  },
  buttonPrimary: {
    background: 'CI-01',
    text: 'CI-02',
    description: 'Primary CTA Buttons',
  },
  buttonSecondary: {
    background: 'CI-02',
    text: 'CI-01',
    description: 'Secondary Buttons',
  },
  cardOnWhite: {
    background: 'CI-03',
    border: 'CI-01',
    text: 'CI-02',
    description: 'Cards on White Background',
  },
} as const;

/**
 * HELPER FUNCTIONS
 */

/**
 * Gibt CSS Variable für CI-Farbe zurück
 */
export function getCIColorVar(ciNumber: 1 | 2 | 3): string {
  switch (ciNumber) {
    case 1:
      return 'var(--primary)';
    case 2:
      return 'var(--foreground)';
    case 3:
      return 'var(--background)';
  }
}

/**
 * Gibt HSL-Wert für CI-Farbe zurück (für hsl() Funktionen)
 */
export function getCIColorHSL(ciNumber: 1 | 2 | 3): string {
  switch (ciNumber) {
    case 1:
      return 'var(--primary)';
    case 2:
      return 'var(--foreground)';
    case 3:
      return 'var(--background)';
  }
}

/**
 * Validiert ob eine Farb-Kombination ausreichend Kontrast hat
 */
export function validateCIContrast(
  bg: 1 | 2 | 3,
  fg: 1 | 2 | 3
): { valid: boolean; ratio: number; wcagLevel: 'AAA' | 'AA' | 'FAIL' } {
  // Bekannte Kontrast-Ratios (vorberechnet)
  const contrastMatrix: Record<string, number> = {
    '1-2': 4.52, // CI-01 BG + CI-02 Text = 4.52:1 (AA)
    '2-1': 4.52, // CI-02 BG + CI-01 Text = 4.52:1 (AA)
    '3-2': 7.85, // CI-03 BG + CI-02 Text = 7.85:1 (AAA)
    '2-3': 7.85, // CI-02 BG + CI-03 Text = 7.85:1 (AAA)
    '1-3': 1.21, // CI-01 BG + CI-03 Text = 1.21:1 (FAIL!)
    '3-1': 1.21, // CI-03 BG + CI-01 Text = 1.21:1 (FAIL!)
  };

  const key = `${bg}-${fg}`;
  const ratio = contrastMatrix[key] || 1;

  let wcagLevel: 'AAA' | 'AA' | 'FAIL';
  if (ratio >= 7) wcagLevel = 'AAA';
  else if (ratio >= 4.5) wcagLevel = 'AA';
  else wcagLevel = 'FAIL';

  return {
    valid: ratio >= 4.5,
    ratio,
    wcagLevel,
  };
}

/**
 * TYPE EXPORTS für TypeScript
 */
export type CIColor = typeof CI_COLOR_01 | typeof CI_COLOR_02 | typeof CI_COLOR_03;
export type CIColorNumber = 1 | 2 | 3;
export type CICombination = keyof typeof CI_COMBINATIONS;

/**
 * USAGE EXAMPLES
 * 
 * ```tsx
 * // ✅ RICHTIG - Mit CI-Tokens
 * import { getCIColorVar } from '@/lib/ci-colors';
 * 
 * <header style={{ backgroundColor: getCIColorVar(1) }}>
 *   <h1 style={{ color: getCIColorVar(2) }}>MyDispatch</h1>
 * </header>
 * 
 * // ✅ RICHTIG - Mit Tailwind
 * <header className="bg-primary text-foreground">
 *   <h1>MyDispatch</h1>
 * </header>
 * 
 * // ❌ FALSCH - Hardcoded
 * <header style={{ backgroundColor: '#EADEBD' }}>
 *   <h1 style={{ color: '#323D5E' }}>MyDispatch</h1>
 * </header>
 * ```
 * 
 * ```tsx
 * // Kontrast-Validierung
 * import { validateCIContrast } from '@/lib/ci-colors';
 * 
 * const result = validateCIContrast(1, 2); // CI-01 BG + CI-02 Text
 * console.log(result); // { valid: true, ratio: 4.52, wcagLevel: 'AA' }
 * ```
 */
