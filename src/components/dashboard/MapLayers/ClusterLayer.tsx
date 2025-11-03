/* ==================================================================================
   CLUSTER LAYER - Marker Clustering für viele Fahrer
   ==================================================================================
   ✅ Gruppiert Marker bei >10 Fahrern in 100m Radius
   ✅ Cluster-Marker mit Count-Badge
   ✅ Zoom-In → Cluster löst sich auf
   ✅ Toggle-fähig (visible prop)
   ================================================================================== */

import { useEffect, useState, useMemo } from 'react';

interface DriverMarker {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  color: string;
}

interface ClusterLayerProps {
  drivers: DriverMarker[];
  visible: boolean;
  mapInstance?: any; // HERE Map instance
  clusterThreshold?: number; // Minimum Marker pro Cluster (default: 3)
  clusterRadius?: number; // Radius in Metern (default: 100)
}

interface Cluster {
  latitude: number;
  longitude: number;
  count: number;
  drivers: DriverMarker[];
}

export function ClusterLayer({
  drivers,
  visible,
  mapInstance,
  clusterThreshold = 3,
  clusterRadius = 100
}: ClusterLayerProps) {
  const [clusterObjects, setClusterObjects] = useState<any[]>([]);
  const [currentZoom, setCurrentZoom] = useState(12);

  // ✅ Listen to Zoom Changes
  useEffect(() => {
    if (!mapInstance) return;

    const handleViewChange = () => {
      setCurrentZoom(mapInstance.getZoom());
    };

    mapInstance.addEventListener('mapviewchange', handleViewChange);

    return () => {
      mapInstance.removeEventListener('mapviewchange', handleViewChange);
    };
  }, [mapInstance]);

  // ✅ Berechne Clusters (Simple Distance-based Clustering)
  const clusters = useMemo<Cluster[]>(() => {
    if (!visible || drivers.length === 0) return [];

    // Bei hohem Zoom: Kein Clustering (Zoom >14)
    if (currentZoom > 14) return [];

    const clusteredDrivers = new Set<string>();
    const result: Cluster[] = [];

    drivers.forEach((driver) => {
      if (clusteredDrivers.has(driver.id)) return;

      // Finde alle Fahrer im Radius
      const nearby = drivers.filter((other) => {
        if (other.id === driver.id || clusteredDrivers.has(other.id)) return false;

        const distance = calculateDistance(
          driver.latitude,
          driver.longitude,
          other.latitude,
          other.longitude
        );

        return distance <= clusterRadius;
      });

      if (nearby.length + 1 >= clusterThreshold) {
        // Cluster erstellen
        const allDrivers = [driver, ...nearby];
        allDrivers.forEach(d => clusteredDrivers.add(d.id));

        // Center berechnen (Durchschnitt)
        const centerLat = allDrivers.reduce((sum, d) => sum + d.latitude, 0) / allDrivers.length;
        const centerLng = allDrivers.reduce((sum, d) => sum + d.longitude, 0) / allDrivers.length;

        result.push({
          latitude: centerLat,
          longitude: centerLng,
          count: allDrivers.length,
          drivers: allDrivers
        });
      }
    });

    return result;
  }, [drivers, visible, currentZoom, clusterThreshold, clusterRadius]);

  // ✅ Haversine Distance (in Metern)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // ✅ Render Clusters auf Map
  useEffect(() => {
    if (!mapInstance || !visible || clusters.length === 0) {
      // Cleanup alte Cluster
      clusterObjects.forEach(obj => mapInstance?.removeObject(obj));
      setClusterObjects([]);
      return;
    }

    // Cleanup alte Cluster
    clusterObjects.forEach(obj => mapInstance.removeObject(obj));

    const newObjects: any[] = [];

    clusters.forEach((cluster) => {
      // Cluster-Icon (Circle mit Count)
      const size = 40 + Math.min(cluster.count * 5, 60); // Max 100px

      const svgCluster = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <circle 
            cx="${size / 2}" 
            cy="${size / 2}" 
            r="${size / 2}" 
            fill="rgba(59, 130, 246, 0.7)" 
            stroke="rgba(59, 130, 246, 1)" 
            stroke-width="3"
          />
          <text 
            x="${size / 2}" 
            y="${size / 2}" 
            text-anchor="middle" 
            dominant-baseline="middle" 
            fill="white" 
            font-weight="bold" 
            font-size="${Math.min(18, size / 3)}"
          >
            ${cluster.count}
          </text>
        </svg>
      `;

      const icon = new (window as any).H.map.Icon(
        'data:image/svg+xml,' + encodeURIComponent(svgCluster),
        { anchor: { x: size / 2, y: size / 2 } }
      );

      const marker = new (window as any).H.map.Marker(
        { lat: cluster.latitude, lng: cluster.longitude },
        {
          icon,
          data: {
            type: 'cluster',
            count: cluster.count,
            drivers: cluster.drivers.map(d => d.label)
          }
        }
      );

      // Click → Zoom In
      marker.addEventListener('tap', () => {
        mapInstance.setCenter({ lat: cluster.latitude, lng: cluster.longitude });
        mapInstance.setZoom(mapInstance.getZoom() + 2);
      });

      mapInstance.addObject(marker);
      newObjects.push(marker);
    });

    setClusterObjects(newObjects);

    return () => {
      newObjects.forEach(obj => mapInstance.removeObject(obj));
    };
  }, [mapInstance, visible, clusters]);

  return null; // Rein logische Component
}
