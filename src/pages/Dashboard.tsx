/* ==================================================================================
   DASHBOARD V43.0 - MODERN SAAS DASHBOARD (BEST PRACTICES + COMPONENT REFACTOR)
   ==================================================================================
   ✅ Clean, professional SaaS-Design
   ✅ StandardPageLayout für Konsistenz
   ✅ 3 KPI Cards (Aufträge, Fahrer, Umsatz)
   ✅ Quick Actions (Prominent, Call-to-Action)
   ✅ Recent Activity Feed
   ✅ Mobile-First, Responsive
   ✅ V28.1 Design Token System
   ================================================================================== */

import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useStatistics } from '@/hooks/use-statistics';
import { useNavigate } from 'react-router-dom';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { StatCard } from '@/components/smart-templates/StatCard';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { formatCurrency } from '@/lib/format-utils';
import { 
  FileText, Users, Euro, Plus, Calendar, TrendingUp,
  Clock, CheckCircle2, ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Dashboard() {
  const { profile } = useAuth();
  const { stats, isLoading } = useStatistics();
  const navigate = useNavigate();

  // ==================================================================================
  // KPI CARDS
  // ==================================================================================
  const kpiCards = useMemo(() => {
    const bookings = stats?.bookings_today ?? 0;
    const drivers = stats?.active_drivers ?? 0;
    const revenue = stats?.revenue_today ?? 0;
    
    return [
      {
        title: 'Heutige Aufträge',
        value: bookings.toString(),
        subtitle: 'Alle Buchungen heute',
        icon: FileText,
        trend: stats?.bookings_trend
      },
      {
        title: 'Aktive Fahrer',
        value: drivers.toString(),
        subtitle: 'Im Dienst',
        icon: Users,
        trend: stats?.drivers_trend
      },
      {
        title: 'Umsatz (heute)',
        value: formatCurrency(revenue),
        subtitle: 'Tagesumsatz',
        icon: Euro,
        trend: stats?.revenue_trend
      }
    ];
  }, [stats]);

  // ==================================================================================
  // QUICK ACTIONS
  // ==================================================================================
  const quickActions = [
    {
      label: 'Neuer Auftrag',
      description: 'Auftrag schnell erfassen',
      icon: Plus,
      onClick: () => navigate('/auftraege'),
      variant: 'default' as const,
      prominent: true
    },
    {
      label: 'Kalender',
      description: 'Schichtplan ansehen',
      icon: Calendar,
      onClick: () => navigate('/schichtzettel'),
      variant: 'outline' as const
    },
    {
      label: 'Statistiken',
      description: 'Auswertungen & Reports',
      icon: TrendingUp,
      onClick: () => navigate('/statistiken'),
      variant: 'outline' as const
    }
  ];

  // ==================================================================================
  // RECENT ACTIVITY (Mock Data - später aus Backend)
  // ==================================================================================
  const recentActivity = useMemo(() => {
    return [
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
  }, []);

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
    <StandardPageLayout
      title={`Willkommen zurück, ${profile?.first_name || 'User'}!`}
      subtitle={`Heute ist ${format(new Date(), 'EEEE, d. MMMM yyyy', { locale: de })}`}
      showExport={false}
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

      {/* QUICK ACTIONS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Schnellzugriff</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                label={action.label}
                description={action.description}
                icon={action.icon}
                onClick={action.onClick}
                prominent={action.prominent}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RECENT ACTIVITY */}
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
    </StandardPageLayout>
  );
}
