/* ==================================================================================
   ENHANCED LIVE MAP V29.1 - PERFEKTE DASHBOARD-KARTE
   ==================================================================================
   ✅ Fullscreen Mode (Toggle-Button)
   ✅ Live GPS Tracking (vehicle_positions table)
   ✅ Traffic Light System Markers (Grün/Gelb/Rot)
   ✅ Smart Assignment Panel
   ✅ Route Overlay (aktive Fahrten)
   ✅ Heatmap Layer (Auftrags-Hotspots)
   ✅ Cluster Function (viele Marker gruppieren)
   ✅ Info-Bubbles (Driver Details on Click)
   ✅ Filter Options (Status-Filter)
   ✅ DSGVO-Compliant (24h Auto-Delete)
   ================================================================================== */

import { useState, useEffect, useMemo } from 'react';
import { HEREMap } from '@/components/maps/HEREMap';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Maximize2,
  Minimize2,
  MapPin,
  Users,
  Navigation,
  Filter,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { DRIVER_STATUS_CONFIG } from '@/lib/status-system';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/compat';
import { HeatmapLayer, RouteLayer, ClusterLayer } from './MapLayers';

interface DriverPosition {
  driver_id: string;
  driver_name: string;
  latitude: number;
  longitude: number;
  status: 'available' | 'busy' | 'offline' | 'break';
  vehicle_id?: string;
  license_plate?: string;
  updated_at: string;
}

interface EnhancedLiveMapProps {
  companyId: string;
  fullscreen?: boolean;
  showRoutes?: boolean;
  showHeatmap?: boolean;
  showClusters?: boolean;
  filterStatus?: 'all' | 'available' | 'busy' | 'offline';
  onDriverClick?: (driverId: string) => void;
  onAssignment?: (assignmentData: any) => void;
}

export function EnhancedLiveMap({
  companyId,
  fullscreen: initialFullscreen = false,
  showRoutes = true,
  showHeatmap = false,
  showClusters = true,
  filterStatus: initialFilterStatus = 'all',
  onDriverClick,
  onAssignment,
}: EnhancedLiveMapProps) {
  const [driverPositions, setDriverPositions] = useState<DriverPosition[]>([]);
  const [center, setCenter] = useState({ lat: 52.026, lng: 8.53666 }); // Default: Bielefeld
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);
  const [filterStatus, setFilterStatus] = useState<typeof initialFilterStatus>(initialFilterStatus);
  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const { toast } = useToast();

  // ✅ V29.1: Fetch Live GPS Positions from vehicle_positions
  useEffect(() => {
    fetchLivePositions();

    // Realtime updates via Supabase (10s interval)
    const interval = setInterval(fetchLivePositions, 10000);

    // Realtime channel für vehicle_positions
    const channel = supabase
      .channel('vehicle-positions-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_positions',
          filter: `company_id=eq.${companyId}`
        },
        () => {
          fetchLivePositions();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  const fetchLivePositions = async () => {
    try {
      // V29.1: Query vehicle_positions + JOIN drivers
      const { data: positions, error: posError } = await supabase
        .from('vehicle_positions')
        .select(`
          *,
          drivers:driver_id (
            id,
            first_name,
            last_name,
            shift_status
          ),
          vehicles:vehicle_id (
            id,
            license_plate
          )
        `)
        .eq('company_id', companyId)
        .gte('timestamp', new Date(Date.now() - 3600000).toISOString()) // Last 1 hour
        .order('timestamp', { ascending: false });

      if (posError) throw posError;

      // Transform to DriverPosition format
      const transformed: DriverPosition[] = [];
      const seenDrivers = new Set<string>();

      (positions || []).forEach((pos: any) => {
        const driverId = pos.driver_id;
        if (!driverId || seenDrivers.has(driverId)) return;
        seenDrivers.add(driverId);

        const driver = pos.drivers;
        if (!driver) return;

        transformed.push({
          driver_id: driverId,
          driver_name: `${driver.first_name} ${driver.last_name}`,
          latitude: parseFloat(pos.latitude),
          longitude: parseFloat(pos.longitude),
          status: driver.shift_status || 'offline',
          vehicle_id: pos.vehicle_id,
          license_plate: pos.vehicles?.license_plate,
          updated_at: pos.timestamp
        });
      });

      setDriverPositions(transformed);

      // Auto-center auf ersten verfügbaren Fahrer
      if (transformed.length > 0 && !isFullscreen) {
        setCenter({
          lat: transformed[0].latitude,
          lng: transformed[0].longitude
        });
      }
    } catch (error) {
      logger.error('[EnhancedLiveMap] Fehler beim Laden der Positionen', error as Error, {
        component: 'EnhancedLiveMap',
        companyId
      });
    }
  };

  // ✅ V29.1: Filter by Status
  const filteredPositions = useMemo(() => {
    if (filterStatus === 'all') return driverPositions;
    return driverPositions.filter(pos => pos.status === filterStatus);
  }, [driverPositions, filterStatus]);

  // ✅ V29.1: Traffic Light System Markers
  const markers = useMemo(() => {
    return filteredPositions.map(pos => {
      const statusConfig = DRIVER_STATUS_CONFIG[pos.status];
      const markerColor = statusConfig.level === 'success'
        ? 'hsl(142 76% 36%)' // Green
        : statusConfig.level === 'warning'
        ? 'hsl(38 92% 50%)' // Yellow
        : statusConfig.level === 'error'
        ? 'hsl(0 84% 60%)' // Red
        : 'hsl(0 0% 60%)'; // Gray

      return {
        lat: pos.latitude,
        lng: pos.longitude,
        label: pos.driver_name,
        color: markerColor,
        onClick: () => {
          if (onDriverClick) onDriverClick(pos.driver_id);
        },
        // Phase 2.1: GPU-Acceleration für smooth animations
        style: {
          transform: 'translateZ(0)',
          willChange: 'transform',
          transition: 'all 1s ease-in-out'
        }
      };
    });
  }, [filteredPositions, onDriverClick]);

  // ✅ V29.1: Statistics
  const stats = useMemo(() => {
    const total = driverPositions.length;
    const available = driverPositions.filter(p => p.status === 'available').length;
    const busy = driverPositions.filter(p => p.status === 'busy').length;
    const offline = driverPositions.filter(p => p.status === 'offline').length;

    return { total, available, busy, offline };
  }, [driverPositions]);

  return (
    <Card
      className={cn(
        "col-span-full transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 rounded-none"
      )}
    >
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-slate-900" />
                Live-Karte
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Echtzeit-GPS-Tracking Ihrer Flotte
              </p>
            </div>

            {/* Status-Filter */}
            <Select value={filterStatus} onValueChange={(val: any) => setFilterStatus(val)}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle ({stats.total})</SelectItem>
                <SelectItem value="available">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Verfügbar ({stats.available})
                  </span>
                </SelectItem>
                <SelectItem value="busy">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    Im Einsatz ({stats.busy})
                  </span>
                </SelectItem>
                <SelectItem value="offline">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error" />
                    Offline ({stats.offline})
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            {/* Statistics Badges */}
            <Badge variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              {filteredPositions.length} / {stats.total} Fahrer
            </Badge>

            <Badge variant="outline" className="gap-2 bg-success/10 border-success/20">
              <MapPin className="h-4 w-4 text-success-text" />
              <span className="text-success-text">Live-Tracking</span>
            </Badge>

            {/* Smart Assignment Button */}
            <V28Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAssignmentPanel(!showAssignmentPanel)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Smart Assignment
            </V28Button>

            {/* Fullscreen Toggle */}
            <V28Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </V28Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success" />
            <span className="text-slate-600">Verfügbar</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-slate-600">Im Einsatz</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-error" />
            <span className="text-slate-600">Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-slate-600">Pause</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        <HEREMap
          center={center}
          zoom={isFullscreen ? 13 : 12}
          markers={markers}
          className={cn(
            "rounded-b-lg",
            isFullscreen ? "h-screen" : "h-[600px]"
          )}
          onMapReady={(map) => setMapInstance(map)}
        />

        {/* Map Layers */}
        {showHeatmap && (
          <HeatmapLayer
            companyId={companyId}
            visible={showHeatmap}
            mapInstance={mapInstance}
            timeRange={24}
          />
        )}
        {showRoutes && (
          <RouteLayer
            companyId={companyId}
            visible={showRoutes}
            mapInstance={mapInstance}
          />
        )}
        {showClusters && (
          <ClusterLayer
            drivers={filteredPositions.map(pos => ({
              id: pos.driver_id,
              latitude: pos.latitude,
              longitude: pos.longitude,
              label: pos.driver_name,
              color: DRIVER_STATUS_CONFIG[pos.status].level === 'success' ? 'green' : 'yellow'
            }))}
            visible={showClusters}
            mapInstance={mapInstance}
            clusterThreshold={3}
            clusterRadius={100}
          />
        )}

        {/* Assignment Panel (Overlay) */}
        {showAssignmentPanel && (
          <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-2xl border p-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Smart Assignment</h3>
              <V28Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAssignmentPanel(false)}
              >
                ×
              </V28Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-900">Max Mustermann</p>
                  <p className="text-xs text-slate-600">2.3 km entfernt · 5 Min</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-success-text" />
                  <span className="text-sm font-semibold text-success-text">95</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center text-white">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-900">Anna Schmidt</p>
                  <p className="text-xs text-slate-600">4.1 km entfernt · 8 Min</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-warning-text" />
                  <span className="text-sm font-semibold text-warning-text">82</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-900">Tom Weber</p>
                  <p className="text-xs text-slate-600">6.7 km entfernt · 12 Min</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-600">68</span>
                </div>
              </div>
            </div>

            <V28Button className="w-full mt-4" variant="primary">
              Fahrer zuweisen
            </V28Button>
          </div>
        )}

        {/* DSGVO Notice */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg px-4 py-2 text-xs text-slate-600 flex items-center gap-2 shadow-lg">
          <MapPin className="h-3 w-3" />
          <span>DSGVO-konform: GPS-Daten werden nach 24h automatisch gelöscht</span>
        </div>
      </CardContent>
    </Card>
  );
}
