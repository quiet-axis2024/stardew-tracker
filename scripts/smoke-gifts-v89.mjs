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
const setVal = (el,v)=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(el,v);el.dispatchEvent(new window.Event('input',{bubbles:true}));};

await raf(3);
btn(x=>x.getAttribute('aria-label')==='全域搜尋').click(); await raf(3);
setVal(doc.querySelector('input[placeholder^="搜人物"]'),'紫水晶'); await raf(2);
const overlay=doc.getElementById('search-overlay-v88');
const row=[...overlay.querySelectorAll('b')].find(b=>b.textContent==='紫水晶')?.closest('button');
if(!row) fail('搜紫水晶無結果');
row.click(); await raf(3);
const card=doc.getElementById('lookup-detail-v62');
if(!card) fail('物品卡未開啟');
if(!card.textContent.includes('送禮')) fail('物品卡缺送禮段');
if(!card.textContent.includes('最愛')) fail('送禮段缺最愛列');
const abChip=[...card.querySelectorAll('button')].find(b=>b.textContent.includes('阿比蓋爾'));
if(!abChip) fail('最愛列缺阿比蓋爾');
console.log('紫水晶卡片送禮段:', [...card.querySelectorAll('button')].filter(b=>/›$/.test(b.textContent)).map(b=>b.textContent.replace(' ›','')).join('、'));
abChip.click(); await raf(3);
if(!doc.getElementById('npc-card-阿比蓋爾')) fail('點阿比蓋爾未跳社交卡');
console.log('紫水晶 → 送禮 💗 阿比蓋爾 → 社交卡 OK');
console.log('SMOKE OK');
