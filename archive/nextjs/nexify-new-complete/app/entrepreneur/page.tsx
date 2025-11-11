import { Hero } from "@/components/hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UnifiedPageTemplate, PrimaryActionButton } from "@/components/templates/UnifiedPageTemplate";

export default function EntrepreneurLandingPage() {
  return (
    <UnifiedPageTemplate
      title="Unternehmer-Portal"
      description="Skalierbare Flottensteuerung, transparente Tarife und sichere Integrationen."
      actions={
        <PrimaryActionButton asChild>
          <Link href="/auth/sign-up">Jetzt starten</Link>
        </PrimaryActionButton>
      }
    >
      <Hero />
      <section className="mt-4 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Digitales Flottenmanagement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Optimieren Sie Ihre Prozesse mit Echtzeit-Übersicht und Automatisierungen.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preisgestaltung & Tarife</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Transparente Tarife für Startups und etablierte Unternehmen.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Integration & Sicherheit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Supabase, DSGVO-konform, rollenbasierter Zugriff und Audit-Logs.</p>
          </CardContent>
        </Card>
      </section>
    </UnifiedPageTemplate>
  );
}
