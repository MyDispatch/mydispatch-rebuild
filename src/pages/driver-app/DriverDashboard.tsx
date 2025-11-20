import { useState, useEffect } from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Bell,
  MapPin,
  Clock,
  Euro,
  TrendingUp,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import officialLogo from "@/assets/mydispatch-logo-official.png";
import { SEOHead } from "@/components/shared/SEOHead";
import { formatCurrency } from "@/lib/format-utils";
import { SwipeableBookingCard } from "@/components/driver/SwipeableBookingCard";
import { isOnline, setupOfflineListener } from "@/lib/offline-manager";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/error-handler";

export default function DriverDashboard() {
  const [isDriverOnline, setIsDriverOnline] = useState(false);
  const [isNetworkOnline, setIsNetworkOnline] = useState(isOnline());

  // Mock data
  const driverStats = {
    todayEarnings: 145.5,
    todayRides: 8,
    weeklyEarnings: 892.0,
    rating: 4.8,
    completionRate: 98,
  };

  const upcomingBookings: Array<{
    id: string;
    pickup: string;
    destination: string;
    time: string;
    distance: string;
    price: number;
    status: "confirmed" | "pending";
  }> = [
    {
      id: "1",
      pickup: "München Hauptbahnhof",
      destination: "Flughafen München",
      time: "14:30",
      distance: "28 km",
      price: 45.0,
      status: "confirmed" as const,
    },
    {
      id: "2",
      pickup: "Marienplatz",
      destination: "BMW Welt",
      time: "16:15",
      distance: "12 km",
      price: 25.0,
      status: "pending" as const,
    },
  ];

  // Phase 2.2: Offline-Status Monitoring
  useEffect(() => {
    const cleanup = setupOfflineListener(
      () => {
        setIsNetworkOnline(true);
        toast.success("Verbindung wiederhergestellt");
      },
      () => {
        setIsNetworkOnline(false);
        toast.error("Keine Internetverbindung");
      }
    );
    return cleanup;
  }, []);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "confirmed", // V32.5: 'confirmed' ist der korrekte BookingStatus für angenommene Aufträge
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("Auftrag angenommen");
      // Optionally reload bookings or update local state
    } catch (error) {
      handleError(error, "Fehler beim Annehmen des Auftrags");
      toast.error("Auftrag konnte nicht angenommen werden");
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled", // V32.5: 'cancelled' ist der korrekte BookingStatus für abgelehnte Aufträge
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast.info("Auftrag abgelehnt");
      // Optionally reload bookings or update local state
    } catch (error) {
      handleError(error, "Fehler beim Ablehnen des Auftrags");
      toast.error("Auftrag konnte nicht abgelehnt werden");
    }
  };

  return (
    <>
      <SEOHead
        title="Dashboard - MyDispatch Fahrer-App"
        description="Ihr Fahrer-Dashboard bei MyDispatch"
      />
      <div className="min-h-screen bg-portal-fahrer">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-glow p-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <V28Button
              variant="secondary"
              size="sm"
              className="text-foreground hover:text-foreground/80"
            >
              <Menu className="h-6 w-6" />
            </V28Button>
            <img src={officialLogo} alt="MyDispatch" className="h-10 w-auto object-contain" />
            <V28Button
              variant="secondary"
              size="sm"
              className="text-foreground hover:text-foreground/80 relative"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-status-error rounded-full" />
            </V28Button>
          </div>

          {/* Driver Profile */}
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16 border-2 border-foreground/20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                MM
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Max Mustermann</h2>
              <p className="text-muted-foreground text-sm">Fahrer seit 2024</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < Math.floor(driverStats.rating) ? "text-primary" : "text-muted-foreground/30"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-foreground text-sm font-medium">{driverStats.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Network Status Indicator */}
              {!isNetworkOnline && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <WifiOff className="h-3 w-3" />
                  Offline
                </Badge>
              )}
              <V28Button
                onClick={() => setIsDriverOnline(!isDriverOnline)}
                variant={isDriverOnline ? "primary" : "secondary"}
                className="rounded-full px-6 shadow-lg min-h-[44px]"
              >
                {isDriverOnline ? (
                  <>
                    <Wifi className="mr-2 h-4 w-4" />
                    Online
                  </>
                ) : (
                  "Offline"
                )}
              </V28Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-card backdrop-blur-sm p-3 text-center border-0">
              <Euro className="h-5 w-5 text-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Heute</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(driverStats.todayEarnings)}
              </p>
            </Card>
            <Card className="bg-card backdrop-blur-sm p-3 text-center border-0">
              <Car className="h-5 w-5 text-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Fahrten</p>
              <p className="text-lg font-bold text-foreground">{driverStats.todayRides}</p>
            </Card>
            <Card className="bg-card backdrop-blur-sm p-3 text-center border-0">
              <TrendingUp className="h-5 w-5 text-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Woche</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(driverStats.weeklyEarnings)}
              </p>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Upcoming Bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Anstehende Aufträge</h3>
              <Badge variant="secondary">{upcomingBookings.length} Aufträge</Badge>
            </div>

            {/* Phase 2.2: Swipeable Cards */}
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <SwipeableBookingCard
                  key={booking.id}
                  booking={booking}
                  onAccept={handleAcceptBooking}
                  onDecline={handleDeclineBooking}
                />
              ))}
            </div>
          </div>

          {/* Performance Card */}
          <Card className="p-5 bg-gradient-to-br from-card to-primary/5 border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Ihre Leistung</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Abschlussrate</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-status-success h-2 rounded-full transition-all"
                      style={{ width: `${driverStats.completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {driverStats.completionRate}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bewertung</p>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < Math.floor(driverStats.rating) ? "text-primary" : "text-muted-foreground"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground">{driverStats.rating}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
