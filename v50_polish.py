from pathlib import Path

def rep(s,a,b,label):
    if a not in s: raise SystemExit('missing '+label)
    return s.replace(a,b,1)

p=Path('app.jsx'); s=p.read_text(encoding='utf-8')
s=s.replace('name="連線小屋" file="Trailer Cabin"','name="連線小屋" file="Trailer Cabin Stage 1"')

s=rep(s,
'''    const giftMetaV50=item=>{\n      const raw=String(item||"");\n      const row=lookupRowsV50.find(r=>r?.name===raw||r?.file===raw||r?.zh===raw);\n      const generic=genericGiftV50(raw);\n      const file=generic?"":(row?.file||raw);\n      return {raw,file,key:file||raw,name:generic?raw:switchNameV47(row?.zh||raw,file),source:generic?"通用物品分類":((row?.sources||[])[0]||"點擊查看詳細用途／來源"),generic};\n    };\n    const openLookupV50=item=>{\n      const m=giftMetaV50(item); if(m.generic)return;''',
'''    const socialNameZhV50={Chicken:"雞",Cow:"牛",Goat:"山羊",Duck:"鴨",Sheep:"綿羊",Rabbit:"兔子",Pig:"豬"};\n    const giftMetaV50=item=>{\n      const raw=String(item||"");\n      const row=lookupRowsV50.find(r=>r?.name===raw||r?.file===raw||r?.zh===raw);\n      const generic=genericGiftV50(raw);\n      const file=generic?"":(row?.file||raw);\n      const canLookup=!generic&&Boolean(row);\n      return {raw,file,key:file||raw,name:generic?raw:(socialNameZhV50[raw]||switchNameV47(row?.zh||raw,file)),source:generic?"通用物品分類":row?((row?.sources||[])[0]||"點擊查看詳細用途／來源"):"此項目前沒有獨立物品用途卡",generic,canLookup};\n    };\n    const openLookupV50=item=>{\n      const m=giftMetaV50(item); if(!m.canLookup)return;''',
'lookup guard')

s=s.replace('disabled={m.generic} onClick={()=>openLookupV50(item)}','disabled={!m.canLookup} onClick={()=>openLookupV50(item)}')
s=rep(s,
'''    const CompactLovesV50=({items})=><div style={{display:"flex",gap:2,overflowX:"auto",padding:"2px 0",WebkitOverflowScrolling:"touch"}}>{(items||[]).map((item,i)=>{const m=giftMetaV50(item);return <span key={`${item}-${i}`} title={m.name} style={{flex:"0 0 auto",width:21,height:21,display:"flex",alignItems:"center",justifyContent:"center",filter:m.generic?"grayscale(1)":"none",opacity:m.generic?.35:1}}>{m.file?<GameIcon file={m.file} size={20}/>:<span style={{fontSize:9,color:C.muted}}>•</span>}</span>})}</div>;''',
'''    const CompactLovesV50=({items})=><div style={{display:"flex",gap:2,flexWrap:"wrap",padding:"2px 0"}}>{(items||[]).map((item,i)=>{const m=giftMetaV50(item);return <span key={`${item}-${i}`} title={m.name} style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",filter:m.generic?"grayscale(1)":"none",opacity:m.generic?.35:1}}>{m.file?<GameIcon file={m.file} size={21}/>:<span style={{fontSize:9,color:C.muted}}>•</span>}</span>})}</div>;''',
'all love icons visible')

s=s.replace('<GameIcon file="Shop Icon" size={25}/>','<GameIcon file="Telephone" size={25}/>')
s=rep(s,
'''    const shopRowsV50=shop=>{if(!shop?.items)return[];return shop.items.filter(it=>!it.seasons?.length||it.seasons.includes(seasonEnV50));};\n    const ShopV50=({shop})=>''',
'''    const shopRowsV50=shop=>{if(!shop?.items)return[];return shop.items.filter(it=>!it.seasons?.length||it.seasons.includes(seasonEnV50));};\n    const availabilityTextV50=value=>String(value||"").replace("Year 2+","第 2 年起").replace("Farming level 10+","耕種 10 級").replace("Unowned only","未持有時").replace("17+ ticket prizes claimed","領取 17 次以上獎品券獎勵");\n    const ShopV50=({shop})=>''',
'availability translation')
s=s.replace('{it.availability}</div>','{availabilityTextV50(it.availability)}</div>')
s=s.replace('<button key={`${it.name}-${i}`} onClick={()=>openLookupV50(it.name)} style={{border:`1px solid ${C.line}`,background:C.cream,', '<button key={`${it.name}-${i}`} disabled={!m.canLookup} onClick={()=>openLookupV50(it.name)} style={{border:`1px solid ${C.line}`,background:C.cream,')
s=s.replace('padding:"3px 2px",minWidth:0,textAlign:"center"}}><GameIcon', 'padding:"3px 2px",minWidth:0,textAlign:"center",opacity:m.canLookup?1:.78}}><GameIcon')

p.write_text(s,encoding='utf-8')
print('v50 polish complete')
