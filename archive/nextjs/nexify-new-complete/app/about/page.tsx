import type { Metadata } from "next";
import UnifiedPageTemplate from "@/components/templates/UnifiedPageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Über uns — MyDispatch",
  description:
    "MyDispatch: Geschichte, Team und Werte. Transparenz und Qualität in der Logistik- und Dispatch-Welt.",
};

export const dynamic = "force-static";
export const revalidate = 60 * 60 * 24; // täglich

export default function AboutPage() {
  return (
    <UnifiedPageTemplate
      title="Über uns"
      description="Unsere Geschichte, unser Team und unsere Werte — solide, verlässlich und kundenzentriert."
      primaryAction={{ label: "Kontakt aufnehmen", href: "/legal/terms" }}
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Unsere Geschichte</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              MyDispatch entstand aus der Praxis: Wir automatisieren und vereinheitlichen Dispatch-Prozesse,
              damit Unternehmen schneller, sicherer und kosteneffizienter arbeiten können. Mit modernster
              Technologie, klaren Schnittstellen und einem starken Fokus auf UX.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unsere Werte</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Transparenz und Integrität</li>
              <li>Performance und Zuverlässigkeit</li>
              <li>Benutzerzentriertes Design</li>
              <li>Security-first und Datenschutz</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Unser Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ein interdisziplinäres Team aus Produkt, Engineering, Design und Support. Wir liefern
              produktionsreife Lösungen nach Best Practices.
            </p>
            <Button variant="default">Offene Positionen ansehen</Button>
          </CardContent>
        </Card>
      </div>
    </UnifiedPageTemplate>
  );
}

