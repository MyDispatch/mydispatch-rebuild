import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/lib/toast";
import { persistSession } from "@/hooks/useBootstrapSession";

const quickActions = [
  { id: "workflow", label: "Master Workflow", description: "Führt den vollständigen Master-Zyklus aus" },
  { id: "validate", label: "Validate All", description: "Linting, Typprüfungen und Tests" },
  { id: "deploy", label: "Deploy", description: "Vercel + Supabase Rollout" }
];

export function Topbar() {
  const location = useLocation();
  const [processing, setProcessing] = useState<string | null>(null);
  const logout = useAuthStore((state) => state.logout);

  const handleAction = async (actionId: string) => {
    setProcessing(actionId);
    try {
      // Placeholder für Edge Function Call
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast({
        title: `${actionId.toUpperCase()} getriggert`,
        description: "Bitte Monitoring-Panel prüfen",
        variant: "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: `${actionId.toUpperCase()} fehlgeschlagen`,
        description: (error as Error)?.message ?? "Unbekannter Fehler",
        variant: "error"
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur">
      <div className="flex items-center gap-6">
        <button className="rounded-lg border border-slate-800 px-3 py-1 text-left text-xs font-medium text-slate-400 lg:hidden">
          Menü
        </button>
        <div>
          <p className="text-xs uppercase tracking-wide text-primary-300">Aktive Ansicht</p>
          <p className="text-sm font-semibold text-slate-100">{location.pathname}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleAction(action.id)}
            disabled={processing === action.id}
            className="hidden rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-primary-500 hover:text-primary-100 xl:block disabled:opacity-60"
            title={action.description}
          >
            {processing === action.id ? "…" : action.label}
          </button>
        ))}
        <Link
          to="/settings"
          className="hidden rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-primary-500 hover:text-primary-100 md:block"
        >
          System-Setup
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            persistSession(null);
          }}
          className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-400"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
