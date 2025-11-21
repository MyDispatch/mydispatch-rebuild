/* ==================================================================================
   UNIVERSAL MASTER DASHBOARD TEMPLATE V6.1
   ==================================================================================
   Vollständig wiederverwendbares Dashboard-Template basierend auf /master Pattern
   
   Features:
   - MainLayout Integration (AppSidebar + DashboardSidebar)
   - Quick Actions Panel via Context Hook
   - PageHeader mit KPIs
   - Flexible Content-Area
   - Export-Funktionalität
   - Filter-System
   - Loading & Error States
   - Responsive Design
   - V28 Design System Compliance
   ================================================================================== */

import type { ReactNode} from 'react';
import { useMemo } from 'react';
import { useMainLayout } from '@/hooks/use-main-layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { Skeleton } from '@/components/ui/skeleton';
import type { LucideIcon } from 'lucide-react';

export interface KPIConfig {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export interface QuickActionConfig {
  icon: LucideIcon;
  label: string;
  action: () => void;
  tooltip?: string;
  variant?: 'quick-action-primary' | 'secondary';
}

export interface RecentActivity {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  time: string;
}

export interface ContextWidget {
  title: string;
  icon: LucideIcon;
  content: ReactNode;
}

export interface UniversalMasterDashboardProps {
  // SEO & Meta
  pageTitle: string;
  metaDescription?: string;
  
  // Header & KPIs
  headerTitle: string;
  headerSubtitle?: string;
  kpis: KPIConfig[];
  
  // Quick Actions (Context-Sensitive)
  quickActions: QuickActionConfig[];
  recentActivities?: RecentActivity[];
  contextWidget?: ContextWidget;
  
  // Main Content
  children: ReactNode;
  
  // States
  loading?: boolean;
  error?: Error | null;
  
  // Optional Features
  showExport?: boolean;
  exportConfig?: {
    filename: string;
    formats: Array<'pdf' | 'excel' | 'csv'>;
    onExport: (format: string) => void;
  };
  
  showFilters?: boolean;
  filterConfig?: {
    filters: Array<{
      label: string;
      options: Array<{ label: string; value: string }>;
      value: string;
      onChange: (value: string) => void;
    }>;
  };
}

export function UniversalMasterDashboardTemplate({
  pageTitle,
  metaDescription,
  headerTitle,
  headerSubtitle,
  kpis,
  quickActions,
  recentActivities = [],
  contextWidget,
  children,
  loading = false,
  error = null,
  showExport = false,
  exportConfig,
  showFilters = false,
  filterConfig,
}: UniversalMasterDashboardProps) {
  const { sidebarExpanded } = useMainLayout();

  // Error State
  if (error) {
    return (
      <>
        <SEOHead title={`${pageTitle} - Fehler`} description={metaDescription} />
        <div className="container mx-auto p-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Fehler aufgetreten</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title={pageTitle} description={metaDescription} />
      
      <div className="flex flex-col min-h-screen">
        {/* Page Header mit KPIs */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto p-4 sm:p-6">
            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {headerTitle}
              </h1>
              {headerSubtitle && (
                <p className="text-muted-foreground mt-1">{headerSubtitle}</p>
              )}
            </div>

            {/* KPI Grid */}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, index) => (
                  <Card key={index} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {kpi.label}
                          </p>
                          <p className="text-2xl font-bold text-foreground mt-2">
                            {kpi.value}
                          </p>
                          {kpi.trend && (
                            <p
                              className={`text-xs mt-1 ${
                                kpi.trend.isPositive
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {kpi.trend.isPositive ? '↑' : '↓'} {kpi.trend.value}%
                            </p>
                          )}
                        </div>
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            kpi.color || 'bg-primary/10'
                          }`}
                        >
                          <kpi.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export & Filter Bar */}
        {(showExport || showFilters) && (
          <div className="border-b bg-muted/50">
            <div className="container mx-auto p-4 flex items-center justify-between gap-4">
              {/* Filters */}
              {showFilters && filterConfig && (
                <div className="flex items-center gap-4">
                  {filterConfig.filters.map((filter, index) => (
                    <select
                      key={index}
                      value={filter.value}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              )}

              {/* Export Buttons */}
              {showExport && exportConfig && (
                <div className="flex items-center gap-2 ml-auto">
                  {exportConfig.formats.map((format) => (
                    <button
                      key={format}
                      onClick={() => exportConfig.onExport(format)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                      Export {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 container mx-auto p-4 sm:p-6">
          <ErrorBoundary>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              children
            )}
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}
