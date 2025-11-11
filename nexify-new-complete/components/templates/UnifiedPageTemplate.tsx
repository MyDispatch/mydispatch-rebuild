"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface UnifiedPageTemplateProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function UnifiedPageTemplate({
  title,
  description,
  actions,
  children,
}: UnifiedPageTemplateProps) {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-10">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </header>

      <div className="grid gap-6">
        {children}
      </div>
    </section>
  );
}

export function PrimaryActionButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button {...props} className="bg-[#003366] hover:bg-[#00264d] text-white shadow-sm">
      {children}
    </Button>
  );
}

export default UnifiedPageTemplate;

