const activities = [
  {
    id: "act-1",
    title: "`validate:all` erfolgreich",
    description: "Linting, Typprüfung und Tests bestanden",
    timestamp: "Heute · 09:12",
    status: "success"
  },
  {
    id: "act-2",
    title: "Deployment-Reminder",
    description: "Deployments seit 3 Tagen ausstehend",
    timestamp: "Gestern · 17:45",
    status: "warning"
  },
  {
    id: "act-3",
    title: "Neues Plugin registriert",
    description: "Supabase Audit Guard aktiviert",
    timestamp: "Gestern · 07:33",
    status: "info"
  }
];

function statusBullet(status: string) {
  switch (status) {
    case "success":
      return "bg-emerald-500";
    case "warning":
      return "bg-amber-500";
    default:
      return "bg-primary-500";
  }
}

export function ActivityTimeline() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <header className="mb-4">
        <h3 className="text-sm font-semibold text-slate-100">Aktivitätsprotokoll</h3>
        <p className="text-xs text-slate-400">Synced mit `master_audit_log`</p>
      </header>
      <ol className="relative space-y-6 border-l border-slate-800 pl-6">
        {activities.map((activity) => (
          <li key={activity.id} className="relative">
            <span className={`absolute -left-[10px] top-1 h-2.5 w-2.5 rounded-full ${statusBullet(activity.status)}`} />
            <p className="text-sm font-semibold text-slate-100">{activity.title}</p>
            <p className="text-xs text-slate-400">{activity.description}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{activity.timestamp}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
