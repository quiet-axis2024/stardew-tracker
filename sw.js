const CACHE='stardew-tracker-v69';
const CORE=['./index.html','./app.js','./cloud.js','./farmer-preview-v33.js','./animal-preview-v33.js','./social-data-v50.js','./machine-data-v51.js','./switch-names-v47.js','./manifest.webmanifest','./icon.svg','./assets/game/local-assets-v67.js','./assets/game/main-logo-zh.png','./assets/game/190f9e6b5387c3.png','./assets/game/be63873217899f.png','./assets/game/adab5090ac6a1b.png','./assets/game/2e24659a92f407.png','./assets/game/82bea9cce9ec5c.png','./assets/game/65632b6cfeb2e5.png','./assets/game/579815198c3690.png','./assets/game/d8bfbca86c7d12.png','./assets/game/d4e0cd960b1655.png','./assets/game/e24bbd3df7992e.png','./assets/game/9954f1565c4391.png','./assets/game/cefec7bd561189.png','./assets/game/7ba32cb59a2dbd.png','./assets/game/48d3ec5e556d98.png','./assets/game/d526411fed6778.png','./assets/game/c476659deba191.png','./assets/game/ab478f3efc840e.png','./assets/game/ce02c8572e8bee.png','./assets/game/054e38bab606fb.png','./assets/game/5fd50473959cf3.png','./assets/game/4660fef1da9f86.png','./assets/game/e782453fecea2d.png','./assets/game/2fade73b49a8e0.png','./assets/game/3780aee144d4b9.png','./assets/game/d360d6be3f2a74.png','./assets/game/bd539649d03507.png','./assets/game/2224d4f0bea655.png','./assets/game/6eb4502d7d0e20.png','./assets/game/2dcaea10910233.png','./assets/game/e1fdf9d1dd6f4c.png','./assets/game/8affc7612d6c00.png','./assets/game/36daa1f94107da.png','./assets/game/023f8c50ca4f5f.png','./assets/game/8847ccb5c29665.png','./assets/game/505a7ea17ce55c.png','./assets/game/bd75a2cd731931.png','./assets/game/eb73ec8e0f5f3b.png','./assets/game/97b941180ddea9.png','./assets/game/b20e6c8e3fcf0c.png','./assets/game/18d10cc1deb907.png','./assets/game/dfe61624733203.png','./assets/game/09f8666241338e.png','./assets/game/13e6b46849cc64.png','./assets/game/02dcd6272546a0.png','./assets/game/8969135ccf61fd.png','./assets/game/84cb31ed895d10.png','./assets/game/95954611c6ef51.png','./assets/game/0552a350e00123.png','./assets/game/4a160b2b17bc04.png','./assets/game/311df381b99081.png','./assets/game/9e1300162eec2b.png','./assets/game/85481fe7a13f1a.png','./assets/game/700afc802b5df1.png','./assets/game/d9694a5af77bfd.png','./assets/game/085e10ef812f24.png','./assets/game/20b7a6f6b73213.png','./assets/game/cb10077572d8a3.png','./assets/game/b7442ff57d3724.png','./assets/game/c9161957116683.png','./assets/game/dc9af41cbb2604.png'];

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