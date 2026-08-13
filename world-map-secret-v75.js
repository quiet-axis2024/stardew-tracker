/* v77: harden Secret Woods as a one-tap world sub-route without moving React-owned DOM nodes. */
(()=>{
  'use strict';

  const norm=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[\s·・_'’\-／/（）()：:]+/g,'');
  const SECRET=norm('秘密森林');
  const RETURN_WORLD=norm('返回大世界地圖');
  let wantsSecret=false;
  let scheduled=false;
  let observer=null;
  let forcingTarget=false;

  const isRegionImage=img=>img&&img.tagName==='IMG'&&/區域地圖$/.test(String(img.alt||''));
  const directImageChild=(node,alt)=>node&&[...node.children||[]].some(child=>child.tagName==='IMG'&&norm(child.alt)===norm(alt));
  const isRootSecretButton=button=>{
    if(!button||button.closest('.sdv-world-pin-v73'))return false;
    if(norm(button.textContent)!==SECRET)return false;
    const parent=button.parentElement;
    return directImageChild(parent,'星露谷地圖');
  };
  const isSecretPin=button=>Boolean(button?.closest('.sdv-world-pin-v73')&&norm(button.getAttribute('aria-label')||button.textContent).includes(SECRET));
  const activeTarget=target=>{
    const style=String(target?.getAttribute('style')||'').toLowerCase().replace(/\s+/g,'');
    return style.includes('#fff0d2')||style.includes('rgb(255,240,210)');
  };

  function ensureSecretTarget(){
    if(!wantsSecret||forcingTarget)return;
    const img=[...document.querySelectorAll('img')].find(x=>isRegionImage(x)&&['煤矿森林區域地圖','秘密森林區域地圖'].some(alt=>norm(x.alt)===norm(alt)));
    if(!img)return;
    const card=img.parentElement?.parentElement;
    if(!card)return;

    // The React world state already selects secret_woods when the root Secret Woods pin is tapped.
    // This guard only repairs stale/partial state; it never relocates or removes React-owned nodes.
    const target=[...card.querySelectorAll('button')].find(button=>{
      if(button.closest('.sdv-world-pin-v73'))return false;
      const text=norm(button.textContent);
      return text.includes(SECRET)&&!text.includes(RETURN_WORLD);
    });
    if(target&&!activeTarget(target)){
      forcingTarget=true;
      try{target.click();}finally{setTimeout(()=>{forcingTarget=false;schedule();},0);}
    }
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      ensureSecretTarget();
    });
  }

  function start(){
    document.addEventListener('click',event=>{
      const button=event.target?.closest?.('button');
      if(!button)return;
      const text=norm(button.textContent);

      if(isRootSecretButton(button)||isSecretPin(button)){
        wantsSecret=true;
        schedule();
        return;
      }
      if(text.includes(RETURN_WORLD)){
        wantsSecret=false;
        return;
      }

      // Any other root-map region selection exits the Secret Woods intent.
      const parent=button.parentElement;
      if(directImageChild(parent,'星露谷地圖'))wantsSecret=false;
    },true);

    observer=new MutationObserver(records=>{
      if(!wantsSecret)return;
      if(records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1)))schedule();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    schedule();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
