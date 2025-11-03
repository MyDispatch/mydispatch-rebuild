/**
 * V28Tabs - Atomic Design System Tabs Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import { ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export interface V28Tab {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface V28TabsProps {
  tabs: V28Tab[];
  defaultValue?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function V28Tabs({
  tabs,
  defaultValue,
  className,
  onValueChange,
}: V28TabsProps) {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue || tabs[0]?.value}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      <TabsPrimitive.List className="flex w-full border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors',
              'text-slate-600 dark:text-slate-400',
              'hover:text-slate-900 dark:hover:text-slate-100',
              'data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100',
              'data-[state=active]:border-b-2 data-[state=active]:border-slate-900',
              'dark:data-[state=active]:border-slate-100',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className="mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
