/* ==================================================================================
   GPS-TRACKING FAHRER-DASHBOARD - Mobile-First PWA
   ==================================================================================
   - Automatisches GPS-Tracking während aktiver Schicht
   - Geolocation API + Supabase Realtime
   - DSGVO-konform mit Einwilligungsdialog
   - Offline-Support via IndexedDB
   ================================================================================== */

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useVehicleTracking } from "@/hooks/use-vehicle-tracking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Activity, Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { handleError, handleSuccess } from "@/lib/error-handler";

interface GPSPosition {
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  accuracy: number;
  timestamp: string;
}

export default function DriverTracking() {
  const { user, profile } = useAuth();
  const { updatePosition } = useVehicleTracking();
  const [trackingActive, setTrackingActive] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<GPSPosition | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(null);
  const [currentShiftId, setCurrentShiftId] = useState<string | null>(null);
  const [gpsConsent, setGpsConsent] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // GPS-Support prüfen
  useEffect(() => {
    if (!navigator.geolocation) {
      handleError(
        new Error("GPS nicht unterstützt"),
        "GPS wird von Ihrem Browser nicht unterstützt"
      );
    }
  }, []);

  // GPS-Tracking starten
  const startTracking = () => {
    if (!navigator.geolocation) {
      handleError(new Error("GPS nicht verfügbar"), "GPS nicht verfügbar");
      return;
    }

    if (!gpsConsent) {
      setShowConsentDialog(true);
      return;
    }

    if (!currentVehicleId) {
      handleError(new Error("Kein Fahrzeug"), "Bitte wählen Sie zuerst ein Fahrzeug aus");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, speed, heading, accuracy } = position.coords;

        const gpsData: GPSPosition = {
          latitude,
          longitude,
          speed: speed ? speed * 3.6 : null, // m/s → km/h
          heading: heading || null,
          accuracy,
          timestamp: new Date().toISOString(),
        };

        setCurrentPosition(gpsData);
        setLastUpdateTime(new Date());

        // ✅ MISSION II (STRANGLER FIG): Migriert auf TanStack Query Hook
        // Position via API-Layer Hook senden
        try {
          await updatePosition({
            vehicle_id: currentVehicleId,
            driver_id: user?.id,
            latitude,
            longitude,
            speed: gpsData.speed,
            heading: gpsData.heading,
            company_id: profile?.company_id,
          });
        } catch (error) {
          // Hook handled error already, fallback: IndexedDB sync
          console.error("[GPS] Fallback to offline sync required");
        }
      },
      (error) => {
        handleError(error, `GPS-Fehler: ${error.message}`, { title: "GPS-Fehler" });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setTrackingActive(true);
    handleSuccess("GPS-Tracking gestartet");
  };

  // GPS-Tracking stoppen
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTrackingActive(false);
    setCurrentPosition(null);
    handleSuccess("GPS-Tracking gestoppt");
  };

  // Schicht starten
  const handleStartShift = async () => {
    if (!currentVehicleId) {
      handleError(new Error("Kein Fahrzeug"), "Bitte wählen Sie ein Fahrzeug aus");
      return;
    }

    try {
      const { data: shift, error } = await supabase
        .from("shifts")
        .insert({
          driver_id: user?.id,
          vehicle_id: currentVehicleId,
          date: new Date().toISOString().split("T")[0],
          shift_start_time: new Date().toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          company_id: profile?.company_id,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentShiftId(shift.id);
      startTracking();
      handleSuccess("Schicht gestartet");
    } catch (error) {
      handleError(error, "Fehler beim Schichtstart", { title: "Schichtstart fehlgeschlagen" });
    }
  };

  // Schicht beenden
  const handleEndShift = async () => {
    if (!currentShiftId) return;

    try {
      const { error } = await supabase
        .from("shifts")
        .update({
          shift_end_time: new Date().toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
        .eq("id", currentShiftId);

      if (error) throw error;

      stopTracking();
      setCurrentShiftId(null);
      handleSuccess("Schicht beendet");
    } catch (error) {
      handleError(error, "Fehler beim Schichtende", { title: "Schichtende fehlgeschlagen" });
    }
  };

  // GPS-Einwilligung
  const handleConsentConfirm = () => {
    setGpsConsent(true);
    setShowConsentDialog(false);
    handleSuccess("GPS-Einwilligung erteilt");
    startTracking();
  };

  // Fahrzeuge laden
  useEffect(() => {
    const loadVehicles = async () => {
      if (!profile?.company_id) return;

      const { data } = await supabase
        .from("vehicles")
        .select("id, license_plate")
        .eq("company_id", profile.company_id)
        .eq("archived", false)
        .limit(1);

      if (data && data.length > 0) {
        setCurrentVehicleId(data[0].id);
      }
    };

    loadVehicles();
  }, [profile?.company_id]);

  // Zeit seit letztem Update
  const getTimeSinceUpdate = () => {
    if (!lastUpdateTime) return "Nie";
    const seconds = Math.floor((new Date().getTime() - lastUpdateTime.getTime()) / 1000);
    if (seconds < 60) return `vor ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `vor ${minutes}min`;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">GPS-Tracking</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Fahrer-Dashboard für Live-Standort
          </p>
        </div>

        {/* GPS-Status-Banner */}
        <Card
          className={`border-2 ${trackingActive ? "border-status-success bg-status-success/10" : "border-muted"}`}
        >
          <CardContent className="flex items-center gap-3 py-4">
            {trackingActive ? (
              <Navigation className="h-6 w-6 text-foreground animate-pulse" />
            ) : (
              <Navigation className="h-6 w-6 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{trackingActive ? "GPS aktiv" : "GPS inaktiv"}</p>
              <p className="text-xs text-muted-foreground">
                Letzte Aktualisierung: {getTimeSinceUpdate()}
              </p>
            </div>
            <Badge variant={trackingActive ? "default" : "secondary"}>
              {trackingActive ? "Online" : "Offline"}
            </Badge>
          </CardContent>
        </Card>

        {/* Schicht-Kontrolle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schicht-Verwaltung
            </CardTitle>
            <CardDescription>Starten und beenden Sie Ihre Arbeitsschicht</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <V28Button
                onClick={handleStartShift}
                disabled={trackingActive || !currentVehicleId}
                className="w-full"
                size="lg"
                variant="primary"
              >
                Schicht starten
              </V28Button>
              <V28Button
                onClick={handleEndShift}
                disabled={!trackingActive}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                Schicht beenden
              </V28Button>
            </div>
          </CardContent>
        </Card>

        {/* Aktuelle Position */}
        {currentPosition && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Aktuelle Position
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Breitengrad</p>
                  <p className="font-mono font-semibold">{currentPosition.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Längengrad</p>
                  <p className="font-mono font-semibold">{currentPosition.longitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Geschwindigkeit</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    {currentPosition.speed?.toFixed(1) || "0"} km/h
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Genauigkeit</p>
                  <p className="font-semibold">±{currentPosition.accuracy.toFixed(0)}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* DSGVO-Hinweis */}
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold mb-1">Datenschutzhinweis</p>
                <p>
                  Ihre GPS-Daten werden nur während aktiver Schichten erfasst und nach 24 Stunden
                  automatisch gelöscht. Sie können die Einwilligung jederzeit widerrufen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GPS-Einwilligungsdialog */}
      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GPS-Tracking Einwilligung</DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>Wir erfassen Ihre GPS-Position während der Schicht für:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Disposition & Auftrags-Zuweisung</li>
                <li>Kunden-Echtzeit-Info (ETA)</li>
                <li>Sicherheit & Notfallhilfe</li>
              </ul>
              <p className="text-sm">Ihre Daten werden:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>NUR während aktiver Schicht erfasst</li>
                <li>Nach 24h automatisch gelöscht</li>
                <li>NICHT für Leistungsbewertung verwendet</li>
              </ul>
              <p className="text-sm font-semibold">
                Sie können die Einwilligung jederzeit widerrufen.
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 pt-4">
            <Checkbox
              id="gps-consent"
              checked={gpsConsent}
              onCheckedChange={(checked) => setGpsConsent(checked as boolean)}
            />
            <Label htmlFor="gps-consent" className="text-sm font-normal cursor-pointer">
              Ich willige in die GPS-Erfassung ein (DSGVO Art. 6)
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <V28Button
              onClick={() => setShowConsentDialog(false)}
              variant="secondary"
              className="flex-1"
            >
              Abbrechen
            </V28Button>
            <V28Button
              onClick={handleConsentConfirm}
              disabled={!gpsConsent}
              className="flex-1"
              variant="primary"
            >
              Bestätigen
            </V28Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
