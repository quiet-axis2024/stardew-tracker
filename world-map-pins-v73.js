/* v73 — region-map pin labels.
   Keep the full scene maps from v72, then place clickable labels in each detail
   image's own normalized coordinate system. These are not the old zoomed-world-map
   percentages; each region owns its own calibration.
*/
(()=>{
  'use strict';

  const PIN_CONFIG={
    '鹈鹕镇':{
      places:[
        {label:'社区中心',match:['社区中心'],x:29,y:16},
        {label:'哈维的诊所',match:['哈维的诊所'],x:29,y:43},
        {label:'皮埃尔的杂货店',match:['皮埃尔的杂货店'],x:39,y:43},
        {label:'星之果实酒吧',match:['星之果实酒吧'],x:34,y:57},
        {label:'Joja超市',match:['Joja超市'],x:83,y:39},
        {label:'铁匠铺',match:['铁匠铺'],x:74,y:63},
        {label:'博物馆',match:['博物馆'],x:83,y:71}
      ],
      spots:[
        {label:'河流',match:['鹈鹕镇','河流'],x:64,y:56}
      ]
    },
    '煤矿森林':{
      places:[
        {label:'秘密森林',match:['秘密森林'],x:4,y:13,dx:10},
        {label:'旅行货车',match:['旅行货车'],x:43,y:8,dy:10},
        {label:'法师塔',match:['法师塔'],x:6,y:25,dx:11},
        {label:'玛妮的牧场',match:['玛妮的牧场'],x:80,y:11},
        {label:'莉亚的农舍',match:['莉亚的农舍'],x:89,y:26,dx:-10}
      ],
      spots:[
        {label:'池塘',match:['煤矿森林','池塘'],x:34,y:29},
        {label:'河流',match:['煤矿森林','河流'],x:55,y:60},
        {label:'南部小岛',match:['南部小岛'],x:44,y:70},
        {label:'南部瀑布',match:['南部瀑布'],x:51,y:91,dy:-8},
        {label:'秘密森林池塘',match:['秘密森林','池塘'],x:4,y:14,dx:16,dy:12}
      ]
    },
    '海滩':{
      places:[
        {label:'鱼店',match:['鱼店'],x:29,y:57},
        {label:'艾利欧特小屋',match:['艾利欧特小屋'],x:52,y:18},
        {label:'潮汐池',match:['潮汐池'],x:84,y:39,dx:-8}
      ],
      spots:[
        {label:'海洋',match:['海滩','海洋'],x:51,y:74},
        {label:'夜市码头',match:['夜市'],x:73,y:78,dy:-8}
      ]
    },
    '深山':{
      places:[
        {label:'铁路',match:['铁路'],x:15,y:22},
        {label:'木匠的商店',match:['木匠的商店'],x:28,y:58},
        {label:'矿井',match:['矿井'],x:60,y:27},
        {label:'探险家公会',match:['探险家公会'],x:69,y:34},
        {label:'采石场',match:['采石场'],x:89,y:43,dx:-8}
      ],
      spots:[
        {label:'山湖',match:['山湖','矿井外湖泊'],x:56,y:58}
      ]
    },
    '姜岛':{
      places:[
        {label:'火山',match:['火山'],x:53,y:17},
        {label:'岛屿办事处',match:['岛屿办事处'],x:52,y:34},
        {label:'姜岛商人',match:['姜岛商人'],x:42,y:56},
        {label:'齐先生的核桃房',match:['核桃房'],x:20,y:53,dx:12}
      ],
      spots:[
        {label:'岛北',match:['岛北'],x:53,y:27},
        {label:'火山口',match:['火山口'],x:55,y:8,dy:10},
        {label:'岛西淡水',match:['岛西','淡水'],x:24,y:55},
        {label:'岛西海洋',match:['岛西','海洋'],x:18,y:72},
        {label:'岛南',match:['岛南'],x:55,y:84},
        {label:'海盗湾',match:['海盗湾'],x:79,y:78}
      ]
    }
  };

  const norm=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[\s·・_'’\-／/（）()：:]+/g,'');
  const hasAll=(text,parts)=>parts.every(part=>norm(text).includes(norm(part)));

  const css=document.createElement('style');
  css.textContent=`
    .sdv-world-pin-layer-v73{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:visible}
    .sdv-world-pin-v73{position:absolute;transform:translate(-50%,-100%);pointer-events:auto;border:0;background:transparent;padding:0;margin:0;min-width:0;max-width:none;filter:drop-shadow(0 1px 1px rgba(50,28,8,.28));-webkit-tap-highlight-color:transparent}
    .sdv-world-pin-v73__bubble{display:flex;align-items:center;gap:2px;padding:2px 5px 2px 4px;border:1.5px solid #8b683c;border-radius:8px;background:rgba(255,249,228,.96);color:#4a2f20;font-size:7px;font-weight:950;line-height:1.15;white-space:nowrap;box-shadow:0 1px 3px rgba(50,28,8,.18)}
    .sdv-world-pin-v73__stem{display:block;width:2px;height:7px;margin:-1px auto 0;background:#9c3d2b;border-radius:2px}
    .sdv-world-pin-v73__dot{display:block;width:7px;height:7px;margin:-1px auto 0;border:2px solid #fff4d8;border-radius:50%;background:#9c3d2b;box-shadow:0 0 0 1px #7c3929}
    .sdv-world-pin-v73--spot .sdv-world-pin-v73__bubble{border-color:#4e7e97;background:rgba(235,247,255,.96);color:#28576f}
    .sdv-world-pin-v73--spot .sdv-world-pin-v73__stem,.sdv-world-pin-v73--spot .sdv-world-pin-v73__dot{background:#4e7e97}
    .sdv-world-pin-v73:active .sdv-world-pin-v73__bubble{transform:scale(.97)}
    @media (min-width:520px){.sdv-world-pin-v73__bubble{font-size:7.6px;padding:3px 6px}}
  `;
  document.head.appendChild(css);

  const findTarget=(card,pin)=>{
    const buttons=[...card.querySelectorAll('button')].filter(b=>!b.classList.contains('sdv-world-pin-v73'));
    return buttons.find(b=>hasAll(b.textContent,pin.match||[pin.label]))||null;
  };
  const regionFromAlt=alt=>String(alt||'').replace(/區域地圖$/,'').trim();

  function enhanceImage(img){
    const region=regionFromAlt(img.getAttribute('alt'));
    const cfg=PIN_CONFIG[region];
    if(!cfg)return;
    const mapBox=img.parentElement;
    const card=mapBox&&mapBox.parentElement;
    if(!mapBox||!card)return;

    mapBox.querySelector('.sdv-world-pin-layer-v73')?.remove();
    const candidateButtons=[...card.querySelectorAll('button')].filter(b=>!b.classList.contains('sdv-world-pin-v73'));
    const mode=candidateButtons.some(b=>norm(b.textContent).startsWith(norm('🎣')))?'spots':'places';
    const pins=(cfg[mode]||[]).map(pin=>({pin,target:findTarget(card,pin)})).filter(row=>row.target);
    if(!pins.length)return;

    const layer=document.createElement('div');
    layer.className='sdv-world-pin-layer-v73';
    pins.forEach(({pin,target})=>{
      const button=document.createElement('button');
      button.type='button';
      button.className=`sdv-world-pin-v73 ${mode==='spots'?'sdv-world-pin-v73--spot':''}`;
      button.style.left=`${pin.x}%`;
      button.style.top=`${pin.y}%`;
      if(pin.dx||pin.dy)button.style.margin=`${pin.dy||0}px 0 0 ${pin.dx||0}px`;
      button.setAttribute('aria-label',`${mode==='spots'?'釣點':'地點'}：${pin.label}`);
      button.innerHTML=`<span class="sdv-world-pin-v73__bubble"><span>${mode==='spots'?'🎣':'📍'}</span><span>${pin.label}</span></span><span class="sdv-world-pin-v73__stem"></span><span class="sdv-world-pin-v73__dot"></span>`;
      button.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        target.click();
        setTimeout(refresh,0);
      });
      layer.appendChild(button);
    });
    mapBox.appendChild(layer);
  }

  let scheduled=false;
  let observer=null;
  const observe=()=>observer?.observe(document.body,{childList:true,subtree:true});
  function refresh(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      observer?.disconnect();
      document.querySelectorAll('img[alt$="區域地圖"]').forEach(enhanceImage);
      observe();
    });
  }

  const start=()=>{
    observer=new MutationObserver(records=>{
      const meaningful=records.some(record=>[...record.addedNodes,...record.removedNodes].some(node=>{
        if(node.nodeType!==1)return false;
        return !node.classList?.contains('sdv-world-pin-layer-v73')&&!node.closest?.('.sdv-world-pin-layer-v73');
      }));
      if(meaningful)refresh();
    });
    observe();
    document.addEventListener('click',event=>{
      const text=String(event.target?.closest?.('button')?.textContent||'');
      if(text.includes('地點')||text.includes('釣點'))setTimeout(refresh,0);
    },true);
    window.addEventListener('resize',refresh,{passive:true});
    refresh();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
