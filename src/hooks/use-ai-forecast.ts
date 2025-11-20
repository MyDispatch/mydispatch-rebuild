/* ==================================================================================
   USE AI FORECAST HOOK V18.5.0
   ==================================================================================
   React Hook für AI-basierte Demand Forecasting
   
   Features:
   - Lovable AI Integration (Google Gemini)
   - Automatisches Caching (React Query)
   - Error Handling
   - Loading States
   
   Usage:
   const { forecast, isLoading, error, refetch } = useAIForecast(companyId, 7);
   ================================================================================== */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { logger } from "@/lib/logger";
import { datadoc } from "@/lib/datadoc-client";
import { queryKeys } from "@/lib/react-query/query-keys";

interface DemandForecast {
  date: string;
  predictedBookings: number;
  confidence: number;
  trend: "increasing" | "stable" | "decreasing";
}

interface ForecastResponse {
  forecast: DemandForecast[];
  metadata: {
    companyId: string;
    historicalPeriod: number;
    totalBookings: number;
    avgBookingsPerDay: number;
    generatedAt: string;
  };
}

export function useAIForecast(days: number = 7) {
  const { profile } = useAuth();
  const companyId = profile?.company_id;

  return useQuery({
    queryKey: queryKeys.aiForecast(companyId, days),
    queryFn: async (): Promise<ForecastResponse> => {
      if (!companyId) {
        throw new Error("No company_id available");
      }

      const startTime = Date.now();

      try {
        logger.info("[AI Forecast] Requesting forecast", { companyId, days });

        const { data, error } = await supabase.functions.invoke("ai-forecast", {
          body: { companyId, days },
        });

        const duration = Date.now() - startTime;

        if (error) {
          logger.error("[AI Forecast] Edge function error", error, { companyId, days });

          // Track error metric
          await datadoc.trackAPICall("ai-forecast", duration, "error", {
            errorType: error.message || "unknown",
          });

          throw error;
        }

        if (!data || !data.forecast) {
          throw new Error("Invalid response from AI forecast service");
        }

        logger.info("[AI Forecast] Forecast received", {
          companyId,
          forecastLength: data.forecast.length,
          duration,
        });

        // Track success metric
        await datadoc.trackAPICall("ai-forecast", duration, "success", {
          forecastDays: days.toString(),
        });

        return data as ForecastResponse;
      } catch (error) {
        const duration = Date.now() - startTime;

        logger.error("[AI Forecast] Request failed", error as Error, { companyId, days });

        await datadoc.trackAPICall("ai-forecast", duration, "error", {
          errorType: error instanceof Error ? error.message : "unknown",
        });

        throw error;
      }
    },
    enabled: !!companyId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}
