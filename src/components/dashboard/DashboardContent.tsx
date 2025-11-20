/* ==================================================================================
   DASHBOARD CONTENT RENDERER V31.6
   ==================================================================================
   ✅ Zentraler Switch für thematische Dashboards
   ✅ Dynamisches Rendering basierend auf pageType
   ✅ Alle Dashboards aus ThematicDashboards importiert
   ✅ Fallback auf HomeDashboardPreview
   ================================================================================== */

import {
  HomeDashboardPreview,
  FeaturesDashboardPreview,
  PricingDashboardPreview,
  AboutDashboardPreview,
  ContactDashboardPreview,
} from "@/components/preview";
import {
  Car,
  MapPin,
  FileText,
  Euro,
  Users,
  BarChart3,
  Calendar,
  Shield,
  Headset,
  BookOpen,
  Building2,
  TrendingUp,
  Handshake,
} from "lucide-react";
import { V28BrowserMockup } from "@/components/home/V28BrowserMockup";

// Typen für Page Types
export type PageType =
  | "home"
  | "features"
  | "pricing"
  | "about"
  | "contact"
  | "fahrer-fahrzeuge"
  | "auftragsverwaltung"
  | "rechnungsstellung"
  | "partner-management"
  | "statistiken"
  | "buchungswidget"
  | "live-traffic"
  | "nexify-support"
  | "terms"
  | "impressum"
  | "datenschutz"
  | "agb"
  | "faq";

interface DashboardContentProps {
  pageType: PageType;
}

// Mini-Dashboard-Komponenten für Seiten ohne eigenes Dashboard
function MiniKPI({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Car }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-xs font-medium text-slate-600">{label}</span>
        <div className="p-1.5 rounded-lg bg-slate-50">
          <Icon className="w-4 h-4 text-slate-700" />
        </div>
      </div>
      <div className="font-sans text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function GenericDashboard({
  title,
  kpis,
}: {
  title: string;
  kpis: { label: string; value: string; icon: typeof Car }[];
}) {
  return (
    <div className="hidden lg:block animate-fade-in-delay-400">
      <V28BrowserMockup title={title}>
        <div className="p-6 space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="font-sans text-xl font-bold text-slate-900">{title}</h3>
            <div className="px-2 py-1 rounded-lg bg-green-100 ring-1 ring-green-200">
              <span className="font-sans text-xs font-bold text-green-700">Live</span>{" "}
              {/* ✅ Status Exception */}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {kpis.map((kpi, idx) => (
              <MiniKPI key={idx} {...kpi} />
            ))}
          </div>
        </div>
      </V28BrowserMockup>
    </div>
  );
}

export function DashboardContent({ pageType }: DashboardContentProps) {
  switch (pageType) {
    case "home":
      return <HomeDashboardPreview />;

    case "features":
      return <FeaturesDashboardPreview />;

    case "pricing":
      return <PricingDashboardPreview />;

    case "about":
      return <AboutDashboardPreview />;

    case "contact":
      return <ContactDashboardPreview />;

    case "fahrer-fahrzeuge":
      return (
        <GenericDashboard
          title="my-dispatch.de/fahrer-fahrzeuge"
          kpis={[
            { label: "Aktive Fahrer", value: "24", icon: Users },
            { label: "Fahrzeuge", value: "18", icon: Car },
            { label: "Auslastung", value: "87%", icon: BarChart3 },
            { label: "Verfügbar", value: "6", icon: MapPin },
          ]}
        />
      );

    case "auftragsverwaltung":
      return (
        <GenericDashboard
          title="my-dispatch.de/auftraege"
          kpis={[
            { label: "Heute", value: "127", icon: FileText },
            { label: "Aktiv", value: "18", icon: Car },
            { label: "Abgeschlossen", value: "109", icon: BarChart3 },
            { label: "Geplant", value: "34", icon: Calendar },
          ]}
        />
      );

    case "rechnungsstellung":
      return (
        <GenericDashboard
          title="my-dispatch.de/rechnungen"
          kpis={[
            { label: "Umsatz heute", value: "8.450 €", icon: Euro },
            { label: "Offene Rechnungen", value: "12", icon: FileText },
            { label: "Bezahlt", value: "89", icon: BarChart3 },
            { label: "Überfällig", value: "3", icon: TrendingUp },
          ]}
        />
      );

    case "partner-management":
      return (
        <GenericDashboard
          title="my-dispatch.de/partner"
          kpis={[
            { label: "Partner", value: "12", icon: Handshake },
            { label: "Aufträge", value: "45", icon: FileText },
            { label: "Provision", value: "2.340 €", icon: Euro },
            { label: "Aktiv", value: "9", icon: Users },
          ]}
        />
      );

    case "statistiken":
      return (
        <GenericDashboard
          title="my-dispatch.de/statistiken"
          kpis={[
            { label: "Umsatz", value: "45.670 €", icon: Euro },
            { label: "Fahrten", value: "1.234", icon: Car },
            { label: "Ø Auslastung", value: "82%", icon: BarChart3 },
            { label: "Top-Fahrer", value: "24", icon: TrendingUp },
          ]}
        />
      );

    case "buchungswidget":
      return (
        <GenericDashboard
          title="my-dispatch.de/buchungen"
          kpis={[
            { label: "Online-Buchungen", value: "67", icon: Calendar },
            { label: "Heute", value: "12", icon: FileText },
            { label: "Diese Woche", value: "89", icon: BarChart3 },
            { label: "Conversion", value: "34%", icon: TrendingUp },
          ]}
        />
      );

    case "live-traffic":
      return (
        <GenericDashboard
          title="my-dispatch.de/live-traffic"
          kpis={[
            { label: "Live-Fahrten", value: "18", icon: MapPin },
            { label: "Ø ETA", value: "4 Min", icon: Car },
            { label: "Staus", value: "3", icon: BarChart3 },
            { label: "Wetter", value: "☀️ 18°", icon: TrendingUp },
          ]}
        />
      );

    case "nexify-support":
      return (
        <GenericDashboard
          title="my-dispatch.de/nexify"
          kpis={[
            { label: "Support-Tickets", value: "12", icon: Headset },
            { label: "Offen", value: "3", icon: FileText },
            { label: "Gelöst", value: "9", icon: BarChart3 },
            { label: "Ø Antwortzeit", value: "< 2h", icon: TrendingUp },
          ]}
        />
      );

    case "terms":
    case "impressum":
    case "datenschutz":
    case "agb":
      return (
        <GenericDashboard
          title="my-dispatch.de/rechtliches"
          kpis={[
            { label: "DSGVO", value: "✓", icon: Shield },
            { label: "Made in DE", value: "✓", icon: Building2 },
            { label: "Zertifiziert", value: "✓", icon: BarChart3 },
            { label: "Sicher", value: "100%", icon: Shield },
          ]}
        />
      );

    case "faq":
      return (
        <GenericDashboard
          title="my-dispatch.de/faq"
          kpis={[
            { label: "FAQ-Artikel", value: "45", icon: BookOpen },
            { label: "Kategorien", value: "8", icon: FileText },
            { label: "Hilfreich", value: "98%", icon: BarChart3 },
            { label: "Support", value: "24/7", icon: Headset },
          ]}
        />
      );

    default:
      return <HomeDashboardPreview />;
  }
}
