from pathlib import Path
import re

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

def must_replace(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'missing target: {label}')
    s=s.replace(old,new,1)

def must_sub(pattern,repl,label):
    global s
    ns,n=re.subn(pattern,lambda m: repl,s,count=1,flags=re.S)
    if n!=1:
        raise SystemExit(f'pattern {label}: expected 1, got {n}')
    s=ns

# Store acquisition hints on each indexed item.
must_replace(
'if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false});',
'if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),sources:new Set(),bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false});',
'index source set'
)
must_replace(
'COLLECTIONS.fish.items.forEach((name,i)=>{const it=ensure(name,FISH_ICON_FILES[i],"fish");if(it)it.fishIndex=i});',
'COLLECTIONS.fish.items.forEach((name,i)=>{const it=ensure(name,FISH_ICON_FILES[i],"fish");if(it){it.fishIndex=i;if(FISH_INFO[i])it.sources.add(FISH_INFO[i])}});',
'fish source'
)
must_replace(
'COLLECTIONS.artifact.items.forEach((name,i)=>ensure(name,ARTIFACT_ICON_FILES[i],"artifact"));',
'COLLECTIONS.artifact.items.forEach((name,i)=>{const it=ensure(name,ARTIFACT_ICON_FILES[i],"artifact");if(it&&ARTIFACT_INFO[i])it.sources.add(ARTIFACT_INFO[i])});',
'artifact source'
)
must_replace(
'COLLECTIONS.mineral.items.forEach((name,i)=>ensure(name,MINERAL_ICON_FILES[i],"mineral"));',
'COLLECTIONS.mineral.items.forEach((name,i)=>{const it=ensure(name,MINERAL_ICON_FILES[i],"mineral");if(it&&MINERAL_INFO[i])it.sources.add(MINERAL_INFO[i])});',
'mineral source'
)
must_replace(
'COOKING_DISHES_V3.forEach(([,name,file])=>ensure(name,file,"cooking"));',
'COOKING_DISHES_V3.forEach(([,name,file])=>{const it=ensure(name,file,"cooking");if(it)it.sources.add("烹飪製作")});',
'cooking source'
)
must_replace(
'(MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>ensure(name,file,"mine")));',
'(MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>{const it=ensure(name,file,"mine");if(it)it.sources.add(`礦井 ${group.range} 層${group.note?` · ${group.note}`:""}`)}));',
'mine source'
)

# Drop sell-price calculation and make recommendation exactly one word: 留 / 賣.
must_sub(
r'    const priceDbV44=window\.SDVItemPricesV44\|\|\{\};.*?    const fixedUses=',
'    const fixedUses=',
'price logic'
)
must_sub(
 r'    const mustKeepV44=.*?    const usageRowsV44=\[\];',
'''    const mustKeepV45=Boolean(selected&&(usageSpecial?.keep||museum||fixedUses));
    const recommendActionV45=!selected?"":mustKeepV45?"留":"賣";
    const sourceFallbackV45=()=>{
      if(!selected)return "";
      const known=[...selected.sources].filter(Boolean);
      if(known.length)return known.slice(0,3).join("；");
      const hay=`${selected.name} ${selected.file}`;
      if(/Egg|Milk|Wool|Duck Feather|Rabbit's Foot|Truffle|雞蛋|牛奶|羊奶|羊毛|鴨毛|兔子的腳|松露/i.test(hay))return "飼養動物取得";
      if(/Mayonnaise|Cheese|Oil|Jelly|Wine|Juice|Beer|Pale Ale|Mead|Pickles|Cloth|Caviar|Aged Roe|Smoked Fish|Dried|Green Tea|蛋黃醬|奶酪|油|果醬|果酒|果汁|啤酒|蜂蜜酒|醃菜|布料|魚子醬|陳年魚籽|燻魚|果乾|蘑菇乾|綠茶/i.test(hay))return "加工設備製作";
      if(/Ore|Bar|Coal|Quartz|Stone|Geode|Crystal|礦|錠|煤|石英|晶球|水晶/i.test(hay))return "採礦／晶球／冶煉等";
      if(/Wood|Hardwood|Sap|Fiber|Moss|木材|硬木|樹液|纖維|苔蘚/i.test(hay))return "砍樹／野外採集";
      if(/Seed|種子/i.test(hay))return "商店、採集或相關解鎖取得";
      if(selected.shippable)return "農作、採集、養殖或加工取得；詳細來源可看 Wiki";
      return "取得方式較多；點 Wiki 看完整來源";
    };
    const sourceTextV45=sourceFallbackV45();
    const usageRowsV44=[];''',
'recommendation and source'
)

old_bottom='''        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:9,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          <div style={{minWidth:0}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>建議</span><div style={{fontSize:11,fontWeight:950,color:recommendActionV44==="留"?C.green:C.orange,marginTop:1}}>{recommendActionV44}</div><div style={{fontSize:7.5,color:C.muted,lineHeight:1.3,marginTop:1}}>{recommendReasonV44}</div></div>
          <div style={{minWidth:0}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>賣價</span><div style={{fontSize:11,fontWeight:950,color:C.brown,marginTop:1}}>{sellPriceTextV44}</div><div style={{fontSize:7.5,color:C.muted,lineHeight:1.3,marginTop:1}}>基礎賣價；品質與職業加成另計。</div></div>
        </div>'''
new_bottom='''        <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 58px",gap:8,alignItems:"stretch",marginTop:9,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          <div style={{minWidth:0}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>來源</span><div style={{fontSize:8.5,color:C.ink,lineHeight:1.35,marginTop:2}}>{sourceTextV45}</div></div>
          <div style={{minWidth:0,textAlign:"center",borderLeft:`1px solid ${C.line}`,paddingLeft:7}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>建議</span><div style={{fontSize:18,fontWeight:950,color:recommendActionV45==="留"?C.green:C.orange,lineHeight:1.15,marginTop:3}}>{recommendActionV45}</div></div>
        </div>'''
must_replace(old_bottom,new_bottom,'bottom source/action row')

# Shipment is itself a sale. Never recommend "留" merely to light the shipping collection.
s=s.replace('`出貨圖鑑：可出貨${shipped?"，目前已點亮":"，目前尚未點亮"}。`','`出貨圖鑑：${shipped?"已點亮":"賣出 1 個即可點亮"}。`')

p.write_text(s,encoding='utf-8')

# Remove now-unused price asset and bump browser cache version.
idx=Path('index.html')
i=idx.read_text(encoding='utf-8')
i=re.sub(r'\n\s*<script src="\.\/item-prices-v44\.js\?v=44"></script>','',i)
i=re.sub(r'\?v=44', '?v=45', i)
i=i.replace('deploy-v44','deploy-v45')
idx.write_text(i,encoding='utf-8')

sw=Path('sw.js')
w=sw.read_text(encoding='utf-8')
w=w.replace("stardew-tracker-v44","stardew-tracker-v45")
w=w.replace(",'./item-prices-v44.js'","")
w=w.replace("'./item-prices-v44.js',","")
sw.write_text(w,encoding='utf-8')
