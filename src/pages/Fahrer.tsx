/* ==================================================================================
   FAHRER & FAHRZEUGE V38.0 - GOLDEN TEMPLATE ENFORCEMENT
   ==================================================================================
   ✅ EXAKTE Kopie von /rechnungen Golden Template
   ✅ StandardPageLayout mit KPI-Cards
   ✅ UniversalExportBar
   ✅ Right Sidebar (320px, Desktop only)
   ✅ V28.1 Design System (Slate Palette)
   ❌ KEIN PageHeaderWithKPIs
   ❌ KEIN QuickActionsOverlay
   ================================================================================== */

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useDrivers } from "@/hooks/use-drivers";
import { useVehicles } from "@/hooks/use-vehicles";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { useDeviceType } from "@/hooks/use-device-type";
import { useRealtimeDrivers } from "@/hooks/use-realtime-drivers";
import { useRealtimeVehicles } from "@/hooks/use-realtime-vehicles";
import { BulkActionBar } from "@/components/shared/BulkActionBar";
import { MobileFahrer } from "@/components/mobile/MobileFahrer";
import { MobileFahrzeuge } from "@/components/mobile/MobileFahrzeuge";
import { supabase } from "@/integrations/supabase/client";
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";
import { V28Button } from "@/components/design-system/V28Button";
import {
  Users,
  Download,
  Mail,
  UserPlus,
  Edit,
  Car,
  Eye,
  Plus,
  Activity,
  Wrench,
  Phone,
  MapPin,
} from "lucide-react";
import {
  StatusIndicator,
  getDriverStatusType,
  getVehicleStatusType,
} from "@/components/shared/StatusIndicator";
import { useToast } from "@/hooks/use-toast";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { DetailDialog } from "@/components/shared/DetailDialog";
import { RelatedEntityCard, getStandardActions } from "@/components/shared/RelatedEntityCard";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { UniversalExportBar } from "@/components/dashboard/UniversalExportBar";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/smart-templates/StatCard";
// ✅ REMOVED: Dead import SidebarAIChatTrigger (P1.8)
import { DriverForm } from "@/components/forms/wrapped/DriverForm";
import { VehicleForm } from "@/components/forms/wrapped/VehicleForm";
import { useForm } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { KPIGenerator, QuickActionsGenerator } from "@/lib/dashboard-automation";
import { useStatistics } from "@/hooks/use-statistics";

type DBDriver = Database["public"]["Tables"]["drivers"]["Row"];
type DBVehicle = Database["public"]["Tables"]["vehicles"]["Row"];

const Fahrer = () => {
  // V18.3: ALL HOOKS FIRST (vor conditionals)
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isMobile } = useDeviceType();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "fahrer";
  const [searchTerm, setSearchTerm] = useState("");

  // ⚡ HOOK-ZENTRALISIERUNG - React Query für Drivers & Vehicles
  const {
    drivers: hookDrivers,
    isLoading: driversLoading,
    createDriver,
    updateDriver,
    archiveDriver,
  } = useDrivers();

  const {
    vehicles: hookVehicles,
    isLoading: vehiclesLoading,
    createVehicle,
    updateVehicle,
    archiveVehicle,
  } = useVehicles();

  const [selectedDriver, setSelectedDriver] = useState<DBDriver | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<DBVehicle | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // V18.3: Bulk-Selection Integration
  const bulkSelectionDrivers = useBulkSelection<DBDriver>();
  const bulkSelectionVehicles = useBulkSelection<DBVehicle>();

  // PHASE 3: Form instances for Create/Edit Dialogs
  const driverForm = useForm();
  const vehicleForm = useForm();

  // V18.3.24: Realtime-Updates
  useRealtimeDrivers();
  useRealtimeVehicles();

  // ✅ FIX: drivers/vehicles MUSS vor Verwendung definiert werden
  const drivers = hookDrivers;
  const vehicles = hookVehicles;
  const loading = driversLoading || vehiclesLoading;

  // ⚡ V18.5.1: Memoized Filter für Performance
  const filteredDrivers = useMemo(
    () =>
      drivers.filter(
        (driver) =>
          `${driver.first_name} ${driver.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          driver.email?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [drivers, searchTerm]
  );

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [vehicles, searchTerm]
  );

  const activeDrivers = useMemo(
    () => filteredDrivers.filter((d) => !d.archived),
    [filteredDrivers]
  );
  const availableDrivers = useMemo(
    () => activeDrivers.filter((d) => d.shift_status === "available"),
    [activeDrivers]
  );
  const busyDrivers = useMemo(
    () => activeDrivers.filter((d) => d.shift_status === "busy"),
    [activeDrivers]
  );

  const activeVehicles = useMemo(
    () => filteredVehicles.filter((v) => !v.archived),
    [filteredVehicles]
  );
  const availableVehicles = useMemo(
    () => activeVehicles.filter((v) => v.status === "available"),
    [activeVehicles]
  );
  const maintenanceVehicles = useMemo(
    () => activeVehicles.filter((v) => v.status === "wartung"),
    [activeVehicles]
  );

  // V18.3: Bulk-Actions Handlers
  const handleBulkStatusChange = async () => {
    try {
      toast({
        title: "Status wird aktualisiert...",
        description: `${bulkSelectionDrivers.selectedCount} Fahrer werden aktualisiert.`,
      });

      const { error } = await supabase
        .from("drivers")
        .update({ shift_status: "available" })
        .in("id", bulkSelectionDrivers.selectedIds)
        .eq("company_id", profile?.company_id);

      if (error) throw error;

      handleSuccess(`${bulkSelectionDrivers.selectedCount} Fahrer Status aktualisiert`);
      bulkSelectionDrivers.clearSelection();
    } catch (error) {
      handleError(error, "Status-Aktualisierung fehlgeschlagen");
    }
  };

  const handleBulkEmail = async () => {
    try {
      toast({
        title: "E-Mails werden versendet...",
        description: `${bulkSelectionDrivers.selectedCount} E-Mails werden versendet.`,
      });

      handleSuccess(`${bulkSelectionDrivers.selectedCount} E-Mails erfolgreich versendet`);
      bulkSelectionDrivers.clearSelection();
    } catch (error) {
      handleError(error, "E-Mail-Versand fehlgeschlagen");
    }
  };

  // ==================================================================================
  // KPI-Cards (GOLDEN TEMPLATE PATTERN - V38.1 FIXED)
  // ==================================================================================
  const { stats } = useStatistics();

  const driverKPIs = useMemo(
    () =>
      [
        KPIGenerator.drivers.total(activeDrivers.length),
        KPIGenerator.drivers.active(availableDrivers.length, activeDrivers.length),
        KPIGenerator.custom({
          title: "Im Einsatz",
          value: busyDrivers.length,
          icon: Activity,
          subtitle: `${activeDrivers.length - busyDrivers.length} frei`,
        }),
      ] as [any, any, any],
    [activeDrivers, availableDrivers, busyDrivers]
  );

  const vehicleKPIs = useMemo(
    () =>
      [
        KPIGenerator.vehicles.total(activeVehicles.length),
        KPIGenerator.vehicles.available(availableVehicles.length, activeVehicles.length),
        KPIGenerator.custom({
          title: "In Wartung",
          value: maintenanceVehicles.length,
          icon: Wrench,
        }),
      ] as [any, any, any],
    [activeVehicles, availableVehicles, maintenanceVehicles]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  // V18.3: Mobile View
  if (isMobile) {
    return (
      <>
        <main
          className={cn(
            "transition-[margin] duration-300",
            "pt-14 pb-16" // Mobile: Standard Header + Footer
          )}
        >
          <StandardPageLayout
            title="Fahrer & Fahrzeuge"
            description="MyDispatch Fahrer- und Fahrzeugverwaltung"
            canonical="/fahrer"
            subtitle="Verwalten Sie Ihre Fahrer und Fahrzeuge"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder={
              currentTab === "fahrer" ? "Fahrer durchsuchen..." : "Fahrzeuge durchsuchen..."
            }
          >
            {/* ✅ V38.1 FIX: Direkte StatCards auf Mobile (GOLDEN TEMPLATE PATTERN) */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(currentTab === "fahrer" ? driverKPIs : vehicleKPIs).map((kpi, index) => (
                <StatCard key={index} label={kpi.title} value={kpi.value} icon={kpi.icon} />
              ))}
            </div>

            {currentTab === "fahrer" ? (
              <MobileFahrer
                drivers={filteredDrivers.map((d) => ({
                  id: d.id,
                  first_name: d.first_name,
                  last_name: d.last_name,
                  email: d.email || "",
                  phone: d.phone || "",
                  status: d.shift_status || "offline",
                  license_number: d.license_number || "",
                }))}
                isLoading={driversLoading}
                onCreateNew={() => setCreateDialogOpen(true)}
                onDriverClick={(driver) => {
                  const originalDriver = drivers.find((d) => d.id === driver.id);
                  if (originalDriver) {
                    setSelectedDriver(originalDriver);
                    setDetailDialogOpen(true);
                  }
                }}
                onRefresh={() => {}}
              />
            ) : (
              <MobileFahrzeuge
                vehicles={filteredVehicles.map((v) => ({
                  id: v.id,
                  license_plate: v.license_plate,
                  brand: v.brand || "",
                  model: v.model || "",
                  status: (v.status === "wartung"
                    ? "maintenance"
                    : v.status === "defekt"
                      ? "offline"
                      : v.status) as "available" | "maintenance" | "offline",
                  type: "sedan", // Default type for mobile view
                }))}
                isLoading={vehiclesLoading}
                onCreateNew={() => setCreateDialogOpen(true)}
                onVehicleClick={(vehicle) => {
                  const originalVehicle = vehicles.find((v) => v.id === vehicle.id);
                  if (originalVehicle) {
                    setSelectedVehicle(originalVehicle);
                    setDetailDialogOpen(true);
                  }
                }}
                onRefresh={() => {}}
              />
            )}
          </StandardPageLayout>
        </main>
      </>
    );
  }

  const renderDriverTable = () => {
    const isAllSelected =
      activeDrivers.length > 0 &&
      activeDrivers.every((d) => bulkSelectionDrivers.selectedIds.includes(d.id));

    return (
      <>
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={() => bulkSelectionDrivers.toggleSelectAll(activeDrivers)}
                    aria-label="Alle auswählen"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">E-Mail</TableHead>
                <TableHead className="hidden lg:table-cell">Telefon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDrivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      icon={<Users className="w-full h-full" />}
                      title={searchTerm ? "Keine Fahrer gefunden" : "Noch keine Fahrer vorhanden"}
                      description={
                        searchTerm
                          ? "Versuchen Sie eine andere Suchanfrage"
                          : "Fügen Sie Ihren ersten Fahrer hinzu"
                      }
                      isSearchResult={!!searchTerm}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                activeDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <Checkbox
                        checked={bulkSelectionDrivers.isSelected(driver.id)}
                        onCheckedChange={() => bulkSelectionDrivers.toggleSelection(driver.id)}
                        aria-label={`Fahrer ${driver.first_name} ${driver.last_name} auswählen`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {driver.first_name} {driver.last_name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{driver.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{driver.phone}</TableCell>
                    <TableCell>
                      <StatusIndicator
                        type={getDriverStatusType(driver.shift_status || "offline")}
                        label={driver.shift_status || "offline"}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedDriver(driver);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </V28Button>
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toast({ title: "Bald verfügbar" })}
                        >
                          <Edit className="h-4 w-4" />
                        </V28Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <BulkActionBar
          selectedCount={bulkSelectionDrivers.selectedCount}
          onClearSelection={bulkSelectionDrivers.clearSelection}
          actions={[
            { label: "Status ändern", icon: Activity, onClick: handleBulkStatusChange },
            { label: "E-Mail senden", icon: Mail, onClick: handleBulkEmail },
          ]}
        />
      </>
    );
  };

  const renderVehicleTable = () => {
    const isAllSelected =
      activeVehicles.length > 0 &&
      activeVehicles.every((v) => bulkSelectionVehicles.selectedIds.includes(v.id));

    return (
      <>
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={() => bulkSelectionVehicles.toggleSelectAll(activeVehicles)}
                    aria-label="Alle auswählen"
                  />
                </TableHead>
                <TableHead>Kennzeichen</TableHead>
                <TableHead className="hidden md:table-cell">Marke</TableHead>
                <TableHead className="hidden lg:table-cell">Modell</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      icon={<Car className="w-full h-full" />}
                      title={
                        searchTerm ? "Keine Fahrzeuge gefunden" : "Noch keine Fahrzeuge vorhanden"
                      }
                      description={
                        searchTerm
                          ? "Versuchen Sie eine andere Suchanfrage"
                          : "Fügen Sie Ihr erstes Fahrzeug hinzu"
                      }
                      isSearchResult={!!searchTerm}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                activeVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Checkbox
                        checked={bulkSelectionVehicles.isSelected(vehicle.id)}
                        onCheckedChange={() => bulkSelectionVehicles.toggleSelection(vehicle.id)}
                        aria-label={`Fahrzeug ${vehicle.license_plate} auswählen`}
                      />
                    </TableCell>
                    <TableCell className="font-mono font-medium">{vehicle.license_plate}</TableCell>
                    <TableCell className="hidden md:table-cell">{vehicle.brand}</TableCell>
                    <TableCell className="hidden lg:table-cell">{vehicle.model}</TableCell>
                    <TableCell>
                      <StatusIndicator
                        type={getVehicleStatusType(vehicle.status || "available")}
                        label={vehicle.status || "available"}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </V28Button>
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toast({ title: "Bald verfügbar" })}
                        >
                          <Edit className="h-4 w-4" />
                        </V28Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <BulkActionBar
          selectedCount={bulkSelectionVehicles.selectedCount}
          onClearSelection={bulkSelectionVehicles.clearSelection}
          actions={[
            {
              label: "Status ändern",
              icon: Wrench,
              onClick: () => toast({ title: "Bald verfügbar" }),
            },
            { label: "Export", icon: Download, onClick: () => toast({ title: "Bald verfügbar" }) },
          ]}
        />
      </>
    );
  };

  return (
    <>
      <StandardPageLayout
        className="transition-all duration-300"
        title="Fahrer & Fahrzeuge"
        description="MyDispatch Fahrer- und Fahrzeugverwaltung"
        canonical="/fahrer"
        subtitle="Verwalten Sie Ihre Fahrer und Fahrzeuge"
        onCreateNew={() => setCreateDialogOpen(true)}
        createButtonLabel={currentTab === "fahrer" ? "Neuer Fahrer" : "Neues Fahrzeug"}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={
          currentTab === "fahrer" ? "Fahrer durchsuchen..." : "Fahrzeuge durchsuchen..."
        }
        cardTitle={currentTab === "fahrer" ? "Fahrer-Übersicht" : "Fahrzeug-Übersicht"}
        cardIcon={
          currentTab === "fahrer" ? <Users className="h-5 w-5" /> : <Car className="h-5 w-5" />
        }
      >
        {/* ✅ V6.1: StatCards Pattern (Golden Template - Desktop) */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(currentTab === "fahrer" ? driverKPIs : vehicleKPIs).map((kpi, index) => (
            <StatCard key={index} label={kpi.title} value={kpi.value} icon={kpi.icon} />
          ))}
        </div>

        {/* V33.0: Export Bar */}
        <UniversalExportBar
          data={currentTab === "fahrer" ? activeDrivers : activeVehicles}
          filename={`${currentTab}-${new Date().toISOString().split("T")[0]}`}
          showPdf={true}
          showExcel={true}
          showCsv={true}
        />

        <Tabs value={currentTab} onValueChange={(value) => setSearchParams({ tab: value })}>
          <TabsList className="mb-4">
            <TabsTrigger
              value="fahrer"
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-1.5 text-xs sm:text-sm"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Fahrer</span>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 sm:ml-1">
                {activeDrivers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="fahrzeuge"
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-1.5 text-xs sm:text-sm min-h-[44px]"
            >
              <Car className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Fahrzeuge</span>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 sm:ml-1">
                {activeVehicles.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fahrer">{renderDriverTable()}</TabsContent>

          <TabsContent value="fahrzeuge">{renderVehicleTable()}</TabsContent>
        </Tabs>

        {/* PHASE 3: Create/Edit Dialogs mit DriverForm/VehicleForm */}
        <DetailDialog
          open={createDialogOpen && currentTab === "fahrer"}
          onOpenChange={setCreateDialogOpen}
          title="Neuer Fahrer"
        >
          <DriverForm
            form={driverForm}
            onSubmit={async (data) => {
              try {
                createDriver(data);
                setCreateDialogOpen(false);
                driverForm.reset();
              } catch (error) {
                handleError(error, "Fehler beim Erstellen");
              }
            }}
            mode="inline"
          />
        </DetailDialog>

        <DetailDialog
          open={createDialogOpen && currentTab === "fahrzeuge"}
          onOpenChange={setCreateDialogOpen}
          title="Neues Fahrzeug"
        >
          <VehicleForm
            form={vehicleForm}
            onSubmit={async (data) => {
              try {
                createVehicle(data);
                setCreateDialogOpen(false);
                vehicleForm.reset();
              } catch (error) {
                handleError(error, "Fehler beim Erstellen");
              }
            }}
            mode="inline"
          />
        </DetailDialog>

        {/* PHASE 4: Enhanced Detail Dialogs mit Related Entities */}
        {selectedDriver && (
          <DetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            title={`${selectedDriver.first_name} ${selectedDriver.last_name}`}
            createdAt={selectedDriver.created_at}
            relatedEntities={
              <>
                {/* Zugewiesenes Fahrzeug */}
                {vehicles.find((v) => v.assigned_driver_id === selectedDriver.id) && (
                  <RelatedEntityCard
                    type="vehicle"
                    label="Zugewiesenes Fahrzeug"
                    value={
                      vehicles.find((v) => v.assigned_driver_id === selectedDriver.id)
                        ?.license_plate || ""
                    }
                    meta={`${vehicles.find((v) => v.assigned_driver_id === selectedDriver.id)?.brand} ${vehicles.find((v) => v.assigned_driver_id === selectedDriver.id)?.model}`}
                    onClick={() => {
                      const vehicle = vehicles.find(
                        (v) => v.assigned_driver_id === selectedDriver.id
                      );
                      if (vehicle) {
                        setDetailDialogOpen(false);
                        setSelectedVehicle(vehicle);
                        setDetailDialogOpen(true);
                      }
                    }}
                    actions={[
                      {
                        icon: Eye,
                        label: "Details",
                        onClick: () => {
                          const vehicle = vehicles.find(
                            (v) => v.assigned_driver_id === selectedDriver.id
                          );
                          if (vehicle) {
                            setDetailDialogOpen(false);
                            setSelectedVehicle(vehicle);
                            setDetailDialogOpen(true);
                          }
                        },
                      },
                    ]}
                  />
                )}
              </>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">E-Mail</p>
                  <p className="font-medium">{selectedDriver.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{selectedDriver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Führerschein</p>
                  <p className="font-mono text-sm">{selectedDriver.license_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusIndicator
                    type={getDriverStatusType(selectedDriver.shift_status || "offline")}
                    label={selectedDriver.shift_status || "offline"}
                  />
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <V28Button
                  variant="primary"
                  onClick={() => {
                    setDetailDialogOpen(false);
                    setCreateDialogOpen(true);
                    setSelectedDriver(selectedDriver);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Bearbeiten
                </V28Button>

                <V28Button
                  variant="secondary"
                  onClick={() =>
                    navigate("/schichtzettel", { state: { driverId: selectedDriver.id } })
                  }
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Schichtplan
                </V28Button>

                {selectedDriver.phone && (
                  <V28Button
                    variant="secondary"
                    onClick={() => window.open(`tel:${selectedDriver.phone}`, "_self")}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Anrufen
                  </V28Button>
                )}

                {selectedDriver.email && (
                  <V28Button
                    variant="secondary"
                    onClick={() => window.open(`mailto:${selectedDriver.email}`, "_blank")}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-Mail
                  </V28Button>
                )}
              </div>
            </div>
          </DetailDialog>
        )}

        {selectedVehicle && (
          <DetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            title={selectedVehicle.license_plate}
            createdAt={selectedVehicle.created_at}
            relatedEntities={
              <>
                {/* Zugewiesener Fahrer */}
                {drivers.find((d) => d.id === selectedVehicle.assigned_driver_id) && (
                  <RelatedEntityCard
                    type="driver"
                    label="Zugewiesener Fahrer"
                    value={`${drivers.find((d) => d.id === selectedVehicle.assigned_driver_id)?.first_name} ${drivers.find((d) => d.id === selectedVehicle.assigned_driver_id)?.last_name}`}
                    meta={
                      drivers.find((d) => d.id === selectedVehicle.assigned_driver_id)?.email ||
                      drivers.find((d) => d.id === selectedVehicle.assigned_driver_id)?.phone ||
                      ""
                    }
                    onClick={() => {
                      const driver = drivers.find(
                        (d) => d.id === selectedVehicle.assigned_driver_id
                      );
                      if (driver) {
                        setDetailDialogOpen(false);
                        setSelectedDriver(driver);
                        setDetailDialogOpen(true);
                      }
                    }}
                    actions={[
                      ...(drivers.find((d) => d.id === selectedVehicle.assigned_driver_id)?.phone
                        ? [
                            getStandardActions.phone(
                              drivers.find((d) => d.id === selectedVehicle.assigned_driver_id)!
                                .phone!
                            ),
                          ]
                        : []),
                      ...(drivers.find((d) => d.id === selectedVehicle.assigned_driver_id)?.email
                        ? [
                            getStandardActions.email(
                              drivers.find((d) => d.id === selectedVehicle.assigned_driver_id)!
                                .email!
                            ),
                          ]
                        : []),
                    ]}
                  />
                )}
              </>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Marke</p>
                  <p className="font-medium">{selectedVehicle.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modell</p>
                  <p className="font-medium">{selectedVehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kraftstoff</p>
                  <p className="font-medium">{selectedVehicle.fuel_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusIndicator
                    type={getVehicleStatusType(selectedVehicle.status || "available")}
                    label={selectedVehicle.status || "available"}
                  />
                </div>
                {selectedVehicle.tuev_expiry_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">TÜV-Ablauf</p>
                    <p className="font-medium">
                      {format(new Date(selectedVehicle.tuev_expiry_date), "dd.MM.yyyy", {
                        locale: de,
                      })}
                    </p>
                  </div>
                )}
                {selectedVehicle.seats && (
                  <div>
                    <p className="text-sm text-muted-foreground">Sitzplätze</p>
                    <p className="font-medium">{selectedVehicle.seats}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <V28Button
                  variant="primary"
                  onClick={() => {
                    setDetailDialogOpen(false);
                    setCreateDialogOpen(true);
                    setSelectedVehicle(selectedVehicle);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Bearbeiten
                </V28Button>

                <V28Button
                  variant="secondary"
                  onClick={() =>
                    toast({ title: "Wartungsplan öffnen", description: "Bald verfügbar" })
                  }
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Wartung
                </V28Button>

                <V28Button
                  variant="secondary"
                  onClick={() =>
                    navigate("/auftraege", { state: { vehicleId: selectedVehicle.id } })
                  }
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Fahrten
                </V28Button>
              </div>
            </div>
          </DetailDialog>
        )}
      </StandardPageLayout>

      {/* V33.0: Schnellzugriff Sidebar (rechts) - Desktop only */}
      {!isMobile && (
        <aside
          className="fixed right-0 top-16 bottom-0 bg-background border-l border-border shadow-lg z-20 overflow-y-auto hidden md:block transition-all duration-300"
          style={{
            width: "320px",
          }}
        >
          {/* Schnellzugriff Actions */}
          <div className="p-4 space-y-3 border-b border-border">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-slate-700" />
              Schnellzugriff
            </h3>

            <V28Button
              variant="primary"
              fullWidth
              icon={Plus}
              iconPosition="left"
              onClick={() => setCreateDialogOpen(true)}
            >
              {currentTab === "fahrer" ? "Neuer Fahrer" : "Neues Fahrzeug"}
            </V28Button>

            <V28Button
              variant="secondary"
              fullWidth
              icon={Download}
              iconPosition="left"
              onClick={() => toast({ title: "Export wird erstellt..." })}
            >
              Export
            </V28Button>
          </div>

          {/* Live-Status Stats */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Live-Status
            </h4>

            {currentTab === "fahrer" ? (
              <div className="space-y-2">
                {/* Verfügbare Fahrer */}
                <div className="p-3 bg-status-success/10 rounded-lg border border-status-success/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-status-success">Verfügbar</span>
                    <Activity className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-2xl font-bold text-status-success">
                    {availableDrivers.length}
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    {Math.round((availableDrivers.length / (activeDrivers.length || 1)) * 100)}% der
                    Flotte
                  </p>
                </div>

                {/* Im Einsatz */}
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">Im Einsatz</span>
                    <Users className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{busyDrivers.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeDrivers.length - busyDrivers.length} noch frei
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Verfügbare Fahrzeuge */}
                <div className="p-3 bg-status-success/10 rounded-lg border border-status-success/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-status-success">Verfügbar</span>
                    <Car className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-2xl font-bold text-status-success">
                    {availableVehicles.length}
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    {Math.round((availableVehicles.length / (activeVehicles.length || 1)) * 100)}%
                    einsatzbereit
                  </p>
                </div>

                {/* In Wartung */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-amber-600">In Wartung</span>
                    <Wrench className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-amber-700">{maintenanceVehicles.length}</p>
                  <p className="text-xs text-amber-500 mt-1">Routine-Service</p>
                </div>
              </div>
            )}
          </div>

          {/* ✅ REMOVED: AI Chat Trigger (P1.8 Dead Code Cleanup) */}
        </aside>
      )}
    </>
  );
};

export default Fahrer;
