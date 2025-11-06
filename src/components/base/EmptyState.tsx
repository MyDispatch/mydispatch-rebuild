/* ==================================================================================
   EMPTY STATE COMPONENT - STANDARDISIERTE EMPTY-STATES
   ==================================================================================
   ✅ Konsistente Empty-State-Darstellung systemweit
   ✅ Optional: Icon, Titel, Beschreibung, Action-Button
   ✅ Variants: Page, Section, Inline
   ==================================================================================
   NUTZUNG: <EmptyState icon={FileText} title="Keine Aufträge" />
   ================================================================================== */

import { LucideIcon } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { SafeIcon } from './SafeIcon';
import { Heading, Body } from './Typography';
import { cn } from '@/lib/utils';

// ==================================================================================
// TYPES
// ==================================================================================

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'page' | 'section' | 'inline';
  className?: string;
}

// ==================================================================================
// COMPONENT
// ==================================================================================

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'section',
  className,
}: EmptyStateProps) {

  const variantStyles = {
    page: 'min-h-[400px] py-16',
    section: 'py-12',
    inline: 'py-8',
  };

  const iconSize = {
    page: 'xl' as const,
    section: 'lg' as const,
    inline: 'md' as const,
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variantStyles[variant],
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 p-4 rounded-full bg-muted">
          <SafeIcon
            icon={icon}
            size={iconSize[variant]}
            color="text-muted-foreground"
          />
        </div>
      )}

      {/* Title */}
      <Heading level={variant === 'page' ? 2 : 3} className="mb-2">
        {title}
      </Heading>

      {/* Description */}
      {description && (
        <Body className="text-muted-foreground max-w-md mb-6">
          {description}
        </Body>
      )}

      {/* Action Button */}
      {action && (
        <V28Button onClick={action.onClick} variant="primary">
          {action.label}
        </V28Button>
      )}
    </div>
  );
}

// ==================================================================================
// EMPTY TABLE STATE (Spezifisch für Tabellen)
// ==================================================================================

interface EmptyTableStateProps {
  icon?: LucideIcon;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyTableState({
  icon,
  message = 'Keine Einträge gefunden',
  action,
}: EmptyTableStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mb-4 inline-block p-3 rounded-full bg-muted">
          <SafeIcon icon={icon} size="lg" color="text-muted-foreground" />
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        {message}
      </p>

      {action && (
        <V28Button onClick={action.onClick} size="sm" variant="primary">
          {action.label}
        </V28Button>
      )}
    </div>
  );
}
