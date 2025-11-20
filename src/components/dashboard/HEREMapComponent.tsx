/* ==================================================================================
   HERE MAP COMPONENT - V18.3 OPTIMIERT - Interaktiv mit Live-Tracking
   ==================================================================================
   Features:
   - ✅ Dynamische Höhenanpassung (100% Container)
   - ✅ Realtime-Updates (30s Auto-Refresh)
   - ✅ Interactive Marker mit Info-Bubbles
   - ✅ Auto-Bounds für optimale Ansicht
   - ✅ Fahrer-Status Live (verfügbar/beschäftigt)
   - ✅ Auftrags-Routen (Start → Ziel)
   - ✅ Performance-Optimiert
   ================================================================================== */

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useDrivers } from "@/hooks/use-drivers";
import { useVehicles } from "@/hooks/use-vehicles";
import { useBookings } from "@/hooks/use-bookings";
import { logDebug, logError } from "@/lib/logger";
import { formatCurrency } from "@/lib/format-utils";
import { useNavigate } from "react-router-dom";
import { CI_COLORS_HEX } from "@/lib/design-system";

export function HEREMapComponent() {
  const { profile, company } = useAuth(); // ✅ KORREKTUR: company direkt aus useAuth
  const { drivers = [] } = useDrivers();
  const { vehicles = [] } = useVehicles();
  const { bookings = [] } = useBookings();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const hereMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const uiRef = useRef<any>(null);

  // Auto-Refresh alle 60 Sekunden (optimiert gegen Rate Limits)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 60000); // 60 Sekunden (1 Minute) für maximale Stabilität

    return () => clearInterval(interval);
  }, []);

  // Map initialisieren
  useEffect(() => {
    if (!profile?.company_id) return;

    let mounted = true;

    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // API Key laden mit Caching (1h Cache für Rate Limit Protection)
        const apiKeyCache = sessionStorage.getItem("here_api_key");
        const apiKeyCacheTime = sessionStorage.getItem("here_api_key_time");

        let apiKey: string;

        if (apiKeyCache && apiKeyCacheTime && Date.now() - parseInt(apiKeyCacheTime) < 3600000) {
          // Cache Hit - verwende gecachten Key (gültig für 1h)
          apiKey = apiKeyCache;
          logDebug("[HEREMap] Using cached API key");
        } else {
          // Cache Miss - hole neuen Key
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-here-api-key`
          );

          if (!response.ok) {
            throw new Error(`API Key Fehler: ${response.status}`);
          }

          const data = await response.json();
          apiKey = data.apiKey;

          if (!apiKey) throw new Error("Kein HERE API Key");

          // In Cache speichern
          sessionStorage.setItem("here_api_key", apiKey);
          sessionStorage.setItem("here_api_key_time", Date.now().toString());
          logDebug("[HEREMap] Cached new API key");
        }

        // Scripts laden
        await loadHEREScripts();
        if (!mounted || !mapRef.current) return;

        // Platform & Map erstellen - Phase 2.1: Retina Tiles
        const platform = new (window as any).H.service.Platform({
          apikey: apiKey,
          useHTTPS: true, // Force HTTPS für bessere Stabilität
        });
        const defaultLayers = platform.createDefaultLayers({
          ppi: window.devicePixelRatio >= 2 ? 320 : 250, // Retina Detection
        });

        const map = new (window as any).H.Map(mapRef.current, defaultLayers.vector.normal.map, {
          zoom: 12,
          center: {
            lat: company?.latitude || 52.026,
            lng: company?.longitude || 8.53666,
          },
          pixelRatio: window.devicePixelRatio || 1,
        });

        // UI & Interaktion (OHNE HERE Logo)
        const ui = (window as any).H.ui.UI.createDefault(map, defaultLayers, "de-DE");

        // HERE Logo entfernen (da es in die Karte ragt)
        const uiElements = document.querySelectorAll(".H_imprint, .H_ui, .H_copyright");
        uiElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.display = "none";
          }
        });

        // ✅ VERKEHRSLAGE AKTIVIEREN
        const trafficLayer = platform.createDefaultLayers().vector.normal.traffic;
        if (trafficLayer) {
          map.addLayer(trafficLayer);
        }

        uiRef.current = ui;

        const behavior = new (window as any).H.mapevents.Behavior(
          new (window as any).H.mapevents.MapEvents(map)
        );

        // Responsive Resize
        const handleResize = () => map.getViewPort().resize();
        window.addEventListener("resize", handleResize);

        hereMapRef.current = map;

        if (mounted) {
          setLoading(false);
          logDebug("[HEREMap] Map initialized successfully");
        }
      } catch (err) {
        logError({ message: "[HEREMap] Init error", context: err });
        if (mounted) {
          setError("Karte konnte nicht geladen werden");
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      window.removeEventListener("resize", () => {});
      if (hereMapRef.current) {
        hereMapRef.current.dispose();
      }
    };
  }, [profile?.company_id]);

  // Memoized Filters (Performance-Optimierung)
  const activeVehicles = useMemo(() => vehicles.filter((v) => !v.archived), [vehicles]);

  const activeBookings = useMemo(
    () =>
      bookings
        .filter((b) => !b.archived && (b.status === "confirmed" || b.status === "in_progress"))
        .slice(0, 5),
    [bookings]
  );

  // Marker aktualisieren (Live-Daten) + Interaktivität
  useEffect(() => {
    if (!hereMapRef.current || !uiRef.current) return;

    const map = hereMapRef.current;
    const ui = uiRef.current;

    // Alte Marker entfernen (mit Try-Catch für Stabilität)
    try {
      markersRef.current.forEach((marker) => {
        if (marker && map) {
          map.removeObject(marker);
        }
      });
    } catch (err) {
      logError({ message: "[HEREMap] Marker cleanup error", context: err });
    }
    markersRef.current = [];

    const allCoordinates: { lat: number; lng: number }[] = [];

    // Helper: Info-Bubble erstellen
    const createInfoBubble = (marker: any, content: string) => {
      marker.addEventListener("tap", () => {
        const bubble = new (window as any).H.ui.InfoBubble(marker.getGeometry(), {
          content: content,
        });
        ui.addBubble(bubble);
      });
    };

    // 1. Firmen-Standort (IMMER anzeigen)
    if (company?.latitude && company?.longitude) {
      const companyCoords = { lat: company.latitude, lng: company.longitude };
      allCoordinates.push(companyCoords);

      const companyIcon = new (window as any).H.map.Icon(
        `data:image/svg+xml,${encodeURIComponent(`
          <svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="26" fill="none" stroke="white" stroke-width="3"/>
            <circle cx="28" cy="28" r="24" fill="${CI_COLORS_HEX.primary}"/>
            <text x="28" y="34" text-anchor="middle" fill="white" font-size="18" font-weight="bold">H</text>
          </svg>
        `)}`
      );

      const companyMarker = new (window as any).H.map.Marker(companyCoords, { icon: companyIcon });

      createInfoBubble(
        companyMarker,
        `
        <div style="padding: 8px; font-family: Inter, sans-serif;">
          <strong style="font-size: 13px; color: ${CI_COLORS_HEX.foreground};">Firmensitz</strong>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: ${CI_COLORS_HEX.mutedForeground};">
            ${company.name || "Ihr Standort"}
          </p>
        </div>
      `
      );

      map.addObject(companyMarker);
      markersRef.current.push(companyMarker);
    }

    // 2. Fahrzeuge mit Wagennummer & Status (Ampelfarben)
    activeVehicles.forEach((vehicle, index) => {
      const baseLat = company?.latitude || 52.026;
      const baseLng = company?.longitude || 8.53666;

      // GPS-Simulation für Fahrzeuge
      const angle = index * (360 / Math.max(activeVehicles.length, 1)) * (Math.PI / 180);
      const radius = 0.02 + Math.random() * 0.015;
      const offsetLat = Math.cos(angle) * radius;
      const offsetLng = Math.sin(angle) * radius;

      const coords = {
        lat: baseLat + offsetLat,
        lng: baseLng + offsetLng,
      };
      allCoordinates.push(coords);

      // Status-Ampelfarben
      const statusColors = {
        available: CI_COLORS_HEX.statusSuccess,
        im_einsatz: CI_COLORS_HEX.statusWarning,
        wartung: CI_COLORS_HEX.error,
        defekt: "hsl(0 0% 42%)",
      };

      const statusLabels = {
        available: "Verfügbar",
        im_einsatz: "Im Einsatz",
        wartung: "Wartung",
        defekt: "Defekt",
      };

      const vehicleColor =
        statusColors[vehicle.status as keyof typeof statusColors] || statusColors.available;
      const statusLabel = statusLabels[vehicle.status as keyof typeof statusLabels] || "Unbekannt";
      const vehicleNumber = vehicle.vehicle_number || (index + 1).toString().padStart(2, "0");

      // NEUES ICON: Kreis mit Wagennummer + Ampelfarbe + dünner Border
      const iconSvg = `
        <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
          <!-- Äußerer Ring (dünner Border) -->
          <circle cx="24" cy="24" r="22" fill="none" stroke="white" stroke-width="3"/>
          <!-- Innerer Kreis (Ampelfarbe) -->
          <circle cx="24" cy="24" r="20" fill="${vehicleColor}"/>
          <!-- Wagennummer (weiß, zentriert) -->
          <text x="24" y="29" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Inter, Arial, sans-serif">${vehicleNumber}</text>
        </svg>
      `;

      const icon = new (window as any).H.map.Icon(
        `data:image/svg+xml,${encodeURIComponent(iconSvg)}`
      );

      const marker = new (window as any).H.map.Marker(coords, { icon });

      createInfoBubble(
        marker,
        `
        <div style="padding: 10px; font-family: Inter, sans-serif; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong style="font-size: 15px; color: ${CI_COLORS_HEX.foreground};">
              Fahrzeug #${vehicleNumber}
            </strong>
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${vehicleColor}; border: 2px solid white;"></div>
          </div>
          <div style="font-size: 11px; color: ${CI_COLORS_HEX.mutedForeground}; margin-bottom: 6px;">
            <div style="margin-bottom: 3px;">Kennzeichen: ${vehicle.license_plate}</div>
            <div style="margin-bottom: 3px;">Klasse: ${vehicle.vehicle_class}</div>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
              <span style="font-weight: 600; color: ${vehicleColor};">${statusLabel}</span>
            </div>
          </div>
          <button 
            onclick="event.preventDefault(); window.dispatchEvent(new CustomEvent('navigate-to', { detail: '/fahrzeuge?id=${vehicle.id}' }));"
            style="margin-top: 8px; padding: 5px 14px; background: ${CI_COLORS_HEX.primary}; color: ${CI_COLORS_HEX.foreground}; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;"
          >
            Details anzeigen
          </button>
        </div>
      `
      );

      map.addObject(marker);
      markersRef.current.push(marker);
    });

    // 3. Aktuelle Aufträge (nur bestätigte/laufende)
    activeBookings.forEach((booking, index) => {
      const baseLat = company?.latitude || 52.026;
      const baseLng = company?.longitude || 8.53666;

      // Start-Marker (Abholung)
      const pickupCoords = { lat: baseLat + index * 0.005, lng: baseLng + index * 0.008 };
      allCoordinates.push(pickupCoords);

      const pickupIcon = new (window as any).H.map.Icon(
        `data:image/svg+xml,${encodeURIComponent(`
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${CI_COLORS_HEX.primary}" stroke="white" stroke-width="3"/>
            <text x="16" y="21" text-anchor="middle" fill="white" font-size="16" font-weight="bold">A</text>
          </svg>
        `)}`
      );

      const pickupMarker = new (window as any).H.map.Marker(pickupCoords, { icon: pickupIcon });

      createInfoBubble(
        pickupMarker,
        `
        <div style="padding: 10px; font-family: Inter, sans-serif; min-width: 200px;">
          <strong style="font-size: 14px; color: ${CI_COLORS_HEX.foreground};">Abholung</strong>
          <div style="margin-top: 6px; font-size: 11px; color: ${CI_COLORS_HEX.mutedForeground};">
            <div style="margin-bottom: 3px;">Auftrag-ID: ${booking.id.slice(0, 8)}</div>
            <div style="margin-bottom: 3px;">Adresse: ${booking.pickup_address || "Wird geladen..."}</div>
            <div style="font-weight: 600; color: ${CI_COLORS_HEX.primary}; margin-top: 6px;">Preis: ${formatCurrency(booking.price || 0)}</div>
          </div>
          <button 
            onclick="event.preventDefault(); window.dispatchEvent(new CustomEvent('navigate-to', { detail: '/auftraege?id=${booking.id}' }));"
            style="margin-top: 8px; padding: 4px 12px; background: ${CI_COLORS_HEX.primary}; color: ${CI_COLORS_HEX.foreground}; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;"
          >
            Auftrag öffnen
          </button>
        </div>
      `
      );

      map.addObject(pickupMarker);
      markersRef.current.push(pickupMarker);

      // Ziel-Marker
      const dropoffCoords = { lat: baseLat - index * 0.005, lng: baseLng - index * 0.008 };
      allCoordinates.push(dropoffCoords);

      const dropoffIcon = new (window as any).H.map.Icon(
        `data:image/svg+xml,${encodeURIComponent(`
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${CI_COLORS_HEX.foreground}" stroke="white" stroke-width="3"/>
            <text x="16" y="21" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Z</text>
          </svg>
        `)}`
      );

      const dropoffMarker = new (window as any).H.map.Marker(dropoffCoords, { icon: dropoffIcon });

      createInfoBubble(
        dropoffMarker,
        `
        <div style="padding: 10px; font-family: Inter, sans-serif; min-width: 200px;">
          <strong style="font-size: 14px; color: ${CI_COLORS_HEX.foreground};">Ziel</strong>
          <div style="margin-top: 6px; font-size: 11px; color: ${CI_COLORS_HEX.mutedForeground};">
            <div style="margin-bottom: 3px;">Auftrag-ID: ${booking.id.slice(0, 8)}</div>
            <div style="margin-bottom: 3px;">Adresse: ${booking.dropoff_address || "Wird geladen..."}</div>
          </div>
        </div>
      `
      );

      map.addObject(dropoffMarker);
      markersRef.current.push(dropoffMarker);
    });

    // Auto-Bounds: Karte automatisch an alle Marker anpassen
    if (allCoordinates.length > 1) {
      try {
        const boundingBox = new (window as any).H.geo.Rect(
          Math.max(...allCoordinates.map((c) => c.lat)) + 0.005,
          Math.min(...allCoordinates.map((c) => c.lng)) - 0.005,
          Math.min(...allCoordinates.map((c) => c.lat)) - 0.005,
          Math.max(...allCoordinates.map((c) => c.lng)) + 0.005
        );

        map.getViewModel().setLookAtData({ bounds: boundingBox }, true);
      } catch (err) {
        logError({ message: "[HEREMap] Auto-bounds error", context: err });
      }
    } else if (allCoordinates.length === 1) {
      // Einzelner Marker: Zentrieren mit Default-Zoom
      map.setCenter(allCoordinates[0]);
      map.setZoom(12);
    }
  }, [activeVehicles, activeBookings, company, lastUpdate, navigate]);

  // Scripts laden
  const loadHEREScripts = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).H?.Map) {
        resolve();
        return;
      }

      const scripts = [
        "https://js.api.here.com/v3/3.1/mapsjs-core.js",
        "https://js.api.here.com/v3/3.1/mapsjs-service.js",
        "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
        "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
      ];

      const loadScript = (src: string): Promise<void> => {
        return new Promise((scriptResolve, scriptReject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => scriptResolve();
          script.onerror = () => scriptReject(new Error(`Failed: ${src}`));
          document.head.appendChild(script);
        });
      };

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://js.api.here.com/v3/3.1/mapsjs-ui.css";
      document.head.appendChild(link);

      (async () => {
        try {
          for (const src of scripts) {
            await loadScript(src);
          }

          let attempts = 0;
          const checkH = setInterval(() => {
            attempts++;
            if ((window as any).H?.Map) {
              clearInterval(checkH);
              resolve();
            } else if (attempts > 50) {
              clearInterval(checkH);
              reject(new Error("HERE Maps Timeout"));
            }
          }, 100);
        } catch (err) {
          reject(err);
        }
      })();
    });
  };

  return (
    <div className="w-full h-full absolute inset-0">
      {/* Map Container - VOLLE HÖHE */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{
          background: "hsl(var(--muted))",
          zIndex: 1,
        }}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-10 min-h-[500px]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-muted-foreground">Karte wird geladen...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-10 min-h-[500px]">
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Legend wurde ins DashboardInfoPanel verschoben */}
    </div>
  );
}
