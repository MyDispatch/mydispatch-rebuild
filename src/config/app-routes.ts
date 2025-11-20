/* ==================================================================================
   APP ROUTES - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ⚠️ KRITISCH: Alle Routes an EINER Stelle definiert!
   NIEMALS Routes hardcoden - IMMER APP_ROUTES nutzen!
   
   PHASE 5: Config-System Finalization
   ================================================================================== */

/**
 * Centralized App Routes
 *
 * USAGE:
 * ```tsx
 * import { APP_ROUTES } from '@/config/app-routes';
 *
 * // ❌ FALSCH:
 * navigate('/dashboard');
 *
 * // ✅ RICHTIG:
 * navigate(APP_ROUTES.dashboard);
 * ```
 */
export const APP_ROUTES = {
  // ============================================================================
  // PUBLIC ROUTES (Marketing)
  // ============================================================================
  home: "/",
  features: "/features",
  pricing: "/pricing",
  docs: "/docs",
  faq: "/faq",
  contact: "/contact",
  demo: "/demo",
  unternehmer: "/unternehmer",

  // Legal
  legal: {
    impressum: "/legal/impressum",
    datenschutz: "/legal/datenschutz",
    agb: "/legal/agb",
  },

  // Branchen
  branchen: {
    taxi: "/branchen/taxi",
    mietwagen: "/branchen/mietwagen",
    limousinen: "/branchen/limousinen",
  },

  // Features (Detailseiten)
  featuresDetail: {
    fahrerFahrzeuge: "/features/fahrer-fahrzeuge",
    auftragsverwaltung: "/features/auftragsverwaltung",
    gpsTracking: "/features/gps-tracking",
    automatisierung: "/features/automatisierung",
    rechnungsstellung: "/features/rechnungsstellung",
    api: "/features/api",
  },

  // ============================================================================
  // AUTH ROUTES
  // ============================================================================
  auth: {
    login: "/auth",
    register: "/auth?mode=register",
    forgotPassword: "/auth?mode=forgot-password",
  },

  // ============================================================================
  // UNTERNEHMER-DASHBOARD (Main Application)
  // ============================================================================
  dashboard: "/dashboard",
  auftraege: "/auftraege",
  angebote: "/angebote",
  kunden: "/kunden",
  fahrer: "/fahrer", // ✅ Includes Fahrzeuge via Tab-Navigation
  schichtzettel: "/schichtzettel",
  rechnungen: "/rechnungen",
  kostenstellen: "/kostenstellen",
  dokumente: "/dokumente",
  partner: "/partner",
  statistiken: "/statistiken",
  kommunikation: "/kommunikation",
  office: "/office",
  einstellungen: "/einstellungen",
  landingpage: "/landingpage",
  analytics: "/analytics",

  // Mobile Routes
  mobile: {
    menu: "/mobile-menu",
    dashboard: "/mobile-dashboard",
    auftraege: "/mobile-auftraege",
    kunden: "/mobile-kunden",
    fahrer: "/mobile-fahrer", // ✅ Includes Fahrzeuge via Tab-Navigation
    rechnungen: "/mobile-rechnungen",
    schichtzettel: "/mobile-schichtzettel",
    dokumente: "/mobile-dokumente",
    kostenstellen: "/mobile-kostenstellen",
    partner: "/mobile-partner",
    statistiken: "/mobile-statistiken",
  },

  // ============================================================================
  // KUNDENPORTAL
  // ============================================================================
  portal: {
    auth: "/portal/auth",
    dashboard: "/portal",
    bookings: "/portal/bookings",
    profile: "/portal/profile",
    support: "/portal/support",
  },

  // ============================================================================
  // FAHRERPORTAL
  // ============================================================================
  driver: {
    splash: "/driver",
    welcome: "/driver/welcome",
    login: "/driver/login",
    register: "/driver/register",
    dashboard: "/driver/dashboard",
    rides: "/driver/rides",
    shifts: "/driver/shifts",
    documents: "/driver/documents",
    vehicles: "/driver/vehicles",
    earnings: "/driver/earnings",
    profile: "/driver/profile",
    support: "/driver/support",
    forgotPassword: "/driver/forgot-password",
    verifyEmail: "/driver/verify-email",
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if current path matches route
 */
export const isActiveRoute = (currentPath: string, route: string): boolean => {
  return currentPath === route || currentPath.startsWith(route + "/");
};

/**
 * Get Route by Path (reverse lookup)
 */
export const getRouteByPath = (path: string): string | undefined => {
  const flattenRoutes = (obj: any, prefix = ""): Record<string, string> => {
    let result: Record<string, string> = {};

    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "object" && !Array.isArray(value)) {
        result = { ...result, ...flattenRoutes(value, newKey) };
      } else if (typeof value === "string") {
        result[newKey] = value;
      }
    }

    return result;
  };

  const allRoutes = flattenRoutes(APP_ROUTES);
  const entry = Object.entries(allRoutes).find(([_, route]) => route === path);
  return entry?.[0];
};

/**
 * Build Query String
 */
export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, String(value));
  }

  return searchParams.toString();
};

/**
 * Build Route with Query Params
 */
export const buildRoute = (
  route: string,
  params?: Record<string, string | number | boolean>
): string => {
  if (!params) return route;

  const queryString = buildQueryString(params);
  return `${route}?${queryString}`;
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AppRoute = typeof APP_ROUTES;
export type FlatRoute = string;
