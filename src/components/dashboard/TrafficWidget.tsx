/* ==================================================================================
   TRAFFIC WIDGET - V28.1 Slate Design
   ==================================================================================
   ✅ V28.1 Professional Minimalism
   ✅ Pure Tailwind CSS (Slate Palette)
   ✅ Responsive Design
   ================================================================================== */

import { AlertCircle, AlertTriangle, CheckCircle, Navigation, Gauge, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { Badge } from '@/lib/compat';
import { useCompanyLocation } from '@/hooks/use-company-location';
import { V28Button } from '@/components/design-system/V28Button';
import { useNavigate } from 'react-router-dom';
import { useTraffic } from '@/hooks/use-traffic';

export function TrafficWidget() {
  const navigate = useNavigate();
  const { location, hasCoordinates } = useCompanyLocation();
  
  // ⭐ REACT QUERY HOOK (Ersetzt gesamte useEffect-Logik)
  const origin = hasCoordinates && location 
    ? `${location.latitude?.toFixed(4)},${location.longitude?.toFixed(4)}`
    : '';
  
  const { data: trafficData, isLoading, isError } = useTraffic({ 
    origin, 
    enabled: hasCoordinates && !!location,
    refetchInterval: 30000, // ⭐ 30s (reduziert von 15s)
  });

  const getTrafficStatus = (jamFactor: number) => {
    if (jamFactor < 3) {
      return {
        icon: CheckCircle,
        bg: 'bg-status-success/10',
        border: 'border-status-success/20',
        badge: 'text-status-success border-status-success',
        label: 'Frei',
      };
    }
    if (jamFactor < 7) {
      return {
        icon: AlertTriangle,
        bg: 'bg-status-warning/10',
        border: 'border-status-warning/20',
        badge: 'text-status-warning border-status-warning',
        label: 'Zähflüssig',
      };
    }
    return {
      icon: AlertCircle,
      bg: 'bg-status-error/10',
      border: 'border-status-error/20',
      badge: 'text-status-error border-status-error',
      label: 'Stau',
    };
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl border-2 border-slate-200/20 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2 pt-3.5 p-0 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-700 text-slate-200">
              <Navigation className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-700">
                {location?.city || 'Verkehr'}
              </CardTitle>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-status-success/10 text-status-success border-status-success/20">
                Live
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center pb-4">
          <div className="animate-pulse text-muted-foreground text-xs">
            Lädt Verkehrsdaten...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl border-2 border-slate-200/20 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2 pt-3.5 p-0 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-700 text-slate-200">
            <Navigation className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-700">
              {location?.city || 'Verkehr'}
            </CardTitle>
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-status-success/10 text-status-success border-status-success/20">
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3 space-y-2">
        {!hasCoordinates ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4 py-6">
            <MapPin className="h-6 w-6 text-muted-foreground" />
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-foreground">
                GPS-Koordinaten fehlen
              </p>
              <p className="text-[10px] text-muted-foreground">
                Bitte hinterlegen Sie Ihre Firmenadresse
              </p>
            </div>
            <V28Button
              size="sm"
              variant="secondary"
              className="text-[11px] h-8 px-3"
              onClick={() => navigate('/einstellungen?tab=standort')}
            >
              Jetzt einrichten
            </V28Button>
          </div>
        ) : (
          <>
            {trafficData && (
              <>
                <div
                  className={`flex items-center gap-2 p-2 rounded-lg border-2 ${getTrafficStatus(trafficData.jam_factor).bg} ${getTrafficStatus(trafficData.jam_factor).border} shadow-sm`}
                >
                  {(() => {
                    const status = getTrafficStatus(trafficData.jam_factor);
                    const StatusIcon = status.icon;
                    return (
                      <>
                        <StatusIcon className="h-4 w-4 text-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <p className="font-semibold text-[11px] truncate text-foreground">
                              {location?.city || 'Zentrum'}
                            </p>
                            <Badge variant="outline" className={`${status.badge} text-[9px] px-1.5 py-0.5 font-semibold`}>
                              {status.label}
                            </Badge>
                          </div>
                            <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
                              <Gauge className="h-4 w-4 text-foreground" />
                              <span className="font-medium">{trafficData.speed > 0 ? `${trafficData.speed} km/h` : 'N/A'}</span>
                            </div>
                             <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden mt-2">
                              <div 
                                className="h-full bg-red-600 transition-all duration-300"
                                style={{ width: `${Math.min(trafficData.jam_factor * 10, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="pt-3 mt-2">
                  <div className="flex items-center justify-between p-1.5 bg-card rounded-lg border">
                    <span className="text-[10px] text-muted-foreground font-medium">Auslastung</span>
                    <span className="text-[11px] font-bold text-foreground">
                      {Math.round(trafficData.jam_factor * 10)}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
