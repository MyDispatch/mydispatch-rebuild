/* ==================================================================================
   HEATMAP LAYER - Auftrags-Hotspots Visualization
   ==================================================================================
   ✅ Zeigt Hotspots basierend auf vehicle_positions
   ✅ Intensity basierend auf Auftragsanzahl
   ✅ Gradient: Grün → Gelb → Rot
   ✅ Toggle-fähig (visible prop)
   ================================================================================== */

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface VehiclePosition {
  id: string;
  latitude: number;
  longitude: number;
  driver_id: string;
  timestamp: string;
}

interface HeatmapLayerProps {
  companyId: string;
  visible: boolean;
  mapInstance?: any; // HERE Map instance
  timeRange?: number; // Hours (default: 24)
}

interface Hotspot {
  latitude: number;
  longitude: number;
  intensity: number; // 0-1
  count: number;
  location: string;
}

export function HeatmapLayer({
  companyId,
  visible,
  mapInstance,
  timeRange = 24
}: HeatmapLayerProps) {
  const [positions, setPositions] = useState<VehiclePosition[]>([]);
  const [heatmapObjects, setHeatmapObjects] = useState<any[]>([]);

  // ✅ Fetch Vehicle Positions für Heatmap (zeigt häufig befahrene Bereiche)
  useEffect(() => {
    if (!visible) return;
    fetchPositionsForHeatmap();
  }, [companyId, visible, timeRange]);

  const fetchPositionsForHeatmap = async () => {
    try {
      const since = new Date(Date.now() - timeRange * 3600000).toISOString();

      const { data, error } = await supabase
        .from('vehicle_positions')
        .select('id, latitude, longitude, driver_id, timestamp')
        .eq('company_id', companyId)
        .gte('timestamp', since);

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      logger.error('[HeatmapLayer] Fehler beim Laden der Positionen', error as Error);
    }
  };

  // ✅ Berechne Hotspots (gruppiert nach Location-Grid 0.01° = ~1km)
  const hotspots = useMemo<Hotspot[]>(() => {
    if (!visible || positions.length === 0) return [];

    const locationMap = new Map<string, { lat: number; lng: number; count: number }>();

    // Grid-based Clustering (0.01° = ~1km)
    positions.forEach((pos) => {
      const gridLat = Math.floor(pos.latitude * 100) / 100;
      const gridLng = Math.floor(pos.longitude * 100) / 100;
      const key = `${gridLat},${gridLng}`;
      
      if (locationMap.has(key)) {
        const existing = locationMap.get(key)!;
        existing.count += 1;
      } else {
        locationMap.set(key, {
          lat: gridLat,
          lng: gridLng,
          count: 1
        });
      }
    });

    const maxCount = Math.max(...Array.from(locationMap.values()).map(h => h.count), 1);

    return Array.from(locationMap.entries()).map(([key, value]) => ({
      latitude: value.lat,
      longitude: value.lng,
      intensity: value.count / maxCount, // Normalize 0-1
      count: value.count,
      location: key
    }));
  }, [positions, visible]);

  // ✅ Render Heatmap on Map (Circles statt echter Heatmap - HERE unterstützt keine native Heatmap)
  useEffect(() => {
    if (!mapInstance || !visible || hotspots.length === 0) {
      // Cleanup alte Objekte
      heatmapObjects.forEach(obj => mapInstance?.removeObject(obj));
      setHeatmapObjects([]);
      return;
    }

    // Cleanup alte Objekte
    heatmapObjects.forEach(obj => mapInstance.removeObject(obj));

    const newObjects: unknown[] = [];

    hotspots.forEach((hotspot) => {
      // Farbe basierend auf Intensity
      const color = hotspot.intensity > 0.7
        ? 'rgba(239, 68, 68, 0.4)' // Rot (high)
        : hotspot.intensity > 0.4
        ? 'rgba(234, 179, 8, 0.4)' // Gelb (medium)
        : 'rgba(34, 197, 94, 0.4)'; // Grün (low)

      const stroke = hotspot.intensity > 0.7
        ? 'rgba(239, 68, 68, 0.8)'
        : hotspot.intensity > 0.4
        ? 'rgba(234, 179, 8, 0.8)'
        : 'rgba(34, 197, 94, 0.8)';

      // Radius basierend auf Intensity
      const radius = 30 + (hotspot.intensity * 70); // 30-100px

      // SVG Circle für Hotspot
      const svgCircle = `
        <svg width="${radius * 2}" height="${radius * 2}" xmlns="http://www.w3.org/2000/svg">
          <circle 
            cx="${radius}" 
            cy="${radius}" 
            r="${radius}" 
            fill="${color}" 
            stroke="${stroke}" 
            stroke-width="2"
          />
          <text 
            x="${radius}" 
            y="${radius}" 
            text-anchor="middle" 
            dominant-baseline="middle" 
            fill="white" 
            font-weight="bold" 
            font-size="14"
          >
            ${hotspot.count}
          </text>
        </svg>
      `;

      const icon = new (window as any).H.map.Icon(
        'data:image/svg+xml,' + encodeURIComponent(svgCircle),
        { anchor: { x: radius, y: radius } }
      );

      const marker = new (window as any).H.map.Marker(
        { lat: hotspot.latitude, lng: hotspot.longitude },
        { icon, data: { type: 'hotspot', count: hotspot.count } }
      );

      mapInstance.addObject(marker);
      newObjects.push(marker);
    });

    setHeatmapObjects(newObjects);

    return () => {
      newObjects.forEach(obj => mapInstance.removeObject(obj));
    };
  }, [mapInstance, visible, hotspots]);

  return null; // Rein logische Component (keine UI)
}
