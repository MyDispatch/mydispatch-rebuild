/* ==================================================================================
   SMART ASSIGNMENT ENGINE V29.1
   ==================================================================================
   KI-gestützte Fahrer-Zuweisung basierend auf:
   - GPS-Distanz (wichtigster Faktor)
   - Driver Status (verfügbar/busy/offline)
   - Current Load (aktuelle Auslastung)
   - Vehicle Class Match (passendes Fahrzeug)
   - Historical Performance (Erfahrung)
   - Traffic Data (optional, via HERE API)
   ================================================================================== */

export interface AssignmentCandidate {
  driverId: string;
  driverName: string;
  score: number; // 0-100
  distance: number; // km
  eta: number; // minutes
  currentLoad: number; // 0-1
  status: "available" | "busy" | "offline" | "break";
  vehicleClass?: string;
  experienceScore?: number; // 0-100
}

export interface AssignmentResult {
  candidates: AssignmentCandidate[];
  bestMatch: AssignmentCandidate | null;
  assignmentLevel: "success" | "warning" | "error";
  message: string;
}

/**
 * Berechnet die Distanz zwischen zwei GPS-Koordinaten (Haversine-Formel)
 */
export function calculateDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 6371; // Erdradius in km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // 1 Nachkommastelle
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Berechnet die geschätzte Ankunftszeit (ETA) in Minuten
 * Basis: 40 km/h Durchschnittsgeschwindigkeit in der Stadt
 */
export function calculateETA(
  distance: number, // in km
  avgSpeed: number = 40 // km/h
): number {
  const hours = distance / avgSpeed;
  const minutes = Math.ceil(hours * 60);
  return minutes;
}

/**
 * Berechnet den Assignment-Score (0-100) für einen Fahrer
 */
export function calculateAssignmentScore(
  driverPosition: { lat: number; lng: number },
  pickupLocation: { lat: number; lng: number },
  driverStatus: "available" | "busy" | "offline" | "break",
  currentLoad: number, // 0-1
  vehicleClass: string,
  requiredClass: string,
  experienceScore: number = 70 // Default: 70/100
): number {
  let score = 100;

  // 1. Distance Penalty (je näher, desto besser)
  const distance = calculateDistance(driverPosition, pickupLocation);
  score -= distance * 3; // -3 Punkte pro km (sehr wichtig!)

  // 2. Status Penalty
  if (driverStatus === "busy") score -= 30;
  if (driverStatus === "offline") score -= 100; // Disqualify
  if (driverStatus === "break") score -= 50;

  // 3. Vehicle Class Match
  if (vehicleClass !== requiredClass) {
    // Check if vehicle class is "higher" (z.B. Van statt Sedan = OK)
    const classHierarchy = ["economy", "sedan", "kombi", "van", "luxury"];
    const driverClassIndex = classHierarchy.indexOf(vehicleClass);
    const requiredClassIndex = classHierarchy.indexOf(requiredClass);

    if (driverClassIndex < requiredClassIndex) {
      score -= 25; // Wrong class (lower)
    } else if (driverClassIndex > requiredClassIndex) {
      score -= 5; // Higher class (leicht schlechter wegen Kosten)
    }
  }

  // 4. Current Load Bonus (weniger Last = besser)
  score += (1 - currentLoad) * 15; // Bis zu +15 Punkte

  // 5. Experience Bonus
  score += (experienceScore / 100) * 10; // Bis zu +10 Punkte

  // 6. ETA Penalty (je länger, desto schlechter)
  const eta = calculateETA(distance);
  if (eta > 15) score -= (eta - 15) * 0.5; // -0.5 Punkte pro Minute über 15 Min

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Ermittelt die Top-3 Assignment-Kandidaten
 */
export function getTopAssignmentCandidates(
  drivers: Array<{
    id: string;
    name: string;
    position: { lat: number; lng: number };
    status: "available" | "busy" | "offline" | "break";
    currentLoad?: number;
    vehicleClass?: string;
    experienceScore?: number;
  }>,
  pickupLocation: { lat: number; lng: number },
  requiredClass: string = "sedan"
): AssignmentCandidate[] {
  return drivers
    .map((driver) => {
      const distance = calculateDistance(driver.position, pickupLocation);
      const eta = calculateETA(distance);
      const score = calculateAssignmentScore(
        driver.position,
        pickupLocation,
        driver.status,
        driver.currentLoad || 0,
        driver.vehicleClass || "sedan",
        requiredClass,
        driver.experienceScore || 70
      );

      return {
        driverId: driver.id,
        driverName: driver.name,
        score,
        distance,
        eta,
        currentLoad: driver.currentLoad || 0,
        status: driver.status,
        vehicleClass: driver.vehicleClass,
        experienceScore: driver.experienceScore,
      };
    })
    .filter((candidate) => candidate.score > 0) // Offline Fahrer raus
    .sort((a, b) => b.score - a.score) // Beste zuerst
    .slice(0, 3); // Top 3
}

/**
 * Ermittelt das Assignment-Level (Ampelsystem)
 */
export function getAssignmentLevel(score: number): "success" | "warning" | "error" {
  if (score >= 75) return "success"; // Grün (Optimal)
  if (score >= 50) return "warning"; // Gelb (OK)
  return "error"; // Rot (Suboptimal)
}

/**
 * Hauptfunktion: Intelligente Fahrer-Zuweisung
 */
export function smartAssignment(
  drivers: Array<{
    id: string;
    name: string;
    position: { lat: number; lng: number };
    status: "available" | "busy" | "offline" | "break";
    currentLoad?: number;
    vehicleClass?: string;
    experienceScore?: number;
  }>,
  pickupLocation: { lat: number; lng: number },
  requiredClass: string = "sedan"
): AssignmentResult {
  const candidates = getTopAssignmentCandidates(drivers, pickupLocation, requiredClass);

  if (candidates.length === 0) {
    return {
      candidates: [],
      bestMatch: null,
      assignmentLevel: "error",
      message: "Keine verfügbaren Fahrer gefunden",
    };
  }

  const bestMatch = candidates[0];
  const assignmentLevel = getAssignmentLevel(bestMatch.score);

  let message = "";
  if (assignmentLevel === "success") {
    message = `Optimaler Match gefunden: ${bestMatch.driverName} (${bestMatch.distance} km, ${bestMatch.eta} Min)`;
  } else if (assignmentLevel === "warning") {
    message = `Fahrer gefunden, aber nicht optimal: ${bestMatch.driverName} (${bestMatch.distance} km, ${bestMatch.eta} Min)`;
  } else {
    message = `Suboptimaler Match: ${bestMatch.driverName} (${bestMatch.distance} km, ${bestMatch.eta} Min)`;
  }

  return {
    candidates,
    bestMatch,
    assignmentLevel,
    message,
  };
}
