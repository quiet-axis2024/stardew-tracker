from pathlib import Path

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')


def rep(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'missing target: {label}')
    s = s.replace(old, new, 1)


def replace_section(start, end, new, label):
    global s
    i = s.find(start)
    if i < 0:
        raise SystemExit(f'missing section start: {label}')
    j = s.find(end, i)
    if j < 0:
        raise SystemExit(f'missing section end: {label}')
    s = s[:i] + new + s[j:]


# Generic cards can be scroll/focus anchors.
rep(
    'function Card({ children, style }) {\n  return <div style={{ background: C.paper, border: `2px solid ${C.line}`, borderRadius: 12, padding: 13, boxShadow: `0 3px 8px ${C.shadow}`, ...style }}>{children}</div>;\n}',
    'function Card({ children, style, ...props }) {\n  return <div {...props} style={{ background: C.paper, border: `2px solid ${C.line}`, borderRadius: 12, padding: 13, boxShadow: `0 3px 8px ${C.shadow}`, ...style }}>{children}</div>;\n}',
    'Card props',
)

# Collection subnav: transparent game objects instead of framed menu-tab art.
rep(
    'const COLLECTION_TABS_V3 = [\n ["shipping","出貨","Mini-Shipping Bin"],["fish","魚類","Pufferfish"],["artifact","古物","Dwarf Scroll I"],["mineral","礦物","Diamond"],["cooking","烹飪","Cooking Icon"],["achievements","成就","Achievements Icon"],["notes","秘密紙條","Secret Note Icon"],["scraps","日誌殘頁","Journal Scrap"]\n];',
    'const COLLECTION_TABS_V3 = [\n ["shipping","出貨","Mini-Shipping Bin"],["fish","魚類","Pufferfish"],["artifact","古物","Dwarf Scroll I"],["mineral","礦物","Diamond"],["cooking","烹飪","Fried Egg"],["achievements","成就","Stardrop"],["notes","秘密紙條","Secret Note"],["scraps","日誌殘頁","Journal Scrap"]\n];',
    'collection icons',
)

# State for selected cooking item and reversible drill-down navigation.
rep(
    '  const [cookingModeV3, setCookingModeV3] = useState("prep");\n',
    '  const [cookingModeV3, setCookingModeV3] = useState("prep");\n  const [selectedCookingV62, setSelectedCookingV62] = useState(null);\n',
    'cooking selection state',
)
rep(
    '  const [itemUsageSelectedV42, setItemUsageSelectedV42] = useState("");\n',
    '  const [itemUsageSelectedV42, setItemUsageSelectedV42] = useState("");\n  const [navStackV62, setNavStackV62] = useState([]);\n',
    'navigation state',
)

rep(
    '  const updateExtras = patch => update({ extras: { ...extrasState, ...patch } });\n',
    '''  const updateExtras = patch => update({ extras: { ...extrasState, ...patch } });

  const pushNavV62 = () => {
    const snapshot={tab,dataSection,farmSection,skillSection,bundleRoom,collectionSection,selectedCollection,selectedItem,selectedCookingV62,socialGroup,expandedNPC,fishViewV4,itemUsageQueryV42,itemUsageSelectedV42,scrollY:Number(window.scrollY||0)};
    setNavStackV62(stack=>[...stack.slice(-9),snapshot]);
  };
  const goBackV62 = () => {
    const prev=navStackV62[navStackV62.length-1];
    if(!prev)return;
    setNavStackV62(stack=>stack.slice(0,-1));
    setTab(prev.tab||"overview"); setDataSection(prev.dataSection||"skills"); setFarmSection(prev.farmSection||"animals"); setSkillSection(prev.skillSection||"milestones");
    setBundleRoom(prev.bundleRoom||""); setCollectionSection(prev.collectionSection||"fish"); setSelectedCollection(prev.selectedCollection||"fish"); setSelectedItem(prev.selectedItem??null); setSelectedCookingV62(prev.selectedCookingV62||null);
    setSocialGroup(prev.socialGroup||"single"); setExpandedNPC(prev.expandedNPC||null); setFishViewV4(prev.fishViewV4||"items"); setItemUsageQueryV42(prev.itemUsageQueryV42||""); setItemUsageSelectedV42(prev.itemUsageSelectedV42||"");
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:Number(prev.scrollY||0),left:0,behavior:"auto"})));
  };
''',
    'navigation helpers',
)

old = '''  const openItemLookupV54 = (raw, preferredKey="") => {
    const row = lookupRowV54(raw);
    const key = preferredKey || row?.file || itemFileZhV26(raw) || row?.name || raw;
    setItemUsageQueryV42(row?.name || raw);
    setItemUsageSelectedV42(key);
    setFishViewV4("items");
    setTab("fishing");
    requestAnimationFrame(() => window.scrollTo({top:0,left:0,behavior:"auto"}));
  };

  const openSocialNpcV55 = npc => {
    const group=NPC_GROUPS.find(g=>g.list.includes(npc));
    if(group)setSocialGroup(group.id);
    setExpandedNPC(npc);
    setTab("people");
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"}));
  };
'''
new = '''  const openItemLookupV54 = (raw, preferredKey="") => {
    const row = lookupRowV54(raw);
    const key = preferredKey || row?.file || itemFileZhV26(raw) || row?.name || raw;
    pushNavV62();
    setItemUsageQueryV42(row?.name || raw); setItemUsageSelectedV42(key); setFishViewV4("items"); setTab("fishing");
    requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=document.getElementById("lookup-detail-v62"); if(target)target.scrollIntoView({block:"start",behavior:"auto"}); else window.scrollTo({top:0,left:0,behavior:"auto"});}));
  };

  const openSocialNpcV55 = npc => {
    const group=NPC_GROUPS.find(g=>g.list.includes(npc));
    pushNavV62();
    if(group)setSocialGroup(group.id); setExpandedNPC(npc); setTab("people");
    requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=document.getElementById(`npc-card-${npc}`); if(target)target.scrollIntoView({block:"start",behavior:"auto"}); else window.scrollTo({top:0,left:0,behavior:"auto"});}));
  };

  const SimpleItemInfoV62 = ({name,file="",info=""}) => {
    const row=lookupRowV54(name)||lookupRowV54(file);
    const resolvedFile=row?.file||file||itemFileZhV26(name)||name;
    const display=switchNameV47(row?.name||name,resolvedFile);
    const brief=info||row?.uses?.[0]||row?.sources?.[0]||"點這張卡查看完整用途與取得方式。";
    const canLookup=Boolean(row);
    return <button type="button" disabled={!canLookup} onClick={()=>canLookup&&openItemLookupV54(row?.name||name,row?.file||resolvedFile)} style={{width:"100%",marginTop:7,border:`1.5px solid ${canLookup?C.orange:C.line}`,background:"#FFF8E2",borderRadius:10,padding:"8px 9px",display:"grid",gridTemplateColumns:"48px minmax(0,1fr) auto",gap:8,alignItems:"center",textAlign:"left",cursor:canLookup?"pointer":"default",opacity:canLookup?1:.82}}><GameIcon file={resolvedFile} size={46}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:13,color:C.darkBrown}}>{display}</b><span style={{display:"block",fontSize:9.2,color:C.muted,lineHeight:1.35,marginTop:2}}>{brief}</span>{canLookup&&<span style={{display:"block",fontSize:7.5,color:C.orange,fontWeight:950,marginTop:3}}>點卡片查看完整物品資料</span>}</span><span style={{fontSize:16,color:C.orange,fontWeight:950}}>{canLookup?"›":""}</span></button>;
  };
'''
rep(old, new, 'deep navigation')

rep(
    '{selected&&<Card style={{marginTop:7,padding:9,background:"#FFF8E9"}}>',
    '{selected&&<Card id="lookup-detail-v62" style={{marginTop:7,padding:9,background:"#FFF8E9",scrollMarginTop:"calc(104px + env(safe-area-inset-top))"}}>',
    'lookup anchor',
)
rep(
    '<Card key={n} style={{padding:7,background:open?"#FFF8E9":C.paper,minWidth:0,maxWidth:"100%",overflow:"hidden"}}>',
    '<Card key={n} id={`npc-card-${n}`} style={{padding:7,background:open?"#FFF8E9":C.paper,minWidth:0,maxWidth:"100%",overflow:"hidden",scrollMarginTop:"calc(104px + env(safe-area-inset-top))"}}>',
    'npc anchor',
)

fish = '''  const renderFishDexV4 = () => {
    const got=data.collections.fish||[];
    const selectedName=selectedItem!=null?COLLECTIONS.fish.items[selectedItem]:"";
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>魚類圖鑑</span><span>{got.length}/{COLLECTIONS.fish.items.length}</span></div><ProgressBar value={got.length} max={COLLECTIONS.fish.items.length}/></Card>
      {selectedItem!=null&&selectedName&&<SimpleItemInfoV62 name={selectedName} file={FISH_ICON_FILES[selectedItem]} info={FISH_INFO[selectedItem]||""}/>} 
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{COLLECTIONS.fish.items.map((name,i)=>{const on=got.includes(i);return <button key={i} onClick={()=>setSelectedItem(i)} style={{position:"relative",border:`2px solid ${selectedItem===i?C.orange:!on?C.orange:C.line}`,background:on?"#E8F1D5":C.paper,borderRadius:9,minHeight:76,padding:"5px 2px",cursor:"pointer"}}><img src={ICON_URLS.fish[i]} alt="" style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:9,fontWeight:900,color:C.ink,lineHeight:1.05}}>{switchNameV47(name,FISH_ICON_FILES[i])}</div><span onClick={e=>{e.stopPropagation();updateNested("collections",{fish:on?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:1,fontSize:12,color:on?C.green:"#C9A86A",fontWeight:950,padding:2}}>{on?"✓":"○"}</span></button>})}</div>
    </div>;
  };
'''
replace_section('  const renderFishDexV4 = () => {', '\n\n  const renderFishHubV4', fish, 'fish dex')

dex = '''  const renderDexCollection = () => {
    const c=COLLECTIONS[selectedCollection];
    const got=data.collections[selectedCollection]||[];
    const selectedName=selectedItem!=null?c.items[selectedItem]:"";
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>{selectedCollection==="artifact"?"古物圖鑑":"礦物圖鑑"}</span><span>{got.length}/{c.items.length}</span></div><ProgressBar value={got.length} max={c.items.length}/></Card>
      {selectedName&&<SimpleItemInfoV62 name={selectedName} file={itemFileZhV26(selectedName)||selectedName} info={c.info?.[selectedItem]||""}/>} 
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{c.items.map((it,i)=>{const checked=got.includes(i),file=ICON_URLS[selectedCollection]?.[i];return <button key={i} onClick={()=>setSelectedItem(i)} onDoubleClick={()=>updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})} style={{position:"relative",border:`2px solid ${selectedItem===i?C.orange:checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 3px",minHeight:78,cursor:"pointer"}}>{file?<img src={file} alt="" style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file={itemFileZhV26(it)||it} size={36}/>}<div style={{fontSize:9,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:2}}>{switchNameV47(it,itemFileZhV26(it))}</div><span onClick={e=>{e.stopPropagation();updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:2,fontSize:13,color:checked?C.green:"#C9B99A",fontWeight:950,padding:2}}>{checked?"✓":"○"}</span></button>})}</div>
    </div>;
  };
'''
replace_section('  const renderDexCollection = () => {', '\n\n\n  const prepSetV3', dex, 'artifact mineral dex')

cooking = '''  const renderCookingV3 = () => {
    const prepMode=cookingModeV3==="prep";
    const progressValue=prepMode?prepSetV3.length:cookedSetV3.length;
    const progressMax=prepMode?allPrepItemsV3.length:COOKING_DISHES_V3.length;
    return <div>
      <Card style={{marginTop:8,padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>{prepMode?"料理备料图鉴":"料理收集"}</span><span>{progressValue}/{progressMax}</span></div><ProgressBar value={progressValue} max={progressMax}/></Card>
      {selectedCookingV62&&<SimpleItemInfoV62 name={selectedCookingV62.name} file={selectedCookingV62.file} info={selectedCookingV62.info||""}/>} 
      <div style={{display:"flex",gap:5,marginTop:7}}><Pill small active={prepMode} onClick={()=>{setCookingModeV3("prep");setSelectedCookingV62(null)}}>备料图鉴</Pill><Pill small active={!prepMode} onClick={()=>{setCookingModeV3("dishes");setSelectedCookingV62(null)}}>料理收集</Pill></div>
      {prepMode&&<Card style={{marginTop:7,padding:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,fontWeight:950,color:C.darkBrown}}>全料理一次性备料</div><div style={{fontSize:8.5,color:C.muted,lineHeight:1.4,marginTop:2}}>点亮＝已按攻略准备最低需求量；这里只记准备进度，不当库存管理。</div></Card>}
      {prepMode&&<><label style={{display:"flex",alignItems:"center",gap:6,margin:"8px 2px 0",fontSize:11,fontWeight:900,color:C.brown}}><input type="checkbox" checked={prepMissingOnlyV3} onChange={e=>setPrepMissingOnlyV3(e.target.checked)}/>只看还没准备的材料</label>{COOKING_PREP_GROUPS_V3.map(g=>{const rows=g.items.filter(it=>!prepMissingOnlyV3||!prepSetV3.includes(it[0]));return rows.length?<Card key={g.id} style={{marginTop:8,padding:9,background:g.id==="g5"?"#FFF0D2":C.paper}}><div style={{fontSize:12.5,fontWeight:950,color:C.darkBrown}}>{g.name}</div><div style={{fontSize:9.5,color:C.muted,marginTop:2,lineHeight:1.35}}>{g.desc}</div><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:7}}>{rows.map(it=>{const [id,name,file,need]=it,on=prepSetV3.includes(id);return <button key={id} onClick={()=>setSelectedCookingV62({name,file,info:`全料理一次性备料最低需求 ×${need}`})} style={{position:"relative",border:`2px solid ${selectedCookingV62?.file===file?C.orange:on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,minHeight:82,padding:"5px 2px",cursor:"pointer"}}><div style={{height:35,display:"flex",alignItems:"center",justifyContent:"center"}}><GameIcon file={file} size={34}/></div><div style={{fontSize:9,fontWeight:950,color:C.ink,lineHeight:1.1,marginTop:2}}>{name}</div><span style={{position:"absolute",left:3,top:2,fontSize:8.5,fontWeight:950,color:C.brown,background:"#FFF1C9",borderRadius:6,padding:"1px 3px"}}>×{need}</span><span onClick={e=>{e.stopPropagation();togglePrepV3(id)}} style={{position:"absolute",right:2,top:1,fontSize:12,color:on?C.green:"#C9B99A",fontWeight:950,padding:2}}>{on?"✓":"○"}</span></button>})}</div></Card>:null})}</>}
      {!prepMode&&<div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}>{COOKING_DISHES_V3.map(it=>{const [id,name,file]=it,on=cookedSetV3.includes(id);return <button key={id} onClick={()=>setSelectedCookingV62({name,file,info:"料理图鉴；右上角圆点记录是否已经制作过。"})} style={{position:"relative",border:`2px solid ${selectedCookingV62?.file===file?C.orange:on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:8,minHeight:75,padding:"5px 2px",cursor:"pointer"}}><GameIcon file={file} size={34}/><div style={{fontSize:8.8,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:2}}>{switchNameV47(name,file)}</div><span onClick={e=>{e.stopPropagation();toggleCookedV3(id)}} style={{position:"absolute",right:2,top:1,fontSize:11,color:on?C.green:"#C9B99A",fontWeight:950,padding:2}}>{on?"✓":"○"}</span></button>})}</div>}
    </div>;
  };
'''
replace_section('  const renderCookingV3 = () => {', '\n\n  const renderPaperCollectionV3', cooking, 'cooking')

rep(
    '    const tabClick = k => { setCollectionSection(k); if(["fish","artifact","mineral"].includes(k)){setSelectedCollection(k);setSelectedItem(null);} };',
    '    const tabClick = k => { setCollectionSection(k); setSelectedCookingV62(null); if(["fish","artifact","mineral"].includes(k)){setSelectedCollection(k);setSelectedItem(null);} };',
    'collection reset',
)

# Data hierarchy visual language.
rep(
    '<SkillTab id="milestones" label="里程碑" file="Achievement Star 01"/><SkillTab id="skills" label="技能" file="Skills Tab Icon"/><SkillTab id="mine" label="礦井" file="MinesEntrance"/><SkillTab id="special" label="特殊能力" file="Special Items & Powers Tab"/><SkillTab id="stardrops" label="星之果實" file="Stardrop"/>',
    '<SkillTab id="milestones" label="里程碑" file="Stardrop Tea"/><SkillTab id="skills" label="技能" file="Book Of Stars"/><SkillTab id="mine" label="礦井" file="Pickaxe"/><SkillTab id="special" label="特殊能力" file="Treasure Chest"/><SkillTab id="stardrops" label="星之果實" file="Stardrop"/>',
    'skill icons',
)
rep('<FarmTab id="animals" label="動物" file="Animals Tab"/>', '<FarmTab id="animals" label="動物" file="Hay"/>', 'farm icon')

old_data = '''  const renderData = () => {
    const DataTab=({id,label,file})=>{const active=dataSection===id;return <button onClick={()=>setDataSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"7px 4px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={39}/><span style={{fontSize:10,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    return <div><SectionTitle icon="📊">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="skills" label="角色" file="Skills Tab Icon"/><DataTab id="farm" label="農場" file="Animals Tab"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Collections Tab"/></div>{dataSection==="skills"&&renderSkills()}{dataSection==="farm"&&renderFarm()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;
  };
'''
new_data = '''  const renderData = () => {
    const DataTab=({id,label,file})=>{const active=dataSection===id;return <button onClick={()=>setDataSection(id)} style={{border:`1.5px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:9,padding:"5px 3px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={30}/><span style={{fontSize:8.8,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    return <div><SectionTitle icon="game:Book Of Stars">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="skills" label="角色" file="Stardrop"/><DataTab id="farm" label="農場" file="Farm Computer"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Treasure Chest"/></div>{dataSection==="skills"&&renderSkills()}{dataSection==="farm"&&renderFarm()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;
  };
'''
rep(old_data, new_data, 'data primary tabs')

# Remove internal hierarchy labels from player-facing community screen.
rep(
    '    const RouteLevelV55=({label,file,children})=><div style={{marginTop:9,marginLeft:6,paddingLeft:9,borderLeft:`3px solid ${C.orange}`}}><div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 2px 2px",fontSize:8,fontWeight:950,color:C.orange}}><span style={{background:"#FFF0D2",borderRadius:7,padding:"2px 5px"}}>第 4 层</span><GameIcon file={file} size={20}/><span>{label}</span></div>{children}</div>;',
    '    const RouteLevelV55=({label,file,children})=><div style={{marginTop:9}}><div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 2px 2px",fontSize:9,fontWeight:950,color:C.orange}}><GameIcon file={file} size={21}/><span>{label}</span></div>{children}</div>;',
    'community level 4',
)
rep(
    '<Card style={{padding:8,background:"#FFF4D8"}}><div style={{display:"flex",alignItems:"center",gap:5,fontSize:8.5,fontWeight:950,color:C.brown,marginBottom:6}}><span style={{background:"#FFE2A8",borderRadius:7,padding:"2px 6px"}}>第 3 层</span><span>先选这个存档走哪条路线｜游戏中二选一</span></div>',
    '<Card style={{padding:8,background:"#FFF4D8"}}><div style={{display:"flex",alignItems:"center",gap:5,fontSize:8.8,fontWeight:950,color:C.brown,marginBottom:6}}><GameIcon file="Golden Scroll" size={20}/><span>选择这个存档的城镇修复路线｜游戏中二选一</span></div>',
    'community level 3',
)

# Back affordance; bottom nav is an intentional root navigation, so it clears drill-down history.
rep(
    '<main style={{width:"100%",maxWidth:680,minWidth:0,margin:"0 auto",padding:"8px 12px 24px",overflowX:"hidden"}}>{content()}</main>',
    '<main style={{width:"100%",maxWidth:680,minWidth:0,margin:"0 auto",padding:"8px 12px 24px",overflowX:"hidden"}}>{navStackV62.length>0&&<div style={{position:"sticky",top:"calc(54px + env(safe-area-inset-top))",zIndex:28,display:"flex",justifyContent:"flex-start",pointerEvents:"none",margin:"0 0 6px"}}><button onClick={goBackV62} style={{pointerEvents:"auto",border:`1.5px solid ${C.orange}`,background:"#FFF8E2",color:C.brown,borderRadius:9,padding:"6px 10px",fontSize:10,fontWeight:950,boxShadow:`0 2px 7px ${C.shadow}`}}>← 返回上一步</button></div>}{content()}</main>',
    'back bar',
)
rep('onClick={()=>{setTab(t.id);window.scrollTo(0,0)}}', 'onClick={()=>{setNavStackV62([]);setTab(t.id);window.scrollTo(0,0)}}', 'root navigation')

# OCR: exact 16:9 path + calibrated 4:3 phone-photo / social-crop path.
old_ratio = '''      const ratio = img.width / img.height;

      // 先保留角色肖像：Switch 16:9 的「＋ → 玩家／背包」頁面位置固定。
      const portraitCanvas = document.createElement("canvas");
      portraitCanvas.width = 180; portraitCanvas.height = 240;
      const pctx = portraitCanvas.getContext("2d");
      if (ratio > 1.6 && ratio < 1.9) {
        const sx = img.width * 0.298, sy = img.height * 0.548, sw = img.width * 0.092, sh = img.height * 0.218;
        pctx.drawImage(img, sx, sy, sw, sh, 0, 0, portraitCanvas.width, portraitCanvas.height);
      } else {
        const sideW = Math.min(img.width, img.height * 0.76), sideH = Math.min(img.height, img.width / 0.76);
        pctx.drawImage(img, (img.width-sideW)/2, (img.height-sideH)/2, sideW, sideH, 0, 0, portraitCanvas.width, portraitCanvas.height);
      }
      const portrait = portraitCanvas.toDataURL("image/jpeg", 0.84);

      if (!(ratio > 1.6 && ratio < 1.9)) {
        setData(d => ({...d, profilePortrait:portrait}));
        setProfileOcrStatus("✓ 已更新角色圖；這張圖片不是標準 16:9 玩家資料畫面，因此未自動改文字資料");
        return;
      }
'''
new_ratio = '''      const ratio = img.width / img.height;
      const is16x9V62 = ratio > 1.6 && ratio < 1.9;
      const isPhoto43V62 = ratio > 1.15 && ratio < 1.55;

      const portraitCanvas = document.createElement("canvas");
      portraitCanvas.width = 180; portraitCanvas.height = 240;
      const pctx = portraitCanvas.getContext("2d");
      if (is16x9V62) {
        const sx = img.width * 0.298, sy = img.height * 0.548, sw = img.width * 0.092, sh = img.height * 0.218;
        pctx.drawImage(img, sx, sy, sw, sh, 0, 0, portraitCanvas.width, portraitCanvas.height);
      } else if (isPhoto43V62) {
        const sx = img.width * 0.105, sy = img.height * 0.390, sw = img.width * 0.190, sh = img.height * 0.350;
        pctx.drawImage(img, sx, sy, sw, sh, 0, 0, portraitCanvas.width, portraitCanvas.height);
      } else {
        const sideW = Math.min(img.width, img.height * 0.76), sideH = Math.min(img.height, img.width / 0.76);
        pctx.drawImage(img, (img.width-sideW)/2, (img.height-sideH)/2, sideW, sideH, 0, 0, portraitCanvas.width, portraitCanvas.height);
      }
      const portrait = portraitCanvas.toDataURL("image/jpeg", 0.84);

      if (!is16x9V62 && !isPhoto43V62) {
        setData(d => ({...d, profilePortrait:portrait}));
        setProfileOcrStatus("✓ 已更新角色圖；目前可自动读取 16:9 原图与横向 4:3 手机照片／裁切图，其他比例先不覆盖文字资料");
        return;
      }
'''
rep(old_ratio, new_ratio, 'photo ratio')

crop_start = '      // v59: only auto-apply fields that are safe to verify from the fixed Switch UI.\n'
crop_end = '      const numberConsensusV59 = (...values) => {\n'
i = s.find(crop_start)
j = s.find(crop_end, i)
if i < 0 or j < 0:
    raise SystemExit('missing OCR crop block')
new_crops = '''      const psmWordV59 = Tesseract.PSM?.SINGLE_WORD || 8;
      const rectV62=(standardRect,photoRect)=>isPhoto43V62?photoRect:standardRect;
      const cropV62=(rect,scale,threshold)=>makeCrop(img,rect[0],rect[1],rect[2],rect[3],scale,threshold);
      const farmerRectV62=rectV62([0.285,0.780,0.130,0.060],[0.100,0.730,0.240,0.130]);
      const farmRectV62=rectV62([0.480,0.565,0.180,0.060],[0.500,0.390,0.450,0.110]);
      const moneyHudRectV62=rectV62([0.890,0.205,0.090,0.050],[0.490,0.510,0.470,0.120]);
      const moneyPanelRectV62=rectV62([0.608,0.638,0.064,0.060],[0.490,0.510,0.470,0.120]);
      const incomeRectV62=rectV62([0.575,0.695,0.075,0.060],[0.490,0.600,0.470,0.120]);
      const incomeWideRectV62=rectV62([0.570,0.695,0.120,0.060],[0.470,0.590,0.500,0.140]);
      const yearRectV62=rectV62([0.533,0.768,0.019,0.050],[0.610,0.720,0.080,0.120]);
      const dayRectV62=rectV62([0.615,0.768,0.033,0.050],[0.750,0.720,0.120,0.120]);
      const hudDayRectV62=rectV62([0.882,0.018,0.018,0.050],[0.750,0.720,0.120,0.120]);
      const seasonRectV62=rectV62([0.575,0.758,0.035,0.060],[0.660,0.710,0.140,0.130]);
      const farmerCropColorV61 = cropV62(farmerRectV62,8,false), farmerCropMonoV61 = cropV62(farmerRectV62,8,90);
      const farmCropColorV61 = cropV62(farmRectV62,8,false), farmCropMonoV61 = cropV62(farmRectV62,8,90);
      const hudMoneyColorV59 = cropV62(moneyHudRectV62,8,false), hudMoneyMonoV59 = cropV62(moneyHudRectV62,8,120), panelMoneyV59 = cropV62(moneyPanelRectV62,8,110);
      const incomeColorV59 = cropV62(incomeRectV62,8,false), incomeMonoV59 = cropV62(incomeRectV62,8,110), incomeWideV59 = cropV62(incomeWideRectV62,6,110);
      const yearColorV59 = cropV62(yearRectV62,8,false), yearMonoV59 = cropV62(yearRectV62,8,110);
      const dayColorV59 = cropV62(dayRectV62,8,false), dayMonoV59 = cropV62(dayRectV62,8,110);
      const hudDayColorV60 = cropV62(hudDayRectV62,10,false), hudDayMonoV60 = cropV62(hudDayRectV62,10,120);
      const seasonColorV59 = cropV62(seasonRectV62,10,false), seasonMonoV59 = cropV62(seasonRectV62,10,100);
      const clockCrop = cropV62([0.868,0.139,0.095,0.055],4,90);

'''
s = s[:i] + new_crops + s[j:]
rep('      const clockRaw = await recognizeWithV58(engWorker, clockCrop, "0123456789:：");', '      const clockRaw = is16x9V62 ? await recognizeWithV58(engWorker, clockCrop, "0123456789:：") : "";', 'photo clock')

p.write_text(s, encoding='utf-8')

idx = Path('index.html')
x = idx.read_text(encoding='utf-8').replace('?v=61', '?v=62').replace('deploy-v61', 'deploy-v62')
idx.write_text(x, encoding='utf-8')

sw = Path('sw.js')
x = sw.read_text(encoding='utf-8').replace('stardew-tracker-v61', 'stardew-tracker-v62')
sw.write_text(x, encoding='utf-8')

readme = Path('README.md')
r = readme.read_text(encoding='utf-8')
r = r.replace('Switch 16:9 玩家資料頁截圖匯入：自動裁角色肖像，預填農夫／農場名稱；金錢、年份、季節與日期採較保守的多路 OCR／一致性檢查，辨識不可靠時不覆蓋原值。', 'Switch 玩家資料頁匯入：支援標準 16:9 原圖，也支援常見橫向 4:3 手機拍照／社群裁切圖；自動裁角色肖像並預填農夫／農場名稱，金錢、年份、季節與日期仍採多路 OCR／一致性檢查，辨識不可靠時不覆蓋原值。')
r = r.replace('- **查找**：物品用途／來源查詢，以及依季節、天氣、地點、時間反查魚類。', '- **查找**：物品用途／來源查詢，以及依季節、天氣、地點、時間反查魚類；從收藏、日曆或社交卡片跳入詳細資料時可一鍵返回原位置。')
readme.write_text(r, encoding='utf-8')

print('v62 patch applied')
