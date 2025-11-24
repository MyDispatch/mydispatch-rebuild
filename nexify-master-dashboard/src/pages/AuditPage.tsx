const auditEntries = [
  {
    id: "audit-1",
    category: "RLS",
    description: "`master_notes` benötigt SELECT-Policy für Observer",
    severity: "hoch",
    remediation: "Policy `allow_observer_select` hinzufügen"
  },
  {
    id: "audit-2",
    category: "Deployment",
    description: "Vercel Password Protection nicht aktiviert",
    severity: "mittel",
    remediation: "Environment Variable `VERCEL_PASSWORD_PROTECTION` setzen"
  },
  {
    id: "audit-3",
    category: "Cursor",
    description: "Remote API Token abgelaufen",
    severity: "hoch",
    remediation: "Neues Token generieren und Plugin aktualisieren"
  }
];

export default function AuditPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">Audit & Governance</h1>
        <p className="text-sm text-slate-400">Überblick über offene Findings aus `master_audit_log` und Lessons Learned.</p>
      </header>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Kategorie</th>
              <th className="px-4 py-3 text-left">Beschreibung</th>
              <th className="px-4 py-3 text-left">Schwere</th>
              <th className="px-4 py-3 text-left">Maßnahme</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
            {auditEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-900/80">
                <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{entry.id}</td>
                <td className="px-4 py-3">{entry.category}</td>
                <td className="px-4 py-3 text-slate-200">{entry.description}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 font-semibold uppercase tracking-wide ${
                      entry.severity === "hoch"
                        ? "bg-rose-500/20 text-rose-200"
                        : "bg-amber-500/20 text-amber-200"
                    }`}
                  >
                    {entry.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{entry.remediation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
        <p className="font-semibold text-slate-100">Nächste Schritte</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Policies aktualisieren und `supabase --link` erneut ausführen.</li>
          <li>Deployment Guard in Vercel aktivieren.</li>
          <li>Cursor Plugin neu signieren und in Staging testen.</li>
        </ul>
      </div>
    </section>
  );
}
