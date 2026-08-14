/* v83 — standalone World UI with direct fish data, global fish filters and cross-page links. */
(()=>{
'use strict';
const D=window.SDVWorldNavV81Data,F=window.SDVWorldFishV83;if(!D||!F)return;
const A=()=>window.SDVLocalGameFilesV67||{};
const N=()=>window.SDVSwitchNamesV47||{};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[\s·・_'’\-／/（）()：:]+/g,'');
const W=file=>`https://stardewvalleywiki.com/Special:Redirect/file/${encodeURIComponent(String(file||'')+'.png')}`;
const imageSrc=file=>A()[file]||W(file);
const state={stack:[D.root],selected:null,findFish:false,filters:{q:'',season:'',weather:'',time:'',location:'all'},host:null,root:null,hidden:[],dataLoading:false};
const node=()=>D.nodes[state.stack[state.stack.length-1]]||D.nodes[D.root];
const mapSrc=o=>o.mapLocal?(A()[o.mapLocal]||''):o.map||'';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const originalButtons=()=>[...document.querySelectorAll('button')].filter(b=>!b.closest('#sdv-world-v83'));

function lookupTopButton(label){
  return originalButtons().find(b=>{if(n(b.textContent)!==n(label))return false;const p=b.parentElement;if(!p)return false;const texts=[...p.children].filter(x=>x.tagName==='BUTTON').map(x=>n(x.textContent));return texts.includes(n('世界'))&&texts.includes(n('物品'))})||null;
}
function bottomNavButton(label){
  const rows=originalButtons().filter(b=>n(b.textContent)===n(label));
  return rows.find(b=>{const r=b.getBoundingClientRect();return r.top>window.innerHeight*.55})||rows[rows.length-1]||null;
}
function setReactInput(input,value){
  const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value')?.set;
  if(setter)setter.call(input,value);else input.value=value;
  input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
}
function socialByKey(key){
  const map=window.SDVSocialV50?.byZh||{};if(map[key])return {key,data:map[key]};
  const hit=Object.entries(map).find(([zh,row])=>n(zh)===n(key)||n(row?.english)===n(key));return hit?{key:hit[0],data:hit[1]}:null;
}
const singleNpcs=new Set(['阿比蓋爾','艾蜜麗','海莉','莉亞','瑪魯','潘妮','亞歷克斯','艾利歐特','哈維','山姆','塞巴斯蒂安','謝恩'].map(n));
const specialNpcs=new Set(['桑迪','克羅巴斯','矮人','雷歐'].map(n));
async function openNpcLink(raw){
  const hit=socialByKey(raw),name=hit?.key||raw;bottomNavButton('社交')?.click();await sleep(90);
  const key=n(name),group=singleNpcs.has(key)?'可交往對象':specialNpcs.has(key)?'特殊角色':'村民';
  const groupBtn=[...document.querySelectorAll('main button')].find(b=>n(b.textContent)===n(group));groupBtn?.click();await sleep(90);
  const candidates=[...document.querySelectorAll('main button')].filter(b=>n(b.textContent).includes(key));
  candidates.sort((a,b)=>String(a.textContent).length-String(b.textContent).length);candidates[0]?.click();await sleep(50);
  window.scrollTo({top:0,left:0,behavior:'auto'});
}
const ITEM_ZH={
  'Monster Fireplace':'怪物壁爐','Crystal Floor':'水晶地板','Wicked Statue':'邪惡雕像','Wizard Catalogue':'巫師目錄','Butterfly Powder':'蝴蝶粉','Return Scepter':'回程魔杖','Stardrop':'星之果實',
  'Void Egg':'虛空蛋','Solar Essence':'太陽精華','Void Essence':'虛空精華','Iridium Sprinkler':'銥製灑水器','Bat Wing':'蝙蝠翅膀','Mixed Seeds':'混合種子','Omni Geode':'萬象晶球',
  'Hardwood Fence':'硬木柵欄','Slime':'史萊姆泥','Fiber':'纖維','Warp Totem Farm':'農場傳送圖騰','Warp Totem Mountains':'山嶺傳送圖騰','Warp Totem Beach':'海灘傳送圖騰','Warp Totem Desert':'沙漠傳送圖騰'
};
function lookupRow(raw){
  const base=String(raw||'').replace(/ Recipe$/,'');const rows=window.SDVLookupV46?.items||[];return rows.find(x=>[x.name,x.file,x.zh,...(x.aliases||[])].some(v=>n(v)===n(base)))||null;
}
function itemMeta(raw){
  const recipe=/ Recipe$/.test(String(raw||'')),base=String(raw||'').replace(/ Recipe$/,''),row=lookupRow(base),map=N();
  let name=ITEM_ZH[base]||map[base]||map[String(base).toLowerCase()]||row?.zh||base;if(recipe&&!/配方$/.test(name))name+='配方';
  return {raw:String(raw||''),base,file:row?.file||base,name};
}
async function ensureData(){
  if(state.dataLoading)return;state.dataLoading=true;
  try{const lazy=window.SDVLazyDataV67;if(lazy?.load)await Promise.allSettled([lazy.load('world'),lazy.load('lookup')]);}catch(e){console.warn('v83 lazy data load failed',e)}
  state.dataLoading=false;if(state.root?.isConnected)render();
}
async function openItemLink(raw){
  await ensureData();const meta=itemMeta(raw);bottomNavButton('查找')?.click();await sleep(70);lookupTopButton('物品')?.click();await sleep(90);
  const input=[...document.querySelectorAll('main input')].find(x=>/繁中|簡中|English|物品名稱|物品名称/.test(String(x.placeholder||'')));
  if(input){setReactInput(input,meta.base);await sleep(130)}
  const keys=[meta.name,lookupRow(meta.base)?.zh,meta.base].filter(Boolean).map(n);const candidates=[...document.querySelectorAll('main button')].filter(b=>keys.some(k=>n(b.textContent).includes(k)));
  candidates.sort((a,b)=>String(a.textContent).length-String(b.textContent).length);candidates[0]?.click();await sleep(60);
  document.getElementById('lookup-detail-v62')?.scrollIntoView({block:'start',behavior:'auto'});
}

function findHost(){
  const image=document.querySelector('img[alt="星露谷地圖"]');if(!image)return null;let el=image.parentElement;
  while(el&&el!==document.body){const t=n(el.textContent);if(t.includes(n('世界'))&&(t.includes(n('按条件找鱼'))||t.includes(n('按條件找魚'))))return el;el=el.parentElement}return null;
}
function isSectionTitle(el){const t=n(el.textContent);return !el.querySelector('button')&&t==='世界'&&String(el.textContent||'').length<12}
function hideLegacy(host){
  [...host.children].forEach(el=>{if(el.id==='sdv-world-v83'||isSectionTitle(el))return;if(!el.dataset.sdv83Hidden){el.dataset.sdv83Hidden='1';el.dataset.sdv83Display=el.style.display||''}el.style.display='none'});
}
function restoreLegacy(){
  state.hidden.forEach(()=>{});if(state.host?.isConnected)[...state.host.children].forEach(el=>{if(el.dataset?.sdv83Hidden){el.style.display=el.dataset.sdv83Display||'';delete el.dataset.sdv83Hidden;delete el.dataset.sdv83Display}});
  state.root?.remove();state.root=null;state.host=null;
}
function resetWorld(){state.stack=[D.root];state.selected=null;state.findFish=false;state.filters={q:'',season:'',weather:'',time:'',location:'all'};if(state.root?.isConnected)render()}

const icon=(file,size=28)=>file?`<img src="${esc(imageSrc(file))}" alt="" loading="lazy" style="width:${size}px;height:${size}px;object-fit:contain;image-rendering:pixelated;flex:0 0 auto">`:'';
function styles(){if(document.getElementById('sdv-world-v83-style'))return;const s=document.createElement('style');s.id='sdv-world-v83-style';s.textContent=`
#sdv-world-v83{color:#4a2f20;font-family:inherit}.sdv83-head{display:flex;align-items:flex-start;gap:7px;margin:4px 1px 7px}.sdv83-head-info{min-width:0;flex:1}.sdv83-title{font-size:12px;font-weight:950}.sdv83-summary{font-size:7.4px;color:#806b51;line-height:1.35;margin-top:2px}.sdv83-quick{display:flex;gap:4px;flex:0 0 auto}.sdv83-quick button{border:1px solid #c6a66b;background:#fff8e7;border-radius:9px;padding:5px 7px;font-size:7px;font-weight:900;color:#356481;white-space:nowrap}.sdv83-quick button:disabled{opacity:.45}.sdv83-back{width:100%;border:1.5px solid #c96d38;background:#fff4d8;border-radius:10px;padding:8px 9px;text-align:left;color:#4a2f20;font-weight:950;margin-bottom:7px}.sdv83-crumb{font-size:6.8px;color:#8a755d;margin-top:2px}.sdv83-map-card{border:1.5px solid #d1b170;background:#fff9e8;border-radius:12px;padding:7px}.sdv83-map{position:relative;border:1px solid #c9a85f;border-radius:9px;overflow:hidden;background:#dce9c2}.sdv83-map>img{display:block;width:100%;height:auto;image-rendering:pixelated}.sdv83-fallback{min-height:210px;display:flex;align-items:center;justify-content:center;padding:20px;color:#806b51;font-size:9px;text-align:center}.sdv83-pin{position:absolute;transform:translate(-50%,-100%);border:0;background:transparent;padding:0;z-index:4;filter:drop-shadow(0 1px 1px rgba(50,28,8,.3));max-width:none}.sdv83-pin .b{display:flex;align-items:center;gap:3px;border:1.5px solid #8b683c;border-radius:9px;background:rgba(255,249,228,.97);padding:3px 6px;color:#4a2f20;font-size:7px;font-weight:950;white-space:nowrap}.sdv83-pin .stem{display:block;width:2px;height:7px;background:#9c3d2b;margin:-1px auto 0}.sdv83-pin .dot{display:block;width:8px;height:8px;border:2px solid #fff4d8;border-radius:50%;background:#9c3d2b;margin:-1px auto 0}.sdv83-pin.portal .b{border-color:#c7602e;background:#fff0cf}.sdv83-pin.portal .stem,.sdv83-pin.portal .dot{background:#d26a36}.sdv83-pin.fish .b{border-color:#397d9d;background:#eef9ff;color:#174c66}.sdv83-pin.fish .stem,.sdv83-pin.fish .dot{background:#397d9d}.sdv83-pin.sel{z-index:12}.sdv83-pin.sel .b{background:#ffd77f;border-color:#b54e27;transform:scale(1.08)}.sdv83-pin.fish.sel .b{background:#cfeeff;border-color:#397d9d}.sdv83-legend{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;font-size:6.8px;color:#806b51;margin-top:6px}.sdv83-detail,.sdv83-find{margin-top:8px;border:1.5px solid #c96d38;background:#fff9ed;border-radius:11px;padding:9px}.sdv83-detail h3,.sdv83-find h3{margin:0;font-size:11px}.sdv83-tag{display:inline-block;font-size:6.6px;font-weight:950;padding:2px 5px;border-radius:7px;background:#ffe8a8;color:#9a5b22;margin-bottom:4px}.sdv83-section{padding-top:8px;margin-top:8px;border-top:1px dashed #d9bd82}.sdv83-section h4{margin:0 0 5px;font-size:8px;color:#5c3c28}.sdv83-detail p{font-size:7.6px;line-height:1.45;color:#6e5a44;margin:4px 0}.sdv83-detail ul{padding-left:16px;margin:4px 0;font-size:7.5px;line-height:1.55}.sdv83-npcs{display:grid;gap:5px}.sdv83-npc{display:flex;width:100%;gap:7px;align-items:center;text-align:left;border:1px solid #ddc99f;background:#fffdf6;border-radius:9px;padding:6px;color:#4a2f20}.sdv83-npc b{font-size:8.4px}.sdv83-npc span{display:block;font-size:6.8px;color:#75624d;margin-top:1px}.sdv83-shop-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:6px}.sdv83-shop-item{display:grid;grid-template-columns:30px minmax(0,1fr);gap:5px;align-items:center;border:1px solid #dfcda8;background:#fffdf7;border-radius:8px;padding:5px;text-align:left;color:#4a2f20;min-width:0}.sdv83-shop-item img{width:28px;height:28px;object-fit:contain;image-rendering:pixelated}.sdv83-shop-item b{display:block;font-size:7.2px;line-height:1.15}.sdv83-shop-item span{display:block;font-size:6.5px;color:#806b51;margin-top:1px}.sdv83-fish-list{display:grid;gap:5px;margin-top:7px}.sdv83-fish-card{display:grid;grid-template-columns:38px minmax(0,1fr);gap:7px;align-items:center;width:100%;border:1px solid #d8bd80;background:#fffdf7;border-radius:9px;padding:6px;text-align:left;color:#4a2f20}.sdv83-fish-card img{width:36px;height:36px;object-fit:contain;image-rendering:pixelated}.sdv83-fish-card b{display:block;font-size:8.8px}.sdv83-badges{display:flex;gap:3px;flex-wrap:wrap;margin-top:3px}.sdv83-badge{font-size:6.4px;font-weight:900;padding:2px 4px;border-radius:7px;background:#f0e2c5}.sdv83-badge.weather{background:#ddebf7}.sdv83-badge.time{background:#e5edf2;color:#356481}.sdv83-find-head{display:flex;align-items:center;gap:6px}.sdv83-find-head h3{flex:1}.sdv83-close{border:0;background:transparent;font-size:14px;color:#6b513d;font-weight:950}.sdv83-input{width:100%;border:1.5px solid #d1b170;background:#fffdf7;border-radius:8px;padding:7px 9px;font-size:9px;color:#4a2f20;outline:none;margin-top:6px}.sdv83-filter-row{display:grid;grid-template-columns:36px minmax(0,1fr);gap:5px;align-items:start;margin-top:6px}.sdv83-filter-label{font-size:7px;font-weight:950;color:#806b51;padding-top:5px}.sdv83-pills{display:flex;gap:4px;flex-wrap:wrap}.sdv83-pill{border:1px solid #c9aa6b;background:#fffdf7;border-radius:13px;padding:4px 7px;font-size:7px;font-weight:900;color:#6e5a44}.sdv83-pill.on{border-color:#c7602e;background:#ffe2a8;color:#4a2f20}.sdv83-select{width:100%;border:1px solid #c9aa6b;background:#fffdf7;border-radius:8px;padding:5px 7px;font-size:8px;color:#4a2f20}.sdv83-results{display:grid;gap:5px;margin-top:7px;max-height:430px;overflow:auto;-webkit-overflow-scrolling:touch}.sdv83-result{border:1px solid #d8bd80;background:#fffdf7;border-radius:9px;padding:6px;display:grid;grid-template-columns:34px minmax(0,1fr);gap:6px}.sdv83-result>img{width:32px;height:32px;object-fit:contain;image-rendering:pixelated}.sdv83-result b{font-size:8.6px}.sdv83-spots{display:flex;gap:3px;flex-wrap:wrap;margin-top:4px}.sdv83-spot{border:1px solid #c9aa6b;background:#fff4d8;border-radius:8px;padding:3px 5px;font-size:6.5px;font-weight:900;color:#356481}.sdv83-empty{font-size:7.5px;color:#806b51;text-align:center;padding:8px}.sdv83-linkhint{font-size:6.4px;color:#9a5b22;font-weight:900;margin-top:2px}@media(min-width:520px){.sdv83-pin .b{font-size:7.7px}.sdv83-shop-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;document.head.appendChild(s)}

function legacyPlace(p){const db=window.SDVWorldV70;if(!db||!p?.worldPlaceId)return null;return (db.places||[]).find(x=>x.id===p.worldPlaceId)||null}
function personById(id){return window.SDVWorldV70?.people?.[id]||null}
function peopleForPlace(p,l){
  const out=[],seen=new Set();const add=(person,key,data)=>{const label=key||person?.name;if(!label||seen.has(n(label)))return;seen.add(n(label));out.push({person,key:label,data})};
  (l?.peopleIds||[]).forEach(id=>{const person=personById(id);if(!person)return;let hit=null;for(const k of [...(person.socialKeys||[]),person.name,...(person.aliases||[])]){hit=socialByKey(k);if(hit)break}add(person,hit?.key,hit?.data)});
  const text=n(p?.label);[['潘姆','潘姆'],['科罗布斯','克羅巴斯'],['科羅布斯','克羅巴斯'],['矮人','矮人'],['莱纳斯','萊納斯'],['萊納斯','萊納斯'],['齐先生','齊先生'],['齊先生','齊先生']].forEach(([needle,key])=>{if(text.includes(n(needle))){const hit=socialByKey(key);if(hit)add(null,hit.key,hit.data)}});return out;
}
function shopForPlace(l,people){for(const p of [personById(l?.ownerId),...people.map(x=>x.person)].filter(Boolean)){for(const k of [...(p.socialKeys||[]),p.name,...(p.aliases||[])]){const h=socialByKey(k);if(h?.data?.shop)return h.data.shop}}for(const x of people)if(x.data?.shop)return x.data.shop;return null}
function placeDetail(sel){
  const p=sel.item,l=legacyPlace(p),people=peopleForPlace(p,l),shop=shopForPlace(l,people),hours=shop?.hours||l?.hours||'',requires=p.requires||l?.requires||'',desc=p.description||'',services=l?.services||[];
  const npcHtml=people.length?`<div class="sdv83-section"><h4>NPC</h4><div class="sdv83-npcs">${people.map(row=>`<button class="sdv83-npc" data-link-npc="${esc(row.key)}">${icon(row.person?.icon||(row.data?.english?`${row.data.english} Icon`:''),32)}<span><b>${esc(row.key)}</b>${row.data?.intro?`<span>${esc(row.data.intro)}</span>`:''}<span class="sdv83-linkhint">點擊前往社交人物卡 ›</span></span></button>`).join('')}</div></div>`:'';
  const shopHtml=shop?.items?.length?`<div class="sdv83-section"><h4>商店</h4><div style="font-size:6.7px;color:#75624d">${esc(shop.label||p.label)}${shop.hours?` · ${esc(shop.hours)}`:''}</div><div class="sdv83-shop-grid">${shop.items.map((it,i)=>{const m=itemMeta(it.name||'');return `<button class="sdv83-shop-item" data-link-item="${esc(it.name||'')}" aria-label="查看${esc(m.name)}詳細資料"><img src="${esc(imageSrc(m.file))}" alt=""><span><b>${esc(m.name)}</b>${it.price!=null?`<span>${Number(it.price).toLocaleString()}g</span>`:it.availability?`<span>${esc(it.availability)}</span>`:''}<span class="sdv83-linkhint">物品詳細卡 ›</span></span></button>`}).join('')}</div></div>`:'';
  return `<div class="sdv83-detail"><span class="sdv83-tag">地点</span><h3>${esc(p.label)}</h3><div class="sdv83-section"><h4>地点说明</h4>${desc?`<p>${esc(desc)}</p>`:''}${hours?`<p><b>时间：</b>${esc(hours)}</p>`:''}${requires?`<p><b>解锁：</b>${esc(requires)}</p>`:''}${services.length?`<ul>${services.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>${npcHtml}${shopHtml}</div>`;
}
function rule(i){return F.rules[i]||{s:['春','夏','秋','冬'],w:'任意',t:[[6,26]]}}
function seasons(area,i){return area?.forceSeasons||area?.seasonOverride?.[i]||rule(i).s}
function fmtHour(x){return x>=24?`${String(x-24).padStart(2,'0')}:00`:`${String(x).padStart(2,'0')}:00`}
function timeText(area,i){const w=area?.timeOverride||rule(i).t||[[6,26]];if(w.length===1&&w[0][0]===6&&w[0][1]===26)return '全天';return w.map(([a,b])=>`${fmtHour(a)}–${fmtHour(b)}`).join('／')}
function fishName(i){const file=F.files[i],map=N(),fallback=F.names[i]||file;return map[file]||map[String(file||'').toLowerCase()]||fallback}
function fishCard(area,i){const r=rule(i),ss=seasons(area,i),day=area.days?` · ${area.days.join('、')}日`:'';return `<button class="sdv83-fish-card" data-link-item="${esc(F.files[i])}"><img src="${esc(imageSrc(F.files[i]))}" alt=""><span><b>${esc(fishName(i))}${r.legend?' · 傳說':''}</b><span class="sdv83-badges"><span class="sdv83-badge">${esc(ss.length===4?'四季':ss.join('／'))}${esc(day)}</span><span class="sdv83-badge weather">${esc(r.w)}</span><span class="sdv83-badge time">${esc(timeText(area,i))}</span></span><span class="sdv83-linkhint">點擊查看物品詳細卡 ›</span></span></button>`}
function fishDetail(sel){const p=sel.item,area=F.areas.find(x=>x.id===p.fishAreaId);if(!area)return `<div class="sdv83-detail"><h3>${esc(p.label)}</h3><p>這個釣點資料尚未對應。</p></div>`;return `<div class="sdv83-detail"><span class="sdv83-tag">钓点</span><div style="display:flex;align-items:center;gap:7px">${icon(area.icon,34)}<div><h3>${esc(area.name)} · ${esc(area.sub)}</h3><div style="font-size:6.8px;color:#806b51">直接顯示這個水域的魚，不再跳到條件搜尋。</div></div></div><div class="sdv83-fish-list">${area.fish.map(i=>fishCard(area,i)).join('')}</div>${area.tip?`<p>${esc(area.tip)}</p>`:''}</div>`}
function detailHtml(sel){if(!sel)return'';return sel.kind==='place'?placeDetail(sel):sel.kind==='fish'?fishDetail(sel):''}

function pinHtml(item,kind){const on=state.selected?.kind===kind&&state.selected?.item?.id===item.id,sym=kind==='portal'?(item.transport?'🚌':'➜'):kind==='fish'?'🎣':'📍';return `<button class="sdv83-pin ${kind} ${on?'sel':''}" data-kind="${kind}" data-id="${esc(item.id)}" style="left:${item.x}%;top:${item.y}%"><span class="b"><span>${sym}</span><span>${esc(item.label)}</span></span><span class="stem"></span><span class="dot"></span></button>`}
function locationOptions(){return F.locations.map(x=>`<option value="${esc(x.id)}" ${state.filters.location===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}
function overlaps(windows,seg){return windows.some(([a,b])=>a<seg.range[1]&&b>seg.range[0])}
function areaAllowed(area){const loc=F.locations.find(x=>x.id===state.filters.location);return !loc||loc.id==='all'||loc.areas.includes(area.id)}
function fishMatches(area,i){const f=state.filters,r=rule(i);if(!areaAllowed(area))return false;if(f.season&&!seasons(area,i).includes(f.season))return false;if(f.weather&&r.w!=='任意'&&r.w!==f.weather)return false;if(f.time){const seg=F.segments.find(x=>x.id===f.time);if(seg&&!overlaps(area.timeOverride||r.t||[[6,26]],seg))return false}if(f.q){const text=n(`${fishName(i)} ${F.names[i]} ${F.files[i]}`);if(!text.includes(n(f.q)))return false}return true}
function fishResults(){const map=new Map();for(const area of F.areas){for(const i of area.fish){if(!fishMatches(area,i))continue;if(!map.has(i))map.set(i,{i,areas:[]});map.get(i).areas.push(area)}}return [...map.values()]}
function findHtml(){if(!state.findFish)return'';const rows=fishResults();const pill=(kind,value,label)=>`<button class="sdv83-pill ${state.filters[kind]===value?'on':''}" data-filter="${kind}" data-value="${esc(value)}">${esc(label)}</button>`;return `<div class="sdv83-find"><div class="sdv83-find-head"><h3>按条件找鱼 · 全世界</h3><button class="sdv83-close" data-act="close-find">×</button></div><input class="sdv83-input" data-filter-input value="${esc(state.filters.q)}" placeholder="鱼名可选填，例如：鲶鱼、Catfish…"><div class="sdv83-filter-row"><span class="sdv83-filter-label">地点</span><select class="sdv83-select" data-filter-location>${locationOptions()}</select></div><div class="sdv83-filter-row"><span class="sdv83-filter-label">季节</span><div class="sdv83-pills">${pill('season','','全部')}${['春','夏','秋','冬'].map(x=>pill('season',x,x)).join('')}</div></div><div class="sdv83-filter-row"><span class="sdv83-filter-label">天气</span><div class="sdv83-pills">${pill('weather','','全部')}${pill('weather','晴','晴')}${pill('weather','雨','雨')}</div></div><div class="sdv83-filter-row"><span class="sdv83-filter-label">时间</span><div class="sdv83-pills">${pill('time','','不限')}${F.segments.map(x=>pill('time',x.id,x.name)).join('')}</div></div><div style="font-size:7px;color:#806b51;font-weight:900;margin-top:7px">找到 ${rows.length} 種魚；地点是独立筛选条件，不受你目前打开哪张地图影响。</div><div class="sdv83-results">${rows.map(({i,areas})=>`<div class="sdv83-result"><img src="${esc(imageSrc(F.files[i]))}" alt=""><div><b>${esc(fishName(i))}</b><div class="sdv83-spots">${areas.map(a=>`<button class="sdv83-spot" data-goto-area="${esc(a.id)}">${esc(a.name)} → ${esc(a.sub)}</button>`).join('')}</div></div></div>`).join('')||'<div class="sdv83-empty">目前沒有符合條件的魚。</div>'}</div></div>`}
function render(){
  if(!state.root)return;hideLegacy(state.host);const o=node(),src=mapSrc(o),root=o.root;const rows=root?(o.portals||[]).map(item=>({item,kind:'portal'})):[...(o.places||[]).map(item=>({item,kind:'place'})),...(o.portals||[]).map(item=>({item,kind:'portal'})),...(o.spots||[]).map(item=>({item,kind:'fish'}))];const pins=rows.map(x=>pinHtml(x.item,x.kind)).join(''),prev=state.stack.length>1?D.nodes[state.stack[state.stack.length-2]]:null,crumb=state.stack.map(id=>D.nodes[id]?.name||id).join(' › ');
  state.root.innerHTML=`<div class="sdv83-head"><div class="sdv83-head-info"><div class="sdv83-title">${esc(o.name)}</div><div class="sdv83-summary">${esc(o.summary||'')}</div></div><div class="sdv83-quick"><button data-act="open-find">🎣 按条件找鱼</button><button disabled title="待 NPC 今日行程資料完成">👤 按条件找人</button></div></div>${findHtml()}${prev?`<button class="sdv83-back" data-act="back">← 返回 ${esc(prev.name)}<div class="sdv83-crumb">${esc(crumb)}</div></button>`:''}<div class="sdv83-map-card"><div class="sdv83-map">${src?`<img src="${esc(src)}" alt="${esc(o.name)}地图" data-map-img>`:`<div class="sdv83-fallback">${esc(o.name)}目前没有可用地图图档。</div>`}${pins}</div><div class="sdv83-legend">${root?'':`<span>📍 地点</span>`}<span>➜ ${root?'区域入口':'入口／交通'}</span>${root?'':`<span>🎣 钓点</span>`}</div></div>${detailHtml(state.selected)}${!root&&!state.selected&&!state.findFish?'<div class="sdv83-empty">点地点看 NPC／商店；点钓点直接看鱼；所有资料卡都可继续跳到社交或物品。</div>':''}`;
  const im=state.root.querySelector('[data-map-img]');if(im)im.addEventListener('error',()=>{im.style.display='none';const d=document.createElement('div');d.className='sdv83-fallback';d.textContent='地图图档暂时无法载入，但路线与地点仍可使用。';im.after(d)},{once:true});
}
function clickPin(kind,id){const o=node(),arr=kind==='fish'?(o.spots||[]):kind==='portal'?(o.portals||[]):(o.places||[]),item=arr.find(x=>x.id===id);if(!item)return;if(kind==='portal'){if(!D.nodes[item.to])return;state.stack.push(item.to);state.selected=null;state.findFish=false;render();return}state.selected={kind,item};state.findFish=false;render();requestAnimationFrame(()=>state.root?.querySelector('.sdv83-detail')?.scrollIntoView({block:'nearest',behavior:'smooth'}))}
function pathTo(target){const q=[[D.root,[D.root]]],seen=new Set;while(q.length){const [id,path]=q.shift();if(id===target)return path;if(seen.has(id))continue;seen.add(id);for(const p of D.nodes[id]?.portals||[]){if(D.nodes[p.to]&&!seen.has(p.to))q.push([p.to,[...path,p.to]])}}return [D.root]}
function goToArea(areaId){const target=F.areaNode[areaId];if(!target||!D.nodes[target])return;state.stack=pathTo(target);const o=node(),item=(o.spots||[]).find(x=>x.fishAreaId===areaId);state.selected=item?{kind:'fish',item}:null;state.findFish=false;render();requestAnimationFrame(()=>state.root?.scrollIntoView({block:'start',behavior:'smooth'}))}
function events(e){
  const b=e.target.closest('button');if(b&&state.root?.contains(b)){
    const act=b.dataset.act;if(act==='back'){state.stack.pop();state.selected=null;state.findFish=false;render();return}if(act==='open-find'){state.findFish=!state.findFish;state.selected=null;render();return}if(act==='close-find'){state.findFish=false;render();return}if(b.dataset.filter){state.filters[b.dataset.filter]=b.dataset.value||'';render();return}if(b.dataset.gotoArea){goToArea(b.dataset.gotoArea);return}if(b.dataset.linkNpc){openNpcLink(b.dataset.linkNpc);return}if(b.dataset.linkItem){openItemLink(b.dataset.linkItem);return}if(b.dataset.kind){clickPin(b.dataset.kind,b.dataset.id);return}
  }
}
function changes(e){if(!state.root?.contains(e.target))return;if(e.target.matches('[data-filter-location]')){state.filters.location=e.target.value;render()}}
function inputs(e){if(!state.root?.contains(e.target)||!e.target.matches('[data-filter-input]'))return;state.filters.q=e.target.value;const pos=e.target.selectionStart;render();const input=state.root.querySelector('[data-filter-input]');if(input){input.focus();try{input.setSelectionRange(pos,pos)}catch{}}}
function mount(){
  const host=findHost();if(!host){if(state.root&&!state.root.isConnected){state.root=null;state.host=null}return}if(state.host===host&&state.root?.isConnected){hideLegacy(host);return}restoreLegacy();state.host=host;hideLegacy(host);styles();const root=document.createElement('div');root.id='sdv-world-v83';root.addEventListener('click',events);root.addEventListener('change',changes);root.addEventListener('input',inputs);host.appendChild(root);state.root=root;resetWorld();ensureData();render();
}
let scheduled=false;function tick(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;const host=findHost();if(!host){if(state.host&&!state.host.isConnected){state.root=null;state.host=null}return}mount()})}
new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.closest('#sdv-world-v83'))return;if(lookupTopButton('世界')===b){resetWorld();setTimeout(tick,0)}},true);window.addEventListener('resize',()=>state.root&&render(),{passive:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
})();
