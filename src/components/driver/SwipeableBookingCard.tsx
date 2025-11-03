/* ==================================================================================
   SWIPEABLE BOOKING CARD - MOBILE-FIRST UX
   ==================================================================================
   Phase 2.2: Mobile-First UX für Fahrer
   - Swipe-Right = Annehmen
   - Swipe-Left = Ablehnen
   - Touch-optimiert (44x44px Targets)
   ================================================================================== */

import { useSwipeable } from 'react-swipeable';
import { Card, Badge } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { MapPin, Clock, Euro, CheckCircle, X } from 'lucide-react';
import { formatCurrency } from '@/lib/format-utils';
import { useState } from 'react';

interface Booking {
  id: string;
  pickup: string;
  destination: string;
  time: string;
  distance: string;
  price: number;
  status: 'confirmed' | 'pending';
}

interface SwipeableBookingCardProps {
  booking: Booking;
  onAccept: (bookingId: string) => void;
  onDecline: (bookingId: string) => void;
}

export const SwipeableBookingCard = ({ 
  booking, 
  onAccept, 
  onDecline 
}: SwipeableBookingCardProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setSwipeOffset(eventData.deltaX);
    },
    onSwipedRight: () => {
      setSwipeOffset(0);
      onAccept(booking.id);
    },
    onSwipedLeft: () => {
      setSwipeOffset(0);
      onDecline(booking.id);
    },
    trackMouse: false, // Nur Touch
    delta: 50 // Min 50px für Swipe
  });

  const backgroundColor = 
    swipeOffset > 50 ? 'rgb(34 197 94)' : // Green
    swipeOffset < -50 ? 'rgb(239 68 68)' : // Red
    'transparent';

  return (
    <div 
      {...handlers} 
      className="relative touch-pan-y"
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none',
        backgroundColor: backgroundColor + '20', // 20% opacity
        borderRadius: '0.5rem'
      }}
    >
      <Card className="p-4 bg-card border-border hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-foreground" />
              <span className="font-semibold text-foreground">{booking.time}</span>
              <Badge 
                variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {booking.status === 'confirmed' ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : null}
                {booking.status === 'confirmed' ? 'Bestätigt' : 'Ausstehend'}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground font-medium">Abholung:</span>
                <span className="text-sm text-foreground">{booking.pickup}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground font-medium">Ziel:</span>
                <span className="text-sm text-foreground">{booking.destination}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right ml-4">
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(booking.price)}
            </p>
            <p className="text-xs text-muted-foreground">{booking.distance}</p>
          </div>
        </div>

        {/* Touch-optimized Buttons (min 44x44px) */}
        <div className="flex space-x-2">
          <V28Button 
            size="lg" 
            className="flex-1 min-h-[44px] bg-green-600 hover:bg-green-700 touch-manipulation"
            onClick={() => onAccept(booking.id)}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Annehmen
          </V28Button>
          <V28Button 
            size="lg" 
            variant="secondary"
            className="flex-1 min-h-[44px] touch-manipulation"
            onClick={() => onDecline(booking.id)}
          >
            <X className="mr-2 h-5 w-5" />
            Ablehnen
          </V28Button>
        </div>

        {/* Swipe Hint */}
        {swipeOffset === 0 && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            ← Wischen zum Ablehnen | Annehmen zum Wischen →
          </p>
        )}
      </Card>
    </div>
  );
};
