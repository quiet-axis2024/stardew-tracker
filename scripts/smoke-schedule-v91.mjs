import { JSDOM } from 'jsdom';
import fs from 'fs';
const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'https://localhost/',pretendToBeVisual:true,runScripts:'outside-only'});
const {window}=dom;
for(const k of ['window','document','localStorage','HTMLElement','HTMLInputElement','Node','Event','CustomEvent','getComputedStyle','requestAnimationFrame','cancelAnimationFrame']){try{globalThis[k]=window[k]??globalThis[k]}catch{}}
window.matchMedia=window.matchMedia||(()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
window.scrollTo=()=>{};window.HTMLElement.prototype.scrollIntoView=window.HTMLElement.prototype.scrollIntoView||function(){};
const load=f=>window.eval(fs.readFileSync(f,'utf8'));
['assets/game/local-assets-v67.js','assets/game/local-assets-v87.js','social-data-v50.js','machine-data-v51.js','switch-names-v47.js','world-nav-data-v87.js','npc-schedule-data-v91.js','world-data-v70.js','lookup-data-v46.js','lookup-extra-v49.js','dist/app.js'].forEach(load);
const doc=window.document;
const raf=(n=2)=>new Promise(r=>{let i=0;const t=()=>{i++<n?setTimeout(t,25):r()};t()});
const fail=m=>{console.log('SMOKE FAIL:',m);process.exit(1)};
const btn=p=>[...doc.querySelectorAll('button')].find(p);

// resolver 直測
const R=window.SDVNpcScheduleV91.resolve;
const marnie=R('瑪妮',{season:'春',day:1,rain:false});
if(!marnie.entries.some(([t,l])=>l.zh==='皮埃尔的杂货店'))fail('resolver 瑪妮週一未去皮埃爾');
const shane=R('謝恩',{season:'夏',day:10,rain:false});
if(!shane.entries.some(([t,l])=>l.zh==='玛妮的牧场'))fail('resolver 謝恩 CC 後週間未在牧場: '+JSON.stringify(shane.entries));
console.log('resolver：瑪妮週一／謝恩CC OK —',shane.entries.map(([t,l])=>t+' '+l.zh).join('|'));

await raf(3);
btn(x=>(x.textContent||'').trim()==='社交').click(); await raf(2);
const card=doc.getElementById('npc-card-哈維');
if(!card)fail('哈維卡不存在');
if(!card.textContent.includes('♡')&&!card.textContent.includes('♥'))fail('收合卡缺愛心排');
if(!card.textContent.includes('喜歡'))fail('收合卡缺喜歡列');
card.querySelector('button').click(); await raf(2);
if(!card.textContent.includes('📍 今天'))fail('展開卡缺今天行程');
if(!card.textContent.includes('哈维的诊所'))fail('今天行程缺診所');
console.log('人物卡：愛心排＋喜歡列＋今天行程 OK');
const chip=[...card.querySelectorAll('button')].find(b=>/›$/.test(b.textContent)&&b.textContent.includes('哈维的诊所'));
if(!chip)fail('行程 chip 缺跳轉');
chip.click(); await raf(3);
if(!doc.body.textContent.includes('鹈鹕镇'))fail('chip 未跳到世界鎮上');
console.log('行程 chip → 世界 OK');
console.log('SMOKE OK');
