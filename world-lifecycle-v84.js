/* v85 — lifecycle owner for the standalone World UI. Keeps it inside 查找 → 世界 only and bridges cross-page focus. */
(()=>{
'use strict';
const n=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[\s·・_'’\-／/（）()：:]+/g,'');
const outsideButtons=()=>[...document.querySelectorAll('button')].filter(b=>!b.closest('#sdv-world-v83'));
function lookupPair(){
  for(const b of outsideButtons()){
    const p=b.parentElement;if(!p)continue;
    const bs=[...p.children].filter(x=>x.tagName==='BUTTON');
    const texts=bs.map(x=>n(x.textContent));
    if(texts.includes(n('世界'))&&texts.includes(n('物品')))return {world:bs.find(x=>n(x.textContent)===n('世界')),item:bs.find(x=>n(x.textContent)===n('物品'))};
  }
  return null;
}
function restoreHidden(host){
  if(!host)return;
  [...host.children].forEach(el=>{
    if(el.dataset?.sdv83Hidden){el.style.display=el.dataset.sdv83Display||'';delete el.dataset.sdv83Hidden;delete el.dataset.sdv83Display;}
  });
}
function restoreLegacyTitles(){
  document.querySelectorAll('[data-sdv84-title-hidden]').forEach(el=>{
    el.style.display=el.dataset.sdv84Display||'';delete el.dataset.sdv84TitleHidden;delete el.dataset.sdv84Display;
  });
}
function cleanupWorld(){
  const root=document.getElementById('sdv-world-v83');
  if(root){const host=root.parentElement;restoreHidden(host);root.remove();}
  restoreLegacyTitles();
}
function hideDuplicateLegacyTitle(){
  const root=document.getElementById('sdv-world-v83');if(!root)return;
  const main=root.closest('main')||document.querySelector('main');if(!main)return;
  [...main.querySelectorAll('*')].forEach(el=>{
    if(el===root||root.contains(el)||el.tagName==='BUTTON'||el.closest('button'))return;
    if(n(el.textContent)!==n('世界'))return;
    if(el.children.length>3)return;
    if(!el.dataset.sdv84TitleHidden){el.dataset.sdv84TitleHidden='1';el.dataset.sdv84Display=el.style.display||'';el.style.display='none';}
  });
}
function decorateRegionTitle(){
  const root=document.getElementById('sdv-world-v83');if(!root)return;
  const title=root.querySelector('.sdv83-title');if(!title||title.querySelector('img'))return;
  const mapImg=root.querySelector('.sdv83-map > img[data-map-img]');
  const src=mapImg?.currentSrc||mapImg?.src||window.SDVLocalGameFilesV67?.Map||'';
  title.style.display='flex';title.style.alignItems='center';title.style.gap='7px';
  if(src){
    const img=document.createElement('img');img.src=src;img.alt='';
    img.style.cssText='width:30px;height:30px;object-fit:cover;object-position:center;border-radius:4px;border:1px solid rgba(114,77,38,.25);image-rendering:pixelated;flex:0 0 auto;background:#f5e7bd';
    title.prepend(img);
  }
}
function focusNpcCard(raw,attempt=0){
  const key=n(raw);if(!key)return;
  const candidates=[...document.querySelectorAll('main button')].filter(b=>!b.closest('#sdv-world-v83')&&n(b.textContent).includes(key));
  candidates.sort((a,b)=>String(a.textContent||'').length-String(b.textContent||'').length);
  const target=candidates[0];
  if(target){
    target.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'});
    return;
  }
  if(attempt<5)setTimeout(()=>focusNpcCard(raw,attempt+1),180);
}
function isBottomNav(button){
  if(!button)return false;const label=n(button.textContent);
  return ['總覽','总览','資料','资料','社交','查找','衣櫥','衣橱','備註','备注'].some(x=>label===n(x))&&button.getBoundingClientRect().top>window.innerHeight*.5;
}
function audit(){
  const root=document.getElementById('sdv-world-v83');if(!root)return;
  const pair=lookupPair();
  if(!pair){cleanupWorld();return;}
  hideDuplicateLegacyTitle();decorateRegionTitle();
}
document.addEventListener('click',event=>{
  const b=event.target?.closest?.('button');if(!b)return;
  if(b.closest('#sdv-world-v83')){
    if(b.dataset.linkNpc){const raw=b.dataset.linkNpc;setTimeout(()=>focusNpcCard(raw),360);}
    return;
  }
  const pair=lookupPair();
  if(pair&&b===pair.item){cleanupWorld();return;}
  if(isBottomNav(b)&&n(b.textContent)!==n('查找')){cleanupWorld();return;}
  if(pair&&b===pair.world){cleanupWorld();}
},true);
new MutationObserver(audit).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('pageshow',audit);window.addEventListener('resize',audit,{passive:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',audit,{once:true});else audit();
})();