/* ==================================================================================
   UTILIZATION HEATMAP - V18.3 Sprint 35
   ==================================================================================
   - Auslastung nach Wochentag und Tageszeit
   - Interaktive Heatmap mit Click-to-Drill-Down
   - Farb-Skala: Grün → Gelb → Rot
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useBookings } from '@/hooks/use-bookings';
import { useMemo } from 'react';
import { format, getDay, getHours, parseISO, startOfWeek, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface HeatmapCell {
  day: number; // 0-6 (Mo-So)
  hour: number; // 0-23
  count: number;
  percentage: number; // 0-100
}

interface UtilizationHeatmapProps {
  onClick?: (day: number, hour: number) => void;
  className?: string;
}

export function UtilizationHeatmap({ onClick, className }: UtilizationHeatmapProps) {
  const { bookings } = useBookings();

  // Berechne Heatmap-Daten
  const heatmapData = useMemo(() => {
    const matrix: HeatmapCell[][] = [];
    const countMatrix: number[][] = [];
    
    // Initialisiere 7x24 Matrix (Wochentage x Stunden)
    for (let day = 0; day < 7; day++) {
      countMatrix[day] = [];
      for (let hour = 0; hour < 24; hour++) {
        countMatrix[day][hour] = 0;
      }
    }

    // Zähle Buchungen pro Wochentag/Stunde
    bookings
      .filter(b => b.pickup_time && !b.archived && b.status !== 'cancelled')
      .forEach(booking => {
        try {
          const date = parseISO(booking.pickup_time);
          const day = (getDay(date) + 6) % 7; // 0=Mo, 6=So (statt 0=So)
          const hour = getHours(date);
          countMatrix[day][hour]++;
        } catch (error) {
          if (import.meta.env.DEV) {
            logger.warn('[UtilizationHeatmap] Invalid pickup_time', { 
              component: 'UtilizationHeatmap', 
              pickupTime: booking.pickup_time 
            });
          }
        }
      });

    // Finde Maximum für Prozent-Berechnung
    const maxCount = Math.max(
      1,
      ...countMatrix.flat().filter(c => c > 0)
    );

    // Erstelle finale Matrix mit Prozenten
    for (let day = 0; day < 7; day++) {
      matrix[day] = [];
      for (let hour = 0; hour < 24; hour++) {
        const count = countMatrix[day][hour];
        matrix[day][hour] = {
          day,
          hour,
          count,
          percentage: maxCount > 0 ? (count / maxCount) * 100 : 0,
        };
      }
    }

    return matrix;
  }, [bookings]);

  // Farb-Skala basierend auf Prozent
  const getColor = (percentage: number) => {
    if (percentage === 0) return 'bg-muted/30';
    if (percentage < 25) return 'bg-status-success/20';
    if (percentage < 50) return 'bg-status-success/40';
    if (percentage < 75) return 'bg-status-warning/40';
    return 'bg-status-error/40';
  };

  // Wochentag-Labels (Mo-So)
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { locale: de, weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => 
      format(addDays(start, i), 'EEE', { locale: de })
    );
  }, []);

  // Stunden-Labels (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Auslastung nach Tageszeit</CardTitle>
        <CardDescription>
          Heatmap zeigt Buchungen nach Wochentag und Uhrzeit (letzte 30 Tage)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="inline-block min-w-full">
            {/* Header: Stunden (0-23) */}
            <div className="flex">
              <div className="w-16 flex-shrink-0" /> {/* Spacer für Wochentag-Labels */}
              {hours.map(hour => (
                <div
                  key={hour}
                  className="w-8 text-center text-xs text-muted-foreground font-medium"
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="mt-2 space-y-1">
              {heatmapData.map((dayData, dayIndex) => (
                <div key={dayIndex} className="flex items-center">
                  {/* Wochentag-Label */}
                  <div className="w-16 text-xs font-medium text-muted-foreground pr-2 text-right flex-shrink-0">
                    {weekDays[dayIndex]}
                  </div>

                  {/* Stunden-Zellen */}
                  <div className="flex gap-0.5">
                    {dayData.map((cell) => (
                      <button
                        key={`${cell.day}-${cell.hour}`}
                        onClick={() => onClick?.(cell.day, cell.hour)}
                        className={cn(
                          'w-8 h-8 rounded-sm transition-all duration-200',
                          'hover:scale-110 hover:shadow-md cursor-pointer',
                          'border border-border/50',
                          getColor(cell.percentage)
                        )}
                        title={`${weekDays[cell.day]} ${cell.hour}:00 Uhr - ${cell.count} Buchungen`}
                      >
                        <span className="sr-only">
                          {weekDays[cell.day]} {cell.hour}:00 Uhr: {cell.count} Buchungen
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legende */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-muted/30 border border-border/50" />
                <span className="text-muted-foreground">Keine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-status-success/30 border border-border/50" />
                <span className="text-muted-foreground">Wenig</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-status-warning/40 border border-border/50" />
                <span className="text-muted-foreground">Mittel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-status-error/40 border border-border/50" />
                <span className="text-muted-foreground">Hoch</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
