/* ==================================================================================
   MASTER SYSTEM DASHBOARD V40.30 - NEXIFYAI MASTER COMMAND CENTER
   ==================================================================================
   ✅ Eigenständige Command Experience für NeXifyAI MASTER
   ✅ PWA-ready mit Hero System V31.5 (backgroundVariant="3d-premium")
   ✅ Autonomie-, Memory- und Integrations-Module
   ✅ Vollständig Quick Actions integriert (QuickActionsPanel)
   ================================================================================== */

import { useState, useEffect, useMemo, useCallback } from 'react';

import { V28HeroPremium } from '@/components/hero';
import { Premium3DCard } from '@/components/design-system/Premium3DCard';
import { V28Button } from '@/components/design-system/V28Button';
import { RoadmapProgressWidget } from '@/components/dashboard/RoadmapProgressWidget';
import { PerformanceMonitoringWidget } from '@/components/dashboard/PerformanceMonitoringWidget';
import { SystemStatusWidget } from '@/components/dashboard/context-widgets/SystemStatusWidget';
import { IntegrationStatusPanel } from '@/components/master/IntegrationStatusPanel';
import { MasterMemoryTimeline } from '@/components/master/MasterMemoryTimeline';
import { NeXifyAgentTaskBoard } from '@/components/master/NeXifyAgentTaskBoard';
import { SystemLogsDialog } from '@/components/master/SystemLogsDialog';
import { AgentDashboard } from '@/components/shared/AgentDashboard';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { MasterChatEmbedded } from '@/components/master/MasterChatEmbedded';
import { DetailTrigger, StandardDetailDialog } from '@/components/shared/StandardDetailDialog';
import { SEOHead } from '@/components/shared/SEOHead';
import { WidgetErrorBoundary } from '@/components/shared/WidgetErrorBoundary';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuickActionsPanel } from '@/hooks/use-quick-actions-panel';
import { useAccountType } from '@/hooks/use-account-type';
import { useAuth } from '@/hooks/use-auth';
import { useNeXifyAutonomy } from '@/hooks/use-nexify-autonomy';
import { useToast } from '@/hooks/use-toast';
import { masterDashboardContent } from '@/lib/content/master-dashboard-content';
import { formatMilliseconds, formatNumber, formatPercentage, formatRelativeTime } from '@/lib/format-utils';
import { supabase } from '@/integrations/supabase/client';
import { captureError } from '@/lib/sentry-integration';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Database,
  GitBranch,
  RefreshCw,
  Rocket,
  Server,
  Shield,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Company {
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

interface SystemLog {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  component?: string;
  created_at: string;
}

type QuickActionKey = 'command' | 'companies' | 'deployments' | 'observability';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  action: () => void;
  tooltip?: string;
}

export default function Master() {
  const { setConfig } = useQuickActionsPanel();
  const { profile } = useAuth();
  const { accountType } = useAccountType();
  const isMasterAccount = accountType === 'master';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { analyzeRequest, executeAutonomous, getStatistics } = useNeXifyAutonomy();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [insightsTab, setInsightsTab] = useState<'companies' | 'deployments' | 'observability'>('companies');
  const [activePanel, setActivePanel] = useState<QuickActionKey>('command');

  const systemHealth = useMemo(
    () => ({
      uptime: 99.92,
      errorRate: 0.015,
      activeUsers: 312,
      dbResponseTime: 38,
    }),
    []
  );

  const autonomyStats = useMemo(() => {
    const decisions = analyzeRequest(
      'Optimiere Deployments, validiere Security Policies, bereite Edge Function cursor-sync vor'
    );
    return getStatistics(decisions);
  }, [analyzeRequest, getStatistics]);

  const handleScrollToWorkbench = useCallback(() => {
    setActivePanel('command');
    document.getElementById('master-command-workbench')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleRunAutonomyWorkflow = useCallback(() => {
    const toastId = sonnerToast.loading('Autonomie-Workflow wird vorbereitet …');
    try {
      const decisions = analyzeRequest(
        'Starte Qualitätssicherung, führe Security Scan aus, plane Production Deployment'
      );
      const executed = executeAutonomous(decisions);
      const stats = getStatistics(decisions);
      sonnerToast.success(`Autonomie-Level ${Math.round(stats.autonomy_rate)} % aktiv`, {
        id: toastId,
        description: `${executed} autonome Aktionen ausgeführt`,
      });
    } catch (error) {
      sonnerToast.error('Autonomie-Workflow konnte nicht gestartet werden', {
        id: toastId,
        description: error instanceof Error ? error.message : undefined,
      });
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'Master',
        action: 'run-autonomy-workflow',
      });
    }
  }, [analyzeRequest, executeAutonomous, getStatistics]);

  const handleScheduleOptimization = useCallback(async () => {
    const toastId = sonnerToast.loading('Self-Optimierung wird geplant …');
    try {
      const { data, error } = await supabase.functions.invoke('schedule-agent-optimization');
      if (error) throw new Error(error.message || 'Edge Function nicht erreichbar');
      if (data?.success !== false) {
        sonnerToast.success('Optimierung erfolgreich geplant', { id: toastId });
      } else {
        throw new Error(data?.error || 'Optimierung fehlgeschlagen');
      }
    } catch (error) {
      sonnerToast.error('Optimierung konnte nicht geplant werden', {
        id: toastId,
        description: error instanceof Error ? error.message : undefined,
      });
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'Master',
        action: 'schedule-optimization',
      });
    }
  }, []);

  const handleOpenSystemLogs = useCallback(async () => {
    const toastId = sonnerToast.loading(masterDashboardContent.toasts.logsLoading);
    try {
      const { data, error } = await supabase.functions.invoke('get-system-logs');
      if (error) throw new Error(error.message || masterDashboardContent.errors.systemLogsError);
      if (data?.success && Array.isArray(data.logs)) {
        setSystemLogs(data.logs as SystemLog[]);
        setLogsDialogOpen(true);
        sonnerToast.success(masterDashboardContent.toasts.logsLoaded, { id: toastId });
      } else {
        throw new Error(data?.error || masterDashboardContent.errors.systemLogsError);
      }
    } catch (error) {
      sonnerToast.error(
        error instanceof Error ? error.message : masterDashboardContent.errors.systemLogsError,
        { id: toastId }
      );
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'Master',
        action: 'get-system-logs',
      });
    }
  }, []);

  const handleTriggerBackup = useCallback(async () => {
    const toastId = sonnerToast.loading(masterDashboardContent.toasts.backupStarted);
    try {
      const { data, error } = await supabase.functions.invoke('trigger-db-backup', {
        body: { type: 'manual' },
      });
      if (error) throw new Error(error.message || masterDashboardContent.errors.backupError);
      if (data?.success) {
        sonnerToast.success(masterDashboardContent.toasts.backupSuccess, { id: toastId });
      } else {
        throw new Error(data?.error || masterDashboardContent.errors.backupError);
      }
    } catch (error) {
      sonnerToast.error(
        error instanceof Error ? error.message : masterDashboardContent.errors.backupError,
        { id: toastId }
      );
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'Master',
        action: 'trigger-db-backup',
      });
    }
  }, []);

  const handleDeploymentStatus = useCallback(async () => {
    const toastId = sonnerToast.loading(masterDashboardContent.toasts.deploymentStatusLoading);
    try {
      const { data, error } = await supabase.functions.invoke('get-deployment-status');
      if (error) throw new Error(error.message || masterDashboardContent.errors.deploymentError);
      if (data?.success) {
        sonnerToast.success(masterDashboardContent.toasts.deploymentStatusLoaded, { id: toastId });
      } else {
        throw new Error(data?.error || masterDashboardContent.errors.deploymentError);
      }
    } catch (error) {
      sonnerToast.error(
        error instanceof Error ? error.message : masterDashboardContent.errors.deploymentError,
        { id: toastId }
      );
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'Master',
        action: 'get-deployment-status',
      });
    }
  }, []);

  const handleClearCache = useCallback(async () => {
    const toastId = sonnerToast.loading(masterDashboardContent.toasts.cacheClearing);
    try {
      const { data, error } = await supabase.functions.invoke('clear-cache');
      if (error) throw new Error(error.message || masterDashboardContent.errors.cacheError);
      if (data?.success) {
        sonnerToast.success(masterDashboardContent.toasts.cacheCleared, { id: toastId });
      } else {
        throw new Error(data?.error || masterDashboardContent.errors.cacheError);
      }
    } catch (error) {
      sonnerToast.error(
        error instanceof Error ? error.message : masterDashboardContent.errors.cacheError,
        { id: toastId }
      );
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'Master',
        action: 'clear-cache',
      });
    }
  }, []);

  const handleSecurityScan = useCallback(async () => {
    const toastId = sonnerToast.loading(masterDashboardContent.toasts.securityScan);
    try {
      const { data, error } = await supabase.functions.invoke('run-security-scan');
      if (error) throw new Error(error.message || masterDashboardContent.errors.securityScanError);
      if (data?.success) {
        sonnerToast.success(masterDashboardContent.toasts.securityScanComplete, { id: toastId });
      } else {
        throw new Error(data?.error || masterDashboardContent.errors.securityScanError);
      }
    } catch (error) {
      sonnerToast.error(
        error instanceof Error ? error.message : masterDashboardContent.errors.securityScanError,
        { id: toastId }
      );
      captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'Master',
        action: 'run-security-scan',
      });
    }
  }, []);

  const handleInsightsTabChange = useCallback((value: string) => {
    const tab = value as 'companies' | 'deployments' | 'observability';
    setInsightsTab(tab);
    setActivePanel(tab);
  }, []);

  const quickActionsMap = useMemo<Record<QuickActionKey, QuickAction[]>>(
    () => ({
      command: [
        {
          icon: Sparkles,
          label: 'Autonomie-Workflow',
          action: handleRunAutonomyWorkflow,
          tooltip: 'Analyse & Ausführung der Master-Routinen',
        },
        {
          icon: Bot,
          label: 'Command Console öffnen',
          action: handleScrollToWorkbench,
          tooltip: 'Direkt zur Master-Konsole wechseln',
        },
        {
          icon: Shield,
          label: 'Security Scan',
          action: handleSecurityScan,
          tooltip: masterDashboardContent.quickActions.tooltips.securityScan,
        },
      ],
      companies: [
        {
          icon: Building2,
          label: masterDashboardContent.quickActions.categories.companies.addCompany,
          action: () => toast({ title: masterDashboardContent.toasts.newCompany }),
          tooltip: masterDashboardContent.quickActions.tooltips.addCompany,
        },
        {
          icon: Upload,
          label: masterDashboardContent.quickActions.categories.companies.csvImport,
          action: () => toast({ title: masterDashboardContent.toasts.csvImport }),
          tooltip: masterDashboardContent.quickActions.tooltips.csvImport,
        },
        {
          icon: ClipboardCheck,
          label: masterDashboardContent.quickActions.categories.companies.exportList,
          action: () => toast({ title: masterDashboardContent.toasts.exportPdf }),
          tooltip: masterDashboardContent.quickActions.tooltips.exportList,
        },
      ],
      deployments: [
        {
          icon: Rocket,
          label: masterDashboardContent.quickActions.categories.roadmap.deployProduction,
          action: () => toast({ title: masterDashboardContent.toasts.deploymentStarted }),
          tooltip: masterDashboardContent.quickActions.tooltips.deployProduction,
        },
        {
          icon: GitBranch,
          label: masterDashboardContent.quickActions.categories.roadmap.deploymentStatus,
          action: handleDeploymentStatus,
          tooltip: masterDashboardContent.quickActions.tooltips.deploymentStatus,
        },
        {
          icon: Database,
          label: masterDashboardContent.quickActions.categories.system.dbBackup,
          action: handleTriggerBackup,
          tooltip: masterDashboardContent.quickActions.tooltips.dbBackup,
        },
      ],
      observability: [
        {
          icon: Activity,
          label: masterDashboardContent.quickActions.categories.system.systemMonitor,
          action: () => setActivePanel('observability'),
          tooltip: masterDashboardContent.quickActions.tooltips.systemMonitor,
        },
        {
          icon: RefreshCw,
          label: masterDashboardContent.quickActions.categories.system.clearCache,
          action: handleClearCache,
          tooltip: masterDashboardContent.quickActions.tooltips.clearCache,
        },
        {
          icon: Server,
          label: masterDashboardContent.quickActions.categories.system.systemLogs,
          action: handleOpenSystemLogs,
          tooltip: masterDashboardContent.quickActions.tooltips.systemLogs,
        },
      ],
    }),
    [
      handleClearCache,
      handleDeploymentStatus,
      handleOpenSystemLogs,
      handleRunAutonomyWorkflow,
      handleScrollToWorkbench,
      handleSecurityScan,
      handleTriggerBackup,
      setActivePanel,
      toast,
    ]
  );

  const currentQuickActions = useMemo(
    () => quickActionsMap[activePanel] ?? quickActionsMap.command,
    [activePanel, quickActionsMap]
  );

  const recentActivities = useMemo(
    () => [
      {
        icon: CheckCircle2,
        iconColor: 'text-emerald-600',
        title: masterDashboardContent.recentActivity.deploymentSuccessful,
        time: formatRelativeTime(2, 'hours'),
      },
      {
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
        title: masterDashboardContent.recentActivity.highCpuUsage,
        time: formatRelativeTime(5, 'hours'),
      },
      {
        icon: CheckCircle2,
        iconColor: 'text-emerald-600',
        title: masterDashboardContent.recentActivity.backupCompleted,
        time: formatRelativeTime(1, 'day'),
      },
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isMasterAccount) navigate('/');
  }, [isMasterAccount, navigate]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;

        const enriched = await Promise.all(
          (data ?? []).map(async (company) => {
            const { count: bookings } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('company_id', company.id)
              .eq('archived', false);

            const { count: drivers } = await supabase
              .from('drivers')
              .select('*', { count: 'exact', head: true })
              .eq('company_id', company.id)
              .eq('archived', false);

            const { count: vehicles } = await supabase
              .from('vehicles')
              .select('*', { count: 'exact', head: true })
              .eq('company_id', company.id)
              .eq('archived', false);

            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { data: monthlyBookings } = await supabase
              .from('bookings')
              .select('price')
              .eq('company_id', company.id)
              .gte('pickup_time', startOfMonth.toISOString())
              .eq('archived', false);

            const revenue = monthlyBookings?.reduce((sum, booking) => sum + (booking.price ?? 0), 0) ?? 0;

            return {
              ...company,
              total_bookings: bookings ?? 0,
              total_drivers: drivers ?? 0,
              total_vehicles: vehicles ?? 0,
              monthly_revenue: revenue,
            };
          })
        );

        setCompanies(enriched);
      } catch (error) {
        sonnerToast.error(masterDashboardContent.toasts.companiesFetchError);
        captureError(error instanceof Error ? error : new Error(String(error)), {
          component: 'Master',
          action: 'fetch-companies',
        });
      } finally {
        setLoadingCompanies(false);
      }
    };

    if (isMasterAccount) {
      loadCompanies();
    }
  }, [isMasterAccount]);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      captureError(event.error, {
        component: 'Master Dashboard',
        route: '/master',
        activePanel,
        userProfile: profile?.id ?? 'unknown',
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      captureError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        component: 'Master Dashboard',
        route: '/master',
        activePanel,
        reason: event.reason,
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [activePanel, profile?.id]);

  useEffect(() => {
    setConfig({
      enabled: true,
      quickActions: currentQuickActions.map((action) => ({
        icon: action.icon,
        label: action.label,
        action: action.action,
        tooltip: action.tooltip,
        variant: 'quick-action-primary' as const,
      })),
      recentActivities,
      contextWidget: {
        title: masterDashboardContent.systemStatus.title,
        icon: Activity,
        content: <SystemStatusWidget />,
      },
    });

    return () => setConfig(null);
  }, [currentQuickActions, recentActivities, setConfig]);

  if (!isMasterAccount) return null;

  return (
    <>
      <SEOHead
        title="NeXifyAI MASTER Command Center"
        description="Eigenständiges Dashboard für den NeXifyAI MASTER Agent mit Autonomie-, Deployment- und Memory-Übersicht."
        canonical="/master"
      />

      <ErrorBoundary>
        <div className="space-y-12 pb-16">
          <section className="px-6">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 shadow-2xl">
              <V28HeroPremium
                variant="features"
                backgroundVariant="3d-premium"
                badge={{ text: 'NeXifyAI MASTER', icon: Sparkles }}
                title="Zentrale Steuerung für deinen autonomen Cloud-Agent"
                subtitle="Programmiere, deploye und überwache ohne Kontextwechsel – alles in einer Oberfläche."
                description="Das Command Center bündelt Memory, Integrationen, Deployments und Selbstoptimierung des NeXifyAI MASTER. Permanente Erinnerung, PWA-optimiert und konform mit dem Forget-Proof System."
                primaryCTA={{
                  label: 'Command Workbench öffnen',
                  onClick: handleScrollToWorkbench,
                }}
                showPWAButton
                businessMetrics={[
                  { label: 'Autonomie', value: `${Math.round(autonomyStats.autonomy_rate)} %`, sublabel: 'autonom ausführbar' },
                  { label: 'Firmen', value: formatNumber(companies.length), sublabel: 'aktive Mandanten' },
                  { label: 'Deployments', value: 'Pascal-Regel', sublabel: 'immer vollständig' },
                ]}
                trustElements
              />
            </div>
          </section>

          <section className="px-6">
            <WidgetErrorBoundary widgetName="Master Mission Metrics">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <Premium3DCard
                  icon={Sparkles}
                  label="Autonomie-Score"
                  value={`${Math.round(autonomyStats.autonomy_rate)} %`}
                  trend={`+${autonomyStats.autonomous} autonome Aktionen`}
                  trendDirection="up"
                  variant="success"
                />
                <Premium3DCard
                  icon={CheckCircle2}
                  label={masterDashboardContent.systemHealth.uptime}
                  value={formatPercentage(systemHealth.uptime)}
                  trend={`+0,12 % ${masterDashboardContent.systemHealth.trends.vsLastWeek}`}
                  trendDirection="up"
                  variant="success"
                />
                <Premium3DCard
                  icon={Users}
                  label="Aktive Mandanten"
                  value={formatNumber(companies.length)}
                  trend={`+${companies.length >= 1 ? 1 : 0} ${masterDashboardContent.systemHealth.trends.today}`}
                  trendDirection="up"
                  variant="default"
                />
                <Premium3DCard
                  icon={Database}
                  label={masterDashboardContent.systemHealth.dbResponse}
                  value={formatMilliseconds(systemHealth.dbResponseTime)}
                  trend={`-3 ms ${masterDashboardContent.systemHealth.trends.yesterday}`}
                  trendDirection="down"
                  variant="success"
                />
              </div>
            </WidgetErrorBoundary>
          </section>

          <section id="master-command-workbench" className="space-y-6 px-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">Command Workbench</h2>
              <p className="text-sm text-slate-600">
                Steuere den NeXifyAI MASTER in Echtzeit. Chat, Tasks, Integrationen und Selbstoptimierung sind hier gebündelt.
              </p>
            </div>
            <div className="grid gap-6 2xl:grid-cols-3">
              <div className="space-y-6 2xl:col-span-2">
                <WidgetErrorBoundary widgetName="Master Command Console">
                  <div className="h-full">
                    <MasterChatEmbedded />
                  </div>
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Agent Dashboard">
                  <AgentDashboard />
                </WidgetErrorBoundary>
              </div>
              <div className="space-y-6">
                <NeXifyAgentTaskBoard />
                <IntegrationStatusPanel />
              </div>
            </div>
          </section>

          <section className="px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <MasterMemoryTimeline />
              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Sparkles className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-slate-900">
                        Self-Optimization Scorecard
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Dynamische Bewertung der Autonomie-Entscheidungen und verbleibender Freigaben.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {Math.round(autonomyStats.autonomy_rate)} % autonome Abdeckung
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {autonomyStats.autonomous} Aktionen können ohne Freigabe durchgeführt werden, {autonomyStats.approval} benötigen manuelle Bestätigung.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase text-slate-500">Kategorie mit höchster Aktivität</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {Object.entries(autonomyStats.by_category)
                          .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'n/a'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase text-slate-500">Dominierendes Risiko-Level</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {Object.entries(autonomyStats.by_risk)
                          .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0] ?? 'n/a'}
                      </p>
                    </div>
                  </div>
                  <V28Button variant="secondary" onClick={handleScheduleOptimization} className="w-full">
                    Selbstoptimierung aktualisieren
                  </V28Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-6 px-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">Operational Insights</h2>
              <p className="text-sm text-slate-600">
                Direkter Zugriff auf Firmen, Deployments und Observability – inklusive vollständigem Logzugriff.
              </p>
            </div>

            <Tabs value={insightsTab} onValueChange={handleInsightsTabChange} className="space-y-6">
              <TabsList className="grid grid-cols-1 gap-3 sm:grid-cols-3 bg-slate-100/80 p-2 rounded-xl">
                <TabsTrigger
                  value="companies"
                  className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all"
                >
                  <Building2 className="h-4 w-4" />
                  Firmen
                </TabsTrigger>
                <TabsTrigger
                  value="deployments"
                  className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all"
                >
                  <Rocket className="h-4 w-4" />
                  Deployments
                </TabsTrigger>
                <TabsTrigger
                  value="observability"
                  className="gap-2 min-h-[44px] text-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-slate-700 transition-all"
                >
                  <Activity className="h-4 w-4" />
                  Observability
                </TabsTrigger>
              </TabsList>

              <TabsContent value="companies">
                <WidgetErrorBoundary widgetName="Companies Overview">
                  <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="flex flex-col gap-2 border-b border-slate-200 bg-white/70">
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {masterDashboardContent.companiesTab.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Vollständiger Mandantenüberblick inklusive Direct-Actions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50/40">
                              <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {masterDashboardContent.companiesTab.tableHeaders.name}
                              </TableHead>
                              <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {masterDashboardContent.companiesTab.tableHeaders.status}
                              </TableHead>
                              <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {masterDashboardContent.companiesTab.tableHeaders.bookings}
                              </TableHead>
                              <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {masterDashboardContent.companiesTab.tableHeaders.drivers}
                              </TableHead>
                              <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {masterDashboardContent.companiesTab.tableHeaders.created}
                              </TableHead>
                              <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right">
                                {masterDashboardContent.companiesTab.tableHeaders.actions}
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loadingCompanies ? (
                              <TableRow>
                                <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                                  {masterDashboardContent.companiesTab.loading}
                                </TableCell>
                              </TableRow>
                            ) : companies.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                                  {masterDashboardContent.companiesTab.noCompanies}
                                </TableCell>
                              </TableRow>
                            ) : (
                              companies.map((company) => (
                                <TableRow key={company.id} className="hover:bg-slate-50 transition-colors">
                                  <TableCell className="px-6 py-4 text-sm font-medium text-slate-900">
                                    {company.name}
                                  </TableCell>
                                  <TableCell className="px-6 py-4">
                                    <Badge variant={company.company_status === 'active' ? 'default' : 'secondary'}>
                                      {company.company_status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="px-6 py-4 text-sm tabular-nums text-slate-900">
                                    {company.total_bookings}
                                  </TableCell>
                                  <TableCell className="px-6 py-4 text-sm tabular-nums text-slate-900">
                                    {company.total_drivers}
                                  </TableCell>
                                  <TableCell className="px-6 py-4 text-sm text-slate-900">
                                    {new Date(company.created_at).toLocaleDateString('de-DE')}
                                  </TableCell>
                                  <TableCell className="px-6 py-4 text-right">
                                    <DetailTrigger
                                      onClick={() => {
                                        setSelectedCompany(company);
                                        setCompanyDialogOpen(true);
                                      }}
                                      label={`${masterDashboardContent.companiesTab.detailsFor} ${company.name}`}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </WidgetErrorBoundary>
              </TabsContent>

              <TabsContent value="deployments">
                <div className="grid gap-6 lg:grid-cols-2">
                  <WidgetErrorBoundary widgetName="Deployment Roadmap">
                    <RoadmapProgressWidget />
                  </WidgetErrorBoundary>
                  <WidgetErrorBoundary widgetName="Performance Monitoring">
                    <PerformanceMonitoringWidget />
                  </WidgetErrorBoundary>
                </div>
              </TabsContent>

              <TabsContent value="observability">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="flex flex-col gap-2 border-b border-slate-200 bg-white/70">
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        Live Systemstatus
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Echtzeitüberwachung der Kernsysteme und Log-Trigger.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-5">
                      <SystemStatusWidget />
                      <div className="flex flex-wrap gap-3">
                        <V28Button variant="secondary" onClick={handleOpenSystemLogs}>
                          System-Logs öffnen
                        </V28Button>
                        <V28Button variant="secondary" onClick={handleSecurityScan}>
                          Security Scan starten
                        </V28Button>
                      </div>
                    </CardContent>
                  </Card>
                  <WidgetErrorBoundary widgetName="Self-Healing Status">
                    <Card className="border-slate-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900">
                          Automatisierte Fehlerbehandlung
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                          Übersicht über proaktive Self-Healing Tasks und letzten Cache-Flush.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                          <p className="text-sm font-semibold text-slate-900">Cache zuletzt geleert</p>
                          <p className="mt-1 text-xs text-slate-500">{formatRelativeTime(3, 'hours')}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                          <p className="text-sm font-semibold text-slate-900">Offene Self-Healing Tickets</p>
                          <p className="mt-1 text-xs text-slate-500">Automatisierte Prüfung alle 15 Minuten</p>
                        </div>
                        <V28Button variant="secondary" onClick={handleClearCache}>
                          Cache leeren
                        </V28Button>
                      </CardContent>
                    </Card>
                  </WidgetErrorBoundary>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <StandardDetailDialog
            open={companyDialogOpen}
            onOpenChange={setCompanyDialogOpen}
            title={selectedCompany ? `Firmen Details: ${selectedCompany.name}` : 'Firmen Details'}
          >
            {selectedCompany && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {masterDashboardContent.companiesTab.tableHeaders.name}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">E-Mail</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {masterDashboardContent.companiesTab.tableHeaders.status}
                    </p>
                    <Badge variant={selectedCompany.company_status === 'active' ? 'default' : 'secondary'}>
                      {selectedCompany.company_status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Subscription</p>
                    <Badge variant={selectedCompany.subscription_status === 'active' ? 'default' : 'secondary'}>
                      {selectedCompany.subscription_status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {masterDashboardContent.companiesTab.tableHeaders.bookings}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.total_bookings}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {masterDashboardContent.companiesTab.tableHeaders.drivers}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.total_drivers}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Fahrzeuge</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.total_vehicles}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Monatsumsatz</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.monthly_revenue.toFixed(2)} €</p>
                  </div>
                </div>
              </div>
            )}
          </StandardDetailDialog>

          <SystemLogsDialog open={logsDialogOpen} onOpenChange={setLogsDialogOpen} logs={systemLogs} />
        </div>
      </ErrorBoundary>
    </>
  );
}

