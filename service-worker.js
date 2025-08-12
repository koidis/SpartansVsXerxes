const CACHE_NAME='svx-cache-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))));} );
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin===location.origin){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).then(resp=>{
      const copy=resp.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request, copy)); return resp;
    }).catch(()=>caches.match('./'))));
  }
});