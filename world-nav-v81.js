/* v81 — complete World UI replacement. Old v73-v80 overlays are not used. */
(()=>{
'use strict';
const D=window.SDVWorldNavV81Data;if(!D)return;
const n=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[\s·・_'’\-／/（）()：:]+/g,'');
const A=()=>window.SDVLocalGameFilesV67||{};
const state={stack:[D.root],mode:'places',selected:null,suspended:false,host:null,root:null,hidden:[]};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const node=()=>D.nodes[state.stack[state.stack.length-1]]||D.nodes[D.root];
const mapSrc=o=>o.mapLocal?(A()[o.mapLocal]||''):o.map||'';
const originalButtons=()=>[...document.querySelectorAll('button')].filter(b=>!b.closest('#sdv-world-v81'));
const originalQuick=kind=>originalButtons().find(b=>n(b.textContent).includes(n(kind==='fish'?'按条件找鱼':'按条件找人'))||n(b.textContent).includes(n(kind==='fish'?'按條件找魚':'按條件找人')))||null;
function findHost(){
  const image=document.querySelector('img[alt="星露谷地圖"]');
  if(!image)return null;
  let el=image.parentElement;
  while(el&&el!==document.body){
    const t=n(el.textContent);
    if(t.includes(n('世界'))&&(t.includes(n('按条件找鱼'))||t.includes(n('按條件找魚'))))return el;
    el=el.parentElement;
  }
  return null;
}
function isSectionTitle(el){const t=n(el.textContent);return !el.querySelector('button')&&t==='世界'&&el.textContent.length<12}
function hideLegacy(host){
  state.hidden=[];
  [...host.children].forEach(el=>{if(el.id==='sdv-world-v81'||isSectionTitle(el))return;state.hidden.push([el,el.style.display]);el.style.display='none'});
}
function restoreLegacy(){state.hidden.forEach(([el,d])=>{if(el?.isConnected)el.style.display=d||''});state.hidden=[];state.root?.remove();state.root=null;state.host=null}
function suspend(kind){
  const b=originalQuick(kind);if(!b||b.disabled)return;
  state.suspended=true;restoreLegacy();b.click();
}
const icon=(name,size=28)=>{const src=A()[name];return src?`<img src="${esc(src)}" alt="" style="width:${size}px;height:${size}px;object-fit:contain;image-rendering:pixelated">`:''};
function styles(){if(document.getElementById('sdv-world-v81-style'))return;const s=document.createElement('style');s.id='sdv-world-v81-style';s.textContent=`
#sdv-world-v81{color:#4a2f20;font-family:inherit}.sdv81-head{display:flex;align-items:flex-start;gap:8px;margin:4px 1px 7px}.sdv81-head-info{min-width:0;flex:1}.sdv81-title{font-size:12px;font-weight:950;line-height:1.12}.sdv81-summary{font-size:7.4px;color:#806b51;line-height:1.35;margin-top:2px}.sdv81-quick{display:flex;gap:4px;flex:0 0 auto}.sdv81-quick button{border:1px solid #c6a66b;background:#fff8e7;border-radius:9px;padding:5px 7px;font-size:7px;font-weight:900;color:#356481;white-space:nowrap}.sdv81-quick button:disabled{opacity:.45;color:#7a7469}.sdv81-back{width:100%;border:1.5px solid #c96d38;background:#fff4d8;border-radius:10px;padding:8px 9px;text-align:left;color:#4a2f20;font-weight:950;margin-bottom:7px}.sdv81-crumb{font-size:6.8px;color:#8a755d;font-weight:700;margin-top:2px}.sdv81-map-card{border:1.5px solid #d1b170;background:#fff9e8;border-radius:12px;padding:7px;box-shadow:0 2px 6px rgba(91,61,28,.12)}.sdv81-map{position:relative;border:1px solid #c9a85f;border-radius:9px;overflow:hidden;background:#dce9c2}.sdv81-map>img{display:block;width:100%;height:auto;max-height:none;object-fit:contain;image-rendering:pixelated}.sdv81-fallback{min-height:210px;display:flex;align-items:center;justify-content:center;padding:20px;color:#806b51;font-size:9px;text-align:center}.sdv81-pin{position:absolute;transform:translate(-50%,-100%);border:0;background:transparent;padding:0;z-index:4;filter:drop-shadow(0 1px 1px rgba(50,28,8,.3));max-width:none}.sdv81-pin .b{display:flex;align-items:center;gap:3px;border:1.5px solid #8b683c;border-radius:9px;background:rgba(255,249,228,.97);padding:3px 6px;color:#4a2f20;font-size:7px;font-weight:950;white-space:nowrap}.sdv81-pin .stem{display:block;width:2px;height:7px;background:#9c3d2b;margin:-1px auto 0}.sdv81-pin .dot{display:block;width:8px;height:8px;border:2px solid #fff4d8;border-radius:50%;background:#9c3d2b;margin:-1px auto 0;box-shadow:0 0 0 1px #743325}.sdv81-pin.portal .b{border-color:#c7602e;background:#fff0cf}.sdv81-pin.portal .stem,.sdv81-pin.portal .dot{background:#d26a36}.sdv81-pin.fish .b{border-color:#4e7e97;background:#eef9ff;color:#28576f}.sdv81-pin.fish .stem,.sdv81-pin.fish .dot{background:#4e7e97}.sdv81-pin.sel{z-index:12}.sdv81-pin.sel .b{background:#ffd77f;border-color:#b54e27;transform:scale(1.08);box-shadow:0 0 0 2px rgba(255,246,220,.9)}.sdv81-pin.fish.sel .b{background:#cfeeff;border-color:#397d9d}.sdv81-mode{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px}.sdv81-mode button{border:1.5px solid #c9aa6b;background:#fff9e9;border-radius:10px;min-height:54px;display:flex;align-items:center;justify-content:center;gap:9px;color:#5c3c28;font-size:9.4px;font-weight:950}.sdv81-mode button.on{border-color:#c7602e;background:#ffe2a8}.sdv81-mode button.fish.on{border-color:#4f86a1;background:#ddecf7;color:#28576f}.sdv81-detail{margin-top:8px;border:1.5px solid #c96d38;background:#fff9ed;border-radius:11px;padding:9px;box-shadow:0 2px 6px rgba(91,61,28,.08)}.sdv81-detail h3{margin:0;font-size:11px}.sdv81-tag{display:inline-block;font-size:6.6px;font-weight:950;padding:2px 5px;border-radius:7px;background:#ffe8a8;color:#9a5b22;margin-bottom:4px}.sdv81-detail p{font-size:7.6px;line-height:1.45;color:#6e5a44;margin:5px 0}.sdv81-detail ul{padding-left:16px;margin:5px 0 0;font-size:7.5px;line-height:1.55}.sdv81-action{margin-top:7px;border:1px solid #c9aa6b;background:#fff4d8;border-radius:8px;padding:5px 8px;font-size:7.6px;font-weight:950;color:#356481}.sdv81-empty{padding:9px 4px 2px;text-align:center;color:#8a755d;font-size:7.5px}.sdv81-root-note{font-size:7.2px;color:#806b51;text-align:center;margin-top:5px}.sdv81-legend{display:flex;justify-content:center;gap:10px;font-size:6.8px;color:#806b51;margin-top:6px}.sdv81-legend b{color:#4a2f20}@media(min-width:520px){.sdv81-pin .b{font-size:7.7px;padding:4px 7px}.sdv81-title{font-size:13px}}
`;document.head.appendChild(s)}
function legacyPlace(p){const db=window.SDVWorldV70;if(!db||!p?.worldPlaceId)return null;return (db.places||[]).find(x=>x.id===p.worldPlaceId)||null}
function detailHtml(sel){if(!sel)return '';
  if(sel.kind==='place'){
    const p=sel.item,l=legacyPlace(p),requires=p.requires||l?.requires||'',hours=l?.hours||'',desc=p.description||'',services=l?.services||[];
    return `<div class="sdv81-detail"><span class="sdv81-tag">地点</span><h3>${esc(p.label)}</h3>${hours?`<p><b>时间：</b>${esc(hours)}</p>`:''}${requires?`<p><b>解锁：</b>${esc(requires)}</p>`:''}${desc?`<p>${esc(desc)}</p>`:''}${services.length?`<ul>${services.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>`;
  }
  if(sel.kind==='fish'){
    const p=sel.item,f=D.fishAreas[p.fishAreaId]||{title:p.label,icon:'Sunfish'};
    return `<div class="sdv81-detail"><span class="sdv81-tag">钓点</span><div style="display:flex;align-items:center;gap:7px">${icon(f.icon,34)}<h3>${esc(f.title)}</h3></div><p>这个水域只归属于当前地图，不会再跨区域混到父地图。</p><button class="sdv81-action" data-act="fish-search">按条件查看可钓的鱼 ›</button></div>`;
  }
  return '';
}
function pinHtml(item,kind){const sel=state.selected?.kind===kind&&state.selected?.item?.id===item.id;const sym=kind==='portal'?(item.transport?'🚌':'➜'):kind==='fish'?'🎣':'📍';return `<button class="sdv81-pin ${kind} ${sel?'sel':''}" data-kind="${kind}" data-id="${esc(item.id)}" style="left:${item.x}%;top:${item.y}%" aria-label="${esc(item.label)}"><span class="b"><span>${sym}</span><span>${esc(item.label)}</span></span><span class="stem"></span><span class="dot"></span></button>`}
function render(){
  if(!state.root)return;const o=node(),src=mapSrc(o),root=o.root;
  const items=root?(o.portals||[]):state.mode==='spots'?(o.spots||[]):[...(o.places||[]),...(o.portals||[])];
  const pins=items.map(x=>pinHtml(x,root||x.to?'portal':state.mode==='spots'?'fish':'place')).join('');
  const crumb=state.stack.map(id=>D.nodes[id]?.name||id).join(' › '),prev=state.stack.length>1?D.nodes[state.stack[state.stack.length-2]]:null;
  const fishBtn=originalQuick('fish'),personBtn=originalQuick('person');
  state.root.innerHTML=`<div class="sdv81-head"><div class="sdv81-head-info"><div class="sdv81-title">${esc(o.name)}</div><div class="sdv81-summary">${esc(o.summary||'')}</div></div><div class="sdv81-quick"><button data-act="quick-fish" ${fishBtn?.disabled?'disabled':''}>🎣 按条件找鱼</button><button data-act="quick-person" ${personBtn?.disabled?'disabled':''}>👤 按条件找人</button></div></div>${prev?`<button class="sdv81-back" data-act="back">← 返回 ${esc(prev.name)}<div class="sdv81-crumb">${esc(crumb)}</div></button>`:''}<div class="sdv81-map-card"><div class="sdv81-map">${src?`<img src="${esc(src)}" alt="${esc(o.name)}地图" data-map-img>`:`<div class="sdv81-fallback">${esc(o.name)}目前没有可用地图图档。</div>`}${pins}</div>${root?`<div class="sdv81-root-note">点地图上的大区域传送门进入区域地图。</div><div class="sdv81-legend"><span><b>➜</b> 区域入口</span><span><b>🚌</b> 交通路线</span></div>`:`<div class="sdv81-mode"><button data-act="mode-place" class="${state.mode==='places'?'on':''}">${icon('Warp Totem Farm',32)}地点／入口</button><button data-act="mode-fish" class="fish ${state.mode==='spots'?'on':''}">${icon('Sunfish',32)}钓点</button></div>`}</div>${detailHtml(state.selected)}${!root&&!state.selected?`<div class="sdv81-empty">${state.mode==='spots'?'点地图上的水域查看钓点。':'点地图上的地点，或从入口进入下一张地图。'}</div>`:''}`;
  const im=state.root.querySelector('[data-map-img]');if(im)im.addEventListener('error',()=>{im.style.display='none';const d=document.createElement('div');d.className='sdv81-fallback';d.textContent='地图图档暂时无法载入，但路线与地点仍可使用。';im.after(d)},{once:true});
}
function clickPin(kind,id){const o=node();let arr=kind==='fish'?(o.spots||[]):kind==='portal'?(o.portals||[]):(o.places||[]);if(kind==='portal'&&!o.root)arr=[...(o.portals||[])];if(o.root)arr=o.portals||[];const item=arr.find(x=>x.id===id);if(!item)return;if(kind==='portal'){if(!D.nodes[item.to])return;state.stack.push(item.to);state.mode='places';state.selected=null;render();return}state.selected={kind,item};render()}
function events(e){const b=e.target.closest('button');if(!b||!state.root?.contains(b))return;const act=b.dataset.act;if(act==='back'){state.stack.pop();state.mode='places';state.selected=null;render();return}if(act==='mode-place'){state.mode='places';state.selected=null;render();return}if(act==='mode-fish'){state.mode='spots';state.selected=null;render();return}if(act==='quick-fish'||act==='fish-search'){suspend('fish');return}if(act==='quick-person'){suspend('person');return}if(b.dataset.kind)clickPin(b.dataset.kind,b.dataset.id)}
function mount(){
  if(state.suspended)return;const host=findHost();if(!host)return;if(state.host===host&&state.root?.isConnected)return;restoreLegacy();state.host=host;hideLegacy(host);styles();const root=document.createElement('div');root.id='sdv-world-v81';root.addEventListener('click',events);host.appendChild(root);state.root=root;render();
}
let scheduled=false;function tick(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;if(state.suspended){if(document.querySelector('img[alt="星露谷地圖"]')){state.suspended=false;mount()}return}mount()})}
new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('resize',()=>state.root&&render(),{passive:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
})();
