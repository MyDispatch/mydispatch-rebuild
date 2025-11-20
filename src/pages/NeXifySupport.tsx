/* ==================================================================================
   NEXIFY SUPPORT PAGE - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ Layout Pattern System V18.6
   ✅ Design Tokens aus config/design-tokens.ts
   ✅ Responsive & Mobile-optimiert
   ✅ WCAG 2.1 AA konform
   ✅ Vollständiger Kontakt-Form mit Validierung
   ================================================================================== */

import { useState } from "react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SEOHead } from "@/components/shared/SEOHead";
import { Section, Container, Grid, Stack, Flex } from "@/components/ui/layout";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { V28Button } from "@/components/design-system/V28Button";
import { V28InfoBox } from "@/components/design-system/V28InfoBox";
import { V28HeroPremium } from "@/components/hero/V28HeroPremium";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code,
  Server,
  Shield,
  Zap,
  Clock,
  Users,
  Database,
  Cloud,
  MessageSquare,
  Mail,
  Phone,
  Sparkles,
  Loader2,
  Star,
  Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { organizationSchema } from "@/lib/schema-org";
import { CheckCircle2, TrendingUp, Award } from "lucide-react";

// Validation Schema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse ein").max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  service: z.string().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Nachricht muss mindestens 10 Zeichen lang sein").max(2000),
});

export default function NeXifySupport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);

      const { data, error } = await supabase.functions.invoke("send-nexify-contact", {
        body: validatedData,
      });

      if (error) throw new Error(error.message || "Fehler beim Senden der Anfrage");

      toast({
        title: "Anfrage erfolgreich gesendet!",
        description: "Sie erhalten in Kürze eine Bestätigungs-E-Mail.",
      });

      setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validierungsfehler",
          description: "Bitte überprüfen Sie Ihre Eingaben",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fehler",
          description: error.message || "Anfrage fehlgeschlagen",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: Code,
      title: "Landingpage-Entwicklung",
      price: "ab 590€",
      description:
        "MyDispatch Widget-Integration, Responsive Design, SEO-optimiert, DSGVO-konform, 2-4 Wochen Umsetzungszeit.",
    },
    {
      icon: Server,
      title: "API-Integrationen",
      price: "ab 699€",
      description:
        "Externe Systeme anbinden: Zahlungsanbieter, E-Mail-Marketing, Buchhaltung, Webhooks und Monitoring.",
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      price: "ab 490€",
      description:
        "DSGVO-Audit, Security-Tests, ISO 27001 Beratung, Penetration Tests und Compliance-Checks.",
    },
    {
      icon: Zap,
      title: "Business Automatisierung",
      price: "ab 399€",
      description:
        "E-Mail-Marketing Automation, Lead-Management, KI-Chatbot Integration und Workflow-Optimierung.",
    },
    {
      icon: Database,
      title: "Datenbank-Migration",
      price: "ab 490€",
      description:
        "Import bestehender Daten, Synchronisation, Backup-Strategien und Performance-Optimierung.",
    },
    {
      icon: Cloud,
      title: "DevOps & Infrastructure",
      price: "auf Anfrage",
      description:
        "CI/CD Pipelines, Docker/Kubernetes, Monitoring, Logging und automatisierte Deployments.",
    },
  ];

  const supportPackages = [
    {
      icon: Clock,
      title: "Standard Support",
      description: "Reaktionszeit: 24h",
      price: "Inkludiert",
      features: ["E-Mail Support", "Ticket-System", "Wissensdatenbank", "Community Forum"],
    },
    {
      icon: Users,
      title: "Priority Support",
      description: "Reaktionszeit: 4h",
      price: "ab 199€/Monat",
      features: [
        "Telefon & E-Mail",
        "Prioritäts-Tickets",
        "Direkter Entwickler-Kontakt",
        "Monatliche Reviews",
      ],
      highlighted: true,
    },
    {
      icon: MessageSquare,
      title: "Enterprise Support",
      description: "Reaktionszeit: 1h",
      price: "Auf Anfrage",
      features: ["24/7 Hotline", "Dedicated Account Manager", "On-Site Besuche", "Custom SLA"],
    },
  ];

  const stats = [
    { value: "15+", label: "Jahre Erfahrung", sublabel: "Digitalisierung & KI" },
    { value: "Premium", label: "Enterprise Support", sublabel: "Persönlich betreut" },
    { value: "500+", label: "Projekte realisiert", sublabel: "Web & Automation" },
    { value: "98%", label: "Kundenzufriedenheit", sublabel: "Positive Bewertungen" },
  ];

  // Business Metrics für Hero (wie auf Home.tsx)
  const businessMetrics = [
    { label: "Jahre Erfahrung", value: "15+", sublabel: "Digitalisierung & KI" },
    { label: "Projekte", value: "500+", sublabel: "realisiert" },
    { label: "Zufriedenheit", value: "98%", sublabel: "Kundenbewertung" },
  ];

  return (
    <MarketingLayout currentPage="nexify">
      <SEOHead
        title="NeXify IT-Support – Technischer Support für MyDispatch"
        description="Professioneller technischer Support für MyDispatch. Landingpages ab 590€, API-Integration, Automatisierung. DSGVO-konform, Made in Germany."
        canonical="/nexify-support"
        schema={organizationSchema}
        keywords={[
          "NeXify Support",
          "MyDispatch Support",
          "Landingpage Entwicklung",
          "API Integration",
          "Business Automatisierung",
          "DSGVO-konform",
        ]}
      />

      {/* ==================================================================================
          HERO SECTION - V28HeroPremium
          ================================================================================== */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: "Offizieller Technologiepartner", icon: Award }}
        title="Digitalisierung für Ihr MyDispatch-Unternehmen"
        subtitle="Über 15 Jahre Expertise in IT-Lösungen"
        description="Spezialisierte IT-Dienstleistungen für Taxi-, Mietwagen- und Limousinenunternehmen. Von der Landingpage bis zur kompletten API-Integration."
        primaryCTA={{
          label: "Jetzt anfragen",
          onClick: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
        }}
        businessMetrics={businessMetrics}
        visual={<PremiumDashboardContent pageType="nexify-support" />}
      />

      {/* ==================================================================================
          SERVICES SECTION
          ================================================================================== */}
      <V28MarketingSection
        id="services"
        background="canvas"
        title="Unsere Leistungen"
        description="Spezialisierte IT-Dienstleistungen für Ihr MyDispatch-Unternehmen – von der Landingpage bis zur kompletten API-Integration"
      >
        <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
          {services.map((service, idx) => (
            <V28MarketingCard
              key={idx}
              className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
            >
              <Stack spacing="md">
                <Flex direction="row" gap="md" align="start">
                  <V28IconBox icon={service.icon} variant="slate" />
                  <div className="flex-1">
                    <div className="font-sans text-2xl font-bold text-slate-900 mb-1">
                      {service.price}
                    </div>
                    <h3 className="font-sans text-lg font-semibold text-slate-900">
                      {service.title}
                    </h3>
                  </div>
                </Flex>
                <p className="font-sans text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
              </Stack>
            </V28MarketingCard>
          ))}
        </Grid>
      </V28MarketingSection>

      {/* ==================================================================================
          SUPPORT PACKAGES SECTION
          ================================================================================== */}
      <V28MarketingSection
        background="white"
        title="Support-Pakete"
        description="Wählen Sie das passende Support-Level für Ihre Anforderungen"
      >
        <Grid cols={{ default: 1, md: 3 }} gap="lg">
          {supportPackages.map((option, idx) => (
            <V28MarketingCard
              key={idx}
              className={
                option.highlighted
                  ? "ring-2 ring-slate-700 shadow-2xl transform md:scale-[1.05]"
                  : ""
              }
            >
              <Stack spacing="lg">
                <Flex direction="column" gap="md">
                  <V28IconBox icon={option.icon} variant="slate" />
                  <div>
                    <h3 className="font-sans text-xl font-semibold text-slate-900 mb-1">
                      {option.title}
                    </h3>
                    <p className="font-sans text-sm text-slate-600">{option.description}</p>
                  </div>
                </Flex>

                <div>
                  <div className="font-sans text-3xl font-bold text-slate-900">{option.price}</div>
                </div>

                <ul className="space-y-2">
                  {option.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-700 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <V28Button
                  variant={option.highlighted ? "primary" : "secondary"}
                  size="md"
                  onClick={() =>
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full"
                >
                  Jetzt anfragen
                </V28Button>
              </Stack>
            </V28MarketingCard>
          ))}
        </Grid>
      </V28MarketingSection>

      {/* ==================================================================================
          CONTACT FORM SECTION
          ================================================================================== */}
      <V28MarketingSection
        id="contact"
        background="canvas"
        title="Direkter Kontakt zu NeXify"
        description="Senden Sie uns Ihre Anfrage und wir melden uns innerhalb von 24 Stunden bei Ihnen"
      >
        <Container size="lg" padding="none">
          <Grid cols={{ default: 1, lg: 2 }} gap="xl">
            {/* Contact Form */}
            <V28MarketingCard>
              <form onSubmit={handleSubmit}>
                <Stack spacing="lg">
                  <h3 className="font-sans text-2xl font-semibold text-slate-900">
                    Anfrage senden
                  </h3>

                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ihr Name"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ihre.email@firma.de"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+49 ..."
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="company">Unternehmen</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Firmenname"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">Gewünschte Leistung</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Bitte wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="landingpage">Landingpage-Entwicklung</SelectItem>
                        <SelectItem value="api">API-Integration</SelectItem>
                        <SelectItem value="security">Security & Compliance</SelectItem>
                        <SelectItem value="automation">Business Automatisierung</SelectItem>
                        <SelectItem value="migration">Datenbank-Migration</SelectItem>
                        <SelectItem value="devops">DevOps & Infrastructure</SelectItem>
                        <SelectItem value="other">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Ihre Nachricht *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Beschreiben Sie Ihr Anliegen..."
                      rows={5}
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                    )}
                  </div>

                  <V28Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    Anfrage senden
                  </V28Button>

                  <V28InfoBox type="legal">
                    <p className="text-xs text-slate-600">
                      Ihre Daten werden gemäß DSGVO verarbeitet. Weitere Informationen in unserer{" "}
                      <a href="/datenschutz" className="underline hover:text-slate-900">
                        Datenschutzerklärung
                      </a>
                      .
                    </p>
                  </V28InfoBox>
                </Stack>
              </form>
            </V28MarketingCard>

            {/* Contact Info */}
            <div>
              <Stack spacing="lg">
                <V28MarketingCard>
                  <Stack spacing="md" align="center">
                    <V28IconBox icon={Mail} variant="slate" />
                    <h3 className="font-sans text-lg font-semibold text-slate-900">E-Mail</h3>
                    <a
                      href="mailto:support@nexify.nl"
                      className="font-sans text-base text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      support@nexify.nl
                    </a>
                  </Stack>
                </V28MarketingCard>

                <V28MarketingCard>
                  <Stack spacing="md" align="center">
                    <V28IconBox icon={Phone} variant="slate" />
                    <h3 className="font-sans text-lg font-semibold text-slate-900">Telefon</h3>
                    <a
                      href="tel:+49123456789"
                      className="font-sans text-base text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      +49 123 456 789
                    </a>
                  </Stack>
                </V28MarketingCard>

                <V28MarketingCard>
                  <Stack spacing="md" align="center">
                    <V28IconBox icon={Clock} variant="slate" />
                    <h3 className="font-sans text-lg font-semibold text-slate-900">
                      Erreichbarkeit
                    </h3>
                    <p className="font-sans text-sm text-center text-slate-600">
                      Mo-Fr: 9:00 - 18:00 Uhr
                      <br />
                      24/7 Priority & Enterprise Support
                    </p>
                  </Stack>
                </V28MarketingCard>
              </Stack>
            </div>
          </Grid>
        </Container>
      </V28MarketingSection>

      {/* ==================================================================================
          FINAL CTA SECTION
          ================================================================================== */}
      <Section spacing="xl" background="white">
        <Container size="lg" padding="lg">
          <div className="text-center">
            <Stack spacing="lg" align="center">
              <h2
                className="font-sans font-bold tracking-tight text-slate-900"
                style={{
                  fontSize: "clamp(2rem, 3vw + 1rem, 3rem)",
                  textWrap: "balance",
                }}
              >
                Bereit für professionellen IT-Support?
              </h2>

              <p
                className="font-sans leading-relaxed max-w-2xl text-center text-slate-600"
                style={{
                  fontSize: "clamp(1rem, 1.25vw + 0.25rem, 1.25rem)",
                  textWrap: "pretty",
                }}
              >
                Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch. Wir finden die
                passende Lösung für Ihre Anforderungen.
              </p>

              <Flex justify="center" gap="md">
                <V28Button
                  variant="primary"
                  size="lg"
                  onClick={() =>
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Kontakt aufnehmen
                </V28Button>

                <V28Button
                  variant="secondary"
                  size="lg"
                  onClick={() => window.open("tel:+49123456789")}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Anrufen
                </V28Button>
              </Flex>

              {/* Trust Badge */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="text-slate-700">✓</span>
                  <span>DSGVO-konform</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-700">✓</span>
                  <span>Made in Germany</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-700">✓</span>
                  <span>15+ Jahre Erfahrung</span>
                </span>
              </div>
            </Stack>
          </div>
        </Container>
      </Section>
    </MarketingLayout>
  );
}
