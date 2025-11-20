/* ==================================================================================
   USE STATISTICS HOOK V28.2.19
   ==================================================================================
   Zentrale Hook für Dashboard-Statistiken
   Verwendet in QuickActionsOverlay und Dashboard
   ================================================================================== */

import { useBookings } from "./use-bookings";
import { useDrivers } from "./use-drivers";
import { useVehicles } from "./use-vehicles";

export interface DashboardStats {
  pending_bookings: number;
  available_drivers: number;
  available_vehicles: number;
  revenue_today: number;
  bookings_today: number;
  vehicles_in_use: number;
}

export function useStatistics(): { stats: DashboardStats; isLoading: boolean } {
  const { bookings, isLoading: bookingsLoading } = useBookings();
  const { drivers, isLoading: driversLoading } = useDrivers();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();

  const today = new Date();
  const todayBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.created_at);
    return (
      bookingDate.getDate() === today.getDate() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getFullYear() === today.getFullYear()
    );
  });

  const stats: DashboardStats = {
    pending_bookings: bookings.filter((b) => b.status === "pending").length,
    available_drivers: drivers.filter((d) => !d.archived && d.shift_status === "available").length,
    available_vehicles: vehicles.filter((v) => !v.archived && v.status === "available").length,
    revenue_today: todayBookings.reduce((sum, b) => sum + (b.price || 0), 0),
    bookings_today: todayBookings.length,
    vehicles_in_use: vehicles.filter((v) => !v.archived && v.status === "im_einsatz").length,
  };

  return {
    stats,
    isLoading: bookingsLoading || driversLoading || vehiclesLoading,
  };
}
