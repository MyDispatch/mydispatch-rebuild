/* ==================================================================================
   UPCOMING BOOKINGS WIDGET - V18.3 Sprint 34
   ==================================================================================
   Nächste anstehende Aufträge mit Countdown und Quick-Actions
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/compat';
import { Badge } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/format-utils';
import { useBookings } from '@/hooks/use-bookings';
import { useMemo, useState, useEffect } from 'react';
import { format, differenceInMinutes, isToday, isTomorrow } from 'date-fns';
import { de } from 'date-fns/locale';

interface UpcomingBooking {
  id: string;
  pickup_time: string;
  pickup_address: string;
  customer_name: string;
  price: number;
  status: string;
  minutes_until: number;
}

export function UpcomingBookingsWidget() {
  const navigate = useNavigate();
  const { bookings = [] } = useBookings();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Berechne anstehende Aufträge (nächste 24h)
  const upcomingBookings = useMemo<UpcomingBooking[]>(() => {
    const now = currentTime;
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return bookings
      .filter(b => {
        if (!b.pickup_time || b.archived) return false;
        const pickupTime = new Date(b.pickup_time);
        return pickupTime >= now && pickupTime <= in24Hours && b.status !== 'cancelled';
      })
      .map(b => {
        const pickupTime = new Date(b.pickup_time!);
        // Get customer name from relationship or fallback
        const customerName = b.customer 
          ? `${b.customer.first_name || ''} ${b.customer.last_name || ''}`.trim() || 'Unbekannt'
          : 'Unbekannt';
        
        return {
          id: b.id,
          pickup_time: b.pickup_time!,
          pickup_address: b.pickup_address || 'Keine Adresse',
          customer_name: customerName,
          price: b.price || 0,
          status: b.status,
          minutes_until: differenceInMinutes(pickupTime, now),
        };
      })
      .sort((a, b) => a.minutes_until - b.minutes_until)
      .slice(0, 5);
  }, [bookings, currentTime]);

  const getTimeLabel = (pickupTime: string, minutesUntil: number) => {
    const time = new Date(pickupTime);
    
    if (minutesUntil < 60) {
      return `In ${minutesUntil} Min`;
    } else if (isToday(time)) {
      return `Heute ${format(time, 'HH:mm')}`;
    } else if (isTomorrow(time)) {
      return `Morgen ${format(time, 'HH:mm')}`;
    } else {
      return format(time, 'EEE HH:mm', { locale: de });
    }
  };

  const getUrgencyColor = (minutesUntil: number) => {
    if (minutesUntil < 30) return 'bg-status-error/10 border-status-error/30';
    if (minutesUntil < 60) return 'bg-status-warning/10 border-status-warning/30';
    return 'bg-card';
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground" />
            Anstehende Aufträge
          </CardTitle>
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-primary/10 text-foreground border-primary/30">
            24h
          </Badge>
        </div>
        <CardDescription className="text-[10px]">Nächste {upcomingBookings.length} Fahrten</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-3">
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-4">
            <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-xs text-muted-foreground">Keine anstehenden Aufträge</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer hover:bg-muted/30 ${getUrgencyColor(booking.minutes_until)}`}
                  onClick={() => navigate(`/auftraege?id=${booking.id}`)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={booking.minutes_until < 30 ? 'destructive' : booking.minutes_until < 60 ? 'secondary' : 'outline'}
                        className="text-[9px] px-1.5 py-0"
                      >
                        {getTimeLabel(booking.pickup_time, booking.minutes_until)}
                      </Badge>
                      <span className="text-[10px] font-semibold text-foreground">
                        {formatCurrency(booking.price)}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-[11px] text-muted-foreground line-clamp-1">
                        {booking.customer_name}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-[11px] text-muted-foreground line-clamp-1">
                        {booking.pickup_address}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <V28Button
              variant="secondary"
              size="sm"
              className="w-full h-7 text-xs"
              onClick={() => navigate('/auftraege')}
            >
              Alle Aufträge ansehen →
            </V28Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
