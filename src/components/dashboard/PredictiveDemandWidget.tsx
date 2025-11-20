/**
 * Predictive Demand Widget
 * V18.3 - Sprint 39: Predictive Analytics
 *
 * AI-basierte Nachfrage-Prognosen mit:
 * - Stündliche Vorhersagen (nächste 8 Stunden)
 * - Confidence-Levels
 * - Actionable Recommendations
 * - Interactive Chart
 *
 * Business/Enterprise Feature
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { V28Button } from "@/components/design-system/V28Button";
import { TrendingUp, AlertCircle, Info, Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/use-auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { startOfDay, subDays, format, addHours } from "date-fns";

interface DemandPrediction {
  time: string;
  expected_bookings: number;
  confidence: number;
}

interface Recommendation {
  type: "info" | "warning" | "error";
  message: string;
  action: string;
}

interface DemandForecastData {
  predictions: DemandPrediction[];
  recommendations: Recommendation[];
  analysis: {
    peak_hour: string;
    peak_demand: number;
    total_expected: number;
    confidence_avg: number;
  };
}

export function PredictiveDemandWidget() {
  const { profile } = useAuth();
  const [forecastData, setForecastData] = useState<DemandForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForecast();
  }, [profile?.company_id]);

  const loadForecast = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.company_id) {
        throw new Error("Keine Company-ID verfügbar");
      }

      // ECHTE DATEN: Historische Buchungen der letzten 30 Tage analysieren
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

      const { data: historicalBookings, error: dbError } = await supabase
        .from("bookings")
        .select("created_at, pickup_time")
        .eq("company_id", profile.company_id)
        .eq("archived", false)
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (dbError) throw dbError;

      // Analyse: Buchungen pro Stunde
      const hourlyStats: { [hour: number]: number } = {};
      (historicalBookings || []).forEach((booking) => {
        const hour = new Date(booking.pickup_time || booking.created_at).getHours();
        hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
      });

      // Berechne Durchschnitt pro Stunde
      const avgPerHour: { [hour: number]: number } = {};
      Object.keys(hourlyStats).forEach((hourStr) => {
        const hour = parseInt(hourStr);
        avgPerHour[hour] = Math.round(hourlyStats[hour] / 30); // 30 Tage
      });

      // Generiere Prognose für nächste 8 Stunden basierend auf ECHTEN Daten
      const currentHour = new Date().getHours();
      const predictions: DemandPrediction[] = [];
      let totalExpected = 0;
      let maxDemand = 0;
      let peakHour = "";

      for (let i = 0; i < 8; i++) {
        const hour = (currentHour + i) % 24;
        // NUR ECHTE DATEN: Durchschnitt der letzten 30 Tage für diese Stunde
        const expectedBookings = avgPerHour[hour] || 0; // Kein Fallback auf Random!
        const confidence = avgPerHour[hour] ? 85 : 50; // Niedrigere Konfidenz wenn keine Daten

        predictions.push({
          time: `${hour}:00`,
          expected_bookings: expectedBookings,
          confidence: confidence,
        });

        totalExpected += expectedBookings;

        if (expectedBookings > maxDemand) {
          maxDemand = expectedBookings;
          peakHour = `${hour}:00`;
        }
      }

      // Falls keine Peak-Stunde (alles 0), setze aktuelle Stunde
      if (!peakHour) {
        peakHour = `${currentHour}:00`;
      }

      // Empfehlungen basierend auf ECHTEN Peak-Demand
      const recommendations: Recommendation[] = [];

      if (maxDemand > 5) {
        recommendations.push({
          type: "warning",
          message: `${peakHour}: Erhöhte Nachfrage erwartet (${maxDemand} Aufträge)`,
          action: "Zusätzliche Fahrer einplanen",
        });
      } else if (totalExpected === 0) {
        recommendations.push({
          type: "info",
          message: "Keine historischen Buchungsdaten für diese Zeitfenster",
          action: "Prognose basiert auf 30-Tage-Durchschnitt",
        });
      } else if (totalExpected < 5) {
        recommendations.push({
          type: "info",
          message: "Niedrige Nachfrage in den nächsten Stunden",
          action: "Wartungsarbeiten oder Schulungen planen",
        });
      }

      const avgConfidence = Math.round(
        predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
      );

      setForecastData({
        predictions,
        recommendations,
        analysis: {
          peak_hour: peakHour,
          peak_demand: maxDemand,
          total_expected: totalExpected,
          confidence_avg: avgConfidence,
        },
      });
    } catch (err) {
      logger.error("[PredictiveDemandWidget] Error loading demand forecast", err as Error, {
        component: "PredictiveDemandWidget",
        action: "loadForecast",
      });
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Prognose");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-status-success";
    if (confidence >= 70) return "text-status-warning";
    return "text-muted-foreground";
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertCircle;
      case "error":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getRecommendationVariant = (type: string): "default" | "destructive" => {
    return type === "error" ? "destructive" : "default";
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-foreground" />
            Nachfrage-Prognose
            <Badge variant="outline" className="ml-auto">
              AI
            </Badge>
          </CardTitle>
          <CardDescription>KI-basierte Vorhersage</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !forecastData) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-foreground" />
            Nachfrage-Prognose
            <Badge variant="outline" className="ml-auto">
              AI
            </Badge>
          </CardTitle>
          <CardDescription>KI-basierte Vorhersage</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Fehler beim Laden der Prognose"}</AlertDescription>
          </Alert>
          <V28Button variant="secondary" size="sm" onClick={loadForecast} className="mt-4 w-full">
            Erneut versuchen
          </V28Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-foreground" />
            <CardTitle>Nachfrage-Prognose</CardTitle>
            <Badge variant="outline" className="ml-2">
              AI
            </Badge>
          </div>
          <V28Button
            variant="secondary"
            size="sm"
            onClick={loadForecast}
            className="h-8 w-8 hover:text-foreground"
          >
            <TrendingUp className="h-4 w-4 text-foreground" />
          </V28Button>
        </div>
        <CardDescription>
          Nächste 8 Stunden • Ø {forecastData.analysis.confidence_avg}% Konfidenz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Analysis Summary */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-background/50">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Peak</div>
            <div className="font-semibold text-foreground flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              {forecastData.analysis.peak_hour}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Nachfrage</div>
            <div className="font-semibold text-foreground">
              {forecastData.analysis.peak_demand} Aufträge
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Gesamt</div>
            <div className="font-semibold text-foreground">
              {forecastData.analysis.total_expected}
            </div>
          </div>
        </div>

        {/* Prediction Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData.predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                wrapperClassName="recharts-tooltip--dashboard"
                formatter={(value: number, name: string) => {
                  if (name === "expected_bookings") return [value, "Aufträge"];
                  if (name === "confidence") return [`${value}%`, "Konfidenz"];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="expected_bookings"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        {forecastData.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground mb-2">Empfehlungen</div>
            {forecastData.recommendations.map((rec, idx) => {
              const Icon = getRecommendationIcon(rec.type);
              return (
                <Alert key={idx} variant={getRecommendationVariant(rec.type)} className="py-2">
                  <Icon className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <div className="font-medium">{rec.message}</div>
                    <div className="text-muted-foreground mt-1">→ {rec.action}</div>
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        )}

        {/* Confidence Indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Basierend auf 30-Tage-Analyse</span>
          <span className={getConfidenceColor(forecastData.analysis.confidence_avg)}>
            {forecastData.analysis.confidence_avg}% Konfidenz
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
