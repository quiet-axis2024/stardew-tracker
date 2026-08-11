from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# ---------- v28 constants ----------
insert_before='const PROF_ICON_FILES_V26 = {'
if 'const BUNDLE_REWARDS_V28' not in s:
    block=r'''const BUNDLE_REWARDS_V28 = {
  spring_forage:["Spring Seeds","春季種子",30], summer_forage:["Summer Seeds","夏季種子",30], fall_forage:["Fall Seeds","秋季種子",30], winter_forage:["Winter Seeds","冬季種子",30], construction:["Charcoal Kiln","煤炭窯",1], exotic:["Autumn's Bounty","秋日恩賜",5],
  spring_crops:["Speed-Gro","生長激素",20], summer_crops:["Quality Sprinkler","高級灑水器",1], fall_crops:["Bee House","蜂房",1], quality_crops:["Preserves Jar","罐頭瓶",1], animal:["Cheese Press","起司壓製機",1], artisan:["Keg","小桶",1],
  river:["Deluxe Bait","高級魚餌",30], lake:["Dressed Spinner","精裝旋式魚餌",1], ocean:["Warp Totem Beach","海灘傳送圖騰",5], night:["Glow Ring","光輝戒指",1], crabpot:["Crab Pot","蟹籠",3], specialty:["Dish O' The Sea","海之菜餚",5],
  blacksmith:["Furnace","熔爐",1], geologist:["Omni Geode","萬象晶洞",5], adventurer:["Small Magnet Ring","小型磁鐵戒指",1],
  chef:["Pink Cake","粉紅蛋糕",3], dye:["Seed Maker","種子生產器",1], field:["Recycling Machine","回收機",1], fodder:["Heater","加熱器",1], enchanter:["Gold Bar","金錠",5],
  v2500:["Chocolate Cake","巧克力蛋糕",3], v5000:["Quality Fertilizer","高級肥料",30], v10000:["Lightning Rod","避雷針",1], v25000:["Crystalarium","寶石複製機",1]
};

const ROOM_UNLOCKS_V28 = {
  crafts:{name:"採石場橋",desc:"修復通往採石場的橋。",file:"Stone"},
  pantry:{name:"溫室",desc:"修復農場溫室，可全年種植。",file:"Greenhouse"},
  fishtank:{name:"淘金",desc:"移除閃閃發光的巨石，解鎖淘金。",file:"Copper Pan"},
  boiler:{name:"礦車",desc:"修復礦車快速交通。",file:"Minecart"},
  bulletin:{name:"居民友情",desc:"已認識、不可交往的居民獲得 2 心友情。",file:"Friendship 101"},
  vault:{name:"沙漠巴士",desc:"修復巴士，開放卡利科沙漠。",file:"Bus Ticket"}
};

const REMIX_EXTRA_ITEMS_V28 = {
  crafts:["大蔥","冬青樹","樹液 ×500","苔蘚 ×10","纖維 ×200","橡實 ×10","楓樹種子 ×10","紫蘑菇 ×5","蕨菜 ×5","白藻 ×5","啤酒花 ×5"],
  pantry:["羽衣甘藍","胡蘿蔔","上古水果","寶石甜莓","魚籽 ×15","陳年魚籽 ×15","魷魚墨汁","蜂蜜酒","淡啤酒","果酒","果汁","綠茶"],
  fishtank:["章魚","蠍鯉魚","熔岩鰻魚","水滴魚","冰柱魚","鬼魚","幽靈魚"],
  boiler:["電池組","銥礦石 ×5","精煉石英 ×10","煤炭 ×10","火水晶"],
  bulletin:["古代玩偶","冰淇淋","餅乾","葡萄","楓糖漿","苔蘚","硬木","南瓜","蔓越莓"],
  vault:[]
};

const JOJA_PROJECTS_V28 = [
  {id:"minecart",name:"礦車",cost:15000,room:"boiler",file:"Minecart",desc:"修復礦車快速交通。"},
  {id:"panning",name:"淘金",cost:20000,room:"fishtank",file:"Copper Pan",desc:"移除閃閃發光的巨石，開放淘金。"},
  {id:"bridge",name:"採石場橋",cost:25000,room:"crafts",file:"Stone",desc:"修復通往採石場的橋。"},
  {id:"greenhouse",name:"溫室",cost:35000,room:"pantry",file:"Greenhouse",desc:"修復農場溫室。"},
  {id:"bus",name:"沙漠巴士",cost:40000,room:"vault",file:"Bus Ticket",desc:"修復巴士，開放卡利科沙漠。"}
];

const MINE_BANDS_V28 = [
  {g:"1",range:"1–9",note:"土色礦層",items:[["Copper Ore","銅礦石"],["Quartz","石英"],["Earth Crystal","地晶"],["Amethyst","紫水晶"],["Topaz","黃玉"]]},
  {g:"1",range:"10",note:"寶箱層",items:[["Leather Boots","皮靴"]]},
  {g:"1",range:"11–19",note:"銅礦＋洞穴昆蟲",items:[["Copper Ore","銅礦石"],["Geode","晶球"],["Bug Meat","蟲肉"],["Earth Crystal","地晶"]]},
  {g:"1",range:"20",note:"寶箱＋釣魚",items:[["Steel Smallsword","鋼製輕劍"],["Stonefish","石魚"],["Ghostfish","鬼魚"]]},
  {g:"1",range:"21–29",note:"銅礦／晶球／昆蟲",items:[["Copper Ore","銅礦石"],["Geode","晶球"],["Bug Meat","蟲肉"]]},
  {g:"1",range:"30",note:"過渡層",items:[["Copper Ore","銅礦石"]]},
  {g:"1",range:"31–39",note:"暗色礦層；銅礦較多",items:[["Copper Ore","銅礦石"],["Geode","晶球"]]},
  {g:"1",range:"40",note:"寶箱層",items:[["Slingshot","彈弓"]]},
  {g:"2",range:"41–49",note:"冰雪礦層；鐵礦開始大量出現",items:[["Iron Ore","鐵礦石"],["Frozen Geode","冰凍晶球"],["Frozen Tear","淚晶"],["Aquamarine","海藍寶石"],["Jade","翡翠"]]},
  {g:"2",range:"50",note:"寶箱層；鑽石開始出現",items:[["Tundra Boots","凍原靴"],["Diamond","鑽石"]]},
  {g:"2",range:"51–59",note:"灰塵精靈很多，適合刷煤",items:[["Iron Ore","鐵礦石"],["Coal","煤炭"],["Frozen Geode","冰凍晶球"]]},
  {g:"2",range:"60",note:"寶箱＋釣魚",items:[["Crystal Dagger","水晶匕首"],["Ice Pip","冰柱魚"],["Ghostfish","鬼魚"]]},
  {g:"2",range:"61–69",note:"冰雪礦層",items:[["Iron Ore","鐵礦石"],["Frozen Geode","冰凍晶球"],["Frozen Tear","淚晶"]]},
  {g:"2",range:"70",note:"寶箱層",items:[["Master Slingshot","高級彈弓"]]},
  {g:"2",range:"71–79",note:"城堡主題冰層",items:[["Iron Ore","鐵礦石"],["Frozen Geode","冰凍晶球"]]},
  {g:"2",range:"80",note:"寶箱層",items:[["Firewalker Boots","火行者靴"]]},
  {g:"3",range:"81–89",note:"熔岩礦層；金礦開始大量出現",items:[["Gold Ore","金礦石"],["Magma Geode","岩漿晶球"],["Fire Quartz","火水晶"],["Ruby","紅寶石"],["Emerald","綠寶石"]]},
  {g:"3",range:"90",note:"寶箱層",items:[["Obsidian Edge","黑曜石之刃"]]},
  {g:"3",range:"91–99",note:"熔岩礦層",items:[["Gold Ore","金礦石"],["Magma Geode","岩漿晶球"],["Fire Quartz","火水晶"]]},
  {g:"3",range:"100",note:"星之果實＋釣魚",items:[["Stardrop","星之果實"],["Lava Eel","熔岩鰻魚"]]},
  {g:"3",range:"101–109",note:"金礦較多",items:[["Gold Ore","金礦石"],["Magma Geode","岩漿晶球"]]},
  {g:"3",range:"110",note:"寶箱層",items:[["Space Boots","太空靴"]]},
  {g:"3",range:"111–119",note:"高階熔岩／暗紅礦層",items:[["Gold Ore","金礦石"],["Magma Geode","岩漿晶球"],["Diamond","鑽石"]]},
  {g:"3",range:"120",note:"礦井底層",items:[["Skull Key","頭骨鑰匙"]]}
];

'''
    if insert_before not in s: raise SystemExit('v28 constant marker missing')
    s=s.replace(insert_before,block+insert_before,1)

# ---------- local UI state ----------
state_marker='  const [bundleRoom, setBundleRoom] = useState("crafts");'
if 'mineRangeV28' not in s:
    s=s.replace(state_marker,state_marker+'\n  const [mineRangeV28, setMineRangeV28] = useState("1");\n  const [bundleEditV28, setBundleEditV28] = useState(null);',1)

# ---------- machine output icons ----------
old='''{products.length>0&&<div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap",minHeight:21,marginTop:3}}>{products.slice(0,4).map(x=><GameIcon key={x} file={x} size={18}/>)}</div>}'''
new='''{products.length>0&&<div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap",minHeight:28,marginTop:3}}>{products.slice(0,4).map(([pf,pl])=><span key={`${pf}-${pl}`} title={pl} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",maxWidth:30}}><GameIcon file={pf} size={18} alt={pl}/><span style={{fontSize:5.8,color:C.muted,fontWeight:850,lineHeight:1,marginTop:1,maxWidth:30,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pl}</span></span>)}</div>}'''
if old not in s: raise SystemExit('machine product renderer marker missing')
s=s.replace(old,new,1)

# ---------- fix exact mine image filename ----------
s=s.replace('file="Mines Entrance"','file="MinesEntrance"')

# ---------- replace mine secondary page ----------
old_mine_start='      {skillSection==="mine"&&<>'
old_mine_end='      {skillSection==="special"&&<>'
ms=s.index(old_mine_start)
me=s.index(old_mine_end,ms)
new_mine=r'''      {skillSection==="mine"&&<>
        <SectionTitle icon="⛏️">礦井</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          <Card style={{padding:9,textAlign:"center"}}><GameIcon file="MinesEntrance" size={58}/><b style={{display:"block",fontSize:11,color:C.ink,marginTop:3}}>普通礦井</b><div style={{marginTop:6}}><NumInput value={data.mine.normal} max={120} onChange={v=>updateNested("mine",{normal:v})} suffix="層"/></div><div style={{marginTop:6}}><ProgressBar value={data.mine.normal} max={120} color={C.blue}/></div></Card>
          <Card style={{padding:9,textAlign:"center"}}><GameIcon file="Skull Key" size={52}/><b style={{display:"block",fontSize:11,color:C.ink,marginTop:3}}>骷髏洞窟最佳</b><div style={{marginTop:6}}><NumInput value={data.mine.skullBest} max={999} onChange={v=>updateNested("mine",{skullBest:v})} suffix="層"/></div><div style={{fontSize:8,color:C.muted,lineHeight:1.3,marginTop:6}}>骷髏洞窟樓層與資源是程序生成，不用套普通礦井固定分層。</div></Card>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:8}}>{[["1","1–40"],["2","41–80"],["3","81–120"]].map(([id,label])=><button key={id} onClick={()=>setMineRangeV28(id)} style={{border:`1.5px solid ${mineRangeV28===id?C.orange:C.line}`,background:mineRangeV28===id?"#FFE2A8":C.paper,borderRadius:8,padding:6,fontSize:9,fontWeight:950,color:C.brown}}>{label}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6,marginTop:7}}>{MINE_BANDS_V28.filter(x=>x.g===mineRangeV28).map(b=><Card key={b.range} style={{padding:7,minHeight:88}}><div style={{display:"flex",alignItems:"center",gap:5}}><GameIcon file="Pickaxe" size={24}/><b style={{fontSize:10.5,color:C.darkBrown}}>{b.range} 層</b></div><div style={{fontSize:7.5,color:C.muted,lineHeight:1.25,marginTop:2}}>{b.note}</div><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:5}}>{b.items.map(([file,label])=><span key={`${b.range}-${file}`} title={label} style={{width:34,textAlign:"center"}}><GameIcon file={file} size={24} alt={label}/><span style={{display:"block",fontSize:5.9,color:C.muted,fontWeight:800,lineHeight:1.05,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span></span>)}</div></Card>)}</div>
        <div style={{fontSize:8.3,color:C.muted,lineHeight:1.45,marginTop:6}}>這裡列固定普通礦井的主要礦物、特殊魚與寶箱層，方便決定今天要去哪段刷；怪物與礦點仍會受當日生成影響。</div>
      </>}

'''
s=s[:ms]+new_mine+s[me:]

# ---------- replace Community Center / Joja page ----------
bs=s.index('  const renderBundles = () => {')
be=s.index('  const renderFarm = () => {',bs)
new_bundles=r'''  const renderBundles = () => {
    const route=data.communityRouteV28||"cc";
    const mode=data.bundleModeV28||"standard";
    const customItems=data.bundleCustomV28||{};
    const customNeeds=data.bundleNeedV28||{};
    const customNames=data.bundleNameV28||{};
    const jojaDone=data.jojaProjectsV28||[];
    const room=BUNDLE_ROOMS.find(r=>r.id===bundleRoom)||BUNDLE_ROOMS[0];
    const bundleItemsFor=b=>mode==="custom"?(customItems[b.id]||b.items):b.items;
    const bundleNeedFor=b=>{const items=bundleItemsFor(b);const d=b.need||b.items.length;return Math.max(1,Math.min(items.length||1,mode==="custom"&&customNeeds[b.id]!=null?Number(customNeeds[b.id]):d));};
    const setCustomBundle=(b,items,need=bundleNeedFor(b))=>update({bundleCustomV28:{...customItems,[b.id]:items},bundleNeedV28:{...customNeeds,[b.id]:Math.max(1,Math.min(items.length||1,Number(need)||1))}});
    const setCustomName=(b,name)=>update({bundleNameV28:{...customNames,[b.id]:name||b.name}});
    const RoomTab=({r})=>{const rd=roomDone(r),active=room.id===r.id;return <button onClick={()=>{setBundleRoom(r.id);setBundleEditV28(null)}} style={{border:`2px solid ${active?C.orange:rd?C.green:C.line}`,background:active?"#FFE2A8":rd?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={ROOM_ICON_FILES[r.id]} size={31}/><span style={{fontSize:8.5,fontWeight:950,color:active?C.darkBrown:rd?C.green:C.muted}}>{rd?"✓ ":""}{r.name}</span></button>};
    const routeButton=(id,label,file)=>{const active=route===id;return <button onClick={()=>{update({communityRouteV28:id});setBundleEditV28(null)}} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file={file} size={32}/>{label}</button>};
    return <div>
      <SectionTitle icon="📦">城鎮修復路線</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>{routeButton("cc","社區中心","Golden Scroll")}{routeButton("joja","Joja","Joja Warehouse")}</div>

      {route==="joja"&&<>
        <Card style={{marginTop:9,padding:9,background:"#EEF3DA"}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Joja Cola" size={36}/><div style={{flex:1}}><b style={{fontSize:12,color:C.darkBrown}}>Joja 會員</b><div style={{fontSize:9,color:C.muted,marginTop:2}}>5,000g；購買後社區中心變為 Joja 倉庫。</div></div><button onClick={()=>update({jojaMemberV28:!data.jojaMemberV28})} style={{border:`1.5px solid ${data.jojaMemberV28?C.green:C.line}`,background:data.jojaMemberV28?C.lightGreen:C.cream,borderRadius:8,padding:"5px 7px",fontWeight:950,color:data.jojaMemberV28?C.green:C.brown,fontSize:9}}>{data.jojaMemberV28?"✓ 已加入":"未加入"}</button></div></Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7,marginTop:8}}>{JOJA_PROJECTS_V28.map(j=>{const inherited=(data.bundleDone||[]).includes(j.room),on=inherited||jojaDone.includes(j.id);return <button key={j.id} disabled={inherited} onClick={()=>update({jojaProjectsV28:on?jojaDone.filter(x=>x!==j.id):[...jojaDone,j.id]})} style={{border:`2px solid ${on?C.green:C.line}`,background:on?"#EAF4D8":C.paper,borderRadius:10,padding:8,textAlign:"left",cursor:inherited?"default":"pointer",opacity:inherited?.75:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file={j.file} size={32}/><div style={{minWidth:0}}><b style={{fontSize:10,color:on?C.green:C.ink}}>{on?"✓ ":""}{j.name}</b><div style={{fontSize:9,fontWeight:950,color:C.orange,marginTop:1}}>{j.cost.toLocaleString()}g</div></div></div><div style={{fontSize:7.8,color:C.muted,lineHeight:1.35,marginTop:4}}>{inherited?"此項已由社區中心房間完成。":j.desc}</div></button>})}</div>
        <Card style={{marginTop:8,padding:8,background:"#FFF4D8",fontSize:9,color:C.muted,lineHeight:1.45}}>Joja 五項工程對應社區中心的採石場橋、溫室、淘金、礦車與沙漠巴士；沒有布告欄的居民友情獎勵。全部工程完成後可取得汽水機。</Card>
      </>}

      {route==="cc"&&<>
        <SectionTitle icon="📦" right={`${rp.done}/30`}>社區中心</SectionTitle>
        <Card style={{padding:8}}><ProgressBar value={rp.done} max={30} color={C.orange}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginTop:7}}><button onClick={()=>{update({bundleModeV28:"standard"});setBundleEditV28(null)}} style={{border:`1.5px solid ${mode==="standard"?C.green:C.line}`,background:mode==="standard"?C.lightGreen:C.cream,borderRadius:8,padding:5,fontSize:9,fontWeight:950,color:C.brown}}>標準收集包</button><button onClick={()=>update({bundleModeV28:"custom"})} style={{border:`1.5px solid ${mode==="custom"?C.green:C.line}`,background:mode==="custom"?C.lightGreen:C.cream,borderRadius:8,padding:5,fontSize:9,fontWeight:950,color:C.brown}}>混合／自訂</button></div>{mode==="custom"&&<div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:5}}>預設先沿用標準配置；只需把實際存檔中不同的包名、需求物與需要幾格改掉。</div>}</Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,marginTop:8}}>{BUNDLE_ROOMS.map(r=><RoomTab key={r.id} r={r}/>)}</div>
        {ROOM_UNLOCKS_V28[room.id]&&<Card style={{marginTop:8,padding:7,background:"#F1EAD3"}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={ROOM_UNLOCKS_V28[room.id].file} size={30}/><div><b style={{fontSize:10.5,color:C.darkBrown}}>整室完成：{ROOM_UNLOCKS_V28[room.id].name}</b><div style={{fontSize:8,color:C.muted,marginTop:1}}>{ROOM_UNLOCKS_V28[room.id].desc}</div></div></div></Card>}
        <div style={{display:"grid",gap:7,marginTop:7}}>{room.bundles.map(b=>{const items=bundleItemsFor(b),gotRaw=data.bundleItems[b.id]||[],got=gotRaw.filter(x=>items.includes(x)),need=bundleNeedFor(b),bDone=roomDone(room)||got.length>=need,reward=BUNDLE_REWARDS_V28[b.id],editing=mode==="custom"&&bundleEditV28===b.id,name=mode==="custom"?(customNames[b.id]||b.name):b.name;const pool=[...new Set([...room.bundles.flatMap(x=>x.items),...(REMIX_EXTRA_ITEMS_V28[room.id]||[]),...items])];return <Card key={b.id} style={{padding:8,background:bDone?"#F0F8DF":C.paper,borderColor:bDone?C.green:C.line}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:7}}><GameIcon file={BUNDLE_ICON_FILES_V26[b.id]} size={38}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:11,color:bDone?C.green:C.brown}}>{name}</b><div style={{fontSize:8.5,color:C.muted,marginTop:1}}>完成 {Math.min(got.length,need)}/{need}{need<items.length?"（任選）":""}</div></div>{reward&&<div style={{maxWidth:82,textAlign:"right",border:`1px solid ${C.line}`,borderRadius:7,padding:"3px 4px",background:"#FFF8E3"}}><div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:3}}><GameIcon file={reward[0]} size={20}/><span style={{fontSize:7,fontWeight:950,color:C.brown}}>×{reward[2]}</span></div><div style={{fontSize:6.5,color:C.muted,lineHeight:1.05,marginTop:1}}>{mode==="custom"?"標準獎勵 ":"獎勵 "}{reward[1]}</div></div>}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{items.map(it=>{const checked=roomDone(room)||gotRaw.includes(it),file=itemFileZhV26(it),gold=it.includes("金星");return <button key={it} disabled={roomDone(room)} onClick={()=>updateNested("bundleItems",{[b.id]:checked?gotRaw.filter(x=>x!==it):[...gotRaw,it]})} style={{position:"relative",border:`1.5px solid ${checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:8,padding:"5px 2px",minHeight:68,cursor:roomDone(room)?"default":"pointer",opacity:roomDone(room)?.78:1}}><div style={{height:31,display:"flex",alignItems:"center",justifyContent:"center"}}>{file?<GameIcon file={file} size={29} alt={it}/>:<span style={{fontSize:12,color:C.muted}}>•</span>}{gold&&<span style={{position:"absolute",right:3,top:2,color:C.gold,fontSize:11}}>★</span>}</div><div style={{fontSize:7.1,fontWeight:900,color:checked?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{it}</div></button>})}</div>
          {mode==="custom"&&<button onClick={()=>setBundleEditV28(editing?null:b.id)} style={{marginTop:6,border:`1px dashed ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:8.5,fontWeight:950,color:C.brown}}>{editing?"▲ 收起調整":"⚙ 調整這個包"}</button>}
          {editing&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px dashed ${C.line}`}}><div style={{display:"flex",gap:5,alignItems:"center",marginBottom:5}}><button onClick={()=>{const v=window.prompt("收集包名稱",name);if(v!=null)setCustomName(b,v.trim())}} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:7,padding:"4px 6px",fontSize:8,fontWeight:900,color:C.brown}}>改包名</button><span style={{fontSize:8,color:C.muted}}>需要 {need} / {items.length} 格</span><button onClick={()=>setCustomBundle(b,items,need-1)} style={{marginLeft:"auto",border:0,background:C.cream,borderRadius:6,width:22,height:20,padding:0,fontWeight:950,color:C.brown}}>−</button><button onClick={()=>setCustomBundle(b,items,need+1)} style={{border:0,background:C.cream,borderRadius:6,width:22,height:20,padding:0,fontWeight:950,color:C.brown}}>＋</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:4}}>{pool.map(it=>{const on=items.includes(it),file=itemFileZhV26(it);return <button key={`pick-${b.id}-${it}`} onClick={()=>{const next=on?items.filter(x=>x!==it):[...items,it];if(next.length)setCustomBundle(b,next,Math.min(need,next.length))}} style={{border:`1px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:7,padding:"4px 1px",minHeight:54}}>{file?<GameIcon file={file} size={24}/>:<span style={{fontSize:10}}>•</span>}<div style={{fontSize:6.2,fontWeight:850,color:on?C.green:C.ink,lineHeight:1.05}}>{it}</div></button>})}</div><button onClick={()=>{const v=window.prompt("新增其他需求物（可含 ×數量）","");if(v&&v.trim()){const next=[...new Set([...items,v.trim()])];setCustomBundle(b,next,Math.min(need,next.length))}}} style={{marginTop:5,border:`1px dashed ${C.line}`,background:C.paper,borderRadius:7,padding:"4px 7px",fontSize:8,fontWeight:900,color:C.brown}}>＋ 新增其他物品</button></div>}
        </Card>})}</div>
        <div style={{marginTop:8}}><button onClick={()=>toggleRoom(room.id,!roomDone(room))} style={{width:"100%",border:`1.5px solid ${roomDone(room)?C.green:C.line}`,background:roomDone(room)?C.lightGreen:C.cream,borderRadius:8,padding:7,fontWeight:950,color:roomDone(room)?C.green:C.brown,fontSize:9.5}}>{roomDone(room)?"✓ 整室完成":"標記整室完成"}</button></div>
      </>}
    </div>;
  };

'''
s=s[:bs]+new_bundles+s[be:]

p.write_text(s,encoding='utf-8')
print('v28 mine + community/Joja update ready')
