// Offline shell. Pages with personal data are never cached: only the public pages below,
// the offline notice, and the app's static files.
// shortcut: old static files are only purged when CACHE is renamed; bump the version now and then.
const CACHE = "fretkey-shell-v1";
const PUBLIC_PAGES = ["/", "/practice", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PUBLIC_PAGES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // Network first, so signed-in pages are always fresh. Offline: the saved public page, or the notice.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && PUBLIC_PAGES.includes(url.pathname)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(url.pathname, copy));
          }
          return response;
        })
        .catch(async () => (PUBLIC_PAGES.includes(url.pathname) && (await caches.match(url.pathname))) || caches.match("/offline")),
    );
    return;
  }

  // Build files have a content hash in their name, so a cached copy is always the right one.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })),
    );
  }
});
