from pathlib import Path
import re

app_path=Path('app.jsx')
app=app_path.read_text()

def replace_once(old,new,label):
    global app
    if old not in app:
        raise SystemExit(f'missing anchor: {label}')
    app=app.replace(old,new,1)

# 1) Add horse as a linked milestone.
replace_once(
'  { id: "greenhouse", name: "溫室修復", desc: "解鎖全年種植空間" },\n  { id: "mine120", name: "普通礦井 120 層", desc: "抵達礦井底層並取得骷髏鑰匙" },',
'  { id: "greenhouse", name: "溫室修復", desc: "解鎖全年種植空間" },\n  { id: "horse", name: "馬匹取得", desc: "建造马厩後取得马，與農場建築進度聯動" },\n  { id: "mine120", name: "普通礦井 120 層", desc: "抵達礦井底層並取得骷髏鑰匙" },',
'horse milestone')

# 2) Bump save schema and add canonical fact/evidence helpers.
replace_once(
'''const SAVE_SCHEMA_VERSION_V67 = 1;\nconst LEGACY_SCHEMA_VERSION_V67 = 0;\nconst PREFILL = {\n  schemaVersion: SAVE_SCHEMA_VERSION_V67,''',
'''const SAVE_SCHEMA_VERSION_V68 = 2;\nconst LEGACY_SCHEMA_VERSION_V68 = 0;\nconst PREFILL = {\n  schemaVersion: SAVE_SCHEMA_VERSION_V68,''',
'schema constants')

replace_once(
'  animals: {}, ponds: [], milestones: [], wallet: [], abilities: [], bundleDone: [], bundleItems: {}, friendship: {},\n',
'  animals: {}, ponds: [], milestones: [], wallet: [], abilities: [], bundleDone: [], bundleItems: {}, friendship: {}, factClaimsV68: {},\n',
'prefill fact claims')

helper_code=r'''

const LINKED_ROUTE_FACTS_V68 = {
  greenhouse:{room:"pantry",joja:"greenhouse"},
  minecart:{room:"boiler",joja:"minecart"},
  bridge:{room:"crafts",joja:"bridge"},
  panning:{room:"fishtank",joja:"panning"},
  bus:{room:"vault",joja:"bus"}
};
const LINKED_MILESTONES_V68 = new Set(["greenhouse","horse","mine120","bus","minecart","bridge","panning","cc"]);
const BUILDING_OTHER_NAMES_V68 = {
  stable:["馬廄","马厩"], greenhouse:["溫室","温室"], well:["水井"], mill:["磨坊"], slime:["史萊姆窩","史莱姆屋"], cabin:["連線小屋","联机小屋"], junimo:["祝尼魔小屋"]
};

function factClaimSourcesFromStateV68(state,id){
  const raw=state?.factClaimsV68?.[id];
  return Array.isArray(raw)?[...new Set(raw.filter(x=>typeof x==="string"&&x))]:[];
}
function withFactClaimV68(state,id,source,on){
  const claims={...(state?.factClaimsV68||{})};
  const set=new Set(factClaimSourcesFromStateV68(state,id));
  if(on)set.add(source);else set.delete(source);
  if(set.size)claims[id]=[...set];else delete claims[id];
  return {...state,factClaimsV68:claims};
}
function buildingCountFromStateV68(state,key){
  const counts=state?.buildingCounts||{};
  if(counts[key]!=null)return Math.max(0,Number(counts[key])||0);
  if(key==="coop")return Number(state?.buildings?.coop||0)>0?1:0;
  if(key==="barn")return Number(state?.buildings?.barn||0)>0?1:0;
  if(key==="silo")return Math.max(0,Number(state?.buildings?.silos||0));
  if(key==="shed")return Math.max(0,Number(state?.buildings?.sheds||0));
  const other=state?.buildings?.other||[];
  const names=BUILDING_OTHER_NAMES_V68[key]||[];
  return names.some(name=>other.includes(name))?1:0;
}
function withStableCountV68(state,value){
  const v=Math.max(0,Math.min(99,Number(value)||0));
  const counts={...(state?.buildingCounts||{}),stable:v};
  const buildings={...(state?.buildings||{})};
  const other=(buildings.other||[]).filter(name=>!BUILDING_OTHER_NAMES_V68.stable.includes(name));
  buildings.other=v>0?[...new Set([...other,"馬廄"])]:other;
  return {...state,buildingCounts:counts,buildings};
}
function bundleItemsFromStateV68(state,bundle){
  const mode=state?.bundleModeV28||"standard";
  const custom=state?.bundleCustomV28||{};
  return mode==="custom"?(custom[bundle.id]||bundle.items):bundle.items;
}
function bundleNeedFromStateV68(state,bundle){
  const items=bundleItemsFromStateV68(state,bundle);
  const base=bundle.need||bundle.items.length;
  const custom=state?.bundleNeedV28||{};
  const raw=(state?.bundleModeV28||"standard")==="custom"&&custom[bundle.id]!=null?Number(custom[bundle.id]):base;
  return Math.max(1,Math.min(items.length||1,Number(raw)||1));
}
function roomExplicitDoneFromStateV68(state,roomId){
  return (state?.bundleDone||[]).includes(roomId);
}
function roomItemsCompleteFromStateV68(state,roomId){
  const room=BUNDLE_ROOMS.find(r=>r.id===roomId);
  if(!room)return false;
  return room.bundles.every(bundle=>{
    const items=bundleItemsFromStateV68(state,bundle);
    const got=(state?.bundleItems?.[bundle.id]||[]).filter(x=>items.includes(x));
    return got.length>=bundleNeedFromStateV68(state,bundle);
  });
}
function roomDoneFromStateV68(state,roomId){
  return roomExplicitDoneFromStateV68(state,roomId)||roomItemsCompleteFromStateV68(state,roomId);
}
function currentRouteFromStateV68(state){
  return ["cc","joja"].includes(state?.communityRouteV28)?state.communityRouteV28:"";
}
function routeFactDoneFromStateV68(state,id){
  const map=LINKED_ROUTE_FACTS_V68[id];
  if(!map)return false;
  const route=currentRouteFromStateV68(state);
  if(route==="cc")return roomDoneFromStateV68(state,map.room);
  if(route==="joja")return (state?.jojaProjectsV28||[]).includes(map.joja);
  return false;
}
function walletHasSkullKeyV68(state){
  const values=state?.wallet||[];
  return ["skull_key","骷髏鑰匙","头骨钥匙"].some(v=>values.includes(v));
}
function progressFactDoneFromStateV68(state,id){
  const claimed=factClaimSourcesFromStateV68(state,id).length>0;
  if(LINKED_ROUTE_FACTS_V68[id]){
    if(id==="greenhouse")return claimed||routeFactDoneFromStateV68(state,id)||buildingCountFromStateV68(state,"greenhouse")>0;
    if(id==="panning")return claimed||routeFactDoneFromStateV68(state,id)||Boolean(state?.tools?.pan&&state.tools.pan!=="未取得");
    return claimed||routeFactDoneFromStateV68(state,id);
  }
  if(id==="mine120")return claimed||Number(state?.mine?.normal||0)>=120||walletHasSkullKeyV68(state);
  if(id==="horse")return claimed||buildingCountFromStateV68(state,"stable")>0;
  if(id==="cc")return claimed||(currentRouteFromStateV68(state)==="cc"&&BUNDLE_ROOMS.every(r=>roomDoneFromStateV68(state,r.id)));
  return false;
}
'''
replace_once('\nconst STORAGE_KEY = "sdv2-progress-v3";',helper_code+'\nconst STORAGE_KEY = "sdv2-progress-v3";','fact helper insertion')

# 3) Replace v67 normalizer with schema-v2 migration + reconciliation.
old_normalizer=r'''function normalizeSaveV67(input){
  const raw=input&&typeof input==="object"?input:{};
  const hasSchema=Object.prototype.hasOwnProperty.call(raw,"schemaVersion");
  const parsed=Number(raw.schemaVersion);
  const schemaVersion=hasSchema&&Number.isInteger(parsed)&&parsed>=0?parsed:LEGACY_SCHEMA_VERSION_V67;
  return normalizeWardrobeProgressV38({...PREFILL,...raw,schemaVersion});
}'''
new_normalizer=r'''function normalizeSaveV68(input){
  const raw=input&&typeof input==="object"&&!Array.isArray(input)?input:{};
  const hasSchema=Object.prototype.hasOwnProperty.call(raw,"schemaVersion");
  const parsed=Number(raw.schemaVersion);
  const sourceSchema=hasSchema&&Number.isInteger(parsed)&&parsed>=0?parsed:LEGACY_SCHEMA_VERSION_V68;
  let next={...raw};
  if(sourceSchema<2){
    next={
      ...next,
      mine:{...(next.mine||{})}, tools:{...(next.tools||{})}, buildings:{...(next.buildings||{})}, buildingCounts:{...(next.buildingCounts||{})},
      bundleItems:{...(next.bundleItems||{})}, factClaimsV68:{...(next.factClaimsV68||{})}
    };
    const milestones=Array.isArray(next.milestones)?next.milestones:[];
    const rooms=new Set(Array.isArray(next.bundleDone)?next.bundleDone:[]);
    const joja=new Set(Array.isArray(next.jojaProjectsV28)?next.jojaProjectsV28:[]);
    let route=currentRouteFromStateV68(next);
    if(!route){
      const ccProgress=rooms.size>0||Object.values(next.bundleItems||{}).some(v=>Array.isArray(v)&&v.length>0);
      const jojaProgress=Boolean(next.jojaMemberV28)||joja.size>0;
      if(ccProgress&&!jojaProgress)route="cc";
      else if(jojaProgress&&!ccProgress)route="joja";
      if(route)next.communityRouteV28=route;
    }
    const addClaim=(id,source)=>{
      const set=new Set(factClaimSourcesFromStateV68(next,id));set.add(source);
      next.factClaimsV68={...(next.factClaimsV68||{}),[id]:[...set]};
    };
    for(const id of milestones.filter(x=>LINKED_MILESTONES_V68.has(x))){
      const mapped=LINKED_ROUTE_FACTS_V68[id];
      if(mapped){
        if(route==="cc")rooms.add(mapped.room);
        else if(route==="joja"){joja.add(mapped.joja);next.jojaMemberV28=true;}
        else addClaim(id,"legacy-milestone");
      }else if(id==="mine120"){
        next.mine.normal=Math.max(120,Number(next.mine.normal||0));
      }else if(id==="horse"){
        next=withStableCountV68(next,Math.max(1,buildingCountFromStateV68(next,"stable")));
      }else if(id==="cc"){
        if(route==="cc")BUNDLE_ROOMS.forEach(r=>rooms.add(r.id));
        else addClaim(id,"legacy-milestone");
      }
    }
    if(buildingCountFromStateV68(next,"greenhouse")>0)addClaim("greenhouse","farm");
    if(walletHasSkullKeyV68(next))next.mine.normal=Math.max(120,Number(next.mine.normal||0));
    const skullAliases=new Set(["skull_key","骷髏鑰匙","头骨钥匙"]);
    next.wallet=(Array.isArray(next.wallet)?next.wallet:[]).filter(x=>!skullAliases.has(x));
    next.milestones=milestones.filter(x=>!LINKED_MILESTONES_V68.has(x));
    next.bundleDone=[...rooms];
    next.jojaProjectsV28=[...joja];
    const counts={...(next.buildingCounts||{})};delete counts.greenhouse;next.buildingCounts=counts;
    next.buildings={...(next.buildings||{}),other:(next.buildings?.other||[]).filter(name=>!BUILDING_OTHER_NAMES_V68.greenhouse.includes(name))};
  }
  const claims={};
  for(const [id,sources] of Object.entries(next.factClaimsV68||{})){
    if(Array.isArray(sources)){
      const clean=[...new Set(sources.filter(x=>typeof x==="string"&&x))];
      if(clean.length)claims[id]=clean;
    }
  }
  next.factClaimsV68=claims;
  next.schemaVersion=sourceSchema>SAVE_SCHEMA_VERSION_V68?sourceSchema:SAVE_SCHEMA_VERSION_V68;
  return normalizeWardrobeProgressV38({...PREFILL,...next,schemaVersion:next.schemaVersion});
}'''
replace_once(old_normalizer,new_normalizer,'save normalizer')
app=app.replace('normalizeSaveV67(', 'normalizeSaveV68(')

# 4) Central linked-fact actions before the power helpers.
actions=r'''
  const progressFactV68 = id => progressFactDoneFromStateV68(data,id);
  const factClaimSourcesV68 = id => factClaimSourcesFromStateV68(data,id);
  const setFactClaimV68 = (id,source,on) => setData(d=>withFactClaimV68(d,id,source,on));
  const factSourceLabelV68 = id => {
    const route=currentRouteFromStateV68(data);
    if(routeFactDoneFromStateV68(data,id))return route==="cc"?"由社区中心聯動":"由 Joja 工程聯動";
    if(id==="greenhouse"&&factClaimSourcesV68(id).includes("farm"))return "由農場溫室記錄";
    if(id==="mine120"&&Number(data.mine?.normal||0)>=120)return "由礦井進度聯動";
    if(id==="horse"&&buildingCountFromStateV68(data,"stable")>0)return "由马厩聯動";
    if(id==="panning"&&data.tools?.pan&&data.tools.pan!=="未取得")return "由淘金盤聯動";
    if(id==="cc"&&currentRouteFromStateV68(data)==="cc"&&BUNDLE_ROOMS.every(r=>roomDoneFromStateV68(data,r.id)))return "由社区中心房間聯動";
    if(factClaimSourcesV68(id).includes("legacy-milestone"))return "由舊里程碑保留";
    return "進度聯動";
  };
  const goChooseRouteV68 = () => {
    alert("這項進度要先知道你走社区中心還是 Joja 路線；已幫你切到城鎮修復頁選擇路線。");
    setDataSection("bundles");setBundleRoom("");window.scrollTo({top:0,left:0,behavior:"auto"});
  };
  const removeLegacyClaimIfOnlySourceV68 = id => {
    const candidate=withFactClaimV68(data,id,"legacy-milestone",false);
    if(!progressFactDoneFromStateV68(candidate,id)){setData(candidate);return true;}
    return false;
  };
  const setLinkedMilestoneV68 = (id,on) => {
    if(!on){
      if(removeLegacyClaimIfOnlySourceV68(id))return;
      alert(`「${MILESTONES.find(m=>m.id===id)?.name||id}」目前是由其他實際進度自動成立；請到對應的社区中心／Joja／農場／礦井記錄修正來源。`);
      return;
    }
    if(id==="mine120"){
      setData(d=>({...d,mine:{...(d.mine||{}),normal:Math.max(120,Number(d.mine?.normal||0))},wallet:(d.wallet||[]).filter(x=>!["skull_key","骷髏鑰匙","头骨钥匙"].includes(x))}));
      return;
    }
    if(id==="horse"){
      setData(d=>withStableCountV68(d,Math.max(1,buildingCountFromStateV68(d,"stable"))));
      return;
    }
    if(id==="cc"){
      const route=currentRouteFromStateV68(data);
      if(route==="joja"){alert("目前存檔選的是 Joja 路線，不能把「社区中心完成」當成同一路線的完成事件。");return;}
      if(!route){
        if(!window.confirm("「社区中心完成」代表這個存檔走社区中心路線。要切成社区中心路線並標記六個房間完成嗎？"))return;
      }
      setData(d=>({...d,communityRouteV28:"cc",bundleDone:[...new Set([...(d.bundleDone||[]),...BUNDLE_ROOMS.map(r=>r.id)])]}));
      return;
    }
    const mapped=LINKED_ROUTE_FACTS_V68[id];
    if(mapped){
      const route=currentRouteFromStateV68(data);
      if(!route){goChooseRouteV68();return;}
      setData(d=>route==="cc"
        ? {...d,bundleDone:[...new Set([...(d.bundleDone||[]),mapped.room])]}
        : {...d,jojaMemberV28:true,jojaProjectsV28:[...new Set([...(d.jojaProjectsV28||[]),mapped.joja])]});
      return;
    }
  };

'''
replace_once('  const powerBucketV54 = kind => kind === "special" ? "wallet" : kind === "books" ? "abilities" : "mastery";\n',actions+'  const powerBucketV54 = kind => kind === "special" ? "wallet" : kind === "books" ? "abilities" : "mastery";\n','linked actions')

# 5) Skull Key and achievements derive from canonical facts.
replace_once(
'''  const isPowerChecked = (kind, it) => {\n    const values = powerValuesV54(kind);''',
'''  const isPowerChecked = (kind, it) => {\n    if(kind==="special"&&it?.id==="skull_key")return progressFactV68("mine120");\n    const values = powerValuesV54(kind);''',
'skull derived check')
replace_once(
'''  const togglePower = (kind, it) => {\n    const key = powerBucketV54(kind);''',
'''  const togglePower = (kind, it) => {\n    if(kind==="special"&&it?.id==="skull_key"){setLinkedMilestoneV68("mine120",!progressFactV68("mine120"));return;}\n    const key = powerBucketV54(kind);''',
'skull linked toggle')
app=app.replace('case "locallegend": return BUNDLE_ROOMS.every(r => (data.bundleDone || []).includes(r.id));','case "locallegend": return currentRouteFromStateV68(data)==="cc" && BUNDLE_ROOMS.every(r => roomDoneFromStateV68(data,r.id));')

# 6) Room completion is derived from explicit room mark OR all bundle requirements.
replace_once(
'''  const roomDone = (room) => data.bundleDone.includes(room.id);\n  const toggleRoom = (id, done) => update({ bundleDone: done ? [...new Set([...data.bundleDone, id])] : data.bundleDone.filter(x => x !== id) });\n  const roomProgress = () => {\n    const done = BUNDLE_ROOMS.reduce((s, r) => s + (roomDone(r) ? r.bundles.length : r.bundles.filter(b => {\n      const got = (data.bundleItems[b.id] || []).length;\n      return got >= (b.need || b.items.length);\n    }).length), 0);''',
'''  const roomDone = (room) => roomDoneFromStateV68(data,room.id);\n  const roomExplicitDoneV68 = (room) => roomExplicitDoneFromStateV68(data,room.id);\n  const toggleRoom = (id, done) => update({ bundleDone: done ? [...new Set([...(data.bundleDone||[]), id])] : (data.bundleDone||[]).filter(x => x !== id) });\n  const roomProgress = () => {\n    const done = BUNDLE_ROOMS.reduce((s, r) => s + (roomDone(r) ? r.bundles.length : r.bundles.filter(b => {\n      const items=bundleItemsFromStateV68(data,b);\n      const got = (data.bundleItems?.[b.id] || []).filter(x=>items.includes(x)).length;\n      return got >= bundleNeedFromStateV68(data,b);\n    }).length), 0);''',
'room completion helpers')

# 7) Milestones become views over linked facts rather than duplicate booleans.
old_milestone='{MILESTONES.map(m => <CheckRow key={m.id} checked={data.milestones.includes(m.id)} onChange={v => update({ milestones: v ? [...new Set([...data.milestones, m.id])] : data.milestones.filter(x => x !== m.id) })} sub={m.desc}>{m.name}</CheckRow>)}'
new_milestone='{MILESTONES.map(m => {const linked=LINKED_MILESTONES_V68.has(m.id),checked=linked?progressFactV68(m.id):(data.milestones||[]).includes(m.id),source=linked&&checked?factSourceLabelV68(m.id):"";return <CheckRow key={m.id} checked={checked} onChange={v => linked?setLinkedMilestoneV68(m.id,v):update({ milestones: v ? [...new Set([...(data.milestones||[]), m.id])] : (data.milestones||[]).filter(x => x !== m.id) })} sub={`${m.desc}${source?` · ${source}`:""}`}>{m.name}</CheckRow>})}'
replace_once(old_milestone,new_milestone,'milestone renderer')

# 8) Panning unlock derives from room/Joja/tool evidence.
app=app.replace('const panLevel=data.tools?.pan||((data.milestones||[]).includes("panning")?"銅":"未取得");','const panLevel=data.tools?.pan||(progressFactV68("panning")?"銅":"未取得");')

# 9) Farm greenhouse becomes a canonical fact claim and never back-propagates route history.
replace_once(
'    const otherMap={well:"水井",mill:"磨坊",stable:"馬廄",slime:"史萊姆窩",cabin:"連線小屋",greenhouse:"溫室",junimo:"祝尼魔小屋"};\n',
'    const otherMap={well:"水井",mill:"磨坊",stable:"馬廄",slime:"史萊姆窩",cabin:"連線小屋",greenhouse:"溫室",junimo:"祝尼魔小屋"};\n    const greenhouseDoneV68=progressFactV68("greenhouse");\n    const greenhouseFarmClaimV68=factClaimSourcesV68("greenhouse").includes("farm");\n',
'farm greenhouse state')
old_greenhouse='<button onClick={()=>setBuildingCount("greenhouse",buildingCount("greenhouse")?0:1)} style={{border:`1.5px solid ${buildingCount("greenhouse")?C.green:C.line}`,background:buildingCount("greenhouse")?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center",cursor:"pointer"}}><BuildingImage file="Greenhouse" active={buildingCount("greenhouse")>0}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>溫室</div><div style={{fontSize:8,color:buildingCount("greenhouse")?C.green:C.muted,fontWeight:950,marginTop:3}}>{buildingCount("greenhouse")?"✓ 已建造":"○ 未建造"}</div></button>'
new_greenhouse='<button onClick={()=>{if(greenhouseFarmClaimV68)setFactClaimV68("greenhouse","farm",false);else if(greenhouseDoneV68)alert("溫室目前由城鎮修復進度自動成立；若要修正，請到社区中心／Joja 的來源記錄調整。");else setFactClaimV68("greenhouse","farm",true)}} style={{border:`1.5px solid ${greenhouseDoneV68?C.green:C.line}`,background:greenhouseDoneV68?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center",cursor:"pointer"}}><BuildingImage file="Greenhouse" active={greenhouseDoneV68}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>溫室</div><div style={{fontSize:8,color:greenhouseDoneV68?C.green:C.muted,fontWeight:950,marginTop:3}}>{greenhouseDoneV68?"✓ 已建造":"○ 未建造"}</div>{greenhouseDoneV68&&!greenhouseFarmClaimV68&&<div style={{fontSize:6.6,color:C.muted,marginTop:1}}>由進度聯動</div>}</button>'
replace_once(old_greenhouse,new_greenhouse,'greenhouse tile')
app=app.replace('可建造多座的建築用 ± 調整數量，溫室則直接記錄是否已建造。','可建造多座的建築用 ± 調整數量；溫室顯示實際解鎖狀態，手動標記不會反推收集包或 Joja 工程。')

# 10) Joja no longer inherits preserved Community Center room records after route switching.
old_joja='JOJA_PROJECTS_V28.map(j=>{const inherited=(data.bundleDone||[]).includes(j.room),on=inherited||jojaDone.includes(j.id),locked=!data.jojaMemberV28&&!on;return <button key={j.id} disabled={inherited||locked} onClick={()=>update({jojaProjectsV28:on?jojaDone.filter(x=>x!==j.id):[...jojaDone,j.id]})} style={{border:`2px solid ${on?C.green:C.line}`,background:on?"#EAF4D8":locked?"#E5E1D8":C.paper,borderRadius:10,padding:8,textAlign:"left",cursor:inherited||locked?"default":"pointer",filter:locked?"grayscale(.9)":"none",opacity:inherited?.75:locked?.62:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file={j.file} size={32}/><div style={{minWidth:0}}><b style={{fontSize:10,color:on?C.green:C.ink}}>{on?"✓ ":""}{j.name}</b><div style={{fontSize:9,fontWeight:950,color:C.orange,marginTop:1}}>{j.cost.toLocaleString()}g</div></div></div><div style={{fontSize:7.8,color:C.muted,lineHeight:1.35,marginTop:4}}>{inherited?"此項已由社區中心房間完成。":j.desc}</div></button>})'
new_joja='JOJA_PROJECTS_V28.map(j=>{const on=jojaDone.includes(j.id),locked=!data.jojaMemberV28&&!on;return <button key={j.id} disabled={locked} onClick={()=>update({jojaProjectsV28:on?jojaDone.filter(x=>x!==j.id):[...jojaDone,j.id]})} style={{border:`2px solid ${on?C.green:C.line}`,background:on?"#EAF4D8":locked?"#E5E1D8":C.paper,borderRadius:10,padding:8,textAlign:"left",cursor:locked?"default":"pointer",filter:locked?"grayscale(.9)":"none",opacity:locked?.62:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file={j.file} size={32}/><div style={{minWidth:0}}><b style={{fontSize:10,color:on?C.green:C.ink}}>{on?"✓ ":""}{j.name}</b><div style={{fontSize:9,fontWeight:950,color:C.orange,marginTop:1}}>{j.cost.toLocaleString()}g</div></div></div><div style={{fontSize:7.8,color:C.muted,lineHeight:1.35,marginTop:4}}>{j.desc}</div></button>})'
replace_once(old_joja,new_joja,'joja route isolation')

# 11) The room unlock card itself is the completion control; remove the redundant bottom button.
old_unlock='{showRoomV51&&ROOM_UNLOCKS_V28[room.id]&&<Card style={{marginTop:8,padding:7,background:"#F1EAD3"}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={ROOM_UNLOCKS_V28[room.id].file} size={30}/><div><b style={{fontSize:10.5,color:C.darkBrown}}>整室完成：{ROOM_UNLOCKS_V28[room.id].name}</b><div style={{fontSize:8,color:C.muted,marginTop:1}}>{ROOM_UNLOCKS_V28[room.id].desc}</div></div></div></Card>}'
new_unlock='{showRoomV51&&ROOM_UNLOCKS_V28[room.id]&&(()=>{const unlock=ROOM_UNLOCKS_V28[room.id],explicit=roomExplicitDoneV68(room),itemsDone=roomItemsCompleteFromStateV68(data,room.id),done=roomDone(room);return <button type="button" onClick={()=>{if(explicit){if(window.confirm(`取消「${room.name}」整室完成標記嗎？\\n已逐項勾選的收集包物品會保留。`))toggleRoom(room.id,false)}else if(itemsDone){alert("這個房間已由下方收集包逐項完成；若要修正，直接取消對應物品即可。")}else toggleRoom(room.id,true)}} style={{width:"100%",marginTop:8,padding:7,border:`2px solid ${done?C.green:C.line}`,borderRadius:10,background:done?"#EAF4D8":"#F1EAD3",textAlign:"left",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file={unlock.file} size={30}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:10.5,color:done?C.green:C.darkBrown}}>{done?`✓ 整室完成 · ${unlock.name}`:`整室完成：${unlock.name}`}</b><div style={{fontSize:8,color:C.muted,marginTop:1}}>{done?(itemsDone&&!explicit?"收集包已全部完成；進度已自動聯動。":"已標記整室完成；點卡片可取消整室標記。"):`${unlock.desc} · 點此直接標記整室完成`}</div></div></div></button>})()}'
replace_once(old_unlock,new_unlock,'room unlock card')
old_bottom='<div style={{marginTop:8,display:showRoomV51?"block":"none"}}><button onClick={()=>toggleRoom(room.id,!roomDone(room))} style={{width:"100%",border:`1.5px solid ${roomDone(room)?C.green:C.line}`,background:roomDone(room)?C.lightGreen:C.cream,borderRadius:8,padding:7,fontWeight:950,color:roomDone(room)?C.green:C.brown,fontSize:9.5}}>{roomDone(room)?"✓ 整室完成":"標記整室完成"}</button></div>\n'
replace_once(old_bottom,'','redundant bottom room control')

# 12) Explicit room marks disable detail; automatically completed rooms remain editable for corrections.
app=app.replace('const checked=roomDone(room)||gotRaw.includes(it)', 'const checked=roomDone(room)||gotRaw.includes(it)')
app=app.replace('disabled={roomDone(room)} onClick={()=>updateNested("bundleItems"', 'disabled={roomExplicitDoneV68(room)} onClick={()=>updateNested("bundleItems"')
app=app.replace('cursor:roomDone(room)?"default":"pointer",opacity:roomDone(room)?.78:1', 'cursor:roomExplicitDoneV68(room)?"default":"pointer",opacity:roomExplicitDoneV68(room)?.78:1')

# 13) Cache/version bump.
app_path.write_text(app)

idx_path=Path('index.html');idx=idx_path.read_text().replace('?v=67','?v=68').replace('deploy-v67','deploy-v68');idx_path.write_text(idx)
sw_path=Path('sw.js');sw=sw_path.read_text().replace("const CACHE='stardew-tracker-v67';","const CACHE='stardew-tracker-v68';");sw_path.write_text(sw)

# 14) Permanent v68 audit and build wiring.
audit=Path('scripts/audit-progress-link-v68.py')
audit.write_text(r'''from pathlib import Path
import re

def fail(msg): raise SystemExit(msg)
t=Path('app.jsx').read_text()
need=[
 'const SAVE_SCHEMA_VERSION_V68 = 2;', 'factClaimsV68: {}', 'function normalizeSaveV68(input)',
 'LINKED_ROUTE_FACTS_V68', 'LINKED_MILESTONES_V68', 'progressFactDoneFromStateV68', 'setLinkedMilestoneV68',
 'roomItemsCompleteFromStateV68', 'roomExplicitDoneFromStateV68', '點此直接標記整室完成',
 'progressFactV68("panning")', 'it?.id==="skull_key"', 'greenhouseFarmClaimV68'
]
missing=[x for x in need if x not in t]
if missing: fail('v68 progress-link invariant missing: '+repr(missing))
for bad in ['normalizeSaveV67(', 'SAVE_SCHEMA_VERSION_V67', 'setBuildingCount("greenhouse"', 'inherited=(data.bundleDone||[]).includes(j.room)']:
 if bad in t: fail('v68 stale duplicate/source behavior remains: '+bad)
if re.search(r'<div style=\{\{marginTop:8,display:showRoomV51\?"block":"none"\}\}><button[^>]+>\{roomDone\(room\)\?"✓ 整室完成":"標記整室完成"\}',t):
 fail('redundant bottom room completion control remains')
idx=Path('index.html').read_text()
if '?v=68' not in idx or 'deploy-v68' not in idx: fail('v68 index version bump missing')
if "const CACHE='stardew-tracker-v68';" not in Path('sw.js').read_text(): fail('v68 service worker cache bump missing')
print('v68 progress linking audit passed')
''')

for path in ['build-cloudflare.sh','.github/workflows/pages.yml']:
    p=Path(path);s=p.read_text()
    anchor='python3 scripts/audit-foundation-v67.py\n'
    if anchor not in s: raise SystemExit(f'foundation audit anchor missing in {path}')
    if 'audit-progress-link-v68.py' not in s:s=s.replace(anchor,anchor+'python3 scripts/audit-progress-link-v68.py\n',1) if path=='build-cloudflare.sh' else s.replace(anchor,anchor+'          python3 scripts/audit-progress-link-v68.py\n',1)
    p.write_text(s)

# Update the older foundation audit to follow the current schema normalizer.
p=Path('scripts/audit-foundation-v67.py');s=p.read_text()
s=s.replace("'const SAVE_SCHEMA_VERSION_V67 = 1;'","'const SAVE_SCHEMA_VERSION_V68 = 2;'")
s=s.replace("'schemaVersion: SAVE_SCHEMA_VERSION_V67'","'schemaVersion: SAVE_SCHEMA_VERSION_V68'")
s=s.replace("'function normalizeSaveV67(input)'","'function normalizeSaveV68(input)'")
s=s.replace("'setData(normalizeSaveV67(parsed))'","'setData(normalizeSaveV68(parsed))'")
s=s.replace("'normalizeSaveV67(JSON.parse(raw))'","'normalizeSaveV68(JSON.parse(raw))'")
p.write_text(s)
print('v68 transform complete')
