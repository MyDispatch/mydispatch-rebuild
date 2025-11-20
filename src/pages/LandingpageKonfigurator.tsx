/* ==================================================================================
   LANDINGPAGE KONFIGURATOR V18.3.30
   ==================================================================================
   VOLLSTÄNDIGE Landingpage-Verwaltung
   - Landing-Domain (Slug)
   - Content (Titel, Hero, Beschreibung)
   - Aktivierung & Widget-Einstellungen
   - Geschäftszeiten
   - Live-Preview
   ================================================================================== */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Eye, Upload, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { SEOHead } from "@/components/shared/SEOHead";
import { useMainLayout } from "@/hooks/use-main-layout";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { PRODUCT_IDS, isBusinessTier } from "@/lib/subscription-utils";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { DEFAULT_PORTAL_THEME, isValidHexColor } from "@/lib/portal-theme";
import { FeatureGate } from "@/components/shared/FeatureGate";

export default function LandingpageKonfigurator() {
  const { profile, company } = useAuth();
  const { sidebarExpanded } = useMainLayout();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slugSaving, setSlugSaving] = useState(false);

  // ✅ V36.0: Config mit expliziter Type-Annotation für primary_color
  const [config, setConfig] = useState<{
    company_slug: string;
    landingpage_enabled: boolean;
    landingpage_title: string;
    landingpage_hero_text: string;
    landingpage_description: string;
    primary_color: string; // Explizit string statt literal type
    logo_url: string;
    business_hours: Record<string, string>;
    widget_enabled: boolean;
    widget_button_text: string;
    widget_size: string;
    widget_show_phone: boolean;
  }>({
    company_slug: "",
    landingpage_enabled: false,
    landingpage_title: "",
    landingpage_hero_text: "",
    landingpage_description: "",
    primary_color: DEFAULT_PORTAL_THEME.primary_color as string,
    logo_url: "",
    business_hours: { "Mo-Fr": "09:00 - 17:00", "Sa-So": "Geschlossen" },
    widget_enabled: false,
    widget_button_text: "Jetzt buchen",
    widget_size: "medium",
    widget_show_phone: true,
  });

  useEffect(() => {
    if (company) {
      setConfig({
        company_slug: company.company_slug || "",
        landingpage_enabled: company.landingpage_enabled || false,
        landingpage_title: company.landingpage_title || "",
        landingpage_hero_text: company.landingpage_hero_text || "",
        landingpage_description: company.landingpage_description || "",
        primary_color: company.primary_color || DEFAULT_PORTAL_THEME.primary_color,
        logo_url: company.logo_url || "",
        business_hours: (typeof company.business_hours === "object" &&
        company.business_hours !== null
          ? company.business_hours
          : { "Mo-Fr": "09:00 - 17:00", "Sa-So": "Geschlossen" }) as Record<string, string>,
        widget_enabled: company.widget_enabled || false,
        widget_button_text: company.widget_button_text || "Jetzt buchen",
        widget_size: company.widget_size || "medium",
        widget_show_phone: company.widget_show_phone !== false,
      });
    }
  }, [company]);

  const handleSlugChange = async (newSlug: string) => {
    const slug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setConfig({ ...config, company_slug: slug });

    if (slug.length >= 3 && company?.id) {
      setSlugSaving(true);
      try {
        const { error } = await supabase
          .from("companies")
          .update({ company_slug: slug })
          .eq("id", company.id);

        if (error) throw error;
        handleSuccess("Domain-Slug gespeichert");
      } catch (error) {
        handleError(error, "Fehler beim Speichern des Slugs");
      } finally {
        setSlugSaving(false);
      }
    }
  };

  const handleSave = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("companies").update(config).eq("id", company.id);

      if (error) throw error;

      handleSuccess("Landingpage-Konfiguration gespeichert");
    } catch (error) {
      handleError(error, "Fehler beim Speichern", { title: "Speichern fehlgeschlagen" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company?.id) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${company.id}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      setConfig({ ...config, logo_url: publicUrl });
      handleSuccess("Logo hochgeladen");
    } catch (error) {
      handleError(error, "Fehler beim Hochladen", { title: "Upload fehlgeschlagen" });
    }
  };

  // Landingpage-Konfigurator ist für ALLE Tarife verfügbar
  // Nur Widget und erweiterte Features sind Business+ exklusiv
  const isAdmin = profile?.user_roles?.some((r: any) => r.role === "admin");
  const hasAccess = isAdmin || company?.id; // Jeder mit Company hat Zugriff

  if (!hasAccess) {
    return (
      <>
        <SEOHead
          title="Landingpage-Konfigurator"
          description="Konfigurieren Sie Ihre öffentliche Landingpage"
        />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Zugriff nicht verfügbar. Bitte kontaktieren Sie den Support.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  // Prüfe Business-Tarif für Widget-Features
  const hasBusinessFeatures =
    isAdmin ||
    (company?.subscription_status === "active" &&
      company?.subscription_product_id &&
      isBusinessTier(company.subscription_product_id));

  return (
    <>
      <SEOHead
        title="Landingpage-Konfigurator"
        description="Gestalten Sie Ihre öffentliche Unternehmens-Landingpage"
      />

      <FeatureGate requiredTariff="Business" feature="Landingpage-Konfigurator">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Einstellungen</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="enabled">Aktiviert</Label>
                <Switch
                  id="enabled"
                  checked={config.landingpage_enabled}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, landingpage_enabled: checked })
                  }
                />
              </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList>
                <TabsTrigger value="general" className="min-h-[44px]">
                  Allgemein
                </TabsTrigger>
                <TabsTrigger value="widget" className="min-h-[44px]">
                  Widget
                </TabsTrigger>
                <TabsTrigger value="hours" className="min-h-[44px]">
                  Zeiten
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                {/* Status-Banner */}
                {config.landingpage_enabled && config.company_slug ? (
                  <Alert className="bg-status-success/10 border-status-success/30">
                    <CheckCircle2 className="h-4 w-4 text-status-success" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Landingpage ist aktiv!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Öffentlich erreichbar unter: my-dispatch.de/{config.company_slug}
                        </p>
                      </div>
                      <a
                        href={`/${config.company_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Öffnen
                      </a>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium">Landingpage noch nicht aktiv</p>
                      <p className="text-sm mt-1">
                        {!config.company_slug
                          ? "Bitte vergeben Sie zuerst einen Domain-Slug."
                          : "Aktivieren Sie die Landingpage mit dem Schalter oben."}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                <Separator />

                {/* Landing-Domain (Slug) */}
                <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="company_slug" className="text-base font-semibold">
                      Landing-Domain (URL-Slug)
                    </Label>
                    {slugSaving && (
                      <span className="text-xs text-muted-foreground">Speichert...</span>
                    )}
                  </div>
                  <Input
                    id="company_slug"
                    value={config.company_slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="ihr-unternehmen"
                    minLength={3}
                    maxLength={50}
                    className="font-mono"
                  />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">🔗 Ihre Landingpage-URL:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1">
                        https://my-dispatch.de/{config.company_slug || "ihr-slug"}
                      </code>
                      {config.company_slug && (
                        <a
                          href={`/${config.company_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">
                      ℹ️ Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt (3-50 Zeichen)
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Content-Felder */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Inhalte</h3>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo (optional)</Label>
                    <div className="flex items-center gap-4">
                      {config.logo_url && (
                        <img
                          src={config.logo_url}
                          alt="Logo"
                          className="h-12 w-auto object-contain border rounded p-2"
                        />
                      )}
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        {config.logo_url ? "Ändern" : "Hochladen"}
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Wird im Header Ihrer Landingpage angezeigt
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Primärfarbe (Corporate Identity)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.primary_color}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        // ✅ V36.0: Validierung der Hex-Farbe
                        if (!newColor || isValidHexColor(newColor)) {
                          setConfig({ ...config, primary_color: newColor });
                        }
                      }}
                      placeholder={DEFAULT_PORTAL_THEME.primary_color}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bestimmt die Farbgebung Ihrer Landingpage
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Seitentitel *</Label>
                  <Input
                    id="title"
                    value={config.landingpage_title}
                    onChange={(e) => setConfig({ ...config, landingpage_title: e.target.value })}
                    placeholder={`${company?.name || "Ihr Unternehmen"} - Taxi & Mietwagenservice`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Erscheint im Browser-Tab und in Suchergebnissen (SEO)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero">Hero-Text *</Label>
                  <Textarea
                    id="hero"
                    value={config.landingpage_hero_text}
                    onChange={(e) =>
                      setConfig({ ...config, landingpage_hero_text: e.target.value })
                    }
                    placeholder={`Willkommen bei ${company?.name || "Ihrem Taxi-Service"}`}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    Große Überschrift oben auf Ihrer Landingpage
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    value={config.landingpage_description}
                    onChange={(e) =>
                      setConfig({ ...config, landingpage_description: e.target.value })
                    }
                    placeholder="Ihr zuverlässiger Partner für sichere und komfortable Fahrten. 24/7 Service, moderne Fahrzeuge, professionelle Fahrer."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Detaillierte Beschreibung Ihres Services (optional)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="widget" className="space-y-4">
                {!hasBusinessFeatures && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium">Business-Feature</p>
                      <p className="text-sm mt-1">
                        Das Buchungswidget ist nur für Business & Enterprise Tarife verfügbar.
                      </p>
                      <button
                        onClick={() => navigate("/einstellungen?tab=abonnement")}
                        className="text-primary hover:underline text-sm p-0 h-auto mt-2 bg-transparent border-none cursor-pointer"
                      >
                        Tarif upgraden →
                      </button>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="widget-enabled" className="text-base">
                      Widget aktivieren
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ermöglicht Online-Buchungen direkt auf Ihrer Landingpage
                    </p>
                  </div>
                  <Switch
                    id="widget-enabled"
                    checked={config.widget_enabled}
                    onCheckedChange={(checked) => setConfig({ ...config, widget_enabled: checked })}
                    disabled={!hasBusinessFeatures}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Widget-Einstellungen</h3>

                  <div className="space-y-2">
                    <Label htmlFor="button-text">Button-Text</Label>
                    <Input
                      id="button-text"
                      value={config.widget_button_text}
                      onChange={(e) => setConfig({ ...config, widget_button_text: e.target.value })}
                      placeholder="Jetzt buchen"
                      disabled={!hasBusinessFeatures}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Widget-Größe</Label>
                    <div className="flex gap-2">
                      {["small", "medium", "large"].map((size) => (
                        <V28Button
                          key={size}
                          variant={config.widget_size === size ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setConfig({ ...config, widget_size: size })}
                          disabled={!hasBusinessFeatures}
                          className="flex-1"
                        >
                          {size === "small" ? "Klein" : size === "medium" ? "Mittel" : "Groß"}
                        </V28Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-phone">Telefonnummer anzeigen</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Zeigt Ihre Telefonnummer prominent auf der Landingpage
                      </p>
                    </div>
                    <Switch
                      id="show-phone"
                      checked={config.widget_show_phone}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, widget_show_phone: checked })
                      }
                      disabled={!hasBusinessFeatures}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hours" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Geschäftszeiten-Editor (vereinfacht)
                </p>
                {Object.entries(config.business_hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-2">
                    <Label className="w-20">{day}</Label>
                    <Input
                      value={hours as string}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          business_hours: { ...config.business_hours, [day]: e.target.value },
                        })
                      }
                    />
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <V28Button
                onClick={handleSave}
                disabled={loading}
                className="flex-1"
                variant="primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Wird gespeichert..." : "Speichern"}
              </V28Button>
              <a
                href={
                  company?.company_slug
                    ? `/${company.company_slug}`
                    : `/unternehmer?id=${company?.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Eye className="h-4 w-4" />
                Vorschau
              </a>
            </div>
          </Card>

          {/* Live Preview Panel */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Live-Vorschau</h2>
            <div
              className="border rounded-lg overflow-hidden bg-background"
              style={{ minHeight: "600px" }}
            >
              <iframe
                src={
                  company?.company_slug
                    ? `/${company.company_slug}?preview=true`
                    : `/unternehmer?id=${company?.id}&preview=true`
                }
                className="w-full h-[600px] border-0"
                title="Landingpage Vorschau"
              />
            </div>
          </Card>
        </div>
      </FeatureGate>
    </>
  );
}
