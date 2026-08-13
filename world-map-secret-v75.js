(()=>{
  'use strict';
  let forestSrc='';
  const remember=()=>{
    document.querySelectorAll('img[alt="煤矿森林區域地圖"]').forEach(img=>{
      const src=img.getAttribute('src')||'';
      if(src&&!/SecretWoods\.png/i.test(src))forestSrc=src;
    });
  };
  const restore=()=>setTimeout(()=>{
    document.querySelectorAll('img[alt="煤矿森林區域地圖"]').forEach(img=>{
      const src=img.getAttribute('src')||'';
      if(forestSrc&&/SecretWoods\.png/i.test(src)){
        img.src=forestSrc;
        img.removeAttribute('data-sdv-special-map-v74');
        img.removeAttribute('data-sdv-base-region-v75');
      }
    });
  },0);
  const observer=new MutationObserver(()=>remember());
  const start=()=>{
    remember();
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','alt']});
    window.addEventListener('click',event=>{
      const text=String(event.target?.closest?.('button')?.textContent||'');
      if(text.includes('返回煤矿森林'))restore();
    },true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();