/* ==================================================================================
   MYDISPATCH - LIVEBLOCKS INSPIRED DESIGN
   ==================================================================================
   ✅ Moderne Liveblocks-Ästhetik
   ✅ Clean, minimalistisch, viel Weißraum
   ✅ MyDispatch-Farben (Blau/Grau-Palette)
   ✅ Smooth Animations & Glassmorphism
   ================================================================================== */

import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { useStatistics } from '@/hooks/use-statistics';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useDrivers } from '@/hooks/use-drivers';
import { useVehicles } from '@/hooks/use-vehicles';
import { useBookings } from '@/hooks/use-bookings';
import { useDeviceType } from '@/hooks/use-device-type';
import { useRealtimeBookings } from '@/hooks/use-realtime-bookings';
import { useRealtimeDrivers } from '@/hooks/use-realtime-drivers';
import { useRealtimeVehicles } from '@/hooks/use-realtime-vehicles';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  FileText, Users, Car, Plus, Calendar, MessageSquare,
  Clock, Euro, Activity, MapPin, ArrowRight, TrendingUp,
  Zap, BarChart3, Settings
} from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { MobileDashboard } from '@/components/mobile/MobileDashboard';
import { WelcomeWizard } from '@/components/onboarding/WelcomeWizard';
import { NewBookingDialog } from '@/components/dashboard/NewBookingDialog';
import { formatCurrency } from '@/lib/format-utils';

export default function IndexLiveblocks() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { stats: liveData } = useStatistics();
  const { data: dashboardStats } = useDashboardStats();
  const { drivers = [] } = useDrivers();
  const { vehicles = [] } = useVehicles();
  const { bookings = [] } = useBookings();
  const { isMobile } = useDeviceType();

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

  const handleWelcomeComplete = useCallback(() => {
    localStorage.setItem('mydispatch_onboarding_completed', 'true');
    setShowWelcomeWizard(false);
  }, []);

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
          onNavigate={(path) => navigate(path)}
        />
      </>
    );
  }

  // Desktop View - Liveblocks Style
  return (
    <>
      <SEOHead
        title="Dashboard"
        description="MyDispatch - Modernes Dispatch-System"
        canonical="/dashboard"
      />

      {showWelcomeWizard && (
        <WelcomeWizard
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeComplete}
        />
      )}

      {/* ✨ LIVEBLOCKS-STYLE CONTAINER */}
      <div className="min-h-screen bg-background">

        {/* ✨ STICKY HEADER - Liveblocks Style */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="max-w-[1400px] mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Navigation */}
              <div className="flex items-center gap-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    MyDispatch
                  </h1>
                </div>

                {/* Top Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/auftraege')}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    Aufträge
                  </button>
                  <button
                    onClick={() => navigate('/fahrer')}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    Fahrer
                  </button>
                  <button
                    onClick={() => navigate('/finanzen')}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    Finanzen
                  </button>
                </nav>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Live Time */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono font-semibold text-foreground tabular-nums">
                    {format(currentTime, 'HH:mm:ss')}
                  </span>
                </div>

                {/* User Avatar */}
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-sm font-bold text-muted-foreground">
                    {profile?.first_name?.[0] || 'U'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ✨ MAIN CONTENT AREA */}
        <main className="max-w-[1400px] mx-auto px-8 py-12">

          {/* ✨ HERO SECTION - Liveblocks Style */}
          <div className="mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Live Dashboard
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
              Willkommen zurück
              {profile?.first_name && (
                <span className="text-blue-600">, {profile.first_name}</span>
              )}
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl">
              Ihr Dispatch-System läuft. Hier ist Ihre Übersicht für heute, {format(currentTime, 'dd. MMMM yyyy', { locale: de })}.
            </p>
          </div>

          {/* ✨ KPI CARDS - Liveblocks Style (Clean & Minimal) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>

            {/* Aufträge Card */}
            <button
              onClick={() => navigate('/auftraege')}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Aufträge heute</p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">{totalBookings}</p>
                  <p className="text-xs font-medium text-green-600">+12.5% vs. gestern</p>
                </div>
              </div>
            </button>

            {/* Umsatz Card */}
            <button
              onClick={() => navigate('/finanzen')}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-bl-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Euro className="w-6 h-6 text-green-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Umsatz heute</p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs font-medium text-green-600">+8.3% vs. gestern</p>
                </div>
              </div>
            </button>

            {/* Fahrer Card */}
            <button
              onClick={() => navigate('/fahrer')}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Aktive Fahrer</p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">{activeDrivers}</p>
                  <p className="text-xs font-medium text-muted-foreground">von {drivers.filter(d => !d.archived).length} total</p>
                </div>
              </div>
            </button>

            {/* Fahrzeuge Card */}
            <button
              onClick={() => navigate('/fahrer?tab=fahrzeuge')}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Car className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Verfügbare Fahrzeuge</p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">{availableVehicles}</p>
                  <p className="text-xs font-medium text-muted-foreground">von {vehicles.filter(v => !v.archived).length} total</p>
                </div>
              </div>
            </button>
          </div>

          {/* ✨ QUICK ACTIONS SECTION */}
          <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/50 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">Schnellaktionen</h3>
                  <p className="text-sm text-muted-foreground">Häufig verwendete Funktionen</p>
                </div>
                <Zap className="w-6 h-6 text-blue-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowNewBookingDialog(true)}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                      Neuer Auftrag
                    </p>
                    <p className="text-xs text-muted-foreground">Auftrag erstellen</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/schichtzettel')}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                      Schichtzettel
                    </p>
                    <p className="text-xs text-muted-foreground">Zeiten verwalten</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/finanzen?tab=berichte')}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground group-hover:text-green-600 transition-colors">
                      Berichte
                    </p>
                    <p className="text-xs text-muted-foreground">Analytics ansehen</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/einstellungen')}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground group-hover:text-gray-600 transition-colors">
                      Einstellungen
                    </p>
                    <p className="text-xs text-muted-foreground">System konfigurieren</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </div>

          {/* ✨ RECENT ACTIVITY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>

            {/* Letzte Aufträge */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Letzte Aufträge</h3>
                  <p className="text-sm text-muted-foreground">Neueste Buchungen</p>
                </div>
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="space-y-3">
                {bookings
                  .filter(b => !b.archived)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 5)
                  .map(booking => (
                    <button
                      key={booking.id}
                      onClick={() => navigate('/auftraege')}
                      className="w-full group flex items-center justify-between p-4 rounded-xl hover:bg-accent border border-transparent hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground text-sm">
                            {booking.customer?.first_name} {booking.customer?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {booking.pickup_address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground">{formatCurrency(booking.price || 0)}</span>
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          booking.status === 'completed' ? 'bg-green-50 text-green-700' :
                          booking.status === 'in_progress' ? 'bg-amber-50 text-amber-700' :
                          booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          {booking.status === 'completed' ? 'Erledigt' :
                           booking.status === 'in_progress' ? 'Aktiv' :
                           booking.status === 'confirmed' ? 'Bestätigt' : 'Ausstehend'}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              <button
                onClick={() => navigate('/auftraege')}
                className="w-full mt-4 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                Alle Aufträge anzeigen
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Fahrzeug-Status */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Fahrzeug-Status</h3>
                  <p className="text-sm text-muted-foreground">Flottenübersicht</p>
                </div>
                <Car className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="space-y-3">
                {vehicles
                  .filter(v => !v.archived)
                  .slice(0, 5)
                  .map(vehicle => (
                    <button
                      key={vehicle.id}
                      onClick={() => navigate('/fahrer?tab=fahrzeuge')}
                      className="w-full group flex items-center justify-between p-4 rounded-xl hover:bg-accent border border-transparent hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-3 h-3 rounded-full ${
                          vehicle.status === 'available' ? 'bg-green-500' :
                          vehicle.status === 'im_einsatz' ? 'bg-amber-500' :
                          'bg-red-500'
                        } animate-pulse`} />
                        <div className="text-left">
                          <p className="font-semibold text-foreground text-sm">
                            {vehicle.license_plate}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.brand} {vehicle.model}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        vehicle.status === 'available' ? 'bg-green-50 text-green-700' :
                        vehicle.status === 'im_einsatz' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {vehicle.status === 'available' ? 'Verfügbar' :
                         vehicle.status === 'im_einsatz' ? 'Im Einsatz' : 'Wartung'}
                      </span>
                    </button>
                  ))}
              </div>

              <button
                onClick={() => navigate('/fahrer?tab=fahrzeuge')}
                className="w-full mt-4 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                Alle Fahrzeuge anzeigen
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </main>

        {/* ✨ FOOTER - Liveblocks Style */}
        <footer className="border-t border-border mt-24">
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>© 2025 MyDispatch. Powered by NeXify.</p>
              <div className="flex items-center gap-6">
                <button className="hover:text-foreground transition-colors">Dokumentation</button>
                <button className="hover:text-foreground transition-colors">Support</button>
                <button className="hover:text-foreground transition-colors">Status</button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {showNewBookingDialog && (
        <NewBookingDialog
          open={showNewBookingDialog}
          onOpenChange={(open) => setShowNewBookingDialog(open)}
        />
      )}
    </>
  );
}
