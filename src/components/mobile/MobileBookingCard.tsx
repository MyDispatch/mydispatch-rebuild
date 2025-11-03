import { MapPin, Calendar, User, Euro, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { formatCurrency } from '@/lib/format-utils';
import { cn } from '@/lib/utils';

interface MobileBookingCardProps {
  booking: {
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
  };
  onClick: () => void;
}

const statusConfig = {
  pending: { label: 'Ausstehend', variant: 'outline' as const },
  confirmed: { label: 'Bestätigt', variant: 'default' as const },
  in_progress: { label: 'In Bearbeitung', variant: 'default' as const },
  completed: { label: 'Abgeschlossen', variant: 'secondary' as const },
  cancelled: { label: 'Storniert', variant: 'destructive' as const },
};

export function MobileBookingCard({ booking, onClick }: MobileBookingCardProps) {
  const customerName = booking.customer_name || 
    (booking.customer_first_name && booking.customer_last_name 
      ? `${booking.customer_first_name} ${booking.customer_last_name}`
      : 'Unbekannt');

  const statusInfo = statusConfig[booking.status as keyof typeof statusConfig] || {
    label: booking.status,
    variant: 'outline' as const
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-primary/5 active:scale-[0.98] transition-all duration-200 touch-manipulation"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">#{booking.booking_number}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <User className="h-4 w-4" />
            {customerName}
          </div>
        </div>
        <Badge variant={statusInfo.variant} className="text-[10px] px-2">
          {statusInfo.label}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-2 text-xs">
        {booking.pickup_address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
            <span className="line-clamp-1">{booking.pickup_address}</span>
          </div>
        )}
        {booking.dropoff_address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="line-clamp-1 text-muted-foreground">{booking.dropoff_address}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-foreground shrink-0" />
          <span>{format(new Date(booking.pickup_datetime), 'dd.MM.yyyy HH:mm', { locale: de })}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        {booking.price !== undefined && booking.price !== null ? (
          <div className="flex items-center gap-1">
            <Euro className="h-4 w-4 text-foreground" />
            <span className="text-sm font-semibold">{formatCurrency(booking.price)}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Preis ausstehend</span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Card>
  );
}
