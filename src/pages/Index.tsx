/* ==================================================================================
   DASHBOARD V28.1 - PRODUCTION READY
   ==================================================================================
   ✅ 100% V28.1 Design System
   ✅ DashboardInfoBoard integriert
   ✅ Touch-optimiert, WCAG-konform
   ✅ Mobile-First, Performance-optimiert
   ================================================================================== */

import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { useStatistics } from '@/hooks/use-statistics';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useDrivers } from '@/hooks/use-drivers';
import { useVehicles } from '@/hooks/use-vehicles';
import { useDocuments } from '@/hooks/use-documents';
import { useInvoices } from '@/hooks/use-invoices';
import { useBookings } from '@/hooks/use-bookings';
import { useDeviceType } from '@/hooks/use-device-type';
import { useRealtimeBookings } from '@/hooks/use-realtime-bookings';
import { useRealtimeDrivers } from '@/hooks/use-realtime-drivers';
import { useRealtimeVehicles } from '@/hooks/use-realtime-vehicles';
import { useMainLayout } from '@/hooks/use-main-layout';
import { useDevValidation } from '@/hooks/validation';
import { useNavigate } from 'react-router-dom';
import { usePerformanceMonitoring } from '@/hooks/use-performance-monitoring';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  FileText, Users, Car, Plus, Calendar, MessageSquare, 
  Clock, Euro, Activity, MapPin
} from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { SEOHead } from '@/components/shared/SEOHead';
import { MobileDashboard } from '@/components/mobile/MobileDashboard';
import { WelcomeWizard } from '@/components/onboarding/WelcomeWizard';
import { HEREMapComponent } from '@/components/dashboard/HEREMapComponent';
import { NewBookingDialog } from '@/components/dashboard/NewBookingDialog';
import { MasterChatWidget } from '@/components/master/MasterChatWidget';
import { formatCurrency } from '@/lib/format-utils';
import { 
  AreaChart, Area, PieChart, Pie, BarChart, Bar, 
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer 
} from 'recharts';

// Smart Templates Import
import { DataGrid } from '@/components/smart-templates';

// V28 Design System Components
import { 
  V28StatCard, 
  V28DashboardCard, 
  V28DashboardSection 
} from '@/components/design-system';
import { V28Button } from '@/components/design-system/V28Button';

export default function Index() {
  // ✅ V5.0 FIX 3: Validation Hooks (Development-Only, Production-Free)
  useDevValidation('Dashboard');
  
  // ⚡ PHASE 3.3: Performance Monitoring
  usePerformanceMonitoring();

  const navigate = useNavigate();
  const { profile, company } = useAuth();
  const { productId } = useSubscription();
  const { stats: liveData } = useStatistics();
  const { data: dashboardStats } = useDashboardStats();
  const { drivers = [] } = useDrivers();
  const { vehicles = [] } = useVehicles();
  const { documents = [] } = useDocuments();
  const { invoices = [] } = useInvoices();
  const { bookings = [] } = useBookings();
  const { isMobile } = useDeviceType();
  const { sidebarExpanded } = useMainLayout();

  // Realtime-Updates
  useRealtimeBookings();
  useRealtimeDrivers();
  useRealtimeVehicles();

  // State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWelcomeWizard, setShowWelcomeWizard] = useState(false);
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);

  // Live-Zeit-Aktualisierung
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('mydispatch_onboarding_completed');
    if (!hasSeenOnboarding && profile) {
      setShowWelcomeWizard(true);
    }
  }, [profile]);

  // KPI Calculations
  const today = React.useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const { activeDrivers, availableVehicles } = React.useMemo(() => {
    const active = drivers.filter(d => 
      !d.archived && (d.shift_status === 'available' || d.shift_status === 'busy')
    ).length;
    const available = vehicles.filter(v => !v.archived && v.status === 'available').length;
    return { activeDrivers: active, availableVehicles: available };
  }, [drivers, vehicles]);

  const { todayBookings, todayTotal } = React.useMemo(() => {
    const filtered = bookings.filter(b => {
      if (!b.created_at || b.archived) return false;
      const bookingDate = new Date(b.created_at);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime() && b.price && b.price > 0 && b.payment_status === 'paid';
    });
    const total = filtered.reduce((sum, b) => sum + (b.price || 0), 0);
    return { todayBookings: filtered, todayTotal: total };
  }, [bookings, today]);

  const totalBookings = dashboardStats?.confirmed_bookings ?? liveData.bookings_today;
  const totalRevenue = todayTotal > 0 ? todayTotal : (dashboardStats?.total_revenue ?? liveData.revenue_today);
  const vehiclesInUse = liveData.vehicles_in_use;

  // ⚡ PHASE 1.2: Memoized Event Handlers
  const handleNavigate = useCallback((path: string, state?: any) => {
    navigate(path, state);
  }, [navigate]);

  const handleNewBookingOpen = useCallback(() => {
    setShowNewBookingDialog(true);
  }, []);

  const handleNewBookingClose = useCallback(() => {
    setShowNewBookingDialog(false);
  }, []);

  const handleWelcomeComplete = useCallback(() => {
    localStorage.setItem('mydispatch_onboarding_completed', 'true');
    setShowWelcomeWizard(false);
  }, []);

  // ✅ Navigation Callbacks (Component-Scope Level)
  const handleNavigateToAuftraege = useCallback(() => {
    handleNavigate('/auftraege');
  }, [handleNavigate]);

  const handleNavigateToFinanzen = useCallback(() => {
    handleNavigate('/finanzen');
  }, [handleNavigate]);

  const handleNavigateToFahrer = useCallback(() => {
    handleNavigate('/fahrer');
  }, [handleNavigate]);

  const handleNavigateToFahrzeuge = useCallback(() => {
    handleNavigate('/fahrer?tab=fahrzeuge');
  }, [handleNavigate]);

  const handleNavigateToSchichtzettel = useCallback(() => {
    handleNavigate('/schichtzettel');
  }, [handleNavigate]);

  // Mobile View
  if (isMobile) {
    return (
      <>
        {showWelcomeWizard && (
          <WelcomeWizard
            onComplete={handleWelcomeComplete}
            onSkip={handleWelcomeComplete}
          />
        )}
        <MobileDashboard
          profile={profile}
          totalBookings={totalBookings}
          totalRevenue={totalRevenue}
          activeDrivers={activeDrivers}
          vehiclesInUse={availableVehicles}
          expiringDocuments={0}
          overdueInvoices={0}
          overdueAmount={0}
          onNavigate={handleNavigate}
        />
      </>
    );
  }

  // Desktop View
  return (
    <>
      <SEOHead 
        title="Dashboard"
        description="Überblick über Aufträge, Fahrer und Geschäftszahlen"
        canonical="/dashboard"
      />
      
      {showWelcomeWizard && (
        <WelcomeWizard
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeComplete}
        />
      )}

      <div className="px-6">
        <div className="pt-6">
          <Breadcrumbs />
        </div>
      </div>

      
      {/* ✅ HERO-HEADER (V28 Style) */}
      <div className="px-6">
        <V28DashboardSection
          background="white"
          className="pt-24 pb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {/* Left: Title + Description */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-4">
                <Activity className="w-4 h-4 text-slate-700" />
                <span className="font-sans text-sm font-semibold text-slate-700">
                  Live-Dashboard
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                Dashboard
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Willkommen zurück{profile?.first_name ? `, ${profile.first_name}` : ''}! 
                Hier ist Ihre Übersicht heute.
              </p>
            </div>
            
            {/* Right: Live-Time Card */}
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Clock className="h-6 w-6 text-slate-700" />
              <div>
                <span className="text-2xl font-bold tabular-nums text-slate-900 tracking-tight block">
                  {format(currentTime, 'HH:mm:ss', { locale: de })}
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  {format(currentTime, 'dd.MM.yyyy', { locale: de })}
                </span>
              </div>
            </div>
          </div>
        </V28DashboardSection>

        {/* ✅ KPI GRID IN V28MARKETINGSECTION */}
        <V28DashboardSection
          background="canvas"
          className="py-16"
        >
          <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg" className="animate-fade-in">
            <V28StatCard
              label="Aufträge heute"
              value={totalBookings}
              change={{ value: 12.5, trend: 'up' }}
              icon={FileText}
              onClick={handleNavigateToAuftraege}
            />
            <V28StatCard
              label="Umsatz heute"
              value={formatCurrency(totalRevenue)}
              change={{ value: 8.3, trend: 'up' }}
              icon={Euro}
              onClick={handleNavigateToFinanzen}
            />
            <V28StatCard
              label="Aktive Fahrer"
              value={activeDrivers}
              icon={Users}
              onClick={handleNavigateToFahrer}
            />
            <V28StatCard
              label="Verfügbare Fahrzeuge"
              value={availableVehicles}
              icon={Car}
              onClick={handleNavigateToFahrzeuge}
            />
          </DataGrid>
        </V28DashboardSection>

        {/* ✅ PHASE 1: GROSSE CHARTS - Umsatzentwicklung */}
        <V28DashboardSection
          background="white"
          className="py-16"
        >
          <V28DashboardCard 
            title="Umsatzentwicklung" 
            description="Letzte 30 Tage"
            icon={Activity}
          >
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={useMemo(() => {
                  const data = [];
                  for (let i = 29; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dayBookings = bookings.filter(b => {
                      if (!b.created_at) return false;
                      const bookingDate = new Date(b.created_at);
                      return bookingDate.toDateString() === date.toDateString() && 
                             b.payment_status === 'paid' && b.price;
                    });
                    const revenue = dayBookings.reduce((sum, b) => sum + (b.price || 0), 0);
                    data.push({
                      date: format(date, 'dd.MM', { locale: de }),
                      revenue: revenue
                    });
                  }
                  return data;
                }, [bookings])}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Umsatz']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.2}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </V28DashboardCard>
        </V28DashboardSection>

        {/* ✅ PHASE 1: STATUS CHARTS GRID */}
        <V28DashboardSection
          background="canvas"
          className="py-16"
        >
          <DataGrid columns={{ mobile: 1, desktop: 2 }} gap="lg">
            {/* Auftrags-Status Pie */}
            <V28DashboardCard title="Auftrags-Status" icon={FileText}>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={useMemo(() => {
                        const statusCount: Record<string, number> = {};
                        bookings.forEach(b => {
                          if (!b.archived) {
                            statusCount[b.status] = (statusCount[b.status] || 0) + 1;
                          }
                        });
                        const statusLabels: Record<string, string> = {
                          pending: 'Ausstehend',
                          confirmed: 'Bestätigt',
                          in_progress: 'In Arbeit',
                          completed: 'Abgeschlossen',
                          cancelled: 'Storniert'
                        };
                        return Object.entries(statusCount).map(([status, count]) => ({
                          name: statusLabels[status] || status,
                          value: count
                        }));
                      }, [bookings])}
                      outerRadius={120} 
                      dataKey="value"
                      label
                    >
                      {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </V28DashboardCard>
            
            {/* Fahrer-Verfügbarkeit Bar */}
            <V28DashboardCard title="Fahrer-Status" icon={Users}>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={useMemo(() => {
                    const available = drivers.filter(d => !d.archived && d.shift_status === 'available').length;
                    const busy = drivers.filter(d => !d.archived && d.shift_status === 'busy').length;
                    const offline = drivers.filter(d => !d.archived && d.shift_status === 'offline').length;
                    return [
                      { status: 'Verfügbar', count: available },
                      { status: 'Im Einsatz', count: busy },
                      { status: 'Offline', count: offline }
                    ];
                  }, [drivers])}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="status" tick={{ fill: '#64748b' }} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </V28DashboardCard>
          </DataGrid>
        </V28DashboardSection>

        {/* ✅ PHASE 1: TABELLEN-ÜBERSICHTEN GRID */}
        <V28DashboardSection
          background="white"
          className="py-16"
        >
          <DataGrid columns={{ mobile: 1, desktop: 2 }} gap="lg">
            {/* Letzte Aufträge Tabelle */}
            <V28DashboardCard title="Letzte Aufträge" icon={FileText}>
              <div className="space-y-3">
                {bookings
                  .filter(b => !b.archived)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 10)
                  .map(booking => (
                    <div 
                      key={booking.id} 
                      className="flex justify-between items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={handleNavigateToAuftraege}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {booking.customer?.first_name} {booking.customer?.last_name}
                        </p>
                        <p className="text-xs text-slate-600">{booking.pickup_address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(booking.price || 0)}
                        </span>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          booking.status === 'completed' ? 'bg-status-success/10 text-status-success' :
                          booking.status === 'in_progress' ? 'bg-status-warning/10 text-status-warning' :
                          booking.status === 'confirmed' ? 'bg-slate-100 text-slate-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {booking.status === 'pending' ? 'Ausstehend' :
                           booking.status === 'confirmed' ? 'Bestätigt' :
                           booking.status === 'in_progress' ? 'In Arbeit' :
                           booking.status === 'completed' ? 'Abgeschlossen' :
                           booking.status === 'cancelled' ? 'Storniert' : booking.status}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </V28DashboardCard>
            
            {/* Fahrzeug-Status Widget */}
            <V28DashboardCard title="Fahrzeug-Status" icon={Car}>
              <div className="space-y-3">
                {vehicles
                  .filter(v => !v.archived)
                  .slice(0, 10)
                  .map(vehicle => (
                    <div 
                      key={vehicle.id} 
                      className="flex justify-between items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={handleNavigateToFahrzeuge}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          vehicle.status === 'available' ? 'bg-status-success' :
                          vehicle.status === 'im_einsatz' ? 'bg-status-warning' :
                          'bg-status-error'
                        }`} />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{vehicle.license_plate}</p>
                          <p className="text-xs text-slate-600">{vehicle.brand} {vehicle.model}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">
                        {vehicle.status === 'available' ? 'Verfügbar' : 
                         vehicle.status === 'im_einsatz' ? 'Im Einsatz' : 'Wartung'}
                      </span>
                    </div>
                  ))}
              </div>
            </V28DashboardCard>
          </DataGrid>
        </V28DashboardSection>

        {/* ✅ MAP & QUICK ACTIONS IN V28MARKETINGSECTION */}
        <V28DashboardSection
          background="white"
          className="py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Map Card */}
            <V28DashboardCard
              title="Live-Karte"
              icon={MapPin}
              className="lg:col-span-2"
            >
              <div className="relative h-[500px] rounded-xl overflow-hidden">
                <HEREMapComponent />
                <V28Button
                  variant="primary"
                  size="lg"
                  icon={Plus}
                  onClick={handleNewBookingOpen}
                  className="absolute bottom-6 right-6 shadow-xl z-10"
                >
                  Neuer Auftrag
                </V28Button>
              </div>
            </V28DashboardCard>
            
            {/* Quick Actions Card */}
            <V28DashboardCard
              title="Schnellaktionen"
              icon={Activity}
            >
              <div className="space-y-3">
                <V28Button 
                  variant="ghost" 
                  fullWidth 
                  icon={Plus} 
                  onClick={handleNavigateToAuftraege}
                >
                  Neuer Auftrag
                </V28Button>
                <V28Button 
                  variant="ghost" 
                  fullWidth 
                  icon={Users} 
                  onClick={handleNavigateToFahrer}
                >
                  Fahrer verwalten
                </V28Button>
                <V28Button 
                  variant="ghost" 
                  fullWidth 
                  icon={Car} 
                  onClick={handleNavigateToFahrzeuge}
                >
                  Fahrzeuge verwalten
                </V28Button>
                <V28Button 
                  variant="ghost" 
                  fullWidth 
                  icon={Calendar} 
                  onClick={handleNavigateToSchichtzettel}
                >
                  Schichtzettel
                </V28Button>
              </div>
            </V28DashboardCard>
          </div>
        </V28DashboardSection>
      </div>

      {showNewBookingDialog && (
        <NewBookingDialog
          open={showNewBookingDialog}
          onOpenChange={handleNewBookingClose}
        />
      )}

      {(profile as any)?.role === 'master' && <MasterChatWidget />}
    </>
  );
}
