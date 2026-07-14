const CACHE_NAME = 'bocadeli-cache-v1';
const RECURSOS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './pwa.js',
    './formularios.json',
    './offline.html',
    './logo.png'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(RECURSOS)));
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
            .catch(() => caches.match('./offline.html'))
    );
});