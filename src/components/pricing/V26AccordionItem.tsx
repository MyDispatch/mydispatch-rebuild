/* ==================================================================================
   V26 ACCORDION ITEM - PRICING FAQ STYLING
   ==================================================================================
   ✅ Offener State: Blauer BG + Beige Text/Icon
   ✅ Geschlossener State: Weiß BG + Blau Text/Icon
   ✅ Smooth Transitions
   ✅ Synchronisiert mit Radix Accordion State
   ================================================================================== */

import React, { useState, useEffect, useRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface V26AccordionItemProps {
  question: string;
  answer: string;
  value: string;
  isLast?: boolean;
}

export function V26AccordionItem({ question, answer, value, isLast }: V26AccordionItemProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Observe data-state changes on the trigger
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-state") {
          const state = trigger.getAttribute("data-state");
          setIsOpen(state === "open");
        }
      });
    });

    observer.observe(trigger, {
      attributes: true,
      attributeFilter: ["data-state"],
    });

    // Initial check
    const initialState = trigger.getAttribute("data-state");
    setIsOpen(initialState === "open");

    return () => observer.disconnect();
  }, []);

  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn("px-6", !isLast && "border-b border-slate-200")}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={triggerRef}
          className={cn(
            "flex flex-1 items-center justify-between py-6 text-left font-sans hover:no-underline transition-all rounded-lg",
            isOpen ? "bg-slate-900 text-slate-50 p-6 -mx-6" : "bg-transparent text-slate-900 px-0"
          )}
        >
          <span className="text-lg font-semibold">{question}</span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 transition-transform duration-200",
              isOpen ? "rotate-180 text-slate-50" : "text-slate-900"
            )}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div
          className={cn(
            "font-sans text-base font-normal pb-8 pt-4 px-6 leading-relaxed text-slate-700",
            isOpen && "-mx-6"
          )}
        >
          {answer}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
