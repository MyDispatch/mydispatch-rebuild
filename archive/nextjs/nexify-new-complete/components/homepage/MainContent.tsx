import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { V28HeroPremium } from "@/components/hero/V28HeroPremium";

export function MainContent() {
  return (
    <main id="main" className="flex-1" role="main" aria-label="Hauptinhalt">
      <section aria-labelledby="hero" className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 id="hero" className="sr-only">mydispatch v28 – Startseite</h1>
          <V28HeroPremium />
        </div>
      </section>

      <section aria-labelledby="features" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 id="features" className="text-xl font-semibold mb-6">Produktmerkmale</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Live-Disposition", text: "Echtzeit-Überblick über Fahrer, Fahrzeuge und Aufträge." },
              { title: "Routenoptimierung", text: "Kosten- und zeitoptimierte Tourenplanung auf Knopfdruck." },
              { title: "Abrechnung & Rechnungen", text: "Automatisierte Rechnungsstellung mit Export und Prüfung." },
            ].map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="details" className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 id="details" className="text-xl font-semibold mb-4">Details</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-2">Übersicht</h3>
              <p className="text-sm text-muted-foreground">mydispatch v28 ist für Präzision und Performance gebaut – mit moderner UI und klaren Workflows.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Integrationen</h3>
              <p className="text-sm text-muted-foreground">Supabase, Stripe, Karten- und Geodienste sowie CRM-Systeme lassen sich nahtlos anbinden.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Sicherheit</h3>
              <p className="text-sm text-muted-foreground">WCAG-konform, sichere Auth, geprüfte Eingaben und Schutzmechanismen gegen Bots.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
