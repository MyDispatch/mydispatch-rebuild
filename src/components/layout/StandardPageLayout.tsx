/* ==================================================================================
   STANDARD PAGE LAYOUT - PREMIUM VIBRANT PROFESSIONAL V45.0
   ==================================================================================
   Einheitliches Layout für alle CRUD-Seiten
   - Premium Vibrant Farbpalette (professionell, leuchtend, kontrastreich)
   - Konsistente Positionierung aller Elemente
   - Wiederverwendbare Struktur
   - Mobile-optimiert
   ================================================================================== */

import { V28Button } from "@/components/design-system/V28Button";
import { SEOHead } from "@/components/shared/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/lib/compat";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Activity, Archive, LucideIcon, Plus, Search } from "lucide-react";
import { ReactNode } from "react";

interface StatCard {
  label: string;
  value: string | number;
  icon: ReactNode | LucideIcon;
  className?: string;
}

interface StandardPageLayoutProps {
  // SEO & Navigation
  title: string;
  description: string;
  canonical?: string;

  // Background (V28.1 Premium)
  background?: "white" | "canvas" | "orbs-light";

  // Hero Section (optional)
  heroIcon?: LucideIcon;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadge?: ReactNode;

  // Header
  subtitle?: string;
  onCreateNew?: () => void;
  createButtonLabel?: string;
  createButtonDisabled?: boolean;
  headerExtra?: ReactNode;

  // Stats (optional)
  stats?: StatCard[];

  // Filter/Search
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onShowArchivedToggle?: () => void;
  filterComponents?: ReactNode;

  // Content
  children: ReactNode;

  // Footer (optional)
  footerContent?: ReactNode;

  // Card Title
  cardTitle?: string;
  cardIcon?: ReactNode;

  // Custom styling
  className?: string;
  style?: React.CSSProperties;
}

export function StandardPageLayout({
  title,
  description,
  canonical,
  background = "canvas",
  heroIcon,
  heroTitle,
  heroSubtitle,
  heroBadge,
  subtitle,
  onCreateNew,
  createButtonLabel = "Neu erstellen",
  createButtonDisabled = false,
  headerExtra,
  stats,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Suchen...",
  onShowArchivedToggle,
  filterComponents,
  children,
  footerContent,
  cardTitle,
  cardIcon,
  className,
  style,
}: StandardPageLayoutProps) {
  return (
    <>
      <SEOHead title={title} description={description} canonical={canonical} />

      <div
        className={`space-y-6 font-sans bg-gradient-to-br from-slate-50 to-blue-50 ${className || ""}`}
        style={style}
      >
        {/* HERO-BEREICH - Optional, Tailwind CSS Design */}
        {heroIcon && (
          <div className="relative w-full h-[200px] sm:h-[250px] lg:h-[300px] mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-secondary/30 shadow-lg">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <div className="mb-4 p-6 rounded-full bg-foreground/10 backdrop-blur-sm">
                {(() => {
                  const HeroIcon = heroIcon;
                  return <HeroIcon className="h-16 w-16 sm:h-20 sm:w-20 text-foreground" />;
                })()}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {heroTitle || title}
              </h2>
              <p className="text-sm sm:text-base text-foreground/80 max-w-2xl">
                {heroSubtitle || description}
              </p>
              {heroBadge && <div className="mt-3">{heroBadge}</div>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
        )}

        {/* HEADER - Desktop: Info-Bereich, Mobile: Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{title}</h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-slate-700 font-medium mt-1">{subtitle}</p>
            )}
          </div>

          {/* MOBILE: Button anzeigen */}
          <div className="flex lg:hidden flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {onCreateNew && (
              <V28Button
                onClick={onCreateNew}
                disabled={createButtonDisabled}
                variant="primary"
                className="min-h-[44px] min-w-[44px] w-full sm:w-auto rounded-full font-semibold text-sm transition-all duration-300 h-12 bg-slate-700 text-white hover:bg-slate-800 hover:shadow-md hover:scale-[1.02]"
                icon={Plus}
                iconPosition="left"
              >
                <span className="ml-2">{createButtonLabel}</span>
              </V28Button>
            )}
          </div>

          {/* DESKTOP: Info-Bereich (Datum, Zeit, Status) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Datum & Zeit */}
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold tabular-nums text-slate-800">
                {format(new Date(), "HH:mm:ss")}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {format(new Date(), "EEEE, dd. MMMM yyyy", { locale: de })}
              </span>
            </div>

            {/* System-Status Badge */}
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="h-3 w-3 mr-1.5" />
              System Online
            </Badge>

            {/* Optional: Benutzer-Avatar */}
            {headerExtra}
          </div>
        </div>

        {/* STATS - Optional */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              // Check if icon is a component or JSX element
              const IconComponent = typeof stat.icon === "function" ? stat.icon : null;

              return (
                <Card key={index} className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-700 font-medium">{stat.label}</p>
                        <p className={`text-2xl font-bold text-slate-800 ${stat.className || ""}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className="h-4 w-4 text-muted-foreground">
                        {IconComponent ? (
                          <IconComponent className="h-4 w-4" />
                        ) : (
                          (stat.icon as ReactNode)
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* MAIN CARD - Immer gleiche Struktur */}
        <Card>
          <CardHeader>
            {cardTitle && (
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                {cardIcon}
                {cardTitle}
              </CardTitle>
            )}

            {/* FILTER/SEARCH - Immer gleich positioniert */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="flex gap-3 items-center flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                {onShowArchivedToggle && (
                  <V28Button
                    variant="secondary"
                    size="md"
                    onClick={onShowArchivedToggle}
                    className="min-h-[44px] min-w-[44px] whitespace-nowrap"
                    icon={Archive}
                    iconPosition="left"
                  >
                    <span className="ml-2">Archivierte anzeigen</span>
                  </V28Button>
                )}
              </div>
              {filterComponents && (
                <div className="flex items-center gap-2">{filterComponents}</div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">{children}</CardContent>
        </Card>

        {/* FOOTER - Optional */}
        {footerContent && (
          <div className="bg-muted/50 p-4 rounded-lg text-xs sm:text-sm text-muted-foreground">
            {footerContent}
          </div>
        )}
      </div>
    </>
  );
}
