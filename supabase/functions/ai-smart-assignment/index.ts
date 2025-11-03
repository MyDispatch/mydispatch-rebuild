// ==================================================================================
// AI SMART ASSIGNMENT - Intelligente Fahrer-Zuordnung für Aufträge
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Automatische Zuordnung von Fahrern zu Aufträgen basierend auf KI
// Autor: NeXify AI MASTER
// Best Practices: Error Handling, Type Safety, RLS, Logging
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SmartAssignmentInput {
  booking_id: string;
  company_id: string;
  preferred_driver_id?: string;
  assignment_criteria?: {
    proximity?: boolean;
    availability?: boolean;
    rating?: boolean;
    workload?: boolean;
  };
}

interface Driver {
  id: string;
  company_id: string;
  name: string;
  current_location?: { lat: number; lng: number };
  is_available: boolean;
  rating?: number;
  active_bookings_count: number;
  distance_to_pickup?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input: SmartAssignmentInput = await req.json();

    // Input Validation
    if (!input.booking_id || !input.company_id) {
      return new Response(
        JSON.stringify({ error: "booking_id and company_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[AI-SMART-ASSIGNMENT] Processing assignment for booking:", input.booking_id);

    // 1. Get Booking Details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", input.booking_id)
      .eq("company_id", input.company_id)
      .eq("archived", false)
      .single();

    if (bookingError || !booking) {
      console.error("[AI-SMART-ASSIGNMENT] Booking not found:", bookingError);
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Get Available Drivers
    const { data: drivers, error: driversError } = await supabase
      .from("drivers")
      .select("*")
      .eq("company_id", input.company_id)
      .eq("archived", false)
      .eq("is_active", true);

    if (driversError) {
      console.error("[AI-SMART-ASSIGNMENT] Error fetching drivers:", driversError);
      throw driversError;
    }

    if (!drivers || drivers.length === 0) {
      return new Response(
        JSON.stringify({ error: "No available drivers found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Get Active Bookings Count for each driver
    const driverIds = drivers.map(d => d.id);
    const { data: activeBookings } = await supabase
      .from("bookings")
      .select("driver_id")
      .eq("company_id", input.company_id)
      .eq("archived", false)
      .in("status", ["pending", "assigned", "in_progress"])
      .in("driver_id", driverIds);

    const bookingsByDriver = (activeBookings || []).reduce((acc, b) => {
      if (b.driver_id) acc[b.driver_id] = (acc[b.driver_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 4. Calculate Scores for each Driver
    const criteria = input.assignment_criteria || {
      proximity: true,
      availability: true,
      rating: true,
      workload: true,
    };

    const scoredDrivers: (Driver & { score: number })[] = drivers.map(driver => {
      let score = 0;

      // Availability Score (0-30 points)
      if (criteria.availability && driver.is_available) {
        score += 30;
      }

      // Rating Score (0-25 points)
      if (criteria.rating && driver.rating) {
        score += (driver.rating / 5) * 25;
      }

      // Workload Score (0-25 points) - Lower is better
      const workload = bookingsByDriver[driver.id] || 0;
      if (criteria.workload) {
        score += Math.max(0, 25 - (workload * 5));
      }

      // Proximity Score (0-20 points) - If location data available
      if (criteria.proximity && driver.current_location && booking.pickup_lat && booking.pickup_lng) {
        const distance = calculateDistance(
          driver.current_location.lat,
          driver.current_location.lng,
          booking.pickup_lat,
          booking.pickup_lng
        );
        score += Math.max(0, 20 - (distance / 10)); // Max 20 points, decreases by distance
      }

      return {
        ...driver,
        active_bookings_count: workload,
        score,
      };
    });

    // 5. Sort by Score
    scoredDrivers.sort((a, b) => b.score - a.score);

    // 6. Check if preferred driver is available
    if (input.preferred_driver_id) {
      const preferredDriver = scoredDrivers.find(d => d.id === input.preferred_driver_id);
      if (preferredDriver && preferredDriver.is_available) {
        console.log("[AI-SMART-ASSIGNMENT] Using preferred driver:", preferredDriver.id);
        return new Response(
          JSON.stringify({
            success: true,
            assigned_driver_id: preferredDriver.id,
            driver: {
              id: preferredDriver.id,
              name: preferredDriver.name,
              score: preferredDriver.score,
            },
            alternatives: scoredDrivers.slice(0, 3).map(d => ({
              id: d.id,
              name: d.name,
              score: d.score,
            })),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }
    }

    // 7. Assign Best Driver
    const bestDriver = scoredDrivers[0];
    if (!bestDriver || !bestDriver.is_available) {
      return new Response(
        JSON.stringify({ error: "No suitable driver available" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 8. Update Booking
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        driver_id: bestDriver.id,
        status: "assigned",
        assigned_at: new Date().toISOString(),
      })
      .eq("id", input.booking_id)
      .eq("company_id", input.company_id);

    if (updateError) {
      console.error("[AI-SMART-ASSIGNMENT] Error updating booking:", updateError);
      throw updateError;
    }

    console.log("[AI-SMART-ASSIGNMENT] Successfully assigned driver:", bestDriver.id);

    return new Response(
      JSON.stringify({
        success: true,
        assigned_driver_id: bestDriver.id,
        driver: {
          id: bestDriver.id,
          name: bestDriver.name,
          score: bestDriver.score,
          rating: bestDriver.rating,
          active_bookings_count: bestDriver.active_bookings_count,
        },
        alternatives: scoredDrivers.slice(1, 4).map(d => ({
          id: d.id,
          name: d.name,
          score: d.score,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[AI-SMART-ASSIGNMENT] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper: Calculate Distance (Haversine Formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
