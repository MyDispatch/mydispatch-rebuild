import { UnifiedPageTemplate, PrimaryActionButton } from "@/components/templates/UnifiedPageTemplate";

export default function CustomerPortalPage() {
  return (
    <UnifiedPageTemplate
      title="Kundenportal"
      description="Zugriff auf Rechnungen, Buchungsübersicht und Support-Anfragen."
      actions={<PrimaryActionButton asChild><a href="/auth/sign-in">Anmelden</a></PrimaryActionButton>}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Rechnungen</h2>
          <p className="mt-1 text-sm text-muted-foreground">Laden Sie Rechnungen herunter und verwalten Sie Zahlungsoptionen.</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Buchungen</h2>
          <p className="mt-1 text-sm text-muted-foreground">Verfolgen Sie den Status Ihrer Buchungen in Echtzeit.</p>
        </div>
      </div>
    </UnifiedPageTemplate>
  );
}
