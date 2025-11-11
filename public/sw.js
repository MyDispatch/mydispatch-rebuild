// Service Worker für MyDispatch PWA
// Version: 1.0.0
// Hinweis: CACHE_NAME absichtlich generisch, tatsächliche Invalidierung erfolgt
// über Nachrichten vom Client (Version-Handshake) und Activate-Cleanup.
const CACHE_NAME = 'mydispatch-v1.0.0';
const RUNTIME_CACHE = 'mydispatch-runtime';

// Runtime Version, vom Client via Message gesetzt
let CLIENT_BUILD_VERSION = null;

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page if available
            return caches.match('/');
          });
      })
  );
});

// Message event - handle skipWaiting
self.addEventListener('message', (event) => {
  if (!event.data) return;

  // Sofortiger Aktivierungswechsel
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  // Version vom Client setzen
  if (event.data.type === 'VERSION_CHECK') {
    CLIENT_BUILD_VERSION = event.data.version || null;
    return;
  }

  // Caches gezielt löschen (White Screen Fix bei Version-Mismatch)
  if (event.data.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n)))).then(() => {
        // Optional: Clients informieren
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => client.postMessage({ type: 'CACHES_CLEARED', version: CLIENT_BUILD_VERSION }));
        });
      })
    );
    return;
  }
});

