/* ==================================================================================
   TRACKING V38.0 - GOLDEN TEMPLATE ENFORCEMENT
   ==================================================================================
   ✅ StandardPageLayout
   ✅ KPI-Cards mit StatCard
   ✅ NO UniversalExportBar (Real-time System)
   ✅ Mobile: MobileTracking Component
   ✅ HERE Maps Integration (PRESERVED!)
   ✅ V28.1 Design System
   ================================================================================== */

import { useState, useMemo, useEffect } from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { StatCard } from '@/components/smart-templates/StatCard';
import { MobileTracking } from '@/components/mobile/MobileTracking';
import { useTouchTargetValidation } from '@/hooks/validation/useTouchTargetValidation';
import { useDeviceType } from '@/hooks/use-device-type';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useDrivers } from '@/hooks/use-drivers';
import { useVehicles } from '@/hooks/use-vehicles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Car, Activity, Navigation } from 'lucide-react';
import { HEREMap } from '@/components/maps/HEREMap';
import { useToast } from '@/hooks/use-toast';

export default function Tracking() {
  useTouchTargetValidation();
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { isMobile } = useDeviceType();

  // Authentication Guard - KRITISCH für Sicherheit!
  useEffect(() => {
    if (!loading && !profile) {
      navigate('/auth', { replace: true });
    }
  }, [loading, profile, navigate]);
  
  // Data hooks
  const { drivers, isLoading: driversLoading } = useDrivers();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();

  const isLoading = driversLoading || vehiclesLoading;

  // Filter active drivers/vehicles
  const activeDrivers = useMemo(() => 
    drivers?.filter(d => 
      (d.shift_status === 'on_duty' || d.shift_status === 'busy') && 
      !d.archived &&
      (searchTerm === '' || 
       d.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       d.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [],
    [drivers, searchTerm]
  );

  const activeVehicles = useMemo(() => 
    vehicles?.filter(v => 
      v.status === 'im_einsatz' && 
      !v.archived &&
      (searchTerm === '' || 
       v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [],
    [vehicles, searchTerm]
  );

  const onlineDrivers = useMemo(() => 
    activeDrivers.filter(d => d.shift_status === 'on_duty' || d.shift_status === 'busy').length,
    [activeDrivers]
  );

  // KPIs - Migrated to StatCard
  const kpis = useMemo(() => [
    {
      label: 'Online Fahrer',
      value: onlineDrivers.toString(),
      icon: Users,
    },
    {
      label: 'Aktive Fahrzeuge',
      value: activeVehicles.length.toString(),
      icon: Car,
    },
    {
      label: 'GPS-Tracking',
      value: 'Live',
      icon: Activity,
    },
  ], [onlineDrivers, activeVehicles.length]);

  // Prepare map markers
  const mapMarkers = useMemo(() => {
    // Mock GPS positions for demo (in production, fetch from driver_positions table)
    return activeDrivers.map((driver, index) => ({
      lat: 50.9375 + (Math.random() - 0.5) * 0.1, // Around Cologne
      lng: 6.9603 + (Math.random() - 0.5) * 0.1,
      title: `${driver.first_name} ${driver.last_name}`,
      type: 'driver' as const,
      status: driver.shift_status,
    }));
  }, [activeDrivers]);

  // Mobile View
  if (isMobile) {
    return (
      <StandardPageLayout
        title="Tracking - MyDispatch"
        description="Echtzeit GPS-Tracking von Fahrern und Fahrzeugen"
        canonical="/tracking"
        subtitle="Live GPS-Tracking"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Fahrer durchsuchen..."
      >
        {/* KPIs für Mobile */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {kpis.map((kpi, index) => (
            <StatCard
              key={index}
              label={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
            />
          ))}
        </div>

        <MobileTracking
          drivers={activeDrivers.map(driver => ({
            ...driver,
            last_position: {
              lat: 50.9375 + (Math.random() - 0.5) * 0.1,
              lng: 6.9603 + (Math.random() - 0.5) * 0.1,
            },
            current_location: 'GPS aktiv',
          }))}
          isLoading={isLoading}
          onDriverClick={(driver) => window.location.href = `/fahrer/${driver.id}`}
          onRefresh={() => window.location.reload()}
        />
      </StandardPageLayout>
    );
  }

  // Desktop View
  return (
    <StandardPageLayout
      title="Tracking - MyDispatch"
      description="Echtzeit GPS-Tracking von Fahrern und Fahrzeugen"
      canonical="/tracking"
      subtitle="Live GPS-Tracking und Fahrzeugmonitoring"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Fahrer/Fahrzeuge suchen..."
      cardTitle="GPS-Tracking"
      cardIcon={<MapPin className="h-5 w-5" />}
    >
      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {kpis.map((kpi, index) => (
          <StatCard
            key={index}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
          />
        ))}
      </div>
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
              <HEREMap
                center={{ lat: 50.9375, lng: 6.9603 }}
                zoom={12}
                markers={mapMarkers}
              />
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
                          variant={driver.shift_status === 'on_duty' || driver.shift_status === 'busy' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {driver.shift_status === 'on_duty' || driver.shift_status === 'busy' ? 'Im Einsatz' : 'Verfügbar'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Car className="h-3 w-3" />
                        {driver.license_number || 'Keine Lizenz'}
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
                <p className="text-sm text-muted-foreground">Keine aktiven Fahrzeuge im System</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="border border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">
                          {vehicle.license_plate}
                        </CardTitle>
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
                        Status: {vehicle.status === 'im_einsatz' ? 'Im Einsatz' : 'Verfügbar'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StandardPageLayout>
  );
}
