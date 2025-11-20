/* =============================================================================
   MyDispatch PWA Service Worker - Production Ready
   =============================================================================
   Strategy:
   - App Shell: Network-first + offline fallback
   - Assets: Stale-while-revalidate
   - Bypass: Supabase API, WebSocket, Real-time
   ============================================================================= */

const VERSION = 'v1.0.0';
const CACHE_NAME = `mydispatch-${VERSION}`;
const ASSETS_CACHE = `mydispatch-assets-${VERSION}`;

// Assets to pre-cache (critical for offline)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
];

// Patterns to bypass caching (never cache these)
const BYPASS_PATTERNS = [
  // Supabase API
  /supabase\.co/,
  /\/auth\//,
  /\/rest\/v1\//,
  /\/realtime\/v1\//,
  /\/storage\/v1\//,
  
  // WebSocket connections
  /ws:\/\//,
  /wss:\/\//,
  
  // Hot Module Replacement (development)
  /vite\/dist/,
  /@vite/,
  /@react-refresh/,
  /\.hot-update\./,
];

// Check if URL should bypass cache
function shouldBypassCache(url) {
  const urlString = url.toString();
  return BYPASS_PATTERNS.some(pattern => pattern.test(urlString));
}

// Install event: Pre-cache critical assets
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version ${VERSION}`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Pre-cache failed:', error);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version ${VERSION}`);
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Delete old versions
              return cacheName.startsWith('mydispatch-') && cacheName !== CACHE_NAME && cacheName !== ASSETS_CACHE;
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event: Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Bypass cache for specific patterns
  if (shouldBypassCache(url)) {
    return; // Let browser handle normally
  }
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Determine strategy based on request type
  if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    // STRATEGY 1: Network-first for navigation (app shell)
    event.respondWith(networkFirstStrategy(request));
  } else if (isStaticAsset(url)) {
    // STRATEGY 2: Stale-while-revalidate for static assets
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    // Default: Network-first
    event.respondWith(networkFirstStrategy(request));
  }
});

// Check if URL is a static asset
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// STRATEGY 1: Network-first with offline fallback
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed - try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache (offline):', request.url);
      return cachedResponse;
    }
    
    // If navigation request and no cache, return offline page
    if (request.mode === 'navigate') {
      const offlineFallback = await caches.match('/index.html');
      if (offlineFallback) {
        return offlineFallback;
      }
    }
    
    // No cache available
    throw error;
  }
}

// STRATEGY 2: Stale-while-revalidate for assets
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(ASSETS_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately (if available)
  const fetchPromise = fetch(request).then(networkResponse => {
    // Update cache in background
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we already returned cached version
    return null;
  });
  
  // Return cached version immediately, or wait for network
  return cachedResponse || fetchPromise;
}

// Message handler for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});
