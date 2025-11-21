/* ==================================================================================
   STANDARD PAGE LAYOUT - PREMIUM VIBRANT PROFESSIONAL V45.0
   ==================================================================================
   Einheitliches Layout für alle CRUD-Seiten
   - Premium Vibrant Farbpalette (professionell, leuchtend, kontrastreich)
   - Konsistente Positionierung aller Elemente
   - Wiederverwendbare Struktur
   - Mobile-optimiert
   ================================================================================== */

import { V28Button } from '@/components/design-system/V28Button';
import { SEOHead } from '@/components/shared/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/lib/compat';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { LucideIcon} from 'lucide-react';
import { Activity, Archive, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCard {
  label: string;
  value: string | number;
  icon: ReactNode | LucideIcon;
  className?: string;
}

interface Action {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  disabled?: boolean;
}

interface StandardPageLayoutProps {
  // SEO & Navigation
  title: string;
  description: string;
  canonical?: string;

  // Background (V28.1 Premium)
  background?: 'white' | 'canvas' | 'orbs-light';

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
  actions?: Action[];

  // Stats (optional)
  stats?: StatCard[];

  // Filter/Search (Optional)
  searchValue?: string;
  onSearchChange?: (value: string) => void;
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
  background = 'canvas',
  heroIcon,
  heroTitle,
  heroSubtitle,
  heroBadge,
  subtitle,
  onCreateNew,
  createButtonLabel = 'Neu erstellen',
  createButtonDisabled = false,
  headerExtra,
  actions,
  stats,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Suchen...',
  onShowArchivedToggle,
  filterComponents,
  children,
  footerContent,
  cardTitle,
  cardIcon,
  className,
  style,
}: StandardPageLayoutProps) {
  // Backwards compatibility: convert onCreateNew to actions array
  const actionButtons: Action[] = actions || (onCreateNew ? [{
    label: createButtonLabel,
    onClick: onCreateNew,
    icon: Plus,
    variant: 'primary' as const,
    disabled: createButtonDisabled,
  }] : []);

  return (
    <>
      <SEOHead title={title} description={description} canonical={canonical} />

      <div
        className={`space-y-6 font-sans ${className || ''}`}
        style={style}
      >
        {/* HEADER WITH ACTIONS - Oben rechts positioniert */}
        {(actionButtons.length > 0 || subtitle) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {subtitle && (
              <div className="flex-1">
                <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
              </div>
            )}
            {actionButtons.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {actionButtons.map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <V28Button
                      key={index}
                      variant={action.variant || 'primary'}
                      size="md"
                      onClick={action.onClick}
                      disabled={action.disabled}
                      icon={ActionIcon}
                      iconPosition="left"
                      className="min-h-[44px] min-w-[44px]"
                    >
                      {action.label}
                    </V28Button>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
              {heroBadge && (
                <div className="mt-3">
                  {heroBadge}
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
        )}


        {/* STATS - Optional */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              // Check if icon is a component or JSX element
              const IconComponent = typeof stat.icon === 'function' ? stat.icon : null;

              return (
                <Card key={index} className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-700 font-medium">{stat.label}</p>
                        <p className={`text-2xl font-bold text-slate-800 ${stat.className || ''}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className="h-4 w-4 text-muted-foreground">
                        {IconComponent ? (
                          <IconComponent className="h-4 w-4" />
                        ) : (
                          stat.icon as ReactNode
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

            {/* FILTER - Optional */}
            {(onShowArchivedToggle || filterComponents) && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <div className="flex gap-3 items-center flex-1">
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
                  <div className="flex items-center gap-2">
                    {filterComponents}
                  </div>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6">
            {children}
          </CardContent>
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
