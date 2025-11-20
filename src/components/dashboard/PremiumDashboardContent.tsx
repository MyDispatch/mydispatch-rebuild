/* ==================================================================================
   PREMIUM DASHBOARD CONTENT V32.0 - UNIVERSAL DASHBOARD SYSTEM
   ==================================================================================
   ✅ Pure Slate Design (slate-50 bis slate-900)
   ✅ Browser-Mockup mit Verkehrsampeln
   ✅ Dashboard-Configs für alle Pages
   ✅ 100% V28.1 Design System konform
   ================================================================================== */

import { 
  ArrowUpRight, Package, Users, Car, TrendingUp, Clock, CheckCircle, AlertCircle,
  Euro, Building2, Crown, Sparkles, MapPin, FileText, BarChart3,
  BookOpen, Video, HelpCircle, MessageSquare, Phone, Mail,
  Terminal, Code, Globe, Palette, Smartphone
} from 'lucide-react';
import { V28BrowserMockup } from '@/components/home/V28BrowserMockup';

export type PageType = 
  | 'home' | 'pricing' | 'features' | 'docs' | 'faq' | 'contact' 
  | 'impressum' | 'datenschutz' | 'agb' | 'nexify-support' | 'nutzungsbedingungen'
  | 'api-zugang' | 'custom-development' | 'support' | 'white-labeling';

interface PremiumDashboardContentProps {
  pageType?: PageType;
}

// V32.0: Dashboard Configurations für alle Pages
const DASHBOARD_CONFIGS = {
  home: {
    title: 'my-dispatch.de/dashboard',
    kpis: [
      { icon: Package, label: 'Aktive Aufträge', value: '142', trend: '+12%' },
      { icon: TrendingUp, label: 'Umsatz (Monat)', value: '€12.5k', trend: '+8%' },
      { icon: Users, label: 'Aktive Fahrer', value: '28', trend: '+3' },
      { icon: Car, label: 'Fahrzeugflotte', value: '35', trend: '+2' }
    ]
  },
  pricing: {
    title: 'my-dispatch.de/pricing',
    kpis: [
      { icon: Euro, label: 'Starter-Tarif', value: '39€', trend: 'Monatlich' },
      { icon: Building2, label: 'Business', value: '99€', trend: 'Beliebtester' },
      { icon: Crown, label: 'Enterprise', value: 'Custom', trend: 'Individuell' },
      { icon: Sparkles, label: 'Add-Ons', value: '15€', trend: 'Pro Einheit' }
    ]
  },
  features: {
    title: 'my-dispatch.de/features',
    kpis: [
      { icon: MapPin, label: 'GPS-Tracking', value: 'Live', trend: 'Echtzeit' },
      { icon: Car, label: 'Fuhrpark', value: '35', trend: 'Verwaltet' },
      { icon: FileText, label: 'Aufträge', value: '1.2k', trend: 'Monat' },
      { icon: BarChart3, label: 'Statistiken', value: '24/7', trend: 'Verfügbar' }
    ]
  },
  docs: {
    title: 'my-dispatch.de/docs',
    kpis: [
      { icon: BookOpen, label: 'Tutorials', value: '50+', trend: 'Artikel' },
      { icon: Video, label: 'Videos', value: '12', trend: 'Anleitungen' },
      { icon: HelpCircle, label: 'FAQs', value: '80+', trend: 'Antworten' },
      { icon: MessageSquare, label: 'Support', value: '<2h', trend: 'Antwortzeit' }
    ]
  },
  faq: {
    title: 'my-dispatch.de/faq',
    kpis: [
      { icon: HelpCircle, label: 'Kategorien', value: '5', trend: 'Themenbereiche' },
      { icon: FileText, label: 'Fragen', value: '80+', trend: 'Beantwortet' },
      { icon: Clock, label: 'Antwortzeit', value: '<24h', trend: 'Support' },
      { icon: Users, label: 'Zufriedenheit', value: '98%', trend: 'Kunden' }
    ]
  },
  contact: {
    title: 'my-dispatch.de/contact',
    kpis: [
      { icon: Mail, label: 'E-Mail', value: '<2h', trend: 'Antwortzeit' },
      { icon: Phone, label: 'Telefon', value: '24/7', trend: 'Verfügbar' },
      { icon: MessageSquare, label: 'Tickets', value: '450', trend: 'Gelöst' },
      { icon: CheckCircle, label: 'Zufriedenheit', value: '98%', trend: 'Rating' }
    ]
  },
  impressum: {
    title: 'my-dispatch.de/impressum',
    kpis: [
      { icon: FileText, label: 'Rechtliche Infos', value: '100%', trend: 'Transparent' },
      { icon: Building2, label: 'Unternehmen', value: '2', trend: 'Partner' },
      { icon: Mail, label: 'Kontakt', value: '<24h', trend: 'Support' },
      { icon: CheckCircle, label: 'DSGVO', value: 'Konform', trend: 'Geprüft' }
    ]
  },
  datenschutz: {
    title: 'my-dispatch.de/datenschutz',
    kpis: [
      { icon: FileText, label: 'DSGVO-Status', value: '100%', trend: 'Konform' },
      { icon: CheckCircle, label: 'SSL-Sicher', value: 'TLS 1.3', trend: 'Aktiv' },
      { icon: Users, label: 'Nutzerrechte', value: 'Alle', trend: 'Garantiert' },
      { icon: MapPin, label: 'Server-Standort', value: 'EU', trend: 'Deutschland' }
    ]
  },
  agb: {
    title: 'my-dispatch.de/agb',
    kpis: [
      { icon: FileText, label: 'Tarife', value: '3', trend: 'Verfügbar' },
      { icon: Euro, label: 'Ab', value: '39€', trend: 'Pro Monat' },
      { icon: CheckCircle, label: 'Vertrag', value: 'Monatlich', trend: 'Kündbar' },
      { icon: Crown, label: 'Enterprise', value: 'Custom', trend: 'Individuell' }
    ]
  },
  'nexify-support': {
    title: 'support.nexify.nl/dashboard',
    kpis: [
      { icon: CheckCircle, label: 'Server Uptime', value: '99.97%', trend: 'Online' },
      { icon: MessageSquare, label: 'Open Tickets', value: '12', trend: '3 Critical' },
      { icon: Clock, label: 'Response Time', value: '45 Min', trend: 'Schnell' },
      { icon: MapPin, label: 'Active Monitors', value: '87', trend: '24/7' }
    ]
  },
  'api-zugang': {
    title: 'my-dispatch.de/api',
    kpis: [
      { icon: Terminal, label: 'REST Calls', value: '1.2M', trend: 'heute' },
      { icon: Code, label: 'Webhooks', value: '450', trend: 'aktiv' },
      { icon: CheckCircle, label: 'API Latenz', value: '42ms', trend: 'avg' },
      { icon: AlertCircle, label: 'Fehlerrate', value: '0.01%', trend: 'sehr niedrig' }
    ]
  },
  'custom-development': {
    title: 'my-dispatch.de/dev',
    kpis: [
      { icon: Code, label: 'Sprint', value: '2/12', trend: 'abgeschlossen' },
      { icon: CheckCircle, label: 'Tickets', value: '8', trend: 'in Arbeit' },
      { icon: TrendingUp, label: 'Deployment', value: '3', trend: 'heute' },
      { icon: Users, label: 'Dev-Team', value: '8', trend: 'Entwickler' }
    ]
  },
  'support': {
    title: 'my-dispatch.de/support',
    kpis: [
      { icon: AlertCircle, label: 'Tickets', value: '2', trend: 'offen' },
      { icon: Clock, label: 'Reaktionszeit', value: '12min', trend: 'heute' },
      { icon: CheckCircle, label: 'CSAT', value: '4.9/5', trend: 'Rating' },
      { icon: Users, label: 'Support-Team', value: '24/7', trend: 'verfügbar' }
    ]
  },
  'white-labeling': {
    title: 'my-dispatch.de/branding',
    kpis: [
      { icon: Globe, label: 'Custom Domains', value: '12', trend: 'aktiv' },
      { icon: Palette, label: 'Themes', value: '3', trend: 'Varianten' },
      { icon: Smartphone, label: 'Apps', value: '2', trend: 'iOS+Android' },
      { icon: CheckCircle, label: 'Branding', value: '100%', trend: 'Custom' }
    ]
  },
  'nutzungsbedingungen': {
    title: 'my-dispatch.de/rechtliches',
    kpis: [
      { icon: FileText, label: 'DSGVO', value: '100%', trend: 'Konform' },
      { icon: MapPin, label: 'Made in DE', value: '✓', trend: 'Standort EU' },
      { icon: CheckCircle, label: 'Zertifiziert', value: '✓', trend: 'ISO 27001' },
      { icon: CheckCircle, label: 'Sicher', value: '100%', trend: 'TLS 1.3' }
    ]
  }
} as const;

export function PremiumDashboardContent({ pageType = 'home' }: PremiumDashboardContentProps) {
  // V32.0: Load config based on pageType
  const config = DASHBOARD_CONFIGS[pageType] || DASHBOARD_CONFIGS.home;
  
  return (
    <V28BrowserMockup title={config.title}>
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-[600px]">
        {/* Header mit Live-Badge */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Dashboard-Übersicht</h3>
                <p className="text-sm text-slate-600">Echtzeit-Metriken</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-300">
              <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">Live</span>
            </div>
          </div>
        </div>

        {/* 4 Premium KPI Cards - 3D Effect - V32.0: Dynamic */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {config.kpis.map((kpi, idx) => {
              const KPIIcon = kpi.icon;
              return (
                <div key={idx} className="group relative bg-white rounded-2xl p-4 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-slate-100">
                        <KPIIcon className="w-4 h-4 text-slate-900" />
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <ArrowUpRight className="w-3 h-3" />
                        <span className="text-xs font-semibold">{kpi.trend}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-slate-900 antialiased">{kpi.value}</p>
                      <p className="text-xs font-medium text-slate-600 subpixel-antialiased">{kpi.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aktivitäten-Liste */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h4 className="text-sm font-semibold text-slate-900">Letzte Aktivitäten</h4>
            </div>
            <div className="divide-y divide-slate-100">
              {/* Aktivität 1 */}
              <div className="px-4 py-3 hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                    <CheckCircle className="w-4 h-4 text-slate-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 antialiased">Auftrag #A-2847 abgeschlossen</p>
                    <p className="text-xs text-slate-600 mt-0.5 subpixel-antialiased">Fahrer: Max Mustermann • München → Hamburg</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">vor 2 Min</span>
                  </div>
                </div>
              </div>

              {/* Aktivität 2 */}
              <div className="px-4 py-3 hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                    <Package className="w-4 h-4 text-slate-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 antialiased">Neuer Auftrag #A-2851 erstellt</p>
                    <p className="text-xs text-slate-600 mt-0.5 subpixel-antialiased">Kunde: TransLog GmbH • Berlin → Köln</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">vor 8 Min</span>
                  </div>
                </div>
              </div>

              {/* Aktivität 3 */}
              <div className="px-4 py-3 hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                    <AlertCircle className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 antialiased">Verzögerung bei Auftrag #A-2849</p>
                    <p className="text-xs text-slate-600 mt-0.5 subpixel-antialiased">Fahrer: Anna Schmidt • Stau auf A7</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">vor 15 Min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weitere Metriken */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-600 mb-1 subpixel-antialiased">Durchschn. Fahrtzeit</p>
              <p className="text-lg font-bold text-slate-900 antialiased">24 Min</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-600 mb-1 subpixel-antialiased">Kundenzufriedenheit</p>
              <p className="text-lg font-bold text-slate-900 antialiased">4.8★</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-600 mb-1 subpixel-antialiased">Auslastung</p>
              <p className="text-lg font-bold text-slate-900 antialiased">82%</p>
            </div>
          </div>
        </div>
      </div>
    </V28BrowserMockup>
  );
}
