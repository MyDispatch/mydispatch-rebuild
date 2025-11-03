/* ==================================================================================
   RESOURCE STATUS CARD V28.1 - PURE TAILWIND
   ==================================================================================
   Fahrer & Fahrzeug Status - Rechte Spalte Position 3
   ✅ Pure Tailwind Slate Design
   ✅ Progress Bars
   ✅ Status-Kategorien
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ResourceStats {
  drivers: {
    available: number;
    busy: number;
    offline: number;
    total: number;
  };
  vehicles: {
    available: number;
    inUse: number;
    maintenance: number;
    total: number;
  };
}

interface ResourceStatusCardProps {
  stats: ResourceStats;
}

export function ResourceStatusCard({ stats }: ResourceStatusCardProps) {
  const driverUtilization = stats.drivers.total > 0
    ? Math.round(((stats.drivers.busy / stats.drivers.total) * 100))
    : 0;
  
  const vehicleUtilization = stats.vehicles.total > 0
    ? Math.round(((stats.vehicles.inUse / stats.vehicles.total) * 100))
    : 0;

  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100">
            <Users className="h-4 w-4 text-slate-700" />
          </div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Fahrer-Status
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-4">
        {/* Fahrer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Fahrer</span>
            <span className="text-xs font-bold text-slate-900">{driverUtilization}% ausgelastet</span>
          </div>
          <Progress value={driverUtilization} className="h-2" />
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-2 rounded-lg bg-green-50 border border-green-200">
              <p className="text-[10px] font-semibold text-green-600">Verfügbar</p> {/* ✅ Status Exception */}
              <p className="text-lg font-bold text-green-700">{stats.drivers.available}</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-[10px] font-semibold text-yellow-600">Im Einsatz</p> {/* ✅ Status Exception */}
              <p className="text-lg font-bold text-yellow-700">{stats.drivers.busy}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-600">Offline</p>
              <p className="text-lg font-bold text-slate-700">{stats.drivers.offline}</p>
            </div>
          </div>
        </div>

        {/* Fahrzeuge */}
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Fahrzeuge</span>
            <span className="text-xs font-bold text-slate-900">{vehicleUtilization}% ausgelastet</span>
          </div>
          <Progress value={vehicleUtilization} className="h-2" />
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-2 rounded-lg bg-green-50 border border-green-200">
              <p className="text-[10px] font-semibold text-green-600">Verfügbar</p> {/* ✅ Status Exception */}
              <p className="text-lg font-bold text-green-700">{stats.vehicles.available}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-700">Im Einsatz</p>
              <p className="text-lg font-bold text-slate-900">{stats.vehicles.inUse}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50 border border-red-200">
              <p className="text-[10px] font-semibold text-red-600">Wartung</p> {/* ✅ Status Exception */}
              <p className="text-lg font-bold text-red-700">{stats.vehicles.maintenance}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
