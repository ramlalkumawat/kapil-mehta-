/**
 * Sarpanch Setu - Service Worker
 * Secure offline caching for public assets and offline fallback.
 * Strictly avoids caching sensitive complaint submission or auth endpoints.
 */

const CACHE_NAME = 'sarpanch-setu-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install: precache essential shell files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: cleanup stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Purging stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy
// 1. Never cache non-GET requests (e.g. POST for complaint submission)
// 2. Network-first for API requests
// 3. Stale-while-revalidate for static assets
// 4. Fallback to /offline.html for navigation if disconnected
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET requests (POST complaints go straight to network)
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // If requesting external APIs (e.g. Cloud Run), do NOT cache sensitive responses
  if (url.origin !== self.location.origin) {
    return;
  }

  // Navigation requests: Network first, fallback to offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // Static assets: Cache first with network refresh (stale-while-revalidate)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return cached or nothing
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
