/* ==================================================================================
   SMART TEMPLATE: SECTION HEADER V28.1
   ==================================================================================
   ✅ Wiederverwendbarer Sektion-Header für konsistente Überschriften
   ✅ V28.1 Professional Minimalism
   ✅ Pure Tailwind mit Slate-Palette
   ================================================================================== */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  // Content
  title: string;
  description?: string;
  actions?: ReactNode;
  
  // Layout
  align?: 'left' | 'center';
  spacing?: 'sm' | 'md' | 'lg';
  
  // Styling
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  title,
  description,
  actions,
  align = 'center',
  spacing = 'md',
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  const spacingMap = {
    sm: 'mb-8',
    md: 'mb-12 md:mb-16',
    lg: 'mb-16 md:mb-20',
  };

  return (
    <div
      className={cn(
        spacingMap[spacing],
        align === 'center' && 'text-center',
        className
      )}
    >
      {/* Title */}
      <h2
        className={cn(
          'text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900',
          titleClassName
        )}
        style={{ textWrap: 'balance' }}
      >
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'text-lg font-normal leading-relaxed text-slate-600',
            align === 'center' && 'max-w-3xl mx-auto',
            descriptionClassName
          )}
          style={{ textWrap: 'pretty' }}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {actions && (
        <div className={cn('mt-8', align === 'center' && 'flex justify-center')}>
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * <SectionHeader
 *   title="Dashboard Übersicht"
 *   description="Verwalten Sie Ihre Aufträge, Fahrer und Fahrzeuge zentral"
 *   align="center"
 *   spacing="lg"
 *   actions={
 *     <ActionButton variant="primary" onClick={handleAction}>
 *       Neuer Auftrag
 *     </ActionButton>
 *   }
 * />
 */
