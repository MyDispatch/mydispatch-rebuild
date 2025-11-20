/* ==================================================================================
   LIVE-DATA INTEGRATION - Weather Widget Component V18.3
   ==================================================================================
   Zeigt erweiterte Wetterdaten mit mehr professionellen Metriken
   ================================================================================== */

import { useEffect, useState } from "react";
import { handleError } from "@/lib/error-handler";
import { formatDistance } from "@/lib";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Droplets,
  Gauge,
  Eye,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/lib/compat";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCompanyLocation } from "@/hooks/use-company-location";
import { apiHealthMonitor } from "@/lib/api-health-monitor";
import { toast } from "@/hooks/use-toast";
import { V28Button } from "@/components/design-system/V28Button";
import { useNavigate } from "react-router-dom";
import { isValidWeatherResponse, validateApiResponse } from "@/types/api-schemas";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity?: number;
  wind_speed?: number;
  windSpeed?: number; // Backward compatibility
  pressure?: number;
  visibility?: number;
}

export function WeatherWidget() {
  const navigate = useNavigate();
  const { location, hasCoordinates } = useCompanyLocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!hasCoordinates || !location) {
      setLoading(false);
      return;
    }

    const cacheKey = `weather_v2_${location.city}`; // v2 = invalidate old cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        if (age < 30 * 60 * 1000) {
          setWeather(data);
          setLoading(false);
          setError(false);
          return;
        }
      } catch {
        // Cache invalid
      }
    }

    const fetchWeather = async () => {
      try {
        if (apiHealthMonitor.isRateLimited("get-weather")) {
          const retryAfter = apiHealthMonitor.getRetryAfter("get-weather");
          toast({
            title: "Wetterdaten limitiert",
            description: `Nächster Versuch in ${retryAfter}s möglich.`,
            duration: 5000,
          });
          setError(true);
          setLoading(false);
          return;
        }

        const city = location?.city?.trim() || "München";

        const { data, error } = await supabase.functions.invoke("get-weather", {
          body: { city: String(city) },
        });

        if (error) {
          if (error.message?.includes("429")) {
            apiHealthMonitor.setRateLimit("get-weather", 60);
            toast({
              title: "Zu viele Anfragen",
              description: "Automatischer Retry in 60s.",
              variant: "destructive",
              duration: 10000,
            });
            setError(true);
            setWeather(null);
            return;
          }
          throw error;
        }

        if (data) {
          // Validate response format
          const validatedData = validateApiResponse(data, isValidWeatherResponse, "Weather");
          setWeather(validatedData);
          setError(false);

          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: validatedData,
              timestamp: Date.now(),
            })
          );
        }
      } catch (err) {
        setError(true);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [hasCoordinates, location]);

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-6 w-6 text-muted-foreground" />;

    const desc = weather.description.toLowerCase();
    if (desc.includes("regen") || desc.includes("rain")) {
      return <CloudRain className="h-6 w-6 text-foreground" />;
    }
    if (desc.includes("schnee") || desc.includes("snow")) {
      return <CloudSnow className="h-6 w-6 text-muted-foreground" />;
    }
    if (desc.includes("wolke") || desc.includes("cloud")) {
      return <Cloud className="h-6 w-6 text-muted-foreground" />;
    }
    return <Sun className="h-6 w-6 text-foreground" />;
  };

  const shouldShowWarning = () => {
    if (!weather) return false;
    const desc = weather.description.toLowerCase();
    return (
      weather.temp < 0 ||
      desc.includes("schnee") ||
      desc.includes("snow") ||
      desc.includes("gewitter") ||
      desc.includes("thunder")
    );
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-2 bg-card/98 backdrop-blur-md flex flex-col h-full">
        <CardHeader className="pb-2 pt-3.5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Cloud className="h-4 w-4 text-foreground" />
              {location?.city || "Wetter"}
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-[9px] px-1.5 py-0.5 bg-status-success/10 text-status-success border-status-success/20"
            >
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center pb-4">
          <div className="animate-pulse text-muted-foreground text-xs">Lädt Wetterdaten...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-2 bg-card/98 backdrop-blur-md flex flex-col h-full">
      <CardHeader className="pb-2 pt-3.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Cloud className="h-4 w-4 text-foreground" />
            {location?.city || "Wetter"}
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 py-0.5 bg-status-success/10 text-status-success border-status-success/20"
          >
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3 space-y-2.5">
        {!hasCoordinates ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4 py-6">
            <MapPin className="h-6 w-6 text-muted-foreground" />
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-foreground">GPS-Koordinaten fehlen</p>
              <p className="text-[10px] text-muted-foreground">
                Bitte hinterlegen Sie Ihre Firmenadresse
              </p>
            </div>
            <V28Button
              size="sm"
              variant="secondary"
              className="text-[11px] h-8 px-3"
              onClick={() => navigate("/einstellungen?tab=standort")}
            >
              Jetzt einrichten
            </V28Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-3xl font-bold text-foreground tracking-tight">
                  {weather?.temp}°C
                </p>
                <p className="text-[11px] text-muted-foreground capitalize mt-1">
                  {weather?.description}
                </p>
              </div>
              <div className="text-foreground scale-110">{getWeatherIcon()}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1.5 pb-2">
              <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-card border">
                <Droplets className="h-4 w-4 text-foreground flex-shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground">Luftfeucht.</p>
                  <p className="text-[11px] font-semibold text-foreground">
                    {weather?.humidity || "N/A"}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-card border">
                <Wind className="h-4 w-4 text-foreground flex-shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground">Wind</p>
                  <p className="text-[11px] font-semibold text-foreground">
                    {weather?.wind_speed || weather?.windSpeed
                      ? `${Math.round(weather.wind_speed || weather.windSpeed || 0)} km/h`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-card border">
                <Gauge className="h-4 w-4 text-foreground flex-shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground">Luftdruck</p>
                  <p className="text-[11px] font-semibold text-foreground">
                    {weather?.pressure || "N/A"} hPa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-card border">
                <Eye className="h-4 w-4 text-foreground flex-shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground">Sicht</p>
                  <p className="text-[11px] font-semibold text-foreground">
                    {weather?.visibility ? formatDistance(weather.visibility) : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {shouldShowWarning() && (
              <Alert variant="destructive" className="py-2 mt-2 border-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-[10px] font-medium">
                  Erschwerte Bedingungen
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
