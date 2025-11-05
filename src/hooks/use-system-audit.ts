/* ==================================================================================
   USE-SYSTEM-AUDIT HOOK V18.5.13
   ================================================================================== 
   React Hook für PHASE 0: System-Audit
   ================================================================================== */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface AuditMetrics {
  codeDriftScore: number;
  arcaErrorCount: number;
  dependencyHealth: number;
  ciCompliance: number;
}

interface AuditIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'code-drift' | 'arca-pattern' | 'dependency' | 'ci-compliance';
  message: string;
  autoFixable: boolean;
}

interface AuditResult {
  success: boolean;
  timestamp: string;
  metrics: AuditMetrics;
  issues: AuditIssue[];
  recommendations: string[];
}

export function useSystemAudit() {
  const [loading, setLoading] = useState(false);
  const [lastAudit, setLastAudit] = useState<AuditResult | null>(null);

  const runAudit = async (): Promise<AuditResult | null> => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('system-audit');

      if (error) throw error;

      const auditResult = data as AuditResult;
      setLastAudit(auditResult);

      // Toast basierend auf Schweregrad
      const criticalIssues = auditResult.issues.filter(i => i.severity === 'critical');
      const warningIssues = auditResult.issues.filter(i => i.severity === 'warning');

      if (criticalIssues.length > 0) {
        toast.error(`System-Audit: ${criticalIssues.length} kritische Issues`, {
          description: criticalIssues[0].message,
        });
      } else if (warningIssues.length > 0) {
        toast.warning(`System-Audit: ${warningIssues.length} Warnungen`, {
          description: warningIssues[0].message,
        });
      } else {
        toast.success('System-Audit erfolgreich', {
          description: 'Alle Checks bestanden',
        });
      }

      return auditResult;
    } catch (error: Error | unknown) {
      logger.error('[useSystemAudit] Error', error, { component: 'useSystemAudit' });
      toast.error('System-Audit fehlgeschlagen', {
        description: error.message,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    runAudit,
    loading,
    lastAudit,
  };
}
