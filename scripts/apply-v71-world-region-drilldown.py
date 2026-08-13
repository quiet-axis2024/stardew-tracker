from pathlib import Path
import re

ROOT=Path('.')

app=Path('app.jsx').read_text()

CONST=r'''
const WORLD_REGION_MAP_V71 = {
  town:{
    file:"Map",zoom:"215%",position:"63% 50%",
    places:{pierre_store:[55,36],saloon:[51,64],blacksmith:[76,54],clinic:[47,47],museum:[68,62],community_center:[29,36],joja:[86,38]},
    spots:{town:[56,53]}
  },
  mountain:{
    file:"Map",zoom:"205%",position:"64% 25%",
    places:{carpenter:[31,61],mines:[68,31],guild:[78,43],railroad:[49,9],quarry:[91,19]},
    spots:{mountain:[54,55],mine20:[70,31],mine60:[77,38],mine100:[84,45]}
  },
  forest:{
    file:"Map",zoom:"175%",position:"27% 72%",
    places:{ranch:[59,43],wizard_tower:[22,69],traveling_cart:[43,18],leah_house:[68,70],secret_woods:[8,43]},
    spots:{forest_river:[57,55],forest_pond:[42,44],forest_falls:[39,80],glacier:[55,83],secret:[9,44],witch:[20,28]}
  },
  beach:{
    file:"Map",zoom:"220%",position:"72% 82%",
    places:{fish_shop:[52,46],elliott_house:[72,44],tide_pools:[88,58]},
    spots:{beach:[57,58],night:[76,60]}
  },
  desert:{
    file:null,zoom:"100%",position:"50% 50%",
    places:{oasis:[26,58],desert_trader:[71,35],casino:[30,36],skull_cavern:[80,72]},
    spots:{desert:[62,70]}
  },
  sewer:{
    file:null,zoom:"100%",position:"50% 50%",
    places:{sewer_main:[34,48],bug_lair:[72,58]},
    spots:{sewer:[34,55],bug:[73,59]}
  },
  island:{
    file:"Ginger Island Map",zoom:"125%",position:"50% 52%",
    places:{island_trader:[42,56],volcano:[53,17],field_office:[52,34],qi_room:[20,53]},
    spots:{island_n:[53,27],caldera:[55,8],island_w_fresh:[24,55],island_w_ocean:[18,72],island_s:[55,84],pirate:[79,78]}
  }
};
const WORLD_SPOT_REGION_V71 = (() => {
  const out={};
  Object.entries(WORLD_REGION_MAP_V71).forEach(([regionId,meta])=>Object.keys(meta.spots||{}).forEach(id=>{out[id]=regionId}));
  return out;
})();
'''

if 'const WORLD_REGION_MAP_V71 = {' not in app:
    anchor='const FISH_TIME_SEGMENTS_V42 = ['
    if anchor not in app: raise SystemExit('missing fish time anchor')
    app=app.replace(anchor,CONST+'\n'+anchor,1)

old_state='''  const [worldRegionV70, setWorldRegionV70] = useState("town");
  const [worldQueryV70, setWorldQueryV70] = useState("");
  const [worldOpenV70, setWorldOpenV70] = useState("");
  const [worldMapV70, setWorldMapV70] = useState("main");
  const [worldKindV70, setWorldKindV70] = useState("places");'''
new_state='''  const [worldRegionV70, setWorldRegionV70] = useState("");
  const [worldQueryV70, setWorldQueryV70] = useState("");
  const [worldOpenV70, setWorldOpenV70] = useState("");
  const [worldMapV70, setWorldMapV70] = useState("main");
  const [worldKindV70, setWorldKindV70] = useState("places");
  const [worldSpotV71, setWorldSpotV71] = useState("");
  const [worldQuickV71, setWorldQuickV71] = useState("");
  const [worldFishQueryV71, setWorldFishQueryV71] = useState("");'''
if old_state not in app: raise SystemExit('missing world state block')
app=app.replace(old_state,new_state,1)

old_open=r'''  const openFishHintV69 = (weather,areaId="town") => {
    const groupId=Object.entries(FISH_AREA_GROUPS_V4).find(([,g])=>g.ids.includes(areaId))?.[0]||"main";
    pushNavV62();setFishViewV4("find");setFishFindGroupV4(groupId);setFishAreaV4(areaId);setFishSeasonsV42([data.base.season]);setFishWeathersV42(weather?[weather]:[]);setFishTimesV42([]);setTab("fishing");
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"})));
  };'''
new_open=r'''  const openFishHintV69 = (weather,areaId="town") => {
    const regionId=WORLD_SPOT_REGION_V71[areaId]||"town";
    const mapId=regionId==="island"?"island":(["desert","sewer"].includes(regionId)?"special":"main");
    pushNavV62();setFishViewV4("world");setWorldMapV70(mapId);setWorldRegionV70(regionId);setWorldKindV70("spots");setWorldSpotV71(areaId);setWorldOpenV70("");setWorldQuickV71("");setWorldFishQueryV71("");
    setFishAreaV4(areaId);setFishSeasonsV42([data.base.season]);setFishWeathersV42(weather?[weather]:[]);setFishTimesV42([]);setTab("fishing");
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"})));
  };'''
if old_open not in app: raise SystemExit('missing openFishHintV69 block')
app=app.replace(old_open,new_open,1)

NEW_RENDER = r'''  const renderWorldV70 = () => {
    const db=window.SDVWorldV70;
    if(!db)return <div><SectionTitle icon="game:Map">世界</SectionTitle><Card style={{padding:10,textAlign:"center",color:C.muted,fontSize:10}}>載入世界資料中…</Card></div>;
    const people=db.people||{},regions=db.regions||[],places=db.places||[];
    const normalize=value=>String(value||"").normalize("NFKC").toLowerCase().replace(/[\s·・_'’\-／/]+/g,"");
    const region=worldRegionV70?regions.find(x=>x.id===worldRegionV70)||null:null;
    const regionMeta=region?WORLD_REGION_MAP_V71[region.id]||null:null;
    const regionPlaces=region?places.filter(x=>x.regionId===region.id):[];
    const regionSpots=region?Object.keys(regionMeta?.spots||{}).map(id=>FISH_AREAS_V4.find(a=>a.id===id)).filter(Boolean):[];
    const selectedSpot=worldSpotV71?FISH_AREAS_V4.find(a=>a.id===worldSpotV71)||null:null;
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
    const openPerson=p=>{const key=socialKey(p);if(key)openSocialNpcV55(key)};
    const openItem=async raw=>{const item=String(raw||"").replace(/ Recipe$/,'');await loadLazyDataV67("lookup");const row=lookupRowV54(item);openItemLookupV54(item,row?.file||item)};
    const clearWorldSelectionV71=()=>{setWorldOpenV70("");setWorldSpotV71("");setWorldKindV70("places")};
    const chooseWorldMapV71=mode=>{setWorldMapV70(mode);setWorldQuickV71("");setWorldFishQueryV71("");clearWorldSelectionV71();if(mode==="island")setWorldRegionV70("island");else setWorldRegionV70("")};
    const chooseWorldRegionV71=(regionId,{placeId="",spotId=""}={})=>{
      const mapId=regionId==="island"?"island":(["desert","sewer"].includes(regionId)?"special":"main");
      setWorldMapV70(mapId);setWorldRegionV70(regionId);setWorldQuickV71("");setWorldFishQueryV71("");
      if(spotId){setWorldKindV70("spots");setWorldSpotV71(spotId);setWorldOpenV70("")}
      else{setWorldKindV70("places");setWorldOpenV70(placeId);setWorldSpotV71("")}
    };
    const goWorldRootV71=()=>{setWorldRegionV70("");setWorldOpenV70("");setWorldSpotV71("");setWorldKindV70("places");setWorldQuickV71("");setWorldFishQueryV71("")};
    const selectWorldPlaceV71=id=>{setWorldKindV70("places");setWorldOpenV70(id);setWorldSpotV71("")};
    const selectWorldSpotV71=(id,preserveFilters=false)=>{
      const regionId=WORLD_SPOT_REGION_V71[id]||region?.id||"town";
      chooseWorldRegionV71(regionId,{spotId:id});
      setFishAreaV4(id);
      if(!preserveFilters){
        if(!fishSeasonsV42.length)setFishSeasonsV42([data.base.season]);
        if(todayWeatherV69&&!fishWeathersV42.length)setFishWeathersV42([todayWeatherV69]);
      }
    };
    const worldMapMeta=worldMapV70==="island"?FISH_MAP_META_V42.island:FISH_MAP_META_V42.main;
    const worldMapMainTargets={town:"town",forest:"forest",mountain:"mountain",beach:"beach",secret:"forest"};
    const clickWorldMapClusterV71=cluster=>{
      if(worldMapV70==="island"){chooseWorldRegionV71("island");return}
      const regionId=worldMapMainTargets[cluster.id];if(!regionId)return;
      chooseWorldRegionV71(regionId,{placeId:cluster.id==="secret"?"secret_woods":""});
    };
    const toggleValueV71=(value,list,setter)=>setter(list.includes(value)?list.filter(x=>x!==value):[...list,value]);
    const matchesTimeV71=(windows,segId)=>{const seg=FISH_TIME_SEGMENTS_V42.find(x=>x.id===segId);if(!seg)return true;const [sa,sb]=seg.range;return windows.some(([a,b])=>a<sb&&b>sa)};
    const fishMatchesV71=(area,i)=>{
      const rule=fishRuleV4(i);
      const seasons=area.forceSeasons||area.seasonOverride?.[i]||rule.s||SEASONS;
      if(area.days&&!area.days.includes(Number(data.base.day||1)))return false;
      if(fishSeasonsV42.length&&!fishSeasonsV42.some(x=>seasons.includes(x)))return false;
      if(fishWeathersV42.length&&rule.w!=="任意"&&!fishWeathersV42.includes(rule.w))return false;
      if(fishTimesV42.length){const windows=area.timeOverride||rule.t||[[6,26]];if(!fishTimesV42.some(id=>matchesTimeV71(windows,id)))return false}
      return true;
    };
    const filterButtonV71=(label,on,onClick,tint="#FFF4D8")=><button onClick={onClick} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?tint:C.paper,borderRadius:14,padding:"4px 8px",fontSize:8.1,fontWeight:900,color:on?C.darkBrown:C.muted,whiteSpace:"nowrap"}}>{on?"✓ ":""}{label}</button>;
    const clearFishFiltersV71=()=>{setFishSeasonsV42([]);setFishWeathersV42([]);setFishTimesV42([])};
    const renderFishFiltersV71=()=> <Card style={{marginTop:7,padding:7,background:"#FFFDF5"}}>
      <div style={{display:"grid",gap:5}}>
        <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.3,fontWeight:900,color:C.muted,paddingTop:5}}>季節</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{SEASONS.map(x=>filterButtonV71(x,fishSeasonsV42.includes(x),()=>toggleValueV71(x,fishSeasonsV42,setFishSeasonsV42),`${SEASON_COLORS[x]}30`))}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.3,fontWeight:900,color:C.muted,paddingTop:5}}>天氣</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{["晴","雨"].map(x=>filterButtonV71(x,fishWeathersV42.includes(x),()=>toggleValueV71(x,fishWeathersV42,setFishWeathersV42),x==="雨"?"#DCEBFA":"#FFF0B8"))}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.3,fontWeight:900,color:C.muted,paddingTop:5}}>時間</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{FISH_TIME_SEGMENTS_V42.map(x=>filterButtonV71(x.name,fishTimesV42.includes(x.id),()=>toggleValueV71(x.id,fishTimesV42,setFishTimesV42),"#E5EDF2"))}</div></div>
      </div>
      {(fishSeasonsV42.length||fishWeathersV42.length||fishTimesV42.length)?<button onClick={clearFishFiltersV71} style={{border:0,background:"transparent",fontSize:7.6,color:C.blue,fontWeight:900,marginTop:5,padding:0}}>清除條件</button>:null}
    </Card>;
    const openQuickFishV71=()=>{setWorldQuickV71(worldQuickV71==="fish"?"":"fish");setWorldFishQueryV71("");if(!fishSeasonsV42.length)setFishSeasonsV42([data.base.season]);if(todayWeatherV69&&!fishWeathersV42.length)setFishWeathersV42([todayWeatherV69])};
    const quickSpotScope=region?FISH_AREAS_V4.filter(a=>WORLD_SPOT_REGION_V71[a.id]===region.id):FISH_AREAS_V4;
    const quickFishRows=(()=>{
      const rows=new Map(),q=normalize(worldFishQueryV71);
      quickSpotScope.forEach(area=>(area.fish||[]).forEach(i=>{
        if(!fishMatchesV71(area,i))return;
        const name=COLLECTIONS.fish.items[i],file=FISH_ICON_FILES[i];if(!name)return;
        if(q&&!normalize(`${name} ${switchNameV47(name,file)} ${file}`).includes(q))return;
        if(!rows.has(i))rows.set(i,{i,name,file,spots:[]});
        rows.get(i).spots.push(area);
      }));
      return [...rows.values()].slice(0,60);
    })();
    const PlaceCard=({place})=>{
      const open=worldOpenV70===place.id,r=regions.find(x=>x.id===place.regionId),owner=person(place.ownerId),shop=shopFor(place),services=serviceRows(place);
      const members=(place.peopleIds||[]).map(id=>person(id)).filter(Boolean);
      const hours=shop?.hours||place.hours||"沒有固定營業時間";
      return <Card style={{padding:8,borderColor:open?C.orange:C.line,background:open?"#FFF8E9":C.paper}}>
        <button type="button" aria-expanded={open} onClick={()=>setWorldOpenV70(open?"":place.id)} style={{width:"100%",border:0,background:"transparent",padding:0,textAlign:"left",cursor:"pointer",color:"inherit"}}>
          <div style={{display:"grid",gridTemplateColumns:"38px minmax(0,1fr) 18px",gap:7,alignItems:"center"}}><GameIcon file={place.icon||r?.icon||"Map"} size={36}/><div style={{minWidth:0}}>{place.requires&&<span style={{fontSize:6.5,fontWeight:900,color:C.orange,background:"#FFF0C8",borderRadius:7,padding:"1px 4px"}}>有解鎖條件</span>}<b style={{display:"block",fontSize:11,color:C.darkBrown,lineHeight:1.2,marginTop:2}}>{place.name}</b><div style={{fontSize:7.6,color:C.muted,lineHeight:1.3,marginTop:2}}>{hours}</div></div><span style={{fontSize:14,color:C.muted,fontWeight:950,textAlign:"center",transform:open?"rotate(180deg)":"none"}}>⌄</span></div>
        </button>
        {open&&<div style={{marginTop:7,paddingTop:7,borderTop:`1px dashed ${C.line}`}}>
          {place.requires&&<div style={{padding:"5px 7px",borderRadius:7,background:"#FFF0C8",fontSize:8,color:C.brown,lineHeight:1.35}}><b>解鎖：</b>{place.requires}</div>}
          {services.length>0&&<div style={{marginTop:place.requires?6:0}}><div style={{fontSize:7.5,color:C.muted,fontWeight:950,marginBottom:3}}>可以做什麼</div><div style={{display:"grid",gap:3}}>{services.map(x=><div key={x} style={{display:"grid",gridTemplateColumns:"10px 1fr",gap:3,fontSize:8.4,color:C.ink,lineHeight:1.35}}><span>•</span><span>{x}</span></div>)}</div></div>}
          {members.length>0&&<div style={{marginTop:7}}><div style={{fontSize:7.5,color:C.muted,fontWeight:950,marginBottom:4}}>相關人物</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{members.map(p=>{const can=Boolean(socialKey(p));return <button key={p.id} disabled={!can} onClick={()=>openPerson(p)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"3px 6px 3px 3px",display:"inline-flex",alignItems:"center",gap:3,fontSize:7.8,fontWeight:900,color:C.brown,opacity:can?1:.7}}><GameIcon file={p.icon} size={22}/>{p.name}{can?" ›":""}</button>})}</div></div>}
          {shop?.items?.length>0&&<div style={{marginTop:7}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}><span style={{fontSize:7.5,color:C.muted,fontWeight:950}}>商店內容節選</span><span style={{fontSize:6.8,color:C.muted}}>沿用社交資料</span></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4,marginTop:4}}>{shop.items.slice(0,8).map((it,i)=>{const raw=it.name||"";return <button key={`${place.id}-${raw}-${i}`} onClick={()=>openItem(raw)} style={{border:`1px solid ${C.line}`,background:"#FFFDF5",borderRadius:7,padding:"4px 2px",minWidth:0}}><GameIcon file={raw.replace(/ Recipe$/,'')||"Chest"} size={25}/><div style={{fontSize:6.8,fontWeight:900,color:C.ink,lineHeight:1.08,marginTop:2,overflow:"hidden",textOverflow:"ellipsis"}}>{switchNameV47(raw.replace(/ Recipe$/,''),raw.replace(/ Recipe$/,''))}{/ Recipe$/.test(raw)?"配方":""}</div>{it.price!=null&&<div style={{fontSize:6.3,color:C.muted,marginTop:1}}>{Number(it.price).toLocaleString()}g</div>}</button>})}</div></div>}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:7,paddingTop:6,borderTop:`1px dashed ${C.line}`}}>{place.fishingAreaId&&<button onClick={()=>selectWorldSpotV71(place.fishingAreaId)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.blue}}>查看這裡的釣點 ›</button>}{place.id==="community_center"&&<button onClick={()=>openTownRepairV69("")} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.brown}}>打開城鎮修復 ›</button>}{owner&&socialKey(owner)&&<button onClick={()=>openPerson(owner)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:7.7,fontWeight:900,color:C.brown}}>查看 {owner.name} ›</button>}</div>
        </div>}
      </Card>;
    };
    const markerRows=worldKindV70==="spots"?regionSpots:regionPlaces;
    const markerPoints=worldKindV70==="spots"?(regionMeta?.spots||{}):(regionMeta?.places||{});
    const renderRegionMapV71=()=> {
      if(!region||!regionMeta)return null;
      return <Card style={{padding:7,marginTop:6}}>
        <div style={{position:"relative",height:205,overflow:"hidden",borderRadius:9,border:`1px solid ${C.line}`,background:regionMeta.file?"#DCE9C2":"linear-gradient(145deg,#E7D7AF,#C9B37B)",backgroundImage:regionMeta.file?`url(${GAME_FILE(regionMeta.file)})`:"linear-gradient(145deg,#E7D7AF,#C9B37B)",backgroundRepeat:"no-repeat",backgroundSize:regionMeta.file?regionMeta.zoom:"cover",backgroundPosition:regionMeta.file?regionMeta.position:"center"}}>
          {!regionMeta.file&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:.23}}><GameIcon file={region.icon||"Map"} size={96}/></div>}
          {markerRows.map((row,index)=>{
            const id=row.id,point=markerPoints[id]||[18+(index%4)*22,28+Math.floor(index/4)*30];
            const on=worldKindV70==="spots"?worldSpotV71===id:worldOpenV70===id;
            const label=worldKindV70==="spots"?row.sub:row.name;
            return <button key={id} onClick={()=>worldKindV70==="spots"?selectWorldSpotV71(id):selectWorldPlaceV71(id)} style={{position:"absolute",left:`${point[0]}%`,top:`${point[1]}%`,transform:"translate(-50%,-50%)",border:`1.5px solid ${on?C.orange:"#8B683C"}`,background:on?"#FFE1A0":"rgba(255,250,235,.96)",boxShadow:"0 1px 3px rgba(0,0,0,.25)",borderRadius:10,padding:"2px 5px",fontSize:6.8,fontWeight:950,color:C.darkBrown,whiteSpace:"nowrap",maxWidth:96,overflow:"hidden",textOverflow:"ellipsis"}}>{worldKindV70==="spots"?"🎣 ":""}{label}</button>
          })}
        </div>
        <div style={{fontSize:7.2,color:C.muted,textAlign:"center",marginTop:4}}>{worldKindV70==="spots"?"點地圖上的水域，下面直接看這個釣點的魚。":"點地圖上的地點，下面直接展開營業時間、服務與相關人物。"}</div>
      </Card>;
    };
    const spotRows=selectedSpot?(selectedSpot.fish||[]).filter(i=>fishMatchesV71(selectedSpot,i)):[];
    const rootMap=worldMapV70==="island"?FISH_MAP_META_V42.island:FISH_MAP_META_V42.main;
    return <div>
      <SectionTitle icon="game:Map">世界</SectionTitle>
      {!region&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginBottom:6}}>{[["main","本島","Map"],["island","姜岛","Ginger Island Map"],["special","特殊區域","Rusty Key"]].map(([id,label,file])=>{const on=worldMapV70===id;return <button key={id} onClick={()=>chooseWorldMapV71(id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:9,padding:"5px 3px",display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontSize:8.2,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file={file} size={25}/>{label}</button>})}</div>}
      <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:6}}>
        <button onClick={openQuickFishV71} style={{border:`1px solid ${worldQuickV71==="fish"?C.orange:C.line}`,background:worldQuickV71==="fish"?"#FFF0C8":C.cream,borderRadius:8,padding:"5px 8px",fontSize:7.6,fontWeight:950,color:C.blue}}>🎣 按條件找魚</button>
        <button disabled title="NPC 今日行程完成後啟用" style={{border:`1px solid ${C.line}`,background:"#EEE9DE",borderRadius:8,padding:"5px 8px",fontSize:7.6,fontWeight:950,color:C.muted,opacity:.72}}>👤 按條件找人</button>
        <span style={{fontSize:6.8,color:C.muted}}>找人會在 NPC 今日行程完成後啟用</span>
      </div>
      {worldQuickV71==="fish"&&<Card style={{padding:8,background:"#FFF8E2",marginBottom:7}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><b style={{fontSize:10.5,color:C.darkBrown,flex:1}}>按條件找魚{region?` · ${region.name}`:" · 全世界"}</b><button onClick={()=>setWorldQuickV71("")} style={{border:0,background:"transparent",fontSize:12,color:C.brown,fontWeight:950}}>×</button></div>
        <input value={worldFishQueryV71} onChange={e=>setWorldFishQueryV71(e.target.value)} placeholder="魚名可選填，例如：鲶鱼、Catfish…" style={{width:"100%",border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:8,padding:"7px 9px",fontSize:9.2,color:C.ink,outline:"none",marginTop:6}}/>
        {renderFishFiltersV71()}
        <div style={{fontSize:7.4,color:C.muted,fontWeight:900,marginTop:6}}>找到 {quickFishRows.length} 種魚</div>
        <div style={{display:"grid",gap:5,marginTop:5,maxHeight:340,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>{quickFishRows.map(row=><div key={row.i} style={{border:`1px solid ${C.line}`,background:C.paper,borderRadius:8,padding:6,display:"grid",gridTemplateColumns:"34px minmax(0,1fr)",gap:6,alignItems:"start"}}><GameIcon file={row.file} size={32}/><div style={{minWidth:0}}><b style={{display:"block",fontSize:9.4,color:C.ink}}>{switchNameV47(row.name,row.file)}</b><div style={{fontSize:6.9,color:C.muted,marginTop:1}}>{formatFishTimeV4(fishRuleV4(row.i))}</div><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{row.spots.map(area=>{const r=regions.find(x=>x.id===WORLD_SPOT_REGION_V71[area.id]);return <button key={`${row.i}-${area.id}`} onClick={()=>selectWorldSpotV71(area.id,true)} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"3px 5px",fontSize:6.8,fontWeight:900,color:C.brown}}>{r?.name||area.name} → {area.sub}</button>})}</div></div></div>)}</div>
        {!quickFishRows.length&&<div style={{fontSize:8.5,color:C.muted,textAlign:"center",padding:10}}>目前沒有符合條件的魚。</div>}
      </Card>}
      {!region&&worldQuickV71!=="fish"&&<>
        {worldMapV70!=="special"?<Card style={{padding:7}}>
          <div style={{position:"relative",overflow:"hidden",borderRadius:9,border:`1px solid ${C.line}`,background:"#DCE9C2"}}>
            <img src={GAME_FILE(rootMap.file)} alt={worldMapV70==="island"?"姜岛地圖":"星露谷地圖"} style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>
            {rootMap.clusters.map(c=>{const target=worldMapV70==="island"?"island":worldMapMainTargets[c.id];if(!target)return null;return <button key={c.id} onClick={()=>clickWorldMapClusterV71(c)} style={{position:"absolute",left:`${c.x}%`,top:`${c.y}%`,transform:"translate(-50%,-50%)",border:"1.5px solid #8B683C",background:"rgba(255,248,226,.95)",boxShadow:"0 1px 3px rgba(0,0,0,.25)",borderRadius:10,padding:"2px 5px",fontSize:7.2,fontWeight:950,color:C.darkBrown,whiteSpace:"nowrap"}}>{c.label}</button>})}
          </div>
          <div style={{fontSize:7.4,color:C.muted,textAlign:"center",marginTop:5}}>點地圖上的區域，進入區域地圖。</div>
        </Card>:<Card style={{padding:8}}>
          <div style={{fontSize:8,color:C.muted,fontWeight:950,marginBottom:5}}>選擇特殊區域</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>{regions.filter(r=>["desert","sewer"].includes(r.id)).map(r=><button key={r.id} onClick={()=>chooseWorldRegionV71(r.id)} style={{border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:7,display:"flex",alignItems:"center",gap:6,textAlign:"left",color:C.brown}}><GameIcon file={r.icon} size={31}/><span><b style={{display:"block",fontSize:9.3}}>{r.name}</b><span style={{display:"block",fontSize:6.8,color:C.muted,marginTop:1}}>{r.summary}</span></span></button>)}</div>
        </Card>}
      </>}
      {region&&worldQuickV71!=="fish"&&<>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
          <button onClick={goWorldRootV71} style={{border:0,background:"transparent",padding:"2px 0",fontSize:8,color:C.blue,fontWeight:950}}>← 大世界地圖</button>
          <span style={{fontSize:7,color:C.muted}}>›</span>
          <b style={{fontSize:10.5,color:C.darkBrown}}>{region.name}</b>
        </div>
        <div style={{fontSize:7.7,color:C.muted,lineHeight:1.35,marginBottom:6}}>{region.summary}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
          <button onClick={()=>{setWorldKindV70("places");setWorldSpotV71("")}} style={{border:`1.5px solid ${worldKindV70==="places"?C.orange:C.line}`,background:worldKindV70==="places"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:8.8,fontWeight:950,color:C.brown}}>📍 地點</button>
          <button onClick={()=>{setWorldKindV70("spots");setWorldOpenV70("")}} style={{border:`1.5px solid ${worldKindV70==="spots"?C.orange:C.line}`,background:worldKindV70==="spots"?"#DDECF7":C.paper,borderRadius:9,padding:6,fontSize:8.8,fontWeight:950,color:worldKindV70==="spots"?C.blue:C.brown}}>🎣 釣點</button>
        </div>
        {renderRegionMapV71()}
        {worldKindV70==="places"&&<>{worldOpenV70?<div style={{marginTop:7}}>{regionPlaces.filter(p=>p.id===worldOpenV70).map(place=><PlaceCard key={place.id} place={place}/>)}</div>:<div style={{fontSize:7.6,color:C.muted,textAlign:"center",padding:"7px 0 1px"}}>點地圖上的地點查看詳細資料。</div>}</>}
        {worldKindV70==="spots"&&<>{selectedSpot?<div style={{marginTop:7}}>
          <Card style={{padding:8,background:"#FFF8E2"}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={selectedSpot.icon} size={34}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:12,color:C.darkBrown}}>{selectedSpot.name} · {selectedSpot.sub}</b>{selectedSpot.tip&&<div style={{fontSize:7.5,color:C.brown,lineHeight:1.35,marginTop:2}}>{selectedSpot.tip}</div>}</div><span style={{fontSize:8,color:C.muted,fontWeight:900}}>{spotRows.length} 種</span></div></Card>
          {renderFishFiltersV71()}
          <div style={{display:"grid",gap:5,marginTop:7}}>{spotRows.map(i=>renderFishCardV4(i,selectedSpot,true,false))}</div>
          {!spotRows.length&&<Card style={{marginTop:7,padding:10,textAlign:"center",fontSize:9,color:C.muted}}>這個釣點目前沒有符合條件的魚。</Card>}
        </div>:<div style={{fontSize:7.6,color:C.muted,textAlign:"center",padding:"7px 0 1px"}}>點地圖上的水域，直接查看這個釣點的魚。</div>}</>}
      </>}
    </div>;
  };'''

m=re.search(r'  const renderWorldV70 = \(\) => \{.*?\n  \};\n\n  const renderData = \(\) => \{',app,re.S)
if not m: raise SystemExit('missing renderWorldV70 block')
app=app[:m.start()] + NEW_RENDER + '\n\n  const renderData = () => {' + app[m.end():]

old_fishing=r'''  const renderFishingV30 = () => {
    const fast=fishViewV4==="items"?"items":"world";
    return <div><SectionTitle icon="game:Magnifying Glass">查找</SectionTitle><Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.7,color:C.muted,lineHeight:1.4}}>查找只分兩大類：先從「世界」按地圖找位置、人物與魚；要查遊戲裡的東西則進「物品」。</div></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:7}}><button onClick={()=>setFishViewV4("world")} style={{border:`2px solid ${fast==="world"?C.orange:C.line}`,background:fast==="world"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Map" size={29}/>世界</button><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={29}/>物品</button></div>{fast==="items"?renderItemUsageV42():fishViewV4==="find"?<><button onClick={()=>setFishViewV4("world")} style={{marginTop:7,border:`1px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"5px 8px",fontSize:8,fontWeight:950,color:C.brown}}>← 返回世界地圖</button>{renderFishFindV4()}</>:renderWorldV70()}</div>;
  };'''
new_fishing=r'''  const renderFishingV30 = () => {
    const fast=fishViewV4==="items"?"items":"world";
    return <div><SectionTitle icon="game:Magnifying Glass">查找</SectionTitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:3}}><button onClick={()=>setFishViewV4("world")} style={{border:`2px solid ${fast==="world"?C.orange:C.line}`,background:fast==="world"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Map" size={29}/>世界</button><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={29}/>物品</button></div>{fast==="items"?renderItemUsageV42():renderWorldV70()}</div>;
  };'''
if old_fishing not in app: raise SystemExit('missing renderFishingV30 block')
app=app.replace(old_fishing,new_fishing,1)

Path('app.jsx').write_text(app)

idx=Path('index.html')
s=idx.read_text().replace('?v=70','?v=71').replace('deploy-v70','deploy-v71')
idx.write_text(s)
sw=Path('sw.js')
s=sw.read_text().replace("const CACHE='stardew-tracker-v70';","const CACHE='stardew-tracker-v71';")
sw.write_text(s)

Path('scripts/audit-world-v70.py').write_text(r'''from pathlib import Path
import re

def fail(msg):
    raise SystemExit(msg)

app=Path('app.jsx').read_text()
for token in ['const renderWorldV70 = () =>','loadLazyDataV67("world")','NPC_SERVICES_V55','openSocialNpcV55']:
    if token not in app: fail('v70 world data integration missing '+token)
if 'DataTab id="world" label="世界"' in app or 'dataSection==="world"' in app:
    fail('world must live under lookup, not player data')

world=Path('world-data-v70.js').read_text()
for token in ['window.SDVWorldV70','version:70','regions:[','places:[','weather:[','people:{','鹈鹕镇','煤矿森林','姜岛','皮埃尔的杂货店','木匠的商店','铁匠铺','鱼店']:
    if token not in world: fail('v70 world data missing '+token)

ids=re.findall(r'\{id:"([a-z0-9_]+)"', world)
if len(ids)!=len(set(ids)):
    dup=sorted({x for x in ids if ids.count(x)>1})
    fail('duplicate stable IDs in world data: '+repr(dup))

idx=Path('index.html').read_text()
if './world-data-v70.js?v=' not in idx: fail('world lazy group missing')
cloud=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()
if 'world-data-v70.js dist/' not in cloud or 'world-data-v70.js dist/' not in pages:
    fail('world snapshot must ship in both builds')
docs=Path('docs/DATA_SOURCES.md').read_text()
if '`world-data-v70.js` | manual committed snapshot' not in docs:
    fail('world data source documentation missing')
print('v70 world data-layer audit passed')
''')

Path('scripts/audit-world-v71.py').write_text(r'''from pathlib import Path

def fail(msg):
    raise SystemExit(msg)

app=Path('app.jsx').read_text()
need=[
    'const WORLD_REGION_MAP_V71 = {',
    'const WORLD_SPOT_REGION_V71 =',
    'const [worldSpotV71, setWorldSpotV71]',
    'const [worldQuickV71, setWorldQuickV71]',
    '大世界地圖',
    '📍 地點',
    '🎣 釣點',
    '按條件找魚',
    '按條件找人',
    'NPC 今日行程完成後啟用',
    'selectWorldSpotV71',
    'renderRegionMapV71',
    'fishMatchesV71',
    'setFishViewV4("world")',
    'setWorldKindV70("spots")',
    'renderWorldV70()'
]
missing=[x for x in need if x not in app]
if missing: fail('v71 world UX invariant missing: '+repr(missing))
for stale in [
    '人物 {regionPeople.length}',
    'openWorldFishV70',
    'fishViewV4==="find"?',
    '返回世界地圖</button>{renderFishFindV4()}'
]:
    if stale in app: fail('stale parallel world/fish UX remains: '+stale)
open_hint=app[app.find('const openFishHintV69'):app.find('const todayFishRowsV69')]
if 'setFishViewV4("world")' not in open_hint or 'setWorldSpotV71(areaId)' not in open_hint:
    fail('Today fish deep-link must land in World fishing spot')

idx=Path('index.html').read_text()
if '?v=71' not in idx or 'deploy-v71' not in idx:
    fail('v71 release query marker missing')
if "const CACHE='stardew-tracker-v71';" not in Path('sw.js').read_text():
    fail('v71 service worker cache missing')
if 'python3 scripts/audit-world-v71.py' not in Path('build-cloudflare.sh').read_text():
    fail('Cloudflare v71 audit missing')
if 'python3 scripts/audit-world-v71.py' not in Path('.github/workflows/pages.yml').read_text():
    fail('Pages v71 audit missing')
print('v71 world region drill-down audit passed')
''')

for file in ['build-cloudflare.sh','.github/workflows/pages.yml']:
    p=Path(file);s=p.read_text()
    if 'python3 scripts/audit-world-v71.py' not in s:
        if file.endswith('pages.yml'):
            s=s.replace('          python3 scripts/audit-world-v70.py','          python3 scripts/audit-world-v70.py\n          python3 scripts/audit-world-v71.py',1)
        else:
            s=s.replace('python3 scripts/audit-world-v70.py','python3 scripts/audit-world-v70.py\npython3 scripts/audit-world-v71.py',1)
    p.write_text(s)

p=Path('docs/ROADMAP.md');s=p.read_text()
old='''### 目前實作狀態

v70 PR #45 已完成世界基礎資料層；PR #46 已完成「資料＝玩家存檔、查找＝世界／物品」與第一版 map-first 入口。

但 PR #46 畫面仍屬中間版本：目前「地點／人物／找魚」並列、找魚跳進舊找魚流程，**尚未完成本節最終定案的 `區域地圖 → 地點／釣點` UX**。後續實作需依本節重構，並同步更新對應 audit。'''
new='''### 目前實作狀態

v70 PR #45 已完成世界基礎資料層；PR #46 已完成「資料＝玩家存檔、查找＝世界／物品」與第一版 map-first 入口。

v71 已依本節完成世界瀏覽重構：大世界進區域後改為區域地圖，區域只分「地點／釣點」；人物回到地點關聯，釣點在世界頁原地顯示魚類與條件，不再跳往平行找魚頁。「🎣 按條件找魚」也在世界內反查並定位回釣點。

「👤 按條件找人」入口已保留，但正式結果仍依賴第 5 項 NPC 今日行程資料；行程完成前不建立假的簡化資料。'''
if old not in s: raise SystemExit('missing ROADMAP status block')
s=s.replace(old,new,1)
p.write_text(s)

p=Path('docs/WORLD_V70.md');s=p.read_text()
old='''## 目前實作狀態

- PR #45 / v70：已建立世界基礎資料層。
- PR #46：已完成「資料＝玩家存檔、查找＝世界／物品」、預設世界與第一版 map-first 入口。
- **尚待重構**：PR #46 畫面仍有「地點／人物／找魚」並列，以及找魚跳進舊找魚流程；最終 UX 應依本文件改成 `區域地圖 → 地點／釣點`，並加入「按條件找魚／按條件找人」。'''
new='''## 目前實作狀態

- PR #45 / v70：已建立世界基礎資料層。
- PR #46：已完成「資料＝玩家存檔、查找＝世界／物品」、預設世界與第一版 map-first 入口。
- v71：已完成最終 `大世界地圖 → 區域 → 區域地圖 → 地點／釣點` UX；地點原地展開人物／商店／服務，釣點原地顯示魚類與季節／天氣／時間篩選，舊平行找魚頁不再作為查找流程。
- 「🎣 按條件找魚」已納入世界反查；「👤 按條件找人」保留入口，待第 5 項 NPC 今日行程資料接入。'''
if old not in s: raise SystemExit('missing WORLD status block')
s=s.replace(old,new,1)
p.write_text(s)

print('v71 world region drill-down applied')
