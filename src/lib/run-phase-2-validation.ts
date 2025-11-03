/**
 * Phase 2 Validation Runner
 * Invokes automated Integration & E2E Testing for Go-Live
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface ValidationResult {
  phase: string;
  overall_score: string;
  average_confidence: number;
  approved: boolean;
  summary: {
    pass: number;
    warn: number;
    fail: number;
  };
  results: Array<{
    check: string;
    status: 'pass' | 'warn' | 'fail';
    message: string;
    confidence: number;
    details?: any;
  }>;
  recommendation: string;
}

export async function runPhase2Validation(): Promise<ValidationResult> {
  logger.info('[Phase 2] Starting validation...', { 
    component: 'Phase2Validation',
    phase: 'validation'
  });
  
  try {
    const { data, error } = await supabase.functions.invoke('phase-2-validation', {
      body: {}
    });

    if (error) {
      logger.error('[Phase 2] Validation error', error as Error, { 
        component: 'Phase2Validation',
        phase: 'validation'
      });
      throw new Error(`Phase 2 validation failed: ${error.message}`);
    }

    logger.info('[Phase 2] Validation complete', { 
      component: 'Phase2Validation',
      phase: 'validation',
      approved: data.approved,
      score: data.overall_score
    });
    
    // Log to ai_actions_log
    await supabase.from('ai_actions_log').insert({
      action_type: 'phase_2_validation_runner',
      task_description: 'Phase 2 Validation Runner - Manual Trigger',
      metadata: {
        triggered_by: 'manual_run',
        timestamp: new Date().toISOString(),
        output_result: data,
        confidence: data.average_confidence
      },
      success: data.approved
    });

    return data;
  } catch (error) {
    logger.error('[Phase 2] Critical error', error as Error, { 
      component: 'Phase2Validation',
      phase: 'validation',
      critical: true
    });
    throw error;
  }
}

export async function checkGoLiveReadiness(): Promise<{
  ready: boolean;
  score: number;
  blockers: string[];
  warnings: string[];
}> {
  const result = await runPhase2Validation();
  
  const blockers: string[] = [];
  const warnings: string[] = [];
  
  result.results.forEach(r => {
    if (r.status === 'fail') {
      blockers.push(`${r.check}: ${r.message}`);
    } else if (r.status === 'warn') {
      warnings.push(`${r.check}: ${r.message}`);
    }
  });
  
  const scoreValue = parseFloat(result.overall_score);
  const ready = result.approved && blockers.length === 0;
  
  return {
    ready,
    score: scoreValue,
    blockers,
    warnings
  };
}
