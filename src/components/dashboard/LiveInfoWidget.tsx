/* ==================================================================================
   Live-Info Widget - KOMPAKT VERSION für V18.3
   ==================================================================================
   - Kompakte Darstellung von Wetter & Verkehr
   - Optimiert für Sidebar-Platzierung
   - Business+ Feature
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { useCompanyLocation } from '@/hooks/use-company-location';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Cloud, Navigation, Thermometer } from 'lucide-react';
import { Badge } from '@/lib/compat';

interface WeatherData {
  temp: number;
  description: string;
}

interface TrafficData {
  jam_factor: number;
}

export function LiveInfoWidget() {
  const { location, hasCoordinates } = useCompanyLocation();

  // Weather Data
  const { data: weather } = useQuery({
    queryKey: ['weather', location?.city],
    queryFn: async () => {
      if (!location?.city) return null;
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { city: location.city },
      });
      if (error) throw error;
      return data as WeatherData;
    },
    enabled: hasCoordinates && !!location?.city,
    staleTime: 300000, // 5 Minuten
  });

  // Traffic Data
  const { data: traffic } = useQuery({
    queryKey: ['traffic', location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location?.latitude || !location?.longitude) return null;
      const origin = `${location.latitude},${location.longitude}`;
      const { data, error } = await supabase.functions.invoke('get-traffic', {
        body: { origin },
      });
      if (error) throw error;
      return data as TrafficData;
    },
    enabled: hasCoordinates,
    staleTime: 300000, // 5 Minuten
  });

  const getTrafficStatus = (jamFactor: number) => {
    if (jamFactor < 3) return { label: 'Frei', color: 'text-status-success bg-status-success/10 border-status-success/20' };
    if (jamFactor < 6) return { label: 'Mäßig', color: 'text-status-warning bg-status-warning/10 border-status-warning/20' };
    return { label: 'Stau', color: 'text-status-error bg-status-error/10 border-status-error/20' };
  };

  if (!hasCoordinates) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Standort-Daten erforderlich
          </p>
        </CardContent>
      </Card>
    );
  }

  const trafficStatus = traffic ? getTrafficStatus(traffic.jam_factor) : null;

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2 pt-3 flex-shrink-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Cloud className="h-4 w-4 text-foreground" />
          Live-Daten
          <Badge variant="outline" className="ml-auto text-[10px]">
            Business+
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 flex-1 pb-3 flex flex-col justify-center">
        {/* Wetter */}
        {weather && (
          <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Thermometer className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Wetter</p>
                <p className="text-[10px] text-muted-foreground">{weather.description}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-foreground">{weather.temp}°C</p>
          </div>
        )}

        {/* Verkehr */}
        {trafficStatus && (
          <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Navigation className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Verkehr</p>
                <p className="text-[10px] text-muted-foreground">Aktuell</p>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs ${trafficStatus.color}`}>
              {trafficStatus.label}
            </Badge>
          </div>
        )}

        {/* Standort */}
        {location?.city && (
          <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Cloud className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Standort</p>
                <p className="text-[10px] text-muted-foreground">Firmensitz</p>
              </div>
            </div>
            <p className="text-xs font-medium text-foreground">{location.city}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
