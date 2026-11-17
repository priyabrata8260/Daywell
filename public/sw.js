const CACHE_NAME = 'daywell-static-v5-profile';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const shell = await fetch('./index.html');
    await cache.put('./index.html', shell.clone());
    const html = await shell.text();
    const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map(match => new URL(match[1], self.location.href))
      .filter(url => url.origin === self.location.origin && /\.(?:js|css|png|webmanifest|md)$/.test(url.pathname))
      .map(url => url.href);
    await cache.addAll(['./', './manifest.webmanifest', './icons/daywell-180.png', './icons/daywell-192.png', './icons/daywell-512.png', ...assets]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('daywell-static-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        (await caches.open(CACHE_NAME)).put('./index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(request)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }
  event.respondWith((async () => {
    try {
      const fresh = await fetch(request);
      if (fresh.ok) (await caches.open(CACHE_NAME)).put(request, fresh.clone());
      return fresh;
    } catch {
      return (await caches.match(request)) || Response.error();
    }
  })());
});
