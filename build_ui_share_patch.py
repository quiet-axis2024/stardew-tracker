from pathlib import Path
import sys

p = Path(sys.argv[1] if len(sys.argv) > 1 else 'build/entry.jsx')
s = p.read_text(encoding='utf-8')

def repl(old, new, label, count=1):
    global s
    found = s.count(old)
    if found < count:
        raise SystemExit(f'build_ui_share_patch: marker not found: {label} (need {count}, found {found})')
    s = s.replace(old, new, count)

# -----------------------------------------------------------------------------
# 1) Fix exact Wiki asset names that were showing blank.
# -----------------------------------------------------------------------------
s = s.replace('trash:"Trash Can"', 'trash:"Copper Trash Can"')
s = s.replace('牛:"Cow"', '牛:"White Cow"')
s = s.replace('["shipping","出貨","ShippingBox"]', '["shipping","出貨","Mini-Shipping Bin"]')
# The wiki does not expose the collection-menu envelope as a stable standalone
# file; use the in-game paper sprite instead of leaving a broken image.
s = s.replace('["letters","信件","Letter"]', '["letters","信件","Secret Note Icon"]')
s = s.replace('notes:"Special Items & Powers Tab"', 'notes:"Journal Scrap"')

# -----------------------------------------------------------------------------
# 2) UI state: social group tabs + fish pond picker.
# -----------------------------------------------------------------------------
state_anchor = '  const [selectedPaper, setSelectedPaper] = useState(null);\n'
state_add = '''  const [selectedPaper, setSelectedPaper] = useState(null);\n  const [socialGroup, setSocialGroup] = useState("single");\n  const [pondPicker, setPondPicker] = useState(null);\n'''
if state_anchor in s and 'const [socialGroup, setSocialGroup]' not in s:
    s = s.replace(state_anchor, state_add, 1)

# -----------------------------------------------------------------------------
# 3) Farm fish ponds: visual fish selection, explicit field labels.
# -----------------------------------------------------------------------------
farm_fish_start = s.index('    <SectionTitle icon="🐟">魚塘</SectionTitle>')
farm_fish_end = s.index('\n  </div>;\n\n  const renderPeople', farm_fish_start)
new_fishpond = r'''    <SectionTitle icon="🐟">魚塘</SectionTitle>
    <div style={{ display: "grid", gap: 8 }}>{data.ponds.map((p,i) => {
      const fishIndex = COLLECTIONS.fish.items.indexOf(p.fish);
      return <Card key={i} style={{ padding: 10 }}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setPondPicker(pondPicker===i?null:i)} style={{flex:1,minWidth:0,border:`2px solid ${C.line}`,background:C.cream,borderRadius:9,padding:"7px 8px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer"}}>
            {fishIndex>=0 ? <img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:34,height:34,imageRendering:"pixelated",objectFit:"contain",flex:"0 0 auto"}}/> : <GameIcon file="Fish Pond" size={34}/>} 
            <span style={{flex:1,minWidth:0}}><span style={{display:"block",fontSize:10,color:C.muted,fontWeight:800}}>魚種</span><b style={{display:"block",fontSize:13,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.fish||"點這裡選魚"}</b></span>
            <span style={{fontSize:11,color:C.brown,fontWeight:900}}>{pondPicker===i?"▲":"▼"}</span>
          </button>
          <button onClick={()=>{setPondPicker(null);update({ponds:data.ponds.filter((_,j)=>j!==i)})}} style={{border:0,background:"transparent",color:C.red,fontSize:12,fontWeight:900,padding:6}}>刪除</button>
        </div>
        {pondPicker===i && <div style={{marginTop:7,padding:7,border:`1.5px solid ${C.line}`,borderRadius:9,background:"#FFF8E7",maxHeight:280,overflowY:"auto"}}>
          <div style={{fontSize:10.5,fontWeight:900,color:C.brown,marginBottom:6}}>選擇魚塘魚種</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5}}>{COLLECTIONS.fish.items.map((name,fi)=><button key={name} onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,fish:name};update({ponds});setPondPicker(null)}} style={{border:`1.5px solid ${name===p.fish?C.green:C.line}`,background:name===p.fish?C.lightGreen:C.paper,borderRadius:8,padding:"5px 2px",minHeight:62,cursor:"pointer"}}><img src={ICON_URLS.fish[fi]} alt="" loading="lazy" style={{width:30,height:30,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:8.5,fontWeight:900,color:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div></button>)}</div>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
          <label style={{fontSize:10.5,fontWeight:900,color:C.muted}}>目前數量<div style={{marginTop:3}}><NumInput value={p.count} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,count:v};update({ponds});}} suffix="隻"/></div></label>
          <label style={{fontSize:10.5,fontWeight:900,color:C.muted}}>容量上限<div style={{marginTop:3}}><NumInput value={p.cap} max={10} onChange={v=>{const ponds=[...data.ponds];ponds[i]={...p,cap:v};update({ponds});}} suffix="隻"/></div></label>
        </div>
        <label style={{display:"block",fontSize:10.5,fontWeight:900,color:C.muted,marginTop:7}}>下一次擴容需求<input value={p.need} onChange={e=>{const ponds=[...data.ponds];ponds[i]={...p,need:e.target.value};update({ponds});}} placeholder="例：萬象晶球 ×3／尚未觸發" style={{width:"100%",marginTop:3,border:`1.5px solid ${C.line}`,borderRadius:7,padding:6,fontSize:11,background:"#FFFCF0"}}/></label>
      </Card>;
    })}</div>
    <button onClick={()=>{setPondPicker(data.ponds.length);update({ponds:[...data.ponds,{fish:"",count:0,cap:3,need:""}]})}} style={{marginTop:8,width:"100%",border:`2px dashed ${C.line}`,background:C.cream,borderRadius:9,padding:9,fontWeight:900,color:C.brown}}>＋ 新增魚塘</button>'''
s = s[:farm_fish_start] + new_fishpond + s[farm_fish_end:]

# -----------------------------------------------------------------------------
# 4) Social page: show only one group at a time, like Powers page.
# -----------------------------------------------------------------------------
social_start = s.index('  const renderPeople = () => <div>')
# build_menu_fridge_patch renamed original collection function to renderDexCollection.
social_end_marker = '\n\n  const renderDexCollection = () => {'
social_end = s.index(social_end_marker, social_start)
new_social = r'''  const renderPeople = () => {
    const g = NPC_GROUPS.find(x=>x.id===socialGroup) || NPC_GROUPS[0];
    return <div>
      <SectionTitle icon="💛">社交</SectionTitle>
      <Card style={{ background: "#FFF9E8" }}><div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>Switch 遊戲內「＋」→ 社交頁可對照愛心數。選一組查看，不用一次捲過全部村民；點人物可展開送禮速查。</div></Card>
      <div style={{display:"flex",gap:6,marginTop:9,flexWrap:"wrap"}}>{NPC_GROUPS.map(x=><Pill key={x.id} active={socialGroup===x.id} onClick={()=>{setSocialGroup(x.id);setExpandedNPC(null)}}>{x.id==="single"?"可交往對象":x.id==="town"?"村民":"特殊角色"}</Pill>)}</div>
      <div style={{marginTop:8}}>
        <SectionTitle icon={g.id === "single" ? "💘" : g.id === "town" ? "🏘️" : "✨"} right={`上限 ${g.max}♥`}>{g.name}</SectionTitle>
        <div style={{ display: "grid", gap: 7 }}>{g.list.map(n => {
          const hearts = data.friendship[n] || 0;
          const open = expandedNPC === n;
          const gift = NPC_GIFTS[n];
          return <Card key={n} style={{ padding: 9 }}>
            <div onClick={()=>setExpandedNPC(open?null:n)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}><GameIcon file={NPC_ICON_FILES[n]} size={38}/><b style={{flex:1,color:C.ink}}>{n}</b><span style={{fontSize:12,color:C.red,fontWeight:900}}>♥ {hearts}/{g.max}</span><span style={{color:C.brown,fontWeight:900}}>{open?"▲":"▼"}</span></div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:6}}>{Array.from({length:g.max},(_,i)=><button key={i} onClick={()=>updateNested("friendship",{[n]:i+1===hearts?i:i+1})} style={{border:0,background:"transparent",padding:0,fontSize:16,color:i<hearts?C.red:"#D8CFC3",cursor:"pointer"}}>♥</button>)}</div>
            {open && <div style={{marginTop:8,paddingTop:7,borderTop:`1px dashed ${C.line}`,fontSize:12,lineHeight:1.55}}>
              {gift && <><div><b style={{color:C.red}}>最愛：</b>{gift.love.join("、")}</div><div><b style={{color:C.green}}>喜歡：</b>{gift.like.join("、")}</div><div><b style={{color:C.muted}}>討厭：</b>{gift.hate.join("、")}</div></>}
              <div style={{marginTop:6}}><WikiBtn name={NPC_WIKI[n] || n}/></div>
            </div>}
          </Card>;
        })}</div>
      </div>
    </div>;
  };'''
s = s[:social_start] + new_social + s[social_end:]

# -----------------------------------------------------------------------------
# 5) A real shareable tracker link in Notes. The cloud bridge already exposes a
# read-only ?view= token, so friends see the same populated tracker.
# -----------------------------------------------------------------------------
notes_anchor = '  const renderNotes = () => <div>\n'
share_helpers = r'''  const trackerShareUrl = () => window.SDVCloud?.shareUrl?.() || "";
  const shareTrackerView = async () => {
    const url = trackerShareUrl();
    if (!url) {
      alert("這個瀏覽器目前沒有雲端唯讀分享連結。請先用你的管理連結開啟一次手帳。");
      return;
    }
    const title = `${data.base.farm}｜星露谷進度手帳`;
    const text = `來看我的《星露谷物語》遊玩手帳：第 ${data.base.year} 年 ${data.base.season} ${data.base.day} 日`;
    if (navigator.share) {
      try { await navigator.share({title, text, url}); return; } catch(e) { if(e?.name==="AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); alert("唯讀手帳連結已複製"); }
    catch { window.prompt("複製這個唯讀手帳連結", url); }
  };
  const copyTrackerView = async () => {
    const url = trackerShareUrl();
    if (!url) { alert("尚未取得雲端唯讀分享連結"); return; }
    try { await navigator.clipboard.writeText(url); alert("唯讀手帳連結已複製"); }
    catch { window.prompt("複製這個唯讀手帳連結", url); }
  };

'''
if notes_anchor in s and 'const shareTrackerView = async' not in s:
    s = s.replace(notes_anchor, share_helpers + notes_anchor, 1)

share_insert = '''    <SectionTitle icon="📤">分享進度</SectionTitle>'''
share_card = '''    <SectionTitle icon="🔗">分享我的手帳</SectionTitle>
    <Card style={{background:"#EAF4D8"}}>
      <div style={{fontSize:12,color:C.ink,lineHeight:1.55,marginBottom:9}}><b>分享的是完整手帳，不是純文字。</b>朋友打開唯讀連結後，會直接看到你目前雲端保存的日期、農場、社區中心、動物、魚塘、社交、收藏、烹飪等記錄；你之後更新，他重新整理也會看到新版。</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><button onClick={shareTrackerView} style={{border:`2px solid ${C.green}`,background:C.lightGreen,color:C.green,borderRadius:9,padding:10,fontWeight:950}}>分享手帳…</button><button onClick={copyTrackerView} style={{border:`2px solid ${C.line}`,background:C.cream,color:C.brown,borderRadius:9,padding:10,fontWeight:950}}>複製連結</button></div>
      <div style={{fontSize:10,color:C.muted,marginTop:7}}>此連結為唯讀，朋友無法改動你的雲端存檔。</div>
    </Card>
    <SectionTitle icon="📤">純文字進度</SectionTitle>'''
if share_insert in s:
    s = s.replace(share_insert, share_card, 1)

# Make the Notes bottom tab visibly distinct from the Powers tab even if a wiki
# image fails: use the Journal Scrap game sprite.
s = s.replace('{ id: "notes", name: "備註", icon: "📝", file: TAB_ICON_FILES.notes }', '{ id: "notes", name: "備註", icon: "📝", file: "Journal Scrap" }')

p.write_text(s, encoding='utf-8')
print('build_ui_share_patch: farm pond picker, social tabs, icon fixes, and tracker sharing applied')
