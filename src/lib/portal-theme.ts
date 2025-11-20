/* ==================================================================================
   PORTAL THEME SYSTEM V1.0 - SINGLE SOURCE OF TRUTH
   ==================================================================================
   Zentrales Theme-Management für Portal, Landingpage und Branding
   - Type-Safe Theme-Objekte
   - Default-Fallbacks (CI-konform)
   - CSS-Variable-Generation
   - HSL-Konvertierung
   ================================================================================== */

import { UNIFIED_DESIGN_TOKENS } from "./design-system/unified-design-tokens";

/**
 * Default CI-Farben (Fallback wenn keine primary_color gesetzt)
 */
export const DEFAULT_PORTAL_THEME = {
  primary_color: "#EADEBD", // Beige (CI)
  primary_hsl: "40 31% 88%", // HSL-Version für CSS Variables
} as const;

/**
 * Portal Theme Interface
 */
export interface PortalTheme {
  companyId: string;
  companyName: string;
  primaryColor: string;
  primaryColorHsl: string;
  logoUrl: string | null;
  landingpageTitle?: string;
  landingpageHeroText?: string;
  landingpageDescription?: string;
}

/**
 * Konvertiert Hex-Farbe zu HSL (für CSS Variables)
 * @param hex - Hex-Farbe (z.B. "#EADEBD")
 * @returns HSL-String (z.B. "40 31% 88%")
 */
export function hexToHsl(hex: string): string {
  // Entferne # falls vorhanden
  hex = hex.replace("#", "");

  // Konvertiere zu RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}

/**
 * Erstellt ein PortalTheme-Objekt aus Company-Daten
 * @param companyData - Partial Company-Daten aus Supabase
 * @returns PortalTheme mit Defaults
 */
export function createPortalTheme(companyData: {
  id: string;
  name: string;
  primary_color?: string | null;
  logo_url?: string | null;
  landingpage_title?: string | null;
  landingpage_hero_text?: string | null;
  landingpage_description?: string | null;
}): PortalTheme {
  const primaryColor = companyData.primary_color || DEFAULT_PORTAL_THEME.primary_color;

  return {
    companyId: companyData.id,
    companyName: companyData.name,
    primaryColor,
    primaryColorHsl: hexToHsl(primaryColor),
    logoUrl: companyData.logo_url || null,
    landingpageTitle: companyData.landingpage_title || undefined,
    landingpageHeroText: companyData.landingpage_hero_text || undefined,
    landingpageDescription: companyData.landingpage_description || undefined,
  };
}

/**
 * Generiert CSS-Variablen für Portal-Theme
 * @param theme - PortalTheme
 * @returns CSS-Variables-Objekt für inline styles
 */
export function generatePortalThemeVars(theme: PortalTheme): Record<string, string> {
  return {
    "--portal-primary": theme.primaryColorHsl,
    "--portal-primary-rgb": theme.primaryColor,
  };
}

/**
 * Validiert Hex-Farbe
 * @param color - Zu validierende Farbe
 * @returns true wenn valide Hex-Farbe
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Legacy-Support: Gibt primary_color direkt zurück (für Rückwärtskompatibilität)
 * @param companyData - Company-Daten
 * @returns primary_color mit Fallback
 */
export function getPortalPrimaryColor(companyData: { primary_color?: string | null }): string {
  return companyData.primary_color || DEFAULT_PORTAL_THEME.primary_color;
}
