export default function DashboardHomePage() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Übersicht</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Willkommen im MyDispatch-Dashboard. Nutzen Sie die Schnellaktionen unten rechts.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Letzte Aktivitäten</h2>
        <ul className="mt-2 list-disc pl-4 text-sm text-muted-foreground">
          <li>Neue Buchung erstellt</li>
          <li>CSV-Import abgeschlossen</li>
          <li>Einstellungen angepasst</li>
        </ul>
      </div>
    </section>
  );
}
