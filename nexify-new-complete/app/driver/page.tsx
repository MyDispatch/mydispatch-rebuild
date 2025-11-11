import { UnifiedPageTemplate, PrimaryActionButton } from "@/components/templates/UnifiedPageTemplate";

export default function DriverPortalPage() {
  return (
    <UnifiedPageTemplate
      title="Fahrerportal"
      description="Tagesablauf, Tourenübersicht, Dokumenten-Upload und Statusmeldungen."
      actions={<PrimaryActionButton asChild><a href="/driver/onboarding">Onboarding starten</a></PrimaryActionButton>}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Heutige Touren</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sehen Sie Ihre geplanten Stops und Zeiten.</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Dokumenten-Upload</h2>
          <p className="mt-1 text-sm text-muted-foreground">Laden Sie Lieferscheine und Abnahmebelege hoch.</p>
        </div>
      </div>
    </UnifiedPageTemplate>
  );
}
