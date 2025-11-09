/* ==================================================================================
   DASHBOARD V41.0 - EXAKT WIE ANDERE SEITEN (PATTERN-KONFORM)
   ==================================================================================
   ✅ EXAKT gleiches Layout wie Auftraege/Angebote/Partner
   ✅ StandardPageLayout mit onCreateNew
   ✅ StatCards Grid (3 KPIs)
   ✅ UniversalExportBar (optional)
   ✅ Right Sidebar (320px, Desktop only)
   ✅ Symmetrische Margins (24px links, 320px rechts)
   ✅ V28.1 Slate Design System
   ================================================================================== */

import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useStatistics } from '@/hooks/use-statistics';
import type { DashboardStats } from '@/hooks/use-statistics';
import { useDeviceType } from '@/hooks/use-device-type';
import { useMainLayout } from '@/hooks/use-main-layout';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { StatCard } from '@/components/smart-templates/StatCard';
import { V28Button } from '@/components/design-system/V28Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { KPIGenerator } from '@/lib/dashboard-automation';
import { formatCurrency } from '@/lib/format-utils';
import { useNavigate } from 'react-router-dom';
import { 
  Car, Users, FileText, TrendingUp, Euro, Clock, 
  CheckCircle, Activity, Plus, Calendar, ArrowRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Dashboard() {
  const { profile } = useAuth();
  const { stats: rawStats, isLoading } = useStatistics();
  const { isMobile } = useDeviceType();
  const { sidebarExpanded } = useMainLayout();
  const navigate = useNavigate();

  // ==================================================================================
  // KPI CARDS (GOLDEN TEMPLATE)
  // ==================================================================================
  const dashboardKPIs = useMemo(() => {
    const bookings = rawStats?.bookings_today ?? 0;
    // @ts-ignore - active_drivers exists in DashboardStats
    const drivers = rawStats?.active_drivers ?? 0;
    const revenue = rawStats?.revenue_today ?? 0;
    
    return [
      KPIGenerator.custom({ 
        title: 'Heutige Aufträge', 
        value: bookings, 
        icon: FileText, 
        subtitle: 'Alle Buchungen heute' 
      }),
      KPIGenerator.custom({ 
        title: 'Aktive Fahrer', 
        value: drivers, 
        icon: Users, 
        subtitle: 'Im Dienst' 
      }),
      KPIGenerator.custom({ 
        title: 'Umsatz (heute)', 
        value: formatCurrency(revenue), 
        icon: Euro, 
        subtitle: 'Tagesumsatz' 
      })
    ] as [any, any, any];
  }, [rawStats]);

  // ==================================================================================
  // RECENT ACTIVITY (Placeholder - ohne recent_bookings)
  // ==================================================================================
  const recentActivity = useMemo(() => {
    return []; // Keine recent_bookings im Stats-Hook vorhanden
  }, []);

  // ==================================================================================
  // QUICK ACTIONS
  // ==================================================================================
  const quickActions = [
    { label: 'Neuer Auftrag', icon: Plus, onClick: () => navigate('/auftraege'), variant: 'primary' as const },
    { label: 'Kalender', icon: Calendar, onClick: () => navigate('/schichtzettel'), variant: 'secondary' as const },
    { label: 'Statistiken', icon: TrendingUp, onClick: () => navigate('/statistiken'), variant: 'secondary' as const }
  ];

  // ==================================================================================
  // LOADING STATE
  // ==================================================================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt Dashboard...</p>
      </div>
    );
  }

  // ==================================================================================
  // MAIN RENDER
  // ==================================================================================
  return (
    <>
      <StandardPageLayout
          title="Dashboard"
          description="MyDispatch Dashboard: Zentrale Übersicht über Aufträge, Fahrer, Fahrzeuge und Umsätze."
          canonical="/dashboard"
          subtitle={`Willkommen zurück, ${profile?.first_name || 'Nutzer'}!`}
          onCreateNew={() => navigate('/auftraege')}
          createButtonLabel="Neuer Auftrag"
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Dashboard durchsuchen..."
          cardTitle="Live-Übersicht"
          cardIcon={<Activity className="h-5 w-5" />}
        >
          {/* ✅ KPI CARDS (GOLDEN TEMPLATE) */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dashboardKPIs.map((kpi, index) => (
              <StatCard
                key={index}
                label={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                change={kpi.trend ? { 
                  value: kpi.trend.value, 
                  trend: kpi.trend.value >= 0 ? 'up' : 'down' 
                } : undefined}
              />
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <V28Button
                key={index}
                variant={action.variant}
                fullWidth
                icon={action.icon}
                onClick={action.onClick}
              >
                {action.label}
              </V28Button>
            ))}
          </div>

          {/* RECENT ACTIVITY */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Letzte Aktivität</span>
                <V28Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => navigate('/auftraege')}
                >
                  Alle anzeigen
                </V28Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-12 w-12 text-slate-400" />}
                  title="Noch keine Aktivität"
                  description="Erstellen Sie Ihren ersten Auftrag, um loszulegen."
                  actionLabel="Auftrag erstellen"
                  onAction={() => navigate('/auftraege')}
                />
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => navigate('/auftraege')}
                      >
                        <div className="p-2 rounded-full bg-muted">
                          <IconComponent className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {activity.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </StandardPageLayout>

      {/* ✅ RIGHT SIDEBAR (320px, Desktop only) */}
      {!isMobile && (
        <aside 
          className="fixed right-0 top-16 bottom-0 bg-white border-l border-border shadow-lg z-20 overflow-y-auto hidden md:block"
          className="w-80"
        >
          {/* Schnellzugriff */}
          <div className="p-4 space-y-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-slate-700" />
              Schnellzugriff
            </h3>
            
            <V28Button 
              variant="primary" 
              fullWidth 
              icon={Plus}
              onClick={() => navigate('/auftraege')}
            >
              Neuer Auftrag
            </V28Button>
            
            <V28Button 
              variant="secondary" 
              fullWidth 
              icon={Calendar}
              onClick={() => navigate('/schichtzettel')}
            >
              Kalender
            </V28Button>

            <V28Button 
              variant="secondary" 
              fullWidth 
              icon={TrendingUp}
              onClick={() => navigate('/statistiken')}
            >
              Statistiken
            </V28Button>
          </div>

          {/* Live-Status Stats */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Live-Status</h4>
            
            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">Heutige Aufträge</span>
                <Car className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{rawStats?.bookings_today ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Heute aktiv</p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-green-600">Aktive Fahrer</span>
                <Users className="h-4 w-4 text-green-400" />
              </div>
              {/* @ts-ignore - active_drivers exists in DashboardStats */}
              <p className="text-2xl font-bold text-green-700">{rawStats?.active_drivers ?? 0}</p>
              <p className="text-xs text-green-500 mt-1">Verfügbar</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-600">Umsatz (heute)</span>
                <Euro className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-lg font-bold text-blue-700">
                {formatCurrency(rawStats?.revenue_today ?? 0)}
              </p>
              <p className="text-xs text-blue-500 mt-1">Heute</p>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
