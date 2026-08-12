const CACHE='stardew-tracker-v67';
const CORE=['./index.html','./app.js','./cloud.js','./farmer-preview-v33.js','./animal-preview-v33.js','./social-data-v50.js','./machine-data-v51.js','./switch-names-v47.js','./manifest.webmanifest','./icon.svg','./assets/game/local-assets-v67.js','./assets/game/main-logo-zh.png','./assets/game/190f9e6b5387c3.png','./assets/game/be63873217899f.png','./assets/game/adab5090ac6a1b.png','./assets/game/2e24659a92f407.png','./assets/game/82bea9cce9ec5c.png','./assets/game/65632b6cfeb2e5.png','./assets/game/579815198c3690.png','./assets/game/d8bfbca86c7d12.png','./assets/game/d4e0cd960b1655.png','./assets/game/e24bbd3df7992e.png','./assets/game/9954f1565c4391.png','./assets/game/cefec7bd561189.png','./assets/game/7ba32cb59a2dbd.png','./assets/game/48d3ec5e556d98.png','./assets/game/d526411fed6778.png','./assets/game/c476659deba191.png','./assets/game/ab478f3efc840e.png','./assets/game/ce02c8572e8bee.png','./assets/game/054e38bab606fb.png','./assets/game/5fd50473959cf3.png','./assets/game/4660fef1da9f86.png','./assets/game/e782453fecea2d.png','./assets/game/2fade73b49a8e0.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url)))));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
  self.clients.claim();
});

async function networkFirst(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone());}
    return response;
  }catch(error){const cached=await caches.match(request);if(cached)return cached;throw error;}
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin){
    if(event.request.destination==='image'){
      event.respondWith((async()=>{
        const cache=await caches.open(CACHE);
        const cached=await cache.match(event.request);
        if(cached){
          fetch(event.request).then(r=>cache.put(event.request,r.clone())).catch(()=>{});
          return cached;
        }
        const response=await fetch(event.request);
        cache.put(event.request,response.clone()).catch(()=>{});
        return response;
      })());
    }else event.respondWith(fetch(event.request));
    return;
  }
  const isCore=/\/(index\.html|app\.js|cloud\.js)$/.test(url.pathname);
  if(event.request.mode==='navigate'||isCore){
    event.respondWith(networkFirst(event.request).catch(async()=>{
      if(event.request.mode==='navigate')return caches.match('./index.html');
      throw new Error('offline core asset unavailable');
    }));
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);if(cached)return cached;
    const response=await fetch(event.request);
    if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone());}
    return response;
  })());
});