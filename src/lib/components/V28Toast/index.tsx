/**
 * V28Toast - Atomic Design System Toast Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface V28ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantStyles = {
  default: 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700',
  success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
  error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
};

const iconMap: Record<string, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
  error: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
  info: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
};

export function V28Toast({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  duration = 5000,
  action,
}: V28ToastProps) {
  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden border p-4 pr-8 shadow-lg transition-all',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
        'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
        'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
        variantStyles[variant]
      )}
    >
      <div className="flex gap-3 flex-1">
        {variant !== 'default' && iconMap[variant]}
        <div className="grid gap-1 flex-1">
          {title && (
            <ToastPrimitive.Title className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </ToastPrimitive.Title>
          )}
          {description && (
            <ToastPrimitive.Description className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </ToastPrimitive.Description>
          )}
        </div>
      </div>
      {action && (
        <ToastPrimitive.Action
          altText={action.label}
          onClick={action.onClick}
          className="inline-flex h-8 shrink-0 items-center justify-center border border-slate-200 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {action.label}
        </ToastPrimitive.Action>
      )}
      <ToastPrimitive.Close className="absolute right-2 top-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400">
        <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export function V28ToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      <ToastPrimitive.Viewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]" />
    </ToastPrimitive.Provider>
  );
}
