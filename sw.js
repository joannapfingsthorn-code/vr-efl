// Offline cache for the VR simulations. Change VERSION after uploading new files.
const VERSION = 'vr-sims-v1';
const FILES = ['./', 'index.html', 'reading/', 'reading/index.html', 'reading/aframe.min.js', 'kitchen/', 'kitchen/index.html', 'kitchen/aframe.min.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(VERSION).then(async (c) => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then((r) => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || new Response('Offline and not cached yet.', { status: 503 });
  }));
});
