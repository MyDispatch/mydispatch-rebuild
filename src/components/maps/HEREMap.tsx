import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { CI_COLORS_HEX } from "@/lib/design-system";
import { logger } from "@/lib/logger";

interface HEREMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    label?: string;
    color?: string;
    onClick?: () => void;
  }>;
  routes?: Array<{ from: { lat: number; lng: number }; to: { lat: number; lng: number } }>;
  className?: string;
  onMapReady?: (mapInstance: any) => void;
}

export const HEREMap = ({
  center,
  zoom = 12,
  markers = [],
  routes = [],
  className = "",
  onMapReady,
}: HEREMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load HERE Maps API
        if (!(window as any).H) {
          const script = document.createElement("script");
          script.src = "https://js.api.here.com/v3/3.1/mapsjs-core.js";
          script.async = true;
          document.head.appendChild(script);

          const uiScript = document.createElement("script");
          uiScript.src = "https://js.api.here.com/v3/3.1/mapsjs-ui.js";
          uiScript.async = true;
          document.head.appendChild(uiScript);

          const serviceScript = document.createElement("script");
          serviceScript.src = "https://js.api.here.com/v3/3.1/mapsjs-service.js";
          serviceScript.async = true;
          document.head.appendChild(serviceScript);

          const eventsScript = document.createElement("script");
          eventsScript.src = "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js";
          eventsScript.async = true;
          document.head.appendChild(eventsScript);

          const cssLink = document.createElement("link");
          cssLink.rel = "stylesheet";
          cssLink.href = "https://js.api.here.com/v3/3.1/mapsjs-ui.css";
          document.head.appendChild(cssLink);

          await new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              if ((window as any).H) {
                clearInterval(checkInterval);
                resolve(true);
              }
            }, 100);

            setTimeout(() => {
              clearInterval(checkInterval);
              resolve(true);
            }, 5000);
          });
        }

        const H = (window as any).H;
        if (!H) {
          throw new Error("HERE Maps API konnte nicht geladen werden");
        }

        const apiKey = import.meta.env.VITE_HERE_API_KEY;
        if (!apiKey) {
          throw new Error("HERE API Key nicht gefunden");
        }

        const platform = new H.service.Platform({ apikey: apiKey });
        const defaultLayers = platform.createDefaultLayers();

        const newMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
          center: { lat: center.lat, lng: center.lng },
          zoom: zoom,
          pixelRatio: window.devicePixelRatio || 1,
        });

        new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
        H.ui.UI.createDefault(newMap, defaultLayers, "de-DE");

        // Add markers
        markers.forEach((marker) => {
          const icon = new H.map.Icon(
            '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="hsl(142 76% 36%)" stroke="hsl(0 0% 100%)" stroke-width="2"/></svg>'
          );
          const mapMarker = new H.map.Marker({ lat: marker.lat, lng: marker.lng }, { icon });
          newMap.addObject(mapMarker);
        });

        // Add routes
        if (routes.length > 0) {
          const router = platform.getRoutingService(null, 8);
          routes.forEach((route) => {
            const routingParameters = {
              routingMode: "fast",
              transportMode: "car",
              origin: `${route.from.lat},${route.from.lng}`,
              destination: `${route.to.lat},${route.to.lng}`,
              return: "polyline",
            };

            router.calculateRoute(
              routingParameters,
              (result: any) => {
                if (result.routes.length) {
                  const lineString = H.geo.LineString.fromFlexiblePolyline(
                    result.routes[0].sections[0].polyline
                  );
                  const routeLine = new H.map.Polyline(lineString, {
                    style: { strokeColor: "hsl(142 76% 36%)", lineWidth: 4 },
                  });
                  newMap.addObject(routeLine);
                }
              },
              (err: unknown) => {
                logger.error("[HEREMap] Routing error", err instanceof Error ? err : undefined, {
                  component: "HEREMap",
                });
              }
            );
          });
        }

        setMap(newMap);
        setIsLoading(false);

        // Notify parent about map ready
        if (onMapReady) {
          onMapReady(newMap);
        }

        const resizeHandler = () => newMap.getViewPort().resize();
        window.addEventListener("resize", resizeHandler);

        return () => {
          window.removeEventListener("resize", resizeHandler);
        };
      } catch (err) {
        logger.error("[HEREMap] HERE Map Fehler", err instanceof Error ? err : undefined, {
          component: "HEREMap",
        });
        setError("Karte konnte nicht geladen werden");
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (map) {
        map.dispose();
      }
    };
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    if (!map) return;

    // Update markers
    map.removeObjects(map.getObjects());
    const H = (window as any).H;

    markers.forEach((marker) => {
      const icon = new H.map.Icon(
        '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="hsl(142 76% 36%)" stroke="hsl(0 0% 100%)" stroke-width="2"/></svg>'
      );
      const mapMarker = new H.map.Marker({ lat: marker.lat, lng: marker.lng }, { icon });
      map.addObject(mapMarker);
    });
  }, [markers, map]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`}>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};
