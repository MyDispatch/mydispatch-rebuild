"use client";
import { useState, useEffect, useRef } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { MainContent } from "./MainContent";

export function HomepageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);

  // Close sidebar on escape key for accessibility
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Skip to content focus support
  const focusMain = () => {
    mainRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-primary text-primary-foreground rounded px-3 py-2"
        onClick={focusMain}
      >
        Zum Inhalt springen
      </a>
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex-1 flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 outline-none" tabIndex={-1} ref={mainRef}>
          <MainContent />
        </div>
      </div>

      <Footer />
    </div>
  );
}

