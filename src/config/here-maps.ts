/* ==================================================================================
   HERE MAPS API CONFIGURATION - V18.2.9
   ==================================================================================
   - HERE Maps API v3.1 (Interactive Maps, Routing, Traffic)
   - HERE Geocoding API v7
   - HERE Autosuggest API v7
   - 250.000 Transaktionen/Monat GRATIS
   ================================================================================== */

import { handleError } from "@/lib/error-handler";

// HERE API Credentials (wird dynamisch via Edge Function geladen)
let HERE_API_KEY_CACHE: string | null = null;
let API_KEY_TIMESTAMP: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 Stunde

/**
 * Lädt HERE API Key via Edge Function aus Secrets mit Caching gegen Rate Limits
 */
export const getHereApiKey = async (): Promise<string> => {
  const now = Date.now();

  // Cache prüfen (1 Stunde gültig)
  if (HERE_API_KEY_CACHE && now - API_KEY_TIMESTAMP < CACHE_DURATION) {
    return HERE_API_KEY_CACHE;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-here-api-key`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    HERE_API_KEY_CACHE = data.apiKey;
    API_KEY_TIMESTAMP = now;
    return data.apiKey;
  } catch (error) {
    handleError(error as Error, "HERE API Key konnte nicht geladen werden", {
      title: "HERE Maps API Fehler",
    });
    throw new Error("HERE API Key konnte nicht geladen werden");
  }
};

export const HERE_API_KEY = ""; // Wird dynamisch via getHereApiKey() geladen

// HERE Maps API v3.1 Script-URLs
const HERE_CORE_SCRIPT = "https://js.api.here.com/v3/3.1/mapsjs-core.js";
const HERE_SERVICE_SCRIPT = "https://js.api.here.com/v3/3.1/mapsjs-service.js";
const HERE_UI_SCRIPT = "https://js.api.here.com/v3/3.1/mapsjs-ui.js";
const HERE_MAPEVENTS_SCRIPT = "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js";
const HERE_CLUSTERING_SCRIPT = "https://js.api.here.com/v3/3.1/mapsjs-clustering.js";

// HERE Maps CSS
const HERE_UI_CSS = "https://js.api.here.com/v3/3.1/mapsjs-ui.css";

/**
 * Lädt die HERE Maps API v3.1 Scripts
 * Retry-Logik für robuste Verbindung
 */
export const loadHereMapsScript = (retryCount = 0): Promise<void> => {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 15000;

  return new Promise((resolve, reject) => {
    // Prüfen ob bereits geladen
    if (window.H?.map?.Map && window.H?.service && window.H?.ui) {
      resolve();
      return;
    }

    // Prüfen ob Scripts bereits existieren
    const existingScript = document.querySelector('script[src*="here.com"]');
    if (existingScript) {
      // Warten auf Ladung
      const checkInterval = setInterval(() => {
        if (window.H?.map?.Map && window.H?.service && window.H?.ui) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 200);

      const timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.H?.map?.Map) {
          if (retryCount < MAX_RETRIES) {
            document.querySelectorAll('script[src*="here.com"]').forEach((s) => s.remove());
            document.querySelectorAll('link[href*="here.com"]').forEach((l) => l.remove());
            loadHereMapsScript(retryCount + 1)
              .then(resolve)
              .catch(reject);
          } else {
            handleError(new Error("HERE Maps API Timeout"), "Karte konnte nicht geladen werden", {
              title: "Maps API Fehler",
            });
            reject(new Error("HERE Maps API Timeout"));
          }
        }
      }, TIMEOUT_MS);

      return;
    }

    // API Key wird dynamisch via Edge Function geladen - keine Prüfung hier

    // CSS laden
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = HERE_UI_CSS;
    document.head.appendChild(link);

    // Scripts sequenziell laden (Reihenfolge wichtig!)
    const scripts = [
      HERE_CORE_SCRIPT,
      HERE_SERVICE_SCRIPT,
      HERE_UI_SCRIPT,
      HERE_MAPEVENTS_SCRIPT,
      HERE_CLUSTERING_SCRIPT,
    ];

    let loadedCount = 0;
    const timeoutId = setTimeout(() => {
      scripts.forEach((src) => {
        document.querySelector(`script[src="${src}"]`)?.remove();
      });

      if (retryCount < MAX_RETRIES) {
        loadHereMapsScript(retryCount + 1)
          .then(resolve)
          .catch(reject);
      } else {
        handleError(new Error("HERE Maps Laden Timeout"), "Karte konnte nicht geladen werden", {
          title: "Maps API Fehler",
        });
        reject(new Error("HERE Maps API Timeout"));
      }
    }, TIMEOUT_MS);

    const loadScript = (src: string): Promise<void> => {
      return new Promise((scriptResolve, scriptReject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = false; // Sequenzielles Laden!
        script.defer = true;

        script.onload = () => scriptResolve();
        script.onerror = () => scriptReject(new Error(`Failed to load ${src}`));

        document.head.appendChild(script);
      });
    };

    // Sequenziell laden
    (async () => {
      try {
        for (const src of scripts) {
          await loadScript(src);
          loadedCount++;
        }

        clearTimeout(timeoutId);

        // Warten auf H-Objekt
        const checkH = setInterval(() => {
          if (window.H?.map?.Map && window.H?.service && window.H?.ui) {
            clearInterval(checkH);
            resolve();
          }
        }, 50);

        setTimeout(() => {
          clearInterval(checkH);
          if (window.H?.map?.Map) {
            resolve();
          } else {
            reject(new Error("HERE Maps nicht vollständig initialisiert"));
          }
        }, 2000);
      } catch (error) {
        clearTimeout(timeoutId);
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            loadHereMapsScript(retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, 1000);
        } else {
          handleError(error as Error, "Karte konnte nicht geladen werden", {
            title: "Maps API Fehler",
          });
          reject(error);
        }
      }
    })();
  });
};

/**
 * Erstellt eine HERE Platform Instanz (mit dynamischem API Key)
 */
export const createHerePlatform = async () => {
  if (!window.H) {
    throw new Error("HERE Maps API nicht geladen");
  }

  const apiKey = await getHereApiKey();

  return new window.H.service.Platform({
    apikey: apiKey,
  });
};

/**
 * Erstellt Standard-Map-Layers
 */
export const getDefaultLayers = (platform: H.service.Platform) => {
  return platform.createDefaultLayers();
};

/**
 * Typen für TypeScript
 */
declare global {
  interface Window {
    H: typeof H;
  }
}

export interface HereMarker {
  lat: number;
  lng: number;
  label?: string;
  color?: string;
  data?: any;
}
