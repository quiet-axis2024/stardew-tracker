/* v76 — calibrated region maps, safe visual ordering, and Secret Woods sub-route. */
(()=>{
  'use strict';

  const PIN_CONFIG={
    '鹈鹕镇':{
      places:[
        {label:'社区中心',match:['社区中心'],x:25,y:17},
        {label:'哈维的诊所',match:['哈维的诊所'],x:29.5,y:43.5},
        {label:'皮埃尔的杂货店',match:['皮埃尔的杂货店'],x:39,y:43.5},
        {label:'星之果实酒吧',match:['星之果实酒吧'],x:34.5,y:57},
        {label:'Joja超市',match:['Joja超市'],x:82,y:40.5},
        {label:'铁匠铺',match:['铁匠铺'],x:74.5,y:64.5},
        {label:'博物馆',match:['博物馆'],x:83,y:71.5}
      ],
      spots:[{label:'河流',match:['鹈鹕镇','河流'],x:64,y:56}]
    },
    '煤矿森林':{
      places:[
        {label:'秘密森林',match:['秘密森林'],x:4,y:13,dx:10,submap:'secret_woods'},
        {label:'旅行货车',match:['旅行货车'],x:43,y:8,dy:10},
        {label:'法师塔',match:['法师塔'],x:6,y:25,dx:11},
        {label:'玛妮的牧场',match:['玛妮的牧场'],x:80,y:11},
        {label:'莉亚的农舍',match:['莉亚的农舍'],x:89,y:26,dx:-10}
      ],
      spots:[
        {label:'池塘',match:['煤矿森林','池塘'],x:34,y:29},
        {label:'河流',match:['煤矿森林','河流'],x:55,y:60},
        {label:'南部小岛',match:['南部小岛'],x:44,y:70},
        {label:'南部瀑布',match:['南部瀑布'],x:51,y:91,dy:-8}
      ]
    },
    '秘密森林':{
      places:[{label:'老坎诺利大师',x:15,y:18,custom:'cannoli'}],
      spots:[{label:'池塘',match:['秘密森林','池塘'],x:18,y:66}]
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
        {label:'铁路',match:['铁路'],x:15,y:16},
        {label:'木匠的商店',match:['木匠的商店'],x:13.5,y:58},
        {label:'矿井',match:['矿井'],x:60.5,y:20.5},
        {label:'探险家公会',match:['探险家公会'],x:69.5,y:25},
        {label:'采石场',match:['采石场'],x:90,y:39.5,dx:-8}
      ],
      spots:[{label:'山湖',match:['山湖','矿井外湖泊'],x:54,y:58}]
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
    },
    '卡利科沙漠':{
      places:[
        {label:'骷髅洞穴',match:['骷髅洞穴'],x:15,y:16},
        {label:'沙漠商人',match:['沙漠商人'],x:77,y:35,dx:-8},
        {label:'绿洲',match:['绿洲'],x:15,y:80},
        {label:'赌场',match:['赌场'],x:15,y:80,dx:23,dy:-12}
      ],
      spots:[{label:'池塘',match:['沙漠','池塘'],x:19,y:27}]
    },
    '下水道':{
      places:[
        {label:'下水道／科罗布斯',match:['下水道'],x:78,y:31},
        {label:'突变虫穴',match:['突变虫穴'],x:10,y:36}
      ],
      spots:[
        {label:'下水道水域',match:['下水道','水域'],x:56,y:72},
        {label:'突變蟲穴水域',match:['突變蟲穴','水域'],x:18,y:25}
      ]
    }
  };

  const SPECIAL_MAPS={
    '卡利科沙漠':'https://stardewvalleywiki.com/Special:Redirect/file/DesertDistances.png',
    '下水道':'https://stardewvalleywiki.com/Special:Redirect/file/SewerDistances.png',
    '秘密森林':'https://stardewvalleywiki.com/Special:Redirect/file/SecretWoods.png'
  };

  const selected=new Map();
  let secretWoodsOpen=false;
  let scheduled=false;
  let observer=null;

  const norm=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[\s·・_'’\-／/（）()：:]+/g,'');
  const hasAll=(text,parts)=>parts.every(part=>norm(text).includes(norm(part)));
  const regionFromAlt=alt=>String(alt||'').replace(/區域地圖$/,'').trim();

  const css=document.createElement('style');
  css.textContent=`
    .sdv-world-pin-layer-v73{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:visible}
    .sdv-world-pin-v73{position:absolute;transform:translate(-50%,-100%);pointer-events:auto;border:0;background:transparent;padding:0;margin:0;min-width:0;max-width:none;filter:drop-shadow(0 1px 1px rgba(50,28,8,.28));-webkit-tap-highlight-color:transparent}
    .sdv-world-pin-v73__bubble{display:flex;align-items:center;gap:2px;padding:2px 5px 2px 4px;border:1.5px solid #8b683c;border-radius:8px;background:rgba(255,249,228,.96);color:#4a2f20;font-size:7px;font-weight:950;line-height:1.15;white-space:nowrap;box-shadow:0 1px 3px rgba(50,28,8,.18)}
    .sdv-world-pin-v73__stem{display:block;width:2px;height:7px;margin:-1px auto 0;background:#9c3d2b;border-radius:2px}
    .sdv-world-pin-v73__dot{display:block;width:7px;height:7px;margin:-1px auto 0;border:2px solid #fff4d8;border-radius:50%;background:#9c3d2b;box-shadow:0 0 0 1px #7c3929}
    .sdv-world-pin-v73--spot .sdv-world-pin-v73__bubble{border-color:#4e7e97;background:rgba(235,247,255,.96);color:#28576f}
    .sdv-world-pin-v73--spot .sdv-world-pin-v73__stem,.sdv-world-pin-v73--spot .sdv-world-pin-v73__dot{background:#4e7e97}
    .sdv-world-pin-v73--selected{z-index:12!important;filter:drop-shadow(0 2px 3px rgba(91,45,10,.42))}
    .sdv-world-pin-v73--selected .sdv-world-pin-v73__bubble{border-color:#c7602e!important;background:#ffd77f!important;color:#3f2415!important;box-shadow:0 0 0 2px rgba(255,244,216,.92),0 2px 6px rgba(92,49,16,.34)!important;transform:scale(1.08)}
    .sdv-world-pin-v73--selected .sdv-world-pin-v73__dot{width:9px;height:9px;background:#d95f32!important;box-shadow:0 0 0 3px rgba(255,214,126,.72)!important}
    .sdv-world-pin-v73--selected.sdv-world-pin-v73--spot .sdv-world-pin-v73__bubble{border-color:#397d9d!important;background:#cfeeff!important;color:#174c66!important;box-shadow:0 0 0 2px rgba(241,251,255,.94),0 2px 6px rgba(26,83,110,.30)!important}
    .sdv-world-pin-v73--selected.sdv-world-pin-v73--spot .sdv-world-pin-v73__dot{background:#397d9d!important;box-shadow:0 0 0 3px rgba(176,224,247,.78)!important}
    .sdv-world-pin-v73:active .sdv-world-pin-v73__bubble{transform:scale(.97)}
    .sdv-world-quick-clone-v76{display:flex;gap:3px;align-items:center;margin-left:auto;flex:0 0 auto}
    .sdv-world-quick-clone-v76>button{padding:4px 7px!important;font-size:6.8px!important;line-height:1.15!important;white-space:nowrap!important}
    .sdv-world-mode-v76{min-height:50px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;font-size:0!important}
    .sdv-world-mode-v76::before{content:"";display:block;width:32px;height:32px;background-image:var(--sdv-mode-icon);background-size:contain;background-repeat:no-repeat;background-position:center;image-rendering:pixelated}
    .sdv-world-mode-v76::after{content:attr(data-sdv-mode-label);font-size:9.4px;font-weight:950;color:inherit}
    @media (min-width:520px){.sdv-world-pin-v73__bubble{font-size:7.6px;padding:3px 6px}.sdv-world-quick-clone-v76>button{font-size:7.3px!important}}
  `;
  document.head.appendChild(css);

  const findTarget=(card,pin)=>{
    const buttons=[...card.querySelectorAll('button')].filter(b=>!b.classList.contains('sdv-world-pin-v73'));
    return buttons.find(b=>hasAll(b.textContent,pin.match||[pin.label]))||null;
  };
  const modeForCard=card=>[...card.querySelectorAll('button')].filter(b=>!b.classList.contains('sdv-world-pin-v73')).some(b=>norm(b.textContent).startsWith(norm('🎣')))?'spots':'places';
  const findModeWrap=root=>[...root.children].find(el=>{
    if(el.tagName!=='DIV')return false;
    const buttons=[...el.children].filter(x=>x.tagName==='BUTTON');
    if(buttons.length!==2)return false;
    const texts=buttons.map(b=>norm(b.textContent));
    return texts.some(t=>t.includes(norm('地點')))&&texts.some(t=>t.includes(norm('釣點')));
  })||null;
  const findQuickWrap=root=>[...root.children].find(el=>el.tagName==='DIV'&&norm(el.textContent).includes(norm('按條件找魚'))&&norm(el.textContent).includes(norm('按條件找人')))||null;
  const findHeader=(root,region)=>root.querySelector(':scope > .sdv-world-region-header-v76')||[...root.children].find(el=>el.tagName==='DIV'&&!el.querySelector('button')&&norm(el.textContent).startsWith(norm(region)))||null;
  const pinLabel=pin=>String(pin.getAttribute('aria-label')||pin.textContent||'').replace(/^.*?[：:]/,'').trim();
  const activeTarget=target=>{
    if(!target)return false;
    const style=String(target.getAttribute('style')||'').toLowerCase().replace(/\s+/g,'');
    return style.includes('#fff0d2')||style.includes('rgb(255,240,210)');
  };

  function decorateModeButtons(modeWrap){
    if(!modeWrap)return;
    const assets=window.SDVLocalGameFilesV67||{};
    [...modeWrap.children].filter(x=>x.tagName==='BUTTON').forEach(button=>{
      const spot=norm(button.textContent).includes(norm('釣點'));
      const src=spot?(assets['Sunfish']||''):(assets['Warp Totem Farm']||assets['Golden Tag']||'');
      button.classList.add('sdv-world-mode-v76');
      button.dataset.sdvModeLabel=spot?'釣點':'地點';
      button.style.setProperty('--sdv-mode-icon',src?`url("${src}")`:'none');
    });
  }

  function cloneQuickControls(root,header){
    if(!header)return;
    const original=findQuickWrap(root);
    if(!original)return;
    if(!original.dataset.sdvOriginalDisplayV76)original.dataset.sdvOriginalDisplayV76=original.style.display||'';
    original.dataset.sdvQuickOriginalV76='1';
    original.style.display='none';
    if(header.querySelector(':scope > .sdv-world-quick-clone-v76'))return;
    const clone=document.createElement('div');
    clone.className='sdv-world-quick-clone-v76';
    [...original.children].filter(x=>x.tagName==='BUTTON').forEach(source=>{
      const button=source.cloneNode(true);
      button.removeAttribute('id');
      button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();source.click();});
      clone.appendChild(button);
    });
    header.appendChild(clone);
  }

  function restoreRootLayout(){
    document.querySelectorAll('[data-sdv-quick-original-v76="1"]').forEach(original=>{
      const root=original.parentElement;
      if(root?.querySelector('img[alt$="區域地圖"]'))return;
      original.style.display=original.dataset.sdvOriginalDisplayV76||'';
      delete original.dataset.sdvQuickOriginalV76;
      delete original.dataset.sdvOriginalDisplayV76;
      root?.querySelectorAll('.sdv-world-quick-clone-v76').forEach(x=>x.remove());
      if(root){
        root.style.removeProperty('display');
        root.style.removeProperty('flex-direction');
        [...root.children].forEach(el=>el.style.removeProperty('order'));
      }
    });
  }

  function setSecretHeader(header,on){
    if(!header)return;
    const info=[...header.children].find(el=>el.querySelector?.('b'))||header;
    const title=info.querySelector('b');
    const summary=info.querySelector('span');
    if(on){
      if(title&&!title.dataset.sdvOriginalV76)title.dataset.sdvOriginalV76=title.textContent||'';
      if(summary&&!summary.dataset.sdvOriginalV76)summary.dataset.sdvOriginalV76=summary.textContent||'';
      if(title)title.textContent='秘密森林';
      if(summary)summary.textContent='煤矿森林西北角的独立区域；池塘与老坎诺利大师所在处。';
    }else{
      if(title?.dataset.sdvOriginalV76){title.textContent=title.dataset.sdvOriginalV76;delete title.dataset.sdvOriginalV76;}
      if(summary?.dataset.sdvOriginalV76){summary.textContent=summary.dataset.sdvOriginalV76;delete summary.dataset.sdvOriginalV76;}
    }
  }

  function setSecretBreadcrumb(returnBtn,on){
    if(!returnBtn)return;
    const crumb=[...returnBtn.querySelectorAll('span')].find(x=>norm(x.textContent).includes(norm('世界 ›')));
    if(!crumb)return;
    if(on){
      if(!crumb.dataset.sdvOriginalV76)crumb.dataset.sdvOriginalV76=crumb.textContent||'';
      crumb.textContent='世界 › 本島 › 秘密森林';
    }else if(crumb.dataset.sdvOriginalV76){
      crumb.textContent=crumb.dataset.sdvOriginalV76;
      delete crumb.dataset.sdvOriginalV76;
    }
  }

  function safeVisualOrder(root,header,returnBtn,card,modeWrap,quickWrap){
    root.style.display='flex';
    root.style.flexDirection='column';
    const children=[...root.children];
    children.forEach((el,i)=>{el.style.order=String(i*10);});
    const indices=[header,returnBtn,modeWrap,card].map(x=>children.indexOf(x)).filter(i=>i>=0);
    const anchor=(indices.length?Math.min(...indices):1)*10;
    if(header)header.style.order=String(anchor);
    if(returnBtn)returnBtn.style.order=String(anchor+10);
    if(card)card.style.order=String(anchor+20);
    if(modeWrap)modeWrap.style.order=String(anchor+30);
    if(quickWrap)quickWrap.style.order=String(anchor-5);
  }

  function applySelected(region,card,mapBox){
    const mode=modeForCard(card);
    const remembered=selected.get(`${region}:${mode}`)||'';
    const targets=[...card.querySelectorAll('button')].filter(b=>!b.classList.contains('sdv-world-pin-v73'));
    mapBox.querySelectorAll('.sdv-world-pin-v73').forEach(pin=>{
      const label=pinLabel(pin);
      let on=Boolean(remembered&&norm(label)===remembered);
      if(!on){
        const target=targets.find(b=>norm(b.textContent).includes(norm(label)));
        on=activeTarget(target);
      }
      pin.classList.toggle('sdv-world-pin-v73--selected',on);
    });
  }

  function enhanceImage(img){
    let baseRegion=img.dataset.sdvBaseRegionV76||regionFromAlt(img.getAttribute('alt'));
    if(baseRegion==='秘密森林')baseRegion='煤矿森林';
    const mapBox=img.parentElement;
    const card=mapBox&&mapBox.parentElement;
    const root=card&&card.parentElement;
    if(!mapBox||!card||!root)return;

    const mode=modeForCard(card);
    if(baseRegion==='煤矿森林'&&!secretWoodsOpen&&mode==='places'){
      const secretPin=PIN_CONFIG['煤矿森林'].places.find(x=>x.submap==='secret_woods');
      const secretTarget=secretPin?findTarget(card,secretPin):null;
      if(activeTarget(secretTarget))secretWoodsOpen=true;
    }
    const displayRegion=secretWoodsOpen&&baseRegion==='煤矿森林'?'秘密森林':baseRegion;
    const cfg=PIN_CONFIG[displayRegion];
    if(!cfg)return;

    const specialSrc=SPECIAL_MAPS[displayRegion];
    if(specialSrc&&img.dataset.sdvSpecialMapV76!==specialSrc){
      if(displayRegion==='秘密森林')img.dataset.sdvBaseRegionV76='煤矿森林';
      img.dataset.sdvSpecialMapV76=specialSrc;
      img.src=specialSrc;
      img.alt=`${displayRegion}區域地圖`;
      img.style.width='100%';
      img.style.height='auto';
      img.style.maxHeight='none';
      img.style.objectFit='contain';
      img.style.imageRendering='pixelated';
    }

    const badge=[...mapBox.children].find(el=>el.tagName==='SPAN');
    if(badge)badge.style.display='none';
    const instruction=[...card.children].find(el=>el!==mapBox&&norm(el.textContent).includes(norm('先看完整區域位置')));
    if(instruction)instruction.style.display='none';
    const targetGrid=[...card.children].find(el=>el!==mapBox&&el.tagName==='DIV'&&[...el.children].some(x=>x.tagName==='BUTTON'));
    if(targetGrid){targetGrid.style.display='none';targetGrid.setAttribute('aria-hidden','true');}

    mapBox.querySelector('.sdv-world-pin-layer-v73')?.remove();
    const rows=(cfg[mode]||[]).map(pin=>({pin,target:pin.custom?null:findTarget(card,pin)})).filter(row=>row.pin.custom||row.target);
    if(rows.length){
      const layer=document.createElement('div');
      layer.className='sdv-world-pin-layer-v73';
      rows.forEach(({pin,target})=>{
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
          if(pin.submap==='secret_woods'&&displayRegion==='煤矿森林'){
            secretWoodsOpen=true;
            selected.clear();
            if(target)target.click();
            setTimeout(refresh,0);
            return;
          }
          selected.set(`${displayRegion}:${mode}`,norm(pin.label));
          if(pin.custom){applySelected(displayRegion,card,mapBox);return;}
          target.click();
          setTimeout(refresh,0);
        });
        layer.appendChild(button);
      });
      mapBox.appendChild(layer);
    }

    const returnBtn=[...root.children].find(el=>el.tagName==='BUTTON'&&norm(el.textContent).includes(norm('返回大世界地圖')))||null;
    const modeWrap=findModeWrap(root);
    const header=findHeader(root,baseRegion);
    const quickWrap=findQuickWrap(root);
    if(header){
      header.classList.add('sdv-world-region-header-v76');
      header.style.display='flex';
      header.style.alignItems='center';
      header.style.gap='7px';
      header.style.flexWrap='wrap';
      const info=[...header.children].find(el=>el.querySelector?.('b'));
      if(info){info.style.flex='1 1 150px';info.style.minWidth='0';}
      cloneQuickControls(root,header);
    }
    setSecretHeader(header,displayRegion==='秘密森林');
    setSecretBreadcrumb(returnBtn,displayRegion==='秘密森林');
    decorateModeButtons(modeWrap);
    safeVisualOrder(root,header,returnBtn,card,modeWrap,quickWrap);
    applySelected(displayRegion,card,mapBox);
  }

  const observe=()=>observer?.observe(document.body,{childList:true,subtree:true});
  function refresh(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      observer?.disconnect();
      document.querySelectorAll('img[alt$="區域地圖"]').forEach(enhanceImage);
      restoreRootLayout();
      observe();
    });
  }

  const start=()=>{
    observer=new MutationObserver(records=>{
      const meaningful=records.some(record=>[...record.addedNodes,...record.removedNodes].some(node=>{
        if(node.nodeType!==1)return false;
        return !node.classList?.contains('sdv-world-pin-layer-v73')&&!node.closest?.('.sdv-world-pin-layer-v73')&&!node.classList?.contains('sdv-world-quick-clone-v76');
      }));
      if(meaningful)refresh();
    });
    observe();
    document.addEventListener('click',event=>{
      const button=event.target?.closest?.('button');
      if(!button)return;
      if(button.closest('.sdv-world-pin-v73')){setTimeout(refresh,0);return;}
      const text=norm(button.textContent);
      if(secretWoodsOpen&&text.includes(norm('返回大世界地圖'))){secretWoodsOpen=false;selected.clear();}
      if(text.includes(norm('地點'))||text.includes(norm('釣點'))){selected.clear();setTimeout(refresh,0);}
    },true);
    window.addEventListener('resize',refresh,{passive:true});
    refresh();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
