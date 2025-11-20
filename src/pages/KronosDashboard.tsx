/* ==================================================================================
   KRONOS DASHBOARD - KRONOS V18.0
   ==================================================================================
   Real-time monitoring und control für KRONOS Executor System
   ================================================================================== */

import { useEffect, useState } from 'react';
import { useKronos } from '@/hooks/use-kronos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  RefreshCw, 
  FileCode, 
  GitGraph, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

export default function KronosDashboard() {
  const {
    parseWiki,
    generateDependencyGraph,
    executeGeneration,
    loadEntities,
    loadCurrentRun,
    retryEntity,
    isLoading,
    entities,
    stats,
    currentRun,
  } = useKronos();

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadEntities();
    loadCurrentRun();
  }, [loadEntities, loadCurrentRun]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadEntities();
      loadCurrentRun();
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh, loadEntities, loadCurrentRun]);

  const completionPercentage = stats 
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const handleFullExecution = async () => {
    await parseWiki();
    await generateDependencyGraph();
    await executeGeneration();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            KRONOS V18.0
          </h1>
          <p className="text-muted-foreground mt-1">
            Wiki-Execution-Protocol • Parallele Code-Synthese
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <V28Button
            variant="secondary"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-Refresh {autoRefresh ? 'On' : 'Off'}
          </V28Button>
          
          <V28Button
            onClick={handleFullExecution}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Full Execution
          </V28Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.by_level ? Object.keys(stats.by_level).length : 0} Levels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Loader2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats?.in_progress || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pending || 0} Pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats?.failed || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.failed ? Math.round((stats.failed / stats.total) * 100) : 0}% Fehlerrate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Run */}
      {currentRun && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Current Execution Run
            </CardTitle>
            <CardDescription>
              Started: {new Date(currentRun.started_at).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={currentRun.status === 'completed' ? 'default' : 'secondary'}>
                  {currentRun.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm">
                  Level {currentRun.current_level} / {currentRun.total_levels}
                </span>
              </div>
              
              <Progress 
                value={(currentRun.current_level / currentRun.total_levels) * 100} 
              />

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Completed</div>
                  <div className="font-medium">{currentRun.completed_entities}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Failed</div>
                  <div className="font-medium">{currentRun.failed_entities}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total</div>
                  <div className="font-medium">{currentRun.total_entities}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Entities</CardTitle>
          <CardDescription>
            Real-time status aller zu generierenden Entities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({entities.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats?.pending || 0})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({stats?.in_progress || 0})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats?.completed || 0})</TabsTrigger>
              <TabsTrigger value="failed">Failed ({stats?.failed || 0})</TabsTrigger>
            </TabsList>

            {(['all', 'pending', 'in_progress', 'completed', 'failed'] as const).map(status => (
              <TabsContent key={status} value={status}>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {entities
                      .filter(e => status === 'all' || e.status === status)
                      .map(entity => (
                        <div
                          key={entity.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{entity.entity_type}</Badge>
                              <span className="font-medium">{entity.name}</span>
                              <Badge variant="secondary">L{entity.level}</Badge>
                            </div>
                            {entity.file_path && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {entity.file_path}
                              </div>
                            )}
                            {entity.error_message && (
                              <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {entity.error_message}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {entity.status === 'completed' && (
                              <Badge className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {entity.execution_time_ms}ms
                              </Badge>
                            )}
                            {entity.status === 'in_progress' && (
                              <Badge variant="secondary" className="gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Running
                              </Badge>
                            )}
                            {entity.status === 'pending' && (
                              <Badge variant="outline" className="gap-1">
                                <Clock className="h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                            {entity.status === 'failed' && (
                              <>
                                <Badge variant="destructive" className="gap-1">
                                  <XCircle className="h-3 w-3" />
                                  Failed
                                </Badge>
                                <V28Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => retryEntity(entity.id)}
                                >
                                  Retry
                                </V28Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitGraph className="h-5 w-5" />
            Manual Actions
          </CardTitle>
          <CardDescription>
            Execute einzelne Schritte des KRONOS Workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <V28Button
              variant="secondary"
              onClick={() => parseWiki()}
              disabled={isLoading}
              className="gap-2"
            >
              <FileCode className="h-4 w-4" />
              1. Parse Wiki
            </V28Button>

            <V28Button
              variant="secondary"
              onClick={generateDependencyGraph}
              disabled={isLoading}
              className="gap-2"
            >
              <GitGraph className="h-4 w-4" />
              2. Generate Graph
            </V28Button>

            <V28Button
              variant="secondary"
              onClick={() => executeGeneration()}
              disabled={isLoading}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              3. Execute Generation
            </V28Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
