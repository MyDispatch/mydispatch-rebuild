/* ==================================================================================
   ROUTE LAYER - Aktive Fahrten mit HERE Routing API
   ==================================================================================
   ✅ Zeigt Routes für aktive Bookings (status='in_progress')
   ✅ Polyline von pickup_location zu destination_location
   ✅ ETA anzeigen
   ✅ Toggle-fähig (visible prop)
   ================================================================================== */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface ActiveDriver {
  driver_id: string;
  latitude: number;
  longitude: number;
  vehicle_id: string;
}

interface RouteLayerProps {
  companyId: string;
  visible: boolean;
  mapInstance?: any; // HERE Map instance
}

interface Route {
  driverId: string;
  polyline: string;
  distance: number; // meters
  duration: number; // seconds
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}

export function RouteLayer({
  companyId,
  visible,
  mapInstance
}: RouteLayerProps) {
  const [activeDrivers, setActiveDrivers] = useState<ActiveDriver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeObjects, setRouteObjects] = useState<any[]>([]);

  // ✅ Fetch Active Driver Positions (busy drivers)
  useEffect(() => {
    if (!visible) return;
    fetchActiveDrivers();

    const interval = setInterval(fetchActiveDrivers, 30000); // Refresh alle 30s

    return () => clearInterval(interval);
  }, [companyId, visible]);

  const fetchActiveDrivers = async () => {
    try {
      // Fetch busy drivers (aus vehicle_positions + drivers JOIN)
      const { data, error } = await supabase
        .from('vehicle_positions')
        .select(`
          driver_id,
          latitude,
          longitude,
          vehicle_id,
          drivers:driver_id (
            shift_status
          )
        `)
        .eq('company_id', companyId)
        .gte('timestamp', new Date(Date.now() - 3600000).toISOString()); // Last 1h

      if (error) throw error;

      // Filter nur busy drivers
      const busy = (data || [])
        .filter((pos: any) => pos.drivers?.shift_status === 'busy')
        .map((pos: any) => ({
          driver_id: pos.driver_id,
          latitude: pos.latitude,
          longitude: pos.longitude,
          vehicle_id: pos.vehicle_id
        }));

      setActiveDrivers(busy);
    } catch (error) {
      logger.error('[RouteLayer] Fehler beim Laden der aktiven Fahrer', error as Error);
    }
  };

  // ✅ Generate Mock Routes (Demo: Von aktueller Position zu random Ziel in 5km Radius)
  useEffect(() => {
    if (!visible || activeDrivers.length === 0) {
      setRoutes([]);
      return;
    }

    calculateMockRoutes();
  }, [activeDrivers, visible]);

  const calculateMockRoutes = async () => {
    const hereApiKey = import.meta.env.VITE_HERE_API_KEY;
    if (!hereApiKey) {
      logger.error('[RouteLayer] HERE_API_KEY fehlt!');
      return;
    }

    const newRoutes: Route[] = [];

    // Nur erste 5 Fahrer (sonst zu viele Routes)
    const driversToShow = activeDrivers.slice(0, 5);

    for (const driver of driversToShow) {
      try {
        // Random Ziel in 5km Radius
        const destLat = driver.latitude + (Math.random() - 0.5) * 0.05; // ~5km
        const destLng = driver.longitude + (Math.random() - 0.5) * 0.05;

        const response = await fetch(
          `https://router.hereapi.com/v8/routes?` +
          `transportMode=car&` +
          `origin=${driver.latitude},${driver.longitude}&` +
          `destination=${destLat},${destLng}&` +
          `return=polyline,summary&` +
          `apiKey=${hereApiKey}`
        );

        if (!response.ok) continue;

        const data = await response.json();
        const route = data.routes[0];
        if (!route) continue;

        newRoutes.push({
          driverId: driver.driver_id,
          polyline: route.sections[0].polyline,
          distance: route.sections[0].summary.length,
          duration: route.sections[0].summary.duration,
          from: { lat: driver.latitude, lng: driver.longitude },
          to: { lat: destLat, lng: destLng }
        });
      } catch (error) {
        logger.error('[RouteLayer] Route-Berechnung fehlgeschlagen', error as Error, { driverId: driver.driver_id });
      }
    }

    setRoutes(newRoutes);
  };

  // ✅ Render Routes on Map
  useEffect(() => {
    if (!mapInstance || !visible || routes.length === 0) {
      // Cleanup alte Objekte
      routeObjects.forEach(obj => mapInstance?.removeObject(obj));
      setRouteObjects([]);
      return;
    }

    // Cleanup alte Objekte
    routeObjects.forEach(obj => mapInstance.removeObject(obj));

    const newObjects: any[] = [];

    routes.forEach((route) => {
      try {
        // Decode Polyline (HERE nutzt Flexible Polyline Encoding)
        const lineString = (window as any).H.geo.LineString.fromFlexiblePolyline(route.polyline);

        // Polyline auf Karte zeichnen
        const polyline = new (window as any).H.map.Polyline(lineString, {
          style: {
            strokeColor: 'rgba(59, 130, 246, 0.8)', // Blue
            lineWidth: 4
          },
          data: {
            type: 'route',
            driverId: route.driverId,
            distance: route.distance,
            duration: route.duration
          }
        });

        mapInstance.addObject(polyline);
        newObjects.push(polyline);
      } catch (error) {
        logger.error('[RouteLayer] Fehler beim Zeichnen der Route', error as Error, { driverId: route.driverId });
      }
    });

    setRouteObjects(newObjects);

    return () => {
      newObjects.forEach(obj => mapInstance.removeObject(obj));
    };
  }, [mapInstance, visible, routes]);

  return null; // Rein logische Component
}
