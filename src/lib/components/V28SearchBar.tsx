/**
 * V28SearchBar - Atomic Design System SearchBar Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface V28SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const V28SearchBar = forwardRef<HTMLInputElement, V28SearchBarProps>(
  ({ className, value, onChange, onClear, placeholder = "Suchen...", ...props }, ref) => {
    const handleClear = () => {
      onChange("");
      onClear?.();
    };

    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md border bg-white pl-10 pr-10 py-2 text-sm",
            "placeholder:text-slate-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-300",
            "border-slate-200 dark:border-slate-700",
            className
          )}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

V28SearchBar.displayName = "V28SearchBar";
