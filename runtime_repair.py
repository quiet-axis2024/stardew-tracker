from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# 1) Merge Skills / Community / Farm into one low-frequency Data page.
tab_start=s.index('const TABS = [')
tab_end=s.index('];\n\n/* ================= 小元件',tab_start)+3
new_tabs='''const TABS = [
  { id: "overview", name: "總覽", icon: "🏡", file: TAB_ICON_FILES.overview },
  { id: "data", name: "資料", icon: "⭐", file: TAB_ICON_FILES.skills },
  { id: "people", name: "社交", icon: "💛", file: TAB_ICON_FILES.people },
  { id: "powers", name: "能力", icon: "🎒", file: "Special Items & Powers Tab" },
  { id: "collection", name: "收藏", icon: "📖", file: TAB_ICON_FILES.collection },
  { id: "notes", name: "備註", icon: "📝", file: "Journal Scrap" },
];'''
s=s[:tab_start]+new_tabs+s[tab_end:]

state='  const [tab, setTab] = useState("overview");'
state_new='  const [tab, setTab] = useState("overview");\n  const [dataSection, setDataSection] = useState("farm");'
if state_new not in s:
    if state not in s: raise SystemExit('tab state marker missing')
    s=s.replace(state,state_new,1)

# 2) Overview already has a dedicated Powers page, so remove duplicated Special Items & Powers block.
overview_start=s.index('  const renderOverview = () => <div>')
dup=s.find('    <SectionTitle icon="🎒">特殊物品與能力</SectionTitle>',overview_start)
if dup!=-1:
    overview_end=s.index('  </div>;\n\n  const renderSkills',dup)
    s=s[:dup]+s[overview_end:]

# 3) Compact fish ponds into one list card. Each pond expands only when editing.
pond_start=s.index('    <SectionTitle icon="🐟">魚塘</SectionTitle>')
pond_end=s.index('  </div>;\n\n  const renderPeople',pond_start)
new_ponds=r'''    <SectionTitle icon="🐟" right={`${(data.ponds||[]).length} 座`}>魚塘</SectionTitle>
    <Card style={{padding:7}}>
      <div style={{display:"grid",gap:4}}>{(data.ponds||[]).map((p,i)=>{
        const fishIndex=COLLECTIONS.fish.items.indexOf(p.fish), open=pondPicker===i;
        return <div key={i} style={{border:`1.5px solid ${open?C.orange:C.line}`,borderRadius:9,overflow:"hidden",background:open?"#FFF8E2":C.paper}}>
          <button onClick={()=>setPondPicker(open?null:i)} style={{width:"100%",border:0,background:"transparent",padding:"7px 8px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer"}}>
            {fishIndex>=0?<img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:30,height:30,imageRendering:"pixelated",objectFit:"contain",flex:"0 0 auto"}}/>:<GameIcon file="Fish Pond" size={30}/>} 
            <span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:12,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.fish||"未選魚種"}</b>{p.need&&<span style={{display:"block",fontSize:9,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.need}</span>}</span>
            <span style={{fontSize:11,fontWeight:950,color:C.brown,background:C.cream,borderRadius:8,padding:"3px 6px"}}>{Number(p.count||0)}/{Number(p.cap||0)}</span>
            <span style={{fontSize:11,color:C.brown,fontWeight:950}}>{open?"▲":"▼"}</span>
          </button>
          {open&&<div style={{padding:"7px 8px 8px",borderTop:`1px dashed ${C.line}`}}>
            <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginBottom:4}}>魚種｜左右滑動選擇</div>
            <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:5,WebkitOverflowScrolling:"touch"}}>{COLLECTIONS.fish.items.map((name,fi)=>{const on=name===p.fish;return <button key={`${i}-${name}`} onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,fish:name};update({ponds})}} style={{flex:"0 0 58px",border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.paper,borderRadius:8,padding:"4px 2px",minHeight:58,cursor:"pointer"}}><img src={ICON_URLS.fish[fi]} alt="" loading="lazy" style={{width:28,height:28,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:7.8,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:1}}>{name}</div></button>})}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:5}}><label style={{fontSize:9.5,fontWeight:900,color:C.muted}}>目前數量<div style={{marginTop:2}}><NumInput value={p.count} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,count:v};update({ponds})}} suffix="隻"/></div></label><label style={{fontSize:9.5,fontWeight:900,color:C.muted}}>容量上限<div style={{marginTop:2}}><NumInput value={p.cap} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,cap:v};update({ponds})}} suffix="隻"/></div></label></div>
            <label style={{display:"block",fontSize:9.5,fontWeight:900,color:C.muted,marginTop:6}}>下一次擴容需求<input value={p.need||""} onChange={e=>{const ponds=[...data.ponds];ponds[i]={...p,need:e.target.value};update({ponds})}} placeholder="例：萬象晶球 ×3／尚未觸發" style={{width:"100%",marginTop:3,border:`1.5px solid ${C.line}`,borderRadius:7,padding:6,fontSize:10.5,background:"#FFFCF0"}}/></label>
            <button onClick={()=>{setPondPicker(null);update({ponds:data.ponds.filter((_,j)=>j!==i)})}} style={{marginTop:6,border:0,background:"transparent",color:C.red,fontSize:10,fontWeight:900,padding:0}}>刪除這座魚塘</button>
          </div>}
        </div>;
      })}</div>
    </Card>
    <button onClick={()=>{const i=(data.ponds||[]).length;update({ponds:[...(data.ponds||[]),{fish:"",count:0,cap:3,need:""}]});setPondPicker(i)}} style={{marginTop:7,width:"100%",border:`2px dashed ${C.line}`,background:C.cream,borderRadius:9,padding:8,fontWeight:900,color:C.brown}}>＋ 新增魚塘</button>
'''
s=s[:pond_start]+new_ponds+s[pond_end:]

# 4) Add the combined Data page with three switch buttons.
people_marker='  const renderPeople = () => {'
if '  const renderData = () => <div>' not in s:
    idx=s.index(people_marker)
    render_data=r'''  const renderData = () => <div>
    <SectionTitle icon="📊">資料</SectionTitle>
    <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:10.5,color:C.muted,lineHeight:1.45}}>技能、社區中心、農場都屬於低頻更新資料，集中在這一頁；需要更新時再切換。</div></Card>
    <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}><Pill active={dataSection==="farm"} onClick={()=>setDataSection("farm")}>農場</Pill><Pill active={dataSection==="skills"} onClick={()=>setDataSection("skills")}>技能</Pill><Pill active={dataSection==="bundles"} onClick={()=>setDataSection("bundles")}>社區</Pill></div>
    {dataSection==="farm"&&renderFarm()}{dataSection==="skills"&&renderSkills()}{dataSection==="bundles"&&renderBundles()}
  </div>;

'''
    s=s[:idx]+render_data+s[idx:]

old_content='const content={overview:renderOverview,skills:renderSkills,bundles:renderBundles,farm:renderFarm,people:renderPeople,powers:renderPowers,collection:renderCollection,notes:renderNotes}[tab];'
new_content='const content={overview:renderOverview,data:renderData,people:renderPeople,powers:renderPowers,collection:renderCollection,notes:renderNotes}[tab];'
if old_content not in s: raise SystemExit('content map marker missing')
s=s.replace(old_content,new_content,1)

p.write_text(s,encoding='utf-8')

# Safari/PWA cache bump.
i=Path('index.html'); t=i.read_text(encoding='utf-8'); t=t.replace('cloud.js?v=18','cloud.js?v=19').replace('app.js?v=18','app.js?v=19'); i.write_text(t,encoding='utf-8')
sw=Path('sw.js'); t=sw.read_text(encoding='utf-8').replace("stardew-tracker-v18","stardew-tracker-v19"); sw.write_text(t,encoding='utf-8')
print('data page + compact ponds updated')
