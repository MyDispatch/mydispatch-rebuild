// ==================================================================================
// AI SMART ASSIGNMENT V18.3 - Intelligente Fahrer-Zuweisung
// ==================================================================================
// - GPS-basierte Nähe-Berechnung (Haversine-Formel)
// - Multi-Faktor-Scoring (Proximity, Availability, Workload, Rating, Experience)
// - Top 3 Vorschläge mit Confidence-Level
// - Vehicle-Match-Berücksichtigung
// ==================================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssignmentRequest {
  booking_id: string;
  pickup_location: { lat: number; lng: number };
  pickup_time: string;
  vehicle_class?: string;
  passengers: number;
  company_id: string;
}

interface DriverData {
  id: string;
  first_name: string;
  last_name: string;
  shift_status: string;
  phone?: string;
  total_rides: number;
  // GPS-Position (latest)
  last_position?: { lat: number; lng: number } | null;
  // Heute-Stats
  rides_today?: number;
}

interface VehicleData {
  id: string;
  license_plate: string;
  vehicle_class: string;
  status: string;
}

interface AssignmentRecommendation {
  driver_id: string;
  driver_name: string;
  driver_phone?: string;
  vehicle_id: string;
  vehicle_plate: string;
  score: number;
  eta_minutes: number | null;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  breakdown: {
    proximity: number;
    availability: number;
    vehicle_match: number;
    workload: number;
    rating: number;
    experience: number;
  };
}

// Haversine-Formel für Distanz-Berechnung (in km)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ETA-Berechnung (vereinfacht: 50 km/h Durchschnittsgeschwindigkeit)
function calculateETA(distanceKm: number): number {
  return Math.ceil((distanceKm / 50) * 60); // Minuten
}

// Scoring-Algorithmus
function calculateScore(
  driver: DriverData,
  vehicle: VehicleData,
  pickupLocation: { lat: number; lng: number },
  requestedVehicleClass?: string
): {
  score: number;
  breakdown: AssignmentRecommendation['breakdown'];
  eta_minutes: number | null;
} {
  let proximityScore = 0;
  let eta_minutes: number | null = null;

  // 1. Proximity (30%) - GPS-basiert
  if (driver.last_position) {
    const distanceKm = calculateDistance(
      pickupLocation.lat,
      pickupLocation.lng,
      driver.last_position.lat,
      driver.last_position.lng
    );
    eta_minutes = calculateETA(distanceKm);
    
    // Score: Maximal bei 0km, linear abfallend bis 50km
    proximityScore = Math.max(0, 100 - distanceKm * 2);
  } else {
    // Keine GPS-Position → niedrige Proximity
    proximityScore = 20;
  }

  // 2. Availability (25%)
  const availabilityScore =
    driver.shift_status === 'available' ? 100 :
    driver.shift_status === 'on_duty' ? 70 :
    driver.shift_status === 'break' ? 50 : 0;

  // 3. Vehicle Match (20%)
  const vehicleMatchScore =
    requestedVehicleClass && vehicle.vehicle_class === requestedVehicleClass
      ? 100
      : 70; // Partial match wenn nicht specified

  // 4. Workload (15%)
  const ridesToday = driver.rides_today || 0;
  const workloadScore = Math.max(0, 100 - ridesToday * 10); // -10% pro Fahrt

  // 5. Rating (5%) - Placeholder (später aus Bewertungen)
  const ratingScore = 85; // Default 85%

  // 6. Experience (5%)
  const totalRides = driver.total_rides || 0;
  const experienceScore = Math.min(100, totalRides / 2); // 100% ab 200 Fahrten

  // Gesamt-Score (gewichtet)
  const totalScore =
    proximityScore * 0.3 +
    availabilityScore * 0.25 +
    vehicleMatchScore * 0.2 +
    workloadScore * 0.15 +
    ratingScore * 0.05 +
    experienceScore * 0.05;

  return {
    score: Math.round(totalScore),
    breakdown: {
      proximity: Math.round(proximityScore),
      availability: Math.round(availabilityScore),
      vehicle_match: Math.round(vehicleMatchScore),
      workload: Math.round(workloadScore),
      rating: Math.round(ratingScore),
      experience: Math.round(experienceScore),
    },
    eta_minutes,
  };
}

// Confidence-Level basierend auf Score
function getConfidence(score: number): 'high' | 'medium' | 'low' {
  if (score >= 85) return 'high';
  if (score >= 70) return 'medium';
  return 'low';
}

// Reason-Generator
function generateReason(
  breakdown: AssignmentRecommendation['breakdown'],
  eta_minutes: number | null,
  vehicleMatch: boolean
): string {
  const reasons: string[] = [];

  if (breakdown.proximity >= 80 && eta_minutes !== null) {
    reasons.push(`Nur ${eta_minutes} Min entfernt`);
  } else if (breakdown.proximity >= 60) {
    reasons.push('Nahegelegener Standort');
  }

  if (breakdown.availability === 100) {
    reasons.push('Sofort verfügbar');
  }

  if (vehicleMatch) {
    reasons.push('Passendes Fahrzeug');
  }

  if (breakdown.workload >= 80) {
    reasons.push('Niedrige Auslastung');
  }

  if (breakdown.experience >= 80) {
    reasons.push('Erfahrener Fahrer');
  }

  if (reasons.length === 0) {
    return 'Verfügbare Option';
  }

  return reasons.slice(0, 3).join(', ');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: AssignmentRequest = await req.json();
    const {
      pickup_location,
      vehicle_class,
      passengers,
      company_id,
    } = requestData;

    console.log('[AI-Assignment] Request:', {
      pickup_location,
      vehicle_class,
      passengers,
      company_id,
    });

    // 1. Verfügbare Fahrer laden
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select('id, first_name, last_name, shift_status, phone, total_rides')
      .eq('company_id', company_id)
      .eq('archived', false)
      .in('shift_status', ['available', 'on_duty', 'break']);

    if (driversError) throw driversError;
    if (!drivers || drivers.length === 0) {
      return new Response(
        JSON.stringify({
          recommendations: [],
          message: 'Keine verfügbaren Fahrer gefunden',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. GPS-Positionen laden (letzte 5 Minuten)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: positions } = await supabase
      .from('vehicle_positions')
      .select('driver_id, latitude, longitude, timestamp')
      .eq('company_id', company_id)
      .gte('timestamp', fiveMinutesAgo)
      .order('timestamp', { ascending: false });

    // GPS-Positionen zu Fahrern zuordnen (neueste Position pro Fahrer)
    const driverPositions = new Map<string, { lat: number; lng: number }>();
    positions?.forEach((pos) => {
      if (!driverPositions.has(pos.driver_id)) {
        driverPositions.set(pos.driver_id, {
          lat: pos.latitude,
          lng: pos.longitude,
        });
      }
    });

    // 3. Heute-Stats laden (Fahrten heute)
    const today = new Date().toISOString().split('T')[0];
    const { data: todayBookings } = await supabase
      .from('bookings')
      .select('driver_id')
      .eq('company_id', company_id)
      .gte('created_at', today + 'T00:00:00')
      .not('driver_id', 'is', null);

    const ridesToday = new Map<string, number>();
    todayBookings?.forEach((booking) => {
      const driverId = booking.driver_id!;
      ridesToday.set(driverId, (ridesToday.get(driverId) || 0) + 1);
    });

    // 4. Verfügbare Fahrzeuge laden
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, license_plate, vehicle_class, status')
      .eq('company_id', company_id)
      .eq('archived', false)
      .eq('status', 'available');

    if (vehiclesError) throw vehiclesError;
    if (!vehicles || vehicles.length === 0) {
      return new Response(
        JSON.stringify({
          recommendations: [],
          message: 'Keine verfügbaren Fahrzeuge gefunden',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Scoring für alle Kombinationen
    const recommendations: AssignmentRecommendation[] = [];

    for (const driver of drivers) {
      // GPS-Position zuordnen
      const driverData: DriverData = {
        ...driver,
        last_position: driverPositions.get(driver.id) || null,
        rides_today: ridesToday.get(driver.id) || 0,
      };

      // Bestes Fahrzeug für diesen Fahrer finden
      let bestVehicle = vehicles[0]; // Fallback
      let bestVehicleScore = 0;

      for (const vehicle of vehicles) {
        const vehicleMatchScore =
          vehicle_class && vehicle.vehicle_class === vehicle_class ? 100 : 70;

        if (vehicleMatchScore > bestVehicleScore) {
          bestVehicleScore = vehicleMatchScore;
          bestVehicle = vehicle;
        }
      }

      // Scoring berechnen
      const { score, breakdown, eta_minutes } = calculateScore(
        driverData,
        bestVehicle,
        pickup_location,
        vehicle_class
      );

      recommendations.push({
        driver_id: driver.id,
        driver_name: `${driver.first_name} ${driver.last_name}`,
        driver_phone: driver.phone,
        vehicle_id: bestVehicle.id,
        vehicle_plate: bestVehicle.license_plate,
        score,
        eta_minutes,
        confidence: getConfidence(score),
        reason: generateReason(
          breakdown,
          eta_minutes,
          !vehicle_class || bestVehicle.vehicle_class === vehicle_class
        ),
        breakdown,
      });
    }

    // 6. Top 3 nach Score sortieren
    recommendations.sort((a, b) => b.score - a.score);
    const top3 = recommendations.slice(0, 3);

    console.log('[AI-Assignment] Top 3:', top3.map((r) => ({
      driver: r.driver_name,
      score: r.score,
      eta: r.eta_minutes,
    })));

    return new Response(
      JSON.stringify({
        recommendations: top3,
        total_candidates: recommendations.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[AI-Assignment] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
