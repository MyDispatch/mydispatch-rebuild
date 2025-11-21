/**
 * ========================================================================
 * DYNAMIC ICON COMPONENT V18.3.28
 * ========================================================================
 * 
 * Zentrale, typsichere Icon-Komponente für MyDispatch.
 * 
 * FEATURES:
 * - Vollständige Lucide-Icon-Bibliothek (tree-shakeable)
 * - TypeScript-Unterstützung für alle Icon-Namen
 * - Konsistente Größen nach Design-System
 * - Automatische Farbverwaltung
 * 
 * VERWENDUNG:
 * ```tsx
 * import { Icon } from '@/components/design-system';
 * 
 * // Standard-Icon
 * <Icon name="Camera" />
 * 
 * // Mit Custom-Größe und Farbe
 * <Icon name="User" className="h-6 w-6 text-primary" />
 * 
 * // In Button
 * <Button>
 *   <Icon name="Plus" className="mr-2" />
 *   Hinzufügen
 * </Button>
 * ```
 * ========================================================================
 */

import type { LucideProps } from 'lucide-react';
import { icons } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

/**
 * Icon-Komponenten-Props
 * Extends LucideProps für volle Kompatibilität mit Lucide React
 */
interface IconProps extends Omit<LucideProps, 'ref'> {
  /** Icon-Name (typsicher via Lucide) */
  name: keyof typeof icons;
  /** Custom CSS-Klassen (wird mit defaults merged) */
  className?: string;
}

/**
 * Dynamic Icon Component
 * 
 * Rendert ein Lucide-Icon basierend auf dem Namen.
 * Tree-shaking-safe durch ES-Modules.
 * 
 * @example
 * <Icon name="Settings" className="text-foreground" />
 */
export const Icon = ({ name, className, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  
  if (!LucideIcon) {
    // Fallback bei ungültigem Icon-Namen (DEV-only warning)
    logger.warn(`[Icon] Icon "${name}" nicht gefunden`, { component: 'Icon', iconName: name });
    return null;
  }
  
  return (
    <LucideIcon 
      className={cn(
        "h-4 w-4", // Design-System-Standard: 16px
        className
      )} 
      {...props}
    />
  );
};

/**
 * Icon-Größen-Presets
 * Gemäß Design-System V18.3.28
 */
export const ICON_SIZES = {
  xs: "h-3 w-3",   // 12px - Inline-Text, Badges
  sm: "h-4 w-4",   // 16px - Buttons, Listen (Standard)
  md: "h-5 w-5",   // 20px - Cards, Navigation
  lg: "h-6 w-6",   // 24px - Headers, Hero
  xl: "h-8 w-8",   // 32px - Large Actions
  "2xl": "h-10 w-10", // 40px - Feature Icons
} as const;

/**
 * Icon mit vordefinierter Größe
 * 
 * @example
 * <IconWithSize name="User" size="lg" />
 */
interface IconWithSizeProps extends Omit<IconProps, 'className'> {
  size?: keyof typeof ICON_SIZES;
  className?: string;
}

export const IconWithSize = ({ 
  size = 'sm', 
  className, 
  ...props 
}: IconWithSizeProps) => {
  return (
    <Icon 
      className={cn(ICON_SIZES[size], className)} 
      {...props} 
    />
  );
};
