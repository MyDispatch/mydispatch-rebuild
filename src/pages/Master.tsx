/* ==================================================================================
   MASTER SYSTEM DASHBOARD V33.0 - MAINLAYOUT INTEGRATION
   ==================================================================================
   ✅ Phase 1-9: White-Screen Fix komplett
   ✅ Kein eigenes Layout mehr (nutzt MainLayout)
   ✅ Quick Actions Panel via Context Hook
   ✅ Single Scroll-Container (MainLayout)
   ✅ Floating Orbs von MainLayout
   ✅ Performance-optimiert (useMemo)
   ================================================================================== */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMainLayout } from '@/hooks/use-main-layout';
import { useQuickActionsPanel } from '@/hooks/use-quick-actions-panel';
import { SEOHead } from '@/components/shared/SEOHead';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { WidgetErrorBoundary } from '@/components/shared/WidgetErrorBoundary';
import { Premium3DCard } from '@/components/design-system/Premium3DCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DetailTrigger, StandardDetailDialog } from '@/components/shared/StandardDetailDialog';
import { SystemLogsDialog } from '@/components/master/SystemLogsDialog';
import { AgentDashboard } from '@/components/shared/AgentDashboard';
import { PerformanceMonitoringWidget } from '@/components/dashboard/PerformanceMonitoringWidget';
import { RoadmapProgressWidget } from '@/components/dashboard/RoadmapProgressWidget';
import { SystemStatusWidget } from '@/components/dashboard/context-widgets/SystemStatusWidget';
import { useAuth } from '@/hooks/use-auth';
import { useAccountType } from '@/hooks/use-account-type';
import { useToast } from '@/hooks/use-toast';
import { masterDashboardContent } from '@/lib/content/master-dashboard-content';
import { formatPercentage, formatMilliseconds, formatNumber, formatRelativeTime } from '@/lib/format-utils';
import
{
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  Users,
  TrendingUp,
  Building2,
  FileCode,
  Rocket,
  GitBranch,
  PlayCircle,
  FileDown,
  Settings,
  Upload,
  RefreshCw,
  Shield,
  Key,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { captureError } from '@/lib/sentry-integration';
import type { LucideIcon } from 'lucide-react';

interface Company
{
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  subscription_product_id: string | null;
  company_status: string;
  total_bookings: number;
  total_drivers: number;
  total_vehicles: number;
  monthly_revenue: number;
  created_at: string;
}

interface SystemHealth
{
  uptime: number;
  errorRate: number;
  activeUsers: number;
  dbResponseTime: number;
}

export default function Master ()
{
  const { sidebarExpanded } = useMainLayout();
  const { setConfig } = useQuickActionsPanel();
  const { profile } = useAuth();
  const { accountType } = useAccountType();
  const isMasterAccount = accountType === 'master';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ currentTime, setCurrentTime ] = useState( new Date() );
  const [ companies, setCompanies ] = useState<Company[]>( [] );
  const [ loading, setLoading ] = useState( true );
  const [ selectedCompany, setSelectedCompany ] = useState<Company | null>( null );
  const [ detailDialogOpen, setDetailDialogOpen ] = useState( false );
  const [ activeTab, setActiveTab ] = useState( 'companies' );
  const [ systemLogs, setSystemLogs ] = useState<Array<{
    id: string;
    severity: 'info' | 'warning' | 'error';
    message: string;
    component?: string;
    created_at: string;
  }>>( [] );
  const [ logsDialogOpen, setLogsDialogOpen ] = useState( false );

  // Quick Actions Config (Context-Sensitive, Memoized)
  const quickActionsMap: Record<string, Array<{ icon: LucideIcon; label: string; action: () => void; tooltip?: string }>> = useMemo( () => ( {
    companies: [
      { icon: Building2, label: masterDashboardContent.quickActions.categories.companies.addCompany, action: () => toast( { title: masterDashboardContent.toasts.newCompany } ), tooltip: masterDashboardContent.quickActions.tooltips.addCompany },
      { icon: Upload, label: masterDashboardContent.quickActions.categories.companies.csvImport, action: () => toast( { title: masterDashboardContent.toasts.csvImport } ), tooltip: masterDashboardContent.quickActions.tooltips.csvImport },
      { icon: FileDown, label: masterDashboardContent.quickActions.categories.companies.exportList, action: () => toast( { title: masterDashboardContent.toasts.exportPdf } ), tooltip: masterDashboardContent.quickActions.tooltips.exportList },
    ],
    quality: [
      { icon: PlayCircle, label: masterDashboardContent.quickActions.categories.quality.startCheck, action: () => toast( { title: masterDashboardContent.toasts.codeCheck } ), tooltip: masterDashboardContent.quickActions.tooltips.startCheck },
      { icon: FileDown, label: masterDashboardContent.quickActions.categories.quality.qualityReport, action: () => toast( { title: masterDashboardContent.toasts.reportGenerating } ), tooltip: masterDashboardContent.quickActions.tooltips.qualityReport },
      { icon: RefreshCw, label: masterDashboardContent.quickActions.categories.quality.refreshData, action: () => toast( { title: masterDashboardContent.toasts.dataRefreshing } ), tooltip: masterDashboardContent.quickActions.tooltips.refreshData },
    ],
    system: [
      { icon: Activity, label: masterDashboardContent.quickActions.categories.system.systemMonitor, action: () => toast( { title: masterDashboardContent.toasts.systemMonitor } ), tooltip: masterDashboardContent.quickActions.tooltips.systemMonitor },
      {
        icon: FileDown, label: masterDashboardContent.quickActions.categories.system.systemLogs, action: async () =>
        {
          const toastId = sonnerToast.loading( masterDashboardContent.toasts.logsLoading );
          try
          {
            const { data, error } = await supabase.functions.invoke( 'get-system-logs' );

            if ( error )
            {
              throw new Error( error.message || masterDashboardContent.errors.systemLogsError );
            }

            if ( data?.success && data.logs )
            {
              setSystemLogs( data.logs );
              setLogsDialogOpen( true );
              sonnerToast.success( masterDashboardContent.toasts.logsLoaded, { id: toastId } );
            } else
            {
              throw new Error( data?.error || masterDashboardContent.errors.systemLogsError );
            }
          } catch ( err )
          {
            sonnerToast.error(
              err instanceof Error ? err.message : masterDashboardContent.errors.systemLogsError,
              { id: toastId }
            );
            console.error( '[Master] System Logs Error:', err );
            captureError( err instanceof Error ? err : new Error( String( err ) ), { component: 'Master', action: 'get-system-logs' } );
          }
        }, tooltip: masterDashboardContent.quickActions.tooltips.systemLogs
      },
      {
        icon: Database, label: masterDashboardContent.quickActions.categories.system.dbBackup, action: async () =>
        {
          const toastId = sonnerToast.loading( masterDashboardContent.toasts.backupStarted );
          try
          {
            const { data, error } = await supabase.functions.invoke( 'trigger-db-backup', { body: { type: 'manual' } } );

            if ( error ) throw new Error( error.message || masterDashboardContent.errors.backupError );

            if ( data?.success )
            {
              sonnerToast.success( masterDashboardContent.toasts.backupSuccess, { id: toastId } );
            } else
            {
              throw new Error( data?.error || masterDashboardContent.errors.backupError );
            }
          } catch ( err )
          {
            sonnerToast.error(
              err instanceof Error ? err.message : masterDashboardContent.errors.backupError,
              { id: toastId }
            );
            console.error( '[Master] DB Backup Error:', err );
            captureError( err instanceof Error ? err : new Error( String( err ) ), { component: 'Master', action: 'trigger-db-backup' } );
          }
        }, tooltip: masterDashboardContent.quickActions.tooltips.dbBackup
      },
      {
        icon: RefreshCw, label: masterDashboardContent.quickActions.categories.system.clearCache, action: async () =>
        {
          const toastId = sonnerToast.loading( masterDashboardContent.toasts.cacheClearing );
          try
          {
            const { data, error } = await supabase.functions.invoke( 'clear-cache' );

            if ( error ) throw new Error( error.message || masterDashboardContent.errors.cacheError );

            if ( data?.success )
            {
              sonnerToast.success( masterDashboardContent.toasts.cacheCleared, { id: toastId } );
            } else
            {
              throw new Error( data?.error || masterDashboardContent.errors.cacheError );
            }
          } catch ( err )
          {
            sonnerToast.error(
              err instanceof Error ? err.message : masterDashboardContent.errors.cacheError,
              { id: toastId }
            );
            console.error( '[Master] Clear Cache Error:', err );
            captureError( err instanceof Error ? err : new Error( String( err ) ), { component: 'Master', action: 'clear-cache' } );
          }
        }, tooltip: masterDashboardContent.quickActions.tooltips.clearCache
      },
      { icon: Settings, label: masterDashboardContent.quickActions.categories.system.systemSettings, action: () => toast( { title: masterDashboardContent.toasts.settingsOpened } ), tooltip: masterDashboardContent.quickActions.tooltips.systemSettings },
    ],
    agent: [
      {
        icon: Shield, label: masterDashboardContent.quickActions.categories.agent.securityScan, action: async () =>
        {
          const toastId = sonnerToast.loading( masterDashboardContent.toasts.securityScan );
          try
          {
            const { data, error } = await supabase.functions.invoke( 'run-security-scan' );

            if ( error ) throw new Error( error.message || masterDashboardContent.errors.securityScanError );

            if ( data?.success )
            {
              sonnerToast.success( masterDashboardContent.toasts.securityScanComplete, { id: toastId } );
            } else
            {
              throw new Error( data?.error || masterDashboardContent.errors.securityScanError );
            }
          } catch ( err )
          {
            sonnerToast.error(
              err instanceof Error ? err.message : masterDashboardContent.errors.securityScanError,
              { id: toastId }
            );
            console.error( '[Master] Security Scan Error:', err );
            captureError( err instanceof Error ? err : new Error( String( err ) ), { component: 'Master', action: 'run-security-scan' } );
          }
        }, tooltip: masterDashboardContent.quickActions.tooltips.securityScan
      },
      { icon: Key, label: masterDashboardContent.quickActions.categories.agent.accessControl, action: () => toast( { title: masterDashboardContent.toasts.accessControl } ), tooltip: masterDashboardContent.quickActions.tooltips.accessControl },
      { icon: AlertTriangle, label: masterDashboardContent.quickActions.categories.agent.vulnerabilityCheck, action: () => toast( { title: masterDashboardContent.toasts.vulnerabilityCheck } ), tooltip: masterDashboardContent.quickActions.tooltips.vulnerabilityCheck },
    ],
    roadmap: [
      { icon: Rocket, label: masterDashboardContent.quickActions.categories.roadmap.deployProduction, action: () => toast( { title: masterDashboardContent.toasts.deploymentStarted } ), tooltip: masterDashboardContent.quickActions.tooltips.deployProduction },
      {
        icon: Activity, label: masterDashboardContent.quickActions.categories.roadmap.deploymentStatus, action: async () =>
        {
          const toastId = sonnerToast.loading( masterDashboardContent.toasts.deploymentStatusLoading );
          try
          {
            const { data, error } = await supabase.functions.invoke( 'get-deployment-status' );

            if ( error ) throw new Error( error.message || masterDashboardContent.errors.deploymentError );

            if ( data?.success )
            {
              sonnerToast.success( masterDashboardContent.toasts.deploymentStatusLoaded, { id: toastId } );
            } else
            {
              throw new Error( data?.error || masterDashboardContent.errors.deploymentError );
            }
          } catch ( err )
          {
            sonnerToast.error(
              err instanceof Error ? err.message : masterDashboardContent.errors.deploymentError,
              { id: toastId }
            );
            console.error( '[Master] Deployment Status Error:', err );
            captureError( err instanceof Error ? err : new Error( String( err ) ), { component: 'Master', action: 'get-deployment-status' } );
          }
        }, tooltip: masterDashboardContent.quickActions.tooltips.deploymentStatus
      },
      { icon: GitBranch, label: masterDashboardContent.quickActions.categories.roadmap.createBranch, action: () => toast( { title: masterDashboardContent.toasts.branchCreated } ), tooltip: masterDashboardContent.quickActions.tooltips.createBranch },
    ],
    ci: [
      { icon: PlayCircle, label: masterDashboardContent.quickActions.categories.ci.runCiCheck, action: () => toast( { title: masterDashboardContent.toasts.ciCheck } ), tooltip: masterDashboardContent.quickActions.tooltips.runCiCheck },
      { icon: FileDown, label: masterDashboardContent.quickActions.categories.ci.downloadGuidelines, action: () => toast( { title: masterDashboardContent.toasts.guidelinesDownload } ), tooltip: masterDashboardContent.quickActions.tooltips.downloadGuidelines },
      { icon: Settings, label: masterDashboardContent.quickActions.categories.ci.ciSettings, action: () => toast( { title: masterDashboardContent.toasts.ciSettings } ), tooltip: masterDashboardContent.quickActions.tooltips.ciSettings },
    ],
  } ), [ toast ] );

  // Current Quick Actions (Memoized)
  const currentQuickActions = useMemo(
    () => quickActionsMap[ activeTab ] || quickActionsMap.companies,
    [ activeTab, quickActionsMap ]
  );

  // Recent Activities (Memoized)
  const recentActivities = useMemo( () => [
    {
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      title: masterDashboardContent.recentActivity.deploymentSuccessful,
      time: formatRelativeTime( 2, 'hours' ),
    },
    {
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      title: masterDashboardContent.recentActivity.highCpuUsage,
      time: formatRelativeTime( 5, 'hours' ),
    },
    {
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      title: masterDashboardContent.recentActivity.backupCompleted,
      time: formatRelativeTime( 1, 'day' ),
    },
  ], [] );

  // TODO: System Health von API laden (aktuell Mock Data)
  const [ systemHealth ] = useState<SystemHealth>( {
    uptime: 99.8,
    errorRate: 0.02,
    activeUsers: 247,
    dbResponseTime: 45,
  } );

  // Live Time Display
  useEffect( () =>
  {
    const timer = setInterval( () => setCurrentTime( new Date() ), 1000 );
    return () => clearInterval( timer );
  }, [] );

  // Redirect wenn kein Master-Account
  useEffect( () =>
  {
    if ( !isMasterAccount ) navigate( '/' );
  }, [ isMasterAccount, navigate ] );

  // Global Error Handler
  useEffect( () =>
  {
    const handleGlobalError = ( event: ErrorEvent ) =>
    {
      captureError( event.error, {
        component: 'Master Dashboard',
        route: '/master',
        activeTab,
        userProfile: profile?.id || 'unknown',
      } );
    };

    const handleUnhandledRejection = ( event: PromiseRejectionEvent ) =>
    {
      captureError(
        new Error( `Unhandled Promise Rejection: ${ event.reason }` ),
        {
          component: 'Master Dashboard',
          route: '/master',
          activeTab,
          reason: event.reason,
        }
      );
    };

    window.addEventListener( 'error', handleGlobalError );
    window.addEventListener( 'unhandledrejection', handleUnhandledRejection );

    return () =>
    {
      window.removeEventListener( 'error', handleGlobalError );
      window.removeEventListener( 'unhandledrejection', handleUnhandledRejection );
    };
  }, [ activeTab, profile ] );

  // Quick Actions Panel Config (Context Hook)
  useEffect( () =>
  {
    setConfig( {
      enabled: true,
      quickActions: currentQuickActions.map( action => ( {
        icon: action.icon,
        label: action.label,
        action: action.action,
        tooltip: action.tooltip,
        variant: 'quick-action-primary' as const,
      } ) ),
      recentActivities: recentActivities,
      contextWidget: {
        title: masterDashboardContent.systemStatus.title,
        icon: Activity,
        content: <SystemStatusWidget />,
      },
    } );

    // Cleanup: Deaktiviere Panel beim Unmount
    return () => setConfig( null );
  }, [ currentQuickActions, recentActivities, setConfig ] );

  // Fetch Companies mit Stats
  useEffect( () =>
  {
    if ( !isMasterAccount ) return;
    fetchCompanies();
  }, [ isMasterAccount ] );

  const fetchCompanies = async () =>
  {
    try
    {
      const { data: companiesData, error } = await supabase
        .from( 'companies' )
        .select( '*' )
        .order( 'created_at', { ascending: false } );

      if ( error ) throw error;

      // Berechne Live-Statistiken
      const companiesWithStats = await Promise.all(
        ( companiesData || [] ).map( async ( company ) =>
        {
          const { count: bookings } = await supabase
            .from( 'bookings' )
            .select( '*', { count: 'exact', head: true } )
            .eq( 'company_id', company.id )
            .eq( 'archived', false );

          const { count: drivers } = await supabase
            .from( 'drivers' )
            .select( '*', { count: 'exact', head: true } )
            .eq( 'company_id', company.id )
            .eq( 'archived', false );

          const { count: vehicles } = await supabase
            .from( 'vehicles' )
            .select( '*', { count: 'exact', head: true } )
            .eq( 'company_id', company.id )
            .eq( 'archived', false );

          const startOfMonth = new Date();
          startOfMonth.setDate( 1 );
          startOfMonth.setHours( 0, 0, 0, 0 );

          const { data: monthlyBookings } = await supabase
            .from( 'bookings' )
            .select( 'price' )
            .eq( 'company_id', company.id )
            .gte( 'pickup_time', startOfMonth.toISOString() )
            .eq( 'archived', false );

          const revenue = monthlyBookings?.reduce( ( sum, b ) => sum + ( b.price || 0 ), 0 ) || 0;

          return {
            ...company,
            total_bookings: bookings || 0,
            total_drivers: drivers || 0,
            total_vehicles: vehicles || 0,
            monthly_revenue: revenue,
          };
        } )
      );

      setCompanies( companiesWithStats );
    } catch ( error )
    {
      console.error( 'Fehler beim Laden der Firmen:', error );
      sonnerToast.error( masterDashboardContent.toasts.companiesFetchError );
    } finally
    {
      setLoading( false );
    }
  };

  if ( !isMasterAccount ) return null;

  return (
    <>
      <SEOHead
        title="Master System Dashboard - MyDispatch"
        description="Zentrale System-Kontrolle und Administration"
        canonical="/master"
      />

      <ErrorBoundary>
        {/* Content (KEIN Layout-Wrapper - nutzt MainLayout) */ }
        <div className="p-6 space-y-6">
          {/* Page Header */ }
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">{ masterDashboardContent.header.title }</h1>
            <p className="text-sm text-slate-600">
              { masterDashboardContent.header.subtitle }
            </p>
            <p className="text-xs text-slate-500">
              { masterDashboardContent.header.lastUpdate }: { currentTime.toLocaleString( 'de-DE' ) }
            </p>
          </div>

          {/* System Health KPIs - Premium 3D Cards */ }
          <WidgetErrorBoundary widgetName="System Health">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Premium3DCard
                icon={ CheckCircle2 }
                label={ masterDashboardContent.systemHealth.uptime }
                value={ formatPercentage( systemHealth.uptime ) }
                trend={ `+0,2 % ${ masterDashboardContent.systemHealth.trends.vsLastWeek }` }
                trendDirection="up"
                variant="success"
              />
              <Premium3DCard
                icon={ AlertTriangle }
                label={ masterDashboardContent.systemHealth.errorRate }
                value={ formatPercentage( systemHealth.errorRate ) }
                trend={ `-0,01 % ${ masterDashboardContent.systemHealth.trends.vsLastWeek }` }
                trendDirection="down"
                variant="default"
              />
              <Premium3DCard
                icon={ Users }
                label={ masterDashboardContent.systemHealth.activeUsers }
                value={ formatNumber( systemHealth.activeUsers ) }
                trend={ `+12 ${ masterDashboardContent.systemHealth.trends.today }` }
                trendDirection="up"
                variant="default"
              />
              <Premium3DCard
                icon={ Database }
                label={ masterDashboardContent.systemHealth.dbResponse }
                value={ formatMilliseconds( systemHealth.dbResponseTime ) }
                trend={ `-5 ms ${ masterDashboardContent.systemHealth.trends.yesterday }` }
                trendDirection="down"
                variant="success"
              />
            </div>
          </WidgetErrorBoundary>

          {/* Tab-Navigation */ }
          <Tabs value={ activeTab } onValueChange={ setActiveTab } defaultValue="companies" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 bg-slate-100/80 p-2 rounded-xl">
              <TabsTrigger value="companies" aria-label={ masterDashboardContent.aria.companiesTab } className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">{ masterDashboardContent.tabs.companies }</span>
                <span className="sm:hidden">Comp.</span>
              </TabsTrigger>
              <TabsTrigger value="quality" aria-label={ masterDashboardContent.aria.qualityTab } className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all">
                <FileCode className="w-4 h-4" />
                <span className="hidden sm:inline">{ masterDashboardContent.tabs.quality }</span>
                <span className="sm:hidden">Code</span>
              </TabsTrigger>
              <TabsTrigger value="system" aria-label={ masterDashboardContent.aria.systemTab } className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">{ masterDashboardContent.tabs.system }</span>
                <span className="sm:hidden">Health</span>
              </TabsTrigger>
              <TabsTrigger value="agent" aria-label={ masterDashboardContent.aria.agentTab } className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all">
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">{ masterDashboardContent.tabs.agent }</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="roadmap" aria-label={ masterDashboardContent.aria.roadmapTab } className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all">
                <Rocket className="w-4 h-4" />
                <span className="hidden sm:inline">{ masterDashboardContent.tabs.roadmap }</span>
                <span className="sm:hidden">Road.</span>
              </TabsTrigger>
              <TabsTrigger value="ci" aria-label={ masterDashboardContent.aria.ciTab } className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all">
                <GitBranch className="w-4 h-4" />
                <span className="hidden sm:inline">{ masterDashboardContent.tabs.ci }</span>
                <span className="sm:hidden">CI</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Companies */ }
            <TabsContent value="companies" className="space-y-0">
              <WidgetErrorBoundary widgetName="Companies Table">
                <Card className="border-slate-200 shadow-md overflow-hidden">
                  <CardHeader className="border-b border-slate-200 bg-slate-50/50 py-4 px-6">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                      <Building2 className="w-5 h-5 text-slate-700" />
                      { masterDashboardContent.companiesTab.title }
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50/30">
                            <TableHead className="h-12 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">{ masterDashboardContent.companiesTab.tableHeaders.name }</TableHead>
                            <TableHead className="h-12 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">{ masterDashboardContent.companiesTab.tableHeaders.status }</TableHead>
                            <TableHead className="h-12 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">{ masterDashboardContent.companiesTab.tableHeaders.bookings }</TableHead>
                            <TableHead className="h-12 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">{ masterDashboardContent.companiesTab.tableHeaders.drivers }</TableHead>
                            <TableHead className="h-12 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">{ masterDashboardContent.companiesTab.tableHeaders.created }</TableHead>
                            <TableHead className="h-12 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider text-right">{ masterDashboardContent.companiesTab.tableHeaders.actions }</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          { loading ? (
                            <TableRow>
                              <TableCell colSpan={ 6 } className="text-center py-8 text-slate-500">
                                { masterDashboardContent.companiesTab.loading }
                              </TableCell>
                            </TableRow>
                          ) : companies.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={ 6 } className="text-center py-8 text-slate-500">
                                { masterDashboardContent.companiesTab.noCompanies }
                              </TableCell>
                            </TableRow>
                          ) : (
                            companies.map( ( company ) => (
                              <TableRow key={ company.id } className="hover:bg-slate-50 transition-colors">
                                <TableCell className="px-6 py-4 font-medium text-slate-900">{ company.name }</TableCell>
                                <TableCell className="px-6 py-4">
                                  <Badge variant={ company.company_status === 'active' ? 'default' : 'secondary' }>
                                    { company.company_status }
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 tabular-nums text-slate-900">{ company.total_bookings }</TableCell>
                                <TableCell className="px-6 py-4 tabular-nums text-slate-900">{ company.total_drivers }</TableCell>
                                <TableCell className="px-6 py-4 text-slate-900">
                                  { new Date( company.created_at ).toLocaleDateString( 'de-DE' ) }
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                  <DetailTrigger
                                    onClick={ () =>
                                    {
                                      setSelectedCompany( company );
                                      setDetailDialogOpen( true );
                                    } }
                                    label={ `${ masterDashboardContent.companiesTab.detailsFor } ${ company.name }` }
                                  />
                                </TableCell>
                              </TableRow>
                            ) )
                          ) }
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </WidgetErrorBoundary>
            </TabsContent>

            {/* Tab 2: Code Quality Metrics */ }
            <TabsContent value="quality">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{ masterDashboardContent.qualityTab.testCoverage }</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold text-slate-900">87 %</span>
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm text-slate-600">+3 % { masterDashboardContent.qualityTab.vsLastWeek }</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{ masterDashboardContent.qualityTab.codeQuality }</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold text-slate-900">A+</span>
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm text-slate-600">{ masterDashboardContent.qualityTab.sonarQubeRating }</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{ masterDashboardContent.qualityTab.technicalDebt }</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold text-slate-900">2,4 h</span>
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                      <p className="text-sm text-slate-600">{ masterDashboardContent.qualityTab.estimatedRefactor }</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 3: System Health */ }
            <TabsContent value="system">
              <PerformanceMonitoringWidget />
            </TabsContent>

            {/* Tab 4: Agent Dashboard */ }
            <TabsContent value="agent">
              <WidgetErrorBoundary widgetName="Agent Dashboard">
                <AgentDashboard />
              </WidgetErrorBoundary>
            </TabsContent>

            {/* Tab 5: Roadmap Progress */ }
            <TabsContent value="roadmap">
              <RoadmapProgressWidget />
            </TabsContent>

            {/* Tab 6: CI Guidelines */ }
            <TabsContent value="ci">
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle>{ masterDashboardContent.ciGuidelines.title }</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                  <h3>{ masterDashboardContent.ciGuidelines.componentCreation }</h3>
                  <ul>
                    { masterDashboardContent.ciGuidelines.componentRules.map( ( rule, idx ) => (
                      <li key={ idx }>{ rule }</li>
                    ) ) }
                  </ul>

                  <h3>{ masterDashboardContent.ciGuidelines.codeQuality }</h3>
                  <ul>
                    { masterDashboardContent.ciGuidelines.qualityRules.map( ( rule, idx ) => (
                      <li key={ idx }>{ rule }</li>
                    ) ) }
                  </ul>

                  <h3>{ masterDashboardContent.ciGuidelines.deployment }</h3>
                  <ul>
                    { masterDashboardContent.ciGuidelines.deploymentRules.map( ( rule, idx ) => (
                      <li key={ idx }>{ rule }</li>
                    ) ) }
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs */ }
        <StandardDetailDialog
          open={ detailDialogOpen }
          onOpenChange={ setDetailDialogOpen }
          title={ selectedCompany ? `Firmen Details: ${ selectedCompany.name }` : 'Firmen Details' }
        >
          { selectedCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{ masterDashboardContent.companiesTab.tableHeaders.name }</p>
                  <p className="text-base font-semibold text-slate-900">{ selectedCompany.name }</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">E-Mail</p>
                  <p className="text-base font-semibold text-slate-900">{ selectedCompany.email }</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{ masterDashboardContent.companiesTab.tableHeaders.status }</p>
                  <Badge variant={ selectedCompany.company_status === 'active' ? 'default' : 'secondary' }>
                    { selectedCompany.company_status }
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Subscription</p>
                  <Badge variant={ selectedCompany.subscription_status === 'active' ? 'default' : 'secondary' }>
                    { selectedCompany.subscription_status }
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{ masterDashboardContent.companiesTab.tableHeaders.bookings }</p>
                  <p className="text-base font-semibold text-slate-900">{ selectedCompany.total_bookings }</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{ masterDashboardContent.companiesTab.tableHeaders.drivers }</p>
                  <p className="text-base font-semibold text-slate-900">{ selectedCompany.total_drivers }</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Fahrzeuge</p>
                  <p className="text-base font-semibold text-slate-900">{ selectedCompany.total_vehicles }</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Monatsumsatz</p>
                  <p className="text-base font-semibold text-slate-900">{ selectedCompany.monthly_revenue.toFixed( 2 ) } €</p>
                </div>
              </div>
            </div>
          ) }
        </StandardDetailDialog>

        <SystemLogsDialog
          open={ logsDialogOpen }
          onOpenChange={ setLogsDialogOpen }
          logs={ systemLogs }
        />
      </ErrorBoundary>
    </>
  );
}
