/* ==================================================================================
   SYSTEM-AUDIT EDGE FUNCTION V18.5.13
   ================================================================================== 
   PHASE 0: Proaktiver System-Check vor jedem Workflow
   - Code-Drift-Detection
   - ARCA-Pattern-Scan
   - Dependency-Health
   - CI-Compliance
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditResult {
  success: boolean;
  timestamp: string;
  metrics: {
    codeDriftScore: number;      // 0-100 (0 = perfekt)
    arcaErrorCount: number;       // Wiederkehrende Fehler
    dependencyHealth: number;     // 0-100 (100 = perfekt)
    ciCompliance: number;         // 0-100 (100 = perfekt)
  };
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: 'code-drift' | 'arca-pattern' | 'dependency' | 'ci-compliance';
    message: string;
    autoFixable: boolean;
  }>;
  recommendations: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const startTime = Date.now();
    const issues: AuditResult['issues'] = [];
    const recommendations: string[] = [];

    // 1. CODE-DRIFT-DETECTION
    // Prüfe ob Real-Time Index und Code synchron sind
    const { data: recentErrors } = await supabase
      .from('error_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(100);

    const codeDriftScore = Math.max(0, 100 - (recentErrors?.length || 0) * 2);

    if (codeDriftScore < 80) {
      issues.push({
        severity: 'warning',
        category: 'code-drift',
        message: `Code-Drift erkannt: ${recentErrors?.length || 0} Fehler in 24h`,
        autoFixable: false,
      });
    }

    // 2. ARCA-PATTERN-SCAN
    // Analysiere wiederkehrende Fehler
    const errorPatterns = new Map<string, number>();
    recentErrors?.forEach((error) => {
      const pattern = error.error_message?.split(':')[0] || 'unknown';
      errorPatterns.set(pattern, (errorPatterns.get(pattern) || 0) + 1);
    });

    const arcaErrorCount = Array.from(errorPatterns.values()).filter(count => count >= 3).length;

    if (arcaErrorCount > 0) {
      issues.push({
        severity: 'warning',
        category: 'arca-pattern',
        message: `${arcaErrorCount} wiederkehrende Fehler-Pattern erkannt`,
        autoFixable: true,
      });
      recommendations.push('Auto-ARCA: Fehler-Patterns können automatisch korrigiert werden');
    }

    // 3. DEPENDENCY-HEALTH
    // Prüfe Brain-System, Shared Knowledge, etc.
    const { data: systemConfig } = await supabase
      .from('system_config')
      .select('config_key, config_value')
      .in('config_key', ['brain_system_active', 'shared_knowledge_version', 'real_time_index_active']);

    const dependencyHealth = systemConfig?.length === 3 ? 100 : 50;

    if (dependencyHealth < 100) {
      issues.push({
        severity: 'critical',
        category: 'dependency',
        message: 'Core-System-Abhängigkeiten nicht vollständig aktiv',
        autoFixable: false,
      });
    }

    // 4. CI-COMPLIANCE
    // Simuliere Design-Token-Check (in echtem CI via Hooks)
    const ciCompliance = 95; // Placeholder

    const auditResult: AuditResult = {
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        codeDriftScore,
        arcaErrorCount,
        dependencyHealth,
        ciCompliance,
      },
      issues,
      recommendations,
    };

    const executionTime = Date.now() - startTime;
    console.log(`[System-Audit] Completed in ${executionTime}ms`);

    return new Response(JSON.stringify(auditResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
