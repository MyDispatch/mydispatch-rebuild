/* ==================================================================================
   PUBLIC ROUTES CONFIGURATION
   ================================================================================== */

import { lazy } from 'react';
import { Rocket } from 'lucide-react';
import type { RouteConfig } from '../routes.config';

export const publicRoutes: RouteConfig[] = [
  {
    path: '/',
    component: lazy(() => import('@/pages/Home')),
    layout: 'none',
    protected: false,
    prefetch: true,
    meta: {
      title: 'MyDispatch - Führende Software für Taxi- & Mietwagenunternehmen',
      description: 'Moderne Cloud-Lösung für professionelle Disposition. GPS-Tracking, Auftragsverwaltung, automatische Rechnungsstellung. DSGVO-konform, Made in Germany.',
    },
  },
  {
    path: '/design-preview',
    component: lazy(() => import('@/pages/DesignPreview')),
    layout: 'none',
    protected: false,
    meta: {
      title: 'Design Preview - MyDispatch V19.0',
      description: 'Vorschau des neuen Home-Page-Designs (Test-Seite)',
    },
  },
  {
    path: '/auth',
    component: lazy(() => import('@/pages/Auth')),
    layout: 'none',
    prefetch: true,
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
];
