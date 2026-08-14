import { JSDOM } from 'jsdom';
import fs from 'fs';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'https://localhost/', pretendToBeVisual: true, runScripts: 'outside-only'
});
const { window } = dom;
for (const k of ['window','document','navigator','localStorage','HTMLElement','HTMLInputElement','Node','Event','CustomEvent','getComputedStyle','requestAnimationFrame','cancelAnimationFrame']) {
  try { globalThis[k] = window[k] ?? globalThis[k]; } catch { /* read-only global (e.g. navigator on newer Node) */ }
}
window.matchMedia = window.matchMedia || (()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
window.scrollTo = ()=>{};
window.HTMLElement.prototype.scrollIntoView = window.HTMLElement.prototype.scrollIntoView || function(){};
window.fetch = globalThis.fetch?.bind(globalThis) || (()=>Promise.reject(new Error('no fetch')));
const errors = [];
window.addEventListener('error', e => errors.push('window.onerror: '+e.message));
const origError = console.error;
console.error = (...a)=>{ errors.push('console.error: '+a.map(String).join(' ').slice(0,300)); origError(...a); };

const load = f => window.eval(fs.readFileSync(f,'utf8'));
load('assets/game/local-assets-v67.js');
load('assets/game/local-assets-v87.js');
load('social-data-v50.js');
load('machine-data-v51.js');
load('switch-names-v47.js');
load('world-nav-data-v87.js');
load('world-data-v70.js');           // 一併載入，模擬 lazy world 已完成
load('lookup-data-v46.js');
load('lookup-extra-v49.js');
load('dist/app.js');

const raf = () => new Promise(r=>setTimeout(r,30));
const byText = (txt,root=window.document) => [...root.querySelectorAll('button')].find(b=>(b.textContent||'').trim().includes(txt));
const fail = m => { console.log('SMOKE FAIL:', m); console.log(errors.join('\n')); process.exit(1); };

await raf(); await raf();
if(!window.document.getElementById('root').textContent.trim()) fail('app did not render');

// 進入 查找 → 世界
const lookupTab = [...window.document.querySelectorAll('button')].find(b=>(b.textContent||'').trim()==='查找');
if(!lookupTab) fail('bottom nav 查找 not found');
lookupTab.click(); await raf();
const worldBtn = byText('世界');
if(!worldBtn) fail('世界 toggle not found');
worldBtn.click(); await raf(); await raf();

const doc = window.document;
const pinButtons = [...doc.querySelectorAll('button[aria-label]')].filter(b=>b.style.position==='absolute');
console.log('root pins:', pinButtons.map(b=>b.getAttribute('aria-label')).join(' | '));
if(pinButtons.length < 6) fail('expected >=6 root pins, got '+pinButtons.length);

// portal 導航：點「煤矿森林」
const forestPin = pinButtons.find(b=>b.getAttribute('aria-label')==='煤矿森林');
if(!forestPin) fail('forest pin missing');
forestPin.click(); await raf(); await raf();
if(!doc.body.textContent.includes('瑪妮的牧場')&&!doc.body.textContent.includes('玛妮的牧场')) fail('forest node did not render');
const forestPins=[...doc.querySelectorAll('button[aria-label]')].filter(b=>b.style.position==='absolute');
console.log('forest pins:', forestPins.length);

// 點地點 pin → 詳細卡（含 NPC 按鈕）
const ranch = forestPins.find(b=>b.getAttribute('aria-label')==='玛妮的牧场');
if(!ranch) fail('ranch pin missing');
ranch.click(); await raf();
if(!doc.body.textContent.includes('可以做什麼')&&!doc.body.textContent.includes('相關人物')) fail('place detail missing');
const npcBtn=[...doc.querySelectorAll('button')].find(b=>/瑪妮|玛妮/.test(b.textContent)&&/›/.test(b.textContent));
console.log('npc link button:', npcBtn? 'yes':'no');
if(!npcBtn) fail('NPC link button missing in place detail');

// 點釣點 pin → 魚清單
const spot = forestPins.find(b=>b.getAttribute('aria-label')==='河流');
if(!spot) fail('river spot pin missing');
spot.click(); await raf(); await raf();
if(!doc.body.textContent.includes('種')) fail('spot detail missing');

// 返回
const back = byText('返回');
if(!back) fail('back button missing');
back.click(); await raf();

// NPC 跨頁：直接呼叫社交（透過詳細卡按鈕流程再走一次）
ranchAgain(); async function ranchAgain(){}
const forestPin2=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='煤矿森林');
forestPin2.click(); await raf();
const ranch2=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='玛妮的牧场');
ranch2.click(); await raf();
const npcBtn2=[...doc.querySelectorAll('button')].find(b=>/瑪妮|玛妮/.test(b.textContent)&&/›/.test(b.textContent));
npcBtn2.click(); await raf(); await raf();
const onSocial = doc.body.textContent.includes('最愛')||doc.body.textContent.includes('喜歡')||doc.body.textContent.includes('送禮');
console.log('npc cross-link landed on social page:', onSocial);
if(!onSocial) fail('NPC cross-link did not open social card');

// 按條件找魚 → goToArea 跳釣點
const lookupTab2=[...doc.querySelectorAll('button')].find(b=>(b.textContent||'').trim()==='查找');
lookupTab2.click(); await raf();
byText('世界').click(); await raf();
byText('按條件找魚').click(); await raf(); await raf();
const spotJump=[...doc.querySelectorAll('button')].find(b=>/→/.test(b.textContent||''));
if(!spotJump) fail('quick-fish spot jump buttons missing');
const jumpLabel=spotJump.textContent;
spotJump.click(); await raf(); await raf();
console.log('jumped via quick-fish:', JSON.stringify(jumpLabel), '->', doc.body.textContent.includes('種')?'spot detail ok':'??');
if(!doc.body.textContent.includes('種')) fail('goToArea jump did not open spot detail');

const realErrors=errors.filter(e=>!/not implemented|Could not load img|navigation/i.test(e));
if(realErrors.length){ console.log('collected errors:'); console.log(realErrors.join('\n---\n')); process.exit(1); }
console.log('SMOKE OK');
