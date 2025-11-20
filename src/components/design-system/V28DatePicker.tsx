/**
 * V28DatePicker - Core DatePicker Atom
 * HYPERION Phase 1.3 - Design System
 */

import React, { useState, forwardRef } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { V28Button } from "./V28Button";
import { V28Popover } from "./V28Popover";
import { Calendar } from "@/components/ui/calendar";

export interface V28DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export const V28DatePicker = forwardRef<HTMLButtonElement, V28DatePickerProps>(
  (
    { value, onChange, placeholder = "Datum auswählen", disabled, className, label, error },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="w-full space-y-2">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <V28Popover
          open={open}
          onOpenChange={setOpen}
          content={
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange?.(date);
                setOpen(false);
              }}
              locale={de}
              initialFocus
            />
          }
        >
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive",
              className
            )}
          >
            <span className={cn(!value && "text-muted-foreground")}>
              {value ? format(value, "PPP", { locale: de }) : placeholder}
            </span>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </button>
        </V28Popover>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

V28DatePicker.displayName = "V28DatePicker";
