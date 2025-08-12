const CACHE_NAME='svx-cache-v2';
const ASSETS=['./','./index.html?v=2','./index.html','./manifest.json?v=2','./manifest.json','./icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k))))).then(()=>self.clients.claim());});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin===location.origin){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).then(resp=>{
      const copy=resp.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request, copy)); return resp;
    }).catch(()=>caches.match('./index.html'))));
  }
});