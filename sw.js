// Plantilla de Service Worker

// 1. Nombre del caché y archivos a cachar
const CACHE_NAME = "nombre-del-cache"
const urlsToCache = [
    "index.html",
    "styles.css",
    "app.js",
    "offline.html",
];

// 2. Install -> el evento que se ejecuta al instalar el sw
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache.addAll(urlsToCache))
    )
})

// 3. ACTIVATE -> este evento se ejecuta al actuvarse debe limbiar limpiar cachés viejas
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => 
                Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                )
            )
    )
})

// 4. Fetch -> intercepta las peticiones de la pwa, intercambia cada petición de cadapágina de la pwa
// busca primeto el cache, si el recurso no esta, va a la red, si todo falla, muestra offline.html
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response=> {
                return response || fetch(event.request)
                    .catch(() => caches.match("offline.html"))
            })
    )
})

// 5. PUSH -> notificaciones en segundo plano(opcional)
self.addEventListener("push", event => {
    const data = event.data ? event.data.text(): "Notificación sin datos"
    event.waitUntil(
        self.registration.showNotification("MI PWA", {body: data})
    )
})