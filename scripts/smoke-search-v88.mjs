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
const errors = [];
window.addEventListener('error', e => errors.push('window.onerror: '+e.message));

const load = f => window.eval(fs.readFileSync(f,'utf8'));
load('assets/game/local-assets-v67.js');
load('assets/game/local-assets-v87.js');
load('social-data-v50.js');
load('machine-data-v51.js');
load('switch-names-v47.js');
load('world-nav-data-v87.js');
load('world-data-v70.js');
load('lookup-data-v46.js');
load('lookup-extra-v49.js');
load('dist/app.js');

const doc = window.document;
const raf = (n=2) => new Promise(r=>{let i=0;const t=()=>{i++<n?setTimeout(t,25):r()};t()});
const fail = m => { console.log('SMOKE FAIL:', m); process.exit(1); };
const btn = (pred) => [...doc.querySelectorAll('button')].find(pred);
const setNativeValue = (el,v)=>{const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;setter.call(el,v);el.dispatchEvent(new window.Event('input',{bubbles:true}));};

const openSearch = async () => { const b=btn(x=>x.getAttribute('aria-label')==='全域搜尋'); if(!b)fail('search button missing'); b.click(); await raf(3); };
const typeQuery = async q => { const input=doc.querySelector('input[placeholder^="搜人物"]'); if(!input)fail('search input missing'); setNativeValue(input,q); await raf(2); };
const overlayEl = () => doc.getElementById('search-overlay-v88');
const rowByLabel = label => [...(overlayEl()?.querySelectorAll('b')||[])].find(b=>b.textContent===label)?.closest('button');
const closeSearch = async () => { const b=btn(x=>x.textContent==='關閉'); if(b){b.click(); await raf(2);} };

await raf(3);
if(!doc.getElementById('root').textContent.trim()) fail('app did not render');

// 1) 簡中搜魚 → 物品卡
await openSearch();
await typeQuery('鲶鱼');
let row=rowByLabel('鲶鱼');
if(!row) fail('search 鲶鱼 no result');
const hasSpotChip=[...(overlayEl()?.querySelectorAll('button')||[])].some(b=>/^🎣 /.test(b.textContent||''));
console.log('fish result + spot chips:', !!row, hasSpotChip);
row.click(); await raf(3);
if(!doc.getElementById('lookup-detail-v62')) fail('item card did not open from search');
console.log('鲶鱼 → item card OK');

// 2) 繁中查同一條魚（T2S 正規化）
await openSearch();
await typeQuery('鯰魚');
if(!rowByLabel('鲶鱼')) fail('Traditional query 鯰魚 did not match');
console.log('鯰魚(繁) → matched OK');
await typeQuery('catfish');
if(!rowByLabel('鲶鱼')) fail('English query catfish did not match');
console.log('catfish(en) → matched OK');

// 3) NPC → 社交卡
await typeQuery('海莉');
row=rowByLabel('海莉');
if(!row) fail('search 海莉 no result');
row.click(); await raf(3);
if(!doc.getElementById('npc-card-海莉')) fail('npc card did not open');
console.log('海莉 → social card OK');

// 4) 進度別名 → 社區
await openSearch();
await typeQuery('温室');
row=rowByLabel('溫室');
if(!row) fail('alias 温室 no result');
row.click(); await raf(3);
if(doc.querySelector('input[placeholder^="搜人物"]')) fail('overlay did not close after alias jump');
if(!doc.body.textContent.includes('收集包')&&!doc.body.textContent.includes('社區')) fail('alias did not land on bundles');
console.log('温室 → 社區進度 OK');

// 5) 地點 → 世界
await openSearch();
await typeQuery('冒险家公会');
row=rowByLabel('冒险家公会');
if(!row) fail('place search no result');
row.click(); await raf(3);
if(!doc.body.textContent.includes('山岭')) fail('place jump did not open mountain node');
console.log('冒险家公会 → 世界山岭 OK');

// 6) 收藏：加星 → 總覽 chip → 跳轉
await openSearch();
await typeQuery('鲶鱼');
const star=[...(overlayEl()?.querySelectorAll('button')||[])].find(x=>x.getAttribute('aria-label')==='加入收藏');
if(!star) fail('star button missing');
star.click(); await raf(2);
await closeSearch();
btn(x=>(x.textContent||'').trim()==='總覽').click(); await raf(2);
if(!doc.body.textContent.includes('常用／正在追')) fail('fav strip missing on overview');
const stripTitle=[...doc.querySelectorAll('b')].find(b=>(b.textContent||'').includes('常用／正在追'));
const stripCard=stripTitle.closest('div').parentElement;
const chip=[...stripCard.querySelectorAll('button')].find(b=>b.textContent.includes('鲶鱼'));
if(!chip) fail('fav chip missing');
chip.click(); await raf(3);
if(!doc.getElementById('lookup-detail-v62')) fail('fav chip did not jump to item card');
console.log('⭐ 收藏 → 總覽 chip → 跳轉 OK');

// 7) 釣點 chip 直達世界
await openSearch();
await typeQuery('鲶鱼');
const spotChip=[...(overlayEl()?.querySelectorAll('button')||[])].find(b=>/^🎣 /.test(b.textContent||''));
if(!spotChip) fail('spot chip missing');
const chipLabel=spotChip.textContent;
spotChip.click(); await raf(3);
if(!doc.body.textContent.includes('種')) fail('spot chip did not open spot detail');
console.log('釣點 chip:', JSON.stringify(chipLabel), '→ 世界釣點 OK');

const realErrors=errors.filter(e=>!/not implemented|Could not load img/i.test(e));
if(realErrors.length){ console.log('collected errors:\n'+realErrors.join('\n')); process.exit(1); }
console.log('SMOKE OK');
