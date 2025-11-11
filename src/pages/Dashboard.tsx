/* ==================================================================================
   DASHBOARD V33.0 Migration → UniversalDashboardTemplate
   ==================================================================================
   ✅ Umstellung auf universelles Template (KPIs, Quick‑Actions, Filter, Export, Pagination)
   ✅ Genau 3 KPIs + 2 Quick‑Actions gemäß V33.0/V28.1 Spezifikation
   ✅ Sektion: Letzte Aktivitäten bleibt erhalten
   ================================================================================== */

import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useStatistics } from '@/hooks/use-statistics';
import { useNavigate } from 'react-router-dom';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { UniversalDashboardTemplate } from '@/components/dashboard/UniversalDashboardTemplate';
import { KPIGenerator, QuickActionsGenerator } from '@/lib/dashboard-automation/kpi-generator';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { formatCurrency } from '@/lib/format-utils';
import { FileText, Users, Calendar, ArrowRight, CheckCircle2, Building2, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const { stats, isLoading } = useStatistics();
  const navigate = useNavigate();

  // Suche/Archiv & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // KPIs (genau 3)
  const totalDrivers = (stats?.total_drivers ?? ((stats?.active_drivers ?? 0) + (stats?.inactive_drivers ?? 0)));
  const kpis = [
    KPIGenerator.bookings.today(stats?.bookings_today ?? 0, stats?.revenue_today ?? 0),
    KPIGenerator.drivers.active(stats?.active_drivers ?? 0, totalDrivers),
    KPIGenerator.bookings.monthRevenue(stats?.month_revenue ?? 0, stats?.month_revenue_growth ?? 0),
  ] as const;

  // Quick‑Actions (genau 2)
  const quickActions = [
    QuickActionsGenerator.create('Neuer Auftrag', FileText, () => navigate('/auftraege')),
    QuickActionsGenerator.create('Kalender öffnen', Calendar, () => navigate('/schichtzettel')),
  ] as const;

  // Letzte Aktivitäten (Sektion‑Inhalt)
  const recentActivity = useMemo(() => (
    [
      {
        id: '1',
        type: 'booking',
        title: 'Neuer Auftrag erstellt',
        description: 'Flughafentransfer nach Frankfurt',
        time: new Date(),
        icon: FileText,
        status: 'success' as const,
      },
      {
        id: '2',
        type: 'driver',
        title: 'Fahrer im Dienst',
        description: 'Max Mustermann hat Schicht begonnen',
        time: new Date(Date.now() - 3600000),
        icon: Users,
        status: 'info' as const,
      },
      {
        id: '3',
        type: 'completed',
        title: 'Auftrag abgeschlossen',
        description: 'Stadtfahrt erfolgreich beendet',
        time: new Date(Date.now() - 7200000),
        icon: CheckCircle2,
        status: 'success' as const,
      },
      {
        id: '4',
        type: 'partner',
        title: 'Partner‑Anfrage erhalten',
        description: 'Taxi Müller möchte Kooperation',
        time: new Date(Date.now() - 10800000),
        icon: Building2,
        status: 'warning' as const,
      },
      {
        id: '5',
        type: 'ai',
        title: 'KI‑Optimierung durchgeführt',
        description: 'Routen wurden automatisch optimiert',
        time: new Date(Date.now() - 14400000),
        icon: MessageSquare,
        status: 'info' as const,
      },
    ]
  ), []);

  const totalItems = recentActivity.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt Dashboard…</p>
      </div>
    );
  }

  return (
    <UniversalDashboardTemplate
      pageTitle={`Willkommen zurück, ${profile?.first_name || 'User'}!`}
      pageDescription={format(new Date(), 'EEEE, d. MMMM yyyy', { locale: de })}
      kpis={kpis as any}
      quickActions={quickActions as any}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Durchsuchen…"
      showArchived={showArchived}
      onArchivedChange={setShowArchived}
      exportConfig={{
        data: recentActivity.map(a => ({ id: a.id, type: a.type, title: a.title, time: a.time.toISOString() })),
        filename: `dashboard-activities-${format(new Date(), 'yyyyMMdd')}`,
      }}
      paginationConfig={{
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems,
        onPageChange: (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages))),
        onItemsPerPageChange: (n) => { setItemsPerPage(n); setCurrentPage(1); },
      }}
      sectionIcon={FileText}
      sectionTitle="Letzte Aktivitäten"
      sectionBadge={totalItems}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Letzte Aktivitäten</CardTitle>
          <V28Button variant="ghost" size="sm" onClick={() => navigate('/auftraege')}>
            Alle anzeigen
            <ArrowRight className="ml-2 h-4 w-4" />
          </V28Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentActivity
              .slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage)
              .map((activity) => (
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
    </UniversalDashboardTemplate>
  );
}
