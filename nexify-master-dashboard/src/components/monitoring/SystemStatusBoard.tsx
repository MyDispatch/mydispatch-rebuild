const statusCards = [
  {
    title: "Supabase",
    status: "Healthy",
    details: "RLS aktiv · Letzte Migration 12min",
    color: "text-emerald-300",
    indicator: "bg-emerald-500"
  },
  {
    title: "Edge Functions",
    status: "1 Warnung",
    details: "`master-run-command` benötigt Secrets Rotation",
    color: "text-amber-300",
    indicator: "bg-amber-500"
  },
  {
    title: "Vercel Deployments",
    status: "Ausstehend",
    details: "Letzter Build vor 3 Tagen",
    color: "text-rose-300",
    indicator: "bg-rose-500"
  },
  {
    title: "Cursor Remote",
    status: "Mock-Modus",
    details: "API_URL nicht konfiguriert",
    color: "text-slate-300",
    indicator: "bg-slate-500"
  }
];

export function SystemStatusBoard() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <header className="mb-4">
        <h3 className="text-sm font-semibold text-slate-100">Systemstatus</h3>
        <p className="text-xs text-slate-400">Direktverbindung zu Monitoring-Edge-Funktionen</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {statusCards.map((card) => (
          <article
            key={card.title}
            className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-4"
          >
            <span className={`mt-1 h-3 w-3 rounded-full ${card.indicator}`} />
            <div>
              <p className="text-sm font-semibold text-slate-100">{card.title}</p>
              <p className={`text-xs font-medium ${card.color}`}>{card.status}</p>
              <p className="mt-1 text-xs text-slate-400">{card.details}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
