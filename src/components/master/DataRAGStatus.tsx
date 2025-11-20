/* ==================================================================================
   DATA-RAG STATUS WIDGET V18.5.13
   ================================================================================== 
   DB-Query-Agent Status & Metrics
   - Whitelist Security Status
   - Query Performance
   - Data-Memory Health
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Shield, Zap, CheckCircle } from 'lucide-react';

export function DataRAGStatus() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-foreground" />
            <span className="text-foreground">Data-RAG Status</span>
          </CardTitle>
          <Badge className="bg-status-success/10 text-status-success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aktiv
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-status-success" />
            <span className="text-sm font-medium text-foreground">Whitelist Security</span>
          </div>
          <Badge className="bg-status-success/10 text-status-success">Aktiv</Badge>
        </div>

        {/* Performance */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Avg. Query Time</span>
          </div>
          <span className="text-sm font-semibold text-foreground">45ms</span>
        </div>

        {/* Allowed Tables */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Erlaubte Tabellen:</p>
          <div className="flex flex-wrap gap-1">
            {['companies', 'pricing_tiers', 'feature_flags', 'system_config', 'subscription_plans'].map(
              (table) => (
                <Badge key={table} variant="outline" className="text-xs">
                  {table}
                </Badge>
              )
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center p-2 bg-muted/20 rounded">
            <p className="text-xl font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground">Tables</p>
          </div>
          <div className="text-center p-2 bg-muted/20 rounded">
            <p className="text-xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}