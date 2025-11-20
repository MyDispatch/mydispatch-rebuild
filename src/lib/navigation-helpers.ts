/* ==================================================================================
   NAVIGATION HELPERS V18.5.1
   ==================================================================================
   Context-aware Navigation-Funktionen für:
   - Marketing vs. Branded Routes
   - Auth-Redirects
   - Smart Home-Navigation
   ================================================================================== */

import { NavigateFunction } from 'react-router-dom';

/**
 * Gibt die korrekte Home-Route basierend auf Context zurück
 * 
 * @param searchParams - URLSearchParams aus useSearchParams()
 * @returns Home-Route ('/' für Marketing, '/:slug' für Branded)
 * 
 * @example
 * // Marketing Context
 * /auth → getHomeRoute() → '/'
 * 
 * // Branded Context
 * /auth?company=123&slug=taxi-mueller → getHomeRoute() → '/taxi-mueller'
 */
export function getHomeRoute(searchParams: URLSearchParams | null = null): string {
  // Fallback: Wenn keine searchParams übergeben werden
  if (!searchParams) {
    return '/';
  }
  
  const slug = searchParams.get('slug');
  const companyId = searchParams.get('company');
  
  // STRIKTE Prüfung: NUR wenn BEIDE Parameter vorhanden UND valide sind
  if (companyId && slug && slug.trim().length > 0 && companyId.trim().length > 0) {
    return `/${slug}`;
  }
  
  // Marketing context (default) - Marketing-Home
  return '/';
}

/**
 * Navigiert zur korrekten Auth-Seite mit allen notwendigen Parametern
 * 
 * @param navigate - Navigate-Funktion aus useNavigate()
 * @param options - Auth-Optionen
 * 
 * @example
 * // Marketing Login
 * navigateToAuth(navigate, { mode: 'login' });
 * → /auth?tab=login
 * 
 * // Branded Customer Signup
 * navigateToAuth(navigate, { 
 *   mode: 'signup', 
 *   companyId: '123',
 *   slug: 'taxi-mueller',
 *   customerMode: true
 * });
 * → /auth?tab=signup&company=123&slug=taxi-mueller&mode=customer
 */
export function navigateToAuth(
  navigate: NavigateFunction,
  options: {
    mode?: 'login' | 'signup' | 'reset';
    companyId?: string;
    slug?: string;
    customerMode?: boolean;
  } = {}
): void {
  const params = new URLSearchParams();
  
  // Tab-Parameter
  if (options.mode) {
    params.set('tab', options.mode);
  }
  
  // Company-Parameter
  if (options.companyId) {
    params.set('company', options.companyId);
  }
  
  // Slug-Parameter (für Rücknavigation)
  if (options.slug) {
    params.set('slug', options.slug);
  }
  
  // Customer-Mode
  if (options.customerMode) {
    params.set('mode', 'customer');
  }
  
  const queryString = params.toString();
  navigate(`/auth${queryString ? `?${queryString}` : ''}`);
}

/**
 * Navigiert zu geschützter Route
 * Auth-Check erfolgt automatisch durch ProtectedRoute
 * 
 * @param navigate - Navigate-Funktion
 * @param path - Ziel-Route
 * @param options - Navigation-Optionen
 */
export function navigateToProtectedRoute(
  navigate: NavigateFunction,
  path: string,
  options?: {
    replace?: boolean;
    state?: any;
  }
): void {
  navigate(path, options);
}

/**
 * Gibt die Route für eine Entity (mit ID-Parameter) zurück
 * 
 * @param entityType - Entity-Typ
 * @param id - Entity-ID
 * @returns Route mit ID-Parameter
 * 
 * @example
 * getEntityRoute('kunden', '123') → '/kunden?id=123'
 */
export function getEntityRoute(
  entityType: 'kunden' | 'fahrer' | 'fahrzeuge' | 'auftraege' | 'rechnungen' | 'angebote',
  id: string
): string {
  return `/${entityType}?id=${id}`;
}

/**
 * Bestimmt die Redirect-Route nach erfolgreichem Login
 * 
 * @param userRole - Rolle des Users (oder account_type)
 * @param searchParams - URLSearchParams für Redirect-Parameter
 * @returns Redirect-Route
 * 
 * @example
 * // Unternehmer mit Redirect-Param
 * getLoginRedirectRoute('entrepreneur', params) → '/auftraege'
 * 
 * // Master-Account
 * getLoginRedirectRoute('master', params) → '/master'
 * 
 * // Unternehmer ohne Redirect
 * getLoginRedirectRoute('entrepreneur', params) → '/dashboard'
 * 
 * // Kunde
 * getLoginRedirectRoute('customer', params) → '/portal'
 * 
 * // Fahrer
 * getLoginRedirectRoute('driver', params) → '/driver/dashboard'
 */
export function getLoginRedirectRoute(
  userRole: 'entrepreneur' | 'customer' | 'driver' | 'master',
  searchParams: URLSearchParams
): string {
  // Custom Redirect-Parameter (höchste Priorität)
  const redirect = searchParams.get('redirect');
  if (redirect) {
    return redirect;
  }
  
  // Role-basiertes Routing
  switch (userRole) {
    case 'master':
      return '/dashboard';  // V43.1: Master-Users gehen auch zu /dashboard
    case 'entrepreneur':
      return '/dashboard';
    case 'customer':
      return '/portal';
    case 'driver':
      return '/driver/dashboard';
    default:
      return '/';
  }
}

/**
 * Bestimmt die Redirect-Route nach erfolgreichem Signup
 * 
 * @param userRole - Rolle des neuen Users
 * @param requiresPayment - Ob Payment erforderlich ist (Stripe)
 * @returns Redirect-Route
 */
export function getSignupRedirectRoute(
  userRole: 'entrepreneur' | 'customer' | 'driver',
  requiresPayment: boolean = false
): string {
  if (requiresPayment) {
    // Redirect zu Stripe erfolgt direkt, danach zurück zu:
    return '/dashboard';
  }
  
  // Direkter Redirect nach Signup
  switch (userRole) {
    case 'entrepreneur':
      return '/dashboard';
    case 'customer':
      return '/portal';
    case 'driver':
      return '/driver/dashboard';
    default:
      return '/';
  }
}

/**
 * Bestimmt die Logout-Redirect-Route basierend auf aktuellem Pfad
 * 
 * @param currentPath - Aktueller Pfad
 * @returns Logout-Redirect-Route
 * 
 * @example
 * getLogoutRedirectRoute('/dashboard') → '/auth'
 * getLogoutRedirectRoute('/portal') → '/portal/auth'
 * getLogoutRedirectRoute('/driver/dashboard') → '/driver/login'
 */
export function getLogoutRedirectRoute(currentPath: string): string {
  if (currentPath.startsWith('/portal')) {
    return '/portal/auth';
  }
  
  if (currentPath.startsWith('/driver')) {
    return '/driver/login';
  }
  
  // Default: Marketing Auth
  return '/auth';
}

/**
 * Prüft ob eine Route öffentlich ist (kein Auth erforderlich)
 * 
 * @param path - Zu prüfender Pfad
 * @returns true wenn öffentlich
 */
export function isPublicRoute(path: string): boolean {
  const publicRoutes = [
    '/',
    '/home',
    '/auth',
    '/pricing',
    '/faq',
    '/docs',
    '/contact',
    '/impressum',
    '/datenschutz',
    '/agb',
    '/terms',
    '/coming-soon',
    '/logo-tools',
    '/driver',
    '/driver/login',
    '/driver/register',
    '/driver/welcome',
    '/driver/forgot-password',
    '/driver/verify-email',
  ];
  
  // Exakte Matches
  if (publicRoutes.includes(path)) {
    return true;
  }
  
  // Dynamic Routes (/:slug)
  // Alle anderen Pfade die nicht mit bekannten Prefixen starten
  const protectedPrefixes = ['/dashboard', '/auftraege', '/kunden', '/portal'];
  return !protectedPrefixes.some(prefix => path.startsWith(prefix));
}

/**
 * Extrahiert Company-Context aus URL-Parametern
 * 
 * @param searchParams - URLSearchParams
 * @returns Company-Context
 */
export function getCompanyContext(searchParams: URLSearchParams): {
  companyId: string | null;
  slug: string | null;
  isMarketing: boolean;
  isBranded: boolean;
} {
  const companyId = searchParams.get('company');
  const slug = searchParams.get('slug');
  
  return {
    companyId,
    slug,
    isMarketing: !companyId,
    isBranded: !!companyId,
  };
}
