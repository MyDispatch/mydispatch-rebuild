"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Footer } from "@/components/dashboard/footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr_auto] bg-background">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="mx-auto w-full max-w-screen-2xl px-4 py-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

