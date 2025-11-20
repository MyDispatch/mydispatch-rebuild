/* ==================================================================================
   COMING SOON PAGE - MYDISPATCH SERVICE-ROADMAP
   ==================================================================================
   ✅ Vollständige Roadmap für 35 neue Service-Erweiterungen
   ✅ Erste Veröffentlichung: 30.11.2025, 00:00 Uhr
   ✅ Realistische Timelines (manuelle Arbeit, keine KI-Stunden)
   ✅ 2-4 Features pro Monat, je nach Aufwand
   ==================================================================================
   ERREICHBAR: Unternehmer (Portal), Öffentlich (my-dispatch.de)
   ================================================================================== */

import React, { useState } from "react";
import {
  Rocket,
  Calendar,
  MapPin,
  CreditCard,
  BarChart3,
  Brain,
  Smartphone,
  Zap,
  Users,
  Package,
  Bell,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  Star,
  Repeat,
  Euro,
  Route,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { V28Button } from "@/components/design-system/V28Button";
import { Badge } from "@/components/ui/badge";
import { SafeIcon } from "@/components/base/SafeIcon";
import { Heading, Body } from "@/components/base/Typography";
import { EnhancedCard } from "@/components/base/EnhancedCard";
import { useContent } from "@/hooks/useContent";
import { toast } from "sonner";

// ==================================================================================
// SERVICE-ERWEITERUNGEN MIT RELEASE-TERMINEN
// ==================================================================================

interface ServiceFeature {
  id: number;
  name: string;
  description: string;
  releaseDate: Date;
  category: "booking" | "payment" | "analytics" | "ai" | "mobile" | "integration" | "business";
  effort: "low" | "medium" | "high";
  icon: any;
}

const SERVICE_FEATURES: ServiceFeature[] = [
  // November 2025 - Erste Release (1 Feature)
  {
    id: 1,
    name: "Multi-Stop-Routing",
    description: "Optimierte Routenplanung mit mehreren Zwischenstopps",
    releaseDate: new Date("2025-11-30T00:00:00"),
    category: "booking",
    effort: "high",
    icon: Route,
  },

  // Dezember 2025 (3 Features)
  {
    id: 2,
    name: "Recurring Bookings",
    description: "Wiederkehrende Fahrten automatisch planen",
    releaseDate: new Date("2025-12-07T00:00:00"),
    category: "booking",
    effort: "medium",
    icon: Repeat,
  },
  {
    id: 3,
    name: "Split-Payment",
    description: "Aufteilung der Kosten auf mehrere Zahlungsquellen",
    releaseDate: new Date("2025-12-14T00:00:00"),
    category: "payment",
    effort: "medium",
    icon: CreditCard,
  },
  {
    id: 4,
    name: "Dynamic Pricing",
    description: "KI-basierte Preisanpassung nach Auslastung",
    releaseDate: new Date("2025-12-21T00:00:00"),
    category: "ai",
    effort: "high",
    icon: Euro,
  },

  // Januar 2026 (4 Features)
  {
    id: 5,
    name: "Driver Performance Dashboard",
    description: "Detaillierte Leistungsanalyse für jeden Fahrer",
    releaseDate: new Date("2026-01-11T00:00:00"),
    category: "analytics",
    effort: "medium",
    icon: BarChart3,
  },
  {
    id: 6,
    name: "Customer Loyalty Program",
    description: "Treueprogramm mit Punktesystem",
    releaseDate: new Date("2026-01-18T00:00:00"),
    category: "business",
    effort: "medium",
    icon: Star,
  },
  {
    id: 7,
    name: "Fleet Maintenance Predictor",
    description: "KI-basierte Wartungsvorhersage",
    releaseDate: new Date("2026-01-25T00:00:00"),
    category: "ai",
    effort: "high",
    icon: Brain,
  },
  {
    id: 8,
    name: "QR-Code Check-In",
    description: "Kontaktloses Ein-/Auschecken per QR-Code",
    releaseDate: new Date("2026-01-31T00:00:00"),
    category: "mobile",
    effort: "low",
    icon: Smartphone,
  },

  // Februar 2026 (3 Features)
  {
    id: 9,
    name: "In-App-Zahlungen",
    description: "Direktzahlung in der Fahrer-App",
    releaseDate: new Date("2026-02-08T00:00:00"),
    category: "payment",
    effort: "high",
    icon: CreditCard,
  },
  {
    id: 10,
    name: "Automated Invoicing",
    description: "Automatische Rechnungserstellung nach Fahrt",
    releaseDate: new Date("2026-02-15T00:00:00"),
    category: "business",
    effort: "medium",
    icon: FileText,
  },
  {
    id: 11,
    name: "Customer Rating System",
    description: "Bewertungssystem für Kunden",
    releaseDate: new Date("2026-02-22T00:00:00"),
    category: "booking",
    effort: "medium",
    icon: Star,
  },

  // März 2026 (4 Features)
  {
    id: 12,
    name: "Airport Priority Queue",
    description: "Bevorzugte Warteschlange für Flughafen-Fahrten",
    releaseDate: new Date("2026-03-08T00:00:00"),
    category: "booking",
    effort: "medium",
    icon: MapPin,
  },
  {
    id: 13,
    name: "Expense Tracking",
    description: "Automatische Spesenverfolgung",
    releaseDate: new Date("2026-03-15T00:00:00"),
    category: "business",
    effort: "medium",
    icon: Euro,
  },
  {
    id: 14,
    name: "Driver Shift Optimizer",
    description: "KI-optimierte Schichtplanung",
    releaseDate: new Date("2026-03-22T00:00:00"),
    category: "ai",
    effort: "high",
    icon: Calendar,
  },
  {
    id: 15,
    name: "Push-Benachrichtigungen",
    description: "Echtzeit-Benachrichtigungen für alle Apps",
    releaseDate: new Date("2026-03-29T00:00:00"),
    category: "mobile",
    effort: "medium",
    icon: Bell,
  },

  // April 2026 (3 Features)
  {
    id: 16,
    name: "WhatsApp-Integration",
    description: "Buchungen und Updates via WhatsApp",
    releaseDate: new Date("2026-04-12T00:00:00"),
    category: "integration",
    effort: "high",
    icon: Smartphone,
  },
  {
    id: 17,
    name: "Heatmap Analytics",
    description: "Visualisierung von Hotspots und Trends",
    releaseDate: new Date("2026-04-19T00:00:00"),
    category: "analytics",
    effort: "medium",
    icon: TrendingUp,
  },
  {
    id: 18,
    name: "Driver Fatigue Monitor",
    description: "Überwachung der Fahrerermüdung",
    releaseDate: new Date("2026-04-26T00:00:00"),
    category: "ai",
    effort: "high",
    icon: Shield,
  },

  // Mai 2026 (4 Features)
  {
    id: 19,
    name: "Corporate Accounts",
    description: "Firmenkunden-Verwaltung mit Rahmenverträgen",
    releaseDate: new Date("2026-05-10T00:00:00"),
    category: "business",
    effort: "high",
    icon: Users,
  },
  {
    id: 20,
    name: "Fare Calculator API",
    description: "Öffentliche API für Preisberechnungen",
    releaseDate: new Date("2026-05-17T00:00:00"),
    category: "integration",
    effort: "medium",
    icon: Zap,
  },
  {
    id: 21,
    name: "Driver Training Portal",
    description: "Online-Schulungsplattform für Fahrer",
    releaseDate: new Date("2026-05-24T00:00:00"),
    category: "business",
    effort: "medium",
    icon: FileText,
  },
  {
    id: 22,
    name: "Offline Mode",
    description: "Offline-Funktionalität für Fahrer-App",
    releaseDate: new Date("2026-05-31T00:00:00"),
    category: "mobile",
    effort: "high",
    icon: Smartphone,
  },

  // Juni 2026 (3 Features)
  {
    id: 23,
    name: "Predictive Maintenance",
    description: "Vorausschauende Wartungsplanung",
    releaseDate: new Date("2026-06-14T00:00:00"),
    category: "ai",
    effort: "high",
    icon: Brain,
  },
  {
    id: 24,
    name: "Customer Referral Program",
    description: "Empfehlungsprogramm für Kunden",
    releaseDate: new Date("2026-06-21T00:00:00"),
    category: "business",
    effort: "medium",
    icon: Users,
  },
  {
    id: 25,
    name: "Route Optimization Engine",
    description: "Erweiterte Routenoptimierung mit Verkehrsdaten",
    releaseDate: new Date("2026-06-28T00:00:00"),
    category: "booking",
    effort: "high",
    icon: Route,
  },

  // Juli 2026 (2 Features)
  {
    id: 26,
    name: "Zapier Integration",
    description: "Automatisierung mit 5000+ Apps",
    releaseDate: new Date("2026-07-12T00:00:00"),
    category: "integration",
    effort: "medium",
    icon: Zap,
  },
  {
    id: 27,
    name: "Driver Leaderboard",
    description: "Gamification mit Rangliste",
    releaseDate: new Date("2026-07-26T00:00:00"),
    category: "mobile",
    effort: "low",
    icon: Star,
  },

  // August 2026 (2 Features)
  {
    id: 28,
    name: "Carbon Footprint Tracker",
    description: "CO2-Bilanz für Fahrten",
    releaseDate: new Date("2026-08-09T00:00:00"),
    category: "analytics",
    effort: "medium",
    icon: TrendingUp,
  },
  {
    id: 29,
    name: "Customer Preferences",
    description: "Gespeicherte Präferenzen (Musik, Temperatur, etc.)",
    releaseDate: new Date("2026-08-23T00:00:00"),
    category: "booking",
    effort: "medium",
    icon: Star,
  },

  // September 2026 (2 Features)
  {
    id: 30,
    name: "Multi-Language Support",
    description: "Mehrsprachige Oberfläche (EN, DE, FR, ES, IT)",
    releaseDate: new Date("2026-09-13T00:00:00"),
    category: "business",
    effort: "high",
    icon: Users,
  },
  {
    id: 31,
    name: "Driver Incentive Program",
    description: "Bonus-System für Top-Performer",
    releaseDate: new Date("2026-09-27T00:00:00"),
    category: "business",
    effort: "medium",
    icon: Euro,
  },

  // Oktober 2026 (2 Features)
  {
    id: 32,
    name: "Fleet Telematics",
    description: "Erweiterte Fahrzeug-Telematik",
    releaseDate: new Date("2026-10-11T00:00:00"),
    category: "analytics",
    effort: "high",
    icon: BarChart3,
  },
  {
    id: 33,
    name: "Customer Support Chat",
    description: "Live-Chat mit KI-Unterstützung",
    releaseDate: new Date("2026-10-25T00:00:00"),
    category: "ai",
    effort: "high",
    icon: Brain,
  },

  // November 2026 (2 Features)
  {
    id: 34,
    name: "Advanced Reporting",
    description: "Custom-Reports mit Export-Funktion",
    releaseDate: new Date("2026-11-08T00:00:00"),
    category: "analytics",
    effort: "medium",
    icon: BarChart3,
  },
  {
    id: 35,
    name: "White-Label Solution",
    description: "Vollständig anpassbare Branding-Lösung",
    releaseDate: new Date("2026-11-22T00:00:00"),
    category: "business",
    effort: "high",
    icon: Package,
  },
];

const FIRST_RELEASE = SERVICE_FEATURES[0];

// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================

const getCategoryColor = (category: ServiceFeature["category"]) => {
  const colors = {
    booking: "bg-primary/10 text-foreground border-primary/20",
    payment: "bg-primary/10 text-foreground border-primary/20",
    analytics: "bg-primary/15 text-foreground border-primary/30",
    ai: "bg-primary/15 text-foreground border-primary/30",
    mobile: "bg-primary/20 text-foreground border-primary/40",
    integration: "bg-primary/20 text-foreground border-primary/40",
    business: "bg-primary/25 text-foreground border-primary/50",
  };
  return colors[category] || "bg-muted text-foreground border-border";
};

const getCategoryLabel = (category: ServiceFeature["category"]) => {
  const labels = {
    booking: "Buchung",
    payment: "Zahlung",
    analytics: "Analytics",
    ai: "KI",
    mobile: "Mobile",
    integration: "Integration",
    business: "Business",
  };
  return labels[category];
};

const getEffortLabel = (effort: ServiceFeature["effort"]) => {
  const labels = {
    low: "2-3 Wochen",
    medium: "4-6 Wochen",
    high: "8-12 Wochen",
  };
  return labels[effort];
};

const groupByMonth = (features: ServiceFeature[]) => {
  const groups: { [key: string]: ServiceFeature[] } = {};

  features.forEach((feature) => {
    const monthKey = format(feature.releaseDate, "MMMM yyyy", { locale: de });
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(feature);
  });

  return Object.entries(groups).map(([month, features]) => ({
    month,
    features: features.sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime()),
  }));
};

// ==================================================================================
// COMPONENT
// ==================================================================================

export default function ComingSoon() {
  const content = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleNotify = () => {
    toast.success("Sie werden benachrichtigt, sobald neue Features verfügbar sind!");
  };

  const formatReleaseDate = (date: Date) => {
    return format(date, "dd. MMMM yyyy", { locale: de });
  };

  const filteredFeatures =
    selectedCategory === "all"
      ? SERVICE_FEATURES
      : SERVICE_FEATURES.filter((f) => f.category === selectedCategory);

  const monthlyGroups = groupByMonth(filteredFeatures);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 sm:p-5 md:p-6 rounded-full bg-primary/10">
              <SafeIcon icon={Rocket} size="xl" />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <Heading level={1} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              MyDispatch Service-Roadmap
            </Heading>
            <Body
              size="large"
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              35 neue Service-Erweiterungen in den nächsten 12 Monaten
            </Body>
          </div>

          {/* Next Release Highlight */}
          <EnhancedCard className="max-w-3xl mx-auto border-2 border-primary">
            <EnhancedCard.Content className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <SafeIcon icon={FIRST_RELEASE.icon} size="lg" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getCategoryColor(FIRST_RELEASE.category)}>
                      {getCategoryLabel(FIRST_RELEASE.category)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Nächstes Release</span>
                  </div>
                  <Heading level={3} className="mb-1">
                    {FIRST_RELEASE.name}
                  </Heading>
                  <Body className="text-muted-foreground mb-2">{FIRST_RELEASE.description}</Body>
                  <div className="flex items-center gap-2 text-sm">
                    <SafeIcon icon={Calendar} size="sm" color="text-muted-foreground" />
                    <span className="font-semibold text-primary">
                      {formatReleaseDate(FIRST_RELEASE.releaseDate)}
                    </span>
                  </div>
                </div>
              </div>
            </EnhancedCard.Content>
          </EnhancedCard>

          {/* CTA */}
          <V28Button size="lg" onClick={handleNotify} className="gap-2" variant="primary">
            <Bell className="h-5 w-5" />
            Benachrichtigung aktivieren
          </V28Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-y bg-background/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-2">
            <V28Button
              variant={selectedCategory === "all" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Alle ({SERVICE_FEATURES.length})
            </V28Button>
            {Array.from(new Set(SERVICE_FEATURES.map((f) => f.category))).map((cat) => (
              <V28Button
                key={cat}
                variant={selectedCategory === cat ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {getCategoryLabel(cat)} ({SERVICE_FEATURES.filter((f) => f.category === cat).length}
                )
              </V28Button>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          {monthlyGroups.map(({ month, features }) => (
            <div key={month} className="space-y-4">
              {/* Month Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <Heading level={2} className="text-xl">
                  {month}
                </Heading>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <EnhancedCard key={feature.id} variant="hover">
                    <EnhancedCard.Content className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <SafeIcon icon={feature.icon} size="md" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Heading level={4} className="text-base">
                              {feature.name}
                            </Heading>
                            <Badge className={getCategoryColor(feature.category)} variant="outline">
                              {getCategoryLabel(feature.category)}
                            </Badge>
                          </div>
                          <Body className="text-sm text-muted-foreground mb-3">
                            {feature.description}
                          </Body>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <SafeIcon icon={Calendar} size="xs" />
                              <span>{formatReleaseDate(feature.releaseDate)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <SafeIcon icon={Clock} size="xs" />
                              <span>{getEffortLabel(feature.effort)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </EnhancedCard.Content>
                  </EnhancedCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t bg-background/50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Heading level={2}>Verpassen Sie keine Neuigkeit</Heading>
            <Body className="text-muted-foreground">
              Aktivieren Sie Benachrichtigungen und erfahren Sie als Erster von neuen Features
            </Body>
            <V28Button size="lg" onClick={handleNotify} className="gap-2" variant="primary">
              <Bell className="h-5 w-5" />
              Jetzt aktivieren
            </V28Button>
          </div>
        </div>
      </div>
    </div>
  );
}
