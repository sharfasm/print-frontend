/*
 * PrintVoz service worker — hand-written, zero build tooling.
 *
 * Strategy:
 *   - Navigations (HTML pages): network-first, fall back to cache, then to the
 *     branded /offline.html when truly offline.
 *   - Static assets (_next/static, icons, images, fonts): stale-while-revalidate.
 *   - API calls and cross-origin requests: not intercepted (always network).
 *
 * Bump VERSION to invalidate old caches on deploy.
 */
const VERSION = "v1.0.0";
const STATIC_CACHE = `printvoz-static-${VERSION}`;
const RUNTIME_CACHE = `printvoz-runtime-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      // Add individually so one missing asset doesn't fail the whole precache.
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Only handle same-origin; let the API and any cross-origin asset pass through.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api")) return;

  // HTML navigations → network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Static assets → stale-while-revalidate.
  const isStaticAsset =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons") ||
    url.pathname.startsWith("/images") ||
    /\.(?:js|css|woff2?|ttf|otf|png|jpe?g|svg|gif|webp|avif|ico)$/i.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});

// Let the page ask a waiting SW to take over immediately.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
