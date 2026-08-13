/* v78 — audited world routes, stable Secret Woods state, and complete visible fishing pins. */
(()=>{
  'use strict';

  const PIN_CONFIG={
    '鹈鹕镇':{
      places:[
        {label:'公交车站',match:['公交车站'],x:11,y:56},
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
        {label:'铁路',match:['铁路'],x:15,y:13,below:true},
        {label:'木匠的商店',match:['木匠的商店'],x:13.5,y:58},
        {label:'矿井',match:['矿井'],x:60.5,y:20.5,below:true},
        {label:'探险家公会',match:['探险家公会'],x:69.5,y:25},
        {label:'采石场',match:['采石场'],x:90,y:39.5,dx:-8}
      ],
      spots:[
        {label:'山湖',match:['山湖','矿井外湖泊'],x:54,y:58},
        {label:'矿井 20 层',match:['20 层'],x:58,y:18,below:true},
        {label:'矿井 60 层',match:['60 层'],x:70,y:18,below:true},
        {label:'矿井 100 层',match:['100 层'],x:79,y:28}
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
        {label:'突变虫穴水域',match:['突变虫穴','水域'],x:18,y:25}
      ]
    },
    '巫婆沼泽':{
      places:[],
      spots:[{label:'沼泽',match:['女巫沼澤','沼澤'],x:54,y:58}]
    }
  };

  const SPECIAL_MAPS={
    '卡利科沙漠':'https://stardewvalleywiki.com/Special:Redirect/file/DesertDistances.png',
    '下水道':'https://stardewvalleywiki.com/Special:Redirect/file/SewerDistances.png',
    '秘密森林':'https://stardewvalleywiki.com/Special:Redirect/file/SecretWoods.png',
    '巫婆沼泽':'https://stardewvalleywiki.com/Special:Redirect/file/SwampDistances.png'
  };

  const ROOT_REGION_LABELS=new Map([
    ['鹈鹕镇','town'],['煤矿森林','forest'],['秘密森林','secret'],['深山','mountain'],['海滩','beach'],
    ['卡利科沙漠','desert'],['下水道','sewer'],['姜岛','island']
  ].map(([label,id])=>[String(label).normalize('NFKC'),id]));

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
    .sdv-world-pin-v73--below{transform:translate(-50%,-4px)}
    .sdv-world-pin-v73__bubble{display:flex;align-items:center;gap:2px;padding:2px 5px 2px 4px;border:1.5px solid #8b683c;border-radius:8px;background:rgba(255,249,228,.96);color:#4a2f20;font-size:7px;font-weight:950;line-height:1.15;white-space:nowrap;box-shadow:0 1px 3px rgba(50,28,8,.18)}
    .sdv-world-pin-v73__stem{display:block;width:2px;height:7px;margin:-1px auto 0;background:#9c3d2b;border-radius:2px}
    .sdv-world-pin-v73--below .sdv-world-pin-v73__stem{margin:0 auto -1px}
    .sdv-world-pin-v73__dot{display:block;width:7px;height:7px;margin:-1px auto 0;border:2px solid #fff4d8;border-radius:50%;background:#9c3d2b;box-shadow:0 0 0 1px #7c3929}
    .sdv-world-pin-v73--below .sdv-world-pin-v73__dot{margin:0 auto -1px}
    .sdv-world-pin-v73--spot .sdv-world-pin-v73__bubble{border-color:#4e7e97;background:rgba(235,247,255,.96);color:#28576f}
    .sdv-world-pin-v73--spot .sdv-world-pin-v73__stem,.sdv-world-pin-v73--spot .sdv-world-pin-v73__dot{background:#4e7e97}
    .sdv-world-pin-v73--selected{z-index:12!important;filter:drop-shadow(0 2px 3px rgba(91,45,10,.42))}
    .sdv-world-pin-v73--selected .sdv-world-pin-v73__bubble{border-color:#c7602e!important;background:#ffd77f!important;color:#3f2415!important;box-shadow:0 0 0 2px rgba(255,244,216,.92),0 2px 6px rgba(92,49,16,.34)!important;transform:scale(1.08)}
    .sdv-world-pin-v73--selected .sdv-world-pin-v73__dot{width:9px;height:9px;background:#d95f32!important;box-shadow:0 0 0 3px rgba(255,214,126,.72)!important}
    .sdv-world-pin-v73--spot .sdv-world-pin-v73__bubble{border-color:#4e7e97;background:rgba(235,247,255,.96);color:#28576f}
    .sdv-world-pin-v73--spot .sdv-world-pin-v73__stem,.sdv-world-pin-v73--spot .sdv-world-pin-v73__dot{background:#4e7e97}
    .sdv-world-pin-v73--selected{z-index:12!important;filter:drop-shadow(0 2px 3px rgba(91,45,10,.42))}
    .sdv-world-pin-v73--selected .sdv-world-pin-v73__bubble{border-color:#c7602e!important;background:#ffd77f!important;color:#3f2415!important;box-shadow:0 0 0 2px rgba(255,244,216,.92),0 2px 6px rgba(92,49,16,.34)!important;transform:scale(1.08)}
    .sdv-world-pin-v73--selected .sdv-world-pin-v73__dot{width:9px;height:9px;background:#d95f32!important;box-shadow:0 0 0 3px rgba(255,214,126,.72)!important}
    .sdv-world-quick-clone-v78{display:flex;gap:3px;align-items:center;margin-left:auto;flex:0 0 auto}
    .sdv-world-quick-clone-v78#button{padding:4px 7px!important;font-size:6.8px!important;line-height:1.15!important;white-space:nowrap!!important}
    .sdv-world-mode-v78{min-height:50px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;font-size:0!important}
    .sdv-world-mode-v78::before{content:"";display:block;width:32px;height:32px;background-image:var(--sdv-mode-icon);background-size:contain;background-repeat:no-repeat;background-position:center;image-rendering:pixelated}
    .sdv-world-mode-v78::after{content:attr(data-sdv-mode-label);font-size:9.4px;font-weight:950;color:inherit}
    @media (min-width:520px){.sdv-world-pin-v73__bubble{font-size:7.6px;padding:3px 6px}.sdv-world-quick-clone-v78#button{font-size:7.3px!important}}
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
    return texts.some(t=>t.includes(norm('地点')))&&texts.some(t=>t.includes(norm('釣點')));
  })||null;
  const findQuickWrap=root=>[...root.children].find(el=>el.tagName==='DIV'&&norm(el.textContent).includes(norm('戉条件拾鱼'))&&norm(el.textContent).includes(norm('按条件刷人')))||null;
  const findHeader=(root,region)=>root.querySelector(':scope > .sdv-world-region-header-v78')||[...root.children].find(el=>el.tagName==='DIV'&&!el.querySelector('button')&&norm(el.textContent).startsWith(norm(region)))||null;
  const pinLabel=pin=>String(pin.getAttribute('aria-label')||pin.textContent||'').replace(/^.*?[��&�]?/,'').trim();
  const activeTarget=target=>{
    if(!target)return false;
    const style=String(target.getAttribute('style')||'').toLowerCase().replace(/\s+/g,'');
    return style.includes('#fff0d2')||style.includes('rgb(255,240,210)');
  };

  function decorateModeButtons(modeWrap){
    if(!modeWrap)return;
    const assets=window.SDVLocalGameFilesV67||{};
    [...modeWrap.children].filter(x=>x.tagName==='BUTTON')forEach(button=>{
      const spot=norm(button.textContent).includes(norm('釣點'));
      const src=spot?(assets['Sunfish']||''):(assets['Warp Totem Farm']||assets['Golden Tag']||'');
      button.classList.add('sdv-world-mode-v78');
      button.dataset.sdvModeLabel=spot?'i��點':'e��点';
      button.style.setProperty('--sdv-mode-icon',src?`url("${src}")`:'none');
    });
  }

  function cloneQuickControls(root,header){
    if(!header)return;
    const original=findQuickWrap(root);
    if(!original)return;
    if(!original.dataset.sdvOriginalDisplayV78)original.dataset.sdvOriginalDisplayV78=original.style.display||'';
    original.dataset.sdvQuickOriginalV78='1';
    original.style.display='none';
    if(header.querySelector(':scope > .sdv-world-quick-clone-v78'))return;
    const clone=document.createElement('div');
    clone.className='sdv-world-quick-clone-v78';
    [...original.children].filter(x=>x.tagName==='BUTTON').forEach(source=>{
      const button=source.cloneNode(true);
      button.removeAttribute('id');
      button.addEventListener('click',eVent=>{eVent.preventDefault();eVent.stopPropagation();source.click();});
      clone.appendChild(button);
    });
    header.appendChild(clone);
  }

  function restoreRootLayout(){
    document.querySelectorAll('[data-sdv-quick-original-v78="1"]').forEach(original=>{
      const root=original.parentElement;
      if(root?.querySelector('img[alt$="區域地圖"]'))return;
      original.style.display=original.dataset.sdvOriginalDisplayV78||'';
      delete original.dataset.sdvQuickOriginalV78;
      delete original.dataset.sdvOriginalDisplayV78;
      root?.querySelectorAll('.sdv-world-quick-clone-v78').forEach(x=>x.remove());
      if(root){
        root.style.removeProperty('display');root.style.removeProperty('flex-direction');
        [...root.children].forEach(el=>el.style.removeProperty('order'));
      }
    });
  }

  function setSubmapHeader(header,displayRegion){
    if(!header)return;
    const info=[...header.children].find(el=>el.querySelector?.('b'))||header;
    const title=info.querySelector('b');
    const summary=info.querySelector('span');
    const isSecret=displayRegion==='秘密森林';
    const isSwamp=displayRegion==='巆婆治沽';
    if(isSecret||isSwamp){
      if(title&&!title.dataset.sdvOriginalV78)title.dataset.sdvOriginalV78=title.textContent||'';
      if(summary&&!summary.dataset.sdvOriginalV78)summary.dataset.sdvOriginalV78=summary.textContent||'';
      if(title)title.textContent=displayRegion;
      if(summary)summary.textContent=isSecret?'g��矿森林�Ǣ~ح��Z����o:���v�W�-��^��m
��z{