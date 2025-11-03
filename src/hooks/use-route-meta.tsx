/* ==================================================================================
   use-route-meta.tsx - AUTOMATISCHE SEO & META-TAGS
   ==================================================================================
   Route-basierte Meta-Daten (V18.2.28):
   - Document Title automatisch
   - Canonical Tags automatisch
   - Meta-Descriptions (vorbereitet)
   - Breadcrumb-Daten
   ================================================================================== */

import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { routes } from '@/config/routes.config';

/**
 * Hook für automatische SEO-Meta-Tags basierend auf aktueller Route
 * 
 * Features:
 * - Document Title: "Seitentitel | MyDispatch"
 * - Canonical Tag: Automatisch aus Route-Path
 * - Meta-Description: Aus RouteConfig (falls vorhanden)
 * - Breadcrumb-Daten: Für Breadcrumbs-Komponente
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const meta = useRouteMeta();
 *   return <div>{meta.title}</div>;
 * }
 * ```
 */
export function useRouteMeta() {
  const location = useLocation();
  
  // Match aktuelle Route gegen RouteConfig
  const currentRoute = routes.find(route => {
    // Exakter Match
    if (route.path === location.pathname) return true;
    
    // Dynamic Route Match (z.B. /:slug)
    return matchPath(route.path, location.pathname);
  });
  
  useEffect(() => {
    if (currentRoute) {
      // Document Title
      document.title = `${currentRoute.meta.title} | MyDispatch`;
      
      // Canonical Tag
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      
      // Canonical URL: Verwende meta.canonical falls vorhanden, sonst pathname
      const canonicalUrl = currentRoute.meta.canonical || location.pathname;
      canonical.href = `https://my-dispatch.de${canonicalUrl}`;
      
      // Meta-Description (optional)
      if (currentRoute.meta.description) {
        let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          document.head.appendChild(metaDescription);
        }
        metaDescription.content = currentRoute.meta.description;
      }
    }
  }, [currentRoute, location]);
  
  return currentRoute?.meta;
}

/**
 * Helper: Breadcrumb-Pfad generieren
 * 
 * @example
 * ```tsx
 * const breadcrumbs = getBreadcrumbs(location.pathname);
 * // [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Aufträge', path: '/auftraege' }]
 * ```
 */
export function getBreadcrumbs(pathname: string) {
  const currentRoute = routes.find(route => 
    matchPath(route.path, pathname)
  );
  
  if (!currentRoute || !currentRoute.protected) {
    return []; // Keine Breadcrumbs für Public-Seiten
  }
  
  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' }
  ];
  
  // Aktuelle Seite hinzufügen (wenn nicht Dashboard)
  if (pathname !== '/dashboard') {
    breadcrumbs.push({
      label: currentRoute.meta.breadcrumb || currentRoute.meta.title,
      path: pathname
    });
  }
  
  return breadcrumbs;
}
