import type { ReactNode } from "react";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AppShell } from "@/components/dashboard/app-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      {children}
      <QuickActions />
    </AppShell>
  );
}
