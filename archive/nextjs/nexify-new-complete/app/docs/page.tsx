import type { Metadata } from "next";
import UnifiedPageTemplate from "@/components/templates/UnifiedPageTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dokumentation — MyDispatch",
  description:
    "Schnellstart, API-Referenz und Best Practices für Performance, SEO und Sicherheit in Next.js.",
};

export const dynamic = "force-static";
export const revalidate = 60 * 30; // alle 30 Minuten

export default function DocsPage() {
  return (
    <UnifiedPageTemplate
      title="Dokumentation"
      description="Starten Sie schnell und sicher mit MyDispatch."
      primaryAction={{ label: "API Schnellstart", href: "/api/v2/bookings" }}
    >
      <Tabs defaultValue="quickstart" className="mt-2">
        <TabsList>
          <TabsTrigger value="quickstart">Schnellstart</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="quickstart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs md:text-sm whitespace-pre-wrap">
{`# Abhängigkeiten
npm install zod @supabase/supabase-js

# Entwicklung starten
npm run dev`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimierte Bilder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Nutzen Sie Next.js <code>Image</code> für automatische Optimierung, Lazy Loading und responsive Größen.
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src="/images/brand/mydispatch-preview.png"
                  alt="MyDispatch Vorschau"
                  width={360}
                  height={200}
                  className="rounded"
                />
                <p className="text-xs text-muted-foreground">
                  Beispiel: Eine optimierte Preview-Grafik. Platzieren Sie Assets unter <code>public/images</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MyDispatch API v2.3</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs md:text-sm whitespace-pre-wrap">
{`GET    /api/v2/bookings          # Liste anzeigen
POST   /api/v2/bookings          # Buchung erstellen (Bearer Auth)
PUT    /api/v2/bookings/{id}     # Buchung aktualisieren (Bearer Auth)
DELETE /api/v2/bookings/{id}     # Buchung löschen`}
              </pre>
              <p className="text-sm text-muted-foreground">
                Requests werden strikt mit Zod validiert (<code>lib/api/validation.ts</code>). Unbekannte Felder werden abgewiesen.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SSR / SSG</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>SSG für statische Marketing-Seiten (<code>dynamic = "force-static"</code>).</li>
                <li>SSR für geschützte oder personalisierte Bereiche.</li>
                <li>Saubere API-Routen mit robustem Error-Handling.</li>
                <li>SEO-Metadaten pro Seite via <code>export const metadata</code>.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UnifiedPageTemplate>
  );
}

