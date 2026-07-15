// IMPORTANTE: Cambia este número (ejemplo: v1.1 a v1.2) cada vez que edites tus formularios
const CACHE_NAME = 'bocadeli-cache-v1.3';

const RECURSOS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './pwa.js',
    './formularios.json',
    './logo.png'
];

// Instalación: Forzamos la entrada del nuevo worker
self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(RECURSOS))
    );
});

// Activación: Aquí es donde se borran los datos viejos automáticamente
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('Limpiando caché antigua...');
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estrategia: Buscar en internet primero para el JSON de formularios
self.addEventListener('fetch', e => {
    if (e.request.url.includes('formularios.json')) {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const copia = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, copia));
                    return res;
                })
                .catch(() => caches.match(e.request))
        );
    } else {
        // Para diseño y logo, usar caché para que sea instantáneo
        e.respondWith(
            caches.match(e.request).then(res => res || fetch(e.request))
        );
    }
});
