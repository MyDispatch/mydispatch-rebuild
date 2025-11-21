/* ==================================================================================
   MOBILE TRACKING - Live GPS Tracking für Mobile
   ==================================================================================
   ✅ MobileGridLayout Pattern
   ✅ Real-time Driver Positions
   ✅ Vehicle Status Monitoring
   ================================================================================== */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, User, Car, Activity, Navigation } from 'lucide-react';
import { MobileGridLayout } from './MobileGridLayout';
import { StatusIndicator } from '@/components/shared/StatusIndicator';

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  shift_status?: 'available' | 'busy' | 'on_duty' | 'offline';
  current_location?: string;
  last_position?: {
    lat: number;
    lng: number;
  };
  vehicle?: {
    license_plate?: string;
    model?: string;
  };
}

interface MobileTrackingProps {
  drivers: Driver[];
  isLoading: boolean;
  onDriverClick: (driver: Driver) => void;
  onRefresh: () => void;
}

export function MobileTracking({
  drivers,
  isLoading,
  onDriverClick,
  onRefresh
}: MobileTrackingProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrivers = drivers.filter(driver => {
    if (activeFilter === 'on_duty' && driver.shift_status !== 'on_duty' && driver.shift_status !== 'busy') return false;
    if (activeFilter === 'busy' && driver.shift_status !== 'busy') return false;
    if (activeFilter === 'available' && driver.shift_status !== 'available') return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${driver.first_name} ${driver.last_name}`.toLowerCase();
      return (
        fullName.includes(query) ||
        driver.vehicle?.license_plate?.toLowerCase().includes(query) ||
        driver.phone?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const statusCounts = {
    all: drivers.length,
    on_duty: drivers.filter(d => d.shift_status === 'on_duty' || d.shift_status === 'busy').length,
    busy: drivers.filter(d => d.shift_status === 'busy').length,
    available: drivers.filter(d => d.shift_status === 'available').length,
  };

  const filters = [
    { id: 'all', label: 'Alle', count: statusCounts.all },
    { id: 'on_duty', label: 'Online', count: statusCounts.on_duty },
    { id: 'busy', label: 'Im Einsatz', count: statusCounts.busy },
    { id: 'available', label: 'Verfügbar', count: statusCounts.available },
  ];

  const getStatusType = (status?: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'on_duty': return 'info';
      case 'offline': return 'neutral';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'available': return 'Verfügbar';
      case 'busy': return 'Im Einsatz';
      case 'on_duty': return 'Dienstbereit';
      case 'offline': return 'Offline';
      default: return 'Unbekannt';
    }
  };

  return (
    <MobileGridLayout<Driver>
      searchPlaceholder="Fahrer durchsuchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredDrivers}
      onItemClick={onDriverClick}
      entityLabel={{ singular: 'Fahrer', plural: 'Fahrer' }}
      fabLabel="Zur Karte"
      onFabClick={() => {}}
      emptyStateProps={{
        icon: <MapPin className="w-full h-full" />,
        noDataTitle: 'Keine aktiven Fahrer',
        noDataDescription: 'Es wurden keine Fahrer mit GPS-Tracking gefunden',
        noResultsTitle: 'Keine Fahrer gefunden',
        noResultsDescription: 'Versuchen Sie eine andere Suchanfrage',
      }}
      renderCard={(driver) => (
        <Card
          className="cursor-pointer hover:bg-primary/5 transition-colors"
          onClick={() => onDriverClick(driver)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">
                  {driver.first_name} {driver.last_name}
                </h3>
                <StatusIndicator
                  type={getStatusType(driver.shift_status)}
                  label={getStatusLabel(driver.shift_status)}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-success-text bg-success-light px-2 py-1 rounded-full">
                <Activity className="h-3 w-3" />
                <span>Live</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {driver.vehicle && (
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="text-slate-700">
                    {driver.vehicle.license_plate}
                    {driver.vehicle.model && ` • ${driver.vehicle.model}`}
                  </span>
                </div>
              )}
              {driver.current_location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 line-clamp-2">{driver.current_location}</span>
                </div>
              )}
              {driver.last_position && (
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <span className="text-slate-600 text-xs">
                    GPS: {driver.last_position.lat.toFixed(4)}, {driver.last_position.lng.toFixed(4)}
                  </span>
                </div>
              )}
              {driver.phone && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-slate-600 text-xs">{driver.phone}</span>
                </div>
              )}
            </div>

            {/* GPS Signal Indicator */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">GPS-Signal</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success-text font-medium">Aktiv</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    />
  );
}
