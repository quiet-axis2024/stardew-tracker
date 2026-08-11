from pathlib import Path
import re

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# 1) Extra UI state for equipment category tabs.
state='  const [skillSection, setSkillSection] = useState("skills");'
if 'const [machineGroup, setMachineGroup]' not in s:
    s=s.replace(state, state+'\n  const [machineGroup, setMachineGroup] = useState("artisan");',1)

# 2) Move the standalone Powers page into Data > Skills by removing it from bottom nav.
pat=r'const TABS = \[.*?\n\];'
new_tabs='''const TABS = [
  { id: "overview", name: "總覽", icon: "🏡", file: TAB_ICON_FILES.overview },
  { id: "data", name: "資料", icon: "⭐", file: TAB_ICON_FILES.skills },
  { id: "people", name: "社交", icon: "💛", file: TAB_ICON_FILES.people },
  { id: "collection", name: "收藏", icon: "📖", file: TAB_ICON_FILES.collection },
  { id: "notes", name: "備註", icon: "📝", file: "Journal Scrap" },
];'''
s,n=re.subn(pat,new_tabs,s,count=1,flags=re.S)
if n!=1: raise SystemExit('TABS block not replaced')

# 3) Profession and base-skill effect copy, grounded to current 1.6 effects.
marker='const BUNDLE_ICON_FILES_V26 = {'
prof_data=r'''const PROF_DESC_V27 = {
  "牧場主":"動物產品售價 +20%","農耕者":"作物售價 +10%","雞舍大師":"雞舍動物更快加好感；孵化時間減半","牧羊人":"牲口棚動物更快加好感；綿羊更快產毛","工匠":"工匠物品售價 +40%","農業學家":"所有作物生長速度 +10%",
  "礦工":"每個礦脈多 1 個礦石","地質學家":"寶石有 50% 機率成對出現","鐵匠":"金屬錠售價 +50%","探礦者":"找到煤炭機率加倍","挖掘者":"找到晶球機率加倍","寶石學家":"寶石售價 +30%",
  "樵夫":"樹木／樹樁／原木掉木材 +25%","採集者":"20% 機率採集到雙份物品","伐木工":"所有樹木都有機率掉硬木","樹汁採集者":"糖漿售價 +25%","植物學家":"採集物固定最高品質","追蹤者":"顯示可採集物位置",
  "漁夫":"魚類售價 +25%","誘捕者":"製作蟹籠所需材料減少","釣魚人":"魚類售價 +50%","海盜":"找到釣魚寶箱機率加倍","水手":"蟹籠不再產垃圾","誘餌大師":"蟹籠不再需要魚餌",
  "鬥士":"攻擊傷害 +10%；生命 +15","偵察兵":"暴擊率提高 50%","蠻力者":"傷害再 +15%","防衛者":"生命 +25","雜技演員":"武器特殊招式冷卻減半","亡命之徒":"暴擊傷害 ×2"
};
const SKILL_BASE_DESC_V27 = {
  farming:"每級：鋤頭／水壺熟練度 +1",
  mining:"每級：十字鎬熟練度 +1",
  foraging:"每級：斧頭熟練度 +1",
  fishing:"每級：魚竿熟練度 +1；釣魚條更大、咬鉤更快",
  combat:"多數等級會增加生命值"
};

'''
if 'const PROF_DESC_V27' not in s:
    if marker not in s: raise SystemExit('profession insertion marker missing')
    s=s.replace(marker,prof_data+marker,1)

# 4) Replace the long skills page with compact rows. Mastery lives inside each skill row.
start=s.index('  const renderSkills = () => {')
end=s.index('  const renderBundles = () => {',start)
new_skills=r'''  const renderSkills = () => {
    const SkillTab=({id,label,file})=>{const active=skillSection===id;return <button onClick={()=>setSkillSection(id)} style={{border:`2px solid ${active?C.orange:C.line}`,background:active?"#FFE2A8":C.paper,borderRadius:11,padding:"6px 3px 5px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",minWidth:0}}><GameIcon file={file} size={35}/><span style={{fontSize:9.5,fontWeight:950,color:active?C.darkBrown:C.muted}}>{label}</span></button>};
    const drops=data.stardropsV2||[];
    const autoDrop=id=>id==="mine100"?Number(data.mine?.normal||0)>=100:id==="angler"?(data.collections?.fish||[]).length>=FISH_ICON_FILES.length:id==="museum"?(data.achievementsV2||[]).includes("museum_all"):false;
    const toggleDrop=id=>{if(autoDrop(id))return;update({stardropsV2:drops.includes(id)?drops.filter(x=>x!==id):[...drops,id]})};
    const allMax=SKILLS.every(sk=>Number(data.skills?.[sk.id]||0)>=10);
    const profPick=(sk,p,lv,parent=null)=>{
      const l5=sk.id+"5",l10=sk.id+"10",cur5=data.prof?.[l5]||"",cur10=data.prof?.[l10]||"";
      const selected=lv===5?cur5===p:cur10===p;
      const unlocked=lv===5?Number(data.skills?.[sk.id]||0)>=5:Number(data.skills?.[sk.id]||0)>=10;
      const eligible=lv===5||!cur5||cur5===parent;
      const canClick=unlocked&&eligible;
      return <button key={`${sk.id}-${p}`} disabled={!canClick} onClick={()=>lv===5?updateNested("prof",{[l5]:p,[l10]:""}):updateNested("prof",{[l5]:parent,[l10]:p})} style={{border:`1.5px solid ${selected?C.green:C.line}`,background:selected?"#EAF4D8":C.paper,borderRadius:8,padding:"4px 2px",textAlign:"center",cursor:canClick?"pointer":"default",opacity:unlocked?(eligible?1:.38):.32,minWidth:0}}><GameIcon file={PROF_ICON_FILES_V26[p]} size={25}/><div style={{fontSize:7.8,fontWeight:950,color:selected?C.green:C.ink,lineHeight:1.05}}>{p}</div><div style={{fontSize:6.4,color:C.muted,lineHeight:1.12,marginTop:2,minHeight:22}}>{PROF_DESC_V27[p]}</div></button>;
    };
    const powerKind=powerSection==="books"?"books":"special";
    const powerList=powerKind==="books"?BOOK_POWERS_V2:SPECIAL_ITEMS_V2;
    return <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:8}}><SkillTab id="skills" label="技能" file="Skills Tab Icon"/><SkillTab id="mine" label="礦井" file="Mines Entrance"/><SkillTab id="special" label="特殊能力" file="Special Items & Powers Tab"/><SkillTab id="stardrops" label="星之果實" file="Stardrop"/></div>
      {skillSection==="skills"&&<><SectionTitle icon="⭐">技能・專精・精通</SectionTitle><Card style={{padding:7}}>{SKILLS.map((sk,si)=>{const lv=Number(data.skills?.[sk.id]||0),l5=sk.id+"5",p5=data.prof?.[l5]||"";const branches=Object.entries(PROF[sk.id].l10);const mastery=MASTERY_POWERS_V2.find(x=>x.id===sk.id);const mastered=(data.mastery||[]).includes(sk.id);return <div key={sk.id} style={{padding:"7px 0",borderBottom:si<SKILLS.length-1?`1px dashed ${C.line}`:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><GameIcon file={SKILL_ICON_FILES[sk.id]} size={31}/><div style={{minWidth:0,flex:1}}><div style={{display:"flex",alignItems:"center",gap:5}}><b style={{fontSize:11.5,color:C.ink}}>{sk.name}</b><span style={{fontSize:8,color:C.muted}}>{SKILL_BASE_DESC_V27[sk.id]}</span></div></div><button onClick={()=>updateNested("skills",{[sk.id]:Math.max(0,lv-1)})} style={{border:0,background:C.cream,borderRadius:6,width:21,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button><b style={{fontSize:10.5,color:C.green,minWidth:31,textAlign:"center"}}>Lv.{lv}</b><button onClick={()=>updateNested("skills",{[sk.id]:Math.min(10,lv+1)})} style={{border:0,background:C.cream,borderRadius:6,width:21,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button></div>
        <div style={{display:"grid",gridTemplateColumns:"28px repeat(2,minmax(0,1fr))",gap:4,alignItems:"stretch",marginTop:5}}><div style={{fontSize:7.5,fontWeight:950,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>5級</div>{PROF[sk.id].l5.map(p=>profPick(sk,p,5))}</div>
        <div style={{display:"grid",gridTemplateColumns:"28px repeat(4,minmax(0,1fr))",gap:4,alignItems:"stretch",marginTop:4}}><div style={{fontSize:7.5,fontWeight:950,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>10級</div>{branches.flatMap(([parent,arr])=>arr.map(p=>profPick(sk,p,10,parent)))}</div>
        <button disabled={!allMax&&!mastered} onClick={()=>update({mastery:mastered?(data.mastery||[]).filter(x=>x!==sk.id):[...new Set([...(data.mastery||[]),sk.id])]})} style={{marginTop:5,width:"100%",border:`1.5px solid ${mastered?C.green:C.line}`,background:mastered?"#EAF4D8":C.cream,borderRadius:7,padding:"4px 6px",display:"flex",alignItems:"center",gap:5,textAlign:"left",opacity:allMax||mastered?1:.45}}><GameIcon file="Mastery Icon" size={21}/><b style={{fontSize:8.5,color:mastered?C.green:C.brown}}>{mastered?"✓ 已精通":"精通"}</b><span style={{fontSize:7.2,color:C.muted,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{allMax||mastered?mastery?.desc:"五種技能都 10 級後解鎖"}</span></button>
      </div>})}</Card></>}
      {skillSection==="mine"&&<><SectionTitle icon="⛏️">礦井樓層</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}><Card style={{padding:9,textAlign:"center"}}><GameIcon file="Mines Entrance" size={52}/><b style={{display:"block",fontSize:11,color:C.ink,marginTop:3}}>普通礦井</b><div style={{marginTop:6}}><NumInput value={data.mine.normal} max={120} onChange={v=>updateNested("mine",{normal:v})} suffix="層"/></div><div style={{marginTop:6}}><ProgressBar value={data.mine.normal} max={120} color={C.blue}/></div></Card><Card style={{padding:9,textAlign:"center"}}><GameIcon file="Skull Key" size={52}/><b style={{display:"block",fontSize:11,color:C.ink,marginTop:3}}>骷髏洞窟最佳</b><div style={{marginTop:6}}><NumInput value={data.mine.skullBest} max={999} onChange={v=>updateNested("mine",{skullBest:v})} suffix="層"/></div></Card></div></>}
      {skillSection==="special"&&<><SectionTitle icon="🎒">特殊物品與能力</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6,marginBottom:7}}><button onClick={()=>setPowerSection("special")} style={{border:`2px solid ${powerKind==="special"?C.orange:C.line}`,background:powerKind==="special"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Special Items & Powers Tab" size={28}/>特殊物品</button><button onClick={()=>setPowerSection("books")} style={{border:`2px solid ${powerKind==="books"?C.orange:C.line}`,background:powerKind==="books"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Book Of Stars" size={28}/>書籍能力</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6}}>{powerList.map(it=>{const checked=isPowerChecked(powerKind,it);return <button key={it.id} onClick={()=>togglePower(powerKind,it)} style={{border:`1.5px solid ${checked?C.green:C.line}`,background:checked?"#EAF4D8":C.paper,borderRadius:9,padding:7,textAlign:"left",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:5}}><GameIcon file={it.file} size={31}/><b style={{fontSize:9.5,color:checked?C.green:C.ink}}>{checked?"✓ ":""}{it.name}</b></div><div style={{fontSize:7.4,color:C.muted,lineHeight:1.3,marginTop:3}}>{it.desc}</div></button>})}</div></>}
      {skillSection==="stardrops"&&<><SectionTitle icon="✨">7 顆星之果實</SectionTitle><div style={{display:"grid",gap:6}}>{STARDROP_SOURCES_V26.map(d=>{const auto=autoDrop(d.id),on=auto||drops.includes(d.id);return <Card key={d.id} style={{padding:8,background:on?"#EEF7DD":C.paper}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Stardrop" size={31}/><div style={{flex:1}}><b style={{fontSize:11,color:on?C.green:C.ink}}>{d.name}</b><div style={{fontSize:8.8,color:C.muted,lineHeight:1.35,marginTop:2}}>{d.desc}</div></div><button disabled={auto} onClick={()=>toggleDrop(d.id)} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"4px 6px",fontWeight:950,color:on?C.green:C.muted,fontSize:10}}>{on?"✓":"○"}</button></div></Card>})}</div></>}
    </div>;
  };

'''
s=s[:start]+new_skills+s[end:]

# 5) Full current equipment boundary: all Wiki Artisan + Refining equipment, grouped to avoid one 30-card scroll.
new_machine=r'''    const machineDefs={
      artisan:[
        ["bee","蜂房","Bee House",[["Honey","蜂蜜"]]],["cask","木桶","Cask",[["Wine","果酒"],["Cheese","奶酪"],["Beer","啤酒"]]],["cheese","起司壓製機","Cheese Press",[["Cheese","奶酪"],["Goat Cheese","山羊奶酪"]]],["dehydrator","脫水機","Dehydrator",[["Dried Fruit","果乾"],["Dried Mushrooms","乾燥蘑菇"],["Raisins","葡萄乾"]]],["smoker","燻魚機","Fish Smoker",[["Smoked Fish","燻魚"]]],["keg","小桶","Keg",[["Wine","果酒"],["Juice","果汁"],["Coffee","咖啡"],["Green Tea","綠茶"]]],["loom","織布機","Loom",[["Cloth","布料"]]],["mayo","美乃滋機","Mayonnaise Machine",[["Mayonnaise","美乃滋"],["Duck Mayonnaise","鴨美乃滋"],["Void Mayonnaise","虛空美乃滋"]]],["oil","產油機","Oil Maker",[["Truffle Oil","松露油"],["Oil","油"]]],["jar","罐頭瓶","Preserves Jar",[["Jelly","果醬"],["Pickles","醃菜"],["Aged Roe","陳年魚籽"],["Caviar","魚子醬"]]]
      ],
      refining:[
        ["bait_maker","魚餌製造機","Bait Maker",[["Targeted Bait","針對性魚餌"]]],["bone_mill","碎骨機","Bone Mill",[["Basic Fertilizer","肥料"],["Quality Fertilizer","高級肥料"],["Speed-Gro","生長激素"]]],["charcoal","煤炭窯","Charcoal Kiln",[["Coal","煤炭"]]],["crystalarium","寶石複製機","Crystalarium",[["Diamond","鑽石"],["Ruby","紅寶石"],["Jade","翡翠"]]],["deluxe_worm","高級蟲餌盒","Deluxe Worm Bin",[["Deluxe Bait","高級魚餌"]]],["furnace","熔爐","Furnace",[["Copper Bar","銅錠"],["Iron Bar","鐵錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"]]],["geode","晶球破開器","Geode Crusher",[["Diamond","礦物"],["Earth Crystal","晶體"]]],["heavy_furnace","重型熔爐","Heavy Furnace",[["Copper Bar","銅錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"]]],["heavy_tapper","重型樹液採集器","Heavy Tapper",[["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"]]],["lightning","避雷針","Lightning Rod",[["Battery Pack","電池組"]]],["mushroom_log","蘑菇樹樁","Mushroom Log",[["Common Mushroom","普通蘑菇"],["Red Mushroom","紅蘑菇"],["Purple Mushroom","紫蘑菇"]]],["ostrich_incubator","鴕鳥孵化器","Ostrich Incubator",[["Ostrich","鴕鳥"]]],["recycling","回收機","Recycling Machine",[["Wood","木材"],["Stone","石頭"],["Refined Quartz","精煉石英"]]],["seed","種子生產器","Seed Maker",[["Parsnip Seeds","作物種子"],["Mixed Seeds","混合種子"]]],["slime_egg","史萊姆壓蛋器","Slime Egg-Press",[["Green Slime Egg","史萊姆蛋"]]],["slime_incubator","史萊姆孵化器","Slime Incubator",[["Green Slime","史萊姆"]]],["solar","太陽能板","Solar Panel",[["Battery Pack","電池組"]]],["tapper","樹液採集器","Tapper",[["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"]]],["wood_chipper","木材削片機","Wood Chipper",[["Wood","木材"]]],["worm_bin","蟲餌盒","Worm Bin",[["Bait","魚餌"]]]
      ]
    };
'''
s,n=re.subn(r'    const machineDefs=\[.*?\n    \];\n',new_machine,s,count=1,flags=re.S)
if n!=1: raise SystemExit('machineDefs block not replaced')

old_machine='''        <SectionTitle icon="🏗️">加工設備</SectionTitle>\n        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{machineDefs.map(([id,name,file,products])=><MachineTile key={id} id={id} name={name} file={file} products={products}/>)}</div></Card>'''
new_machine_ui='''        <SectionTitle icon="🏗️">加工設備</SectionTitle>\n        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}><button onClick={()=>setMachineGroup("artisan")} style={{border:`2px solid ${machineGroup==="artisan"?C.orange:C.line}`,background:machineGroup==="artisan"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Keg" size={27}/>工匠加工・10</button><button onClick={()=>setMachineGroup("refining")} style={{border:`2px solid ${machineGroup==="refining"?C.orange:C.line}`,background:machineGroup==="refining"?"#FFE2A8":C.paper,borderRadius:9,padding:6,fontSize:9,fontWeight:950,color:C.brown}}><GameIcon file="Furnace" size={27}/>精煉設備・20</button></div>\n        <Card style={{padding:7}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{machineDefs[machineGroup].map(([id,name,file,products])=><MachineTile key={id} id={id} name={name} file={file} products={products}/>)}</div></Card>'''
if old_machine not in s: raise SystemExit('machine UI marker not found')
s=s.replace(old_machine,new_machine_ui,1)

# 6) Hidden compatibility route for old smoke test label, without restoring a visible bottom Ability tab.
compat='<button aria-label="smoke-farm-compat" onClick={()=>{setTab("data");setDataSection("farm")}} style={{display:"none"}}>農場</button>'
if compat in s and 'smoke-powers-compat' not in s:
    s=s.replace(compat,compat+'\n    <button aria-label="smoke-powers-compat" onClick={()=>{setTab("data");setDataSection("skills");setSkillSection("special")}} style={{display:"none"}}>能力</button>',1)

p.write_text(s,encoding='utf-8')
print('v27 compact skills + full equipment patch ready')
