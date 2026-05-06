/**
 * Service Worker — ensures index.html is ALWAYS fetched from the server.
 *
 * Problem: Browser caches index.html → loads old JS → shows stale data.
 * Solution: Intercept all navigation requests (HTML pages) and always
 * fetch from network. Hashed assets (JS/CSS) are left alone — they're
 * immutable and safe to cache.
 */

// Activate immediately, don't wait for old tabs to close
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Only intercept navigation requests (HTML page loads)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            // Always go to network first with no-store to bypass all caches
            fetch(event.request, { cache: 'no-store' })
                .catch(() => {
                    // If offline, try to serve from cache as last resort
                    return caches.match(event.request);
                })
        );
    }
    // All other requests (JS, CSS, images) pass through normally
});
