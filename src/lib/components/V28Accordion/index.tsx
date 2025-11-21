/**
 * V28Accordion - Atomic Design System Accordion Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import type { ReactNode } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface V28AccordionItem {
  value: string;
  trigger: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface V28AccordionProps {
  items: V28AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
  collapsible?: boolean;
}

export function V28Accordion({
  items,
  type = 'single',
  defaultValue,
  className,
  collapsible = true,
}: V28AccordionProps) {
  return (
    <AccordionPrimitive.Root
      type={type as any}
      defaultValue={defaultValue as any}
      collapsible={type === 'single' ? collapsible : undefined}
      className={cn('w-full', className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className="border-b border-slate-200 dark:border-slate-700"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                'flex flex-1 items-center justify-between py-4 font-medium transition-all',
                'text-slate-900 dark:text-slate-100',
                'hover:underline disabled:opacity-50 disabled:cursor-not-allowed',
                '[&[data-state=open]>svg]:rotate-180'
              )}
            >
              {item.trigger}
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-slate-600 dark:text-slate-400" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content
            className={cn(
              'overflow-hidden text-sm transition-all',
              'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
            )}
          >
            <div className="pb-4 pt-0 text-slate-600 dark:text-slate-400">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
