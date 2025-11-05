/**
 * PROMETHEUS MISSION II: Error Logging Hook (P1 Cluster 3)
 * 
 * Replaces direct Supabase calls in GlobalErrorBoundary.tsx
 * with TanStack Query mutations for error tracking.
 * 
 * Migration: Lines 57, 75 in src/components/debug/GlobalErrorBoundary.tsx
 */

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError as handleErrorLib } from '@/lib/error-handler';

interface ErrorLog {
  error_message: string;
  error_stack?: string;
  error_category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
  component?: string;
  url?: string;
}

interface LearningPattern {
  pattern_type: string;
  learnings: string;
  success: boolean;
  confidence: number;
  context?: Record<string, unknown>;
}

interface UseErrorLoggingReturn {
  logError: (log: ErrorLog) => Promise<void>;
  logLearning: (pattern: LearningPattern) => Promise<void>;
  isLogging: boolean;
}

export function useErrorLogging(): UseErrorLoggingReturn {
  const logErrorMutation = useMutation({
    mutationFn: async (log: ErrorLog) => {
      const { data, error } = await supabase
        .from('error_logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      // Silent fail - don't spam user with error logging errors
      console.error('[ErrorLogging] Failed to log error:', error);
    },
  });

  const logLearningMutation = useMutation({
    mutationFn: async (pattern: LearningPattern) => {
      const { data, error } = await supabase
        .from('ai_learning_patterns')
        .insert([pattern])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      // Silent fail
      console.error('[ErrorLogging] Failed to log learning:', error);
    },
  });

  const logError = async (log: ErrorLog): Promise<void> => {
    try {
      await logErrorMutation.mutateAsync(log);
    } catch (error) {
      // Already handled in onError
    }
  };

  const logLearning = async (pattern: LearningPattern): Promise<void> => {
    try {
      await logLearningMutation.mutateAsync(pattern);
    } catch (error) {
      // Already handled in onError
    }
  };

  return {
    logError,
    logLearning,
    isLogging: logErrorMutation.isPending || logLearningMutation.isPending,
  };
}
