/* ==================================================================================
   Breadcrumbs Component - Navigation Hierarchy
   ==================================================================================
   - Automatische Breadcrumb-Generierung aus Route
   - Mobile-optimiert
   - CI-konform
   - DEFENSIVE PROGRAMMING: Verhindert Crashes bei Bundle-Splitting Race Conditions
   ================================================================================== */

import * as React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

export function Breadcrumbs() {
  // DEFENSIVE PROGRAMMING: Runtime-Check für React-Verfügbarkeit
  if (typeof React === "undefined" || !React || !React.useEffect) {
    logger.warn("[Breadcrumbs] React not available, skipping render", { component: "Breadcrumbs" });
    return null;
  }

  // DEFENSIVE PROGRAMMING: Router-Context-Prüfung
  let location;
  try {
    location = useLocation();
  } catch (error) {
    logger.warn("[Breadcrumbs] Router context not available, skipping render", {
      component: "Breadcrumbs",
    });
    return null;
  }

  // DEFENSIVE PROGRAMMING: Fallback wenn location undefined
  if (!location) {
    logger.warn("[Breadcrumbs] Location is undefined, skipping render", {
      component: "Breadcrumbs",
    });
    return null;
  }

  const pathnames = location.pathname.split("/").filter((x) => x);

  // Route-Name-Mapping (Deutsch)
  const routeNames: Record<string, string> = {
    auftraege: "Aufträge",
    angebote: "Angebote",
    rechnungen: "Rechnungen",
    kunden: "Kunden",
    fahrer: "Fahrer",
    fahrzeuge: "Fahrzeuge",
    partner: "Partner",
    schichtzettel: "Schichtzettel",
    kommunikation: "Kommunikation",
    office: "Office",
    dokumente: "Dokumente",
    statistiken: "Statistiken",
    kostenstellen: "Kostenstellen",
    unternehmen: "Unternehmen",
    einstellungen: "Einstellungen",
    home: "Startseite",
    pricing: "Preise",
    faq: "FAQ",
    docs: "Dokumentation",
    contact: "Kontakt",
    "nexify-support": "NeXify Support",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    agb: "AGB",
    terms: "Nutzungsbedingungen",
    auth: "Anmeldung",
  };

  // Root-Route (Dashboard) - AUCH hier Breadcrumbs anzeigen
  if (pathnames.length === 0) {
    return (
      <nav
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        aria-label="Breadcrumb"
      >
        <div className="flex items-center gap-1 text-foreground font-medium">
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
      aria-label="Breadcrumb"
    >
      {/* pt-6 entfernt, da MainLayout bereits pt-24 hat */}
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>

      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[pathname] || pathname;

        return (
          <div key={routeTo} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span
                className={cn(
                  "font-medium text-foreground",
                  "truncate max-w-[200px] sm:max-w-none"
                )}
              >
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors truncate max-w-[200px] sm:max-w-none"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
