/* ==================================================================================
   V28 ACCORDION ITEM - FLAT DESIGN
   ==================================================================================
   ✅ Offener State: bg-slate-100 (statt Dunkelblau)
   ✅ Text: text-slate-900 (statt Beige)
   ✅ Icon: text-slate-700 (statt Beige)
   ✅ Subtile Hover-Effekte
   ✅ Rounded Corners (rounded-lg)
   ================================================================================== */

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface V28AccordionItemProps {
  question: string;
  answer: string;
  value: string;
  isLast?: boolean;
}

export function V28AccordionItem({ question, answer, value, isLast }: V28AccordionItemProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  // Observe data-state changes on the trigger
  React.useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const state = trigger.getAttribute('data-state');
          setIsOpen(state === 'open');
        }
      });
    });

    observer.observe(trigger, {
      attributes: true,
      attributeFilter: ['data-state'],
    });

    // Initial check
    const initialState = trigger.getAttribute('data-state');
    setIsOpen(initialState === 'open');

    return () => observer.disconnect();
  }, []);

  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn('px-6', !isLast && 'border-b border-slate-200')}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={triggerRef}
          className={cn(
            'flex flex-1 items-center justify-between py-6 text-left font-semibold text-lg',
            'transition-all duration-200 rounded-lg hover:no-underline',
            isOpen
              ? 'bg-slate-100 text-slate-900 px-6 -mx-6'
              : 'text-slate-900 hover:text-slate-700'
          )}
        >
          <span>{question}</span>
          <ChevronDown
            className={cn(
              'h-5 w-5 shrink-0 transition-transform duration-200',
              isOpen ? 'rotate-180 text-slate-700' : 'text-slate-600'
            )}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div
          className={cn(
            'text-base text-slate-600 pb-8 pt-4 leading-relaxed',
            isOpen && 'px-6 -mx-6'
          )}
        >
          {answer}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
