/* ==================================================================================
   CANONICAL DASHBOARD TYPES - V50.2 TYPESCRIPT FIX
   ==================================================================================
   ✅ Single source of truth for all dashboard statistics
   ✅ ALL fields are REQUIRED (not optional)
   ✅ Consistent structure across the application
   ✅ Default values for safe rendering
   ================================================================================== */

export interface DashboardStats {
  // Core statistics - all REQUIRED
  bookings_today: number;
  revenue_today: number;
  new_customers_today: number;
  new_customers_7d: number; // Actual 7-day customer count from database
  total_vehicles: number;
  vehicles_in_use: number; // RESTORED: Still used in components
  bookings_this_week: number;
  revenue_this_week: number;
  bookings_this_month: number;
  revenue_this_month: number;
  active_drivers: number;
  conversion_rate: number;
  customer_rating: number;
  avg_trip_duration: number;
  active_partners: number;
  repeat_customer_rate: number; // RESTORED: Still used in advanced analytics
  efficiency_score: number; // RESTORED: Still used in performance metrics
  
  // Trend data - all REQUIRED with consistent structure
  bookings_trend: { value: number; direction: 'up' | 'down' };
  revenue_trend: { value: number; direction: 'up' | 'down' };
  drivers_trend: { value: number; direction: 'up' | 'down' };
  conversion_trend: { value: number; direction: 'up' | 'down' }; // RESTORED: Still used in analytics
  rating_trend: { value: number; direction: 'up' | 'down' }; // RESTORED: Still used in quality metrics
}

// Default values for safe rendering during loading states
export const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  bookings_today: 0,
  revenue_today: 0,
  new_customers_today: 0,
  new_customers_7d: 0,
  total_vehicles: 0,
  vehicles_in_use: 0, // RESTORED with default
  bookings_this_week: 0,
  revenue_this_week: 0,
  bookings_this_month: 0,
  revenue_this_month: 0,
  active_drivers: 0,
  conversion_rate: 0,
  customer_rating: 4.5,
  avg_trip_duration: 25,
  active_partners: 0,
  repeat_customer_rate: 65, // RESTORED with realistic default
  efficiency_score: 85, // RESTORED with realistic default
  bookings_trend: { value: 0, direction: 'up' },
  revenue_trend: { value: 0, direction: 'up' },
  drivers_trend: { value: 0, direction: 'up' },
  conversion_trend: { value: 5, direction: 'up' }, // RESTORED with positive trend
  rating_trend: { value: 2, direction: 'up' } // RESTORED with positive trend
};