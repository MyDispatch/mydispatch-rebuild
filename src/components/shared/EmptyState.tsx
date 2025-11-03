/* ==================================================================================
   EMPTY STATE - SYSTEMWEITE KONSISTENZ V28.1
   ==================================================================================
   Einheitlicher Empty State für leere Listen
   - V28.1 Slate Design (Professional Minimalism)
   - Call-to-Action
   - Mobile-optimiert
   ================================================================================== */

import { ReactNode } from 'react';
import { V28Button } from '@/components/design-system/V28Button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isSearchResult?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  isSearchResult = false,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center font-sans pointer-events-none [&:hover]:!bg-transparent">
      <div className="w-16 h-16 mb-4 text-muted-foreground opacity-50 pointer-events-none [&:hover]:!bg-transparent">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 text-center [&:hover]:!bg-transparent">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md text-center mx-auto [&:hover]:!bg-transparent">
        {description}
      </p>
      {!isSearchResult && actionLabel && onAction && (
        <V28Button 
          onClick={onAction}
          variant="primary"
          size="md"
          className="rounded-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </V28Button>
      )}
    </div>
  );
}
