// Herbarium PWA — Service Worker
// Estrategia: network-first para navegación, cache-first para assets estáticos

const CACHE_NAME = 'herbarium-v1';
const STATIC_ASSETS = [
  '/PlantasMedicinales/',
  '/PlantasMedicinales/plantas',
  '/PlantasMedicinales/afecciones',
  '/PlantasMedicinales/acciones',
  '/PlantasMedicinales/sistemas',
  '/PlantasMedicinales/manifest.json',
  '/PlantasMedicinales/icons/icon-192x192.svg',
  '/PlantasMedicinales/icons/icon-512x512.svg',
];

// Instalar — precachear shell mínimo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activar — limpiar caches viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network-first para HTML, cache-first para assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests que no son de nuestro origin
  if (url.origin !== location.origin) return;

  // Ignorar APIs y datos dinámicos
  if (url.pathname.includes('/api/')) return;

  // Cache-first para assets estáticos (imágenes, fuentes, js, css)
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Network-first para navegación (HTML)
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
