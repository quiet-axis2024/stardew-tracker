import { JSDOM } from 'jsdom';
import fs from 'fs';
const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'https://localhost/',pretendToBeVisual:true,runScripts:'outside-only'});
const {window}=dom;
for(const k of ['window','document','localStorage','HTMLElement','HTMLInputElement','Node','Event','CustomEvent','getComputedStyle','requestAnimationFrame','cancelAnimationFrame']){try{globalThis[k]=window[k]??globalThis[k]}catch{}}
window.matchMedia=window.matchMedia||(()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
window.scrollTo=()=>{};window.HTMLElement.prototype.scrollIntoView=window.HTMLElement.prototype.scrollIntoView||function(){};
const load=f=>window.eval(fs.readFileSync(f,'utf8'));
['assets/game/local-assets-v67.js','assets/game/local-assets-v87.js','social-data-v50.js','machine-data-v51.js','switch-names-v47.js','world-nav-data-v87.js','npc-schedule-data-v91.js','crop-data-v96.js','world-data-v70.js','lookup-data-v46.js','lookup-extra-v49.js','dist/app.js'].forEach(load);
const doc=window.document;
const raf=(n=2)=>new Promise(r=>{let i=0;const t=()=>{i++<n?setTimeout(t,25):r()};t()});
const fail=m=>{console.log('SMOKE FAIL:',m);process.exit(1)};
const btn=p=>[...doc.querySelectorAll('button')].find(x=>p((x.textContent||'').trim(),x));
const setVal=(el,v)=>{const d=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');d.set.call(el,v);el.dispatchEvent(new window.Event('input',{bubbles:true}))};

const R=window.SDVNpcScheduleV91.resolve;
const zhs=r=>r.entries.map(e=>e[1].zh).join('|');
if(!zhs(R('謝恩',{season:'夏',day:10,rain:false,ccDone:false})).includes('Joja超市'))fail('resolver joja 路線');
if(!zhs(R('謝恩',{season:'夏',day:10,rain:false,ccDone:true})).includes('玛妮的牧场'))fail('resolver cc 路線');
console.log('resolver：CC↔Joja 雙路線 OK');

await raf(3);
btn(t=>t==='查找').click(); await raf(2);
const wEntry=[...doc.querySelectorAll('button')].find(x=>(x.textContent||'').includes('世界')&&x.querySelector('img'));
if(!wEntry)fail('查找頁找不到世界入口'); wEntry.click(); await raf(2);
btn(t=>t==='👤 找人').click(); await raf(2);
if(!doc.body.textContent.includes('按條件找人'))fail('找人面板未開');
const inp=[...doc.querySelectorAll('input')].find(i=>/人名可選填/.test(i.placeholder||''));
if(!inp)fail('找人輸入框缺');
setVal(inp,'罗宾'); await raf(2);
if(!doc.body.textContent.includes('羅賓'))fail('簡體查詢未命中羅賓');
const chip=btn((t)=>t.includes('木匠的商店'));
if(!chip)fail('羅賓行程 chip 缺');
chip.click(); await raf(3);
if(!doc.body.textContent.includes('山岭'))fail('chip 未跳到山岭');
console.log('找人：簡體過濾＋行程 chip → 世界 OK');
btn(t=>t==='按地點').click(); await raf(2);
if(!doc.body.textContent.includes('📍')||!doc.body.textContent.includes('人'))fail('按地點聚合未出現');
const rb=btn(t=>t==='羅賓 ›');
if(!rb)fail('地點群缺羅賓 chip');
rb.click(); await raf(2);
if(!doc.getElementById('npc-card-羅賓'))fail('未跳到社交卡');
console.log('按地點聚合 → 社交卡 OK');
// ---- v92.1 地點卡「今天誰會來」 ----
const pin=l=>[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')===l&&b.style.position==='absolute');
btn(t=>t==='查找').click(); await raf(2);
const wE2=[...doc.querySelectorAll('button')].find(x=>(x.textContent||'').includes('世界')&&x.querySelector('img'));
wE2.click(); await raf(2);
let g=0;
while(!pin('煤矿森林')&&g++<8){const back=[...doc.querySelectorAll('button')].find(b=>b.style.position!=='fixed'&&(b.textContent||'').includes('返回'));if(!back)break;back.click();await raf(2);}
if(!pin('鹈鹕镇'))fail('根圖無鹈鹕镇');
pin('鹈鹕镇').click(); await raf(2);
const zap=pin('杂货店')||btn(t=>t.includes('杂货店'));
if(!zap)fail('鎮上無杂货店入口');
zap.click(); await raf(2);
if(!doc.body.textContent.includes('今天誰會來'))fail('地點卡缺今天誰會來');
if(!doc.body.textContent.includes('8:10–12:00')||!doc.body.textContent.includes('瑪妮'))fail('杂货店未列出瑪妮 8:10–12:00');
btn(t=>t.includes('8:10–12:00')&&t.includes('瑪妮')).click(); await raf(2);
if(!doc.getElementById('npc-card-瑪妮'))fail('到訪 chip 未跳社交卡');
console.log('地點卡今天誰會來 → 社交卡 OK');
if(doc.body.textContent.includes('餐吧'))fail('畫面仍出現餐吧');
// ---- v92.2 地點卡頁尾去重（皮埃爾卡不應再有「查看」尾鈕） ----
if(doc.body.textContent.includes('查看 皮埃尔'))fail('地點卡重複跳轉未去除');
console.log('頁尾去重 OK');
// ---- v93 時段：總覽點中午 → 全手帳連動 ----
btn(t=>t==='總覽').click(); await raf(2);
const noonBtn=btn(t=>t==='中午');
if(!noonBtn)fail('總覽缺時段列');
noonBtn.click(); await raf(2);
btn(t=>t==='社交').click(); await raf(2);
const grp=btn(t=>t==='可交往對象'); if(grp){grp.click(); await raf(2);}
const hv=doc.getElementById('npc-card-哈維');
if(!hv)fail('社交頁無哈維卡');
hv.querySelector('button').click(); await raf(2);
if(!hv.textContent.includes('・中午'))fail('人物卡未帶時段');
if(!hv.textContent.includes('● '))fail('人物卡當前段未高亮');
console.log('人物卡時段高亮 OK');
btn(t=>t==='查找').click(); await raf(2);
const wE3=[...doc.querySelectorAll('button')].find(x=>(x.textContent||'').includes('世界')&&x.querySelector('img'));
wE3.click(); await raf(2);
if(!btn(t=>t.startsWith('👤')))fail('世界缺找人鈕');
if(!doc.body.textContent.includes('按條件找人'))btn(t=>t.startsWith('👤')).click(), await raf(2);
if(!doc.body.textContent.includes('・中午'))fail('找人未預設吃時段');
console.log('找人吃時段 OK');
// ---- v93 換日自動清 ----
btn(t=>t==='總覽').click(); await raf(2);
const dayBtn=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='切換到 5 日');
if(!dayBtn)fail('日曆格缺');
dayBtn.click(); await raf(2);
btn(t=>t==='查找').click(); await raf(2);
const wE4=[...doc.querySelectorAll('button')].find(x=>(x.textContent||'').includes('世界')&&x.querySelector('img'));
wE4.click(); await raf(2);
if(doc.body.textContent.includes('按條件找人')&&doc.body.textContent.includes('・中午'))fail('換日未清時段');
console.log('換日自動清時段 OK');
// ---- v92.2 生日卡「去哪找」（資料驅動找最近生日日） ----
btn(t=>t==='總覽').click(); await raf(2);
let bdayDay=0;
for(let d=1;d<=28;d++){const items=window.SDVSocialV50?null:null;} // 由 UI 驗：逐日點找含生日者
for(const d of [1,4,7,10,13,18,24,26,27]){
  const bb=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')===`切換到 ${d} 日`);
  if(!bb)continue; bb.click(); await raf(2);
  if(doc.body.textContent.includes('生日')&&doc.body.textContent.includes('去哪找')){bdayDay=d;break}
}
if(!bdayDay)fail('生日卡未見「去哪找」');
console.log('生日卡去哪找 OK（日='+bdayDay+'）');
// ---- v94 公交站潘姆（節點層本區到訪） ----
btn(t=>t==='總覽').click(); await raf(2);
const d1=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='切換到 1 日');
d1.click(); await raf(2);
btn(t=>t==='查找').click(); await raf(2);
const wE5=[...doc.querySelectorAll('button')].find(x=>(x.textContent||'').includes('世界')&&x.querySelector('img'));
wE5.click(); await raf(2);
let g2=0;
while(!([...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='公交站'))&&g2++<8){const back=[...doc.querySelectorAll('button')].find(b=>b.style.position!=='fixed'&&(b.textContent||'').includes('返回'));if(!back)break;back.click();await raf(2);}
const busPin=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='公交站');
if(!busPin)fail('根圖無公交站');
busPin.click(); await raf(2);
if(!doc.body.textContent.includes('本區今天誰會來'))fail('公交站缺本區到訪');
if(!doc.body.textContent.includes('潘姆')||!doc.body.textContent.includes('10:00'))fail('公交站未列潘姆 10:00');
console.log('公交站潘姆 OK');
// ---- v94 找魚六段＋預設吃手帳 ----
const fishBtn=btn(t=>t.includes('按條件找魚'));
fishBtn.click(); await raf(2);
if(!btn(t=>t==='深夜')||!btn(t=>t==='上午'))fail('找魚時段未統一為六段');
console.log('找魚六段 OK');
// ---- v94 節日會場（春13 彩蛋節） ----
btn(t=>t==='總覽').click(); await raf(2);
const d10=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='切換到 10 日');
d10.click(); await raf(2);
if(!doc.body.textContent.includes('彩蛋節（鹈鹕镇）'))fail('接下來 chip 缺會場');
const d13=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='切換到 13 日');
d13.click(); await raf(2);
if(!doc.body.textContent.includes('會場：鹈鹕镇'))fail('節日卡缺會場文字');
btn(t=>t.includes('會場：')).click(); await raf(3);
if(!doc.body.textContent.includes('鹈鹕镇'))fail('會場跳轉未到鎮上');
console.log('節日會場跳轉 OK');
// ---- v94 天氣 pills 在日期卡 ----
btn(t=>t==='總覽').click(); await raf(2);
const rainPill=btn(t=>t==='🌧️ 雨');
if(!rainPill)fail('日期卡缺天氣列');
console.log('設定卡集中 OK');
// ---- v95 搜尋結果帶行程 ----
btn(t=>t==='總覽').click(); await raf(2);
const d1b=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='切換到 1 日');
d1b.click(); await raf(2);
const sBtn=[...doc.querySelectorAll('button')].find(b=>b.getAttribute&&b.getAttribute('aria-label')==='全域搜尋');
sBtn.click(); await raf(2);
const sInp=[...doc.querySelectorAll('input')].find(i=>i.closest('#search-overlay-v88'));
if(!sInp)fail('搜尋框缺');
setVal(sInp,'科罗布斯'); await raf(2);
const ov=doc.getElementById('search-overlay-v88');
if(!ov.textContent.includes('科罗布斯'))fail('新名搜尋未命中');
setVal(sInp,'克羅巴斯'); await raf(2);
if(!ov.textContent.includes('科罗布斯'))fail('舊名別名未命中');
setVal(sInp,'罗宾'); await raf(2);
if(!ov.textContent.includes('📍')||!ov.textContent.includes('木匠的商店'))fail('搜尋列缺行程');
console.log('搜尋列帶行程＋新舊名 OK');
[...ov.querySelectorAll('button')].find(b=>(b.textContent||'').includes('×')||b.getAttribute('aria-label')==='關閉搜尋')?.click(); await raf(2);
// ---- v96 種植：總覽倒數＋物品卡 🌱（手帳春1） ----
btn(t=>t==='總覽').click(); await raf(2);
if(!doc.body.textContent.includes('還來得及種'))fail('總覽缺倒數提示');
if(!doc.body.textContent.includes('草莓 至春20'))fail('倒數 chips 未直接攤開');
btn(t=>t.includes('草莓 至春20')).click(); await raf(3);
const bt2=doc.body.textContent;
if(!bt2.includes('🌱 種植'))fail('物品卡缺種植段');
if(!bt2.includes('生長 8 天'))fail('草莓生長天數錯');
if(!bt2.includes('最後可種日 春20'))fail('最後可種日計算錯');
console.log('種植：倒數→物品卡→計算 OK');
// ---- v96.2 助手：貨車日＋明日生日 ----
btn(t=>t==='總覽').click(); await raf(2);
const d5b=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='切換到 5 日');
d5b.click(); await raf(2);
if(!doc.body.textContent.includes('旅行貨車營業中'))fail('週五無貨車卡');
const d6b=[...doc.querySelectorAll('button[aria-label]')].find(b=>b.getAttribute('aria-label')==='切換到 6 日');
d6b.click(); await raf(2);
if(!doc.body.textContent.includes('明天是')||!doc.body.textContent.includes('生日'))fail('春6 無明日生日卡');
console.log('助手：貨車日＋明日生日 OK');
console.log('SMOKE OK');
