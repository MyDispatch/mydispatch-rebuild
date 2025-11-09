import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Rocket, 
  Mail, 
  Activity,
  TrendingUp,
  Database,
  Shield,
  Smartphone,
  Workflow,
  Clock
} from 'lucide-react';
import { GoLiveOrchestrator, GoLiveOrchestration, ExecutionStep } from '@/lib/go-live-orchestrator';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export default function GoLiveControl() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [orchestration, setOrchestration] = useState<GoLiveOrchestration | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-status-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-status-warning" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-status-error" />;
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStepBgColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-status-success/10 border-status-success/20';
      case 'warning':
        return 'bg-status-warning/10 border-status-warning/20';
      case 'error':
        return 'bg-status-error/10 border-status-error/20';
      case 'running':
        return 'bg-primary/10 border-primary/20';
      default:
        return 'bg-muted border-border';
    }
  };

  const calculateProgress = (steps: ExecutionStep[]) => {
    const totalSteps = steps.length;
    const completedSteps = steps.filter(s => 
      s.status === 'success' || s.status === 'warning' || s.status === 'error'
    ).length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const handleExecuteGoLive = async () => {
    setIsRunning(true);
    setCurrentProgress(0);

    const orchestrator = new GoLiveOrchestrator();
    
    // Poll for updates every 500ms
    const pollInterval = setInterval(() => {
      const currentOrch = orchestrator.getOrchestration();
      setOrchestration({ ...currentOrch });
      setCurrentProgress(calculateProgress(currentOrch.steps));
    }, 500);

    try {
      const result = await orchestrator.execute();
      
      clearInterval(pollInterval);
      setOrchestration(result);
      setCurrentProgress(100);

      if (result.overallStatus === 'success') {
        toast({
          title: "🚀 GO-LIVE COMPLETE!",
          description: "MyDispatch V18.3.24 is now LIVE and operational",
        });
      } else if (result.overallStatus === 'warning') {
        toast({
          title: "⚠️ Launched with Warnings",
          description: "System is live but review warnings closely",
          variant: "default"
        });
      } else {
        toast({
          title: "❌ Go-Live Failed",
          description: "Critical errors occurred during execution",
          variant: "destructive"
        });
      }

    } catch (error: any) {
      clearInterval(pollInterval);
      logger.error('[Go-Live] Execution failed', error, { component: 'GoLiveControl' });
      toast({
        title: "❌ Go-Live Failed",
        description: error.message || "Critical error during execution",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Rocket className="h-8 w-8 text-primary" />
          Phase 3: Go-Live Control
        </h1>
        <p className="text-muted-foreground">
          Autonomous Go-Live Execution for MyDispatch V18.3.24
        </p>
      </div>

      {/* Execute Button */}
      {!orchestration && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <V28Button
              onClick={handleExecuteGoLive}
              disabled={isRunning}
              size="lg"
              className="w-full"
              variant="primary"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Executing Go-Live...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  Execute Full Go-Live
                </>
              )}
            </V28Button>
            {isRunning && (
              <div className="mt-4 space-y-2">
                <Progress value={currentProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {orchestration?.steps.find(s => s.status === 'running')?.name || 'Initializing...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Execution Steps */}
      {orchestration && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Execution Steps
            </CardTitle>
            <CardDescription>
              Autonomous Go-Live Orchestration - {orchestration.overallStatus}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {orchestration.steps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${getStepBgColor(step.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-foreground">{step.name}</h4>
                      {step.duration && (
                        <Badge variant="outline" className="text-xs">
                          {(step.duration / 1000).toFixed(1)}s
                        </Badge>
                      )}
                    </div>
                    {step.message && (
                      <p className="text-sm text-muted-foreground">{step.message}</p>
                    )}
                    {step.details && (
                      <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(step.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {orchestration && orchestration.overallStatus !== 'pending' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Validation Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orchestration.validationScore || 'N/A'}</div>
              <Badge variant={orchestration.approved ? "default" : "secondary"} className="mt-2">
                {orchestration.approved ? 'APPROVED' : 'WITH WARNINGS'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Launch Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orchestration.emailsSent || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Successfully delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orchestration.monitoringActive ? 'Active' : 'Inactive'}
              </div>
              <Badge 
                variant={orchestration.monitoringActive ? "default" : "secondary"} 
                className="mt-2"
              >
                {orchestration.monitoringActive ? '24/7 Monitoring' : 'Not Activated'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monitoring Systems Detail */}
      {orchestration && orchestration.monitoringActive && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              24/7 Monitoring Systems
            </CardTitle>
            <CardDescription>Post-launch monitoring infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Sentry</h4>
                </div>
                <Badge variant="default">Active</Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  Error tracking & alerts
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Workflow className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">n8n</h4>
                </div>
                <Badge variant="default">Active</Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  Workflow monitoring
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Self-Reflection</h4>
                </div>
                <Badge variant="default">Active</Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  Hourly analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Status Alert */}
      {orchestration && orchestration.overallStatus !== 'pending' && orchestration.overallStatus !== 'running' && (
        <Alert 
          variant={
            orchestration.overallStatus === 'success' ? "default" : 
            orchestration.overallStatus === 'warning' ? "default" : 
            "destructive"
          }
        >
          <Rocket className="h-4 w-4" />
          <AlertTitle className="text-lg font-bold">
            {orchestration.overallStatus === 'success' && '🚀 GO-LIVE COMPLETE'}
            {orchestration.overallStatus === 'warning' && '⚠️ LAUNCHED WITH WARNINGS'}
            {orchestration.overallStatus === 'error' && '❌ GO-LIVE FAILED'}
          </AlertTitle>
          <AlertDescription>
            {orchestration.overallStatus === 'success' && 
              'MyDispatch V18.3.24 is now LIVE and fully operational. All systems validated and monitoring active.'}
            {orchestration.overallStatus === 'warning' && 
              'System is live but some checks had warnings. Monitor closely and address issues.'}
            {orchestration.overallStatus === 'error' && 
              'Critical errors occurred during Go-Live. Review execution log and retry.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
