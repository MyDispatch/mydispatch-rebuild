/**
 * V28Card - Atomic Design System Card Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface V28CardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'hover' | 'selected';
  className?: string;
}

export function V28Card({
  title,
  description,
  icon: Icon,
  children,
  onClick,
  variant = 'default',
  className,
}: V28CardProps) {
  const isInteractive = !!onClick;

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg border bg-white p-6 transition-all duration-300',
        'border-slate-200 dark:border-slate-700 dark:bg-slate-800',
        variant === 'hover' && 'hover:shadow-lg hover:border-slate-300',
        variant === 'selected' && 'border-slate-400 shadow-md',
        isInteractive && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700">
          <Icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}
