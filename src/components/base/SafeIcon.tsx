/* ==================================================================================
   SAFE ICON COMPONENT - CI-KONFORME ICONS
   ==================================================================================
   ✅ ERZWINGT text-foreground auf allen Icons
   ✅ VERHINDERT Ampelfarben auf Icons (Design-Regel)
   ✅ TypeScript-Validierung für erlaubte Farben
   ==================================================================================
   NUTZUNG: Ersetze <Icon /> durch <SafeIcon icon={Icon} />
   ================================================================================== */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ICON_COLORS, isValidIconColor } from '@/lib/design-system';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

// ==================================================================================
// TYPES
// ==================================================================================

type AllowedIconColor = 
  | 'text-foreground' 
  | 'text-muted-foreground' 
  | 'default'    // Alias für text-foreground
  | 'muted';     // Alias für text-muted-foreground

interface SafeIconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: AllowedIconColor;
  className?: string;
  onClick?: () => void;
}

// ==================================================================================
// SIZE MAPPING
// ==================================================================================

const SIZE_MAP = {
  xs: 'h-4 w-4',      // 16px (Minimum Touch Target)
  sm: 'h-4 w-4',      // 16px (Standard)
  md: 'h-5 w-5',      // 20px
  lg: 'h-6 w-6',      // 24px
  xl: 'h-8 w-8',      // 32px
} as const;

// ==================================================================================
// COMPONENT
// ==================================================================================

export function SafeIcon({
  icon: Icon,
  size = 'sm',
  color = 'text-foreground',
  className,
  onClick,
}: SafeIconProps) {
  
  // Map aliases to full class names
  const colorMap: Record<AllowedIconColor, string> = {
    'default': 'text-foreground',
    'text-foreground': 'text-foreground',
    'muted': 'text-muted-foreground',
    'text-muted-foreground': 'text-muted-foreground',
  };
  
  const mappedColor = colorMap[color] || 'text-foreground';
  
  // Validierung: Prüfe ob Farbe erlaubt ist (DEV-only)
  if (import.meta.env.DEV && !isValidIconColor(color)) {
    logger.warn(
      `SafeIcon: Unerlaubte Farbe "${color}"`,
      { allowedColors: ['default', 'muted', 'text-foreground', 'text-muted-foreground'] }
    );
  }
  
  // Prüfe ob className verbotene Farben enthält (DEV-only)
  if (import.meta.env.DEV && className) {
    const forbiddenColors = [
      'text-status-success',
      'text-status-error',
      'text-status-warning',
      'text-green-',
      'text-red-',
      'text-yellow-',
      'text-blue-',
    ];
    
    const hasForbiddenColor = forbiddenColors.some(forbidden => 
      className.includes(forbidden)
    );
    
    if (hasForbiddenColor) {
      logger.warn(
        `SafeIcon: Verbotene Farbe in className`,
        { className, reason: 'Ampelfarben verboten auf Icons' }
      );
    }
  }
  
  return (
    <Icon
      className={cn(
        SIZE_MAP[size],
        mappedColor,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      aria-hidden={!onClick}
    />
  );
}

// ==================================================================================
// EXPORT HELPER FUNCTIONS
// ==================================================================================

/**
 * Erstellt ein SafeIcon mit Standard-Einstellungen
 */
export const createSafeIcon = (icon: LucideIcon, size: SafeIconProps['size'] = 'sm') => {
  return <SafeIcon icon={icon} size={size} />;
};

/**
 * Prüft ob ein Icon-Element CI-konform ist
 */
export const validateIconElement = (element: React.ReactElement): boolean => {
  const className = element.props?.className || '';
  
  const forbiddenColors = [
    'text-status-success',
    'text-status-error',
    'text-status-warning',
    'text-green-',
    'text-red-',
    'text-yellow-',
    'text-blue-',
  ];
  
  return !forbiddenColors.some(forbidden => className.includes(forbidden));
};
