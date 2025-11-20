import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface RouteResult {
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string;
}

export const useHERERouting = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculateRoute = async (
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    transportMode: "car" | "truck" | "taxi" = "car"
  ): Promise<RouteResult | null> => {
    setIsCalculating(true);

    try {
      const apiKey = import.meta.env.VITE_HERE_API_KEY;

      if (!apiKey) {
        throw new Error("HERE API Key nicht konfiguriert");
      }

      const url =
        `https://router.hereapi.com/v8/routes?` +
        `transportMode=${transportMode}` +
        `&origin=${from.lat},${from.lng}` +
        `&destination=${to.lat},${to.lng}` +
        `&return=polyline,summary` +
        `&apiKey=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Route-Berechnung fehlgeschlagen: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error("Keine Route gefunden");
      }

      const route = data.routes[0];
      const section = route.sections[0];

      return {
        distance: section.summary.length,
        duration: section.summary.duration,
        polyline: section.polyline,
      };
    } catch (error) {
      logger.error("[useHereRouting] Routing-Fehler", error as Error, {
        component: "useHereRouting",
      });
      toast({
        title: "Routing-Fehler",
        description: error instanceof Error ? error.message : "Route konnte nicht berechnet werden",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} Min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return {
    calculateRoute,
    isCalculating,
    formatDistance,
    formatDuration,
  };
};
