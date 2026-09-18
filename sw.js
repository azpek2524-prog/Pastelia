/* Pastelia — Service Worker (PWA instalable + offline)
   Estrategia segura:
   - HTML/navegación: network-first (las actualizaciones se propagan siempre; caché solo de respaldo offline).
   - Assets estáticos (iconos, svg): stale-while-revalidate.
   - Cross-origin (Firebase, gstatic, proxy de Gemini) y peticiones que no son GET: SIN interceptar
     (van directo a la red), para no romper auth, Firestore ni el agente.
   Sube la versión del CACHE para forzar limpieza al desplegar. */
var CACHE = 'pastelia-v1';
var SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png?v=2', './icon-512.png?v=2', './icon-maskable-512.png?v=2', './favicon-32.png?v=2',
  './pastelia-icon-cacao.svg'
];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL).catch(function(){}); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;                        // POST/PUT (Firestore, Gemini) -> red directa
  var url;
  try{ url = new URL(req.url); }catch(err){ return; }
  if(url.origin !== self.location.origin) return;         // Firebase / gstatic / workers.dev -> red directa

  var isHtml = req.mode === 'navigate' || (req.headers.get('accept')||'').indexOf('text/html') >= 0;
  if(isHtml){
    // network-first: siempre intenta lo más nuevo; si no hay red, sirve el index cacheado.
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put('./index.html', copy); });
        return res;
      }).catch(function(){
        return caches.match('./index.html').then(function(m){ return m || caches.match('./'); });
      })
    );
    return;
  }
  // Assets estáticos: responde de caché al instante y actualiza en segundo plano.
  e.respondWith(
    caches.match(req).then(function(cached){
      var net = fetch(req).then(function(res){
        if(res && res.status === 200){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
        return res;
      }).catch(function(){ return cached; });
      return cached || net;
    })
  );
});
