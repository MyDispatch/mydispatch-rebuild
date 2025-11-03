/* ==================================================================================
   MOBILE-OPTIMIERTE SCHICHTZETTEL-ANSICHT V40.0 OPTIMIERT
   ==================================================================================
   V40.0 OPTIMIERUNGEN:
   - ✅ useMemo für Date-Filter-Berechnungen (Performance)
   - ✅ Zentrale Filter-Logik vereinfacht
   - ✅ Wiederholte Date-Kalkulationen eliminiert
   - ✅ Filter-Counts in einem Pass berechnet
   - ✅ Type Safety für alle Filter-Operationen
   
   FEATURES:
   - Vertikale Filter (Alle, Heute, Diese Woche, Vergangene)
   - Status-Ampel (Abgeschlossen, Offen, Warte auf...)
   - Touch-optimiert (min-h-[44px])
   - Quick-Actions (Genehmigen, PDF-Export)
   ================================================================================== */

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Plus, Search, RefreshCw, Calendar, Clock, Euro, Download, Check } from 'lucide-react';
import { MobileFilterBar } from './MobileFilterBar';
import { MobileInput } from './MobileInput';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { formatCurrency, formatTime } from '@/lib/index';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusIndicator } from '@/components/shared/StatusIndicator';

interface Shift {
  id: string;
  date: string;
  driver_id?: string;
  driver_name?: string;
  vehicle_id?: string;
  license_plate?: string;
  shift_start_time: string;
  shift_end_time: string | null;
  total_km?: number | null;
  cash_earnings?: number;
  card_earnings?: number;
  invoice_earnings?: number;
  approved_by_company: boolean;
  confirmed_by_driver: boolean;
}

interface MobileSchichtzettelProps {
  shifts: Shift[];
  isLoading: boolean;
  onCreateNew: () => void;
  onShiftClick: (shift: Shift) => void;
  onRefresh: () => void;
  onApprove?: (shiftId: string) => void;
  onExportPDF?: (shiftId: string) => void;
}

export function MobileSchichtzettel({
  shifts,
  isLoading,
  onCreateNew,
  onShiftClick,
  onRefresh,
  onApprove,
  onExportPDF
}: MobileSchichtzettelProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // V40.0: Memoized date calculations for performance
  const dateRanges = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    return { today, weekAgo };
  }, []);

  // V40.0: Helper function to normalize dates
  const normalizeDateToMidnight = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // V40.0: Memoized filter counts (calculated in single pass)
  const filterCounts = useMemo(() => {
    const { today, weekAgo } = dateRanges;
    let todayCount = 0;
    let weekCount = 0;
    let pastCount = 0;

    shifts.forEach(shift => {
      const shiftDate = normalizeDateToMidnight(new Date(shift.date));
      const shiftTime = shiftDate.getTime();
      const todayTime = today.getTime();

      if (shiftTime === todayTime) {
        todayCount++;
        weekCount++; // Today is also part of week
      } else if (shiftDate >= weekAgo && shiftDate <= today) {
        weekCount++;
      } else if (shiftDate < today) {
        pastCount++;
      }
    });

    return { todayCount, weekCount, pastCount, allCount: shifts.length };
  }, [shifts, dateRanges]);

  // V40.0: Memoized filtered shifts (optimized)
  const filteredShifts = useMemo(() => {
    const { today, weekAgo } = dateRanges;
    
    return shifts.filter(shift => {
      // Date filter
      if (activeFilter !== 'all') {
        const shiftDate = normalizeDateToMidnight(new Date(shift.date));
        
        if (activeFilter === 'today' && shiftDate.getTime() !== today.getTime()) {
          return false;
        } else if (activeFilter === 'week' && (shiftDate < weekAgo || shiftDate > today)) {
          return false;
        } else if (activeFilter === 'past' && shiftDate >= today) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        return (
          shift.license_plate?.toLowerCase().includes(query) ||
          shift.driver_name?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [shifts, activeFilter, searchQuery, dateRanges]);

  const filters = useMemo(() => [
    { id: 'all', label: 'Alle', count: filterCounts.allCount },
    { id: 'today', label: 'Heute', count: filterCounts.todayCount },
    { id: 'week', label: 'Diese Woche', count: filterCounts.weekCount },
    { id: 'past', label: 'Vergangene', count: filterCounts.pastCount },
  ], [filterCounts]);

  // V40.0: Centralized status logic (from @/lib/index or shared utils)

  const getShiftStatus = (shift: Shift) => {
    if (shift.approved_by_company && shift.confirmed_by_driver) {
      return { type: 'success' as const, label: 'Abgeschlossen' };
    }
    if (shift.approved_by_company && !shift.confirmed_by_driver) {
      return { type: 'warning' as const, label: 'Warte auf Fahrer' };
    }
    if (!shift.approved_by_company && shift.confirmed_by_driver) {
      return { type: 'warning' as const, label: 'Warte auf Genehmigung' };
    }
    return { type: 'pending' as const, label: 'Offen' };
  };

  const getTotalEarnings = (shift: Shift) => {
    return (shift.cash_earnings || 0) + (shift.card_earnings || 0) + (shift.invoice_earnings || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MobileInput
          type="search"
          placeholder="Suchen..."
          value={searchQuery}
          onChange={setSearchQuery}
          icon={Search}
          className="flex-1"
        />
        <V28Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-11 w-11 shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </V28Button>
      </div>

      <MobileFilterBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-muted-foreground">
          {filteredShifts.length} {filteredShifts.length === 1 ? 'Schicht' : 'Schichten'}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-24 bg-muted rounded" />
            </Card>
          ))}
        </div>
      ) : filteredShifts.length > 0 ? (
        <div className="space-y-4">
          {filteredShifts.map(shift => {
            const status = getShiftStatus(shift);
            const canApprove = !shift.approved_by_company && onApprove;
            const canExport = shift.approved_by_company && shift.confirmed_by_driver && onExportPDF;
            
            return (
              <Card 
                key={shift.id} 
                className="cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => onShiftClick(shift)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-base">
                          {format(new Date(shift.date), 'dd.MM.yyyy', { locale: de })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {shift.license_plate || 'Kein Fahrzeug'}
                      </p>
                    </div>
                    <StatusIndicator 
                      type={status.type}
                      label={status.label}
                      size="sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(shift.shift_start_time)} - {formatTime(shift.shift_end_time)}</span>
                    </div>
                    {shift.total_km && (
                      <div className="text-right">
                        <span className="font-medium">{shift.total_km} km</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">
                        {formatCurrency(getTotalEarnings(shift))}
                      </span>
                    </div>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {canApprove && (
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onApprove(shift.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Genehmigen
                        </V28Button>
                      )}
                      {canExport && (
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onExportPDF(shift.id)}
                        >
                          <Download className="h-4 w-4" />
                        </V28Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Calendar className="h-16 w-16" />}
          title={searchQuery ? 'Keine Ergebnisse' : 'Keine Schichten'}
          description={searchQuery 
            ? 'Versuche einen anderen Suchbegriff'
            : 'Erstelle deine erste Schicht'
          }
          actionLabel={!searchQuery ? 'Neue Schicht' : undefined}
          onAction={!searchQuery ? onCreateNew : undefined}
        />
      )}

      <V28Button
        size="lg"
        className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-2xl z-40"
        onClick={onCreateNew}
      >
        <Plus className="h-6 w-6" />
      </V28Button>
    </div>
  );
}
