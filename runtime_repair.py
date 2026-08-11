from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# Add second-level farm navigation state.
state='  const [dataSection, setDataSection] = useState("farm");'
state_new='  const [dataSection, setDataSection] = useState("farm");\n  const [farmSection, setFarmSection] = useState("animals");'
if state_new not in s:
    if state not in s:
        raise SystemExit('data section state marker missing')
    s=s.replace(state,state_new,1)

# Replace the entire farm view with a four-tab icon layout.
start=s.index('  const renderFarm = () => {')
end=s.index('  const renderData = () => <div>', start)
new_farm=r'''  const renderFarm = () => {
    const otherBuildings=data.buildings?.other||[];
    const setAnimalCount=(name,value)=>updateNested("animals",{[name]:Math.max(0,Math.min(99,value))});
    const toggleOther=name=>updateNested("buildings",{other:otherBuildings.includes(name)?otherBuildings.filter(x=>x!==name):[...otherBuildings,name]});
    const changeBuildingCount=(key,delta)=>updateNested("buildings",{[key]:Math.max(0,Number(data.buildings?.[key]||0)+delta)});
    const cycleLevel=(key,levels)=>updateNested("buildings",{[key]:(Number(data.buildings?.[key]||0)+1)%levels.length});
    const houseFiles=["House (tier 1)","House (tier 2)","House (tier 3)","House (tier 3)"];
    const toolFiles={
      watering:{"初始":"Watering Can","銅":"Copper Watering Can","鋼":"Steel Watering Can","金":"Gold Watering Can","銥":"Iridium Watering Can"},
      pickaxe:{"初始":"Pickaxe","銅":"Copper Pickaxe","鋼":"Steel Pickaxe","金":"Gold Pickaxe","銥":"Iridium Pickaxe"},
      axe:{"初始":"Axe","銅":"Copper Axe","鋼":"Steel Axe","金":"Gold Axe","銥":"Iridium Axe"},
      hoe:{"初始":"Hoe","銅":"Copper Hoe","鋼":"Steel Hoe","金":"Gold Hoe","銥":"Iridium Hoe"},
      trash:{"初始":"Garbage Can","銅":"Trash Can Copper","鋼":"Trash Can Steel","金":"Trash Can Gold","銥":"Trash Can Iridium"}
    };
    const coopFiles=["Coop","Coop","Big Coop","Deluxe Coop"];
    const barnFiles=["Barn","Barn","Big Barn","Deluxe Barn"];
    const FarmTab=({id,label,file})=>{const active=farmSection===id;return <button onClick={()=>setFarmSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"6px 3px 5px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0,boxShadow:active?`0 2px 5px ${C.shadow}`:"none"}}><GameIcon file={file} size={36}/><span style={{fontSize:9.5,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    const AnimalGrid=({items})=><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5}}>{items.map(a=>{const n=Number(data.animals?.[a.name]||0);return <div key={a.name} style={{border:`1.5px solid ${n>0?C.green:C.line}`,background:n>0?"#EEF7DD":C.paper,borderRadius:9,padding:"5px 2px 4px",textAlign:"center",minWidth:0}}><GameIcon file={ANIMAL_ICON_FILES[a.name]} size={31}/><div style={{fontSize:8.8,fontWeight:950,color:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.name}</div><div style={{display:"grid",gridTemplateColumns:"20px 1fr 20px",alignItems:"center",gap:1,marginTop:3}}><button onClick={()=>setAnimalCount(a.name,n-1)} style={{border:0,background:C.cream,borderRadius:6,height:20,fontSize:12,fontWeight:950,color:C.brown,padding:0}}>−</button><span style={{fontSize:10.5,fontWeight:950,color:n?C.green:C.muted}}>{n}</span><button onClick={()=>setAnimalCount(a.name,n+1)} style={{border:0,background:C.cream,borderRadius:6,height:20,fontSize:12,fontWeight:950,color:C.brown,padding:0}}>＋</button></div></div>})}</div>;
    const BuildingImage=({file,active=true})=><img src={GAME_FILE(file)} alt="" loading="lazy" onError={e=>{e.currentTarget.style.visibility="hidden"}} style={{width:"100%",height:56,objectFit:"contain",imageRendering:"pixelated",filter:active?"none":"grayscale(1)",opacity:active?1:.35}}/>;
    const CountTile=({name,file,count,onMinus,onPlus})=><div style={{border:`1.5px solid ${count>0?C.green:C.line}`,background:count>0?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center"}}><BuildingImage file={file} active={count>0}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>{name}</div><div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",gap:2,alignItems:"center",marginTop:4}}><button onClick={onMinus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10.5,color:count>0?C.green:C.muted}}>×{count}</b><button onClick={onPlus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button></div></div>;
    const ToggleTile=({name,file,keyName})=>{const active=otherBuildings.includes(keyName);return <button onClick={()=>toggleOther(keyName)} style={{border:`1.5px solid ${active?C.green:C.line}`,background:active?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center",cursor:"pointer",minWidth:0}}><BuildingImage file={file} active={active}/><div style={{fontSize:9,fontWeight:950,color:active?C.green:C.muted,lineHeight:1.1}}>{name}</div><div style={{fontSize:8,color:active?C.green:C.muted,marginTop:2,fontWeight:900}}>{active?"✓ 已有":"○ 未建"}</div></button>};
    return <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:8}}>
        <FarmTab id="animals" label="動物" file="Animals Tab"/>
        <FarmTab id="house" label="農舍" file={houseFiles[Number(data.house||0)]||"House (tier 1)"}/>
        <FarmTab id="tools" label="工具" file={toolFiles.pickaxe?.[data.tools?.pickaxe||"初始"]||"Pickaxe"}/>
        <FarmTab id="buildings" label="建築" file="Silo"/>
      </div>

      {farmSection==="animals"&&<>
        <SectionTitle icon="🐔">動物</SectionTitle>
        <Card style={{padding:8}}>
          <div style={{fontSize:10,fontWeight:950,color:C.brown,marginBottom:5}}>雞舍</div><AnimalGrid items={COOP_ANIMALS}/>
          <div style={{borderTop:`1px dashed ${C.line}`,margin:"8px 0 6px"}}></div>
          <div style={{fontSize:10,fontWeight:950,color:C.brown,marginBottom:5}}>牲口棚</div><AnimalGrid items={BARN_ANIMALS}/>
        </Card>
        <SectionTitle icon="🐟" right={`${(data.ponds||[]).length} 座`}>魚塘</SectionTitle>
        <Card style={{padding:7}}><div style={{display:"grid",gap:4}}>{(data.ponds||[]).map((p,i)=>{const fishIndex=COLLECTIONS.fish.items.indexOf(p.fish),open=pondPicker===i;return <div key={i} style={{border:`1.5px solid ${open?C.orange:C.line}`,borderRadius:9,overflow:"hidden",background:open?"#FFF8E2":C.paper}}><button onClick={()=>setPondPicker(open?null:i)} style={{width:"100%",border:0,background:"transparent",padding:"6px 8px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer"}}>{fishIndex>=0?<img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:29,height:29,imageRendering:"pixelated",objectFit:"contain",flex:"0 0 auto"}}/>:<GameIcon file="Fish Pond" size={29}/>}<span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:11.5,color:C.ink}}>{p.fish||"未選魚種"}</b>{p.need&&<span style={{display:"block",fontSize:8.5,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.need}</span>}</span><span style={{fontSize:10.5,fontWeight:950,color:C.brown,background:C.cream,borderRadius:8,padding:"3px 6px"}}>{Number(p.count||0)}/{Number(p.cap||0)}</span><span style={{fontSize:10,color:C.brown,fontWeight:950}}>{open?"▲":"▼"}</span></button>{open&&<div style={{padding:"7px 8px 8px",borderTop:`1px dashed ${C.line}`}}><div style={{fontSize:9,fontWeight:950,color:C.muted,marginBottom:4}}>魚種｜左右滑動選擇</div><div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:5,WebkitOverflowScrolling:"touch"}}>{COLLECTIONS.fish.items.map((name,fi)=>{const on=name===p.fish;return <button key={`${i}-${name}`} onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,fish:name};update({ponds})}} style={{flex:"0 0 56px",border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.paper,borderRadius:8,padding:"4px 2px",minHeight:56,cursor:"pointer"}}><img src={ICON_URLS.fish[fi]} alt="" loading="lazy" style={{width:27,height:27,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:7.5,fontWeight:900,color:C.ink,lineHeight:1.05}}>{name}</div></button>})}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:4}}><label style={{fontSize:9,fontWeight:900,color:C.muted}}>目前數量<div style={{marginTop:2}}><NumInput value={p.count} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,count:v};update({ponds})}} suffix="隻"/></div></label><label style={{fontSize:9,fontWeight:900,color:C.muted}}>容量上限<div style={{marginTop:2}}><NumInput value={p.cap} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,cap:v};update({ponds})}} suffix="隻"/></div></label></div><label style={{display:"block",fontSize:9,fontWeight:900,color:C.muted,marginTop:5}}>下一次擴容需求<input value={p.need||""} onChange={e=>{const ponds=[...data.ponds];ponds[i]={...p,need:e.target.value};update({ponds})}} placeholder="例：萬象晶球 ×3" style={{width:"100%",marginTop:2,border:`1.5px solid ${C.line}`,borderRadius:7,padding:5,fontSize:10,background:"#FFFCF0"}}/></label><button onClick={()=>{setPondPicker(null);const ponds=data.ponds.filter((_,j)=>j!==i);update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}})}} style={{marginTop:5,border:0,background:"transparent",color:C.red,fontSize:9.5,fontWeight:900,padding:0}}>刪除這座魚塘</button></div>}</div>})}</div></Card>
        <button onClick={()=>{const i=(data.ponds||[]).length;const ponds=[...(data.ponds||[]),{fish:"",count:0,cap:3,need:""}];update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}});setPondPicker(i)}} style={{marginTop:6,width:"100%",border:`1.5px dashed ${C.line}`,background:C.cream,borderRadius:9,padding:7,fontWeight:900,color:C.brown,fontSize:10.5}}>＋ 新增魚塘</button>
      </>}

      {farmSection==="house"&&<>
        <SectionTitle icon="🏠">農舍</SectionTitle>
        <Card style={{padding:8}}><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7}}>{HOUSE_LEVELS.map((label,i)=>{const active=Number(data.house||0)===i;return <button key={label} onClick={()=>update({house:i})} style={{border:`2px solid ${active?C.green:C.line}`,background:active?"#EEF7DD":C.paper,borderRadius:10,padding:"7px 5px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer"}}><GameIcon file={houseFiles[i]||"House (tier 3)"} size={42}/><span style={{fontSize:10,fontWeight:950,color:active?C.green:C.ink,lineHeight:1.25}}>{active?"✓ ":""}{label}</span></button>})}</div></Card>
      </>}

      {farmSection==="tools"&&<>
        <SectionTitle icon="🔧">工具</SectionTitle>
        <Card style={{padding:8}}><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5}}>{TOOL_NAMES.map(([id,name])=>{const level=data.tools?.[id]||"初始",idx=TOOL_LEVELS.indexOf(level);return <button key={id} onClick={()=>updateNested("tools",{[id]:TOOL_LEVELS[(idx+1)%TOOL_LEVELS.length]})} style={{border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"6px 2px",minWidth:0,cursor:"pointer"}}><GameIcon file={toolFiles[id]?.[level]||TOOL_ICON_FILES[id]} size={34}/><div style={{fontSize:8.3,fontWeight:950,color:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div><div style={{fontSize:8,color:C.green,fontWeight:950,marginTop:2}}>{level}</div></button>})}</div><div style={{fontSize:8.5,color:C.muted,marginTop:6,textAlign:"center"}}>點工具圖示依序切換初始 → 銅 → 鋼 → 金 → 銥</div></Card>
      </>}

      {farmSection==="buildings"&&<>
        <SectionTitle icon="🏗️">建築</SectionTitle>
        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>
          <button onClick={()=>cycleLevel("coop",COOP_LEVELS)} style={{border:`1.5px solid ${Number(data.buildings?.coop||0)>0?C.green:C.line}`,background:Number(data.buildings?.coop||0)>0?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",cursor:"pointer"}}><BuildingImage file={coopFiles[Number(data.buildings?.coop||0)]||"Coop"} active={Number(data.buildings?.coop||0)>0}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>雞舍</div><div style={{fontSize:8,color:C.green,fontWeight:900,marginTop:2}}>{COOP_LEVELS[Number(data.buildings?.coop||0)]}</div></button>
          <button onClick={()=>cycleLevel("barn",BARN_LEVELS)} style={{border:`1.5px solid ${Number(data.buildings?.barn||0)>0?C.green:C.line}`,background:Number(data.buildings?.barn||0)>0?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",cursor:"pointer"}}><BuildingImage file={barnFiles[Number(data.buildings?.barn||0)]||"Barn"} active={Number(data.buildings?.barn||0)>0}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>牲口棚</div><div style={{fontSize:8,color:C.green,fontWeight:900,marginTop:2}}>{BARN_LEVELS[Number(data.buildings?.barn||0)]}</div></button>
          <CountTile name="筒倉" file="Silo" count={Number(data.buildings?.silos||0)} onMinus={()=>changeBuildingCount("silos",-1)} onPlus={()=>changeBuildingCount("silos",1)}/>
          <CountTile name="小屋" file="Big Shed" count={Number(data.buildings?.sheds||0)} onMinus={()=>changeBuildingCount("sheds",-1)} onPlus={()=>changeBuildingCount("sheds",1)}/>
          <div style={{border:`1.5px solid ${(data.ponds||[]).length?C.green:C.line}`,background:(data.ponds||[]).length?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center"}}><BuildingImage file="Fish Pond" active={(data.ponds||[]).length>0}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>魚塘</div><div style={{fontSize:9,color:C.green,fontWeight:950,marginTop:3}}>×{(data.ponds||[]).length}</div></div>
          <ToggleTile name="水井" file="Well" keyName="水井"/><ToggleTile name="磨坊" file="Mill" keyName="磨坊"/><ToggleTile name="馬廄" file="Horse Stable" keyName="馬廄"/><ToggleTile name="史萊姆窩" file="Slime Hutch" keyName="史萊姆窩"/><ToggleTile name="連線小屋" file="Log Cabin Stage 1" keyName="連線小屋"/><ToggleTile name="溫室" file="Greenhouse" keyName="溫室"/>
        </div><div style={{fontSize:8.5,color:C.muted,marginTop:6,lineHeight:1.4}}>雞舍／牲口棚點圖切換等級；有數量的建築在圖案下方 ±；其他建築點圖點亮。</div></Card>
      </>}
    </div>;
  };

'''
s=s[:start]+new_farm+s[end:]

# Replace text-only Data pills with three Stardew icon tabs.
start=s.index('  const renderData = () => <div>')
end=s.index('  const renderPeople = () => {', start)
new_data=r'''  const renderData = () => {
    const tabs=[
      {id:"farm",label:"農場",file:"Animals Tab"},
      {id:"skills",label:"技能",file:"Skills Tab Icon"},
      {id:"bundles",label:"社區",file:"Golden Scroll"}
    ];
    return <div>
      <SectionTitle icon="📊">資料</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:7,marginTop:8}}>{tabs.map(t=>{const active=dataSection===t.id;return <button key={t.id} onClick={()=>setDataSection(t.id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:12,padding:"7px 4px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",boxShadow:active?`0 2px 5px ${C.shadow}`:"none"}}><GameIcon file={t.file} size={40}/><span style={{fontSize:10.5,fontWeight:950,color:active?C.darkBrown:C.muted}}>{t.label}</span></button>})}</div>
      {dataSection==="farm"&&renderFarm()}{dataSection==="skills"&&renderSkills()}{dataSection==="bundles"&&renderBundles()}
    </div>;
  };

'''
s=s[:start]+new_data+s[end:]

p.write_text(s,encoding='utf-8')
print('icon data tabs + farm subpages updated')
