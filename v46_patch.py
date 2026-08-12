from pathlib import Path
import json,re

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

# ---------- Generate a local, broader game item lookup database ----------
def load(name):
    return json.loads(Path('/tmp/sdv-v46',name).read_text(encoding='utf-8'))

objects=load('objects.json').get('objects',[])
big=load('bigcraftables.json').get('bigCraftables',[])
recipes=load('recipes.json')
shops=load('shops.json').get('shops',[])
extra_specs=[('boots.json','boots','boots'),('weapons.json','weapons','weapon'),('hats.json','hats','hat'),('trinkets.json','trinkets','trinket'),('books.json','books','book')]

# Reuse the hand-curated Chinese names already in the tracker when possible.
zh_by_en={}
mm=re.search(r'const ITEM_FILE_ZH_V26\s*=\s*\{(.*?)\n\};',s,re.S)
if mm:
    for alias,en in re.findall(r'"([^"]+)"\s*:\s*"([^"]+)"',mm.group(1)):
        if re.search(r'[\u3400-\u9fff]',alias) and en not in zh_by_en:
            zh_by_en[en]=alias
manual_zh={
    'Cherry Bomb':'櫻桃炸彈','Bomb':'炸彈','Mega Bomb':'超級炸彈',
    'Sonar Bobber':'聲納浮標','Treasure Hunter':'尋寶者',
    'Bait':'魚餌','Deluxe Bait':'高級魚餌','Wild Bait':'萬用魚餌','Magnet':'磁鐵',
    'Crab Pot':'蟹籠','Warp Totem: Farm':'農場傳送圖騰','Warp Totem: Beach':'海灘傳送圖騰',
    'Warp Totem: Mountains':'山區傳送圖騰','Warp Totem: Desert':'沙漠傳送圖騰','Warp Totem: Island':'薑島傳送圖騰'
}
zh_by_en.update(manual_zh)

category_name={
    '-2':'寶石','-4':'魚類','-5':'蛋類','-6':'奶類','-7':'料理','-12':'礦物','-15':'資源',
    '-20':'垃圾','-21':'魚餌','-22':'釣具','-26':'工匠品','-27':'樹液製品','-28':'怪物戰利品',
    '-74':'種子','-75':'蔬菜','-79':'水果','-80':'花卉','-81':'採集物'
}
cat_ing={
    '-4':'任意魚類','-5':'任意蛋類','-6':'任意奶類','-75':'任意蔬菜','-79':'任意水果','-80':'任意花卉',
    '-81':'任意採集物','-12':'任意礦物'
}
shop_names={
    'SeedShop':'皮埃爾雜貨店','JojaMart':'Joja 超市','Blacksmith':'鐵匠鋪','FishShop':'威利魚店',
    'AdventureShop':'探險家公會','AnimalShop':'瑪妮牧場','Carpenter':'羅賓木匠店','Sandy':'綠洲',
    'DesertTrade':'沙漠商人','Dwarf':'矮人商店','Krobus':'克羅巴斯商店','QiGemShop':'齊先生核桃房',
    'VolcanoShop':'火山矮人商店','Saloon':'星之果實餐吧','HatMouse':'帽子老鼠','IslandTrader':'薑島商人',
    'Casino':'賭場','Hospital':'哈維診所','Bookseller':'書商','RaccoonShop':'浣熊商店'
}

obj_by_id={str(o.get('id')):o for o in objects}
def zh(name):
    return zh_by_en.get(str(name),str(name))
def ingredient_name(ing):
    iid=str(ing.get('itemId',''))
    nm=str(ing.get('name') or '')
    if iid in cat_ing:return cat_ing[iid]
    if iid in obj_by_id:return zh(obj_by_id[iid].get('name') or nm or iid)
    return zh(nm or iid)

records={}
def rec(name,kind='object',obj_id=None):
    name=str(name or '').strip()
    if not name:return None
    r=records.setdefault(name,{'name':name,'zh':zh(name),'file':name,'kind':kind,'aliases':[],'sources':[],'uses':[],'recommend':''})
    if kind!='object' and r.get('kind')=='object':r['kind']=kind
    if obj_id is not None:r['id']=str(obj_id)
    return r

def add_unique(arr,text):
    text=str(text or '').strip()
    if text and text not in arr:arr.append(text)

for o in objects:
    name=o.get('name'); r=rec(name,'object',o.get('id'))
    if not r:continue
    tags=o.get('contextTags') or []
    cat=str(o.get('category'))
    if 'forage_item' in tags or any(str(t).startswith('forage_item') for t in tags): add_unique(r['sources'],'野外採集')
    if cat in ('-75','-79','-80'): add_unique(r['sources'],'種植作物／相關種子取得')
    if cat in ('-5','-6'): add_unique(r['sources'],'飼養動物取得')
    if cat in ('-2','-12'): add_unique(r['sources'],'採礦、晶球或礦物節點取得')
    if cat=='-28': add_unique(r['sources'],'怪物掉落')
    if cat=='-26': add_unique(r['sources'],'加工設備製作')
    if cat=='-20': add_unique(r['sources'],'釣魚垃圾、垃圾桶或回收相關')
    if cat=='-21': add_unique(r['uses'],'釣魚：作為魚餌使用')
    if cat=='-22': add_unique(r['uses'],'釣魚：裝在釣竿上提供特殊效果')
    if any(str(t).startswith('dye_') for t in tags): add_unique(r['uses'],'染色：可作為染料使用')
    if isinstance(o.get('edibility'),(int,float)) and o.get('edibility',-300)>0: add_unique(r['uses'],'可食用，恢復體力／生命值')
    r['category']=category_name.get(cat,'')

for b in big:
    r=rec(b.get('name'),'big',b.get('id'))
    if r:add_unique(r['uses'],'可放置的設備／設施／裝飾物品')

for filename,key,kind in extra_specs:
    data=load(filename)
    rows=data.get(key,[])
    for x in rows:
        r=rec(x.get('name'),kind,x.get('id'))
        if not r:continue
        if kind=='boots': add_unique(r['uses'],'裝備：鞋子欄，提供防禦／免疫等屬性')
        elif kind=='weapon': add_unique(r['uses'],'戰鬥：作為武器使用')
        elif kind=='hat': add_unique(r['uses'],'穿搭：作為帽子外觀裝備')
        elif kind=='trinket': add_unique(r['uses'],'戰鬥：精通後可裝備在飾品欄')
        elif kind=='book': add_unique(r['uses'],'閱讀：提供永久能力、經驗或特殊效果')

# Shop availability -> acquisition sources.
for shop in shops:
    label=shop_names.get(str(shop.get('id')),str(shop.get('id') or '商店'))
    for item in shop.get('items') or []:
        name=item.get('name')
        if name and name in records:
            add_unique(records[name]['sources'],f'{label}購買')

# Crafting recipes -> exact source recipe and ingredient-use relations.
crafting=recipes.get('crafting',[])
for rr in crafting:
    out=rr.get('outputItemName') or rr.get('name')
    ro=rec(out,'craft')
    if not ro:continue
    bits=[]
    for ing in rr.get('ingredients') or []:
        nm=ingredient_name(ing); amt=ing.get('amount',1)
        bits.append(f'{nm}×{amt}')
        raw=ing.get('name')
        iid=str(ing.get('itemId',''))
        base_name=obj_by_id.get(iid,{}).get('name') or raw
        ri=records.get(str(base_name))
        if ri:add_unique(ri['uses'],f'製作材料：{zh(out)}')
    if bits:add_unique(ro['sources'],'製作：'+'＋'.join(bits))

# High-value explicit gameplay uses and recommendations.
manual={
    'Cherry Bomb':('爆破小範圍岩石、礦石與障礙物，適合前期下礦。','留'),
    'Bomb':('爆破中等範圍岩石與礦石，加快礦井／骷髏洞窟清場。','留'),
    'Mega Bomb':('爆破大範圍岩石與礦石，適合骷髏洞窟快速下層。','留'),
    'Sonar Bobber':('釣魚：顯示上鉤魚的種類。','留'),
    'Treasure Hunter':('釣魚：降低魚逃脫影響，並提高釣魚寶箱相關收益。','留')
}
for name,(use,advice) in manual.items():
    r=rec(name,'object')
    add_unique(r['uses'],use);r['recommend']=advice
    r['zh']=zh(name)
    r['aliases'] += [x for x in ({
        'Cherry Bomb':['櫻桃炸彈','樱桃炸弹'],
        'Bomb':['炸彈','炸弹'],
        'Mega Bomb':['超級炸彈','超级炸弹'],
        'Sonar Bobber':['聲納浮標','声纳浮标','聲納魚標','声纳鱼标'],
        'Treasure Hunter':['尋寶者','寻宝者','尋寶魚標','寻宝鱼标']
    }.get(name,[])) if x not in r['aliases']]

# Keep the local file compact and useful.
out=[]
for r in records.values():
    if not r['sources']:
        if r['kind']=='big':r['sources']=['製作、商店、獎勵或場景取得']
        elif r['kind']=='boots':r['sources']=['礦井寶箱、商店或掉落取得']
        elif r['kind']=='weapon':r['sources']=['礦井／戰鬥掉落、寶箱或商店取得']
        elif r['kind']=='hat':r['sources']=['帽子老鼠、成就、活動或特殊條件取得']
        elif r['kind']=='trinket':r['sources']=['戰鬥精通後由怪物、寶箱等取得']
        elif r['kind']=='book':r['sources']=['書商、商店、掉落、寶箱或特殊獎勵取得']
        elif r.get('category')=='魚餌':r['sources']=['製作、魚店或相關掉落取得']
        elif r.get('category')=='釣具':r['sources']=['製作、魚店、寶箱或活動取得']
        else:r['sources']=['農作、採集、養殖、加工、商店、掉落或任務取得']
    # avoid dumping hundreds of near-duplicate use rows
    r['uses']=r['uses'][:8];r['sources']=r['sources'][:4]
    out.append(r)
Path('lookup-data-v46.js').write_text('/* Local Stardew 1.6.15 lookup data; generated at build time from pinned game-data extracts. */\nwindow.SDVLookupV46='+json.dumps({'items':out},ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

# ---------- UI / lookup integration ----------
# SectionTitle can receive an explicit game item sprite.
must_replace('  const file = UI_ICON_FILES[icon];','  const file = typeof icon==="string"&&icon.startsWith("game:")?icon.slice(5):UI_ICON_FILES[icon];','game section icon')

# Add thumbnail anchors for secondary fishing locations.
must_replace('const FISH_TIME_SEGMENTS_V42 = [', '''const FISH_AREA_THUMB_V46 = {
  forest_river:{x:36,y:70}, forest_pond:{x:27,y:60}, forest_falls:{x:22,y:84}, glacier:{x:34,y:84},
  island_n:{x:53,y:27}, caldera:{x:55,y:8}, island_w_fresh:{x:24,y:55}, island_w_ocean:{x:18,y:72},
  island_s:{x:55,y:84}, pirate:{x:79,y:78}
};

const FISH_TIME_SEGMENTS_V42 = [''', 'fish secondary thumbnails')

# Compact filter is collapsed by default.
must_replace('  const [fishTimesV42, setFishTimesV42] = useState([]);','  const [fishTimesV42, setFishTimesV42] = useState([]);\n  const [fishFiltersOpenV46, setFishFiltersOpenV46] = useState(false);','filter collapse state')

# Replace secondary text pills by map thumbnails with a center locator marker.
old_secondary='''        {activeCluster?.ids?.length>1&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{activeCluster.ids.map(id=>{const a=FISH_AREAS_V4.find(x=>x.id===id);return a?<Pill key={id} small active={area.id===id} onClick={()=>setFishAreaV4(id)}>{a.sub}</Pill>:null})}</div>}'''
new_secondary='''        {activeCluster?.ids?.length>1&&<div style={{marginTop:6}}><div style={{fontSize:7.8,fontWeight:900,color:C.muted,marginBottom:4}}>選具體水域／位置</div><div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(4,activeCluster.ids.length)},minmax(0,1fr))`,gap:4}}>{activeCluster.ids.map(id=>{const a=FISH_AREAS_V4.find(x=>x.id===id);if(!a)return null;const thumb=FISH_AREA_THUMB_V46[id]||activeCluster;const on=area.id===id;return <button key={id} onClick={()=>setFishAreaV4(id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:8,padding:3,minWidth:0,textAlign:"center"}}><div style={{position:"relative",height:47,borderRadius:6,overflow:"hidden",backgroundImage:`url(${GAME_FILE(mapMeta.file)})`,backgroundSize:"290% auto",backgroundPosition:`${thumb.x}% ${thumb.y}%`,backgroundRepeat:"no-repeat",imageRendering:"pixelated"}}><span style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:9,height:9,borderRadius:"50%",background:"#F7E6A4",border:"2px solid #9C3D2B",boxShadow:"0 1px 2px rgba(0,0,0,.35)"}}/></div><div style={{fontSize:7.2,fontWeight:950,color:on?C.orange:C.ink,lineHeight:1.08,marginTop:3}}>{a.sub}</div></button>})}</div></div>}'''
must_replace(old_secondary,new_secondary,'fish secondary cards')

# Replace large always-open condition filter with a compact collapsible control.
old_filter='''      <Card style={{marginTop:7,padding:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}><b style={{fontSize:9.5,color:C.brown}}>條件篩選</b>{(fishSeasonsV42.length||fishWeathersV42.length||fishTimesV42.length)?<button onClick={clearFilters} style={{border:0,background:"transparent",fontSize:8,color:C.blue,fontWeight:900}}>清除</button>:<span style={{fontSize:7.5,color:C.muted}}>未勾＝不限</span>}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:5}}>季節</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{SEASONS.map(x=>filterButton(x,fishSeasonsV42.includes(x),()=>toggleValue(x,fishSeasonsV42,setFishSeasonsV42),`${SEASON_COLORS[x]}30`))}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:6}}>天氣</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{["晴","雨"].map(x=>filterButton(x,fishWeathersV42.includes(x),()=>toggleValue(x,fishWeathersV42,setFishWeathersV42),x==="雨"?"#DCEBFA":"#FFF0B8"))}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:6}}>時間段</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{FISH_TIME_SEGMENTS_V42.map(x=>filterButton(x.name,fishTimesV42.includes(x.id),()=>toggleValue(x.id,fishTimesV42,setFishTimesV42),"#E5EDF2"))}</div>
      </Card>'''
new_filter='''      <Card style={{marginTop:7,padding:6}}>
        <button onClick={()=>setFishFiltersOpenV46(!fishFiltersOpenV46)} style={{width:"100%",border:0,background:"transparent",display:"flex",alignItems:"center",gap:6,padding:"2px 1px",textAlign:"left"}}><b style={{fontSize:9.2,color:C.brown}}>條件</b><span style={{flex:1,minWidth:0,fontSize:8,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{[...fishSeasonsV42,...fishWeathersV42,...fishTimesV42.map(id=>FISH_TIME_SEGMENTS_V42.find(x=>x.id===id)?.name).filter(Boolean)].join(" · ")||"不限"}</span><span style={{fontSize:9,color:C.brown,fontWeight:950}}>{fishFiltersOpenV46?"▲":"▼"}</span></button>
        {fishFiltersOpenV46&&<div style={{borderTop:`1px dashed ${C.line}`,marginTop:5,paddingTop:5}}><div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}><span style={{fontSize:7,fontWeight:900,color:C.muted,width:26}}>季節</span>{SEASONS.map(x=>filterButton(x,fishSeasonsV42.includes(x),()=>toggleValue(x,fishSeasonsV42,setFishSeasonsV42),`${SEASON_COLORS[x]}30`))}</div><div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",marginTop:4}}><span style={{fontSize:7,fontWeight:900,color:C.muted,width:26}}>天氣</span>{["晴","雨"].map(x=>filterButton(x,fishWeathersV42.includes(x),()=>toggleValue(x,fishWeathersV42,setFishWeathersV42),x==="雨"?"#DCEBFA":"#FFF0B8"))}</div><div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",marginTop:4}}><span style={{fontSize:7,fontWeight:900,color:C.muted,width:26}}>時間</span>{FISH_TIME_SEGMENTS_V42.map(x=>filterButton(x.name,fishTimesV42.includes(x.id),()=>toggleValue(x.id,fishTimesV42,setFishTimesV42),"#E5EDF2"))}</div>{(fishSeasonsV42.length||fishWeathersV42.length||fishTimesV42.length)?<button onClick={clearFilters} style={{border:0,background:"transparent",fontSize:7.5,color:C.blue,fontWeight:900,marginTop:4,padding:0}}>清除全部條件</button>:null}</div>}
      </Card>'''
must_replace(old_filter,new_filter,'compact fish filters')

# Expand lookup item record shape and ingest generated game data.
must_replace('if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),sources:new Set(),bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false});','if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),sources:new Set(),uses:new Set(),recommend:"",bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false});','lookup record shape')
must_replace('''    SHIPPING_ITEMS_V30.forEach(([file,name])=>{const it=ensure(name,file,"shipping");if(it)it.shippable=true});''','''    (window.SDVLookupV46?.items||[]).forEach(row=>{const it=ensure(row.zh||row.name,row.file||row.name,row.kind||"game");if(!it)return;it.aliases.add(row.name);(row.aliases||[]).forEach(x=>it.aliases.add(x));(row.sources||[]).forEach(x=>it.sources.add(x));(row.uses||[]).forEach(x=>it.uses.add(x));if(row.recommend)it.recommend=row.recommend;});
    SHIPPING_ITEMS_V30.forEach(([file,name])=>{const it=ensure(name,file,"shipping");if(it)it.shippable=true});''','generated lookup ingestion')

# Prefer existing Chinese aliases for generated English-only records.
must_replace('''    index.forEach(it=>{(aliasesByFileV43.get(String(it.file||""))||[]).forEach(alias=>it.aliases.add(alias))});''','''    index.forEach(it=>{const localAliases=aliasesByFileV43.get(String(it.file||""))||[];localAliases.forEach(alias=>it.aliases.add(alias));if(/^[\\x00-\\x7F]+$/.test(String(it.name||""))){const z=[...localAliases].find(alias=>/[\\u3400-\\u9fff]/.test(alias));if(z)it.name=z;}});''','prefer local Chinese display')

# More common aliases, especially items that previously could not be found.
must_replace('''      "Battery Pack":["電池","电池"]''','''      "Battery Pack":["電池","电池"],
      "Cherry Bomb":["櫻桃炸彈","樱桃炸弹"],
      "Bomb":["炸彈","炸弹"],
      "Mega Bomb":["超級炸彈","超级炸弹"],
      "Sonar Bobber":["聲納浮標","声纳浮标","聲納魚標","声纳鱼标"],
      "Treasure Hunter":["尋寶者","寻宝者","尋寶魚標","寻宝鱼标"]''','lookup aliases')
# Ensure 彈/聲/尋 also normalize between traditional/simplified.
must_replace('"黃黄","藍蓝"','"黃黄","藍蓝","彈弹","聲声","尋寻"','search t2s additions')

# Generated gameplay uses are shown before generic fallbacks.
must_replace('''      (usageSpecial?.uses||[]).forEach(u=>usageRowsV44.push(["⭐",u]));''','''      (usageSpecial?.uses||[]).forEach(u=>usageRowsV44.push(["⭐",u]));
      [...selected.uses].forEach(u=>usageRowsV44.push(["🔧",u]));''','generated item uses')

# Recommendation respects explicit lookup advice; shipment alone never forces 留.
must_replace('''    const mustKeepV45=Boolean(selected&&(usageSpecial?.keep||museum||fixedUses));
    const recommendActionV45=!selected?"":mustKeepV45?"留":"賣";''','''    const mustKeepV46=Boolean(selected&&(selected.recommend==="留"||usageSpecial?.keep||museum||fixedUses));
    const recommendActionV46=!selected?"":selected.recommend|| (mustKeepV46?"留":"賣");''','recommendation logic')
s=s.replace('recommendActionV45','recommendActionV46')

# No runtime Wiki dependency in item lookup; make source self-contained and rebalance visual hierarchy.
s=s.replace('return "農作、採集、養殖或加工取得；詳細來源可看 Wiki";','return "農作、採集、養殖或加工取得";')
s=s.replace('return "取得方式較多；點 Wiki 看完整來源";','return "農作、採集、養殖、加工、商店、掉落或任務取得";')
s=s.replace('會整理出貨、博物館、收集包、料理、裁縫與重要特殊用途；查不到的再直接進 Wiki。','會整理用途、取得方式、收集包、料理、裁縫、製作與重要特殊用途。')
s=s.replace('目前本機資料沒有找到；可改用繁中／簡中／英文名稱，或直接用 Wiki 查。','目前沒有找到；可改用繁中／簡中／英文名稱或常見別名。')
s=s.replace('<div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={selected.file} size={44}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:14,color:C.darkBrown}}>{selected.name}</b><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{resultTags(selected).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</div></div><WikiBtn name={selected.name}/></div>','<div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={selected.file} size={44}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:14,color:C.darkBrown}}>{selected.name}</b><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{resultTags(selected).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</div></div></div>')
s=s.replace('''<div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 58px",gap:8,alignItems:"stretch",marginTop:9,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          <div style={{minWidth:0}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>來源</span><div style={{fontSize:8.5,color:C.ink,lineHeight:1.35,marginTop:2}}>{sourceTextV45}</div></div>
          <div style={{minWidth:0,textAlign:"center",borderLeft:`1px solid ${C.line}`,paddingLeft:7}}><span style={{fontSize:7.4,color:C.muted,fontWeight:900}}>建議</span><div style={{fontSize:18,fontWeight:950,color:recommendActionV46==="留"?C.green:C.orange,lineHeight:1.15,marginTop:3}}>{recommendActionV46}</div></div>
        </div>''','''<div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) auto",gap:8,alignItems:"center",marginTop:9,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          <div style={{minWidth:0}}><span style={{fontSize:8,color:C.muted,fontWeight:950}}>來源／取得方式</span><div style={{fontSize:9.4,color:C.ink,lineHeight:1.4,marginTop:2,fontWeight:750}}>{sourceTextV45}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:7.3,color:C.muted,fontWeight:900}}>建議</span><span style={{fontSize:9,fontWeight:950,color:recommendActionV46==="留"?C.green:C.orange,background:recommendActionV46==="留"?"#EAF4D8":"#FFF0D2",borderRadius:8,padding:"3px 6px"}}>{recommendActionV46}</span></div>
        </div>''')

# Generated records get useful type tags in results.
must_replace('''if(it.kinds.has("fish"))tags.push(["魚","#DDECF7"]);return tags.slice(0,3)};''','''if(it.kinds.has("fish"))tags.push(["魚","#DDECF7"]);if(it.kinds.has("craft"))tags.push(["製作","#F4E4C7"]);if(it.kinds.has("big"))tags.push(["設備","#E8E1D4"]);return tags.slice(0,3)};''','lookup tags')

# Game-native header + requested bobber icons.
old_render='''    return <div><SectionTitle icon="🔎">查找</SectionTitle><Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.7,color:C.muted,lineHeight:1.4}}>查物品要不要留、能不能賣；或從地圖與條件反查魚在哪裡釣。</div></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:7}}><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Magnifying Glass" size={29}/>物品用途</button><button onClick={()=>setFishViewV4("find")} style={{border:`2px solid ${fast==="find"?C.orange:C.line}`,background:fast==="find"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={29}/>找魚</button></div>{fast==="items"?renderItemUsageV42():renderFishFindV4()}</div>;'''
new_render='''    return <div><SectionTitle icon="game:Magnifying Glass">查找</SectionTitle><Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.7,color:C.muted,lineHeight:1.4}}>查物品用途與來源，或從地圖和條件反查魚的位置。</div></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:7}}><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={29}/>物品用途</button><button onClick={()=>setFishViewV4("find")} style={{border:`2px solid ${fast==="find"?C.orange:C.line}`,background:fast==="find"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Sonar Bobber" size={29}/>找魚</button></div>{fast==="items"?renderItemUsageV42():renderFishFindV4()}</div>;'''
must_replace(old_render,new_render,'lookup page icons')

# Load local static lookup data and bump cache.
idx=Path('index.html')
i=idx.read_text(encoding='utf-8')
i=re.sub(r'\?v=45','?v=46',i)
i=i.replace('  <script src="./animal-preview-v33.js?v=46"></script>','  <script src="./animal-preview-v33.js?v=46"></script>\n  <script src="./lookup-data-v46.js?v=46"></script>')
i=i.replace('deploy-v45','deploy-v46')
idx.write_text(i,encoding='utf-8')

sw=Path('sw.js')
w=sw.read_text(encoding='utf-8').replace('stardew-tracker-v45','stardew-tracker-v46')
w=w.replace("'./manifest.webmanifest'","'./lookup-data-v46.js','./manifest.webmanifest'")
sw.write_text(w,encoding='utf-8')

p.write_text(s,encoding='utf-8')
