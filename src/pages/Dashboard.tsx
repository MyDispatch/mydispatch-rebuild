/* ==================================================================================
   DASHBOARD V44.0 - GOLDEN TEMPLATE KONSISTENZ (/rechnungen Template)
   ==================================================================================
   ✅ Basierend auf /rechnungen Golden Template
   ✅ Fixed Right Sidebar mit Quick Actions & Live-Stats
   ✅ Premium grau-blaues Design-System
   ✅ Professionelle Abstände & Layout-Struktur
   ✅ Integrierte Quick Actions (nicht mehr als Card)
   ✅ Konsistent mit Rechnungen, Kunden, Schichtzettel etc.
   ✅ V28.1 Design Token System + V33.0 Sidebar Pattern
   ================================================================================== */

import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useStatistics } from '@/hooks/use-statistics';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '@/hooks/use-device-type';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { StatCard } from '@/components/smart-templates/StatCard';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { useFeatureAccess } from '@/components/shared/FeatureGate';
import { formatCurrency } from '@/lib/format-utils';
import {
  FileText, Users, Euro, Plus, Calendar, TrendingUp,
  Clock, CheckCircle2, ArrowRight, Zap, TrendingUp as TrendIcon,
  MapPin, Car, BarChart3, Building2, Globe, MessageSquare,
  Star, Target, TrendingUp as ChartUp, Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Dashboard() {
  const { profile } = useAuth();
  const { stats, isLoading } = useStatistics();
  const navigate = useNavigate();
  const { isMobile } = useDeviceType();
  const { isBusiness, hasAdvancedStats, hasPartnerManagement, hasCustomerPortal } = useFeatureAccess();

  // ==================================================================================
  // KPI CARDS - ERWEITERT MIT BUSINESS FEATURES
  // ==================================================================================
  const kpiCards = useMemo(() => {
    const bookings = stats?.bookings_today ?? 0;
    const drivers = stats?.active_drivers ?? 0;
    const revenue = stats?.revenue_today ?? 0;

    const baseCards = [
      {
        title: 'Heutige Aufträge',
        value: bookings.toString(),
        subtitle: 'Alle Buchungen heute',
        icon: FileText,
        change: stats?.bookings_trend ? {
          value: Math.abs(stats.bookings_trend.value),
          trend: stats.bookings_trend.direction === 'up' ? 'up' as const : stats.bookings_trend.direction === 'down' ? 'down' as const : 'neutral' as const
        } : undefined
      },
      {
        title: 'Aktive Fahrer',
        value: drivers.toString(),
        subtitle: 'Im Dienst',
        icon: Users,
        change: stats?.drivers_trend ? {
          value: Math.abs(stats.drivers_trend.value),
          trend: stats.drivers_trend.direction === 'up' ? 'up' as const : stats.drivers_trend.direction === 'down' ? 'down' as const : 'neutral' as const
        } : undefined
      },
      {
        title: 'Umsatz (heute)',
        value: formatCurrency(revenue),
        subtitle: 'Tagesumsatz',
        icon: Euro,
        change: stats?.revenue_trend ? {
          value: Math.abs(stats.revenue_trend.value),
          trend: stats.revenue_trend.direction === 'up' ? 'up' as const : stats.revenue_trend.direction === 'down' ? 'down' as const : 'neutral' as const
        } : undefined
      }
    ];

    // Business-Only KPIs
    if (isBusiness && hasAdvancedStats) {
      baseCards.push(
        {
          title: 'Konversionsrate',
          value: stats?.conversion_rate ? `${stats.conversion_rate}%` : '0%',
          subtitle: 'Angebote → Aufträge',
          icon: Target,
          change: stats?.conversion_trend ? {
            value: Math.abs(stats.conversion_trend.value),
            trend: stats.conversion_trend.direction === 'up' ? 'up' as const : stats.conversion_trend.direction === 'down' ? 'down' as const : 'neutral' as const
          } : undefined
        },
        {
          title: 'Kundenzufriedenheit',
          value: stats?.customer_rating ? `${stats.customer_rating}/5` : '4.8/5',
          subtitle: 'Durchschnittliche Bewertung',
          icon: Star,
          change: stats?.rating_trend ? {
            value: Math.abs(stats.rating_trend.value),
            trend: stats.rating_trend.direction === 'up' ? 'up' as const : stats.rating_trend.direction === 'down' ? 'down' as const : 'neutral' as const
          } : undefined
        }
      );
    }

    return baseCards;
  }, [stats, isBusiness, hasAdvancedStats]);

  // ==================================================================================
  // QUICK ACTIONS - VERSCHOBEN IN RIGHT SIDEBAR (wie Rechnungen Template)
  // ==================================================================================
  const quickActions = [
    {
      label: 'Neuer Auftrag',
      icon: Plus,
      onClick: () => navigate('/auftraege'),
      variant: 'primary' as const
    },
    {
      label: 'Kalender öffnen',
      icon: Calendar,
      onClick: () => navigate('/schichtzettel'),
      variant: 'secondary' as const
    },
    {
      label: 'Route planen',
      icon: MapPin,
      onClick: () => navigate('/auftraege'),
      variant: 'secondary' as const
    },
    // Business-Only Quick Actions
    ...(isBusiness ? [
      {
        label: 'Partner finden',
        icon: Building2,
        onClick: () => navigate('/partner'),
        variant: 'secondary' as const
      },
      {
        label: 'Statistiken',
        icon: BarChart3,
        onClick: () => navigate('/statistiken'),
        variant: 'secondary' as const
      },
      {
        label: 'KI-Assistent',
        icon: MessageSquare,
        onClick: () => navigate('/ki-assistent'),
        variant: 'secondary' as const
      }
    ] : [])
  ];

  // ==================================================================================
  // RECENT ACTIVITY - ERWEITERT MIT BUSINESS FEATURES
  // ==================================================================================
  const recentActivity = useMemo(() => {
    const baseActivity = [
      {
        id: '1',
        type: 'booking',
        title: 'Neuer Auftrag erstellt',
        description: 'Flughafentransfer nach Frankfurt',
        time: new Date(),
        icon: FileText,
        status: 'success' as const
      },
      {
        id: '2',
        type: 'driver',
        title: 'Fahrer im Dienst',
        description: 'Max Mustermann hat Schicht begonnen',
        time: new Date(Date.now() - 3600000),
        icon: Users,
        status: 'info' as const
      },
      {
        id: '3',
        type: 'completed',
        title: 'Auftrag abgeschlossen',
        description: 'Stadtfahrt erfolgreich beendet',
        time: new Date(Date.now() - 7200000),
        icon: CheckCircle2,
        status: 'success' as const
      }
    ];

    // Business-Only Activity Items
    if (isBusiness) {
      baseActivity.push(
        {
          id: '4',
          type: 'partner',
          title: 'Partner-Anfrage erhalten',
          description: 'Taxi Müller möchte Kooperation',
          time: new Date(Date.now() - 10800000),
          icon: Building2,
          status: 'warning' as const
        },
        {
          id: '5',
          type: 'ai',
          title: 'KI-Optimierung durchgeführt',
          description: 'Routen wurden automatisch optimiert',
          time: new Date(Date.now() - 14400000),
          icon: MessageSquare,
          status: 'info' as const
        }
      );
    }

    return baseActivity;
  }, [isBusiness]);

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
  // MAIN RENDER - GOLDEN TEMPLATE STRUKTUR (wie Rechnungen)
  // ==================================================================================
  return (
    <>
      <StandardPageLayout
        title={`Willkommen zurück, ${profile?.first_name || 'User'}!`}
        subtitle={`Heute ist ${format(new Date(), 'EEEE, d. MMMM yyyy', { locale: de })}`}
      >
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {kpiCards.map((kpi, index) => (
            <StatCard
              key={index}
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              icon={kpi.icon}
              trend={kpi.trend}
            />
          ))}
        </div>

        {/* RECENT ACTIVITY - Hauptcontent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Letzte Aktivitäten</CardTitle>
            <V28Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auftraege')}
            >
              Alle anzeigen
              <ArrowRight className="ml-2 h-4 w-4" />
            </V28Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  id={activity.id}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  status={activity.status}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* BUSINESS FEATURES - NUR FÜR BUSINESS TARIF */}
        <FeatureGate
          feature="advanced_dashboard"
          requiredTier="business"
          fallback={null}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Live-Statistiken */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Live-Statistiken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Durchschnittliche Fahrtdauer</span>
                    <span className="font-semibold">{stats?.avg_trip_duration || '45'} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Wiedervorlagequote</span>
                    <span className="font-semibold text-green-600">{stats?.repeat_customer_rate || '68'}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Effizienz-Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{width: `${stats?.efficiency_score || 85}%`}}></div>
                      </div>
                      <span className="font-semibold">{stats?.efficiency_score || 85}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partner-Performance */}
            <FeatureGate
              feature="partner_management"
              requiredTier="business"
              fallback={null}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    Partner-Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-900">Taxi Schmidt</p>
                        <p className="text-sm text-purple-600">85% Zufriedenheit</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-900">12</p>
                        <p className="text-xs text-purple-600">Buchungen</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-900">Premium Cars</p>
                        <p className="text-sm text-purple-600">92% Zufriedenheit</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-900">8</p>
                        <p className="text-xs text-purple-600">Buchungen</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FeatureGate>
          </div>
        </FeatureGate>

        {/* ENDE BUSINESS FEATURES */}
      </div>
    </div>
      </StandardPageLayout>

      {/* V33.0: Schnellzugriff Sidebar (rechts) - Desktop only - KONSISTENT MIT RECHNUNGEN */}
      {!isMobile && (
        <aside
          className="fixed right-0 top-16 bottom-0 bg-background border-l border-border shadow-lg z-20 overflow-y-auto hidden md:block transition-all duration-300"
          style={{
            width: '320px', // ✅ Feste professionelle Breite - immer sichtbar!
          }}
        >
          {/* Schnellzugriff Actions */}
          <div className="p-4 space-y-3 border-b border-border">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-slate-700" />
              Schnellzugriff
            </h3>

            {quickActions.map((action, index) => (
              <V28Button
                key={index}
                variant={action.variant}
                fullWidth
                icon={action.icon}
                iconPosition="left"
                onClick={action.onClick}
              >
                {action.label}
              </V28Button>
            ))}
          </div>

          {/* Live-Status Stats */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Live-Status</h4>

            <div className="space-y-2">
              {/* Heutige Aufträge */}
              <div className="p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Heutige Aufträge</span>
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats?.bookings_today ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(stats?.revenue_today ?? 0)} Umsatz
                </p>
              </div>

              {/* Aktive Fahrer */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-600">Aktive Fahrer</span>
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-blue-700">{stats?.active_drivers ?? 0}</p>
                <p className="text-xs text-blue-500 mt-1">Im Dienst</p>
              </div>

              {/* Trend Anzeige */}
              {stats?.bookings_trend && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-green-600">Trend</span>
                    <TrendIcon className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    {stats.bookings_trend > 0 ? '+' : ''}{stats.bookings_trend}%
                  </p>
                  <p className="text-xs text-green-500 mt-1">zum Vortag</p>
                </div>
              )}

              {/* BUSINESS EXCLUSIVE STATS */}
              <FeatureGate
                feature="advanced_dashboard"
                requiredTier="business"
                fallback={null}
              >
                {/* Effizienz-Score */}
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-purple-600">Effizienz</span>
                    <ChartUp className="h-4 w-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{stats?.efficiency_score || 85}%</p>
                  <p className="text-xs text-purple-500 mt-1">Route optimiert</p>
                </div>

                {/* Partner-Netzwerk */}
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-orange-600">Partner</span>
                    <Building2 className="h-4 w-4 text-orange-400" />
                  </div>
                  <p className="text-2xl font-bold text-orange-700">{stats?.active_partners || 3}</p>
                  <p className="text-xs text-orange-500 mt-1">Aktiv heute</p>
                </div>

                {/* Kundenzufriedenheit */}
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-yellow-600">Bewertung</span>
                    <Star className="h-4 w-4 text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-700">{stats?.customer_rating || 4.8}/5</p>
                  <p className="text-xs text-yellow-500 mt-1">Durchschnitt</p>
                </div>
              </FeatureGate>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
