/* ==================================================================================
   SCROLL TO TOP COMPONENT - V18.5.1
   ==================================================================================
   Purpose: Seiten öffnen IMMER oben (nicht am Seitenende)
   
   Warum Custom Solution statt ScrollRestoration?
   - ScrollRestoration benötigt Data Router API (createBrowserRouter)
   - Projekt verwendet BrowserRouter (Legacy API)
   - Custom Solution ist kompatibel mit BrowserRouter
   
   Verhalten:
   - Bei Navigation: Scroll to Top (0, 0)
   - Smooth Scroll: Nein (instant für bessere UX)
   - Layout-Shift-Prevention: Ja (scrollTo vor Render)
   ================================================================================== */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top INSTANTLY (no smooth scroll for better UX)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * UPGRADE-PATH (OPTIONAL):
 * 
 * Wenn Projekt auf Data Router API umgestellt wird:
 * 1. BrowserRouter → createBrowserRouter
 * 2. ScrollToTop → ScrollRestoration (von react-router-dom)
 * 3. Besseres Verhalten (History-aware Scroll-Restoration)
 * 
 * Migration-Beispiel:
 * ```tsx
 * import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
 * 
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <Root />,
 *     children: routes.map(route => ({
 *       path: route.path,
 *       element: route.component
 *     }))
 *   }
 * ]);
 * 
 * function App() {
 *   return (
 *     <RouterProvider router={router}>
 *       <ScrollRestoration />
 *     </RouterProvider>
 *   );
 * }
 * ```
 */
