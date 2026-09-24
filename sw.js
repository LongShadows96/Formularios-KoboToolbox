'use strict';

const CACHE_NAME = 'bocadeli-cache-v2.2';
const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './pwa.js',
    './manifest.json',
    './formularios.json',
    './offline.html',
    './logo.png',
    './icon.svg'
];

const FORMS_URL = new URL('./formularios.json', self.location.href).href;

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
        );
        await self.clients.claim();
    })());
});

async function networkFirst(request, fallbackRequest = request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request, { cache: 'no-store' });
        if (response && response.ok) {
            await cache.put(fallbackRequest, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(fallbackRequest);
        if (cached) return cached;
        throw error;
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    const networkPromise = fetch(request)
        .then(response => {
            if (response && response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    return cached || networkPromise;
}

self.addEventListener('fetch', event => {
    const request = event.request;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // No intentamos cachear recursos externos (por ejemplo, KoboToolbox).
    if (url.origin !== self.location.origin) return;

    if (url.pathname.endsWith('/formularios.json')) {
        const canonicalRequest = new Request(FORMS_URL, { credentials: 'same-origin' });
        event.respondWith(networkFirst(request, canonicalRequest));
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                return await networkFirst(request);
            } catch {
                return (await caches.match('./index.html')) || (await caches.match('./offline.html'));
            }
        })());
        return;
    }

    event.respondWith(staleWhileRevalidate(request));
});
