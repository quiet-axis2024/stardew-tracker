import { JSDOM } from 'jsdom';
import fs from 'fs';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'https://localhost/', pretendToBeVisual: true, runScripts: 'outside-only'
});
const { window } = dom;
for (const k of ['window','document','localStorage','HTMLElement','HTMLInputElement','Node','Event','CustomEvent','getComputedStyle','requestAnimationFrame','cancelAnimationFrame']) {
  try { globalThis[k] = window[k] ?? globalThis[k]; } catch {}
}
window.matchMedia = window.matchMedia || (()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
window.scrollTo = ()=>{};
window.HTMLElement.prototype.scrollIntoView = window.HTMLElement.prototype.scrollIntoView || function(){};

const load = f => window.eval(fs.readFileSync(f,'utf8'));
['assets/game/local-assets-v67.js','assets/game/local-assets-v87.js','social-data-v50.js','machine-data-v51.js','switch-names-v47.js','world-nav-data-v87.js','world-data-v70.js','lookup-data-v46.js','lookup-extra-v49.js','dist/app.js'].forEach(load);

const doc = window.document;
const raf = (n=2) => new Promise(r=>{let i=0;const t=()=>{i++<n?setTimeout(t,25):r()};t()});
const fail = m => { console.log('SMOKE FAIL:', m); process.exit(1); };
const btn = p => [...doc.querySelectorAll('button')].find(p);
const pin = label => [...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')===label&&b.style.position==='absolute');
const setVal = (el,v)=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(el,v);el.dispatchEvent(new window.Event('input',{bubbles:true}));};

await raf(3);
const enterWorldRoot = async () => {
  btn(x=>(x.textContent||'').trim()==='查找').click(); await raf(2);
  const w=btn(x=>(x.textContent||'').includes('世界')&&x.querySelector('img')); if(w){w.click(); await raf(2);}
  let guard=0;
  while(!pin('煤矿森林')&&guard++<8){
    const back=[...doc.querySelectorAll('button')].find(b=>b.style.position!=='fixed'&&(b.textContent||'').includes('返回'));
    if(!back)break; back.click(); await raf(2);
  }
  if(!pin('煤矿森林')) fail('無法回到世界根地圖');
};

// ---- 1. 世界釣點魚卡 → 物品卡 ----
await enterWorldRoot();
pin('煤矿森林').click(); await raf(2);
pin('河流').click(); await raf(2);
const fishRow=[...doc.querySelectorAll('button')].find(b=>/›$/.test((b.textContent||'').trim())&&b.querySelector('img')&&/四季|春|夏|秋|冬/.test(b.textContent));
if(!fishRow) fail('世界釣點魚卡缺 › 跳轉樣式');
fishRow.click(); await raf(3);
if(!doc.getElementById('lookup-detail-v62')) fail('魚卡未跳物品卡');
console.log('1) 世界魚卡 → 物品卡 OK');

// ---- 2. 公交站潘姆／礦井矮人＋商店 ----
await enterWorldRoot();
pin('公交站').click(); await raf(2);
pin('公交车／潘姆').click(); await raf(2);
let card=doc.body.textContent;
if(!card.includes('相關人物')||!card.includes('潘姆')) fail('公交站缺潘姆人物 chip');
const pam=[...doc.querySelectorAll('button')].find(b=>b.textContent.includes('潘姆')&&/›/.test(b.textContent));
pam.click(); await raf(3);
if(!doc.getElementById('npc-card-潘姆')) fail('潘姆 chip 未跳社交卡');
console.log('2a) 公交站 → 潘姆社交卡 OK');

await enterWorldRoot();
pin('山岭').click(); await raf(2);
pin('矿井').click(); await raf(2);
pin('矮人商店').click(); await raf(2);
card=doc.body.textContent;
if(!card.includes('矮人')||!card.includes('商店內容節選')) fail('礦井矮人商店缺 NPC 或商店');
if(!card.includes('稻草人')&&!card.includes('Rarecrow')) fail('矮人商店未列 Rarecrow');
console.log('2b) 礦井矮人商店：NPC＋商店 OK');

// 下水道克羅巴斯商店
await enterWorldRoot();
pin('下水道').click(); await raf(2);
pin('科罗布斯').click(); await raf(2);
card=doc.body.textContent;
if(!card.includes('克羅巴斯')||!card.includes('商店內容節選')) fail('克羅巴斯地點缺 NPC 或商店');
console.log('2c) 下水道克羅巴斯：NPC＋商店 OK');

// ---- 3. 商店專售物品可搜（跳販售地點）----
btn(x=>x.getAttribute('aria-label')==='全域搜尋').click(); await raf(3);
setVal(doc.querySelector('input[placeholder^="搜人物"]'),'鸭子'); await raf(2);
let ov=doc.getElementById('search-overlay-v88');
let row=[...ov.querySelectorAll('b')].find(b=>b.textContent==='鸭')?.closest('button');
if(!row) fail('搜鸭子(Duck)無結果');
if(!ov.textContent.includes('販售')) fail('商店品缺販售標註');
row.click(); await raf(3);
if(!doc.body.textContent.includes('玛妮的牧场')) fail('Duck 未跳玛妮的牧场');
console.log('3a) 鸭子 → 玛妮的牧场 OK');
btn(x=>x.getAttribute('aria-label')==='全域搜尋').click(); await raf(2);
setVal(doc.querySelector('input[placeholder^="搜人物"]'),'obelisk'); await raf(2);
ov=doc.getElementById('search-overlay-v88');
row=[...ov.querySelectorAll('b')].find(b=>/图腾柱|Obelisk/.test(b.textContent))?.closest('button');
if(!row) fail('搜 obelisk 無結果');
row.click(); await raf(3);
if(!doc.body.textContent.includes('法师塔')) fail('Obelisk 未跳法师塔');
console.log('3b) obelisk → 法师塔 OK');

// ---- 4. 按條件找魚不綁地圖（預設全世界＋可切本區）----
await enterWorldRoot();
pin('鹈鹕镇').click(); await raf(2);
btn(x=>(x.textContent||'').includes('按條件找魚')).click(); await raf(2);
if(!doc.body.textContent.includes('按條件找魚 · 全世界')) fail('找魚未預設全世界');
btn(x=>(x.textContent||'').trim()==='清除條件')?.click(); await raf(2); // 章鱼是夏季魚，清掉預設當季條件再搜
setVal(doc.querySelector('input[placeholder^="魚名可選填"]'),'章鱼'); await raf(2);
if(!doc.body.textContent.includes('章鱼')||!doc.body.textContent.includes('海滩')) fail('鎮上找不到海滩的章鱼');
const localBtn=btn(x=>(x.textContent||'').includes('只看鹈鹕镇'));
if(!localBtn) fail('缺「只看本區」切換');
localBtn.click(); await raf(2);
if(!doc.body.textContent.includes('按條件找魚 · 鹈鹕镇')) fail('切本區未生效');
console.log('4) 找魚：全世界預設＋本區切換 OK');

console.log('SMOKE OK');
