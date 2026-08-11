from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
marker='  const renderDexCollection = () => {'
if marker not in s:
    raise SystemExit('renderDexCollection marker missing')
if '  const renderPowers = () => {' in s:
    print('runtime helpers already present')
    raise SystemExit(0)
block=r'''
  const powersState = data.powersV2 || {special:[],books:[],mastery:[],off:[]};
  const isPowerChecked = (kind, item) => {
    const offKey = `${kind}:${item.id}`;
    if ((powersState.off||[]).includes(offKey)) return false;
    if ((powersState[kind]||[]).includes(item.id)) return true;
    if (kind === "special" && (item.legacy||[]).some(x => (data.wallet||[]).includes(x) || (data.abilities||[]).includes(x))) return true;
    if (kind === "mastery" && (data.mastery||[]).includes(item.id)) return true;
    return false;
  };
  const togglePower = (kind, item) => {
    const checked = isPowerChecked(kind,item);
    const next = {special:[...(powersState.special||[])],books:[...(powersState.books||[])],mastery:[...(powersState.mastery||[])],off:[...(powersState.off||[])]};
    const offKey = `${kind}:${item.id}`;
    if (checked) {
      next[kind] = next[kind].filter(x=>x!==item.id);
      if (!next.off.includes(offKey)) next.off.push(offKey);
    } else {
      next.off = next.off.filter(x=>x!==offKey);
      if (!next[kind].includes(item.id)) next[kind].push(item.id);
    }
    update({powersV2:next});
  };

  const derivedAchievement = (id) => {
    const income=Number(data.base?.totalIncome||0), fishGot=(data.collections?.fish||[]).length;
    const hearts=Object.values(data.friendship||{}).map(Number);
    const cooked=(data.cookingCollectionV3||[]).length;
    if(id==="greenhorn")return income>=15000;
    if(id==="cowpoke")return income>=50000;
    if(id==="homesteader")return income>=250000;
    if(id==="millionaire")return income>=1000000;
    if(id==="legend")return income>=10000000;
    if(id==="friend5")return hearts.some(x=>x>=5);
    if(id==="friend10")return hearts.some(x=>x>=10);
    if(id==="beloved")return hearts.filter(x=>x>=10).length>=8;
    if(id==="cliques")return hearts.filter(x=>x>=5).length>=4;
    if(id==="networking")return hearts.filter(x=>x>=5).length>=10;
    if(id==="popular")return hearts.filter(x=>x>=5).length>=20;
    if(id==="cook10")return cooked>=10;
    if(id==="cook25")return cooked>=25;
    if(id==="cookall")return cooked>=COOKING_DISHES_V3.length;
    if(id==="house1")return Number(data.house||0)>=1;
    if(id==="house2")return Number(data.house||0)>=2;
    if(id==="fish10")return fishGot>=10;
    if(id==="fish24")return fishGot>=24;
    if(id==="fishall")return fishGot>=FISH_ICON_FILES.length;
    if(id==="bottom")return Number(data.mine?.normal||0)>=120;
    if(id==="locallegend")return rp.done>=rp.total;
    if(id==="talent")return Object.values(data.skills||{}).some(x=>Number(x)>=10);
    if(id==="five")return Object.values(data.skills||{}).length>=5&&Object.values(data.skills||{}).every(x=>Number(x)>=10);
    if(id==="island")return (data.milestones||[]).includes("island");
    return false;
  };
  const achievementChecked = id => (data.achievementsV2||[]).includes(id) || derivedAchievement(id);
  const toggleAchievement = id => {
    if (derivedAchievement(id)) return;
    const cur=data.achievementsV2||[];
    update({achievementsV2:cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]});
  };

  const extrasState = data.collectionExtrasV2 || {notes:[],scraps:[],shippedCount:0,cookedCount:0,lettersNote:""};
  const updateExtras = patch => update({collectionExtrasV2:{...extrasState,...patch}});

  const renderPowers = () => {
    const sections={special:SPECIAL_ITEMS_V2,books:BOOK_POWERS_V2,mastery:MASTERY_POWERS_V2};
    const labels={special:"特殊物品",books:"書籍能力",mastery:"精通能力"};
    return <div>
      <SectionTitle icon="🎒">特殊物品與能力</SectionTitle>
      <Card style={{background:"#FFF4D8",fontSize:11,color:C.muted,lineHeight:1.5}}>對應 1.6 遊戲「＋ → 特殊物品與能力」：特殊物品、書籍能力、精通能力分開記錄。</Card>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:9}}>{Object.keys(sections).map(k=><Pill key={k} active={powerSection===k} onClick={()=>setPowerSection(k)}>{labels[k]}</Pill>)}</div>
      <div style={{display:"grid",gap:7,marginTop:9}}>{sections[powerSection].map(it=>{
        const checked=isPowerChecked(powerSection,it);
        return <Card key={it.id} style={{padding:9,background:checked?"#EAF4D8":C.paper}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={it.file} size={36}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:13,color:C.ink}}>{it.name}</b><div style={{fontSize:10.5,color:C.muted,lineHeight:1.35,marginTop:2}}>{it.desc}</div></div><button onClick={()=>togglePower(powerSection,it)} style={{border:`2px solid ${checked?C.green:C.line}`,background:checked?C.lightGreen:C.cream,borderRadius:8,padding:"5px 8px",fontWeight:900,color:checked?C.green:C.muted}}>{checked?"✓":"○"}</button></div></Card>;
      })}</div>
    </div>;
  };

  const renderAchievements = () => <div>
    <Card style={{padding:9,background:"#FFF4D8",fontSize:10.5,color:C.muted,lineHeight:1.45}}>對應遊戲「＋ → 收集品 → 成就」。能從目前手帳可靠推斷的成就標成「自動」，其餘可手動點亮。</Card>
    <div style={{display:"grid",gap:6,marginTop:8}}>{ACHIEVEMENTS_V2.map(a=>{
      const auto=derivedAchievement(a.id), checked=achievementChecked(a.id);
      return <Card key={a.id} style={{padding:8,background:checked?"#EAF4D8":C.paper}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Achievement Star 01" size={28}/><div style={{flex:1}}><b style={{fontSize:12.5,color:C.ink}}>{a.name}</b>{auto&&<span style={{fontSize:9,color:C.green,fontWeight:900,marginLeft:5}}>自動</span>}<div style={{fontSize:10,color:C.muted,marginTop:1}}>{a.desc}</div></div><button disabled={auto} onClick={()=>toggleAchievement(a.id)} style={{border:`2px solid ${checked?C.green:C.line}`,background:checked?C.lightGreen:C.cream,borderRadius:8,padding:"4px 7px",fontWeight:900,color:checked?C.green:C.muted,opacity:auto?0.75:1}}>{checked?"✓":"○"}</button></div></Card>;
    })}</div>
  </div>;

'''
s=s.replace(marker,block+marker,1)
p.write_text(s,encoding='utf-8')
print('runtime helpers restored')
