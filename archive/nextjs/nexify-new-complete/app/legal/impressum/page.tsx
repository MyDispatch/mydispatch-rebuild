import type { Metadata } from "next";
import UnifiedPageTemplate from "@/components/templates/UnifiedPageTemplate";

export const metadata: Metadata = {
  title: "Impressum — MyDispatch",
  description: "Gesetzliche Anbieterkennzeichnung und Kontaktinformationen.",
};

export const dynamic = "force-static";

export default function ImpressumPage() {
  return (
    <UnifiedPageTemplate title="Impressum" description="Gesetzliche Anbieterkennzeichnung gemäß § 5 TMG">
      <div className="max-w-3xl mx-auto space-y-6 text-sm">
        <section>
          <h2 className="text-lg font-semibold">Diensteanbieter</h2>
          <p>MyDispatch Solutions</p>
          <p>Made in Germany</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Kontakt</h2>
          <p>E‑Mail: support@mydispatch.de</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Vertretungsberechtigte</h2>
          <p>Geschäftsführung: MyDispatch Solutions</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Umsatzsteuer-ID</h2>
          <p>Wird auf Anfrage bereitgestellt.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Haftungshinweis</h2>
          <p>
            Inhalte dieser Webseiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
            Aktualität übernehmen wir keine Gewähr. Bei Verlinkungen auf externe Seiten übernehmen wir keine Haftung
            für deren Inhalte.
          </p>
        </section>
      </div>
    </UnifiedPageTemplate>
  );
}

