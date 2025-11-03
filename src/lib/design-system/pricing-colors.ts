/* ==================================================================================
   PRICING COLOR SYSTEM V26.0 - KERNFARBEN (HSL-BASIERT)
   ==================================================================================
   ✅ Zentrale Farbdefinitionen für alle Pricing/Marketing-Seiten
   ✅ 100% HSL-BASIERT (KEINE HEX-FARBEN!)
   ✅ NIEMALS direkt ändern - nur erweitern
   ✅ Verwendung: import { KERNFARBEN } from '@/lib/design-system/pricing-colors'
   ================================================================================== */

export const KERNFARBEN = {
  dunkelblau: 'hsl(225, 31%, 28%)',        // #323D5E → HSL
  beige: 'hsl(42, 49%, 78%)',              // #EADEBD → HSL
  weiss: 'hsl(0, 0%, 100%)',               // #FFFFFF → HSL
  canvas: 'hsl(220, 14%, 98%)',            // #F9FAFB → HSL (gray-50)
  text_primary: 'hsl(220, 13%, 9%)',       // #111827 → HSL (gray-900)
  text_secondary: 'hsl(217, 19%, 27%)',    // #374151 → HSL (gray-700)
  text_tertiary: 'hsl(220, 9%, 46%)',      // #6B7280 → HSL (gray-500)
  border_neutral: 'hsl(220, 13%, 91%)',    // #E5E7EB → HSL (gray-200)
  border_neutral_soft: 'rgba(229, 231, 235, 0.8)',
} as const;

export type KernfarbenType = typeof KERNFARBEN;
