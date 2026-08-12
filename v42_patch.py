from pathlib import Path
import re

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')


def must_replace(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'missing target: {label}')
    s = s.replace(old, new, 1)


def must_sub(pattern, repl, label):
    global s
    new_s, n = re.subn(pattern, repl, s, count=1, flags=re.S)
    if n != 1:
        raise SystemExit(f'pattern {label}: expected 1, got {n}')
    s = new_s

# Bottom navigation: this page is now a general lookup hub, not only fishing.
must_replace(
'  { id: "fishing", name: "釣魚", icon: "🐟", file: "Iridium Rod" },',
'  { id: "fishing", name: "查找", icon: "🔎", file: "Magnifying Glass" },',
'TABS fishing label'
)

# Map selector metadata + important practical item notes.
marker = '''const FISH_AREA_GROUPS_V4 = {
  main:{name:"本島",ids:["town","forest_river","forest_pond","forest_falls","glacier","mountain","beach","secret"]},
  special:{name:"特殊水域",ids:["desert","sewer","bug","mine20","mine60","mine100","witch","night"]},
  island:{name:"薑島",ids:["island_n","island_w_fresh","island_w_ocean","island_s","pirate","caldera"]}
};'''
insert = marker + r'''

const FISH_MAP_META_V42 = {
  main:{
    file:"Map",
    clusters:[
      {id:"town",label:"鵜鶘鎮",x:54,y:50,ids:["town"]},
      {id:"forest",label:"煤礦森林",x:30,y:69,ids:["forest_river","forest_pond","forest_falls","glacier"]},
      {id:"mountain",label:"山區",x:57,y:23,ids:["mountain"]},
      {id:"beach",label:"海灘",x:69,y:82,ids:["beach"]},
      {id:"secret",label:"秘密森林",x:12,y:61,ids:["secret"]}
    ]
  },
  island:{
    file:"Ginger Island Map",
    clusters:[
      {id:"north",label:"北部",x:53,y:22,ids:["island_n","caldera"]},
      {id:"west",label:"西部",x:24,y:55,ids:["island_w_fresh","island_w_ocean"]},
      {id:"south",label:"南部",x:56,y:80,ids:["island_s","pirate"]}
    ]
  },
  special:{file:null,clusters:[]}
};

const FISH_TIME_SEGMENTS_V42 = [
  {id:"morning",name:"早上",range:[6,12]},
  {id:"afternoon",name:"下午",range:[12,17]},
  {id:"evening",name:"晚上",range:[17,22]},
  {id:"late",name:"深夜",range:[22,26]}
];

const ITEM_USAGE_SPECIAL_V42 = {
  "五彩碎片":{keep:"優先保留，不建議前期直接賣。",uses:["沙漠三柱可取得銀河之劍（第一次）","火山鍛造台可用於武器附魔","博物館可捐贈 1 個"]},
  "恐龍蛋":{keep:"第一顆通常先留著孵化，再處理博物館。",uses:["豪華雞舍孵化器可孵出恐龍","博物館可捐贈 1 個；恐龍之後會繼續產蛋"]},
  "遠古種子":{keep:"第一顆先捐博物館。",uses:["首次捐贈後可拿到可種植的上古種子與製作配方"]},
  "兔子的腳":{keep:"至少留 1 個，有多顆再考慮出售。",uses:["社區中心魔法師收集包會用到","秘密紙條相關特殊事件會用到","也是高泛用送禮物品"]},
  "電池組":{keep:"建議囤一些。",uses:["多種高階設備製作會用到","部分任務與解鎖流程會需要"]},
  "硬木":{keep:"中前期建議囤，不要看到就全賣。",uses:["建築、升級與任務會大量使用","多種製作配方會需要"]},
  "銥礦石":{keep:"建議囤，優先熔成銥錠。",uses:["熔爐製作銥錠","後期工具與設備的核心材料"]},
  "銥錠":{keep:"後期核心材料，通常不建議直接賣。",uses:["銥工具升級","高階設備與建築需求"]},
  "鑽石":{keep:"至少留幾顆；有寶石複製機後更容易補。",uses:["可放寶石複製機持續複製","多數村民接受度高，也有製作用途"]},
  "彩虹貝殼":{keep:"第一次拿到建議至少留 1 個。",uses:["神秘的齊先生任務線會需要 1 個","也可用於裁縫"]},
  "茶葉":{keep:"想做綠茶就留；多餘再賣。",uses:["放入小桶可製成綠茶"]},
  "上古水果":{keep:"優先留作種子／釀酒，不建議直接全賣。",uses:["可用種子生產器擴種","釀成果酒價值高"]}
};'''
must_replace(marker, insert, 'fish map constants')

# New lookup/filter state; old today-only state can remain for backwards-safe dead code.
must_replace(
'  const [fishViewV4, setFishViewV4] = useState("today");',
'  const [fishViewV4, setFishViewV4] = useState("items");',
'fish view default'
)
must_replace(
'  const [fishFindGroupV4, setFishFindGroupV4] = useState("main");',
'''  const [fishFindGroupV4, setFishFindGroupV4] = useState("main");
  const [fishSeasonsV42, setFishSeasonsV42] = useState([]);
  const [fishWeathersV42, setFishWeathersV42] = useState([]);
  const [fishTimesV42, setFishTimesV42] = useState([]);
  const [itemUsageQueryV42, setItemUsageQueryV42] = useState("");
  const [itemUsageSelectedV42, setItemUsageSelectedV42] = useState("");''',
'v42 state'
)

# Fish cards in the finder no longer show collection status.
new_fish_card = r'''  const renderFishCardV4 = (i, area=null, compact=false, showCollection=true) => {
    const name=COLLECTIONS.fish.items[i]; const got=(data.collections.fish||[]).includes(i); const rule=fishRuleV4(i);
    const seasons=area?.forceSeasons||area?.seasonOverride?.[i]||rule.s;
    const seasonText=seasons.length===4?"四季":seasons.join("／");
    const timeText=formatFishTimeV4(rule,area?.timeOverride);
    return <button key={`${area?.id||"fish"}-${i}`} onClick={()=>setSelectedItem(i)} style={{position:"relative",border:`2px solid ${showCollection?(!got?C.orange:C.line):C.line}`,background:showCollection?(got?"#F5F0DF":"#FFF2CF"):C.paper,borderRadius:9,padding:compact?"6px":"8px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer",width:"100%",opacity:showCollection&&got?0.78:1}}>
      <img src={ICON_URLS.fish[i]} alt="" loading="lazy" style={{width:compact?34:40,height:compact?34:40,imageRendering:"pixelated",objectFit:"contain",flex:"0 0 auto"}}/>
      <span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:compact?11:12.5,color:C.ink}}>{name}{rule.legend?" · 傳說":""}</b><span style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:3}}>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#F0E2C5",color:C.brown}}>{seasonText}</span>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:rule.w==="雨"?"#D9EAF8":rule.w==="晴"?"#FFF0A9":"#EAE3D4",color:C.ink}}>{rule.w}</span>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#E5EDF2",color:C.blue}}>{timeText}</span>
      </span></span>
      {showCollection&&<span style={{fontSize:11,fontWeight:950,color:got?C.green:C.orange}}>{got?"✓ 已收集":"未收集"}</span>}
    </button>;
  };

  const renderFishDexV4'''
must_sub(r'  const renderFishCardV4 = \(i, area=null, compact=false\) => \{.*?\n  \};\n\n  const renderFishDexV4', new_fish_card, 'fish card')

new_find_and_usage = r'''  const renderFishFindV4 = () => {
    const group=FISH_AREA_GROUPS_V4[fishFindGroupV4]||FISH_AREA_GROUPS_V4.main;
    const groupAreas=group.ids.map(id=>FISH_AREAS_V4.find(a=>a.id===id)).filter(Boolean);
    const area=groupAreas.find(a=>a.id===fishAreaV4)||groupAreas[0];
    const mapMeta=FISH_MAP_META_V42[fishFindGroupV4]||FISH_MAP_META_V42.main;
    const activeCluster=mapMeta.clusters.find(c=>c.ids.includes(area?.id));
    const toggleValue=(value,list,setter)=>setter(list.includes(value)?list.filter(x=>x!==value):[...list,value]);
    const matchesTime=(windows,segId)=>{const seg=FISH_TIME_SEGMENTS_V42.find(x=>x.id===segId);if(!seg)return true;const [sa,sb]=seg.range;return windows.some(([a,b])=>a<sb&&b>sa);};
    const rows=(area?.fish||[]).filter(i=>{
      const rule=fishRuleV4(i);
      const seasons=area.forceSeasons||area.seasonOverride?.[i]||rule.s||SEASONS;
      if(fishSeasonsV42.length&&!fishSeasonsV42.some(x=>seasons.includes(x)))return false;
      if(fishWeathersV42.length&&rule.w!=="任意"&&!fishWeathersV42.includes(rule.w))return false;
      if(fishTimesV42.length){const windows=area.timeOverride||rule.t||[[6,26]];if(!fishTimesV42.some(id=>matchesTime(windows,id)))return false;}
      return true;
    });
    const selectGroup=k=>{setFishFindGroupV4(k);const first=FISH_AREA_GROUPS_V4[k]?.ids?.[0];if(first)setFishAreaV4(first);};
    const filterButton=(label,on,onClick,tint="#FFF4D8")=><button onClick={onClick} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?tint:C.paper,borderRadius:14,padding:"4px 8px",fontSize:8.4,fontWeight:900,color:on?C.darkBrown:C.muted,whiteSpace:"nowrap"}}>{on?"✓ ":""}{label}</button>;
    const clearFilters=()=>{setFishSeasonsV42([]);setFishWeathersV42([]);setFishTimesV42([])};
    return <div style={{marginTop:8}}>
      <Card style={{padding:9,background:"#FFF4D8"}}>
        <div style={{fontSize:11,fontWeight:950,color:C.darkBrown}}>先選大區，再直接從地圖選地點</div>
        <div style={{display:"flex",gap:5,marginTop:6}}>{Object.entries(FISH_AREA_GROUPS_V4).map(([k,g])=><Pill key={k} small active={fishFindGroupV4===k} onClick={()=>selectGroup(k)}>{g.name}</Pill>)}</div>
      </Card>

      {mapMeta.file?<Card style={{marginTop:7,padding:7}}>
        <div style={{position:"relative",overflow:"hidden",borderRadius:8,border:`1px solid ${C.line}`,background:"#DCE9C2"}}>
          <img src={GAME_FILE(mapMeta.file)} alt={`${group.name}地圖`} style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>
          {mapMeta.clusters.map(c=>{const on=c.ids.includes(area?.id);return <button key={c.id} onClick={()=>setFishAreaV4(c.ids[0])} style={{position:"absolute",left:`${c.x}%`,top:`${c.y}%`,transform:"translate(-50%,-50%)",border:`1.5px solid ${on?C.orange:"#8B683C"}`,background:on?"#FFE1A0":"rgba(255,248,226,.94)",boxShadow:"0 1px 3px rgba(0,0,0,.25)",borderRadius:10,padding:"2px 5px",fontSize:7.3,fontWeight:950,color:C.darkBrown,whiteSpace:"nowrap"}}>{c.label}</button>})}
        </div>
        {activeCluster?.ids?.length>1&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{activeCluster.ids.map(id=>{const a=FISH_AREAS_V4.find(x=>x.id===id);return a?<Pill key={id} small active={area.id===id} onClick={()=>setFishAreaV4(id)}>{a.sub}</Pill>:null})}</div>}
      </Card>:<Card style={{marginTop:7,padding:8}}>
        <div style={{fontSize:9,color:C.muted,marginBottom:5}}>特殊水域不在同一張世界地圖上，直接用入口／樓層圖示選。</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5}}>{groupAreas.map(a=>{const on=a.id===area.id;return <button key={a.id} onClick={()=>setFishAreaV4(a.id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:8,padding:"5px 2px",minWidth:0}}><GameIcon file={a.icon} size={27}/><div style={{fontSize:7.4,fontWeight:950,color:C.ink,lineHeight:1.08,marginTop:2}}>{a.name}</div><div style={{fontSize:6.7,color:C.muted,lineHeight:1.05}}>{a.sub}</div></button>})}</div>
      </Card>}

      <Card style={{marginTop:7,padding:8,background:"#FFF8E2"}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={area.icon} size={34}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:13,color:C.darkBrown}}>{area.name} · {area.sub}</b>{area.island&&<div style={{fontSize:8.5,color:C.green,fontWeight:900,marginTop:2}}>薑島魚類不受季節限制</div>}</div><span style={{fontSize:9.5,color:C.muted,fontWeight:900}}>{rows.length} 項</span></div>{area.tip&&<div style={{fontSize:9,color:C.brown,lineHeight:1.4,marginTop:5}}>{area.tip}</div>}</Card>

      <Card style={{marginTop:7,padding:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}><b style={{fontSize:9.5,color:C.brown}}>條件篩選</b>{(fishSeasonsV42.length||fishWeathersV42.length||fishTimesV42.length)?<button onClick={clearFilters} style={{border:0,background:"transparent",fontSize:8,color:C.blue,fontWeight:900}}>清除</button>:<span style={{fontSize:7.5,color:C.muted}}>未勾＝不限</span>}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:5}}>季節</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{SEASONS.map(x=>filterButton(x,fishSeasonsV42.includes(x),()=>toggleValue(x,fishSeasonsV42,setFishSeasonsV42),`${SEASON_COLORS[x]}30`))}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:6}}>天氣</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{["晴","雨"].map(x=>filterButton(x,fishWeathersV42.includes(x),()=>toggleValue(x,fishWeathersV42,setFishWeathersV42),x==="雨"?"#DCEBFA":"#FFF0B8"))}</div>
        <div style={{fontSize:7.5,fontWeight:900,color:C.muted,marginTop:6}}>時間段</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>{FISH_TIME_SEGMENTS_V42.map(x=>filterButton(x.name,fishTimesV42.includes(x.id),()=>toggleValue(x.id,fishTimesV42,setFishTimesV42),"#E5EDF2"))}</div>
      </Card>

      <div style={{display:"grid",gap:5,marginTop:7}}>{rows.map(i=>renderFishCardV4(i,area,true,false))}</div>
      {!rows.length&&<Card style={{marginTop:8,textAlign:"center",fontSize:10.5,color:C.muted}}>這個地點沒有符合目前季節／天氣／時間條件的魚。</Card>}
    </div>;
  };

  const renderItemUsageV42 = () => {
    const cleanName=name=>String(name||"").replace(/(?:金星|銀星|银星|銥星|铱星)/g,"").replace(/\s*[×x]\s*\d+.*/,"").trim();
    const index=new Map();
    const ensure=(rawName,file,kind="item")=>{
      const name=cleanName(rawName); if(!name||/^\d[\d,]*g$/i.test(name))return null;
      const resolved=file||itemFileZhV26(name)||name;
      const key=String(resolved||name);
      if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false});
      const it=index.get(key);it.aliases.add(name);it.kinds.add(kind);
      if(kind!=="shipping"&&it.kinds.size<=2)it.name=name;
      return it;
    };
    SHIPPING_ITEMS_V30.forEach(([file,name])=>{const it=ensure(name,file,"shipping");if(it)it.shippable=true});
    COLLECTIONS.fish.items.forEach((name,i)=>{const it=ensure(name,FISH_ICON_FILES[i],"fish");if(it)it.fishIndex=i});
    COLLECTIONS.artifact.items.forEach((name,i)=>ensure(name,ARTIFACT_ICON_FILES[i],"artifact"));
    COLLECTIONS.mineral.items.forEach((name,i)=>ensure(name,MINERAL_ICON_FILES[i],"mineral"));
    COOKING_DISHES_V3.forEach(([,name,file])=>ensure(name,file,"cooking"));
    BUNDLE_ROOMS.forEach(room=>room.bundles.forEach(bundle=>bundle.items.forEach(raw=>{const it=ensure(raw,null,"bundle");if(it)it.bundles.push(`${room.name} · ${bundle.name}：${raw}`)})));
    Object.entries(REMIX_EXTRA_ITEMS_V28||{}).forEach(([roomId,items])=>{const room=BUNDLE_ROOMS.find(r=>r.id===roomId);(items||[]).forEach(raw=>{const it=ensure(raw,null,"remix");if(it)it.remix.push(`${room?.name||roomId}的混合收集包可能需要：${raw}`)})});
    COOKING_PREP_GROUPS_V3.forEach(group=>group.items.forEach(([,name,file,need])=>{const it=ensure(name,file,"ingredient");if(it){it.cookNeed+=Number(need||0);it.cookGroups.add(group.name)}}));
    (MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>ensure(name,file,"mine")));
    const all=[...index.values()].sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));
    const q=itemUsageQueryV42.trim().toLowerCase();
    const quickNames=["五彩碎片","恐龍蛋","遠古種子","兔子的腳","電池組","硬木","鑽石","茶葉"];
    const results=(q?all.filter(it=>[it.name,it.file,...it.aliases].join(" ").toLowerCase().includes(q)):quickNames.map(name=>all.find(it=>it.aliases.has(name)||it.name===name)).filter(Boolean)).slice(0,30);
    const selected=all.find(it=>it.key===itemUsageSelectedV42)||null;
    const usageSpecial=selected?Object.entries(ITEM_USAGE_SPECIAL_V42).find(([name])=>selected.aliases.has(name)||selected.name===name)?.[1]:null;
    const wardrobeData=window.SDVWardrobeV34||{};
    const tailoring=selected?[...(wardrobeData.shirts||[]),...(wardrobeData.pants||[])].filter(x=>{const hay=`${x.recipe||""} ${x.sourceZh||""} ${x.source||""}`.toLowerCase();return [selected.name,selected.file,...selected.aliases].some(v=>v&&hay.includes(String(v).toLowerCase()))}).slice(0,6):[];
    const museum=Boolean(selected&&(selected.kinds.has("artifact")||selected.kinds.has("mineral")));
    const shipped=Boolean(selected?.shippable&&(data.shippingV30||[]).includes(selected.file));
    const saleText=!selected?"":selected.shippable?`可出貨${shipped?"，你的出貨圖鑑已點亮":"，且尚未點亮你的出貨圖鑑"}`:(selected.kinds.has("fish")||selected.kinds.has("artifact")||selected.kinds.has("mineral")||selected.kinds.has("cooking"))?"可出售；但不屬於目前的出貨圖鑑清單":"未列入出貨圖鑑；是否能賣要看物品類型，這裡不亂判";
    const fixedUses=selected?(selected.bundles.length+selected.remix.length+selected.cookNeed+tailoring.length+(museum?1:0)+(usageSpecial?.uses?.length||0)):0;
    const keepText=!selected?"":usageSpecial?.keep||(museum?"第一次拿到先留 1 個給博物館，再考慮出售。":selected.shippable&&!shipped?"至少先留 1 個出貨，把出貨圖鑑點亮。":fixedUses?"有固定用途；先留夠收集包／料理／裁縫需求，再賣多餘的。":selected.kinds.has("fish")?"普通魚沒有指定用途時可以賣；稀有魚或想養魚塘時先留。":"目前沒有偵測到固定需求，可視金錢與庫存考慮出售。" );
    const tag=(text,bg)=> <span style={{fontSize:7.2,fontWeight:900,padding:"2px 5px",borderRadius:8,background:bg,color:C.brown,whiteSpace:"nowrap"}}>{text}</span>;
    const resultTags=it=>{const tags=[];if(it.shippable)tags.push(["出貨","#EAF4D8"]);if(it.kinds.has("artifact")||it.kinds.has("mineral"))tags.push(["博物館","#EEE6F7"]);if(it.bundles.length||it.remix.length)tags.push(["收集包","#FFF0C8"]);if(it.cookNeed)tags.push(["料理","#FBE5D6"]);if(it.kinds.has("fish"))tags.push(["魚","#DDECF7"]);return tags.slice(0,3)};
    return <div style={{marginTop:8}}>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:10.5,fontWeight:950,color:C.darkBrown}}>拿到東西不知道要不要留，就先查這裡</div><div style={{fontSize:8.5,color:C.muted,lineHeight:1.4,marginTop:2}}>會整理出貨、博物館、收集包、料理、裁縫與重要特殊用途；查不到的再直接進 Wiki。</div></Card>
      <div style={{position:"relative",marginTop:7}}><input value={itemUsageQueryV42} onChange={e=>{setItemUsageQueryV42(e.target.value);setItemUsageSelectedV42("")}} placeholder="輸入物品名稱，例如：五彩碎片、鑽石、硬木…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"9px 34px 9px 10px",fontSize:10.5,color:C.ink,outline:"none"}}/>{itemUsageQueryV42&&<button onClick={()=>{setItemUsageQueryV42("");setItemUsageSelectedV42("")}} style={{position:"absolute",right:6,top:5,border:0,background:"transparent",fontSize:14,color:C.muted}}>×</button>}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5,marginTop:6}}>{results.map(it=>{const on=selected?.key===it.key;return <button key={it.key} onClick={()=>setItemUsageSelectedV42(it.key)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:9,padding:"6px 5px",display:"grid",gridTemplateColumns:"34px 1fr",gap:5,alignItems:"center",textAlign:"left",minWidth:0}}><GameIcon file={it.file} size={32}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:8.8,color:C.ink,lineHeight:1.12,overflow:"hidden",textOverflow:"ellipsis"}}>{it.name}</b><span style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:3}}>{resultTags(it).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</span></span></button>})}</div>
      {!q&&<div style={{fontSize:7.8,color:C.muted,marginTop:4}}>上面先放常查的例子；輸入名稱後會搜尋手帳目前整理到的物品。</div>}
      {q&&!results.length&&<Card style={{marginTop:7,textAlign:"center",fontSize:9.5,color:C.muted}}>目前本機資料沒有找到；可換同義名稱，或直接用 Wiki 查。</Card>}
      {selected&&<Card style={{marginTop:8,padding:9,background:"#FFF8E9"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={selected.file} size={44}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:14,color:C.darkBrown}}>{selected.name}</b><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{resultTags(selected).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</div></div><WikiBtn name={selected.name}/></div>
        <div style={{display:"grid",gridTemplateColumns:"58px 1fr",gap:6,marginTop:8,padding:"7px 8px",borderRadius:8,background:"#EAF4D8"}}><b style={{fontSize:8.5,color:C.green}}>要不要留</b><span style={{fontSize:9,color:C.ink,lineHeight:1.4}}>{keepText}</span></div>
        <div style={{display:"grid",gridTemplateColumns:"58px 1fr",gap:6,marginTop:5,padding:"7px 8px",borderRadius:8,background:"#F4EAD8"}}><b style={{fontSize:8.5,color:C.brown}}>能不能賣</b><span style={{fontSize:9,color:C.ink,lineHeight:1.4}}>{saleText}</span></div>
        <div style={{fontSize:9,fontWeight:950,color:C.brown,marginTop:8}}>用途</div>
        <div style={{display:"grid",gap:4,marginTop:4}}>
          {usageSpecial?.uses?.map((u,i)=><div key={`s${i}`} style={{fontSize:8.7,color:C.ink,lineHeight:1.4}}>⭐ {u}</div>)}
          {museum&&<div style={{fontSize:8.7,color:C.ink,lineHeight:1.4}}>🏺 博物館：可捐贈 1 個；第一次拿到不要急著賣。</div>}
          {selected.bundles.map((u,i)=><div key={`b${i}`} style={{fontSize:8.7,color:C.ink,lineHeight:1.4}}>📦 {u}</div>)}
          {selected.remix.slice(0,4).map((u,i)=><div key={`r${i}`} style={{fontSize:8.7,color:C.ink,lineHeight:1.4}}>🎲 {u}</div>)}
          {selected.cookNeed>0&&<div style={{fontSize:8.7,color:C.ink,lineHeight:1.4}}>🍳 全料理一次性備料：最低合計需要 ×{selected.cookNeed}。</div>}
          {tailoring.length>0&&<div style={{fontSize:8.7,color:C.ink,lineHeight:1.4}}>🧵 裁縫：可做 {tailoring.slice(0,4).map(x=>x.name).join("、")}{tailoring.length>4?` 等 ${tailoring.length} 件`:""}。</div>}
          {selected.shippable&&<div style={{fontSize:8.7,color:C.ink,lineHeight:1.4}}>📮 出貨圖鑑：{shipped?"你已經出貨過。":"至少出貨 1 個可點亮。"}</div>}
          {selected.kinds.has("fish")&&selected.bundles.length===0&&<div style={{fontSize:8.7,color:C.ink,lineHeight:1.4}}>🐟 魚類：沒有固定收集包需求時，主要再看料理、魚塘、送禮或售價需求。</div>}
          {!fixedUses&&!selected.shippable&&<div style={{fontSize:8.7,color:C.muted,lineHeight:1.4}}>目前手帳沒有偵測到固定用途；點右上 Wiki 可查完整特殊用途。</div>}
        </div>
      </Card>}
    </div>;
  };

  const renderFishTodayV4'''
must_sub(r'  const renderFishFindV4 = \(\) => \{.*?\n  \};\n\n  const renderFishTodayV4', new_find_and_usage, 'fish finder and item usage')

# Replace the visible page hub: only item-use lookup + fish finder remain.
new_hub = r'''  const renderFishingV30 = () => {
    const fast=fishViewV4==="find"?"find":"items";
    return <div><SectionTitle icon="🔎">查找</SectionTitle><Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.7,color:C.muted,lineHeight:1.4}}>查物品要不要留、能不能賣；或從地圖與條件反查魚在哪裡釣。</div></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:7}}><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Magnifying Glass" size={29}/>物品用途</button><button onClick={()=>setFishViewV4("find")} style={{border:`2px solid ${fast==="find"?C.orange:C.line}`,background:fast==="find"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={29}/>找魚</button></div>{fast==="items"?renderItemUsageV42():renderFishFindV4()}</div>;
  };

  const renderWardrobeV30'''
must_sub(r'  const renderFishingV30 = \(\) => \{.*?\n  \};\n\n  const renderWardrobeV30', new_hub, 'visible search hub')

p.write_text(s, encoding='utf-8')

# Cache busting.
idx = Path('index.html')
h = idx.read_text(encoding='utf-8')
h = h.replace('?v=41','?v=42').replace('deploy-v41','deploy-v42')
idx.write_text(h, encoding='utf-8')

sw = Path('sw.js')
w = sw.read_text(encoding='utf-8').replace("stardew-tracker-v41","stardew-tracker-v42")
sw.write_text(w, encoding='utf-8')

print('v42 patch applied')
