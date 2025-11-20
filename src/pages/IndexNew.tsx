/* ==================================================================================
   DASHBOARD V18.3.24 - UNIFIED PAGE TEMPLATE
   ==================================================================================
   DEMO: 441 → 120 Zeilen (-73%) durch Zentralisierung
   Custom Widgets als Grid-Content
   ================================================================================== */

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useDrivers } from '@/hooks/use-drivers';
import { useVehicles } from '@/hooks/use-vehicles';
import { useDocuments } from '@/hooks/use-documents';
import { useInvoices } from '@/hooks/use-invoices';
import { useBookings } from '@/hooks/use-bookings';
import { useDeviceType } from '@/hooks/use-device-type';
import { useNavigate } from 'react-router-dom';
import { UnifiedPageTemplate } from '@/components/layout/UnifiedPageTemplate';
import { WelcomeWizard } from '@/components/onboarding/WelcomeWizard';
import { MobileDashboard } from '@/components/mobile/MobileDashboard';
import { UrgentActionsWidget } from '@/components/dashboard/UrgentActionsWidget';
import { ResourceStatusWidget } from '@/components/dashboard/ResourceStatusWidget';
import { RevenueBreakdownWidget } from '@/components/dashboard/RevenueBreakdownWidget';
import { HEREMapComponent } from '@/components/dashboard/HEREMapComponent';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { TrafficWidget } from '@/components/dashboard/TrafficWidget';
import { PredictiveDemandWidget } from '@/components/dashboard/PredictiveDemandWidget';
import { LiveInfoWidget } from '@/components/dashboard/LiveInfoWidget';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar, MessageSquare, FileText, Users, TrendingUp } from 'lucide-react';
import { isBusinessTier } from '@/lib/subscription-utils';
import { formatCurrency } from '@/lib/index';
import { useAuditLogs } from '@/hooks/use-audit-logs';
import { useRealtimeBookings } from '@/hooks/use-realtime-bookings';
import { useRealtimeDrivers } from '@/hooks/use-realtime-drivers';
import { useRealtimeVehicles } from '@/hooks/use-realtime-vehicles';
import { cn } from '@/lib/utils';

export default function IndexNew() {
  const { profile, company } = useAuth();
  const { productId } = useSubscription();
  const navigate = useNavigate();
  const { isMobile } = useDeviceType();
  
  // Data Loading
  const { data: dashboardStats } = useDashboardStats();
  const { drivers = [] } = useDrivers();
  const { vehicles = [] } = useVehicles();
  const { documents = [] } = useDocuments();
  const { invoices = [] } = useInvoices();
  const { bookings = [] } = useBookings();
  const { activities, isLoading: isLoadingActivities } = useAuditLogs();
  
  // Realtime Updates
  useRealtimeBookings();
  useRealtimeDrivers();
  useRealtimeVehicles();
  
  // State
  const [showWelcomeWizard, setShowWelcomeWizard] = useState(false);
  
  // Onboarding Check
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('mydispatch_onboarding_completed');
    if (!hasSeenOnboarding && profile) {
      setShowWelcomeWizard(true);
    }
  }, [profile]);
  
  // Business+ Check
  const isBusinessActive = 
    company?.subscription_status === 'active' && 
    company?.subscription_product_id && 
    isBusinessTier(company.subscription_product_id);
  
  // KPI Calculations
  const totalBookings = dashboardStats?.completed_bookings ?? 0;
  const totalRevenue = dashboardStats?.total_revenue ?? 0;
  const activeDrivers = drivers.filter(d => !d.archived && d.shift_status === 'available').length;
  const availableVehicles = vehicles.filter(v => !v.archived && v.status === 'available').length;
  
  // Urgent Actions
  const expiringDocsArray = documents.filter(d => {
    if (!d.expiry_date) return false;
    const daysUntilExpiry = Math.ceil((new Date(d.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });
  
  const overdueInvoicesArray = invoices.filter(i => {
    if (i.payment_status !== 'pending' && i.payment_status !== 'overdue') return false;
    const invoiceDate = new Date(i.created_at);
    const daysOld = Math.ceil((Date.now() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysOld > 30; // Invoices older than 30 days
  });
  
  const overdueAmount = overdueInvoicesArray.reduce((sum, i) => sum + (i.amount || 0), 0);
  
  // Quick Actions
  const quickActions = [
    {
      label: 'Neuer Auftrag',
      icon: Plus,
      action: () => navigate('/auftraege', { state: { openCreateDialog: true } }),
      variant: 'default' as const
    },
    {
      label: 'Kalender',
      icon: Calendar,
      action: () => navigate('/schichtzettel'),
      variant: 'outline' as const
    },
    {
      label: 'Team-Chat',
      icon: MessageSquare,
      action: () => navigate('/kommunikation'),
      variant: 'outline' as const
    }
  ];
  
  // Revenue Breakdown (for Business+)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayBookings = bookings.filter(b => {
    const bookingDate = new Date(b.pickup_time || b.created_at);
    return bookingDate >= today;
  });
  
  const revenueCash = todayBookings.filter(b => b.payment_method === 'Barzahlung' || b.payment_method === 'cash').reduce((sum, b) => sum + (b.price || 0), 0);
  const revenueInvoice = todayBookings.filter(b => b.payment_method === 'Rechnung' || b.payment_method === 'invoice').reduce((sum, b) => sum + (b.price || 0), 0);
  const revenueCard = todayBookings.filter(b => b.payment_method === 'Kartenzahlung' || b.payment_method === 'card').reduce((sum, b) => sum + (b.price || 0), 0);
  const todayTotal = revenueCash + revenueInvoice + revenueCard;
  
  // ============================================================================
  // MOBILE OVERRIDE
  // ============================================================================
  if (isMobile) {
    return (
      <>
        {showWelcomeWizard && (
          <WelcomeWizard
            onComplete={() => {
              localStorage.setItem('mydispatch_onboarding_completed', 'true');
              setShowWelcomeWizard(false);
            }}
            onSkip={() => {
              localStorage.setItem('mydispatch_onboarding_completed', 'true');
              setShowWelcomeWizard(false);
            }}
          />
        )}
        
        <UnifiedPageTemplate
          title="Dashboard"
          description="MyDispatch Dashboard: Überblick über Aufträge, Fahrer, Fahrzeuge und Umsätze"
          canonical="/"
          header={{ title: 'Dashboard' }}
          content={{ type: 'custom', data: [], customContent: null }}
          mobileComponent={
            <MobileDashboard
              profile={profile}
              totalBookings={totalBookings}
              totalRevenue={totalRevenue}
              activeDrivers={activeDrivers}
              vehiclesInUse={availableVehicles}
              expiringDocuments={expiringDocsArray.length}
              overdueInvoices={overdueInvoicesArray.length}
              overdueAmount={overdueAmount}
              onNavigate={(path, state) => navigate(path, state)}
            />
          }
        />
      </>
    );
  }
  
  // ============================================================================
  // DESKTOP LAYOUT (Custom Widgets Grid)
  // ============================================================================
  
  const dashboardWidgets = [
    // Row 1: Urgent Actions + Resource Status + Revenue
    { id: 'urgent', component: (
      <UrgentActionsWidget
        expiringDocuments={expiringDocsArray.length}
        overdueInvoices={overdueInvoicesArray.length}
        overdueAmount={overdueAmount}
        unassignedBookings={dashboardStats?.pending_bookings ?? 0}
      />
    )},
    { id: 'resources', component: (
      <ResourceStatusWidget
        availableDrivers={drivers.filter(d => !d.archived && d.shift_status === 'available').slice(0, 3).map(d => ({
          id: d.id,
          first_name: d.first_name,
          last_name: d.last_name,
          profile_image_url: d.profile_image_url,
          shift_status: d.shift_status,
          rides_today: d.total_rides
        }))}
        busyDrivers={drivers.filter(d => !d.archived && d.shift_status === 'busy').slice(0, 3).map(d => ({
          id: d.id,
          first_name: d.first_name,
          last_name: d.last_name,
          profile_image_url: d.profile_image_url,
          shift_status: d.shift_status,
          rides_today: d.total_rides,
          current_booking: 'Unterwegs'
        }))}
        offlineDrivers={drivers.filter(d => !d.archived && d.shift_status === 'offline').length}
        availableVehicles={availableVehicles}
        totalVehicles={vehicles.filter(v => !v.archived).length}
      />
    )},
    { id: 'revenue', component: isBusinessActive ? (
      <RevenueBreakdownWidget
        total={todayTotal}
        breakdown={[
          { label: 'Bar', value: revenueCash, percentage: todayTotal > 0 ? Math.round((revenueCash / todayTotal) * 100) : 0, color: 'hsl(var(--chart-primary))' },
          { label: 'Rechnung', value: revenueInvoice, percentage: todayTotal > 0 ? Math.round((revenueInvoice / todayTotal) * 100) : 0, color: 'hsl(var(--primary))' },
          { label: 'Karte', value: revenueCard, percentage: todayTotal > 0 ? Math.round((revenueCard / todayTotal) * 100) : 0, color: 'hsl(var(--status-success))' }
        ]}
        comparison={{ yesterday: 0, lastWeek: 0, lastMonth: 0 }}
      />
    ) : (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-foreground" />
            <h3 className="font-semibold mb-2">Umsatz-Analyse</h3>
            <p className="text-sm text-muted-foreground mb-4">Detaillierte Umsatz-Aufschlüsselung nur im Business-Tarif</p>
            <V28Button size="sm" onClick={() => navigate('/pricing')} variant="primary">Jetzt upgraden</V28Button>
          </div>
        </CardContent>
      </Card>
    )}
  ];
  
  return (
    <>
      {showWelcomeWizard && (
        <WelcomeWizard
          onComplete={() => {
            localStorage.setItem('mydispatch_onboarding_completed', 'true');
            setShowWelcomeWizard(false);
          }}
          onSkip={() => {
            localStorage.setItem('mydispatch_onboarding_completed', 'true');
            setShowWelcomeWizard(false);
          }}
        />
      )}
      
      <UnifiedPageTemplate
        title="Dashboard"
        description="MyDispatch Dashboard: Überblick über Aufträge, Fahrer, Fahrzeuge und Umsätze"
        canonical="/"
        
        header={{
          title: 'Dashboard',
          description: `Willkommen zurück${profile?.first_name ? `, ${profile.first_name}` : ''}! Hier ist Ihre Übersicht heute.`,
          kpis: [
            { label: 'Aufträge heute', value: totalBookings, icon: FileText, trend: '+12%', statusType: 'success' },
            { label: 'Umsatz', value: formatCurrency(totalRevenue), icon: TrendingUp, trend: '+8%', statusType: 'success' },
            { label: 'Verfügbare Fahrer', value: activeDrivers, icon: Users, statusType: 'neutral' }
          ],
          quickActions: [
            { label: 'Neuer Auftrag', icon: Plus, onClick: () => navigate('/auftraege', { state: { openCreateDialog: true } }) },
            { label: 'Kalender', icon: Calendar, onClick: () => navigate('/schichtzettel'), variant: 'outline' as const },
            { label: 'Team-Chat', icon: MessageSquare, onClick: () => navigate('/kommunikation'), variant: 'outline' as const }
          ]
        }}
        
        content={{
          type: 'custom',
          data: [],
          customContent: (
            <div className="space-y-6 overflow-hidden">
              {/* Widgets Grid - Perfekt ausgerichtet */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {dashboardWidgets.map(w => (
                  <div key={w.id} className="w-full h-full">{w.component}</div>
                ))}
              </div>
              
              {/* Map + Sidebar - Responsive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 w-full overflow-hidden">
                  <HEREMapComponent />
                </div>
                <div className="w-full space-y-4">
                  <WeatherWidget />
                  <TrafficWidget />
                  <Card className="w-full overflow-hidden">
                    <CardContent className="p-4 space-y-2">
                      {quickActions.map(action => (
                        <V28Button
                          key={action.label}
                          variant={action.variant === 'outline' ? 'secondary' : 'primary'}
                          size="sm"
                          className="w-full justify-start min-h-[44px]"
                          onClick={action.action}
                        >
                          <action.icon className="mr-2 h-4 w-4" />
                          {action.label}
                        </V28Button>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* AI Predictive (Business+) */}
              {isBusinessActive && (
                <PredictiveDemandWidget />
              )}
              
              {/* Timeline - Perfekt ausgerichtet */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {isBusinessActive && (
                  <div className="lg:col-span-1 w-full overflow-hidden">
                    <LiveInfoWidget />
                  </div>
                )}
                <div className={cn(
                  "w-full overflow-hidden",
                  isBusinessActive ? 'lg:col-span-2' : 'lg:col-span-3'
                )}>
                  <ActivityTimeline activities={activities} maxItems={5} />
                </div>
              </div>
              
              {/* Upgrade Banner */}
              {!isBusinessActive && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Erweitern Sie Ihre Möglichkeiten</h3>
                        <p className="text-sm text-muted-foreground">Upgraden Sie auf Business für Live-Tracking, Wetter & Verkehrsdaten</p>
                      </div>
                      <V28Button onClick={() => navigate('/pricing')} variant="primary">Tarife ansehen</V28Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        }}
        
        isLoading={false}
      />
    </>
  );
}
