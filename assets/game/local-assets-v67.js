window.SDVLocalGameFilesV67={"Calendar":"./assets/game/adab5090ac6a1b.png","Penny Icon":"./assets/game/3780aee144d4b9.png","Pickaxe":"./assets/game/ce02c8572e8bee.png","Sandy Icon":"./assets/game/d360d6be3f2a74.png","Jodi Icon":"./assets/game/bd539649d03507.png","Gus Icon":"./assets/game/2224d4f0bea655.png","Demetrius Icon":"./assets/game/6eb4502d7d0e20.png","Sam Icon":"./assets/game/2dcaea10910233.png","Calendar Fall ZH":"./assets/game/2e24659a92f407.png","Krobus Icon":"./assets/game/e1fdf9d1dd6f4c.png","Elliott Icon":"./assets/game/8affc7612d6c00.png","Map":"./assets/game/ab478f3efc840e.png","Book Of Stars":"./assets/game/190f9e6b5387c3.png","George Icon":"./assets/game/36daa1f94107da.png","Clint Icon":"./assets/game/023f8c50ca4f5f.png","Warp Totem Farm":"./assets/game/2fade73b49a8e0.png","Magnifying Glass":"./assets/game/c476659deba191.png","Golden Scroll":"./assets/game/7ba32cb59a2dbd.png","Leah Icon":"./assets/game/8847ccb5c29665.png","Sebastian Icon":"./assets/game/505a7ea17ce55c.png","White Chicken":"./assets/game/bd75a2cd731931.png","Emily Icon":"./assets/game/eb73ec8e0f5f3b.png","Robin Icon":"./assets/game/97b941180ddea9.png","Journal Scrap":"./assets/game/d526411fed6778.png","Harvey Icon":"./assets/game/b20e6c8e3fcf0c.png","Kent Icon":"./assets/game/18d10cc1deb907.png","Willy Icon":"./assets/game/dfe61624733203.png","Ginger Island Map":"./assets/game/cefec7bd561189.png","Sunfish":"./assets/game/e782453fecea2d.png","Farm Computer":"./assets/game/e24bbd3df7992e.png","House (tier 1)":"./assets/game/09f8666241338e.png","Book of Mysteries":"./assets/game/13e6b46849cc64.png","Linus Icon":"./assets/game/02dcd6272546a0.png","Stardew Valley Almanac":"./assets/game/5fd50473959cf3.png","Evelyn Icon":"./assets/game/8969135ccf61fd.png","Lewis Icon":"./assets/game/84cb31ed895d10.png","Bouquet":"./assets/game/be63873217899f.png","Chest":"./assets/game/d8bfbca86c7d12.png","Shane Icon":"./assets/game/95954611c6ef51.png","Pierre Icon":"./assets/game/0552a350e00123.png","Stardrop":"./assets/game/4660fef1da9f86.png","Leo Icon":"./assets/game/4a160b2b17bc04.png","Pam Icon":"./assets/game/311df381b99081.png","Haley Icon":"./assets/game/9e1300162eec2b.png","Jas Icon":"./assets/game/85481fe7a13f1a.png","Deluxe Cowboy Hat":"./assets/game/d4e0cd960b1655.png","Silo":"./assets/game/054e38bab606fb.png","Calendar Spring ZH":"./assets/game/82bea9cce9ec5c.png","Calendar Summer ZH":"./assets/game/65632b6cfeb2e5.png","Alex Icon":"./assets/game/700afc802b5df1.png","Calendar Winter ZH":"./assets/game/579815198c3690.png","Vincent Icon":"./assets/game/d9694a5af77bfd.png","Maru Icon":"./assets/game/085e10ef812f24.png","Marnie Icon":"./assets/game/20b7a6f6b73213.png","Dwarf Icon":"./assets/game/cb10077572d8a3.png","Caroline Icon":"./assets/game/b7442ff57d3724.png","Wizard Icon":"./assets/game/c9161957116683.png","Abigail Icon":"./assets/game/dc9af41cbb2604.png","Friendship 101":"./assets/game/9954f1565c4391.png","Golden Tag":"./assets/game/48d3ec5e556d98.png"};

/* v74 — region-map interaction/layout refinement. */
(()=>{
  'use strict';
  const SPECIAL_MAPS={
    '卡利科沙漠':'https://stardewvalleywiki.com/Special:Redirect/file/DesertDistances.png',
    '下水道':'https://stardewvalleywiki.com/Special:Redirect/file/SewerDistances.png'
  };
  const SPECIAL_PINS={
    '卡利科沙漠':{
      places:[
        {label:'骷髅洞穴',match:['骷髅洞穴'],x:16,y:17},
        {label:'沙漠商人',match:['沙漠商人'],x:76,y:36,dx:-8},
        {label:'绿洲',match:['绿洲'],x:24,y:58},
        {label:'赌场',match:['赌场'],x:29,y:53,dx:14,dy:-8}
      ],
      spots:[{label:'池塘',match:['沙漠','池塘'],x:31,y:70}]
    },
    '下水道':{
      places:[
        {label:'下水道／科罗布斯',match:['下水道'],x:60,y:49},
        {label:'突变虫穴',match:['突变虫穴'],x:22,y:36}
      ],
      spots:[
        {label:'下水道水域',match:['下水道','水域'],x:57,y:67},
        {label:'突變蟲穴水域',match:['突變蟲穴','水域'],x:23,y:47}
      ]
    }
  };
  const selected=new Map();
  const norm=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[\s·・_'’\-／/（）()：:]+/g,'');
  const hasAll=(text,parts)=>parts.every(part=>norm(text).includes(norm(part)));
  const regionFromAlt=alt=>String(alt||'').replace(/區域地圖$/,'').trim();
  const css=document.createElement('style');
  css.textContent=`
    .sdv-world-mapbox-v74 .sdv-world-pin-v73--selected{z-index:12!important;filter:drop-shadow(0 2px 3px rgba(91,45,10,.42))}
    .sdv-world-mapbox-v74 .sdv-world-pin-v73--selected .sdv-world-pin-v73__bubble{border-color:#c7602e!important;background:#ffd77f!important;color:#3f2415!important;box-shadow:0 0 0 2px rgba(255,244,216,.92),0 2px 6px rgba(92,49,16,.34)!important;transform:scale(1.08)}
    .sdv-world-mapbox-v74 .sdv-world-pin-v73--selected .sdv-world-pin-v73__dot{width:9px;height:9px;background:#d95f32!important;box-shadow:0 0 0 3px rgba(255,214,126,.72)!important}
    .sdv-world-mapbox-v74 .sdv-world-pin-v73--selected.sdv-world-pin-v73--spot .sdv-world-pin-v73__bubble{border-color:#397d9d!important;background:#cfeeff!important;color:#174c66!important;box-shadow:0 0 0 2px rgba(241,251,255,.94),0 2px 6px rgba(26,83,110,.30)!important}
    .sdv-world-mapbox-v74 .sdv-world-pin-v73--selected.sdv-world-pin-v73--spot .sdv-world-pin-v73__dot{background:#397d9d!important;box-shadow:0 0 0 3px rgba(176,224,247,.78)!important}
    .sdv-world-special-pin-layer-v74{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:visible}
    .sdv-world-special-pin-layer-v74 .sdv-world-pin-v73{pointer-events:auto}
  `;
  document.head.appendChild(css);
  const findModeWrap=root=>[...root.children].find(el=>{
    if(el.tagName!=='DIV')return false;
    const buttons=[...el.children].filter(x=>x.tagName==='BUTTON');
    if(buttons.length!==2)return false;
    const texts=buttons.map(b=>norm(b.textContent));
    return texts.some(t=>t===norm('📍 地點'))&&texts.some(t=>t===norm('🎣 釣點'));
  })||null;
  const findTarget=(card,pin)=>{
    const buttons=[...card.querySelectorAll('button')].filter(b=>!b.classList.contains('sdv-world-pin-v73'));
    return buttons.find(b=>hasAll(b.textContent,pin.match||[pin.label]))||null;
  };
  const modeForCard=card=>{
    const buttons=[...card.querySelectorAll('button')].filter(b=>!b.classList.contains('sdv-world-pin-v73'));
    return buttons.some(b=>norm(b.textContent).startsWith(norm('🎣')))?'spots':'places';
  };
  const activeTarget=target=>{
    if(!target)return false;
    const style=String(target.getAttribute('style')||'').toLowerCase().replace(/\s+/g,'');
    return style.includes('#fff0d2')||style.includes('rgb(255,240,210)');
  };
  const pinLabel=pin=>String(pin.getAttribute('aria-label')||pin.textContent||'').replace(/^.*?[：:]/,'').trim();
  function addSpecialPins(region,card,mapBox){
    mapBox.querySelector('.sdv-world-special-pin-layer-v74')?.remove();
    const cfg=SPECIAL_PINS[region];
    if(!cfg)return;
    const mode=modeForCard(card);
    const rows=(cfg[mode]||[]).map(pin=>({pin,target:findTarget(card,pin)})).filter(row=>row.target);
    if(!rows.length)return;
    const layer=document.createElement('div');
    layer.className='sdv-world-special-pin-layer-v74';
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
        event.preventDefault();event.stopPropagation();
        selected.set(`${region}:${mode}`,norm(pin.label));
        target.click();setTimeout(refresh,0);
      });
      layer.appendChild(button);
    });
    mapBox.appendChild(layer);
  }
  function applySelected(region,card,mapBox){
    const mode=modeForCard(card);
    const remembered=selected.get(`${region}:${mode}`)||'';
    const targets=[...card.querySelectorAll('button')].filter(b=>!b.classList.contains('sdv-world-pin-v73'));
    mapBox.querySelectorAll('.sdv-world-pin-v73').forEach(pin=>{
      const label=pinLabel(pin);
      let on=Boolean(remembered&&norm(label)===remembered);
      if(!on){const target=targets.find(b=>norm(b.textContent).includes(norm(label)));on=activeTarget(target);}
      pin.classList.toggle('sdv-world-pin-v73--selected',on);
    });
  }
  function restructure(img){
    const region=regionFromAlt(img.getAttribute('alt'));
    if(!region)return;
    const mapBox=img.parentElement,card=mapBox&&mapBox.parentElement,root=card&&card.parentElement;
    if(!mapBox||!card||!root)return;
    mapBox.classList.add('sdv-world-mapbox-v74');
    const specialSrc=SPECIAL_MAPS[region];
    if(specialSrc&&img.dataset.sdvSpecialMapV74!==specialSrc){
      img.dataset.sdvSpecialMapV74=specialSrc;img.src=specialSrc;
      img.style.width='100%';img.style.height='auto';img.style.maxHeight='none';img.style.objectFit='contain';img.style.imageRendering='pixelated';
    }
    const badge=[...mapBox.children].find(el=>el.tagName==='SPAN'&&norm(el.textContent)===norm(region));
    if(badge){badge.style.left='auto';badge.style.right='6px';badge.style.top='auto';badge.style.bottom='6px';}
    const instruction=[...card.children].find(el=>el!==mapBox&&norm(el.textContent).includes(norm('先看完整區域位置')));
    if(instruction)instruction.style.display='none';
    const targetGrid=[...card.children].find(el=>el!==mapBox&&el.tagName==='DIV'&&[...el.children].some(x=>x.tagName==='BUTTON'));
    if(targetGrid){targetGrid.style.display='none';targetGrid.setAttribute('aria-hidden','true');}
    const returnBtn=[...root.children].find(el=>el.tagName==='BUTTON'&&norm(el.textContent).includes(norm('返回大世界地圖')))||null;
    const modeWrap=findModeWrap(root);
    const header=[...root.children].find(el=>{
      if(el===card||el===modeWrap||el===returnBtn||el.tagName!=='DIV'||el.querySelector('button'))return false;
      return norm(el.textContent).startsWith(norm(region));
    })||null;
    if(returnBtn&&header&&header.nextElementSibling!==returnBtn)header.after(returnBtn);
    if(modeWrap&&card.nextElementSibling!==modeWrap)card.after(modeWrap);
    addSpecialPins(region,card,mapBox);applySelected(region,card,mapBox);
  }
  let scheduled=false;
  function refresh(){
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;document.querySelectorAll('img[alt$="區域地圖"]').forEach(restructure);});
  }
  const start=()=>{
    const observer=new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length||r.removedNodes.length))refresh();});
    observer.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('click',event=>{
      const button=event.target?.closest?.('button');if(!button)return;
      const pin=button.closest('.sdv-world-pin-v73');
      if(pin){
        const mapBox=pin.closest('.sdv-world-mapbox-v74'),img=mapBox?.querySelector('img[alt$="區域地圖"]');
        const region=regionFromAlt(img?.getAttribute('alt')),mode=pin.classList.contains('sdv-world-pin-v73--spot')?'spots':'places';
        if(region)selected.set(`${region}:${mode}`,norm(pinLabel(pin)));setTimeout(refresh,0);return;
      }
      const text=norm(button.textContent);
      if(text===norm('📍 地點')||text===norm('🎣 釣點')){selected.clear();setTimeout(refresh,0);}
    },true);
    window.addEventListener('resize',refresh,{passive:true});refresh();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();