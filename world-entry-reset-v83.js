/* v83 — bridge only: when 查找 → 世界 is pressed, force the hidden legacy React World state back to its root before the standalone runtime mounts. */
(()=>{
'use strict';
const n=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[\s·・_'’\-／/（）()：:]+/g,'');
const buttons=()=>[...document.querySelectorAll('button')].filter(b=>!b.closest('#sdv-world-v83'));
const isLookupWorld=b=>{if(!b||n(b.textContent)!==n('世界'))return false;const p=b.parentElement;if(!p)return false;const texts=[...p.children].filter(x=>x.tagName==='BUTTON').map(x=>n(x.textContent));return texts.includes(n('世界'))&&texts.includes(n('物品'))};
const legacyBack=()=>buttons().find(b=>{const t=n(b.textContent);return t.includes(n('返回大世界地圖'))||t.includes(n('返回大世界地图'))||t===n('大世界地圖')||t===n('大世界地图')})||null;
document.addEventListener('click',event=>{
  const button=event.target?.closest?.('button');if(!isLookupWorld(button))return;
  setTimeout(()=>{const back=legacyBack();if(back)back.click()},0);
},true);
})();
