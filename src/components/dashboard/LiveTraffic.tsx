/* ==================================================================================
   LiveTraffic Component - Echtzeit-Verkehrsdaten
   ==================================================================================
   Zeigt aktuelle Verkehrslage für die Routenplanung
   ================================================================================== */

import { useState, useEffect } from "react";
import { handleError } from "@/lib/error-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { Navigation, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/lib/compat";
import {
  TrafficApiResponse,
  validateApiResponse,
  isValidTrafficResponse,
} from "@/types/api-schemas";

interface LiveTrafficProps {
  route?: {
    origin: string;
    destination: string;
  };
}

export function LiveTraffic({ route }: LiveTrafficProps) {
  const [traffic, setTraffic] = useState<TrafficApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!route) {
      setLoading(false);
      return;
    }

    const fetchTraffic = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke("get-traffic", {
          body: {
            origin: route.origin,
            destination: route.destination,
          },
        });

        if (error) throw error;

        // ✅ ZENTRALE TYPE-VALIDIERUNG
        const validatedData = validateApiResponse(data, isValidTrafficResponse, "Traffic");
        setTraffic(validatedData);
        setError(null);
      } catch (err: any) {
        handleError(err, "Verkehrsdaten konnten nicht geladen werden", { showToast: false });
        setError("Verkehrsdaten nicht verfügbar");
      } finally {
        setLoading(false);
      }
    };

    fetchTraffic();
    const interval = setInterval(fetchTraffic, 60000); // Alle 60 Sekunden

    return () => clearInterval(interval);
  }, [route]);

  const getTrafficBadgeColor = (status: string) => {
    // Badges dürfen Ampelfarben haben, Icons nicht!
    switch (status) {
      case "Frei":
        return "bg-status-success/10 text-status-success border-status-success/20";
      case "Zähflüssig":
        return "bg-status-warning/10 text-status-warning border-status-warning/20";
      case "Stau":
        return "bg-status-error/10 text-status-error border-status-error/20";
      case "Unbekannt":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTrafficIcon = (status: string) => {
    switch (status) {
      case "Frei":
        return CheckCircle;
      case "Zähflüssig":
        return AlertTriangle;
      case "Stau":
        return AlertCircle;
      case "Unbekannt":
        return Navigation;
      default:
        return Navigation;
    }
  };

  if (!route) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verkehrslage</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Wählen Sie eine Route für Live-Verkehrsdaten
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verkehrslage</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !traffic) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verkehrslage</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{error || "Keine Daten"}</p>
        </CardContent>
      </Card>
    );
  }

  const TrafficIcon = getTrafficIcon(traffic.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Verkehrslage</span>
          <TrafficIcon className="h-5 w-5 text-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getTrafficBadgeColor(traffic.status)}>
              {traffic.status}
            </Badge>
            <span className="text-sm text-muted-foreground">ø {traffic.speed} km/h</span>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Staufaktor: {traffic.jam_factor}/10</p>
            <p className="text-xs text-muted-foreground mt-1">
              {route.origin} → {route.destination}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
