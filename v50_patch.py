from pathlib import Path
import json, urllib.request

ROOT=Path('.')
SOURCE_COMMIT='70d5f8d306cc7f8cfeba31a8cbec310483390519'
RAW=f'https://raw.githubusercontent.com/chiefpansancolt/stardew-valley-data/{SOURCE_COMMIT}/data/'

def fetch_json(name):
    req=urllib.request.Request(RAW+name,headers={'User-Agent':'stardew-tracker-v50'})
    with urllib.request.urlopen(req,timeout=30) as r:
        return json.load(r)

def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing patch target: {label}')
    return text.replace(old,new,1)

# ---------- generate social-data-v50.js ----------
villagers=fetch_json('villagers.json')
orders=fetch_json('special-orders.json')
animals=fetch_json('animals.json')

ENG_TO_ZH={
'Abigail':'阿比蓋爾','Emily':'艾蜜麗','Haley':'海莉','Leah':'莉亞','Maru':'瑪魯','Penny':'潘妮',
'Alex':'亞歷克斯','Elliott':'艾利歐特','Harvey':'哈維','Sam':'山姆','Sebastian':'塞巴斯蒂安','Shane':'謝恩',
'Caroline':'卡洛琳','Clint':'克林特','Demetrius':'德米特里厄斯','Evelyn':'艾芙琳','George':'喬治','Gus':'格斯',
'Jas':'賈斯','Jodi':'喬迪','Kent':'肯特','Lewis':'劉易斯','Linus':'萊納斯','Marnie':'瑪妮','Pam':'潘姆',
'Pierre':'皮埃爾','Robin':'羅賓','Vincent':'文森特','Willy':'威利','Wizard':'法師','Sandy':'桑迪','Krobus':'克羅巴斯','Dwarf':'矮人','Leo':'雷歐'
}
SEASON_ZH={'spring':'春','summer':'夏','fall':'秋','winter':'冬'}
INTRO={
'阿比蓋爾':'住在皮埃爾雜貨店樓上，喜歡冒險與電玩；可交往。','艾蜜麗':'住在柳巷 2 號，在星之果實酒吧工作；可交往。','海莉':'住在柳巷 2 號，喜歡攝影與時尚；可交往。','莉亞':'住在煤礦森林的小屋，是雕塑與繪畫創作者；可交往。','瑪魯':'住在木匠店，平時也在哈維診所工作；可交往。','潘妮':'住在鎮上的拖車，會教賈斯與文森特讀書；可交往。',
'亞歷克斯':'住在河間大道 1 號，熱愛運動並夢想成為職業球員；可交往。','艾利歐特':'住在海灘小屋，是作家；可交往。','哈維':'鎮上的醫師，住在診所樓上；可交往。','山姆':'住在柳巷 1 號，喜歡音樂與滑板；可交往。','塞巴斯蒂安':'住在木匠店地下室，從事程式工作並喜歡機車；可交往。','謝恩':'住在瑪妮牧場，前期在 Joja 工作；可交往。',
'卡洛琳':'皮埃爾的妻子、阿比蓋爾的母親，住在雜貨店。','克林特':'鎮上的鐵匠，負責工具升級與晶球處理。','德米特里厄斯':'住在木匠店，是研究山谷生態的科學家。','艾芙琳':'住在河間大道 1 號，與喬治、亞歷克斯同住。','喬治':'住在河間大道 1 號，與艾芙琳、亞歷克斯同住。','格斯':'星之果實酒吧老闆，日常在吧台工作。',
'賈斯':'住在瑪妮牧場，平日常和文森特一起上課。','喬迪':'住在柳巷 1 號，是山姆與文森特的母親。','肯特':'喬迪的丈夫，第 2 年春季返家。','劉易斯':'鵜鶘鎮鎮長，負責許多城鎮活動。','萊納斯':'住在深山帳篷，重視自然與自給自足。','瑪妮':'經營瑪妮牧場，販售動物與畜牧用品。','潘姆':'住在鎮上的拖車；公車修復後擔任巴士司機。',
'皮埃爾':'經營皮埃爾雜貨店，主要販售種子與農業用品。','羅賓':'鎮上的木匠，負責農舍升級與農場建築。','文森特':'住在柳巷 1 號，平日常和賈斯一起上課。','威利':'住在海灘魚店，是釣魚相關商店老闆。','法師':'住在煤礦森林西側的法師塔，與魔法任務及建築相關。','桑迪':'住在沙漠並經營綠洲商店。','克羅巴斯':'住在下水道的友善暗影人，販售稀有物品，也可成為室友。','矮人':'住在礦井入口東側；學會矮人語後可交易與提升友情。','雷歐':'來自薑島、和鸚鵡一起長大；後續可搬到深山樹屋。'
}

SHOP_SPECS={
'Pierre':('皮埃爾雜貨店','09:00–17:00；週三休息，社區中心完成後週三也營業','pierre-shop.json'),
'Robin':('木匠的商店','09:00–17:00；週二休息，週五 16:00 收攤；施工日不營業','carpenter-shop.json'),
'Marnie':('瑪妮的牧場','09:00–16:00；週一、週二休息；讀過《動物目錄》後可在她不站櫃台時購物','marnie-shop.json'),
'Willy':('魚店','09:00–17:00；晴天週六休息','willy-shop.json'),
'Gus':('星之果實酒吧','12:00–00:00；一般每天營業','saloon-shop.json'),
'Clint':('鐵匠鋪','09:00–16:00；社區中心完成後週五休息','blacksmith-shop.json'),
'Harvey':('哈維的診所','09:00–15:00；需哈維或瑪魯在櫃檯時才能購買醫療用品','medical-supplies-shop.json'),
'Sandy':('綠洲','09:00–23:50；沙漠節不營業，秋 15 日 13:00 後暫停營業','oasis-shop.json'),
'Krobus':('科羅巴斯的商店','下水道開放後皆可購物，節日照常','krobus-shop.json'),
'Dwarf':('矮人的商店','礦井開放期間可交易；需先取得矮人語教程','dwarf-shop.json'),
'Wizard':('法師塔／魔法建築','法師塔 06:00–23:00；魔法建築需完成魔法墨水任務','wizard-shop.json')
}

def shop_item(row):
    if not isinstance(row,dict) or not row.get('name'): return None
    return {k:v for k,v in {
        'name':row.get('name'),'price':row.get('price'),'seasons':row.get('seasons') or [],
        'availability':row.get('availability'),'category':row.get('category')
    }.items() if v not in (None,[], '')}

shops={}
for owner,(label,hours,file) in SHOP_SPECS.items():
    rows=fetch_json(file)
    items=[x for x in (shop_item(r) for r in rows) if x]
    if owner=='Marnie':
        wanted={'Chicken','Cow','Goat','Duck','Sheep','Rabbit','Pig'}
        livestock=[]
        seen=set()
        for a in animals:
            name=a.get('name')
            if name in wanted and name not in seen and a.get('purchasePrice') is not None:
                seen.add(name); livestock.append({'name':name,'price':a['purchasePrice'],'category':'livestock'})
        items=livestock+items
    shops[owner]={'label':label,'hours':hours,'items':items}

ORDER_DETAIL={
'Robin':('羅賓的計畫','收集 80 個硬木','2,000g、羅賓友情 +250；首次完成後解鎖豪華紅色雙人床'),
'Robin2':('羅賓的資源衝刺','收集 1,000 個木材或石頭','2,500g、石製箱配方'),
'Demetrius':('水生生物過度繁殖','捕捉 10 條當季指定魚','魚本身售價金額、農場電腦配方'),
'Demetrius2':('生物群落平衡','捕捉 20 條河魚、海魚或湖魚','1,500g、農場電腦配方'),
'Linus':('社區清理','收集 20 個垃圾並投入鐵路垃圾箱','500g、萊納斯友情 +250、纖維種子配方'),
'Emily':('寶石恢復活力','交付紅寶石、黃玉、綠寶石、翡翠、紫水晶各 1','1,000g、艾蜜麗友情 +250、縫紉機'),
'Pam':('潘姆需要果汁','把 12 個馬鈴薯汁放進潘姆廚房','3,000g、潘姆友情 +250、F.I.B.S. 電視頻道'),
'Gus':('格斯的著名煎蛋捲','把 24 顆蛋放進星之果實酒吧冰箱','3,000g；首次完成獲得迷你冰箱'),
'Pierre':('皮埃爾的優質農產品','把 25 個金星蔬菜投入雜貨店箱子','2,500g、迷你出貨箱'),
'Lewis':('農作物訂單','出貨 100 個指定當季作物','作物基礎價 50% 金額；首次完成獲得迷你出貨箱'),
'Willy':('需要多汁蟲肉！','收集 100 個蟲肉並投入魚店旁箱子','3,000g、高品質浮標配方'),
'Willy2':('熱帶魚','捕捉黃貂魚、藍鐵餅魚、獅子魚各 5 條','2,500g、豪華魚缸'),
'Wizard':('奇特物質','收集 1 個靈外質','2,500g、迷你圖騰柱配方'),
'Wizard2':('五彩膠凍','收集 1 個五彩膠凍','5,000g、怪獸香水配方'),
'Caroline':('島嶼原料','出貨 100 個芋頭、薑或鳳梨中的指定品項','作物基礎價 50% 金額、太陽能板配方'),
'Clint':('洞穴巡邏','消滅 50 隻指定蝙蝠／灰塵精靈／骷髏／蛆','6,000g；首次完成獲得晶球破開器配方'),
'Evelyn':('給喬治的禮物','收集 12 根韭蔥並放到艾芙琳爐台','2,000g、咖啡機')
}
orders_by={}
for row in orders:
    oid=str(row.get('id',''))
    requester=row.get('requester')
    if oid not in ORDER_DETAIL or requester not in ENG_TO_ZH: continue
    title,need,reward=ORDER_DETAIL[oid]
    orders_by.setdefault(requester,[]).append({'id':oid,'name':title,'days':row.get('timeframe'),'need':need,'reward':reward,'repeatable':bool(row.get('repeatable'))})

vill_by_name={v.get('name'):v for v in villagers}
by_zh={}
for eng,zh in ENG_TO_ZH.items():
    v=vill_by_name.get(eng,{})
    birthday=v.get('birthday') or {}
    by_zh[zh]={
        'english':eng,
        'birthday':{'season':SEASON_ZH.get(birthday.get('season'),birthday.get('season','')),'day':birthday.get('day')},
        'intro':INTRO.get(zh,''),
        'loves':v.get('loves') or [],'likes':v.get('likes') or [],'hates':v.get('hates') or [],
        'shop':shops.get(eng),'orders':orders_by.get(eng,[])
    }

social={'sourceCommit':SOURCE_COMMIT,'byZh':by_zh}
Path('social-data-v50.js').write_text('window.SDVSocialV50='+json.dumps(social,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

# ---------- app.jsx ----------
p=Path('app.jsx'); app=p.read_text(encoding='utf-8')
app=replace_once(app,
'  collections: { fish: [], artifact: [], mineral: [] }, mastery: [], notes: "", extras: { starfruit: 0, buildingNote: "" },',
'  collections: { fish: [], artifact: [], mineral: [] }, mastery: [], notes: "", raccoonV50:{stump:false,requests:0}, extras: { starfruit: 0, buildingNote: "" },',
'prefill raccoon')

# Raccoon belongs to Community, not the farm-building list.
app=replace_once(app,
'    const jojaDone=data.jojaProjectsV28||[];\n    const room=BUNDLE_ROOMS.find(r=>r.id===bundleRoom)||BUNDLE_ROOMS[0];',
'    const jojaDone=data.jojaProjectsV28||[];\n    const raccoonV50=data.raccoonV50||{stump:false,requests:0};\n    const setRaccoonV50=patch=>update({raccoonV50:{...raccoonV50,...patch}});\n    const room=BUNDLE_ROOMS.find(r=>r.id===bundleRoom)||BUNDLE_ROOMS[0];',
'raccoon state')
app=replace_once(app,
'''      {route==="cc"&&<>''',
'''      {route==="cc"&&<>''',
'community route anchor')
end_anchor='''      </>}\n    </div>;\n  };\n\n  const renderFarm = () => {'''
raccoon_block='''      </>}\n\n      <SectionTitle icon="game:Raccoon Icon">森林鄰居</SectionTitle>\n      <Card style={{padding:9,background:raccoonV50.stump?"#EEF7DD":C.paper}}>\n        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Raccoon Icon" size={38}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:12,color:C.darkBrown}}>大樹樁・浣熊一家</b><div style={{fontSize:8.5,color:C.muted,lineHeight:1.35,marginTop:2}}>位於煤礦森林，屬於城鎮／鄰居進度，不算農場建築。</div></div><button onClick={()=>setRaccoonV50({stump:!raccoonV50.stump,requests:!raccoonV50.stump?raccoonV50.requests:0})} style={{border:`1.5px solid ${raccoonV50.stump?C.green:C.line}`,background:raccoonV50.stump?C.lightGreen:C.cream,borderRadius:7,padding:"5px 7px",fontSize:8.5,fontWeight:950,color:raccoonV50.stump?C.green:C.brown}}>{raccoonV50.stump?"✓ 樹樁已修復":"未修復"}</button></div>\n        {raccoonV50.stump&&<><div style={{display:"grid",gridTemplateColumns:"auto 24px 42px 24px",alignItems:"center",gap:4,marginTop:8,paddingTop:7,borderTop:`1px dashed ${C.line}`}}><span style={{fontSize:9,fontWeight:950,color:C.brown}}>已完成浣熊請求</span><button onClick={()=>setRaccoonV50({requests:Math.max(0,Number(raccoonV50.requests||0)-1)})} style={{border:0,background:C.cream,borderRadius:6,height:22,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10,color:C.green,textAlign:"center"}}>{Number(raccoonV50.requests||0)} 次</b><button onClick={()=>setRaccoonV50({requests:Math.min(99,Number(raccoonV50.requests||0)+1)})} style={{border:0,background:C.cream,borderRadius:6,height:22,fontWeight:950,color:C.brown}}>＋</button></div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:7}}>{[[1,"妻子商店"],[2,"浣熊日記"],[3,"浣熊帽"],[9,"好鄰居成就"]].map(([n,label])=>{const on=Number(raccoonV50.requests||0)>=n;return <span key={label} style={{fontSize:7.5,fontWeight:900,padding:"3px 6px",borderRadius:8,background:on?"#DFF0CD":"#EEE5D2",color:on?C.green:C.muted}}>{on?"✓ ":""}{label}</span>})}</div><div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:6}}>每完成一次請求後約 7 天才會出現下一次；第 9 次完成「好鄰居」成就，之後仍可繼續交換。</div></>}\n      </Card>\n    </div>;\n  };\n\n  const renderFarm = () => {'''
app=replace_once(app,end_anchor,raccoon_block,'insert raccoon community card')

# Farm machines: add practical farm-equipment group.
app=replace_once(app,
'''      refining:[\n        ["bait_maker"''',
'''      farm:[\n        ["sprinkler","灑水器","Sprinkler",[]],["quality_sprinkler","高級灑水器","Quality Sprinkler",[]],["iridium_sprinkler","銥製灑水器","Iridium Sprinkler",[]],["scarecrow","稻草人","Scarecrow",[]],["deluxe_scarecrow","豪華稻草人","Deluxe Scarecrow",[]],["garden_pot","花盆","Garden Pot",[]],["auto_grabber","自動收集器","Auto-Grabber",[]],["auto_petter","自動撫摸機","Auto-Petter",[]],["heater","加熱器","Heater",[]]\n      ],\n      refining:[\n        ["bait_maker"''',
'farm equipment group')

# Zero-count animals should read as unavailable/grey, like unbuilt buildings.
old_animal='''    const AnimalGrid=({items})=><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{items.map(a=>{const n=Number(data.animals?.[a.name]||0);return <div key={a.name} style={{border:`1.5px solid ${n>0?C.green:C.line}`,background:n>0?"#EEF7DD":C.paper,borderRadius:9,padding:"5px 3px",textAlign:"center",minWidth:0}}><GameIcon file={ANIMAL_ICON_FILES[a.name]} size={34}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>{a.name}</div><ProductLine name={a.name}/><div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",alignItems:"center",gap:2,marginTop:3}}><button onClick={()=>setAnimalCount(a.name,n-1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>−</button><b style={{fontSize:10.5,color:n?C.green:C.muted}}>{n}</b><button onClick={()=>setAnimalCount(a.name,n+1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>＋</button></div></div>})}</div>;'''
new_animal='''    const AnimalGrid=({items})=><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{items.map(a=>{const n=Number(data.animals?.[a.name]||0),active=n>0;return <div key={a.name} style={{border:`1.5px solid ${active?C.green:C.line}`,background:active?"#EEF7DD":"#EEE9DE",borderRadius:9,padding:"5px 3px",textAlign:"center",minWidth:0}}><div style={{filter:active?"none":"grayscale(1)",opacity:active?1:.32}}><GameIcon file={ANIMAL_ICON_FILES[a.name]} size={34}/><div style={{fontSize:9,fontWeight:950,color:active?C.ink:C.muted}}>{a.name}</div><ProductLine name={a.name}/></div><div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",alignItems:"center",gap:2,marginTop:3}}><button onClick={()=>setAnimalCount(a.name,n-1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>−</button><b style={{fontSize:10.5,color:active?C.green:C.muted}}>{n}</b><button onClick={()=>setAnimalCount(a.name,n+1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>＋</button></div></div>})}</div>;'''
app=replace_once(app,old_animal,new_animal,'animal grey state')

# Multiplayer cabin image: use the in-game Trailer Cabin variant instead of missing Log Cabin file.
app=app.replace('name="連線小屋" file="Log Cabin"','name="連線小屋" file="Trailer Cabin"')

# Compact six hand tools into one row.
old_tools='''        <SectionTitle icon="🔧">手持工具</SectionTitle>\n        <Card style={{padding:8}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{TOOL_NAMES.map(([id,name])=>{const level=data.tools?.[id]||"初始",idx=TOOL_LEVELS.indexOf(level);return <button key={id} onClick={()=>updateNested("tools",{[id]:TOOL_LEVELS[(idx+1)%TOOL_LEVELS.length]})} style={{border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"6px 3px",cursor:"pointer"}}><GameIcon file={toolFiles[id]?.[level]||TOOL_ICON_FILES[id]} size={36}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>{name}</div><div style={{fontSize:8.5,color:C.green,fontWeight:950,marginTop:2}}>{level}</div></button>})}<button onClick={()=>{const idx=panLevels.indexOf(panLevel);updateNested("tools",{pan:panLevels[(idx+1)%panLevels.length]})}} style={{border:`1.5px solid ${panLevel!=="未取得"?C.green:C.line}`,background:panLevel!=="未取得"?"#EEF7DD":C.paper,borderRadius:9,padding:"6px 3px",cursor:"pointer",opacity:panLevel==="未取得"?.55:1}}><GameIcon file={panFiles[panLevel]} size={36}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>淘金盤</div><div style={{fontSize:8.5,color:panLevel!=="未取得"?C.green:C.muted,fontWeight:950,marginTop:2}}>{panLevel}</div></button></div><div style={{fontSize:8.5,color:C.muted,marginTop:6,textAlign:"center"}}>點圖示循環切換工具等級；淘金盤為未取得 → 銅 → 鋼 → 金 → 銥。</div></Card>'''
new_tools='''        <SectionTitle icon="🔧">手持工具</SectionTitle>\n        <Card style={{padding:6}}><div style={{display:"grid",gridTemplateColumns:"repeat(6,minmax(0,1fr))",gap:3}}>{TOOL_NAMES.map(([id,name])=>{const level=data.tools?.[id]||"初始",idx=TOOL_LEVELS.indexOf(level);return <button key={id} onClick={()=>updateNested("tools",{[id]:TOOL_LEVELS[(idx+1)%TOOL_LEVELS.length]})} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:7,padding:"4px 1px",cursor:"pointer",minWidth:0}}><GameIcon file={toolFiles[id]?.[level]||TOOL_ICON_FILES[id]} size={25}/><div style={{fontSize:6.7,fontWeight:950,color:C.ink,whiteSpace:"nowrap"}}>{name}</div><div style={{fontSize:7,color:C.green,fontWeight:950,marginTop:1}}>{level}</div></button>})}<button onClick={()=>{const idx=panLevels.indexOf(panLevel);updateNested("tools",{pan:panLevels[(idx+1)%panLevels.length]})}} style={{border:`1px solid ${panLevel!=="未取得"?C.green:C.line}`,background:panLevel!=="未取得"?"#EEF7DD":"#EEE9DE",borderRadius:7,padding:"4px 1px",cursor:"pointer",minWidth:0}}><span style={{display:"block",filter:panLevel!=="未取得"?"none":"grayscale(1)",opacity:panLevel!=="未取得"?1:.35}}><GameIcon file={panFiles[panLevel]} size={25}/></span><div style={{fontSize:6.7,fontWeight:950,color:C.ink,whiteSpace:"nowrap"}}>淘金盤</div><div style={{fontSize:7,color:panLevel!=="未取得"?C.green:C.muted,fontWeight:950,marginTop:1}}>{panLevel}</div></button></div><div style={{fontSize:7.6,color:C.muted,marginTop:5,textAlign:"center"}}>點按循環切換等級；淘金盤：未取得 → 銅 → 鋼 → 金 → 銥。</div></Card>'''
app=replace_once(app,old_tools,new_tools,'compact tools')

# Rename/expand farm equipment categories.
old_machine='''        <SectionTitle icon="🏗️">加工設備</SectionTitle>\n        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}><button onClick={()=>setMachineGroup("artisan")} style={{border:`2px solid ${machineGroup==="artisan"?C.orange:C.line}`,background:machineGroup==="artisan"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Keg" size={27}/>工匠加工・10</button><button onClick={()=>setMachineGroup("refining")} style={{border:`2px solid ${machineGroup==="refining"?C.orange:C.line}`,background:machineGroup==="refining"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Furnace" size={27}/>精煉設備・20</button></div>\n        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{machineDefs[machineGroup].map(([id,name,file,products])=><MachineTile key={id} id={id} name={name} file={file} products={products}/>)}</div></Card>'''
new_machine='''        <SectionTitle icon="🏗️">農場設備</SectionTitle>\n        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:4,marginBottom:6}}>{[["artisan","工匠加工","Keg"],["refining","精煉設備","Furnace"],["farm","農務設備","Iridium Sprinkler"]].map(([id,label,file])=><button key={id} onClick={()=>setMachineGroup(id)} style={{border:`1.5px solid ${machineGroup===id?C.orange:C.line}`,background:machineGroup===id?"#FFE2A8":C.paper,borderRadius:8,padding:"4px 2px",fontSize:7.7,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file={file} size={23}/><div>{label}・{machineDefs[id].length}</div></button>)}</div>\n        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{(machineDefs[machineGroup]||machineDefs.artisan).map(([id,name,file,products])=><MachineTile key={id} id={id} name={name} file={file} products={products}/>)}</div></Card>'''
app=replace_once(app,old_machine,new_machine,'farm equipment tabs')

# Replace Social page with an information-first design.
start=app.index('  const renderPeople = () => {')
end=app.index('\n\n  const renderPowers',start)
new_people=r'''  const renderPeople = () => {
    const g=NPC_GROUPS.find(x=>x.id===socialGroup)||NPC_GROUPS[0];
    const socialV50=window.SDVSocialV50?.byZh||{};
    const lookupRowsV50=window.SDVLookupV46?.items||[];
    const seasonEnV50={春:"spring",夏:"summer",秋:"fall",冬:"winter"}[data.base.season]||"spring";
    const genericGiftV50=item=>/^(All |Any |Most |Every |Universal )|\(except|except |items$|category$/i.test(String(item||""));
    const giftMetaV50=item=>{
      const raw=String(item||"");
      const row=lookupRowsV50.find(r=>r?.name===raw||r?.file===raw||r?.zh===raw);
      const generic=genericGiftV50(raw);
      const file=generic?"":(row?.file||raw);
      return {raw,file,key:file||raw,name:generic?raw:switchNameV47(row?.zh||raw,file),source:generic?"通用物品分類":((row?.sources||[])[0]||"點擊查看詳細用途／來源"),generic};
    };
    const openLookupV50=item=>{
      const m=giftMetaV50(item); if(m.generic)return;
      setItemUsageQueryV42(m.raw); setItemUsageSelectedV42(m.key); setFishViewV4("items"); setTab("fishing"); window.scrollTo(0,0);
    };
    const GiftGridV50=({title,items,tone})=>{const rows=(items||[]);if(!rows.length)return null;return <div style={{marginTop:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:4}}>{title}・{rows.length}</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5}}>{rows.map((item,i)=>{const m=giftMetaV50(item);return <button key={`${title}-${item}-${i}`} disabled={m.generic} onClick={()=>openLookupV50(item)} style={{border:`1px solid ${C.line}`,background:tone,borderRadius:8,padding:"5px 3px",minHeight:72,textAlign:"center",opacity:m.generic?.72:1,cursor:m.generic?"default":"pointer",minWidth:0}}><div style={{height:29,display:"flex",alignItems:"center",justifyContent:"center"}}>{m.file?<GameIcon file={m.file} size={29}/>:<span style={{fontSize:15,color:C.muted}}>•</span>}</div><div style={{fontSize:7.8,fontWeight:950,color:C.ink,lineHeight:1.08,marginTop:2}}>{m.name}</div><div style={{fontSize:6.5,color:C.muted,lineHeight:1.12,marginTop:3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{m.source}</div></button>})}</div></div>};
    const CompactLovesV50=({items})=><div style={{display:"flex",gap:2,overflowX:"auto",padding:"2px 0",WebkitOverflowScrolling:"touch"}}>{(items||[]).map((item,i)=>{const m=giftMetaV50(item);return <span key={`${item}-${i}`} title={m.name} style={{flex:"0 0 auto",width:21,height:21,display:"flex",alignItems:"center",justifyContent:"center",filter:m.generic?"grayscale(1)":"none",opacity:m.generic?.35:1}}>{m.file?<GameIcon file={m.file} size={20}/>:<span style={{fontSize:9,color:C.muted}}>•</span>}</span>})}</div>;
    const shopRowsV50=shop=>{if(!shop?.items)return[];return shop.items.filter(it=>!it.seasons?.length||it.seasons.includes(seasonEnV50));};
    const ShopV50=({shop})=>{if(!shop)return null;const rows=shopRowsV50(shop);return <div style={{marginTop:9,paddingTop:8,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",alignItems:"start",gap:6}}><GameIcon file="Shop Icon" size={25}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:10.5,color:C.darkBrown}}>商店・{shop.label}</b><div style={{fontSize:7.8,color:C.muted,lineHeight:1.3,marginTop:2}}>{shop.hours}</div></div></div><div style={{fontSize:7.5,color:C.brown,fontWeight:900,marginTop:6}}>目前 {data.base.season}季可見庫存・{rows.length} 項</div><div style={{display:"grid",gridAutoFlow:"column",gridTemplateRows:"repeat(2,68px)",gridAutoColumns:"82px",gap:4,overflowX:"auto",padding:"5px 0 2px",WebkitOverflowScrolling:"touch"}}>{rows.map((it,i)=>{const m=giftMetaV50(it.name);return <button key={`${it.name}-${i}`} onClick={()=>openLookupV50(it.name)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"3px 2px",minWidth:0,textAlign:"center"}}><GameIcon file={m.file||it.name} size={25}/><div style={{fontSize:6.9,fontWeight:900,color:C.ink,lineHeight:1.05,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>{Number.isFinite(Number(it.price))&&<div style={{fontSize:6.7,color:C.orange,fontWeight:950,marginTop:2}}>{Number(it.price).toLocaleString()}g</div>}{it.availability&&<div style={{fontSize:5.6,color:C.muted,lineHeight:1.05,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.availability}</div>}</button>})}</div></div>};
    const OrdersV50=({orders})=>{if(!orders?.length)return null;return <div style={{marginTop:9,paddingTop:8,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file="Special Orders Board" size={26}/><b style={{fontSize:10.5,color:C.darkBrown}}>特殊訂單看板</b></div><div style={{display:"grid",gap:5,marginTop:5}}>{orders.map(o=><div key={o.id} style={{border:`1px solid ${C.line}`,background:"#FFF4D8",borderRadius:8,padding:"6px 7px"}}><div style={{display:"flex",justifyContent:"space-between",gap:6}}><b style={{fontSize:8.8,color:C.brown}}>{o.name}</b><span style={{fontSize:6.8,color:C.muted,whiteSpace:"nowrap"}}>{o.days} 天{o.repeatable?"・可重複":""}</span></div><div style={{fontSize:7.6,color:C.ink,lineHeight:1.35,marginTop:3}}>📋 {o.need}</div><div style={{fontSize:7.4,color:C.green,lineHeight:1.35,marginTop:2}}>🎁 {o.reward}</div></div>)}</div></div>};
    return <div>
      <SectionTitle icon="💛">社交速查</SectionTitle>
      <Card style={{padding:7,background:"#FFF4D8",fontSize:8.5,color:C.muted,lineHeight:1.4}}>這頁以遊玩時「查人」為主：生日、角色簡介、完整個人偏好、物品來源、特殊訂單與商店資訊；好感度只保留成小型記錄。</Card>
      <div style={{display:"flex",gap:5,margin:"7px 0"}}>{NPC_GROUPS.map(x=><Pill key={x.id} small active={x.id===socialGroup} onClick={()=>{setSocialGroup(x.id);setOpenNpc(null)}}>{x.name}</Pill>)}</div>
      <div style={{display:"grid",gap:6}}>{g.list.map(n=>{const cap=g.id==="single"?14:10;const hearts=Math.min(cap,Number(data.friendship[n]||0));const open=openNpc===n;const profile=socialV50[n]||{};const fallback=NPC_GIFTS[n]||{};const loves=profile.loves?.length?profile.loves:fallback.love||[];const likes=profile.likes?.length?profile.likes:fallback.like||[];const hates=profile.hates?.length?profile.hates:fallback.hate||[];return <Card key={n} style={{padding:7,background:open?"#FFF8E9":C.paper}}>
        <button onClick={()=>setOpenNpc(open?null:n)} style={{width:"100%",border:0,background:"transparent",padding:0,display:"grid",gridTemplateColumns:"40px minmax(0,1fr) auto",gap:7,alignItems:"center",textAlign:"left"}}><GameIcon file={NPC_ICON_FILES[n]} size={38}/><span style={{minWidth:0}}><span style={{display:"flex",alignItems:"center",gap:5}}><b style={{fontSize:11.5,color:C.ink}}>{n}</b>{profile.birthday?.day&&<span style={{fontSize:7,color:C.orange,fontWeight:900}}>🎂 {profile.birthday.season}{profile.birthday.day}</span>}</span><span style={{display:"grid",gridTemplateColumns:"24px 1fr",gap:2,alignItems:"center",marginTop:2}}><span style={{fontSize:6.5,color:C.muted,fontWeight:900}}>最愛</span><CompactLovesV50 items={loves}/></span></span><span style={{display:"flex",alignItems:"center",gap:4}}><b style={{fontSize:8.5,color:hearts?C.red:C.muted}}>♥ {hearts}/{cap}</b><span style={{fontSize:10,color:C.brown}}>{open?"▲":"▼"}</span></span></button>
        <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:3,marginTop:4}}><button onClick={()=>updateNested("friendship",{[n]:Math.max(0,hearts-1)})} style={{border:0,background:C.cream,borderRadius:5,width:20,height:19,padding:0,color:C.brown,fontWeight:950}}>−</button><span style={{fontSize:6.8,color:C.muted}}>好感</span><button onClick={()=>updateNested("friendship",{[n]:Math.min(cap,hearts+1)})} style={{border:0,background:C.cream,borderRadius:5,width:20,height:19,padding:0,color:C.brown,fontWeight:950}}>＋</button></div>
        {open&&<div style={{borderTop:`1px dashed ${C.line}`,marginTop:6,paddingTop:7}}>{profile.intro&&<div style={{display:"flex",gap:7,alignItems:"start",padding:"6px 7px",background:"#F7E9C6",borderRadius:8}}><GameIcon file={NPC_ICON_FILES[n]} size={32}/><div style={{fontSize:8.5,color:C.ink,lineHeight:1.4}}>{profile.intro}{profile.birthday?.day&&<div style={{marginTop:3,color:C.brown,fontWeight:900}}>生日：{profile.birthday.season}季 {profile.birthday.day} 日</div>}</div></div>}<GiftGridV50 title="💖 最愛" items={loves} tone="#FFF0F2"/><GiftGridV50 title="👍 喜歡" items={likes} tone="#EEF7DD"/><GiftGridV50 title="👎 討厭" items={hates} tone="#F4E8E3"/><div style={{fontSize:7,color:C.muted,marginTop:5}}>點具體物品會直接切到「查找 → 物品用途」，顯示更完整的用途與取得方式；「全部××」這類通用分類則不跳轉。</div><OrdersV50 orders={profile.orders}/><ShopV50 shop={profile.shop}/></div>}
      </Card>})}</div>
    </div>;
  };'''
app=app[:start]+new_people+app[end:]

p.write_text(app,encoding='utf-8')

# ---------- index.html ----------
p=Path('index.html'); h=p.read_text(encoding='utf-8')
for old,new in [
('./cloud.js?v=49','./cloud.js?v=50'),('./wardrobe-data-v34.js?v=49','./wardrobe-data-v34.js?v=50'),('./farmer-preview-v33.js?v=49','./farmer-preview-v33.js?v=50'),('./animal-preview-v33.js?v=49','./animal-preview-v33.js?v=50'),('./lookup-data-v46.js?v=49','./lookup-data-v46.js?v=50'),('./lookup-extra-v49.js?v=49','./lookup-extra-v49.js?v=50'),('./switch-names-v47.js?v=49','./switch-names-v47.js?v=50'),("script.src='./app.js?v=49';","script.src='./app.js?v=50';")]: h=h.replace(old,new)
h=replace_once(h,'  <script src="./lookup-extra-v49.js?v=50"></script>','  <script src="./lookup-extra-v49.js?v=50"></script>\n  <script src="./social-data-v50.js?v=50"></script>','social data script')
h=h.replace('<!-- deploy-v49 -->','<!-- deploy-v50 -->')
p.write_text(h,encoding='utf-8')

# ---------- service worker ----------
p=Path('sw.js'); w=p.read_text(encoding='utf-8')
w=w.replace("const CACHE='stardew-tracker-v49';","const CACHE='stardew-tracker-v50';")
w=replace_once(w,"'./lookup-extra-v49.js','./switch-names-v47.js'","'./lookup-extra-v49.js','./social-data-v50.js','./switch-names-v47.js'",'sw social cache')
p.write_text(w,encoding='utf-8')

print('v50 patch complete',len(by_zh),'villagers',sum(len(x['orders']) for x in by_zh.values()),'special orders')
