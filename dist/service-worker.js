/* ==================================================================================
   SERVICE WORKER - PWA OFFLINE SUPPORT + AUTO-UPDATE
   ==================================================================================
   - Cache-First Strategy für Assets
   - Network-First für API-Calls
   - Offline GPS-Queue (IndexedDB)
   - Background Sync für GPS-Positionen
   - Auto-Update bei neuer Version
   ================================================================================== */

const CACHE_VERSION = 'v18.3.0'; // ⭐ FORCE UPDATE - White Screen Fix
const CACHE_NAME = `mydispatch-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  // '/favicon.png', // Temporarily disabled until asset is added
  '/icon-192.png',
  '/icon-512.png',
];

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing version', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Sofort aktivieren (Auto-Update)
  self.skipWaiting();
});

// Activate Event - Clean ALL caches + Force Reload
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating version', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // DELETE ALL CACHES (nicht nur mydispatch-*)
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[Service Worker] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Force reload aller Clients
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          console.log('[Service Worker] Force reloading client');
          client.navigate(client.url);
        });
      });
    })
  );
  
  self.clients.claim();
});

// Fetch Event - Optimized caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Network-First for API calls
  if (url.pathname.includes('/api/') || url.pathname.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response für Cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback zu Cache bei Netzwerkfehler
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-First für statische Assets (JS, CSS, Bilder)
  const isStaticAsset = url.pathname.startsWith('/assets/') || 
                        url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff|woff2)$/);
  
  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached version immediately if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch and cache for 1 year
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // Add custom headers to indicate long cache
              const headers = new Headers(responseClone.headers);
              headers.set('X-SW-Cache', 'true');
              headers.set('X-SW-Cache-Date', new Date().toISOString());
              
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate for HTML and other resources
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });

      // Return cached version immediately, but update in background
      return cachedResponse || fetchPromise;
    })
  );
});

// Background Sync für GPS-Positionen
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background Sync:', event.tag);

  if (event.tag === 'sync-gps-positions') {
    event.waitUntil(syncGPSPositions());
  }
});

// GPS-Positionen aus IndexedDB syncen
async function syncGPSPositions() {
  try {
    // IndexedDB öffnen
    const db = await openGPSDatabase();
    const positions = await getAllQueuedPositions(db);

    console.log(`[Service Worker] Syncing ${positions.length} GPS positions`);

    // Positionen an Server senden
    for (const position of positions) {
      try {
        const response = await fetch(`${self.location.origin}/api/vehicle-positions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(position.data)
        });

        if (response.ok) {
          // Position aus Queue entfernen
          await deleteQueuedPosition(db, position.id);
          console.log('[Service Worker] GPS position synced:', position.id);
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync position:', error);
      }
    }

    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] GPS sync failed:', error);
    return Promise.reject(error);
  }
}

// Helper: IndexedDB öffnen
function openGPSDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('gps-queue', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('positions')) {
        db.createObjectStore('positions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Helper: Alle Positionen aus Queue holen
function getAllQueuedPositions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['positions'], 'readonly');
    const store = transaction.objectStore('positions');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Helper: Position aus Queue löschen
function deleteQueuedPosition(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['positions'], 'readwrite');
    const store = transaction.objectStore('positions');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Message Handler für Client-Communication
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'QUEUE_GPS_POSITION') {
    // GPS-Position in IndexedDB speichern
    queueGPSPosition(event.data.position)
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
});

// GPS-Position in Queue speichern
async function queueGPSPosition(position) {
  const db = await openGPSDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['positions'], 'readwrite');
    const store = transaction.objectStore('positions');
    const request = store.add({
      data: position,
      timestamp: new Date().toISOString()
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

console.log('[Service Worker] Loaded successfully');
