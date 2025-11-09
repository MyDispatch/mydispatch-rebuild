/* ==================================================================================
   LiveWeather Component - Echtzeit-Wetterdaten
   ==================================================================================
   Zeigt aktuelle Wetterdaten für die Disposition
   ================================================================================== */

import { useState, useEffect } from 'react';
import { handleError } from '@/lib/error-handler';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherApiResponse, validateApiResponse, isValidWeatherResponse } from '@/types/api-schemas';

interface LiveWeatherProps {
  city?: string;
}

export function LiveWeather({ city = 'München' }: LiveWeatherProps) {
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('get-weather', {
          body: { city }
        });

        if (error) throw error;
        
        // ✅ ZENTRALE TYPE-VALIDIERUNG
        const validatedData = validateApiResponse(data, isValidWeatherResponse, 'Weather');
        setWeather(validatedData);
        setError(null);
      } catch (err: any) {
        handleError(err, 'Wetterdaten konnten nicht geladen werden', { showToast: false });
        setError('Wetter konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Alle 5 Minuten

    return () => clearInterval(interval);
  }, [city]);

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('regen') || desc.includes('rain')) return CloudRain;
    if (desc.includes('schnee') || desc.includes('snow')) return CloudSnow;
    if (desc.includes('sonne') || desc.includes('klar') || desc.includes('clear')) return Sun;
    return Cloud;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wetter</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wetter</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{error || 'Keine Daten'}</p>
        </CardContent>
      </Card>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.description);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Wetter in {city}</span>
          <WeatherIcon className="h-5 w-5 text-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{weather.temp}°C</span>
            <span className="text-sm text-muted-foreground capitalize">{weather.description}</span>
          </div>
          
          {(weather.humidity || weather.wind_speed) && (
            <div className="flex items-center gap-4 pt-2 border-t">
              {weather.humidity && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  <span>{weather.humidity}%</span>
                </div>
              )}
              {weather.wind_speed && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Wind className="h-4 w-4" />
                  <span>{weather.wind_speed} km/h</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
