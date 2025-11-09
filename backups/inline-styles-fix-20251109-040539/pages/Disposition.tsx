/* ==================================================================================
   DISPOSITION - Live-Auftragsdisposition V28.1 (HARMONISIERT)
   ==================================================================================
   ✅ PHASE 7: Auf StandardPageLayout migriert
   ✅ Konsistent mit /rechnungen-Referenz
   ✅ StatCard-Pattern für KPIs
   ✅ Mobile-Responsive
   - Live-Auftragszuweisung
   - Fahrer- und Fahrzeugstatus
   - Echtzeit-Updates
   ================================================================================== */

import { useState, useMemo } from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { StatCard } from '@/components/smart-templates/StatCard';
import { useTouchTargetValidation } from '@/hooks/validation/useTouchTargetValidation';
import { useBookings } from '@/hooks/use-bookings';
import { useDrivers } from '@/hooks/use-drivers';
import { useVehicles } from '@/hooks/use-vehicles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clipboard, Users, Car, Clock, MapPin, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeBookings } from '@/hooks/use-realtime-bookings';
import { logger } from '@/lib/logger';
import { UniversalExportBar } from '@/components/dashboard/UniversalExportBar';

export default function Disposition() {
  useTouchTargetValidation();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Data hooks
  const { bookings, isLoading, updateBooking } = useBookings();
  const { drivers } = useDrivers();
  const { vehicles } = useVehicles();
  
  // Realtime updates
  useRealtimeBookings();

  // Filter bookings
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    
    return bookings.filter(booking => {
      const matchesSearch = searchTerm === '' || 
        booking.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.dropoff_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch && !booking.archived;
    });
  }, [bookings, searchTerm]);

  // Pending bookings (need assignment)
  const pendingBookings = useMemo(() => 
    filteredBookings.filter(b => b.status === 'pending' || (b.status === 'confirmed' && !b.driver_id)),
    [filteredBookings]
  );

  // Available drivers
  const availableDrivers = useMemo(() => 
    drivers?.filter(d => d.shift_status === 'available' && !d.archived) || [],
    [drivers]
  );

  // Available vehicles
  const availableVehicles = useMemo(() => 
    vehicles?.filter(v => v.status === 'available' && !v.archived) || [],
    [vehicles]
  );

  // KPIs - Konsistent mit /rechnungen
  const kpis = useMemo(() => [
    {
      label: 'Offene Aufträge',
      value: pendingBookings.length.toString(),
      icon: Clipboard,
    },
    {
      label: 'Verfügbare Fahrer',
      value: availableDrivers.length.toString(),
      icon: Users,
    },
    {
      label: 'Verfügbare Fahrzeuge',
      value: availableVehicles.length.toString(),
      icon: Car,
    },
  ], [pendingBookings.length, availableDrivers.length, availableVehicles.length]);

  // Assign driver/vehicle
  const handleAssign = async (bookingId: string, driverId?: string, vehicleId?: string) => {
    try {
      updateBooking({
        id: bookingId,
        updates: {
          driver_id: driverId || undefined,
          vehicle_id: vehicleId || undefined,
          status: driverId ? 'confirmed' : 'pending',
        },
      });
      
      toast({
        title: 'Zuweisung erfolgreich',
        description: 'Auftrag wurde zugewiesen',
      });
    } catch (error) {
      logger.error('Fehler bei Auftragszuweisung', error as Error, { 
        component: 'Disposition',
        bookingId,
        driverId,
        vehicleId
      });
      
      toast({
        title: 'Fehler',
        description: 'Auftrag konnte nicht zugewiesen werden',
        variant: 'destructive',
      });
    }
  };

  return (
    <StandardPageLayout
      title="Disposition"
      description="MyDispatch Live-Disposition: Echtzeit-Auftragszuweisung und Fahrerverwaltung für Taxi- und Mietwagenunternehmen."
      canonical="/disposition"
      subtitle="Live-Auftragsdisposition und Fahrerzuweisung"
      onCreateNew={() => window.location.href = '/auftraege'}
      createButtonLabel="Neuer Auftrag"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Aufträge durchsuchen..."
      cardTitle="Disposition-Übersicht"
      cardIcon={<Clipboard className="h-5 w-5" />}
    >
      {/* ✅ V28.1: StatCards Pattern (Golden Template - Desktop) */}
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

      {/* Export Bar */}
      <UniversalExportBar
        data={pendingBookings}
        filename={`disposition-${new Date().toISOString().split('T')[0]}`}
        showPdf={true}
        showExcel={true}
        showCsv={true}
      />

      {/* Offene Aufträge */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Lade Aufträge...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : pendingBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <Clipboard className="h-12 w-12 text-muted-foreground/50 mx-auto" />
              <h3 className="text-lg font-semibold">Keine offenen Aufträge</h3>
              <p className="text-sm text-muted-foreground">
                Alle Aufträge sind bereits zugewiesen oder es gibt keine neuen Aufträge.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pendingBookings.map((booking) => (
            <Card key={booking.id} className="border border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">
                        {booking.customer?.first_name} {booking.customer?.last_name}
                      </CardTitle>
                      <Badge variant={booking.status === 'pending' ? 'secondary' : 'default'}>
                        {booking.status === 'pending' ? 'Neu' : 'Bestätigt'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(booking.pickup_time), 'dd.MM.yyyy HH:mm', { locale: de })} Uhr
                      </div>
                    </CardDescription>
                  </div>
                  {booking.price && (
                    <div className="text-right">
                      <div className="text-lg font-bold">{booking.price.toFixed(2)} €</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Route */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs text-muted-foreground">Abholung</div>
                      <div className="break-words">{booking.pickup_address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs text-muted-foreground">Ziel</div>
                      <div className="break-words">{booking.dropoff_address}</div>
                    </div>
                  </div>
                </div>

                {/* Assignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Fahrer zuweisen</label>
                    <Select
                      value={booking.driver_id || undefined}
                      onValueChange={(value) => handleAssign(booking.id, value, booking.vehicle_id || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fahrer wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              {driver.first_name} {driver.last_name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Fahrzeug zuweisen</label>
                    <Select
                      value={booking.vehicle_id || undefined}
                      onValueChange={(value) => handleAssign(booking.id, booking.driver_id || undefined, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fahrzeug wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            <div className="flex items-center gap-2">
                              <Car className="h-3 w-3" />
                              {vehicle.license_plate}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact & Actions */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{booking.customer?.email || 'Keine Kontaktdaten'}</span>
                  </div>
                  <V28Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.location.href = `/auftraege?id=${booking.id}`}
                  >
                    Details
                  </V28Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </StandardPageLayout>
  );
}
