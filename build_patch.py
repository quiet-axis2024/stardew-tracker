from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'build/entry.jsx')
s = path.read_text(encoding='utf-8')

def repl(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'build_patch: marker not found: {label}')
    s = s.replace(old, new, 1)

s = s.replace('https://wiki.stardewvalley.net/Special:Redirect/file/', 'https://stardewvalleywiki.com/Special:Redirect/file/')

anchor = 'const iconMap = (names) => Object.fromEntries(names.map((name, i) => [i, WIKI_FILE(name)]));\n'
inject = r'''

const GAME_FILE = WIKI_FILE;
const UI_ICON_FILES = {
  "📅":"Calendar", "📊":"Stardrop", "🏆":"Stardrop", "🎒":"Inventory Tab", "⭐":"Skills Tab Icon",
  "⛏️":"Pickaxe", "✨":"Stardrop", "📦":"Golden Scroll", "🏠":"House (tier 1)", "🔧":"Pickaxe",
  "🏗️":"Silo", "🐔":"White Chicken", "🐄":"Cow", "🐟":"Sunfish", "💛":"Social Tab", "💘":"Bouquet",
  "🏘️":"Social Tab", "📖":"Collections Tab", "📝":"Special Items & Powers Tab", "📤":"Letter", "💾":"Chest",
  "🔗":"Social Tab", "📱":"Inventory Tab"
};
const TAB_ICON_FILES = {
  overview:"Inventory Tab", skills:"Skills Tab Icon", bundles:"Golden Scroll", farm:"Animals Tab",
  people:"Social Tab", collection:"Collections Tab", notes:"Special Items & Powers Tab"
};
const SKILL_ICON_FILES = { farming:"Farming Skill Icon", mining:"Mining Skill Icon", foraging:"Foraging Skill Icon", fishing:"Fishing Skill Icon", combat:"Combat Skill Icon" };
const TOOL_ICON_FILES = { watering:"Watering Can", pickaxe:"Pickaxe", axe:"Axe", hoe:"Hoe", trash:"Trash Can" };
const ANIMAL_ICON_FILES = { 雞:"White Chicken", 藍雞:"Blue Chicken", 虛空雞:"Void Chicken", 金雞:"Golden Chicken", 鴨:"Duck", 兔子:"Rabbit", 恐龍:"Dinosaur", 牛:"Cow", 山羊:"Goat", 綿羊:"Sheep", 豬:"Pig", 鴕鳥:"Ostrich" };
const ROOM_ICON_FILES = { crafts:"Junimo Icon", pantry:"Parsnip", fishtank:"Sunfish", boiler:"Copper Bar", bulletin:"Bulletin Board", vault:"Gold" };
const NPC_ICON_FILES = {
  阿比蓋爾:"Abigail Icon", 艾蜜麗:"Emily Icon", 海莉:"Haley Icon", 莉亞:"Leah Icon", 瑪魯:"Maru Icon", 潘妮:"Penny Icon",
  亞歷克斯:"Alex Icon", 艾利歐特:"Elliott Icon", 哈維:"Harvey Icon", 山姆:"Sam Icon", 塞巴斯蒂安:"Sebastian Icon", 謝恩:"Shane Icon",
  卡洛琳:"Caroline Icon", 克林特:"Clint Icon", 德米特里厄斯:"Demetrius Icon", 艾芙琳:"Evelyn Icon", 喬治:"George Icon", 格斯:"Gus Icon",
  賈斯:"Jas Icon", 喬迪:"Jodi Icon", 肯特:"Kent Icon", 劉易斯:"Lewis Icon", 萊納斯:"Linus Icon", 瑪妮:"Marnie Icon", 潘姆:"Pam Icon",
  皮埃爾:"Pierre Icon", 羅賓:"Robin Icon", 文森特:"Vincent Icon", 威利:"Willy Icon", 法師:"Wizard Icon", 桑迪:"Sandy Icon",
  克羅巴斯:"Krobus Icon", 矮人:"Dwarf Icon", 雷歐:"Leo Icon"
};

function GameIcon({ file, size = 28, alt = "" }) {
  if (!file) return null;
  return <img src={GAME_FILE(file)} alt={alt} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }}
    style={{ width:size, height:size, objectFit:"contain", imageRendering:"pixelated", flex:"0 0 auto" }} />;
}

const CALENDAR_DATA = {
  春: {
    birthdays: {4:"肯特",7:"劉易斯",10:"文森特",14:"海莉",18:"潘姆",20:"謝恩",26:"皮埃爾",27:"艾蜜麗"},
    festivals: {13:"彩蛋節",15:"沙漠節",16:"沙漠節",17:"沙漠節",24:"花舞節"},
    other: {15:"鮭莓季",16:"鮭莓季",17:"鮭莓季＋煤渣森林金罐",18:"鮭莓季"}
  },
  夏: {
    birthdays: {4:"賈斯",8:"格斯",10:"瑪魯",13:"亞歷克斯",17:"山姆",19:"德米特里厄斯",22:"矮人",24:"威利",26:"雷歐"},
    festivals: {11:"夏威夷宴會",20:"鱒魚大賽",21:"鱒魚大賽",28:"月光水母起舞"},
    other: {12:"海灘採集增加",13:"海灘採集增加",14:"海灘採集增加"}
  },
  秋: {
    birthdays: {2:"潘妮",5:"艾利歐特",11:"喬迪",13:"阿比蓋爾",15:"桑迪",18:"瑪妮",21:"羅賓",24:"喬治"},
    festivals: {16:"星露谷展覽會",27:"萬靈節"},
    other: {8:"黑莓季",9:"黑莓季",10:"黑莓季",11:"黑莓季"}
  },
  冬: {
    birthdays: {1:"克羅巴斯",3:"萊納斯",7:"卡洛琳",10:"塞巴斯蒂安",14:"哈維",17:"法師",20:"艾芙琳",23:"莉亞",26:"克林特"},
    festivals: {8:"冰雪節",12:"魷魚節",13:"魷魚節",15:"夜市",16:"夜市",17:"夜市",25:"冬日星盛宴"},
    other: {}
  }
};

const SEASON_COLORS = { 春:"#80A85B", 夏:"#E38B39", 秋:"#B9663B", 冬:"#5C91B8" };
function parseFishMeta(info = "") {
  const seasons = info.includes("全季") || !/[春夏秋冬]/.test(info) ? [...SEASONS] : SEASONS.filter(x => info.includes(x));
  const weather = info.includes("雨") ? "雨" : info.includes("晴") ? "晴" : "任意";
  const areas = [];
  if (info.includes("海") || info.includes("海灘") || info.includes("海洋")) areas.push("海洋");
  if (info.includes("河")) areas.push("河流");
  if (info.includes("湖")) areas.push("湖泊");
  if (info.includes("礦井") || info.includes("火山")) areas.push("礦井");
  if (info.includes("沙漠")) areas.push("沙漠");
  if (info.includes("下水道") || info.includes("蟲穴") || info.includes("沼澤") || info.includes("秘密森林")) areas.push("特殊");
  if (info.includes("薑島") || info.includes("海盜灣")) areas.push("薑島");
  if (info.includes("夜市")) areas.push("夜市");
  if (!areas.length) areas.push("其他");
  let time = "全天/不限";
  const m = info.match(/(\d{1,2})-(\d{1,2})點/);
  if (m) time = `${m[1]}–${m[2]}點`;
  else if (info.includes("傍晚")) time = "傍晚後";
  else if (info.includes("早晚")) time = "早／晚";
  else if (info.includes("早上")) time = "早上";
  else if (info.includes("晚間")) time = "晚間";
  else if (info.includes("夜")) time = "夜間";
  return { seasons, weather, areas:[...new Set(areas)], time };
}
function FishTags({ meta, compact = false }) {
  const chip = (text, bg, color="#3B2C20") => <span key={text} style={{fontSize:compact?8.5:10,fontWeight:900,padding:compact?"1px 4px":"2px 6px",borderRadius:8,background:bg,color,whiteSpace:"nowrap"}}>{text}</span>;
  const seasonTags = meta.seasons.length === 4 ? ["全季"] : meta.seasons;
  return <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:compact?"center":"flex-start",marginTop:compact?3:5}}>
    {seasonTags.map(s=>chip(s, s==="全季"?"#E8E0CF":SEASON_COLORS[s]+"30", s==="全季"?"#6B3E1E":SEASON_COLORS[s]))}
    {meta.areas.slice(0,compact?1:3).map(a=>chip(a,a==="海洋"?"#DDECF7":a==="河流"?"#DDF2ED":a==="湖泊"?"#E5E4FA":a==="薑島"?"#F5E7BE":"#EEE6D7"))}
    {chip(meta.weather, meta.weather==="雨"?"#D8E8FA":meta.weather==="晴"?"#FFF0B8":"#EEE6D7")}
    {!compact && chip(meta.time,"#F2E5CE")}
  </div>;
}
'''
repl(anchor, anchor + inject, 'iconMap')

old_tabs = '''const TABS = [
  { id: "overview", name: "總覽", icon: "🏡" },
  { id: "skills", name: "技能", icon: "⭐" },
  { id: "bundles", name: "社區", icon: "📦" },
  { id: "farm", name: "農場", icon: "🐄" },
  { id: "people", name: "社交", icon: "💛" },
  { id: "collection", name: "圖鑑", icon: "📖" },
  { id: "notes", name: "備註", icon: "📝" },
];'''
new_tabs = '''const TABS = [
  { id: "overview", name: "總覽", icon: "🏡", file: TAB_ICON_FILES.overview },
  { id: "skills", name: "技能", icon: "⭐", file: TAB_ICON_FILES.skills },
  { id: "bundles", name: "社區", icon: "📦", file: TAB_ICON_FILES.bundles },
  { id: "farm", name: "農場", icon: "🐄", file: TAB_ICON_FILES.farm },
  { id: "people", name: "社交", icon: "💛", file: TAB_ICON_FILES.people },
  { id: "collection", name: "圖鑑", icon: "📖", file: TAB_ICON_FILES.collection },
  { id: "notes", name: "備註", icon: "📝", file: TAB_ICON_FILES.notes },
];'''
repl(old_tabs, new_tabs, 'tabs')

old = '''function SectionTitle({ icon, children, right }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 8px" }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ fontSize: 17, fontWeight: 900, color: C.darkBrown }}>{children}</span>
    {right && <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: C.muted }}>{right}</span>}
  </div>;
}'''
new = '''function SectionTitle({ icon, children, right }) {
  const file = UI_ICON_FILES[icon];
  return <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 8px" }}>
    {file ? <GameIcon file={file} size={27}/> : <span style={{ fontSize: 20 }}>{icon}</span>}
    <span style={{ fontSize: 17, fontWeight: 900, color: C.darkBrown }}>{children}</span>
    {right && <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: C.muted }}>{right}</span>}
  </div>;
}'''
repl(old, new, 'SectionTitle')

state_anchor = '''  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedNPC, setExpandedNPC] = useState(null);
  const saveTimer = useRef(null);'''
state_new = '''  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedNPC, setExpandedNPC] = useState(null);
  const [fishSeason, setFishSeason] = useState("當季");
  const [fishWeather, setFishWeather] = useState("全部");
  const [fishArea, setFishArea] = useState("全部");
  const [fishMissingOnly, setFishMissingOnly] = useState(false);
  const profileInputRef = useRef(null);
  const saveTimer = useRef(null);'''
repl(state_anchor, state_new, 'states')

rp_anchor = '''  const rp = roomProgress();

  const renderHeader = () => <>'''
inside = r'''  const rp = roomProgress();

  const currentCalendar = CALENDAR_DATA[data.base.season] || CALENDAR_DATA.春;
  const dayCalendarItems = (day) => {
    const out = [];
    if (currentCalendar.festivals[day]) out.push({type:"festival", text:currentCalendar.festivals[day]});
    if (currentCalendar.birthdays[day] && !(data.base.season === "春" && day === 4 && data.base.year < 2)) out.push({type:"birthday", text:`${currentCalendar.birthdays[day]}生日`});
    if (currentCalendar.other[day]) out.push({type:"other", text:currentCalendar.other[day]});
    if (data.base.season === "夏" && day === 3 && data.base.year === 1) out.push({type:"other", text:"地震後鐵路／溫泉區開放"});
    return out;
  };

  const handleProfileUpload = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const canvas = document.createElement("canvas");
      canvas.width = 180; canvas.height = 240;
      const ctx = canvas.getContext("2d");
      const ratio = img.width / img.height;
      if (ratio > 1.6 && ratio < 1.9) {
        const sx = img.width * 0.298, sy = img.height * 0.548, sw = img.width * 0.092, sh = img.height * 0.218;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      } else {
        const sideW = Math.min(img.width, img.height * 0.76), sideH = Math.min(img.height, img.width / 0.76);
        ctx.drawImage(img, (img.width-sideW)/2, (img.height-sideH)/2, sideW, sideH, 0, 0, canvas.width, canvas.height);
      }
      const portrait = canvas.toDataURL("image/jpeg", 0.84);
      update({ profilePortrait: portrait });
    } catch (e) {
      alert("無法讀取這張圖片");
    } finally { URL.revokeObjectURL(url); }
  };

  const renderProfileCard = () => <>
    <SectionTitle icon="🎒">農場名片</SectionTitle>
    <Card style={{padding:11}}>
      <div style={{display:"grid",gridTemplateColumns:"92px minmax(0,1fr)",gap:12,alignItems:"center"}}>
        <button onClick={()=>profileInputRef.current?.click()} style={{width:92,height:120,border:`2px solid ${C.line}`,borderRadius:9,overflow:"hidden",background:"#EFE4C4",padding:0,cursor:"pointer"}}>
          {data.profilePortrait ? <img src={data.profilePortrait} alt="農夫角色" style={{width:"100%",height:"100%",objectFit:"cover",imageRendering:"pixelated"}}/> : <div style={{fontSize:11,color:C.muted,fontWeight:900,lineHeight:1.5}}>上傳 Switch<br/>＋ 資料畫面<br/><span style={{fontSize:22}}>＋</span></div>}
        </button>
        <div style={{minWidth:0}}>
          <div style={{fontSize:17,fontWeight:950,color:C.darkBrown}}>{data.base.farm}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:2}}>{data.base.platform}</div>
          <div style={{fontSize:13,fontWeight:900,marginTop:8}}>第 {data.base.year} 年・{data.base.season} {data.base.day} 日</div>
          <div style={{fontSize:12,color:C.brown,marginTop:4}}>持有 {Number(data.base.money||0).toLocaleString()}g</div>
          <div style={{fontSize:12,color:C.brown}}>累計 {Number(data.base.totalIncome||0).toLocaleString()}g</div>
          <button onClick={()=>profileInputRef.current?.click()} style={{marginTop:8,border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:"5px 8px",fontWeight:900,color:C.brown,fontSize:11}}>更換角色畫面</button>
          {data.profilePortrait && <button onClick={()=>update({profilePortrait:""})} style={{marginLeft:5,border:0,background:"transparent",color:C.red,fontSize:11,fontWeight:900}}>移除</button>}
        </div>
      </div>
      <input ref={profileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{handleProfileUpload(e.target.files?.[0]);e.target.value=""}}/>
      <div style={{fontSize:10.5,color:C.muted,marginTop:7,lineHeight:1.45}}>會自動裁出 Switch「＋」玩家資料頁中的人物區域；農場、日期與金錢沿用手帳目前資料。裁出的角色圖會跟進度一起保存。</div>
    </Card>
  </>;

  const renderCalendar = () => <>
    <SectionTitle icon="📅" right={`${data.base.season}季`}>本季日曆</SectionTitle>
    <Card style={{padding:9}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:4}}>
        {Array.from({length:28},(_,i)=>i+1).map(day=>{
          const items=dayCalendarItems(day); const current=day===data.base.day;
          const fest=items.some(x=>x.type==="festival"), birthday=items.some(x=>x.type==="birthday"), other=items.some(x=>x.type==="other");
          return <button key={day} onClick={()=>updateBase({day})} title={items.map(x=>x.text).join("／")} style={{position:"relative",minHeight:52,border:`2px solid ${current?C.orange:fest?"#D98B35":birthday?"#C76B82":other?C.green:C.line}`,background:current?"#FFE1BC":fest?"#FFF0D5":birthday?"#FBE3EA":other?"#E8F3D5":C.paper,borderRadius:8,padding:"4px 2px",color:C.ink,cursor:"pointer"}}>
            <div style={{fontSize:11,fontWeight:950}}>{day}</div>
            <div style={{fontSize:8.5,lineHeight:1.1,fontWeight:800,marginTop:2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{items.map(x=>x.text).join("／")}</div>
          </button>;
        })}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8,fontSize:10,fontWeight:800,color:C.muted}}><span>橘＝節日</span><span>粉＝生日</span><span>綠＝季節事件</span><span>點日期可直接切換</span></div>
      {dayCalendarItems(data.base.day).length>0 && <div style={{marginTop:8,padding:"7px 9px",borderRadius:8,background:"#FFF1CF",fontSize:12,fontWeight:900,color:C.brown}}>今天：{dayCalendarItems(data.base.day).map(x=>x.text).join("、")}</div>}
    </Card>
  </>;

  const renderHeader = () => <>'''
repl(rp_anchor, inside, 'component helpers')

s = s.replace('<span style={{ fontSize: 29 }}>🌱</span>', '<GameIcon file="Junimo Icon" size={38}/>', 1)

old = '''  const renderOverview = () => <div>
    <SectionTitle icon="📅">日期與資金</SectionTitle>'''
new = '''  const renderOverview = () => <div>
    {renderProfileCard()}
    {renderCalendar()}
    <SectionTitle icon="📅">日期與資金</SectionTitle>'''
repl(old, new, 'overview insert')

s = s.replace('<span style={{ fontSize: 20 }}>{s.icon}</span><b style={{ flex: 1, color: C.ink }}>{s.name}</b>', '<GameIcon file={SKILL_ICON_FILES[s.id]} size={28}/><b style={{ flex: 1, color: C.ink }}>{s.name}</b>', 1)
s = s.replace('<span style={{ fontSize: 22 }}>{r.icon}</span><div style={{ flex: 1 }}>', '<GameIcon file={ROOM_ICON_FILES[r.id]} size={34}/><div style={{ flex: 1 }}>', 1)
s = s.replace('<span style={{ fontSize: 19 }}>{icon}</span><b style={{ width: 58 }}>{name}</b>', '<GameIcon file={TOOL_ICON_FILES[id]} size={27}/><b style={{ width: 58 }}>{name}</b>', 1)

animal_old = '>{a.icon} {a.name}<span style={{ marginLeft: "auto" }}>'
if s.count(animal_old) != 2:
    raise SystemExit(f'build_patch: expected 2 animal markers, found {s.count(animal_old)}')
s = s.replace(animal_old, '><GameIcon file={ANIMAL_ICON_FILES[a.name]} size={30}/><span>{a.name}</span><span style={{ marginLeft: "auto" }}>', 2)

old_social = '<div onClick={()=>setExpandedNPC(open?null:n)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}><b style={{flex:1,color:C.ink}}>{n}</b><span style={{fontSize:12,color:C.red,fontWeight:900}}>♥ {hearts}/{g.max}</span>'
new_social = '<div onClick={()=>setExpandedNPC(open?null:n)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}><GameIcon file={NPC_ICON_FILES[n]} size={38}/><b style={{flex:1,color:C.ink}}>{n}</b><span style={{fontSize:12,color:C.red,fontWeight:900}}>♥ {hearts}/{g.max}</span>'
repl(old_social, new_social, 'social npc')

start = s.index('  const renderCollection = () => {')
end = s.index('\n  const buildSummary = () => {', start)
new_collection = r'''  const renderCollection = () => {
    const c = COLLECTIONS[selectedCollection];
    const got = data.collections[selectedCollection] || [];
    const effectiveSeason = fishSeason === "當季" ? data.base.season : fishSeason;
    const visible = c.items.map((it,i)=>({it,i,meta:selectedCollection==="fish"?parseFishMeta(c.info?.[i]||""):null})).filter(row=>{
      if(selectedCollection!=="fish") return true;
      const m=row.meta;
      if(effectiveSeason!=="全部" && !m.seasons.includes(effectiveSeason)) return false;
      if(fishWeather!=="全部" && m.weather!=="任意" && m.weather!==fishWeather) return false;
      if(fishArea!=="全部" && !m.areas.includes(fishArea)) return false;
      if(fishMissingOnly && got.includes(row.i)) return false;
      return true;
    });
    return <div>
      <SectionTitle icon="📖">圖鑑</SectionTitle>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.entries(COLLECTIONS).map(([k,v])=><Pill key={k} active={selectedCollection===k} onClick={()=>{setSelectedCollection(k);setSelectedItem(null)}}>{v.icon} {v.name}</Pill>)}</div>
      <Card style={{marginTop:10,padding:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:900,color:C.muted,marginBottom:5}}><span>{c.name}</span><span>{got.length}/{c.items.length}</span></div><ProgressBar value={got.length} max={c.items.length}/></Card>
      {selectedCollection==="fish" && <Card style={{marginTop:9,padding:9,background:"#FFF4D8"}}>
        <div style={{fontSize:11,fontWeight:950,color:C.brown,marginBottom:5}}>快速找魚</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{["當季","春","夏","秋","冬","全部"].map(x=><Pill key={x} small active={fishSeason===x} onClick={()=>setFishSeason(x)}>{x}</Pill>)}</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>{["全部","晴","雨"].map(x=><Pill key={x} small active={fishWeather===x} onClick={()=>setFishWeather(x)}>{x==="全部"?"全部天氣":x}</Pill>)}</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>{["全部","河流","湖泊","海洋","礦井","沙漠","特殊","薑島","夜市"].map(x=><Pill key={x} small active={fishArea===x} onClick={()=>setFishArea(x)}>{x==="全部"?"全部地區":x}</Pill>)}</div>
        <label style={{display:"flex",alignItems:"center",gap:6,marginTop:7,fontSize:11,fontWeight:900,color:C.brown}}><input type="checkbox" checked={fishMissingOnly} onChange={e=>setFishMissingOnly(e.target.checked)}/>只看尚未收集</label>
        <div style={{fontSize:10,color:C.muted,marginTop:5}}>顯示 {visible.length} 項；「任意」天氣的魚在晴／雨篩選中都會保留。</div>
      </Card>}
      {selectedItem != null && <Card style={{marginTop:10,background:"#FFF9E8"}}><div style={{display:"flex",gap:10,alignItems:"center"}}>{ICON_URLS[selectedCollection]?.[selectedItem] && <img src={ICON_URLS[selectedCollection][selectedItem]} alt="" style={{width:48,height:48,imageRendering:"pixelated",objectFit:"contain"}}/>}<div style={{flex:1,minWidth:0}}><b style={{fontSize:16,color:C.darkBrown}}>{c.items[selectedItem]}</b><div style={{fontSize:12,color:C.muted,marginTop:3}}>{c.info?.[selectedItem] || ""}</div>{selectedCollection==="fish"&&<FishTags meta={parseFishMeta(c.info?.[selectedItem]||"")}/>}</div><WikiBtn name={c.items[selectedItem]}/></div></Card>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:10}}>{visible.map(({it,i,meta})=>{
        const checked=got.includes(i);
        return <button key={i} onClick={()=>setSelectedItem(i)} onDoubleClick={()=>updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})} style={{position:"relative",border:`2px solid ${selectedItem===i?C.orange:checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 3px",minHeight:selectedCollection==="fish"?96:78,cursor:"pointer",boxShadow:`0 2px 5px ${C.shadow}`}}>
          <div style={{height:38,display:"flex",alignItems:"center",justifyContent:"center"}}>{ICON_URLS[selectedCollection]?.[i]?<img src={ICON_URLS[selectedCollection][i]} alt={it} loading="lazy" onError={e=>{e.currentTarget.style.opacity=.25}} style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/>:<span style={{fontSize:13,color:C.muted,fontWeight:900}}>{i+1}</span>}</div>
          <div style={{fontSize:9.5,fontWeight:900,color:C.ink,lineHeight:1.15,marginTop:2}}>{it}</div>
          {selectedCollection==="fish"&&<FishTags meta={meta} compact/>}
          <button onClick={e=>{e.stopPropagation();updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:2,border:0,background:"transparent",fontSize:13,color:checked?C.green:"#C9B99A",fontWeight:950}}>{checked?"✓":"○"}</button>
        </button>})}</div>
    </div>;
  };
'''
s = s[:start] + new_collection + s[end:]

old_nav = '<span style={{fontSize:19}}>{t.icon}</span><span style={{fontSize:10.5,fontWeight:900,color:tab===t.id?C.darkBrown:"#E8C88F"}}>{t.name}</span>'
new_nav = '<GameIcon file={t.file} size={34}/><span style={{fontSize:10.5,fontWeight:900,color:tab===t.id?C.darkBrown:"#E8C88F"}}>{t.name}</span>'
repl(old_nav, new_nav, 'bottom nav')

path.write_text(s, encoding='utf-8')
print('build_patch: Stardew UI/calendar/fish/profile enhancements applied')
