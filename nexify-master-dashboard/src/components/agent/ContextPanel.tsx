import { useMemo } from "react";

const checklist = [
  {
    title: "Wiki geladen",
    description: "Edge Function `brain-query` (session_init)",
    status: "complete"
  },
  {
    title: "Forget-Proof aktiv",
    description: "Supabase Tabellen `master_sessions`, `master_notes`",
    status: "complete"
  },
  {
    title: "Component Registry",
    description: "Synchronisation mit V28-Katalog",
    status: "in-progress"
  },
  {
    title: "Deployment Pending",
    description: "Letzter Stand aus `DEPLOYMENT_STATUS.md`",
    status: "warning"
  }
];

function badgeStyles(status: string) {
  switch (status) {
    case "complete":
      return "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40";
    case "warning":
      return "bg-amber-500/15 text-amber-200 border border-amber-500/40";
    default:
      return "bg-primary-500/15 text-primary-100 border border-primary-500/30";
  }
}

export function ContextPanel() {
  const timestamp = useMemo(() => new Date().toLocaleString("de-DE"), []);

  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <header>
        <h3 className="text-sm font-semibold text-slate-100">Kontext-Synchronität</h3>
        <p className="text-xs text-slate-400">Letzte Aktualisierung: {timestamp}</p>
      </header>
      <ul className="space-y-3 text-sm">
        {checklist.map((item) => (
          <li key={item.title} className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3">
            <div>
              <p className="font-medium text-slate-100">{item.title}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeStyles(item.status)}`}>
              {item.status}
            </span>
          </li>
        ))}
      </ul>
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
        <p className="font-semibold text-slate-100">Aktive Guardrails</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Zero-Hallucination Layer mit Component Registry & Known Issues</li>
          <li>RLS Monitoring über `master_audit_log`</li>
          <li>Auto-Docs Update nach jedem Workflow</li>
        </ul>
      </div>
    </section>
  );
}
