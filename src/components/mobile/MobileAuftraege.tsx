/* ==================================================================================
   MOBILE-OPTIMIERTE AUFTRÄGE-ANSICHT V18.3 - MIT GRID-LAYOUT
   ==================================================================================
   Verwendet MobileGridLayout für standardisierte Struktur
   ================================================================================== */

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { MobileGridLayout } from './MobileGridLayout';
import { MobileBookingCard } from './MobileBookingCard';

interface Booking {
  id: string;
  booking_number: string;
  customer_name?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  pickup_address?: string;
  dropoff_address?: string;
  pickup_datetime: string;
  status: string;
  price?: number;
}

interface MobileAuftraegeProps {
  bookings: Booking[];
  isLoading: boolean;
  onCreateNew: () => void;
  onBookingClick: (booking: Booking) => void;
  onRefresh: () => void;
}

export function MobileAuftraege({
  bookings,
  isLoading,
  onCreateNew,
  onBookingClick,
  onRefresh
}: MobileAuftraegeProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter !== 'all' && booking.status !== activeFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const customerName = booking.customer_name || 
        `${booking.customer_first_name || ''} ${booking.customer_last_name || ''}`.trim();
      
      return (
        booking.booking_number.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        booking.pickup_address?.toLowerCase().includes(query) ||
        booking.dropoff_address?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  const filters = [
    { id: 'all', label: 'Alle', count: statusCounts.all },
    { id: 'auftraege', label: 'Aufträge', count: statusCounts.all - bookings.filter(b => b.status === 'pending').length },
    { id: 'angebote', label: 'Angebote', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'pending', label: 'Offen', count: statusCounts.pending },
    { id: 'confirmed', label: 'Bestätigt', count: statusCounts.confirmed },
    { id: 'in_progress', label: 'Aktiv', count: statusCounts.in_progress },
    { id: 'completed', label: 'Abgeschlossen', count: statusCounts.completed },
  ];

  return (
    <MobileGridLayout<Booking>
      searchPlaceholder="Suchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredBookings}
      renderCard={(booking) => (
        <MobileBookingCard
          booking={booking}
          onClick={() => onBookingClick(booking)}
        />
      )}
      onItemClick={onBookingClick}
      entityLabel={{ singular: 'Auftrag', plural: 'Aufträge' }}
      fabLabel="Neuer Auftrag"
      onFabClick={onCreateNew}
      fabIcon={Plus}
      emptyStateProps={{
        icon: <Search className="h-16 w-16" />,
        noDataTitle: 'Keine Aufträge',
        noDataDescription: 'Erstelle deinen ersten Auftrag',
        noResultsTitle: 'Keine Ergebnisse',
        noResultsDescription: 'Versuche einen anderen Suchbegriff'
      }}
    />
  );
}
