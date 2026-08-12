from pathlib import Path
import re

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

start=s.index('  const renderItemUsageV42 = () => {')
end=s.index('\n\n  const renderFishTodayV4', start)
block=s[start:end]

pattern=r'''    const saleText=.*?\n    const tag='''
replacement='''    const priceDbV44=window.SDVItemPricesV44||{};
    const priceAliasV44=selected?[selected.file,...selected.aliases].find(v=>v&&Object.prototype.hasOwnProperty.call(priceDbV44,String(v))):null;
    const baseSellPriceV44=priceAliasV44!=null?Number(priceDbV44[String(priceAliasV44)]):null;
    const fixedUses=selected?(selected.bundles.length+selected.remix.length+selected.cookNeed+tailoring.length+(museum?1:0)+(usageSpecial?.uses?.length||0)):0;
    const mustKeepV44=Boolean(selected&&(usageSpecial?.keep||museum||(selected.shippable&&!shipped)||fixedUses));
    const recommendActionV44=!selected?"":mustKeepV44?"留":((baseSellPriceV44!=null&&baseSellPriceV44>0)||selected.kinds.has("fish")||selected.kinds.has("cooking"))?"賣":"留";
    const recommendReasonV44=!selected?"":usageSpecial?.keep||(museum?"第一次拿到先留 1 個給博物館。":selected.shippable&&!shipped?"先留 1 個完成出貨圖鑑，再處理多餘的。":fixedUses?"有收集包／料理／裁縫等固定用途，先留足需求。":recommendActionV44==="賣"?"目前沒有偵測到固定需求，可賣掉換錢。":"用途或售價資料不足，先留較安全。" );
    const sellPriceTextV44=baseSellPriceV44==null?"未整理":baseSellPriceV44>0?`${baseSellPriceV44.toLocaleString()}g`:"0g";
    const usageRowsV44=[];
    if(selected){
      (usageSpecial?.uses||[]).forEach(u=>usageRowsV44.push(["⭐",u]));
      if(museum)usageRowsV44.push(["🏺","博物館：可捐贈 1 個。"]);
      selected.bundles.forEach(u=>usageRowsV44.push(["📦",u]));
      selected.remix.forEach(u=>usageRowsV44.push(["📦",u]));
      if(selected.cookNeed)usageRowsV44.push(["🍳",`料理備料：目前手帳整理的全料理最低備料共需要 ${selected.cookNeed} 個。`]);
      tailoring.forEach(x=>usageRowsV44.push(["🧵",`裁縫：${x.name||"服飾"}${x.recipe?`（${x.recipe}）`:""}`]));
      if(selected.shippable)usageRowsV44.push(["🚚",`出貨圖鑑：可出貨${shipped?"，目前已點亮":"，目前尚未點亮"}。`]);
      if(!usageRowsV44.length)usageRowsV44.push(["・","目前手帳沒有偵測到固定用途。"]);
    }
    const tag='''
block,n=re.subn(pattern,lambda m:replacement,block,count=1,flags=re.S)
if n!=1: raise SystemExit(f'recommendation block replace failed: {n}')

sel_start=block.index('      {selected&&<Card style={{marginTop:8,padding:9,background:"#FFF8E9"}}>')
body_end=block.rfind('\n    </div>;')
if body_end<sel_start: raise SystemExit('selected card end not found')
new_selected='''      {selected&&<Card style={{marginTop:7,padding:9,background:"#FFF8E9"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={selected.file} size={44}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:14,color:C.darkBrown}}>{selected.name}</b><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{resultTags(selected).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</div></div><WikiBtn name={selected.name}/></div>
        <div style={{fontSize:12,fontWeight:950,color:C.darkBrown,marginTop:9}}>用途</div>
        <div style={{display:"grid",gap:5,marginTop:5}}>{usageRowsV44.map(([icon,text],i)=><div key={i} style={{display:"grid",gridTemplateColumns:"18px 1fr",gap:4,alignItems:"start",fontSize:9.4,color:C.ink,lineHeight:1.45}}><span>{icon}</span><span>{text}</span></div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:9,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          <div style={{minWidth:0}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>建議</span><div style={{fontSize:11,fontWeight:950,color:recommendActionV44==="留"?C.green:C.orange,marginTop:1}}>{recommendActionV44}</div><div style={{fontSize:7.5,color:C.muted,lineHeight:1.3,marginTop:1}}>{recommendReasonV44}</div></div>
          <div style={{minWidth:0}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>賣價</span><div style={{fontSize:11,fontWeight:950,color:C.brown,marginTop:1}}>{sellPriceTextV44}</div><div style={{fontSize:7.5,color:C.muted,lineHeight:1.3,marginTop:1}}>基礎賣價；品質與職業加成另計。</div></div>
        </div>
      </Card>}'''
block=block[:sel_start]+block[body_end:]
result_marker='      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5,marginTop:6}}>{results.map'
insert_at=block.index(result_marker)
block=block[:insert_at]+new_selected+'\n'+block[insert_at:]

s=s[:start]+block+s[end:]
p.write_text(s,encoding='utf-8')

p=Path('index.html'); h=p.read_text(encoding='utf-8')
h=h.replace('?v=43','?v=44').replace('<!-- deploy-v43 -->','<!-- deploy-v44 -->')
needle='  <script src="./animal-preview-v33.js?v=44"></script>\n'
if needle not in h: raise SystemExit('index script marker missing')
h=h.replace(needle,needle+'  <script src="./item-prices-v44.js?v=44"></script>\n',1)
p.write_text(h,encoding='utf-8')

p=Path('sw.js'); w=p.read_text(encoding='utf-8')
w=w.replace("stardew-tracker-v43","stardew-tracker-v44")
w=w.replace("'./animal-preview-v33.js','./manifest.webmanifest'","'./animal-preview-v33.js','./item-prices-v44.js','./manifest.webmanifest'")
p.write_text(w,encoding='utf-8')
