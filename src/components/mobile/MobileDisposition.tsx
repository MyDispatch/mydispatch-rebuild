/* ==================================================================================
   MOBILE DISPOSITION - Live-Auftragsdisposition für Mobile
   ==================================================================================
   ✅ MobileGridLayout Pattern
   ✅ Real-time Order Assignment
   ✅ Driver/Vehicle Selection
   ================================================================================== */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { MapPin, User, Car, Clock, Phone } from 'lucide-react';
import { MobileGridLayout } from './MobileGridLayout';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Booking {
  id: string;
  pickup_address?: string;
  dropoff_address?: string;
  pickup_time?: string;
  customer?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  driver?: {
    first_name?: string;
    last_name?: string;
  };
  vehicle?: {
    license_plate?: string;
  };
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed';
}

interface MobileDispositionProps {
  bookings: Booking[];
  isLoading: boolean;
  onBookingClick: (booking: Booking) => void;
  onRefresh: () => void;
}

export function MobileDisposition({
  bookings,
  isLoading,
  onBookingClick,
  onRefresh
}: MobileDispositionProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'pending' && booking.status !== 'pending') return false;
    if (activeFilter === 'confirmed' && booking.status !== 'confirmed') return false;
    if (activeFilter === 'in_progress' && booking.status !== 'in_progress') return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.pickup_address?.toLowerCase().includes(query) ||
        booking.dropoff_address?.toLowerCase().includes(query) ||
        booking.customer?.first_name?.toLowerCase().includes(query) ||
        booking.customer?.last_name?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
  };

  const filters = [
    { id: 'all', label: 'Alle', count: statusCounts.all },
    { id: 'pending', label: 'Offen', count: statusCounts.pending },
    { id: 'confirmed', label: 'Bestätigt', count: statusCounts.confirmed },
    { id: 'in_progress', label: 'Unterwegs', count: statusCounts.in_progress },
  ];

  const getStatusType = (status?: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'in_progress': return 'success';
      case 'completed': return 'neutral';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending': return 'Offen';
      case 'confirmed': return 'Bestätigt';
      case 'in_progress': return 'Unterwegs';
      case 'completed': return 'Abgeschlossen';
      default: return 'Unbekannt';
    }
  };

  return (
    <MobileGridLayout<Booking>
      searchPlaceholder="Aufträge durchsuchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredBookings}
      onItemClick={onBookingClick}
      entityLabel={{ singular: 'Auftrag', plural: 'Aufträge' }}
      fabLabel="Neuer Auftrag"
      onFabClick={() => {}}
      emptyStateProps={{
        icon: <MapPin className="w-full h-full" />,
        noDataTitle: 'Keine Aufträge vorhanden',
        noDataDescription: 'Es wurden noch keine Aufträge erstellt',
        noResultsTitle: 'Keine Aufträge gefunden',
        noResultsDescription: 'Versuchen Sie eine andere Suchanfrage',
      }}
      renderCard={(booking) => (
        <Card
          className="cursor-pointer hover:bg-primary/5 transition-colors"
          onClick={() => onBookingClick(booking)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">
                  {booking.customer?.first_name} {booking.customer?.last_name}
                </h3>
                <StatusIndicator
                  type={getStatusType(booking.status)}
                  label={getStatusLabel(booking.status)}
                  size="sm"
                />
              </div>
              {booking.pickup_time && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(new Date(booking.pickup_time), 'HH:mm', { locale: de })}
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              {booking.pickup_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-success-text mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 line-clamp-1">{booking.pickup_address}</span>
                </div>
              )}
              {booking.dropoff_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-error-text mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 line-clamp-1">{booking.dropoff_address}</span>
                </div>
              )}
              {booking.driver && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-slate-700">
                    {booking.driver.first_name} {booking.driver.last_name}
                  </span>
                </div>
              )}
              {booking.vehicle && (
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="text-slate-700">{booking.vehicle.license_plate}</span>
                </div>
              )}
              {booking.customer?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-slate-600 text-xs">{booking.customer.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    />
  );
}
