/* ==================================================================================
   THEMATISCHE DASHBOARD PREVIEWS - FÜR HERO IPAD SHOWCASES
   ==================================================================================
   ✅ Jede Pre-Login-Seite erhält thematisch passenden Dashboard-Content
   ✅ Vereinfachte, schnelle Previews (keine echten Daten)
   ✅ V28.1 Design System Compliance
   ================================================================================== */

import type { FileText} from 'lucide-react';
import { Euro, Users, Car, MapPin, Navigation, CreditCard, CheckCircle, Award, MessageSquare, TrendingUp } from 'lucide-react';

// Reusable KPI Card Component
function MiniKPI({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-xs text-slate-600 font-medium">{label}</div>
      {trend && <div className="text-xs text-emerald-600 font-semibold mt-1">↑ {trend}</div>}
    </div>
  );
}

// Reusable Activity Row Component
function MiniActivity({ icon: Icon, title, subtitle }: { icon: typeof FileText; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">{title}</div>
        <div className="text-xs text-slate-600 truncate">{subtitle}</div>
      </div>
    </div>
  );
}

// Home: Standard Dashboard mit KPIs
export function HomeDashboardPreview() {
  return (
    <div className="bg-slate-50 p-6 space-y-4 min-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">my-dispatch.de</h2>
        <div className="w-8 h-8 rounded-full bg-slate-900" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <MiniKPI label="Aufträge heute" value="127" trend="+12%" />
        <MiniKPI label="Umsatz heute" value="8.450 €" trend="+8%" />
        <MiniKPI label="Aktive Fahrer" value="24" />
        <MiniKPI label="Fahrzeuge" value="18" />
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-semibold text-slate-700 mb-2">Letzte Aktivitäten</div>
        <MiniActivity icon={Car} title="Neue Fahrt" subtitle="Zentrale → Flughafen" />
        <MiniActivity icon={CheckCircle} title="Fahrt abgeschlossen" subtitle="45,00 € bezahlt" />
        <MiniActivity icon={TrendingUp} title="Umsatz +15%" subtitle="Vergleich zu gestern" />
      </div>
    </div>
  );
}

// Features: GPS-Tracking Dashboard
export function FeaturesDashboardPreview() {
  return (
    <div className="bg-slate-50 p-6 space-y-4 min-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">GPS-Echtzeit-Tracking</h2>
        <div className="w-8 h-8 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <MiniKPI label="Live-Fahrten" value="18" trend="aktiv" />
        <MiniKPI label="Ø ETA" value="4 Min" trend="pünktlich" />
      </div>
      
      <div className="h-[200px] bg-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-slate-100" />
        <MapPin className="w-12 h-12 text-emerald-600 relative z-10" />
      </div>
      
      <div className="space-y-2">
        <MiniActivity icon={MapPin} title="Fahrzeug 4" subtitle="Auf dem Weg (2,3 km)" />
        <MiniActivity icon={Navigation} title="Route optimiert" subtitle="-5 Min Fahrtzeit" />
      </div>
    </div>
  );
}

// Pricing: Tarif-Übersicht Dashboard
export function PricingDashboardPreview() {
  return (
    <div className="bg-slate-50 p-6 space-y-4 min-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Tarif-Management</h2>
        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
          Business
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <MiniKPI label="Akt. Tarif" value="Business" />
        <MiniKPI label="Kosten" value="79 €/M" trend="-20%" />
      </div>
      
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Nächste Abrechnung</span>
          <span className="text-sm font-bold text-slate-900">15.02.2025</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-emerald-500" />
        </div>
        <div className="text-xs text-slate-600">22 von 30 Tagen genutzt</div>
      </div>
      
      <div className="space-y-2">
        <MiniActivity icon={CreditCard} title="Zahlung erfolgreich" subtitle="SEPA-Lastschrift" />
        <MiniActivity icon={CheckCircle} title="Upgrade möglich" subtitle="Zu Enterprise" />
      </div>
    </div>
  );
}

// About: Team/Company Dashboard
export function AboutDashboardPreview() {
  return (
    <div className="bg-slate-50 p-6 space-y-4 min-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Über MyDispatch</h2>
        <Award className="w-8 h-8 text-amber-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <MiniKPI label="Seit" value="2010" trend="15 Jahre" />
        <MiniKPI label="Kunden" value="450+" trend="zufrieden" />
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-slate-200" />
          <div>
            <div className="text-sm font-bold text-slate-900">Pascal Courbois</div>
            <div className="text-xs text-slate-600">CEO & Gründer</div>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          "Von Taxi-Experten für Taxi-Experten entwickelt"
        </p>
      </div>
      
      <div className="space-y-2">
        <MiniActivity icon={Users} title="Team-Mitglied" subtitle="Pascal Courbois - CEO" />
        <MiniActivity icon={Award} title="Auszeichnung" subtitle="Made in Germany" />
      </div>
    </div>
  );
}

// Contact: Support-Dashboard
export function ContactDashboardPreview() {
  return (
    <div className="bg-slate-50 p-6 space-y-4 min-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Support & Kontakt</h2>
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <MiniKPI label="Antwortzeit" value="< 2h" trend="werktags" />
        <MiniKPI label="Zufriedenheit" value="98%" trend="★★★★★" />
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Support-Ticket #1234</span>
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">
            Bearbeitung
          </span>
        </div>
        <p className="text-xs text-slate-600">
          Ihre Anfrage wird gerade bearbeitet...
        </p>
      </div>
      
      <div className="space-y-2">
        <MiniActivity icon={MessageSquare} title="Neue Anfrage" subtitle="Bearbeitung läuft..." />
        <MiniActivity icon={CheckCircle} title="Ticket gelöst" subtitle="Kunde zufrieden" />
      </div>
    </div>
  );
}
