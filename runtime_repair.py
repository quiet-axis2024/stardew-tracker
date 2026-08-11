from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

state='  const [dataSection, setDataSection] = useState("farm");'
state2='  const [dataSection, setDataSection] = useState("farm");\n  const [farmSection, setFarmSection] = useState("animals");'
if 'const [farmSection, setFarmSection]' not in s:
    if state not in s: raise SystemExit('farm section state marker missing')
    s=s.replace(state,state2,1)

start=s.index('  const renderFarm = () => {')
end=s.index('  const renderPeople = () => {',start)
new_block=r'''  const renderFarm = () => {
    const otherBuildings=data.buildings?.other||[];
    const houseFiles=["House (tier 1)","House (tier 2)","House (tier 3)","House (tier 3)"];
    const toolFiles={
      watering:{"初始":"Watering Can","銅":"Copper Watering Can","鋼":"Steel Watering Can","金":"Gold Watering Can","銥":"Iridium Watering Can"},
      pickaxe:{"初始":"Pickaxe","銅":"Copper Pickaxe","鋼":"Steel Pickaxe","金":"Gold Pickaxe","銥":"Iridium Pickaxe"},
      axe:{"初始":"Axe","銅":"Copper Axe","鋼":"Steel Axe","金":"Gold Axe","銥":"Iridium Axe"},
      hoe:{"初始":"Hoe","銅":"Copper Hoe","鋼":"Steel Hoe","金":"Gold Hoe","銥":"Iridium Hoe"},
      trash:{"初始":"Garbage Can","銅":"Trash Can Copper","鋼":"Trash Can Steel","金":"Trash Can Gold","銥":"Trash Can Iridium"}
    };
    const panLevels=["未取得","銅","鋼","金","銥"];
    const panFiles={"未取得":"Copper Pan","銅":"Copper Pan","鋼":"Steel Pan","金":"Gold Pan","銥":"Iridium Pan"};
    const panLevel=data.tools?.pan||((data.milestones||[]).includes("panning")?"銅":"未取得");
    const animalProducts={
      雞:[["Egg","蛋"],["Large Egg","大蛋"]],藍雞:[["Egg","蛋"],["Large Egg","大蛋"]],虛空雞:[["Void Egg","虛空蛋"]],金雞:[["Golden Egg","金蛋"]],
      鴨:[["Duck Egg","鴨蛋"],["Duck Feather","鴨毛"]],兔子:[["Wool","羊毛"],["Rabbit's Foot","兔腳"]],恐龍:[["Dinosaur Egg","恐龍蛋"]],
      牛:[["Milk","牛奶"],["Large Milk","大瓶牛奶"]],山羊:[["Goat Milk","羊奶"],["Large Goat Milk","大瓶羊奶"]],綿羊:[["Wool","羊毛"]],豬:[["Truffle","松露"]],鴕鳥:[["Ostrich Egg","鴕鳥蛋"]]
    };
    const machineDefs=[
      ["keg","小桶","Keg"],["jar","罐頭瓶","Preserves Jar"],["cheese","起司壓製機","Cheese Press"],["mayo","美乃滋機","Mayonnaise Machine"],
      ["loom","織布機","Loom"],["oil","產油機","Oil Maker"],["dehydrator","脫水機","Dehydrator"],["smoker","燻魚機","Fish Smoker"],
      ["seed","種子生產器","Seed Maker"],["furnace","熔爐","Furnace"],["recycling","回收機","Recycling Machine"],["crystalarium","寶石複製機","Crystalarium"],
      ["bee","蜂房","Bee House"],["cask","木桶","Cask"]
    ];
    const coopFiles=["Coop","Coop","Big Coop","Deluxe Coop"], barnFiles=["Barn","Barn","Big Barn","Deluxe Barn"];
    const otherMap={well:"水井",mill:"磨坊",stable:"馬廄",slime:"史萊姆窩",cabin:"連線小屋",greenhouse:"溫室",junimo:"祝尼魔小屋"};
    const buildingCount=key=>{
      const bc=data.buildingCounts||{}; if(bc[key]!=null)return Number(bc[key])||0;
      if(key==="coop")return Number(data.buildings?.coop||0)>0?1:0;
      if(key==="barn")return Number(data.buildings?.barn||0)>0?1:0;
      if(key==="silo")return Number(data.buildings?.silos||0);
      if(key==="shed")return Number(data.buildings?.sheds||0);
      return otherMap[key]&&otherBuildings.includes(otherMap[key])?1:0;
    };
    const setBuildingCount=(key,value)=>setData(d=>{
      const max=key==="greenhouse"?1:99, v=Math.max(0,Math.min(max,Number(value)||0));
      const buildingCounts={...(d.buildingCounts||{}),[key]:v}; const buildings={...(d.buildings||{})}; let other=[...(buildings.other||[])];
      if(key==="silo")buildings.silos=v; else if(key==="shed")buildings.sheds=v;
      else if(key==="coop"){if(v===0)buildings.coop=0;else if(!Number(buildings.coop||0))buildings.coop=1;}
      else if(key==="barn"){if(v===0)buildings.barn=0;else if(!Number(buildings.barn||0))buildings.barn=1;}
      else if(otherMap[key]){const name=otherMap[key];other=v>0?[...new Set([...other,name])]:other.filter(x=>x!==name);buildings.other=other;}
      return {...d,buildingCounts,buildings};
    });
    const setAnimalCount=(name,value)=>updateNested("animals",{[name]:Math.max(0,Math.min(99,value))});
    const setMachineCount=(key,value)=>update({machines:{...(data.machines||{}),[key]:Math.max(0,Math.min(999,Number(value)||0))}});
    const cycleLevel=(key,levels)=>updateNested("buildings",{[key]:(Number(data.buildings?.[key]||0)+1)%levels.length});
    const FarmTab=({id,label,file})=>{const active=farmSection===id;return <button onClick={()=>setFarmSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"6px 3px 5px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={35}/><span style={{fontSize:9.5,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    const ProductLine=({name})=>{const ps=animalProducts[name]||[];return <div style={{marginTop:3,minHeight:27}}><div style={{display:"flex",justifyContent:"center",gap:2}}>{ps.map(([file,label])=><span key={file} title={label}><GameIcon file={file} size={18} alt={label}/></span>)}</div><div style={{fontSize:6.8,color:C.muted,fontWeight:800,lineHeight:1.05,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ps.map(x=>x[1]).join("／")}</div></div>};
    const AnimalGrid=({items})=><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{items.map(a=>{const n=Number(data.animals?.[a.name]||0);return <div key={a.name} style={{border:`1.5px solid ${n>0?C.green:C.line}`,background:n>0?"#EEF7DD":C.paper,borderRadius:9,padding:"5px 3px",textAlign:"center",minWidth:0}}><GameIcon file={ANIMAL_ICON_FILES[a.name]} size={34}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>{a.name}</div><ProductLine name={a.name}/><div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",alignItems:"center",gap:2,marginTop:3}}><button onClick={()=>setAnimalCount(a.name,n-1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>−</button><b style={{fontSize:10.5,color:n?C.green:C.muted}}>{n}</b><button onClick={()=>setAnimalCount(a.name,n+1)} style={{border:0,background:C.cream,borderRadius:6,height:21,fontWeight:950,color:C.brown,padding:0}}>＋</button></div></div>})}</div>;
    const BuildingImage=({file,active=true})=><img src={GAME_FILE(file)} alt="" loading="lazy" onError={e=>{e.currentTarget.style.visibility="hidden"}} style={{width:"100%",height:54,objectFit:"contain",imageRendering:"pixelated",filter:active?"none":"grayscale(1)",opacity:active?1:.35}}/>;
    const CountTile=({name,file,count,onMinus,onPlus,sub})=><div style={{border:`1.5px solid ${count>0?C.green:C.line}`,background:count>0?"#EEF7DD":C.paper,borderRadius:10,padding:"5px 4px",textAlign:"center"}}><BuildingImage file={file} active={count>0}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>{name}</div>{sub&&<div style={{fontSize:7.5,color:C.muted,fontWeight:850,minHeight:10}}>{sub}</div>}<div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",gap:2,alignItems:"center",marginTop:4}}><button onClick={onMinus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10.5,color:count>0?C.green:C.muted}}>×{count}</b><button onClick={onPlus} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button></div></div>;
    const MachineTile=({id,name,file})=>{const n=Number(data.machines?.[id]||0);return <CountTile name={name} file={file} count={n} onMinus={()=>setMachineCount(id,n-1)} onPlus={()=>setMachineCount(id,n+1)}/>};
    return <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:8}}>
        <FarmTab id="animals" label="動物" file="Animals Tab"/>
        <FarmTab id="ponds" label="魚塘" file="Fish Pond"/>
        <FarmTab id="buildings" label="建築" file={houseFiles[Number(data.house||0)]||"House (tier 1)"}/>
        <FarmTab id="tools" label="工具" file={toolFiles.pickaxe?.[data.tools?.pickaxe||"初始"]||"Pickaxe"}/>
      </div>

      {farmSection==="animals"&&<>
        <SectionTitle icon="🐔">動物</SectionTitle>
        <Card style={{padding:8}}><div style={{fontSize:10,fontWeight:950,color:C.brown,marginBottom:5}}>雞舍</div><AnimalGrid items={COOP_ANIMALS}/><div style={{borderTop:`1px dashed ${C.line}`,margin:"8px 0 6px"}}></div><div style={{fontSize:10,fontWeight:950,color:C.brown,marginBottom:5}}>牲口棚</div><AnimalGrid items={BARN_ANIMALS}/></Card>
        <div style={{fontSize:8.5,color:C.muted,marginTop:5,lineHeight:1.4}}>產物列顯示成年動物可能產出的主要物品；大型產物仍會受好感、心情等條件影響。</div>
      </>}

      {farmSection==="ponds"&&<>
        <SectionTitle icon="🐟" right={`${(data.ponds||[]).length} 座`}>魚塘</SectionTitle>
        <Card style={{padding:7}}><div style={{display:"grid",gap:4}}>{(data.ponds||[]).map((p,i)=>{const fishIndex=COLLECTIONS.fish.items.indexOf(p.fish),open=pondPicker===i;return <div key={i} style={{border:`1.5px solid ${open?C.orange:C.line}`,borderRadius:9,overflow:"hidden",background:open?"#FFF8E2":C.paper}}><button onClick={()=>setPondPicker(open?null:i)} style={{width:"100%",border:0,background:"transparent",padding:"6px 8px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer"}}>{fishIndex>=0?<img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:30,height:30,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file="Fish Pond" size={30}/>}<span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:11.5,color:C.ink}}>{p.fish||"未選魚種"}</b>{p.need&&<span style={{display:"block",fontSize:8.5,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.need}</span>}</span><span style={{fontSize:10.5,fontWeight:950,color:C.brown,background:C.cream,borderRadius:8,padding:"3px 6px"}}>{Number(p.count||0)}/{Number(p.cap||0)}</span><span style={{fontSize:10,color:C.brown,fontWeight:950}}>{open?"▲":"▼"}</span></button>{open&&<div style={{padding:"7px 8px 8px",borderTop:`1px dashed ${C.line}`}}><div style={{fontSize:9,fontWeight:950,color:C.muted,marginBottom:4}}>魚種｜左右滑動選擇</div><div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:5,WebkitOverflowScrolling:"touch"}}>{COLLECTIONS.fish.items.map((name,fi)=>{const on=name===p.fish;return <button key={`${i}-${name}`} onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,fish:name};update({ponds})}} style={{flex:"0 0 56px",border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.paper,borderRadius:8,padding:"4px 2px",minHeight:56,cursor:"pointer"}}><img src={ICON_URLS.fish[fi]} alt="" loading="lazy" style={{width:27,height:27,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:7.5,fontWeight:900,color:C.ink,lineHeight:1.05}}>{name}</div></button>})}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:4}}><label style={{fontSize:9,fontWeight:900,color:C.muted}}>目前數量<div style={{marginTop:2}}><NumInput value={p.count} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,count:v};update({ponds})}} suffix="隻"/></div></label><label style={{fontSize:9,fontWeight:900,color:C.muted}}>容量上限<div style={{marginTop:2}}><NumInput value={p.cap} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,cap:v};update({ponds})}} suffix="隻"/></div></label></div><label style={{display:"block",fontSize:9,fontWeight:900,color:C.muted,marginTop:5}}>下一次擴容需求<input value={p.need||""} onChange={e=>{const ponds=[...data.ponds];ponds[i]={...p,need:e.target.value};update({ponds})}} placeholder="例：萬象晶球 ×3" style={{width:"100%",marginTop:2,border:`1.5px solid ${C.line}`,borderRadius:7,padding:5,fontSize:10,background:"#FFFCF0"}}/></label><button onClick={()=>{setPondPicker(null);const ponds=data.ponds.filter((_,j)=>j!==i);update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}})}} style={{marginTop:5,border:0,background:"transparent",color:C.red,fontSize:9.5,fontWeight:900,padding:0}}>刪除這座魚塘</button></div>}</div>})}</div></Card>
        <button onClick={()=>{const i=(data.ponds||[]).length;const ponds=[...(data.ponds||[]),{fish:"",count:0,cap:3,need:""}];update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}});setPondPicker(i)}} style={{marginTop:6,width:"100%",border:`1.5px dashed ${C.line}`,background:C.cream,borderRadius:9,padding:7,fontWeight:900,color:C.brown,fontSize:10.5}}>＋ 新增魚塘</button>
      </>}

      {farmSection==="buildings"&&<>
        <SectionTitle icon="🏠">農舍</SectionTitle>
        <Card style={{padding:8}}><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7}}>{HOUSE_LEVELS.map((label,i)=>{const active=Number(data.house||0)===i;return <button key={label} onClick={()=>update({house:i})} style={{border:`2px solid ${active?C.green:C.line}`,background:active?"#EEF7DD":C.paper,borderRadius:10,padding:"6px 5px",display:"flex",alignItems:"center",gap:7,textAlign:"left",cursor:"pointer"}}><GameIcon file={houseFiles[i]||"House (tier 3)"} size={39}/><span style={{fontSize:9.5,fontWeight:950,color:active?C.green:C.ink,lineHeight:1.2}}>{active?"✓ ":""}{label}</span></button>})}</div></Card>
        <SectionTitle icon="🏗️">農場建築</SectionTitle>
        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>
          <CountTile name="雞舍" file={coopFiles[Number(data.buildings?.coop||0)]||"Coop"} count={buildingCount("coop")} sub={COOP_LEVELS[Number(data.buildings?.coop||0)]} onMinus={()=>setBuildingCount("coop",buildingCount("coop")-1)} onPlus={()=>setBuildingCount("coop",buildingCount("coop")+1)}/>
          <CountTile name="牲口棚" file={barnFiles[Number(data.buildings?.barn||0)]||"Barn"} count={buildingCount("barn")} sub={BARN_LEVELS[Number(data.buildings?.barn||0)]} onMinus={()=>setBuildingCount("barn",buildingCount("barn")-1)} onPlus={()=>setBuildingCount("barn",buildingCount("barn")+1)}/>
          <CountTile name="筒倉" file="Silo" count={buildingCount("silo")} onMinus={()=>setBuildingCount("silo",buildingCount("silo")-1)} onPlus={()=>setBuildingCount("silo",buildingCount("silo")+1)}/>
          <CountTile name="小屋" file="Big Shed" count={buildingCount("shed")} onMinus={()=>setBuildingCount("shed",buildingCount("shed")-1)} onPlus={()=>setBuildingCount("shed",buildingCount("shed")+1)}/>
          <CountTile name="水井" file="Well" count={buildingCount("well")} onMinus={()=>setBuildingCount("well",buildingCount("well")-1)} onPlus={()=>setBuildingCount("well",buildingCount("well")+1)}/>
          <CountTile name="磨坊" file="Mill" count={buildingCount("mill")} onMinus={()=>setBuildingCount("mill",buildingCount("mill")-1)} onPlus={()=>setBuildingCount("mill",buildingCount("mill")+1)}/>
          <CountTile name="馬廄" file="Horse Stable" count={buildingCount("stable")} onMinus={()=>setBuildingCount("stable",buildingCount("stable")-1)} onPlus={()=>setBuildingCount("stable",buildingCount("stable")+1)}/>
          <CountTile name="史萊姆窩" file="Slime Hutch" count={buildingCount("slime")} onMinus={()=>setBuildingCount("slime",buildingCount("slime")-1)} onPlus={()=>setBuildingCount("slime",buildingCount("slime")+1)}/>
          <CountTile name="連線小屋" file="Log Cabin" count={buildingCount("cabin")} onMinus={()=>setBuildingCount("cabin",buildingCount("cabin")-1)} onPlus={()=>setBuildingCount("cabin",buildingCount("cabin")+1)}/>
          <CountTile name="祝尼魔小屋" file="Junimo Hut" count={buildingCount("junimo")} onMinus={()=>setBuildingCount("junimo",buildingCount("junimo")-1)} onPlus={()=>setBuildingCount("junimo",buildingCount("junimo")+1)}/>
          <CountTile name="溫室" file="Greenhouse" count={buildingCount("greenhouse")} onMinus={()=>setBuildingCount("greenhouse",0)} onPlus={()=>setBuildingCount("greenhouse",1)}/>
        </div><div style={{fontSize:8.5,color:C.muted,marginTop:6}}>雞舍／牲口棚的數量與等級分開記；點下方等級按钮切換目前記錄的建築等級。</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}><button onClick={()=>cycleLevel("coop",COOP_LEVELS)} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:6,fontSize:9,fontWeight:900,color:C.brown}}>雞舍等級：{COOP_LEVELS[Number(data.buildings?.coop||0)]}</button><button onClick={()=>cycleLevel("barn",BARN_LEVELS)} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:6,fontSize:9,fontWeight:900,color:C.brown}}>牲口棚等級：{BARN_LEVELS[Number(data.buildings?.barn||0)]}</button></div></Card>
      </>}

      {farmSection==="tools"&&<>
        <SectionTitle icon="🔧">手持工具</SectionTitle>
        <Card style={{padding:8}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{TOOL_NAMES.map(([id,name])=>{const level=data.tools?.[id]||"初始",idx=TOOL_LEVELS.indexOf(level);return <button key={id} onClick={()=>updateNested("tools",{[id]:TOOL_LEVELS[(idx+1)%TOOL_LEVELS.length]})} style={{border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"6px 3px",cursor:"pointer"}}><GameIcon file={toolFiles[id]?.[level]||TOOL_ICON_FILES[id]} size={36}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>{name}</div><div style={{fontSize:8.5,color:C.green,fontWeight:950,marginTop:2}}>{level}</div></button>})}<button onClick={()=>{const idx=panLevels.indexOf(panLevel);updateNested("tools",{pan:panLevels[(idx+1)%panLevels.length]})}} style={{border:`1.5px solid ${panLevel!=="未取得"?C.green:C.line}`,background:panLevel!=="未取得"?"#EEF7DD":C.paper,borderRadius:9,padding:"6px 3px",cursor:"pointer",opacity:panLevel==="未取得"?.55:1}}><GameIcon file={panFiles[panLevel]} size={36}/><div style={{fontSize:9,fontWeight:950,color:C.ink}}>淘金盤</div><div style={{fontSize:8.5,color:panLevel!=="未取得"?C.green:C.muted,fontWeight:950,marginTop:2}}>{panLevel}</div></button></div><div style={{fontSize:8.5,color:C.muted,marginTop:6,textAlign:"center"}}>點圖示循環切換工具等級；淘金盤為未取得 → 銅 → 鋼 → 金 → 銥。</div></Card>
        <SectionTitle icon="🏗️">加工設備</SectionTitle>
        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{machineDefs.map(([id,name,file])=><MachineTile key={id} id={id} name={name} file={file}/>)}</div></Card>
      </>}
    </div>;
  };

  const renderData = () => {
    const DataTab=({id,label,file})=>{const active=dataSection===id;return <button onClick={()=>setDataSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"7px 4px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={39}/><span style={{fontSize:10,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    return <div><SectionTitle icon="📊">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:7,marginTop:7}}><DataTab id="farm" label="農場" file="Animals Tab"/><DataTab id="skills" label="技能" file="Skills Tab Icon"/><DataTab id="bundles" label="社區" file="Golden Scroll"/></div>{dataSection==="farm"&&renderFarm()}{dataSection==="skills"&&renderSkills()}{dataSection==="bundles"&&renderBundles()}</div>;
  };

'''
s=s[:start]+new_block+s[end:]
p.write_text(s,encoding='utf-8')
print('farm pages, products, panning, machine counts updated')
