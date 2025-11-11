import type { Metadata } from "next";
import UnifiedPageTemplate from "@/components/templates/UnifiedPageTemplate";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";

export const metadata: Metadata = {
  title: "Häufig gestellte Fragen (FAQ) — MyDispatch",
  description:
    "Antworten zu Tarifen, Features, Support und DSGVO für Taxi-, Mietwagen- und Limousinen-Services.",
};

export const dynamic = "force-static";
export const revalidate = 60 * 60; // stündlich

const faqCategories = [
  {
    category: "Allgemein",
    questions: [
      {
        q: "Was ist MyDispatch?",
        a:
          "MyDispatch ist eine professionelle Dispositionssoftware für Taxi-, Mietwagen- und Limousinenunternehmen. Sie umfasst Auftragsverwaltung, Flottenmanagement, Partner-Integration, PBefG-konforme Dokumentation und mehr.",
      },
      {
        q: "Für wen ist MyDispatch geeignet?",
        a:
          "Für Unternehmen jeder Größe – vom Einzelunternehmer bis zum mittelständischen Fuhrpark mit mehreren Dutzend Fahrzeugen.",
      },
      {
        q: "Ist MyDispatch für Taxiunternehmen geeignet?",
        a:
          "Ja. MyDispatch erfüllt gesetzliche Anforderungen: P‑Schein-Verwaltung, Funk-Integration, PBefG § 51-Dokumentation, Taxameter-Anbindung und Tarifverwaltung.",
      },
      {
        q: "Erfüllt MyDispatch die Rückkehrpflicht (§ 49 Abs. 4 PBefG)?",
        a:
          "Ja. Rückkehrfahrten zum Betriebssitz werden automatisch mit Zeitstempel dokumentiert.",
      },
      {
        q: "Bietet MyDispatch White-Labeling?",
        a:
          "Im Enterprise‑Tarif sind Branding (Logo, Farben, Domain) möglich – ohne MyDispatch-Referenzen.",
      },
      { q: "Ist MyDispatch DSGVO‑konform?", a: "Ja, vollständig. Speicherung in deutschen Rechenzentren." },
    ],
  },
  {
    category: "Tarife & Abrechnung",
    questions: [
      {
        q: "Welche Tarife gibt es?",
        a:
          "Starter, Business und Enterprise. Starter bis 3 Fahrer/Fahrzeuge mit Basisfunktionen; Business ohne Begrenzung plus Partner-Management, Live-Traffic, Statistiken, Portal, Buchungswidget, AI‑Chatbot, API; Enterprise individuell.",
      },
      { q: "Gibt es eine Vertragslaufzeit?", a: "Nein, monatlich kündbar." },
      { q: "Kann ich meinen Tarif upgraden?", a: "Ja, Wechsel jederzeit möglich." },
      { q: "Wie funktioniert die Abrechnung?", a: "Monatlich über Stripe, Rechnung per E‑Mail." },
      { q: "Kann ich jederzeit kündigen?", a: "Ja, zum Ende des Abrechnungszeitraums." },
    ],
  },
  {
    category: "Features & Funktionen",
    questions: [
      { q: "Was ist im Starter enthalten?", a: "Basisdisposition, Kunden-/Fahrerverwaltung, Aufträge, Angebote/Rechnungen, Info‑Landingpage." },
      { q: "Was bietet Business zusätzlich?", a: "Partner-Management, Live‑Traffic, Statistiken, Kunden‑Portal, Buchungswidget, AI‑Chatbot, API." },
      { q: "Datenexport möglich?", a: "Ja, CSV/PDF jederzeit." },
      { q: "Mobile App?", a: "Responsive Web‑App, native App in Planung." },
      { q: "Mehrere Benutzer?", a: "Ja, gleichzeitige Nutzung pro Unternehmen." },
    ],
  },
  {
    category: "Technischer Support",
    questions: [
      { q: "Support?", a: "E‑Mail support@mydispatch.de, Business zusätzlich Live‑Chat." },
      { q: "Schulungen?", a: "Ja, Online‑Trainings verfügbar." },
      { q: "Bei Problemen?", a: "Durchschnittliche Antwortzeit < 4 Stunden." },
      { q: "Dokumentation?", a: "Umfassende Online‑Dokumentation mit Videos." },
    ],
  },
  {
    category: "DSGVO & Datenschutz",
    questions: [
      { q: "Datenspeicherung?", a: "In ISO‑zertifizierten Rechenzentren in Deutschland." },
      { q: "Zugriff?", a: "Nur autorisierte Mitarbeitende; Support nur mit Erlaubnis." },
      { q: "Weitergabe an Dritte?", a: "Nein. Ausnahme: Stripe (PCI‑DSS)." },
      { q: "Löschung?", a: "Recht auf Löschung gem. DSGVO Art. 17." },
      { q: "AVV?", a: "Ja, DSGVO‑konformer AV‑Vertrag verfügbar." },
    ],
  },
];

export default function FAQPage() {
  const [term, setTerm] = useState("");
  const all = useMemo(() => faqCategories.flatMap((c) => c.questions), []);
  const filtered = useMemo(() => {
    const t = term.toLowerCase();
    return faqCategories
      .map((c) => ({
        ...c,
        questions: c.questions.filter((q) => q.q.toLowerCase().includes(t) || q.a.toLowerCase().includes(t)),
      }))
      .filter((c) => c.questions.length > 0);
  }, [term]);

  return (
    <UnifiedPageTemplate
      title="Häufig gestellte Fragen"
      description="Finden Sie Antworten zu Tarifen, Funktionen, Support und Datenschutz."
      primaryAction={{ label: "Jetzt starten", href: "/auth" }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="relative">
          <Input
            placeholder="Frage suchen…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="pl-3 min-h-[44px] text-base"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base text-muted-foreground">Keine Ergebnisse gefunden.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((c) => (
              <Card key={c.category}>
                <CardHeader className="flex flex-row items-center gap-3">
                  <CardTitle className="text-xl">{c.category}</CardTitle>
                  <Badge className="ml-auto">{c.questions.length}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {c.questions.map((q, i) => (
                    <details key={i} className="group rounded-lg border p-3">
                      <summary className="cursor-pointer font-medium text-slate-900">
                        {q.q}
                      </summary>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {q.a}
                      </div>
                    </details>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UnifiedPageTemplate>
  );
}

