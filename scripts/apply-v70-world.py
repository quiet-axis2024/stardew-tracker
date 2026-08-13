from pathlib import Path


def replace_once(path, old, new, label):
    p=Path(path)
    s=p.read_text()
    if old not in s:
        raise SystemExit(f"missing anchor {label} in {path}")
    p.write_text(s.replace(old,new,1))

# app.jsx: UI state
replace_once('app.jsx',
'''  const [selectedPaper, setSelectedPaper] = useState(null);\n  const [todayExpandedV69, setTodayExpandedV69] = useState("");\n  const [socialGroup, setSocialGroup] = useState("single");''',
'''  const [selectedPaper, setSelectedPaper] = useState(null);\n  const [todayExpandedV69, setTodayExpandedV69] = useState("");\n  const [worldRegionV70, setWorldRegionV70] = useState("town");\n  const [worldQueryV70, setWorldQueryV70] = useState("");\n  const [worldOpenV70, setWorldOpenV70] = useState("");\n  const [socialGroup, setSocialGroup] = useState("single");''',
'world state')

# app.jsx: lazy-load world only when opened
replace_once('app.jsx',
'''  useEffect(()=>{\n    if(tab==="wardrobe")loadLazyDataV67("wardrobe");\n    if(tab==="fishing"||tab==="people")loadLazyDataV67("lookup");\n  },[tab]);''',
'''  useEffect(()=>{\n    if(tab==="wardrobe")loadLazyDataV67("wardrobe");\n    if(tab==="fishing"||tab==="people")loadLazyDataV67("lookup");\n    if(tab==="data"&&dataSection==="world")loadLazyDataV67("world");\n  },[tab,dataSection]);''',
'world lazy load')

world_renderer=r'''  const renderWorldV70 = () => {
    const db=window.SDVWorldV70;
    if(!db)return <div><SectionTitle icon="game:Map">世界</SectionTitle><Card style={{padding:10,textAlign:"center",color:C.muted,fontSize:10}}>載入世界資料中…</Card></div>;
    const people=db.people||{}, regions=db.regions||[], places=db.places||[];
    const normalize=value=>String(value||"").normalize("NFKC").toLowerCase().replace(/[\s·・_'’\-／/]+/g,"");
    const q=normalize(worldQueryV70);
    const region=regions.find(x=>x.id===worldRegionV70)||regions[0];
    const socialByZh=window.SDVSocialV50?.byZh||{};
    const person=id=>people[id]||null;
    const socialKey=p=>p?(p.socialKeys||[]).find(k=>socialByZh[k])||null:null;
    const social=p=>{const k=socialKey(p);return k?socialByZh[k]:null};
    const shopFor=place=>{const p=person(place.ownerId);return social(p)?.shop||null};
    const serviceRows=place=>{
      const p=person(place.ownerId),key=socialKey(p);
      const extra=key&&NPC_SERVICES_V55[key]?(NPC_SERVICES_V55[key]||[]).map(x=>x[1]):[];
      return [...new Set([...(place.services||[]),...extra].filter(Boolean))];
    };
    const hay=place=>{
      const r=regions.find(x=>x.id===place.regionId);
      const ps=(place.peopleIds||[]).map(id=>person(id)).filter(Boolean);
      return [place.name,...(place.aliases||[]),r?.name,...(r?.aliases||[]),place.hours,place.requires,...serviceRows(place),...ps.flatMap(p=>[p.name,...(p.aliases||[])])].filter(Boolean).join(" ");
    };
    const shown=(q?places.filter(x=>normalize(hay(x)).includes(q)):places.filter(x=>x.regionId===region?.id));
    const openPerson=p=>{const key=socialKey(p);if(key)openSocialNpcV55(key)};
    const openItem=async raw=>{await loadLazyDataV67("lookup");const row=lookupRowV54(raw);openItemLookupV54(raw,row?.file||raw)};
    const PlaceCard=({place})=>{
      const open=worldOpenV70===place.id,r=regions.find(x=>x.id===place.regionId),owner=person(place.ownerId),shop=shopFor(place),services=serviceRows(place);
      const members=(place.peopleIds||[]).map(id=>person(id)).filter(Boolean);
      const hours=shop?.hours||place.hours||"沒有固定營業時間";
      return <Card style={{padding:8,borderColor:open?C.orange:C.line,background:open?"#FFF8E9":C.paper}}>
        <button type="button" aria-expanded={open} onClick={()=>setWorldOpenV70(open?"":place.id)} style={{width:"100%",border:0,background:"transparent",padding:0,textAlign:"left",cursor:"pointer",color:"inherit"}}>
          <div style={{display:"grid",gridTemplateColumns:"38px minmax(0,1fr) 18px",gap:7,alignItems:"center"}}><GameIcon file={place.icon||r?.icon||"Map"} size={36}/><div style={{minWidth:0}}><div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>{q&&<span style={{fontSize:6.5,fontWeight:900,color:C.green,background:C.lightGreen,borderRadius:7,padding:"1px 4px"}}>{r?.name}</span>}{place.requires&&<span style={{fontSize:6.5,fontWeight:900,color:C.orange,background:"#FFF0C8",borderRadius:7,padding:"1px 4px"}}>有解鎖條件</span>}</div><b style={{display:"block",fontSize:11,color:C.darkBrown,lineHeight:1.2,marginTop:2}}>{place.name}</b><div style={{fontSize:7.6,color:C.muted,lineHeight:1.3,marginTop:2}}>{hours}</div></div><span style={{fontSize:14,color:C.muted,fontWeight:950,textAlign:"center",transform:open?"rotate(180deg)":"none"}}>⌄</span></div>
        </button>
        {open&&<div style={{marginTop:7,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          {place.requires&&<div style={{padding:"5px 7px",borderRadius:7,background:"#FFF0C8",fontSize:8,color:C.brown,lineHeight:1.35}}><b>解鎖：</b>{place.requires}</div>}
          {services.length>0&&<div style={{marginTop:place.requires?6:0}}><div style={{fontSize:7.5,color:C.muted,fontWeight:950,marginBottom:3}}>可以做什麼</div><div style={{display:"grid",gap:3}}>{services.map(x=><div key={x} style={{display:"grid",gridTemplateColumns:"10px 1fr",gap:3,fontSize:8.4,color:C.ink,lineHeight:1.35}}><span>•</span><span>{x}</span></div>)}</div></div>}
          {members.length>0&&<div style={{marginTop:7}}><div style={{fontSize:7.5,color:C.muted,fontWeight:950,marginBottom:4}}>相關人物</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{members.map(p=>{const can=Boolean(socialKey(p));return <button key={p.id} disabled={!can} onClick={()=>openPerson(p)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"3px 6px 3px 3px",display:"inline-flex",alignItems:"center",gap:3,fontSize:7.8,fontWeight:900,color:C.brown,opacity:can?1:.7}}><GameIcon file={p.icon} size={22}/>{p.name}{can?" ›":""}</button>})}</div></div>}
          {shop?.items?.length>0&&<div style={{marginTop:7}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}><span style={{fontSize:7.5,color:C.muted,fontWeight:950}}>商店內容節選</span><span style={{fontSize:6.8,color:C.muted}}>沿用社交資料，不另複製庫存</span></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,marginTop:4}}>{shop.items.slice(0,8).map((it,i)=>{const raw=it.name||"";return <button key={`${place.id}-${raw}-${i}`} onClick={()=>openItem(raw)} style={{border:`1px solid ${C.line}`,background:"#FFFDF5",borderRadius:7,padding:"4px 2px",minWidth:0}}><GameIcon file={raw.replace(/ Recipe$/,'')||"Chest"} size={25}/><div style={{fontSize:6.8,fontWeight:900,color:C.ink,lineHeight:1.08,marginTop:2,overflow:"hidden",textOverflow:"ellipsis"}}>{switchNameV47(raw.replace(/ Recipe$/,''),raw.replace(/ Recipe$/,''))}{/ Recipe$/.test(raw)?"配方":""}</div>{it.price!=null&&<div style={{fontSize:6.3,color:C.muted,marginTop:1}}>{Number(it.price).toLocaleString()}g</div>}</button>})}</div></div>}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:7,paddingTop:6,borderTop:`1px dashed ${C.line}`}}>{place.fishingAreaId&&<button onClick={()=>openFishHintV69("",place.fishingAreaId)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.blue}}>查看這裡能釣什麼 ›</button>}{place.id==="community_center"&&<button onClick={()=>openTownRepairV69("")} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.brown}}>打開城鎮修復 ›</button>}{owner&&socialKey(owner)&&<button onClick={()=>openPerson(owner)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.brown}}>查看 {owner.name} ›</button>}</div>
        </div>}
      </Card>;
    };
    return <div>
      <SectionTitle icon="game:Map">世界</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:10.5,fontWeight:950,color:C.darkBrown}}>從「在哪裡」開始找</div><div style={{fontSize:8.2,color:C.muted,lineHeight:1.4,marginTop:2}}>世界頁只回答地點、人物、營業時間與服務；不做第二套 Wiki。地點資料會直接提供給後續全域搜尋、NPC 行程與今日提示。</div></Card>
      <div style={{position:"relative",marginTop:7}}><input value={worldQueryV70} onChange={e=>{setWorldQueryV70(e.target.value);setWorldOpenV70("")}} placeholder="搜尋地點／NPC／服務，例如：羅賓、鐵匠、工具升級…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"9px 34px 9px 10px",fontSize:10,color:C.ink,outline:"none"}}/>{worldQueryV70&&<button onClick={()=>setWorldQueryV70("")} style={{position:"absolute",right:6,top:5,border:0,background:"transparent",fontSize:14,color:C.muted}}>×</button>}</div>
      <div style={{display:"flex",gap:5,overflowX:"auto",padding:"7px 1px 2px",WebkitOverflowScrolling:"touch"}}>{regions.map(r=><button key={r.id} onClick={()=>{setWorldRegionV70(r.id);setWorldQueryV70("");setWorldOpenV70("")}} style={{flex:"0 0 auto",minWidth:62,border:`1.5px solid ${!q&&region?.id===r.id?C.orange:C.line}`,background:!q&&region?.id===r.id?"#FFE2A8":C.paper,borderRadius:9,padding:"4px 6px",display:"flex",alignItems:"center",gap:4,fontSize:8,fontWeight:950,color:C.brown}}><GameIcon file={r.icon} size={23}/>{r.name}</button>)}</div>
      {!q&&region&&<Card style={{padding:8,marginTop:5,background:"#EEF7DD"}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={region.icon} size={36}/><div><b style={{fontSize:12,color:C.darkBrown}}>{region.name}</b><div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:2}}>{region.summary}</div></div></div></Card>}
      {q&&<div style={{fontSize:8,color:C.muted,fontWeight:900,margin:"6px 1px 0"}}>跨區域找到 {shown.length} 個地點</div>}
      <div style={{display:"grid",gap:6,marginTop:7}}>{shown.map(place=><PlaceCard key={place.id} place={place}/>)}</div>
      {!shown.length&&<Card style={{marginTop:7,padding:10,textAlign:"center",fontSize:9,color:C.muted}}>找不到符合的世界地點。</Card>}
      <SectionTitle icon="🌦️">天氣條件</SectionTitle>
      <Card style={{padding:8}}><div style={{fontSize:8.3,color:C.muted,lineHeight:1.4}}>今天助手目前記錄：<b style={{color:C.brown}}>{todayWeatherV69||"未記錄"}</b>。世界層先保存天氣類型，之後 NPC 行程與更多條件提示共用同一組 ID。</div><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5,marginTop:7}}>{(db.weather||[]).map(w=><div key={w.id} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:8,padding:6}}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:18}}>{w.icon}</span><b style={{fontSize:9,color:C.ink}}>{w.name}</b></div><div style={{fontSize:7.2,color:C.muted,lineHeight:1.35,marginTop:3}}>{w.summary}</div>{w.id==="sunny"&&<button onClick={()=>setTodayWeatherV69("晴")} style={{marginTop:4,border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,padding:"2px 5px",fontSize:6.8,fontWeight:900,color:C.brown}}>記錄今天晴</button>}{w.id==="rain"&&<button onClick={()=>setTodayWeatherV69("雨")} style={{marginTop:4,border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,padding:"2px 5px",fontSize:6.8,fontWeight:900,color:C.brown}}>記錄今天雨</button>}</div>)}</div></Card>
    </div>;
  };

'''

replace_once('app.jsx',
'''  const renderData = () => {''',
world_renderer+'''  const renderData = () => {''',
'world renderer')

replace_once('app.jsx',
'''    return <div><SectionTitle icon="game:Stardew Valley Almanac">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="skills" label="角色" file="Stardew Hero Trophy"/><DataTab id="farm" label="農場" file="Farm Computer"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Treasure Chest"/></div>{dataSection==="skills"&&renderSkills()}{dataSection==="farm"&&renderFarm()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;''',
'''    return <div><SectionTitle icon="game:Stardew Valley Almanac">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:7}}><DataTab id="skills" label="角色" file="Stardew Hero Trophy"/><DataTab id="farm" label="農場" file="Farm Computer"/><DataTab id="world" label="世界" file="Map"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Treasure Chest"/></div>{dataSection==="skills"&&renderSkills()}{dataSection==="farm"&&renderFarm()}{dataSection==="world"&&renderWorldV70()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;''',
'world data tab')

# index: lazy world module and v70 release query
p=Path('index.html'); s=p.read_text()
old='const groups={lookup:["./lookup-data-v46.js?v=69","./lookup-extra-v49.js?v=69"],wardrobe:["./wardrobe-data-v34.js?v=69"]};'
new='const groups={lookup:["./lookup-data-v46.js?v=70","./lookup-extra-v49.js?v=70"],wardrobe:["./wardrobe-data-v34.js?v=70"],world:["./world-data-v70.js?v=70"]};'
if old not in s: raise SystemExit('missing index lazy groups')
s=s.replace(old,new,1).replace('?v=69','?v=70').replace('deploy-v69','deploy-v70')
p.write_text(s)

# release cache
replace_once('sw.js',"const CACHE='stardew-tracker-v69';","const CACHE='stardew-tracker-v70';",'v70 SW cache')

# old feature audit must validate feature invariants, not freeze future release number
replace_once('scripts/audit-today-v69.py',
'''idx=Path("index.html").read_text()\nif "?v=69" not in idx or "deploy-v69" not in idx: fail("v69 index version missing")\nif "const CACHE='stardew-tracker-v69';" not in Path("sw.js").read_text(): fail("v69 SW cache missing")\nif "python3 scripts/audit-today-v69.py" not in Path("build-cloudflare.sh").read_text(): fail("Cloudflare v69 audit missing")\nprint("v69 today assistant audit passed")''',
'''if "python3 scripts/audit-today-v69.py" not in Path("build-cloudflare.sh").read_text(): fail("Cloudflare v69 audit missing")\nprint("v69 today assistant audit passed")''',
'today audit release decouple')

# build/deploy include world module + audit
replace_once('build-cloudflare.sh',
'''python3 scripts/audit-today-v69.py\n\nnpm install''',
'''python3 scripts/audit-today-v69.py\npython3 scripts/audit-world-v70.py\n\nnpm install''',
'cloudflare world audit')
replace_once('build-cloudflare.sh',
'''social-data-v50.js machine-data-v51.js switch-names-v47.js dist/''',
'''social-data-v50.js machine-data-v51.js switch-names-v47.js world-data-v70.js dist/''',
'cloudflare world copy')
replace_once('.github/workflows/pages.yml',
'''          python3 scripts/audit-today-v69.py\n          npm install''',
'''          python3 scripts/audit-today-v69.py\n          python3 scripts/audit-world-v70.py\n          node --check world-data-v70.js\n          npm install''',
'pages world audit')
replace_once('.github/workflows/pages.yml',
'''social-data-v50.js machine-data-v51.js switch-names-v47.js dist/''',
'''social-data-v50.js machine-data-v51.js switch-names-v47.js world-data-v70.js dist/''',
'pages world copy')

# document the new manual snapshot
replace_once('docs/DATA_SOURCES.md',
'''| `machine-data-v51.js` | committed snapshot | 目前為正式設備資料 | generator 未確認；先視為 snapshot |\n| `farmer-preview-v33.js` / `animal-preview-v33.js` | 手寫 runtime compositor''',
'''| `machine-data-v51.js` | committed snapshot | 目前為正式設備資料 | generator 未確認；先視為 snapshot |\n| `world-data-v70.js` | manual committed snapshot | 2026-08-13 對照官方中文 Stardew Valley Wiki 的地點／商店／營業時間頁；UI 會優先重用 `social-data-v50.js` 已有商店資料 | 使用 stable region/place/person ID 與繁／簡／英 aliases；世界頁維持薄版，後續全域搜尋與 NPC 行程直接共用 |\n| `farmer-preview-v33.js` / `animal-preview-v33.js` | 手寫 runtime compositor''',
'world data docs')

print('v70 world transform complete')
