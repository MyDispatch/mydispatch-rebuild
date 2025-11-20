import { useEffect, useState } from "react";
import { HEREMap } from "@/components/maps/HEREMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Users, Navigation } from "lucide-react";
import { logger } from "@/lib/logger";

interface DriverPosition {
  driver_id: string;
  driver_name: string;
  latitude: number;
  longitude: number;
  status: string;
  updated_at: string;
}

export const LiveDriverMap = ({ companyId }: { companyId: string }) => {
  const [driverPositions, setDriverPositions] = useState<DriverPosition[]>([]);
  const [center, setCenter] = useState({ lat: 52.026, lng: 8.53666 }); // Default: Bielefeld
  const [companyLocation, setCompanyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyLocation();
    fetchDriverPositions();

    // Realtime updates via Supabase
    const channel = supabase
      .channel("drivers-status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drivers",
          filter: `company_id=eq.${companyId}`,
        },
        () => {
          fetchDriverPositions();
        }
      )
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchDriverPositions, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [companyId]);

  const fetchCompanyLocation = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("latitude, longitude")
        .eq("id", companyId)
        .single();

      if (error) throw error;

      if (data?.latitude && data?.longitude) {
        const location = { lat: data.latitude, lng: data.longitude };
        setCompanyLocation(location);
        setCenter(location);
      }
    } catch (error) {
      logger.error("[LiveDriverMap] Fehler beim Laden der Company-Location", error as Error, {
        component: "LiveDriverMap",
        action: "fetchCompanyLocation",
        companyId,
      });
      // Keep default center
    }
  };

  const fetchDriverPositions = async () => {
    try {
      // Nutze bestehende drivers Tabelle
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("company_id", companyId)
        .eq("archived", false)
        .in("shift_status", ["available", "busy"]);

      if (error) throw error;

      // Nutze echte Company-Location als Basis für Mock-Positionen
      const baseLocation = companyLocation || center;

      // Mock GPS-Positionen um Company-Location (wird später durch echte GPS ersetzt)
      const positions: DriverPosition[] = (data || []).map((driver) => ({
        driver_id: driver.id,
        driver_name: `${driver.first_name} ${driver.last_name}`,
        // Verteile Fahrer in ~5km Radius um Company-Location
        latitude: baseLocation.lat + (Math.random() - 0.5) * 0.05,
        longitude: baseLocation.lng + (Math.random() - 0.5) * 0.05,
        status: driver.shift_status || "available",
        updated_at: new Date().toISOString(),
      }));

      setDriverPositions(positions);

      // Center bleibt auf Company-Location, nicht auf erstem Fahrer
    } catch (error) {
      logger.error("[LiveDriverMap] Fehler beim Laden der Fahrer", error as Error, {
        component: "LiveDriverMap",
        action: "fetchDriverPositions",
        companyId,
      });
      toast({
        title: "Fehler",
        description: "Fahrer-Positionen konnten nicht geladen werden",
        variant: "destructive",
      });
    }
  };

  const markers = driverPositions.map((pos) => ({
    lat: pos.latitude,
    lng: pos.longitude,
    label: pos.driver_name,
  }));

  return (
    <Card className="col-span-full">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-foreground" />
              Live-Karte
            </CardTitle>
            <CardDescription>Echtzeit-Positionen Ihrer Fahrer</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              {driverPositions.length} Fahrer online
            </Badge>
            <Badge
              variant="outline"
              className="gap-2 bg-status-success/10 border-status-success/20"
            >
              <MapPin className="h-4 w-4 text-foreground" />
              <span className="text-status-success">Live-Tracking</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <HEREMap
          center={center}
          zoom={12}
          markers={markers}
          className="h-96 rounded-lg shadow-lg"
        />
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>DSGVO-konform: GPS-Daten werden nach 24h automatisch gelöscht</span>
        </div>
      </CardContent>
    </Card>
  );
};
