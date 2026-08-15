/* v87 service worker.
   策略：
   - CORE（小型必要檔）安裝時預快取。
   - /assets/game/（內容雜湊命名，不會變動）→ cache-first。
   - 其餘同源 GET → network-first；只有 response.ok 才寫入快取；離線時回快取。
   - 只有「導覽請求」失敗才回退 index.html，避免 JS/圖片請求拿到 HTML 內容。
   - 跨域圖片（僅剩零星 wiki 後備）→ stale-while-revalidate，失敗不擋。 */
const CACHE='stardew-tracker-v87';
const CORE=['./index.html','./app.js','./cloud.js','./farmer-preview-v33.js','./animal-preview-v33.js','./social-data-v50.js','./machine-data-v51.js','./switch-names-v47.js','./world-data-v70.js','./world-nav-data-v87.js','./npc-schedule-data-v91.js','./crop-data-v96.js','./manifest.webmanifest','./icon.svg','./assets/game/local-assets-v67.js','./assets/game/local-assets-v87.js','./assets/game/main-logo-zh.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
async function cacheFirst(request){
  const cached=await caches.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone());}
  return response;
}
async function networkFirst(request){
  try{
    const response=await fetch(request);
    if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone());}
    return response;
  }catch(error){
    const cached=await caches.match(request);
    if(cached)return cached;
    if(request.mode==='navigate'){const shell=await caches.match('./index.html');if(shell)return shell;}
    throw error;
  }
}
async function staleWhileRevalidate(request){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request);
  const refresh=fetch(request).then(response=>{if(response&&(response.ok||response.type==='opaque'))cache.put(request,response.clone());return response}).catch(()=>null);
  return cached||refresh.then(r=>r||Response.error());
}
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin===self.location.origin){
    if(url.pathname.includes('/assets/game/')){event.respondWith(cacheFirst(request));return;}
    event.respondWith(networkFirst(request));
    return;
  }
  if(request.destination==='image'){event.respondWith(staleWhileRevalidate(request));}
});
