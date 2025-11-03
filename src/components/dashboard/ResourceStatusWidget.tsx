/* ==================================================================================
   RESOURCE STATUS WIDGET - V28.1 Slate Design
   ==================================================================================
   ✅ V28.1 Professional Minimalism
   ✅ Pure Tailwind CSS (Slate Palette)
   ✅ Responsive Design
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { Badge } from '@/lib/compat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStatusSystem } from '@/hooks/use-status-system';

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  shift_status: string;
  rides_today?: number;
  current_booking?: string;
}

interface ResourceStatusWidgetProps {
  availableDrivers?: Driver[];
  busyDrivers?: Driver[];
  offlineDrivers?: number;
  availableVehicles?: number;
  totalVehicles?: number;
}

export function ResourceStatusWidget({
  availableDrivers = [],
  busyDrivers = [],
  offlineDrivers = 0,
  availableVehicles = 0,
  totalVehicles = 0,
}: ResourceStatusWidgetProps) {
  const navigate = useNavigate();
  const { configs } = useStatusSystem();
  
  const activeVehicles = totalVehicles - availableVehicles;

  // Status-Configs aus zentralem Ampelsystem
  const availableStatus = configs.driver.available;
  const busyStatus = configs.driver.busy;
  const offlineStatus = configs.driver.offline;

  return (
    <Card className="bg-white rounded-xl border-2 border-slate-200/20 shadow-sm hover:border-slate-200/40 hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2 pt-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Fahrer-Status
          </CardTitle>
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-status-success/10 text-status-success border-status-success/30">
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pb-3 flex-1 overflow-y-auto">
        {/* Driver Overview - Kompakt mit Ampelsystem */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg border bg-card text-center">
            <p className={`text-xl font-bold ${availableStatus.colorClass}`}>
              {availableDrivers.length}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">
              {availableStatus.label}
            </p>
          </div>
          <div className="p-2 rounded-lg border bg-card text-center">
            <p className={`text-xl font-bold ${busyStatus.colorClass}`}>
              {busyDrivers.length}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">
              {busyStatus.label}
            </p>
          </div>
          <div className="p-2 rounded-lg border bg-card text-center">
            <p className={`text-xl font-bold ${offlineStatus.colorClass}`}>
              {offlineDrivers}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">
              {offlineStatus.label}
            </p>
          </div>
        </div>

        {/* Available Drivers */}
        {availableDrivers.length > 0 && (
          <div>
            <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Verfügbare Fahrer
            </h4>
            <div className="space-y-1.5">
              {availableDrivers.slice(0, 3).map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => navigate(`/fahrer?id=${driver.id}`)}
                >
                  <Avatar className="h-7 w-7 border-2 border-primary">
                    <AvatarImage src={driver.profile_image_url || undefined} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-foreground">
                      {driver.first_name?.[0]}{driver.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {driver.rides_today || 0} Fahrten heute
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Busy Drivers */}
        {busyDrivers.length > 0 && (
          <div>
            <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Im Einsatz
            </h4>
            <div className="space-y-1.5">
              {busyDrivers.slice(0, 2).map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => navigate(`/fahrer?id=${driver.id}`)}
                >
                  <Avatar className="h-7 w-7 border-2 border-primary/50">
                    <AvatarImage src={driver.profile_image_url || undefined} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-foreground">
                      {driver.first_name?.[0]}{driver.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <p className="text-[9px] text-muted-foreground truncate">
                      Auftrag läuft
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Utilization */}
          <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Fahrzeug-Auslastung
            </h4>
            <span className="text-xl font-bold text-slate-700">
              {Math.round((activeVehicles / totalVehicles) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${(activeVehicles / totalVehicles) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {activeVehicles} von {totalVehicles} Fahrzeugen im Einsatz
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
