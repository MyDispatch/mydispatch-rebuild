/* ==================================================================================
   ENHANCED CARD COMPONENT - CI-KONFORM & KONSISTENT
   ==================================================================================
   ✅ Nutzt Design-Tokens aus design-tokens.ts
   ✅ Konsistentes Spacing (8px Grid)
   ✅ Variants: Standard, Hover, Interactive
   ==================================================================================
   ERSETZT: Card-Component für neue Features
   ================================================================================== */

import React from 'react';
import { CARD_STYLES } from '@/lib/design-system';
import { cn } from '@/lib/utils';

// ==================================================================================
// TYPES
// ==================================================================================

interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hover' | 'interactive';
  compact?: boolean;
  className?: string;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// ==================================================================================
// MAIN COMPONENT
// ==================================================================================

export function EnhancedCard({
  children,
  variant = 'default',
  compact = false,
  className,
  onClick,
}: EnhancedCardProps) {
  const variantClass = {
    default: '',
    hover: CARD_STYLES.hover,
    interactive: CARD_STYLES.interactive,
  }[variant];

  return (
    <div
      className={cn(
        CARD_STYLES.base,
        variantClass,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// ==================================================================================
// SUB-COMPONENTS
// ==================================================================================

export function EnhancedCardHeader({ children, compact, className }: CardHeaderProps) {
  return (
    <div className={cn(
      compact ? CARD_STYLES.headerCompact : CARD_STYLES.header,
      className
    )}>
      {children}
    </div>
  );
}

export function EnhancedCardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-foreground',
      className
    )}>
      {children}
    </h3>
  );
}

export function EnhancedCardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn(
      'text-sm text-muted-foreground',
      className
    )}>
      {children}
    </p>
  );
}

export function EnhancedCardContent({ children, compact = false, className }: CardContentProps) {
  return (
    <div className={cn(
      compact ? CARD_STYLES.contentCompact : CARD_STYLES.content,
      className
    )}>
      {children}
    </div>
  );
}

export function EnhancedCardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn(
      CARD_STYLES.footer,
      className
    )}>
      {children}
    </div>
  );
}

// ==================================================================================
// EXPORT DEFAULT
// ==================================================================================

EnhancedCard.Header = EnhancedCardHeader;
EnhancedCard.Title = EnhancedCardTitle;
EnhancedCard.Description = EnhancedCardDescription;
EnhancedCard.Content = EnhancedCardContent;
EnhancedCard.Footer = EnhancedCardFooter;
