from pathlib import Path
import re, json

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

def rep(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'missing {label}')
    s=s.replace(old,new,1)

def sub(pattern,repl,label,count=1):
    global s
    ns,n=re.subn(pattern,lambda m:repl,s,count=count,flags=re.S)
    if n!=count:
        raise SystemExit(f'{label}: expected {count}, got {n}')
    s=ns

# ---------- Switch zh-CN display helper ----------
anchor='''function itemFileZhV26(name){\n  const raw=String(name||"").trim();\n  const clean=raw.replace(/金星/g,"").replace(/\\s*×\\s*\\d+.*/,"").trim();\n  if(ITEM_FILE_ZH_V26[raw]||ITEM_FILE_ZH_V26[clean])return ITEM_FILE_ZH_V26[raw]||ITEM_FILE_ZH_V26[clean];\n  const ci=(COOKING_INGREDIENTS_V3||[]).find(x=>x.name===raw||x.name===clean); if(ci)return ci.file;\n  const cr=(COOKING_RECIPES_V3||[]).find(x=>x.name===raw||x.name===clean); if(cr)return cr.file;\n  const fi=COLLECTIONS.fish.items.indexOf(raw)>=0?COLLECTIONS.fish.items.indexOf(raw):COLLECTIONS.fish.items.indexOf(clean); if(fi>=0)return FISH_ICON_FILES[fi];\n  if(/^\\d[\\d,]*g/.test(raw))return "Gold";\n  return "";\n}\n'''
helper=anchor+'''\nconst SWITCH_T2S_V47 = Object.fromEntries(Array.from("萬與專業東絲丟兩嚴喪個豐臨為麗舉麼義烏樂喬習鄉書買亂爭於亞產畝親複見觀規覺覽觸訂訥訓議訊記講許論證評識詐詞詔詛話誠誼誤說請諸諾謀謎謝謠謹譜貝負財貢貧貨販貪貫責貯貴貸貿費賀賄賊賓賜賞賠賢賣賦質賬購贈贊趕趨躍車軌軒轉輪輕載較輔輛輝輩轎輸轟辦邊遙鄧鄭鄰醫釋釣鈴鈣鈾鉤銀銅銘銷鋪鋒鋤鋼錄錘錠錢錦錯鍋鍵鍛鍬鎖鎮鏡鐵鑄鑑鑰長門閉開閒間閣闊隊陽陰陣階際陸險雜雙雞離難雲電靈靜頂頃項順須頑頓領頭顏類風飛飯飲飼餅館馬駕驢騎騙騷鬥鬆鬍魚魷鮭鯉鯊鯰鰻鱒鱘鳥鳳鴨鵝鷹麥黃點齊齒龍龜體髮鬚鬱鹽麵湯餃燴燻蘿蔔蘋薑蘚蕪纖維礦寶鑽遠種樹葉爐煉繩飾鏈環殘頁圖場鎮島灣澤層區傳獎勵殺敵數據應該夠賣買獲採網燈漿殼塊" ).map((ch,i)=>[ch,Array.from("万与专业东丝丢两严丧个丰临为丽举么义乌乐乔习乡书买乱争于亚产亩亲复见观规觉览触订讷训议讯记讲许论证评识诈词诏诅话诚谊误说请诸诺谋谜谢谣谨谱贝负财贡贫货贩贪贯责贮贵贷贸费贺贿贼宾赐赏赔贤卖赋质账购赠赞赶趋跃车轨轩转轮轻载较辅辆辉辈轿输轰办边遥邓郑邻医释钓铃钙铀钩银铜铭销铺锋锄钢录锤锭钱锦错锅键锻锹锁镇镜铁铸鉴钥长门闭开闲间阁阔队阳阴阵阶际陆险杂双鸡离难云电灵静顶顷项顺须顽顿领头颜类风飞饭饮饲饼馆马驾驴骑骗骚斗松胡鱼鱿鲑鲤鲨鲶鳗鳟鲟鸟凤鸭鹅鹰麦黄点齐齿龙龟体发须郁盐面汤饺烩熏萝卜苹姜藓芜纤维矿宝钻远种树叶炉炼绳饰链环残页图场镇岛湾泽层区传奖励杀敌数据应该够卖买获采网灯浆壳块")[i]]));\nfunction switchNameV47(name,file=""){\n  const map=window.SDVSwitchNamesV47||{};\n  const direct=map[String(file||"")]||map[String(name||"")];\n  if(direct)return direct;\n  return String(name||"").split("").map(ch=>SWITCH_T2S_V47[ch]||ch).join("");\n}\n'''
rep(anchor,helper,'switch name helper')

# ---------- defaults/order ----------
s=s.replace('const [dataSection, setDataSection] = useState("farm");','const [dataSection, setDataSection] = useState("skills");')
s=s.replace('const [skillSection, setSkillSection] = useState("skills");','const [skillSection, setSkillSection] = useState("milestones");')

# ---------- profile card: no fake money/farm + farm suffix + compact overview row ----------
s=s.replace('{data.base.farm}</div>','{(data.profilePortrait||data.base.profileDataVerifiedV47)?`${String(data.base.farm||"").replace(/(?:農場|农场)$/u,"")||"未記錄"}農場`:"未記錄農場"}</div>',1)
s=s.replace('<div style={{fontSize:11.5,color:C.brown,marginTop:8,fontWeight:850}}>持有 {Number(data.base.money||0).toLocaleString()}g</div>','<div style={{fontSize:11.5,color:C.brown,marginTop:8,fontWeight:850}}>持有 {(data.profilePortrait||data.base.profileDataVerifiedV47)?`${Number(data.base.money||0).toLocaleString()}g`:"—"}</div>',1)
s=s.replace('<div style={{fontSize:10.5,color:C.muted,marginTop:1}}>累計 {Number(data.base.totalIncome||0).toLocaleString()}g</div>','<div style={{fontSize:10.5,color:C.muted,marginTop:1}}>累計 {(data.profilePortrait||data.base.profileDataVerifiedV47)?`${Number(data.base.totalIncome||0).toLocaleString()}g`:"—"}</div>',1)
season_row='''          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:3,marginTop:6}}>{SEASONS.map(season=>{const active=data.base.season===season;return <button key={season} onClick={()=>updateBase({season})} style={{border:`1.5px solid ${active?C.green:C.line}`,background:active?C.lightGreen:C.cream,borderRadius:14,padding:"4px 2px",fontSize:9.5,fontWeight:900,color:active?C.green:C.ink,whiteSpace:"nowrap"}}>{SEASON_ICON[season]} {season}</button>})}</div>'''
season_new=season_row+'''\n          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:3,marginTop:6}}>{[["等級",`${skillTotal}/50`],["社區",`${rp.done}/30`],["礦井",`${data.mine.normal}/120`],["動物",`${totalAnimals}`]].map(([k,v])=><div key={k} style={{background:"#FFF4D8",border:`1px solid ${C.line}`,borderRadius:7,padding:"3px 2px",textAlign:"center",minWidth:0}}><div style={{fontSize:6.5,color:C.muted,fontWeight:900}}>{k}</div><b style={{display:"block",fontSize:8.5,color:C.brown,lineHeight:1.15,marginTop:1}}>{v}</b></div>)}</div>'''
rep(season_row,season_new,'profile compact progress')
# manual edit marks profile data as user-entered
s=s.replace('onChange={e=>updateBase({name:e.target.value})}','onChange={e=>updateBase({name:e.target.value,profileDataVerifiedV47:true})}',1)
s=s.replace('onChange={e=>updateBase({farm:e.target.value})}','onChange={e=>updateBase({farm:e.target.value,profileDataVerifiedV47:true})}',1)
s=s.replace('onChange={v=>updateBase({money:v})}','onChange={v=>updateBase({money:v,profileDataVerifiedV47:true})}',1)
s=s.replace('onChange={v=>updateBase({totalIncome:v})}','onChange={v=>updateBase({totalIncome:v,profileDataVerifiedV47:true})}',1)
# header hides fake defaults too
s=s.replace('<div style={{fontSize:10.5,color:"#E8C88F",marginTop:2}}>{Number(data.base.money||0).toLocaleString()}g</div>','<div style={{fontSize:10.5,color:"#E8C88F",marginTop:2}}>{(data.profilePortrait||data.base.profileDataVerifiedV47)?`${Number(data.base.money||0).toLocaleString()}g`:""}</div>',1)

# ---------- green rain note + footer ----------
needle='''        {upcoming.length>0 && <div style={{marginTop:7,borderTop:`1px dashed ${C.line}`,paddingTop:6}}>\n          <div style={{fontSize:10.5,color:C.muted,fontWeight:950,marginBottom:3}}>接下來</div>\n          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{upcoming.map(x=><button key={x.day} onClick={()=>updateBase({day:x.day})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:9,padding:"4px 7px",fontSize:10,fontWeight:900,color:C.brown,cursor:"pointer"}}>{x.day}日 · {x.items.map(i=>i.text).join("／")}</button>)}</div>\n        </div>}'''
add=needle+'''\n        {data.base.season==="夏"&&<div style={{marginTop:7,padding:"6px 8px",borderRadius:8,background:"#EAF4D8",border:`1px solid ${C.line}`,display:"flex",alignItems:"center",gap:6}}><GameIcon file="Mossy Seed" size={24}/><div style={{fontSize:8.8,color:C.ink,lineHeight:1.35}}><b style={{color:C.green}}>綠雨提醒</b>：每年夏季隨機 1 天，只可能落在 5、6、7、14、15、16、18、23 日；手帳不預猜是哪一天。</div></div>}'''
rep(needle,add,'green rain')
s=s.replace('直接點上方遊戲日曆的日期格即可切換手帳日期；頁首、當日事件與魚類「今日可釣」會一起更新。書商每季日期依存檔隨機，無法只靠年份／季節推算。','直接點上方遊戲日曆的日期格即可切換手帳日期；頁首與當日事件會一起更新。書商每季日期依存檔隨機，無法只靠年份／季節推算。',1)

# ---------- overview only profile + calendar ----------
sub(r'  const renderOverview = \(\) => <div>\n    \{renderProfileCard\(\)\}\n    \{renderCalendar\(\)\}.*?\n  </div>;','''  const renderOverview = () => <div>\n    {renderProfileCard()}\n    {renderCalendar()}\n  </div>;''','overview simplify')

# ---------- role section tabs, milestones first ----------
old_tabs='''      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:8}}><SkillTab id="skills" label="技能" file="Skills Tab Icon"/><SkillTab id="mine" label="礦井" file="MinesEntrance"/><SkillTab id="special" label="特殊能力" file="Special Items & Powers Tab"/><SkillTab id="stardrops" label="星之果實" file="Stardrop"/></div>'''
new_tabs='''      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}><SkillTab id="milestones" label="里程碑" file="Achievement Star 01"/><SkillTab id="skills" label="等級" file="Skills Tab Icon"/><SkillTab id="mine" label="礦井" file="MinesEntrance"/><SkillTab id="special" label="特殊能力" file="Special Items & Powers Tab"/><SkillTab id="stardrops" label="星之果實" file="Stardrop"/></div>\n      {skillSection==="milestones"&&<><SectionTitle icon="🏆">重要里程碑</SectionTitle><Card style={{padding:8}}>{MILESTONES.map(m => <CheckRow key={m.id} checked={data.milestones.includes(m.id)} onChange={v => update({ milestones: v ? [...new Set([...data.milestones, m.id])] : data.milestones.filter(x => x !== m.id) })} sub={m.desc}>{m.name}</CheckRow>)}</Card></>}'''
rep(old_tabs,new_tabs,'role subtabs')

# ---------- data menu order/naming ----------
old_data='''    return <div><SectionTitle icon="📊">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="farm" label="農場" file="Animals Tab"/><DataTab id="skills" label="技能" file="Skills Tab Icon"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Collections Tab"/></div>{dataSection==="farm"&&renderFarm()}{dataSection==="skills"&&renderSkills()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;'''
new_data='''    return <div><SectionTitle icon="📊">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="skills" label="角色" file="Skills Tab Icon"/><DataTab id="farm" label="農場" file="Animals Tab"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Collections Tab"/></div>{dataSection==="skills"&&renderSkills()}{dataSection==="farm"&&renderFarm()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;'''
rep(old_data,new_data,'data tabs')

# ---------- remove lookup suggestion entirely ----------
s=re.sub(r'\n    const fixedUses=selected\?\(selected\.bundles\.length\+selected\.remix\.length\+selected\.cookNeed\+tailoring\.length\+\(museum\?1:0\)\+\(usageSpecial\?\.uses\?\.length\|\|0\)\):0;\n    const mustKeepV46=.*?\n    const recommendActionV46=.*?;','',s,count=1)
s=s.replace('''          <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:7.3,color:C.muted,fontWeight:900}}>建議</span><span style={{fontSize:9,fontWeight:950,color:recommendActionV46==="留"?C.green:C.orange,background:recommendActionV46==="留"?"#EAF4D8":"#FFF0D2",borderRadius:8,padding:"3px 6px"}}>{recommendActionV46}</span></div>\n''','')
s=s.replace('gridTemplateColumns:"minmax(0,1fr) auto"','gridTemplateColumns:"1fr"',1)

# ---------- official/simplified item display ----------
s=s.replace('<b style={{display:"block",fontSize:14,color:C.darkBrown}}>{selected.name}</b>','<b style={{display:"block",fontSize:14,color:C.darkBrown}}>{switchNameV47(selected.name,selected.file)}</b>',1)
s=s.replace('>{it.name}</b><span style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:3}}','>{switchNameV47(it.name,it.file)}</b><span style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:3}}',1)
# fish card
s=s.replace('const name=COLLECTIONS.fish.items[i]; const got=', 'const name=COLLECTIONS.fish.items[i]; const displayName=switchNameV47(name,FISH_ICON_FILES[i]); const got=',1)
s=s.replace('>{name}{rule.legend?" · 傳說":""}</b>','>{displayName}{rule.legend?" · 傳說":""}</b>',1)
# fish dex cards + detail
s=s.replace('>{name}</div><button onClick={e=>','>{switchNameV47(name,FISH_ICON_FILES[i])}</div><button onClick={e=>',1)
s=s.replace('>{COLLECTIONS.fish.items[selectedItem]}</b>','>{switchNameV47(COLLECTIONS.fish.items[selectedItem],FISH_ICON_FILES[selectedItem])}</b>',1)
# shipping
s=s.replace('>{name}</div><span style={{position:"absolute",right:2,top:1','>{switchNameV47(name,file)}</div><span style={{position:"absolute",right:2,top:1',1)
# mini item / gift display
s=s.replace('>{name}</div></div>;\n  };','>{switchNameV47(name,file)}</div></div>;\n  };',1)
s=s.replace('>{item}</div></div>})}</div></div>;','>{switchNameV47(item,file)}</div></div>})}</div></div>;',1)
# wardrobe names
s=s.replace('const wrap=arr=>(arr||[]).map(x=>[x.key,x.name,x.sourceZh||x.source,x.dyeable,x]);','const wrap=arr=>(arr||[]).map(x=>[x.key,switchNameV47(x.name,x.icon||x.key),x.sourceZh||x.source,x.dyeable,x]);',1)
s=s.replace('const bootsFull=BOOTS_V30.map(x=>[...x,false,{key:x[0],icon:x[0],name:x[1],source:x[2],recipe:"",dyeable:false}]);','const bootsFull=BOOTS_V30.map(x=>[x[0],switchNameV47(x[1],x[0]),x[2],false,{key:x[0],icon:x[0],name:switchNameV47(x[1],x[0]),source:x[2],recipe:"",dyeable:false}]);',1)

# ---------- collection visual consistency ----------
# rewrite generic artifact/mineral dex with same progress-first/grid/detail flow
sub(r'  const renderDexCollection = \(\) => \{.*?\n  \};\n\n\n  const prepSetV3', '''  const renderDexCollection = () => {\n    const c=COLLECTIONS[selectedCollection];\n    const got=data.collections[selectedCollection]||[];\n    return <div style={{marginTop:8}}>\n      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>{selectedCollection==="artifact"?"古物圖鑑":"礦物圖鑑"}</span><span>{got.length}/{c.items.length}</span></div><ProgressBar value={got.length} max={c.items.length}/></Card>\n      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{c.items.map((it,i)=>{const checked=got.includes(i),file=ICON_URLS[selectedCollection]?.[i];return <button key={i} onClick={()=>setSelectedItem(i)} onDoubleClick={()=>updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})} style={{position:"relative",border:`2px solid ${selectedItem===i?C.orange:checked?C.green:C.line}`,background:checked?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 3px",minHeight:78,cursor:"pointer"}}>{file?<img src={file} alt="" style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file={itemFileZhV26(it)||it} size={36}/>}<div style={{fontSize:9,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:2}}>{switchNameV47(it,itemFileZhV26(it))}</div><button onClick={e=>{e.stopPropagation();updateNested("collections",{[selectedCollection]:checked?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:2,border:0,background:"transparent",fontSize:13,color:checked?C.green:"#C9B99A",fontWeight:950}}>{checked?"✓":"○"}</button></button>})}</div>\n      {selectedItem!=null&&c.items[selectedItem]&&<Card style={{marginTop:8,background:"#FFF8E2"}}><div style={{display:"flex",gap:9,alignItems:"center"}}>{ICON_URLS[selectedCollection]?.[selectedItem]?<img src={ICON_URLS[selectedCollection][selectedItem]} alt="" style={{width:48,height:48,imageRendering:"pixelated"}}/>:<GameIcon file={itemFileZhV26(c.items[selectedItem])||c.items[selectedItem]} size={48}/>}<div style={{flex:1,minWidth:0}}><b style={{fontSize:15,color:C.darkBrown}}>{switchNameV47(c.items[selectedItem],itemFileZhV26(c.items[selectedItem]))}</b><div style={{fontSize:10.5,color:C.muted,marginTop:3}}>{c.info?.[selectedItem]||""}</div></div></div></Card>}\n    </div>;\n  };\n\n\n  const prepSetV3''','generic collection dex')

# achievements -> progress + 5-col icon grid
sub(r'  const renderAchievements = \(\) => <div>.*?</div>;\n\n  const renderDexCollection', '''  const renderAchievements = () => {\n    const count=ACHIEVEMENTS_V2.filter(a=>achievementChecked(a.id)).length;\n    return <div style={{marginTop:8}}>\n      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>成就</span><span>{count}/{ACHIEVEMENTS_V2.length}</span></div><ProgressBar value={count} max={ACHIEVEMENTS_V2.length}/></Card>\n      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{ACHIEVEMENTS_V2.map(a=>{const auto=derivedAchievement(a.id),on=achievementChecked(a.id);return <button key={a.id} disabled={auto} onClick={()=>toggleAchievement(a.id)} title={a.desc} style={{position:"relative",border:`2px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"6px 3px",minHeight:82,cursor:auto?"default":"pointer",opacity:auto?.85:1}}><GameIcon file="Achievement Star 01" size={35}/><div style={{fontSize:8.7,fontWeight:900,color:on?C.green:C.ink,lineHeight:1.08,marginTop:2}}>{a.name}</div><span style={{position:"absolute",right:2,top:2,fontSize:12,color:on?C.green:"#C9B99A",fontWeight:950}}>{on?"✓":"○"}</span>{auto&&<span style={{position:"absolute",left:2,top:2,fontSize:5.8,color:C.green,fontWeight:950}}>自動</span>}</button>})}</div>\n    </div>;\n  };\n\n  const renderDexCollection''','achievement grid')

# collection page: no duplicate heading/intro
old='''    return <div>\n      <SectionTitle icon="📖">收集品</SectionTitle>\n      <Card style={{padding:8,background:"#FFF4D8",fontSize:10.5,color:C.muted,lineHeight:1.4}}>對應遊戲「＋ → 收集品」。每個子頁用遊戲素材當圖示；烹飪裡同時放一次性備料圖鑑。</Card>\n      <div style={{display:"flex",gap:5,overflowX:"auto",padding:"8px 0 4px",WebkitOverflowScrolling:"touch"}}>{COLLECTION_TABS_V3.map'''
new='''    return <div>\n      <div style={{display:"flex",gap:5,overflowX:"auto",padding:"8px 0 4px",WebkitOverflowScrolling:"touch"}}>{COLLECTION_TABS_V3.map'''
rep(old,new,'collection duplicate header')

# shipping header same visual hierarchy as fish
sub(r'<Card style=\{\{padding:9\}\}><div style=\{\{display:"flex",alignItems:"center",gap:7\}\}><GameIcon file="Mini-Shipping Bin" size=\{34\}/><div style=\{\{flex:1\}\}><b style=\{\{fontSize:12,color:C\.brown\}\}>出貨圖鑑</b><div style=\{\{fontSize:9\.5,color:C\.muted,marginTop:1\}\}>照遊戲 1\.6「出貨」收藏排列點亮。</div></div><b style=\{\{fontSize:11,color:C\.green\}\}>\{shipped\.length\}/\{SHIPPING_ITEMS_V30\.length\}</b></div><div style=\{\{marginTop:6\}\}><ProgressBar value=\{shipped\.length\} max=\{SHIPPING_ITEMS_V30\.length\}/></div>','''<Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>出貨圖鑑</span><span>{shipped.length}/{SHIPPING_ITEMS_V30.length}</span></div><ProgressBar value={shipped.length} max={SHIPPING_ITEMS_V30.length}/>''','shipping card')

# remove all encyclopedia jump buttons from in-app detail cards
s=re.sub(r'<WikiBtn name=\{[^}]+\}/>', '', s)

# collection generic names should display simplified even if hardcoded traditional
s=s.replace('>{it}</div>\n          {selectedCollection==="fish"&&<FishTags', '>{switchNameV47(it,itemFileZhV26(it))}</div>\n          {selectedCollection==="fish"&&<FishTags')

p.write_text(s,encoding='utf-8')

# index + service worker version & Switch official-name data
idx=Path('index.html'); t=idx.read_text(encoding='utf-8')
t=t.replace('<script src="./lookup-data-v46.js?v=46"></script>','<script src="./lookup-data-v46.js?v=47"></script>\n  <script src="./switch-names-v47.js?v=47"></script>')
t=re.sub(r'\?v=46','?v=47',t)
t=t.replace('deploy-v46','deploy-v47')
idx.write_text(t,encoding='utf-8')

sw=Path('sw.js'); w=sw.read_text(encoding='utf-8')
w=w.replace('stardew-tracker-v46','stardew-tracker-v47')
w=w.replace("'./lookup-data-v46.js'","'./lookup-data-v46.js','./switch-names-v47.js'")
sw.write_text(w,encoding='utf-8')
