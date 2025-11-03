/* ==================================================================================
   PROTECTED ROUTES CONFIGURATION (AUTH REQUIRED)
   ================================================================================== */

import { lazy } from 'react';
import {
  Home, FileText, Users, Car, Settings, Building2, Euro,
  Calendar, MessageSquare, Mail, BarChart3, MapPin, Crown,
  Palette, ShieldCheck, AlertCircle, Clipboard, Database
} from 'lucide-react';
import { RouteConfig } from '../routes.config';

export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    component: lazy(() => import('@/pages/Dashboard')),
    protected: true,
    layout: 'main',
    prefetch: true,
    meta: {
      title: 'Dashboard',
      icon: Home,
      breadcrumb: 'Dashboard',
      description: 'Zentrale Übersicht über alle wichtigen Kennzahlen',
    },
  },
  {
    path: '/auftraege',
    component: lazy(() => import('@/pages/Auftraege')),
    protected: true,
    layout: 'main',
    prefetch: true,
    meta: {
      title: 'Aufträge',
      icon: FileText,
      breadcrumb: 'Aufträge',
      description: 'Verwaltung aller Fahrtaufträge',
    },
  },
  {
    path: '/fahrer',
    component: lazy(() => import('@/pages/Fahrer')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Fahrer & Fahrzeuge',
      icon: Users,
      breadcrumb: 'Fahrer',
      description: 'Verwaltung des Fahrerpersonals und der Fahrzeugflotte',
    },
  },
  // ✅ /fahrzeuge redirects to /fahrer?tab=fahrzeuge (see src/pages/Fahrzeuge.tsx)
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
    path: '/unternehmen',
    component: lazy(() => import('@/pages/Unternehmen')),
    protected: true,
    layout: 'main',
    meta: {
      title: 'Unternehmenskunden',
      icon: Building2,
      breadcrumb: 'Unternehmen',
      description: 'Verwaltung von Geschäftskunden',
    },
  },
  // Note: Routes like /abrechnung, /kalender, /nachrichten, /berichte, /settings 
  // are defined in main routes.config.tsx and will be migrated in Phase 4.2
];
