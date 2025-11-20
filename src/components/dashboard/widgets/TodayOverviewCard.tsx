/* ==================================================================================
   TODAY OVERVIEW CARD V28.1 - PURE TAILWIND
   ==================================================================================
   Tagesübersicht - Linke Spalte Position 4
   ✅ Pure Tailwind Slate Design
   ✅ Heute: Aufträge, Fahrer, Fahrzeuge im Einsatz
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { Calendar, FileText, Users, Car } from 'lucide-react';

interface TodayStats {
  bookings: number;
  drivers: number;
  vehicles: number;
}

interface TodayOverviewCardProps {
  stats: TodayStats;
}

export function TodayOverviewCard({ stats }: TodayOverviewCardProps) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100">
            <Calendar className="h-4 w-4 text-slate-700" />
          </div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Tagesübersicht
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700 mb-1">
              {stats.bookings}
            </p>
            <p className="text-[10px] font-semibold text-blue-600">
              Aufträge
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 mb-2">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700 mb-1">
              {stats.drivers}
            </p>
            <p className="text-[10px] font-semibold text-green-600">
              Fahrer aktiv
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 mb-2">
              <Car className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-700 mb-1">
              {stats.vehicles}
            </p>
            <p className="text-[10px] font-semibold text-purple-600">
              Fahrzeuge
            </p>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-600 text-center">
            Stand: {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
