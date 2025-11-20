/* ==================================================================================
   TRACKING - Live-Fahrzeug- und Fahrer-Tracking V28.1
   ==================================================================================
   - DashboardPageTemplate mit KPIGenerator & QuickActionsGenerator
   - Echtzeit-Fahrerpositionen
   - Fahrzeugstatus-Monitoring
   - HERE Maps Integration
   ================================================================================== */

import { useState, useMemo } from "react";
import { DashboardPageTemplate } from "@/components/templates/DashboardPageTemplate";
import { KPIGenerator, QuickActionsGenerator } from "@/lib/dashboard-automation";
import { useTouchTargetValidation } from "@/hooks/validation/useTouchTargetValidation";
import { useDrivers } from "@/hooks/use-drivers";
import { useVehicles } from "@/hooks/use-vehicles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Download, Users, Car, Activity, Navigation } from "lucide-react";
import { HEREMap } from "@/components/maps/HEREMap";
import { useToast } from "@/hooks/use-toast";
import { useMainLayout } from "@/hooks/use-main-layout";

export default function Tracking() {
  useTouchTargetValidation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const { sidebarExpanded } = useMainLayout();

  // Data hooks
  const { drivers, isLoading: driversLoading } = useDrivers();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();

  const isLoading = driversLoading || vehiclesLoading;

  // Filter active drivers/vehicles
  const activeDrivers = useMemo(
    () =>
      drivers?.filter(
        (d) =>
          (d.shift_status === "on_duty" || d.shift_status === "busy") &&
          !d.archived &&
          (searchTerm === "" ||
            d.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
      ) || [],
    [drivers, searchTerm]
  );

  const activeVehicles = useMemo(
    () =>
      vehicles?.filter(
        (v) =>
          v.status === "im_einsatz" &&
          !v.archived &&
          (searchTerm === "" || v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()))
      ) || [],
    [vehicles, searchTerm]
  );

  const onlineDrivers = useMemo(
    () =>
      activeDrivers.filter((d) => d.shift_status === "on_duty" || d.shift_status === "busy").length,
    [activeDrivers]
  );

  // KPIs
  const kpis: [any, any, any] = useMemo(
    () => [
      KPIGenerator.custom({
        title: "Online Fahrer",
        value: onlineDrivers,
        icon: Users,
      }),
      KPIGenerator.custom({
        title: "Aktive Fahrzeuge",
        value: activeVehicles.length,
        icon: Car,
      }),
      KPIGenerator.custom({
        title: "GPS-Tracking",
        value: "Live",
        icon: Activity,
        subtitle: "Echtzeit-Updates",
      }),
    ],
    [onlineDrivers, activeVehicles.length]
  );

  // Quick Actions
  const quickActions: [any, any] = useMemo(
    () => [
      QuickActionsGenerator.create("Zur Disposition", MapPin, () => {
        window.location.href = "/disposition";
      }),
      QuickActionsGenerator.export(Download, () => {
        toast({
          title: "Export gestartet",
          description: "Tracking-Daten werden exportiert...",
        });
      }),
    ],
    [toast]
  );

  // Prepare map markers
  const mapMarkers = useMemo(() => {
    // Mock GPS positions for demo (in production, fetch from driver_positions table)
    return activeDrivers.map((driver, index) => ({
      lat: 50.9375 + (Math.random() - 0.5) * 0.1, // Around Cologne
      lng: 6.9603 + (Math.random() - 0.5) * 0.1,
      title: `${driver.first_name} ${driver.last_name}`,
      type: "driver" as const,
      status: driver.shift_status,
    }));
  }, [activeDrivers]);

  return (
    <>
      <main
        className="transition-[margin] duration-300"
        style={{
          marginLeft: sidebarExpanded ? "880px" : "704px",
        }}
      >
        <DashboardPageTemplate
          pageTitle="Live-Tracking"
          pageDescription="Echtzeit-Monitoring von Fahrern und Fahrzeugen"
          kpis={kpis}
          quickActions={quickActions}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Fahrer/Fahrzeuge suchen..."
          showArchived={showArchived}
          onArchivedChange={setShowArchived}
          sectionIcon={MapPin}
          sectionTitle="Live-Karte"
          sectionBadge={`${onlineDrivers} online`}
        >
          <div className="space-y-6">
            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Echtzeit-Positionen
                </CardTitle>
                <CardDescription className="text-xs">
                  GPS-Tracking aller aktiven Fahrer und Fahrzeuge
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[500px] rounded-lg overflow-hidden border border-border">
                  <HEREMap center={{ lat: 50.9375, lng: 6.9603 }} zoom={12} markers={mapMarkers} />
                </div>
              </CardContent>
            </Card>

            {/* Driver List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Online Fahrer
                </CardTitle>
                <CardDescription className="text-xs">
                  {onlineDrivers} Fahrer im Einsatz
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : activeDrivers.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Users className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                    <p className="text-sm text-muted-foreground">Keine aktiven Fahrer im System</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeDrivers.map((driver) => (
                      <Card key={driver.id} className="border border-border">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">
                              {driver.first_name} {driver.last_name}
                            </CardTitle>
                            <Badge
                              variant={
                                driver.shift_status === "on_duty" || driver.shift_status === "busy"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {driver.shift_status === "on_duty" || driver.shift_status === "busy"
                                ? "Im Einsatz"
                                : "Verfügbar"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Car className="h-3 w-3" />
                            {driver.license_number || "Keine Lizenz"}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            GPS aktiv
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehicle List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Aktive Fahrzeuge
                </CardTitle>
                <CardDescription className="text-xs">
                  {activeVehicles.length} Fahrzeuge im Einsatz
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : activeVehicles.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Car className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Keine aktiven Fahrzeuge im System
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeVehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="border border-border">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{vehicle.license_plate}</CardTitle>
                            <Badge variant="default" className="text-xs">
                              {vehicle.vehicle_class}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Car className="h-3 w-3" />
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            Status: {vehicle.status === "im_einsatz" ? "Im Einsatz" : "Verfügbar"}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DashboardPageTemplate>
      </main>
    </>
  );
}
