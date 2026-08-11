const CACHE='stardew-tracker-v26';
const CORE=['./index.html','./app.js','./cloud.js','./manifest.webmanifest','./icon.svg'];

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
  if(url.origin!==self.location.origin){event.respondWith(fetch(event.request));return;}
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