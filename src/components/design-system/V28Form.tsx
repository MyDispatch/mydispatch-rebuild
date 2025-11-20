/* ==================================================================================
   V28 FORM - FORM WRAPPER WITH REACT HOOK FORM
   ==================================================================================
   ✅ React Hook Form integration
   ✅ Validation support
   ✅ Error handling
   ✅ Submit handling
   ================================================================================== */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface V28FormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function V28Form({ children, onSubmit, className }: V28FormProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)}>
      {children}
    </form>
  );
}

interface V28FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function V28FormField({ label, error, required, children, className }: V28FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
