/* ==================================================================================
   AI ERROR PREDICTION - V6.0
   ==================================================================================
   ✅ Uses Lovable AI (google/gemini-2.5-flash)
   ✅ Predicts runtime errors before they occur
   ✅ Generates prevention strategies
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ErrorPrediction {
  error: string;
  severity: number; // 1-10
  likelihood: number; // 0-100%
  impact: string;
  fix: string;
  prevention: string;
}

export interface PreventionStrategy {
  avoidPatterns: string[];
  reviewChecklist: string[];
  requiredTests: string[];
  guidelines: string[];
  monitoring: string[];
}

export class AIErrorPredictor {
  /**
   * Predict errors in code using Lovable AI
   */
  static async predictErrors(
    code: string,
    filename: string,
    context?: {
      type?: string;
      dependencies?: string[];
      framework?: string;
    }
  ): Promise<ErrorPrediction[]> {
    try {
      logger.info('AIErrorPredictor: Analyzing code', { filename, context });

      const { data, error } = await supabase.functions.invoke('ai-error-predictor', {
        body: {
          code,
          filename,
          context: {
            type: context?.type || 'component',
            dependencies: context?.dependencies || [],
            framework: context?.framework || 'react',
          },
        },
      });

      if (error) {
        logger.error('AIErrorPredictor: Prediction failed', error);
        return [];
      }

      logger.info('AIErrorPredictor: Predictions generated', {
        count: data?.predictions?.length || 0,
      });

      return data?.predictions || [];
    } catch (error) {
      logger.error('AIErrorPredictor: Unexpected error', error as Error);
      return [];
    }
  }

  /**
   * Generate prevention strategy based on error patterns
   */
  static async generatePreventionStrategy(
    errors: ErrorPrediction[]
  ): Promise<PreventionStrategy | null> {
    try {
      const criticalErrors = errors.filter((e) => e.severity >= 7);

      if (criticalErrors.length === 0) {
        return null;
      }

      logger.info('AIErrorPredictor: Generating prevention strategy', {
        criticalErrorCount: criticalErrors.length,
      });

      const { data, error } = await supabase.functions.invoke('ai-error-predictor', {
        body: {
          action: 'generate_prevention_strategy',
          errors: criticalErrors,
        },
      });

      if (error) {
        logger.error('AIErrorPredictor: Strategy generation failed', error);
        return null;
      }

      return data?.strategy || null;
    } catch (error) {
      logger.error('AIErrorPredictor: Unexpected error', error as Error);
      return null;
    }
  }

  /**
   * Store prediction result in database for learning
   */
  static async storePrediction(
    filename: string,
    predictions: ErrorPrediction[],
    actualErrors: string[]
  ): Promise<void> {
    try {
      // Calculate accuracy
      const correctPredictions = predictions.filter((pred) =>
        actualErrors.some((err) => err.includes(pred.error))
      );

      const accuracy = predictions.length > 0 
        ? correctPredictions.length / predictions.length 
        : 0;

      // Store in ai_learning_patterns
      await supabase.from('ai_learning_patterns').insert([{
        pattern_type: 'error_prediction',
        learnings: `Error prediction for ${filename}: ${predictions.length} predictions, accuracy ${(accuracy * 100).toFixed(0)}%`,
        success: accuracy > 0.5,
        confidence: accuracy,
        context: {
          filename,
          predictionsCount: predictions.length,
          actualErrorsCount: actualErrors.length,
          accuracy: accuracy,
          timestamp: new Date().toISOString(),
        } as any,
      }]);

      logger.info('AIErrorPredictor: Prediction stored', {
        filename,
        accuracy,
        predictionsCount: predictions.length,
      });
    } catch (error) {
      logger.error('AIErrorPredictor: Failed to store prediction', error as Error);
    }
  }
}
