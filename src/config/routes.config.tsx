/* ==================================================================================
   KRITISCHER HINWEIS: routes.config.tsx - ZENTRALE ROUTING-KONFIGURATION
   ==================================================================================
   SINGLE SOURCE OF TRUTH für alle App-Routen:
   - Routing-Logik von 325 Zeilen → 1 Array
   - Type-Safe Route-Definitions
   - Zentrale Meta-Daten (SEO, Breadcrumbs, Icons)
   - Layout-/Auth-Wrapper automatisch
   ================================================================================== */

import { lazy } from 'react';
import {
  Home, FileText, Users, Car, Truck, Settings, Building2, Euro,
  FolderOpen, Calendar, MessageSquare, Mail, BarChart3, MapPin, Crown,
  Palette, ShieldCheck, AlertCircle, Rocket, Clipboard, Database, BookOpen, Zap
} from 'lucide-react';

/**
 * LAZY LOADING - V18.5.2 PRODUCTION FIX
 * Standard lazy() ohne Custom Retry-Logic (verursacht Race Conditions)
 * Robuste Fallbacks erfolgen über Suspense + ErrorBoundary
 */

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<any>;
  protected?: boolean;
  layout?: 'main' | 'portal' | 'none';
  background?: 'white' | 'canvas' | 'orbs-light'; // V33.4: Background System
  requiredTariff?: 'Business' | 'Enterprise';
  requiredRole?: string;  // 🚨 SECURITY: Role-Based Access Control (e.g., 'master', 'admin')
  prefetch?: boolean;  // V6.0.4: Enable aggressive prefetching for critical routes
  meta: {
    title: string;
    icon?: any;
    breadcrumb?: string;
    canonical?: string;
    description?: string; // SEO Meta-Description
  };
}

/**
 * ZENTRALE ROUTING-KONFIGURATION
 * 
 * Reihenfolge-Regeln:
 * 1. Public Routes zuerst
 * 2. Portal Routes (separate Auth)
 * 3. Protected Routes (alphabetisch)
 * 4. Dynamic Routes ZULETZT! (/:slug muss nach allen statischen Routen)
 */
export const routes: RouteConfig[] = [
  // ========== PUBLIC ROUTES (NO AUTH) ==========
  {
    path: '/',
    component: lazy(() => import('@/pages/Home')),
    layout: 'none',
    protected: false,
    prefetch: true,  // V6.0.4: Critical route - prefetch immediately
    meta: {
      title: 'MyDispatch - Führende Software für Taxi- & Mietwagenunternehmen',
      description: 'Moderne Cloud-Lösung für professionelle Disposition. GPS-Tracking, Auftragsverwaltung, automatische Rechnungsstellung. DSGVO-konform, Made in Germany.',
    },
  },
  // Phase 4.1: Removed /design-preview (Dev-Tool, nicht für Production)
  // Phase 4.1: Removed /nexify-it-service (Duplicate zu /nexify-support)
  {
    path: '/auth',
    component: lazy(() => import('@/pages/Auth')),
    layout: 'none',
    prefetch: true, // ✅ Conversion-kritisch - prefetch
    meta: {
      title: 'Login',
      description: 'Anmelden bei MyDispatch',
    },
  },
  {
    path: '/coming-soon',
    component: lazy(() => import('@/pages/ComingSoon')),
    layout: 'none',
    meta: {
      title: 'Service-Roadmap',
      icon: Rocket,
      description: '35 neue MyDispatch Service-Erweiterungen in den nächsten 12 Monaten',
    },
  },
  {
    path: '/neue-services',
    component: lazy(() => import('@/pages/ComingSoon')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Neue Services',
      icon: Rocket,
      breadcrumb: 'Service-Roadmap',
      description: 'Kommende MyDispatch Features und Erweiterungen',
    },
  },
  // ========== DRIVER APP ROUTES ==========
  {
    path: '/driver',
    component: lazy(() => import('@/pages/driver-app/DriverSplash')),
    layout: 'none',
    meta: {
      title: 'Fahrer-App',
      description: 'MyDispatch Fahrer-App - Willkommen',
    },
  },
  {
    path: '/driver/welcome',
    component: lazy(() => import('@/pages/driver-app/DriverWelcome')),
    layout: 'none',
    meta: {
      title: 'Willkommen - Fahrer-App',
      description: 'Werden Sie Teil des MyDispatch Fahrer-Netzwerks',
    },
  },
  {
    path: '/driver/login',
    component: lazy(() => import('@/pages/driver-app/DriverLogin')),
    layout: 'none',
    meta: {
      title: 'Anmelden - Fahrer-App',
      description: 'Melden Sie sich in der MyDispatch Fahrer-App an',
    },
  },
  {
    path: '/driver/register',
    component: lazy(() => import('@/pages/driver-app/DriverRegister')),
    layout: 'none',
    meta: {
      title: 'Registrieren - Fahrer-App',
      description: 'Registrieren Sie sich als Fahrer bei MyDispatch',
    },
  },
  {
    path: '/driver/dashboard',
    component: lazy(() => import('@/pages/driver-app/DriverDashboard')),
    protected: true,
    layout: 'none',
    meta: {
      title: 'Dashboard - Fahrer-App',
      description: 'Ihr Fahrer-Dashboard bei MyDispatch',
    },
  },
  {
    path: '/driver/forgot-password',
    component: lazy(() => import('@/pages/driver-app/DriverForgotPassword')),
    layout: 'none',
    meta: {
      title: 'Passwort vergessen - Fahrer-App',
      description: 'Setzen Sie Ihr Passwort zurück',
    },
  },
  {
    path: '/driver/verify-email',
    component: lazy(() => import('@/pages/driver-app/DriverVerifyEmail')),
    layout: 'none',
    meta: {
      title: 'E-Mail bestätigen - Fahrer-App',
      description: 'Bestätigen Sie Ihre E-Mail-Adresse',
    },
  },

  {
    path: '/impressum',
    component: lazy(() => import('@/pages/Impressum')),
    layout: 'none',
    meta: {
      title: 'Impressum',
      description: 'Rechtliche Informationen und Kontaktdaten',
    },
  },
  {
    path: '/datenschutz',
    component: lazy(() => import('@/pages/Datenschutz')),
    layout: 'none',
    meta: {
      title: 'Datenschutz',
      description: 'Datenschutzerklärung nach DSGVO',
    },
  },
  {
    path: '/agb',
    component: lazy(() => import('@/pages/AGB')),
    layout: 'none',
    meta: {
      title: 'AGB',
      description: 'Allgemeine Geschäftsbedingungen',
    },
  },
  {
    path: '/terms',
    component: lazy(() => import('@/pages/Terms')),
    layout: 'none',
    meta: {
      title: 'Terms & Conditions',
      description: 'Terms of Service',
    },
  },
  {
    path: '/nexify-support',
    component: lazy(() => import('@/pages/NeXifySupport')),
    layout: 'none',
    meta: {
      title: 'NeXify Support',
      description: 'Technischer Support powered by NeXify',
    },
  },
  // Phase 4.1: Removed /nexify-it-service (Duplicate zu /nexify-support)
  {
    path: '/nutzungsbedingungen',
    component: lazy(() => import('@/pages/Nutzungsbedingungen')),
    layout: 'none',
    meta: {
      title: 'Nutzungsbedingungen',
      description: 'Terms of Service für MyDispatch',
    },
  },
  {
    path: '/features',
    component: lazy(() => import('@/pages/Features')),
    layout: 'none',
    prefetch: true, // ✅ Kritische Page - prefetch
    meta: {
      title: 'Features',
      description: 'Alle MyDispatch Features im Überblick: GPS-Tracking, Disposition, Kundenverwaltung und mehr',
    },
  },
  {
    path: '/demo',
    component: lazy(() => import('@/pages/Demo')),
    layout: 'none',
    meta: {
      title: 'Live-Demo',
      description: 'MyDispatch Live-Demo anfragen - 30 Minuten unverbindliche Produktvorführung',
    },
  },
  {
    path: '/pricing',
    component: lazy(() => import('@/pages/Pricing')),
    layout: 'none',
    prefetch: true, // ✅ Kritische Page - prefetch
    meta: {
      title: 'Preise',
      description: 'MyDispatch Tarife: Starter, Business, Enterprise',
    },
  },
  {
    path: '/pricing/addons/fleet-driver',
    component: lazy(() => import('@/pages/pricing/addons/FleetDriverAddon')),
    layout: 'none',
    meta: {
      title: 'Fleet & Driver Add-On',
      description: 'Erweitern Sie Ihre Flotte flexibel - 9€/Monat pro zusätzlichem Fahrzeug oder Fahrer',
    },
  },
  {
    path: '/pricing/starter',
    component: lazy(() => import('@/pages/pricing/StarterDetail')),
    layout: 'none',
    meta: {
      title: 'Starter-Tarif im Detail',
      description: '39€/Monat für Einsteiger. GPS-Tracking, Disposition, Kundenverwaltung. Ideal für 1-3 Fahrzeuge.',
    },
  },
  {
    path: '/pricing/business',
    component: lazy(() => import('@/pages/pricing/BusinessDetail')),
    layout: 'none',
    meta: {
      title: 'Business-Tarif im Detail',
      description: '99€/Monat für wachsende Betriebe. Alle Starter-Features plus Partner-Netzwerk, White-Label, Business Intelligence.',
    },
  },
  {
    path: '/pricing/enterprise',
    component: lazy(() => import('@/pages/pricing/EnterpriseDetail')),
    layout: 'none',
    meta: {
      title: 'Enterprise-Tarif im Detail',
      description: 'Individuelle Lösungen für Großflotten. API-Zugriff, Dedicated Support, maßgeschneiderte Features. Preis auf Anfrage.',
    },
  },
  {
    path: '/faq',
    component: lazy(() => import('@/pages/FAQ')),
    layout: 'none',
    meta: {
      title: 'FAQ',
      description: 'Häufig gestellte Fragen',
    },
  },
  {
    path: '/docs',
    component: lazy(() => import('@/pages/Docs')),
    layout: 'none',
    meta: {
      title: 'Dokumentation',
      description: 'MyDispatch Dokumentation und Anleitungen',
    },
  },
  {
    path: '/contact',
    component: lazy(() => import('@/pages/Contact')),
    layout: 'none',
    meta: {
      title: 'Kontakt',
      description: 'Kontaktieren Sie das MyDispatch-Team',
    },
  },
  {
    path: '/about',
    component: lazy(() => import('@/pages/About')),
    layout: 'none',
    meta: {
      title: 'Über MyDispatch',
      description: 'Die Geschichte hinter MyDispatch. Made in Germany seit 2010.',
    },
  },

  // ========== FEATURE DETAIL PAGES ==========
  // Core Features
  {
    path: '/features/core/fahrer-fahrzeuge',
    component: lazy(() => import('@/pages/features/core/FahrerFahrzeuge')),
    layout: 'none',
    meta: {
      title: 'Fahrer & Fahrzeuge | MyDispatch',
      description: 'Professionelle Fahrer- und Fuhrpartverwaltung mit TÜV-Überwachung',
    },
  },
  {
    path: '/features/core/auftragsverwaltung',
    component: lazy(() => import('@/pages/features/core/Auftragsverwaltung')),
    layout: 'none',
    meta: {
      title: 'Intelligente Auftragsverwaltung | MyDispatch',
      description: 'Erfassen, planen und verwalten Sie alle Fahrten zentral',
    },
  },
  {
    path: '/features/core/angebotserstellung',
    component: lazy(() => import('@/pages/features/core/Angebotserstellung')),
    layout: 'none',
    meta: {
      title: 'Angebotserstellung | MyDispatch',
      description: 'Professionelle Angebote in Sekunden erstellen',
    },
  },
  {
    path: '/features/core/rechnungsstellung',
    component: lazy(() => import('@/pages/features/core/Rechnungsstellung')),
    layout: 'none',
    meta: {
      title: 'Rechnungsstellung | MyDispatch',
      description: 'GoBD-konforme Rechnungen mit automatischen Mahnungen',
    },
  },
  {
    path: '/features/core/kundenverwaltung',
    component: lazy(() => import('@/pages/features/core/Kundenverwaltung')),
    layout: 'none',
    meta: {
      title: 'Kundenverwaltung | MyDispatch',
      description: 'Zentrale Kundenverwaltung mit Fahrhistorie',
    },
  },
  {
    path: '/features/core/landingpage',
    component: lazy(() => import('@/pages/features/core/Landingpage')),
    layout: 'none',
    meta: {
      title: 'Landingpage | MyDispatch',
      description: 'Professionelle Info-Landingpage für Ihr Unternehmen',
    },
  },

  // Business Features
  {
    path: '/features/business/buchungswidget',
    component: lazy(() => import('@/pages/features/business/Buchungswidget')),
    layout: 'none',
    meta: {
      title: 'Buchungswidget | MyDispatch',
      description: 'Online-Buchungen 24/7 auf Ihrer Webseite',
    },
  },
  {
    path: '/features/business/kunden-portal',
    component: lazy(() => import('@/pages/features/business/KundenPortal')),
    layout: 'none',
    meta: {
      title: 'Kunden-Portal | MyDispatch',
      description: 'Self-Service-Portal für Ihre Kunden',
    },
  },
  {
    path: '/features/business/partner-management',
    component: lazy(() => import('@/pages/features/business/PartnerManagement')),
    layout: 'none',
    meta: {
      title: 'Partner-Management | MyDispatch',
      description: 'Partner-Netzwerk professionell verwalten',
    },
  },
  {
    path: '/features/business/live-traffic',
    component: lazy(() => import('@/pages/features/business/LiveTraffic')),
    layout: 'none',
    meta: {
      title: 'Live-Traffic & Wetter | MyDispatch',
      description: 'Echtzeit-Verkehrsinformationen für optimale Routen',
    },
  },
  {
    path: '/features/business/statistiken',
    component: lazy(() => import('@/pages/features/business/Statistiken')),
    layout: 'none',
    meta: {
      title: 'Statistiken & Reports | MyDispatch',
      description: 'Echtzeit-Dashboards und Auswertungen',
    },
  },
  {
    path: '/features/business/gps-tracking',
    component: lazy(() => import('@/pages/features/business/GPSTracking')),
    layout: 'none',
    meta: {
      title: 'GPS-Tracking | MyDispatch',
      description: 'Live-Fahrzeugverfolgung in Echtzeit',
    },
  },
  {
    path: '/features/business/team-chat',
    component: lazy(() => import('@/pages/features/business/TeamChat')),
    layout: 'none',
    meta: {
      title: 'Team-Chat | MyDispatch',
      description: 'Interne Kommunikation für Ihr Team',
    },
  },
  {
    path: '/features/business/workflow-automation',
    component: lazy(() => import('@/pages/features/business/WorkflowAutomation')),
    layout: 'none',
    meta: {
      title: 'Workflow-Automatisierung | MyDispatch',
      description: 'n8n-Integration für automatisierte Prozesse',
    },
  },

  // Enterprise Features
  {
    path: '/features/enterprise/api-zugang',
    component: lazy(() => import('@/pages/features/enterprise/APIZugang')),
    layout: 'none',
    meta: {
      title: 'API-Zugang | MyDispatch',
      description: 'REST API für Custom Integrationen',
    },
  },
  {
    path: '/features/enterprise/white-labeling',
    component: lazy(() => import('@/pages/features/enterprise/WhiteLabeling')),
    layout: 'none',
    meta: {
      title: 'White-Labeling | MyDispatch',
      description: 'Individuelles Branding für Ihre Landingpage',
    },
  },
  {
    path: '/features/enterprise/custom-development',
    component: lazy(() => import('@/pages/features/enterprise/CustomDevelopment')),
    layout: 'none',
    meta: {
      title: 'Custom Development | MyDispatch',
      description: 'Individuelle Softwareentwicklung nach Maß',
    },
  },
  {
    path: '/features/enterprise/support',
    component: lazy(() => import('@/pages/features/enterprise/Support')),
    layout: 'none',
    meta: {
      title: '24/7 Premium-Support | MyDispatch',
      description: 'Dedicated Support für Enterprise-Kunden',
    },
  },


  // ========== PORTAL ROUTES (SEPARATE AUTH) ==========
  {
    path: '/portal/auth',
    component: lazy(() => import('@/pages/Auth')),
    layout: 'none',
    meta: {
      title: 'Portal Login',
      description: 'Kunden-Portal Anmeldung',
    },
  },
  {
    path: '/portal',
    component: lazy(() => import('@/pages/Portal')),
    layout: 'portal',
    meta: {
      title: 'Kunden-Portal',
      description: 'Ihr persönliches Kunden-Portal',
    },
  },

  // ========== PROTECTED ROUTES (MAIN LAYOUT) ==========
  {
    path: '/dashboard',
    component: lazy(() => import('@/pages/Index')),
    protected: true,
    layout: 'main',
    background: 'orbs-light',
    meta: {
      title: 'Dashboard',
      icon: Home,
      breadcrumb: 'Dashboard',
      description: 'Live-Übersicht und Statistiken',
    },
  },
  {
    path: '/auftraege',
    component: lazy(() => import('@/pages/Auftraege')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Aufträge',
      icon: FileText,
      breadcrumb: 'Aufträge',
      description: 'Auftrags- und Buchungsverwaltung',
    },
  },
  {
    path: '/disposition',
    component: lazy(() => import('@/pages/Disposition')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Disposition',
      icon: Clipboard,
      breadcrumb: 'Disposition',
      description: 'Live-Auftragsdisposition und Fahrerzuweisung',
    },
  },
  {
    path: '/tracking',
    component: lazy(() => import('@/pages/Tracking')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Tracking',
      icon: MapPin,
      breadcrumb: 'Tracking',
      description: 'Live-Fahrzeug- und Fahrer-Tracking',
    },
  },
  {
    path: '/angebote',
    component: lazy(() => import('@/pages/Angebote')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Angebote',
      icon: FileText,
      breadcrumb: 'Angebote',
      description: 'Angebotserstellung und -verwaltung',
    },
  },
  {
    path: '/rechnungen',
    component: lazy(() => import('@/pages/Rechnungen')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Rechnungen',
    icon: Euro,
      breadcrumb: 'Rechnungen',
      description: 'Rechnungsverwaltung und Zahlungen',
    },
  },
  {
    path: '/kunden',
    component: lazy(() => import('@/pages/Kunden')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Kunden',
      icon: Users,
      breadcrumb: 'Kunden',
      description: 'Kundenverwaltung',
    },
  },
  {
    path: '/fahrer',
    component: lazy(() => import('@/pages/Fahrer')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Fahrer',
      icon: Users,
      breadcrumb: 'Fahrer',
      description: 'Fahrerverwaltung und Schichtzuteilung',
    },
  },
  {
    path: '/fahrzeuge',
    component: lazy(() => import('@/pages/Fahrzeuge')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Fahrzeuge',
      icon: Car,
      breadcrumb: 'Fahrzeuge',
      description: 'Fahrzeugflotten-Management',
    },
  },
  {
    path: '/partner',
    component: lazy(() => import('@/pages/Partner')),
    protected: true,
    layout: 'main',
    requiredTariff: 'Business',
    meta: {
      title: 'Partner',
      icon: Truck,
      breadcrumb: 'Partner',
      description: 'Partner-Netzwerk und Auftragsvergabe',
    },
  },
  {
    path: '/schichtzettel',
    component: lazy(() => import('@/pages/Schichtzettel')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Schichtzettel',
      icon: Calendar,
      breadcrumb: 'Schichtzettel',
      description: 'Schichtplanung und Zeiterfassung',
    },
  },
  {
    path: '/kommunikation',
    component: lazy(() => import('@/pages/Kommunikation')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Kommunikation',
      icon: MessageSquare,
      breadcrumb: 'Kommunikation',
      description: 'Team-Chat, Video-Calls und E-Mail-Vorlagen',
    },
  },
  {
    path: '/office',
    component: lazy(() => import('@/pages/Kommunikation')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Office',
      icon: Mail,
      breadcrumb: 'Office',
      description: 'E-Mail-Templates und Briefvorlagen',
    },
  },
  {
    path: '/dokumente',
    component: lazy(() => import('@/pages/Dokumente')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Dokumente',
      icon: FolderOpen,
      breadcrumb: 'Dokumente',
      description: 'Dokumentenverwaltung und Ablaufüberwachung',
    },
  },
  {
    path: '/kostenstellen',
    component: lazy(() => import('@/pages/Kostenstellen')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Kostenstellen',
      icon: Euro,
      breadcrumb: 'Kostenstellen',
      description: 'Kostenstellen-Verwaltung',
    },
  },
  {
    path: '/statistiken',
    component: lazy(() => import('@/pages/Statistiken')),
    protected: true,
    layout: 'main',
    background: 'orbs-light',
    requiredTariff: 'Business',
    meta: {
      title: 'Statistiken',
      icon: BarChart3,
      breadcrumb: 'Statistiken',
      description: 'Auswertungen und Reports',
    },
  },
  {
    path: '/unternehmen',
    component: lazy(() => import('@/pages/Unternehmen')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Unternehmen',
      icon: Building2,
      breadcrumb: 'Unternehmen',
      description: 'Unternehmensprofil und Tarifverwaltung',
    },
  },
  {
    path: '/einstellungen',
    component: lazy(() => import('@/pages/Einstellungen')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Einstellungen',
      icon: Settings,
      breadcrumb: 'Einstellungen',
      description: 'System- und Benutzereinstellungen',
    },
  },
  {
    path: '/error-monitor',
    component: lazy(() => import('@/pages/ErrorMonitor')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Error Monitor',
      icon: AlertCircle,
      breadcrumb: 'Error Monitor',
      description: 'Echtzeit-Fehlerüberwachung und -Analyse',
    },
  },
  {
    path: '/landingpage-konfigurator',
    component: lazy(() => import('@/pages/LandingpageKonfigurator')),
    protected: true,
    layout: 'main',
    requiredTariff: 'Business',
    meta: {
      title: 'Landingpage-Konfigurator',
      icon: Palette,
      breadcrumb: 'Landingpage-Konfigurator',
      description: 'Gebrandete Landingpage erstellen',
    },
  },
  {
    path: '/driver-tracking',
    component: lazy(() => import('@/pages/DriverTracking')),
    protected: true,
    layout: 'main',
    requiredTariff: 'Business',
    meta: {
      title: 'Fahrer-Tracking',
      icon: MapPin,
      breadcrumb: 'Fahrer-Tracking',
      description: 'GPS-Tracking PWA für Fahrer',
    },
  },
  {
    path: '/agent-dashboard',
    component: lazy(() => import('@/pages/AgentDashboard')),
    protected: true,
    layout: 'main',
    background: 'orbs-light',
    meta: {
      title: 'Agent-Dashboard',
      icon: ShieldCheck,
      breadcrumb: 'Agent-Dashboard',
      description: 'AI-Agent Execution & Health Monitoring',
    },
  },
  {
    path: '/master',
    component: lazy(() => import('@/pages/Master')),
    protected: true,
    layout: 'main',  // V40.22: Im MainLayout integriert mit Tab-Struktur
    background: 'orbs-light',
    requiredRole: 'master',  // 🚨 KRITISCH: Nur für System-Admins!
    meta: {
      title: 'Master System Dashboard',
      icon: ShieldCheck,
      breadcrumb: 'System Control',
      description: 'Zentrale System-Kontrolle, Brain QA & CI/CD Management',
    },
  },
  {
    path: '/knowledge-base-migration',
    component: lazy(() => import('@/pages/KnowledgeBaseMigration')),
    protected: true,
    layout: 'main',
    requiredRole: 'master',  // 🚨 KRITISCH: Nur für System-Admins!
    meta: {
      title: 'Knowledge-Base Migration V5.0',
      icon: Database,
      breadcrumb: 'KB Migration',
      description: 'Vollständige Migration aller Dokumentation, Components & Patterns',
    },
  },
  {
    path: '/wiki-dashboard',
    component: lazy(() => import('@/pages/WikiDashboard')),
    protected: true,
    layout: 'main',
    requiredRole: 'master',  // 🚨 KRITISCH: Nur für System-Admins!
    prefetch: true,
    meta: {
      title: 'NeXify Wiki Dashboard',
      icon: BookOpen,
      breadcrumb: 'Wiki Dashboard',
      description: 'Knowledge System Metrics, Graph Coverage & Wiki Health Monitoring',
    },
  },
  {
    path: '/kronos',
    component: lazy(() => import('@/pages/KronosDashboard')),
    protected: true,
    layout: 'main',
    requiredRole: 'master',  // 🚨 KRITISCH: Nur für System-Admins!
    prefetch: true,
    meta: {
      title: 'KRONOS V18.0 Executor',
      icon: Zap,
      breadcrumb: 'KRONOS Executor',
      description: 'Wiki-to-Code Parallel Execution System - Autonomous Code Generation',
    },
  },
  {
    path: '/go-live-control',
    component: lazy(() => import('@/pages/GoLiveControl')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Go-Live Control',
      icon: Rocket,
      breadcrumb: 'Go-Live Control',
      description: 'Phase 3 Autonomous Go-Live Execution',
    },
  },
  {
    path: '/mobile-menu',
    component: lazy(() => import('@/pages/MobileMenu')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Menü',
      icon: Home,
      breadcrumb: 'Menü',
      description: 'Mobile Menü-Navigation',
    },
  },

  // ========== PUBLIC LANDING PAGES (VOR DYNAMIC ROUTES!) ==========
  // KRITISCH: Explizite /unternehmer Route für Legacy-Support
  {
    path: '/unternehmer',
    component: lazy(() => import('@/pages/Unternehmer')),
    layout: 'none',
    meta: {
      title: 'Landingpage',
      description: 'Gebrandete Unternehmens-Landingpage',
    },
  },

  // ========== DYNAMIC ROUTES (ZULETZT!) ==========
  // WICHTIG: Muss NACH allen statischen Routen stehen!
  {
    path: '/:slug',
    component: lazy(() => import('@/pages/Unternehmer')),
    layout: 'none',
    meta: {
      title: 'Landingpage',
      description: 'Gebrandete Unternehmens-Landingpage',
    },
  },
];
