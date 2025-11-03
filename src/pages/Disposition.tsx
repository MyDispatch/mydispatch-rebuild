/* ==================================================================================
   DISPOSITION - Live-Auftragsdisposition V28.1
   ==================================================================================
   - DashboardPageTemplate mit KPIGenerator & QuickActionsGenerator
   - Live-Auftragszuweisung
   - Fahrer- und Fahrzeugstatus
   - Echtzeit-Updates
   ================================================================================== */

import { useState, useMemo } from 'react';
import { DashboardPageTemplate } from '@/components/templates/DashboardPageTemplate';
import { KPIGenerator, QuickActionsGenerator } from '@/lib/dashboard-automation';
import { useTouchTargetValidation } from '@/hooks/validation/useTouchTargetValidation';
import { useBookings } from '@/hooks/use-bookings';
import { useDrivers } from '@/hooks/use-drivers';
import { useVehicles } from '@/hooks/use-vehicles';
import { useMainLayout } from '@/hooks/use-main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clipboard, Download, Users, Car, Clock, MapPin, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeBookings } from '@/hooks/use-realtime-bookings';
import { logger } from '@/lib/logger';

export default function Disposition() {
  useTouchTargetValidation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const { sidebarExpanded } = useMainLayout();
  
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
      
      const matchesArchived = showArchived ? true : !booking.archived;
      
      return matchesSearch && matchesArchived;
    });
  }, [bookings, searchTerm, showArchived]);

  // Pending bookings (need assignment)
  const pendingBookings = useMemo(() => 
    filteredBookings.filter(b => b.status === 'pending' || b.status === 'confirmed' && !b.driver_id),
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

  // KPIs
  const kpis: [any, any, any] = useMemo(() => [
    KPIGenerator.custom({
      title: 'Offene Aufträge',
      value: pendingBookings.length,
      icon: Clipboard,
    }),
    KPIGenerator.custom({
      title: 'Verfügbare Fahrer',
      value: availableDrivers.length,
      icon: Users,
    }),
    KPIGenerator.custom({
      title: 'Verfügbare Fahrzeuge',
      value: availableVehicles.length,
      icon: Car,
    }),
  ], [pendingBookings.length, availableDrivers.length, availableVehicles.length]);

  // Quick Actions
  const quickActions: [any, any] = useMemo(() => [
    QuickActionsGenerator.create(
      'Neuer Auftrag',
      Clipboard,
      () => {
        window.location.href = '/auftraege';
      }
    ),
    QuickActionsGenerator.export(
      Download,
      () => {
        toast({
          title: 'Export gestartet',
          description: 'Aufträge werden exportiert...',
        });
      }
    ),
  ], [toast]);

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
    }
  };

  return (
    <>
      <main 
        className="transition-[margin] duration-300"
        style={{
          marginLeft: sidebarExpanded ? '560px' : '384px'
        }}
      >
        <DashboardPageTemplate
      pageTitle="Disposition"
      pageDescription="Live-Auftragsdisposition und Fahrerzuweisung"
      kpis={kpis}
      quickActions={quickActions}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Aufträge durchsuchen..."
      showArchived={showArchived}
      onArchivedChange={setShowArchived}
      sectionIcon={Clipboard}
      sectionTitle="Offene Aufträge"
      sectionBadge={pendingBookings.length}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Lade Aufträge...</p>
          </div>
        </div>
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
                    <div className="flex items-center gap-2">
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
                    <MapPin className="h-4 w-4 text-slate-700 mt-0.5" />
                    <div>
                      <div className="font-medium text-xs text-muted-foreground">Abholung</div>
                      <div>{booking.pickup_address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-xs text-muted-foreground">Ziel</div>
                      <div>{booking.dropoff_address}</div>
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
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {booking.customer?.email || 'Keine Kontaktdaten'}
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
        </DashboardPageTemplate>
      </main>
    </>
  );
}
