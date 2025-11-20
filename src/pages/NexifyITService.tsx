/* ==================================================================================
   NEXIFY IT-SERVICE - NEUE HERO-SEITE
   ==================================================================================
   ✅ V28.1 Design System (Slate-Palette)
   ✅ MarketingLayout + V28MarketingSection
   ✅ Service-Features (6 Cards)
   ✅ Pricing/Packages
   ✅ Contact CTA
   ================================================================================== */

import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { V28HeroBackground } from "@/components/hero/V28HeroBackground";
import { V28ITDashboardPreview } from "@/components/home/V28ITDashboardPreview";
import { HeroTrustStats } from "@/components/hero/HeroTrustStats";
import { V28Button } from "@/components/design-system/V28Button";
import { SEOHead } from "@/components/shared/SEOHead";
import {
  Server,
  Shield,
  Zap,
  Headphones,
  Code2,
  Monitor,
  CheckCircle2,
  Mail,
  Phone,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Server,
    title: "Server-Management",
    description:
      "24/7 Monitoring und Wartung Ihrer Server-Infrastruktur. Proaktive Problemlösung bevor Ausfälle entstehen.",
  },
  {
    icon: Shield,
    title: "IT-Security",
    description:
      "Umfassende Security-Audits, Firewall-Konfiguration und Incident Response. Ihre Daten sind bei uns sicher.",
  },
  {
    icon: Code2,
    title: "Software-Entwicklung",
    description:
      "Maßgeschneiderte Software-Lösungen für Ihre individuellen Anforderungen. Von der Konzeption bis zum Deployment.",
  },
  {
    icon: Monitor,
    title: "System-Monitoring",
    description:
      "Echtzeit-Überwachung aller IT-Systeme. Automatische Alerts bei kritischen Events und Performance-Problemen.",
  },
  {
    icon: Headphones,
    title: "Premium-Support",
    description:
      "Schnelle Hilfe bei allen IT-Problemen. Unser Support-Team ist für Sie da - persönlich, kompetent und lösungsorientiert.",
  },
  {
    icon: Zap,
    title: "Performance-Optimierung",
    description:
      "Analyse und Optimierung Ihrer IT-Systeme. Schnellere Ladezeiten, bessere Stabilität und zufriedenere Nutzer.",
  },
];

const packages = [
  {
    name: "Basic Support",
    price: "99€",
    period: "Monat",
    features: [
      "E-Mail Support (Mo-Fr)",
      "10 Support-Tickets/Monat",
      "System-Monitoring (Basic)",
      "Monatlicher Status-Report",
    ],
  },
  {
    name: "Business Support",
    price: "299€",
    period: "Monat",
    highlighted: true,
    features: [
      "Telefon + E-Mail Support",
      "Keine Limit bei Tickets",
      "Premium-Monitoring 24/7",
      "Proaktive Wartung",
      "Incident Response (4h)",
      "Wöchentliche Reports",
    ],
  },
  {
    name: "Enterprise Support",
    price: "Individuell",
    period: "nach Bedarf",
    features: [
      "Dedizierter Account Manager",
      "SLA-Garantie (99,9%)",
      "Incident Response (1h)",
      "On-Site-Service inkl.",
      "Custom Monitoring",
      "Tägliche Reports",
    ],
  },
];

export default function NexifyITService() {
  const navigate = useNavigate();

  // Trust Stats für Hero
  const trustStats = [
    { icon: Clock, label: "24/7", sublabel: "Premium Support" },
    { icon: TrendingUp, label: "99.9%", sublabel: "SLA-Garantie" },
    { icon: Zap, label: "< 1h", sublabel: "Response Time" },
    { icon: Award, label: "ISO", sublabel: "Zertifiziert" },
  ];

  return (
    <MarketingLayout>
      <SEOHead
        title="NeXify IT-Service - Premium IT-Support für Unternehmen"
        description="24/7 Premium IT-Support mit SLA-Garantie. Server-Management, Cloud-Solutions, Software-Entwicklung und mehr. Made in Germany."
        keywords={[
          "IT-Service",
          "IT-Support",
          "Server-Management",
          "Cloud-Solutions",
          "Software-Entwicklung",
          "24/7-Support",
          "Premium-IT",
        ]}
      />

      {/* Hero Section - 2-Column Layout wie Home.tsx */}
      <section className="relative min-h-[700px] md:min-h-screen flex items-center overflow-hidden">
        <V28HeroBackground />

        <div className="relative z-10 w-full px-4 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Text Content */}
              <div className="space-y-6 animate-fade-in">
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-slate-700" />
                  <span className="font-sans text-sm font-semibold text-slate-700">
                    Premium IT-Support - Made in Germany
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                  Premium IT-Service für professionelle Ansprüche
                </h1>

                {/* Subheading */}
                <h2 className="font-sans text-xl md:text-2xl font-semibold text-slate-700">
                  24/7 Support mit SLA-Garantie
                </h2>

                {/* Description */}
                <p className="font-sans text-lg text-slate-600 leading-relaxed max-w-xl">
                  Von Server-Management bis Software-Entwicklung – Ihr IT-Partner für langfristigen
                  Erfolg. Persönlicher Ansprechpartner, schnelle Response-Zeiten und höchste
                  Qualitätsstandards.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <V28Button
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => navigate("/contact")}
                  >
                    Unverbindliches Beratungsgespräch
                  </V28Button>
                  <V28Button
                    variant="secondary"
                    size="lg"
                    onClick={() => (window.location.href = "#services")}
                  >
                    Services entdecken
                  </V28Button>
                </div>

                {/* Trust Stats */}
                <HeroTrustStats stats={trustStats} animationDelay="0.3s" />
              </div>

              {/* Right: IT Dashboard Preview */}
              <V28ITDashboardPreview animationDelay="0.6s" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <V28MarketingSection
        id="services"
        background="white"
        title="Unsere IT-Services"
        description="Umfassende IT-Dienstleistungen für Unternehmen jeder Größe"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <V28MarketingCard
              key={index}
              className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              <V28IconBox icon={service.icon} variant="slate" />
              <h3 className="font-sans text-lg font-semibold text-slate-900 mt-4 mb-2">
                {service.title}
              </h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </V28MarketingCard>
          ))}
        </div>
      </V28MarketingSection>

      {/* Pricing Section */}
      <V28MarketingSection
        background="canvas"
        title="Support-Pakete"
        description="Flexibler IT-Support für jedes Budget"
      >
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <V28MarketingCard
              key={index}
              className={`transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                pkg.highlighted ? "ring-2 ring-slate-500 shadow-2xl" : ""
              }`}
            >
              {pkg.highlighted && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold mb-4">
                  <CheckCircle2 className="h-4 w-4" />
                  Meistgewählt
                </div>
              )}
              <h3 className="font-sans text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">{pkg.price}</span>
                <span className="text-slate-600 ml-2">/ {pkg.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-slate-700 flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <V28Button
                className="w-full"
                variant={pkg.highlighted ? "primary" : "secondary"}
                onClick={() => navigate("/contact?service=" + encodeURIComponent(pkg.name))}
              >
                {pkg.price === "Individuell" ? "Angebot anfragen" : "Paket auswählen"}
              </V28Button>
            </V28MarketingCard>
          ))}
        </div>
      </V28MarketingSection>

      {/* CTA Section */}
      <V28MarketingSection background="white">
        <div className="max-w-3xl mx-auto text-center">
          <V28MarketingCard className="ring-2 ring-slate-300 shadow-2xl">
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Bereit für professionellen IT-Support?
            </h2>
            <p className="font-sans text-lg text-slate-600 mb-8">
              Kontaktieren Sie uns für eine kostenlose Erstberatung. Wir finden die optimale Lösung
              für Ihre IT-Anforderungen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <V28Button size="lg" onClick={() => navigate("/contact")}>
                <Mail className="h-5 w-5 mr-2" />
                E-Mail schreiben
              </V28Button>
              <V28Button
                size="lg"
                variant="secondary"
                onClick={() => (window.location.href = "tel:+31613318856")}
              >
                <Phone className="h-5 w-5 mr-2" />
                Anrufen
              </V28Button>
            </div>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
