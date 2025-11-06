/* ==================================================================================
   GOOGLE MAPS API CONFIGURATION - V26.1.1
   ==================================================================================
   - Google Maps JavaScript API v3
   - Google Places API
   - Google Geocoding API
   - Fallback für HERE Maps bei Rate Limits
   ================================================================================== */

import { handleError } from '@/lib/error-handler';

// Google API Credentials (wird dynamisch via Edge Function geladen)
let GOOGLE_API_KEY_CACHE: string | null = null;
let API_KEY_TIMESTAMP: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 Stunde

/**
 * Lädt Google Maps API Key via Edge Function aus Secrets mit Caching
 */
export const getGoogleApiKey = async (): Promise<string> => {
  const now = Date.now();
  
  // Cache prüfen (1 Stunde gültig)
  if (GOOGLE_API_KEY_CACHE && (now - API_KEY_TIMESTAMP) < CACHE_DURATION) {
    return GOOGLE_API_KEY_CACHE;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-google-maps-key`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    GOOGLE_API_KEY_CACHE = data.apiKey;
    API_KEY_TIMESTAMP = now;
    return data.apiKey;
  } catch (error) {
    handleError(
      error as Error,
      'Google API Key konnte nicht geladen werden',
      { title: 'Google Maps API Fehler' }
    );
    throw new Error('Google API Key konnte nicht geladen werden');
  }
};

/**
 * Lädt die Google Maps API Script
 */
export const loadGoogleMapsScript = async (): Promise<void> => {
  // Prüfen ob bereits geladen
  if (window.google?.maps) {
    return;
  }

  const apiKey = await getGoogleApiKey();
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Warten auf google.maps Objekt
      const checkGoogle = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogle);
          resolve();
        }
      }, 50);

      setTimeout(() => {
        clearInterval(checkGoogle);
        if (window.google?.maps) {
          resolve();
        } else {
          reject(new Error('Google Maps nicht vollständig initialisiert'));
        }
      }, 3000);
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
      };

    document.head.appendChild(script);
  });
};

/**
 * Typen für TypeScript
 */
export interface GoogleMarker {
  lat: number;
  lng: number;
  label?: string;
  color?: string;
  data?: any;
}
