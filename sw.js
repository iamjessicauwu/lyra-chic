const CACHE_NAME = 'v1.01';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css'
];

// 1. Install Event: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // Force activation immediately
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached asset if found, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});
