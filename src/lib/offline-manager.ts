/* ==================================================================================
   OFFLINE MANAGER - SERVICE WORKER INTEGRATION
   ==================================================================================
   Phase 2.2: Mobile-First UX - Offline-Modus Vorbereitung
   - Cache kritische Fahrer-Daten
   - Offline-Indicator
   - Sync bei Verbindungs-Wiederherstellung
   ================================================================================== */

interface DriverData {
  driverId: string;
  bookings: unknown[];
  stats: any;
  cachedAt: string;
}

const CACHE_NAME = 'driver-data-v1';
const CACHE_DURATION = 3600000; // 1 hour

/**
 * Cache Driver Data für Offline-Nutzung
 */
export const cacheDriverData = async (driverId: string, data: DriverData): Promise<void> => {
  if (!('caches' in window)) {
    console.warn('Cache API not available');
    return;
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const cacheData = {
      ...data,
      cachedAt: new Date().toISOString()
    };
    
    const response = new Response(JSON.stringify(cacheData), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put(`/driver/${driverId}`, response);
  } catch (error) {
    console.error('Failed to cache driver data:', error);
  }
};

/**
 * Load Cached Driver Data
 */
export const getCachedDriverData = async (driverId: string): Promise<DriverData | null> => {
  if (!('caches' in window)) return null;

  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(`/driver/${driverId}`);
    
    if (!response) return null;
    
    const data: DriverData = await response.json();
    
    // Check if cache is still valid (1h)
    const cacheAge = Date.now() - new Date(data.cachedAt).getTime();
    if (cacheAge > CACHE_DURATION) {
      await cache.delete(`/driver/${driverId}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get cached driver data:', error);
    return null;
  }
};

/**
 * Check Online Status
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Listen for Online/Offline Events
 */
export const setupOfflineListener = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Clear All Driver Caches
 */
export const clearDriverCache = async (): Promise<void> => {
  if (!('caches' in window)) return;
  
  try {
    await caches.delete(CACHE_NAME);
  } catch (error) {
    console.error('Failed to clear driver cache:', error);
  }
};
