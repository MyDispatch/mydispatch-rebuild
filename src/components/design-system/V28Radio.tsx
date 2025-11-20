/**
 * V28Radio - Core Radio Atom
 * HYPERION Phase 1.3 - Design System
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioVariants = cva(
  "h-4 w-4 rounded-full border ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary text-primary",
        error: "border-destructive text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface V28RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface V28RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof radioVariants> {
  label?: string;
  error?: string;
  options: V28RadioOption[];
  orientation?: "vertical" | "horizontal";
}

export const V28Radio = React.forwardRef<HTMLInputElement, V28RadioProps>(
  (
    { className, variant, label, error, options, orientation = "vertical", name, ...props },
    ref
  ) => {
    const groupId = React.useId();

    return (
      <div className="w-full">
        {label && <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>}
        <div
          className={cn(
            "flex gap-4",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
          )}
        >
          {options.map((option) => {
            const optionId = `${groupId}-${option.value}`;
            return (
              <div key={option.value} className="flex items-start space-x-2">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  className={cn(radioVariants({ variant: error ? "error" : variant }), className)}
                  ref={ref}
                  {...props}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={optionId}
                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

V28Radio.displayName = "V28Radio";
