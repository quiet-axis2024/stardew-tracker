from pathlib import Path

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')

# 1) Collections -> Letters uses the actual Stardew Mail sprite.
s = s.replace('["letters","信件","Secret Note Icon"]', '["letters","信件","Mail"]', 1)
s = s.replace('<GameIcon file="Letter" size={34}/>', '<GameIcon file="Mail" size={34}/>', 1)

# 2) Fish UI transient state.
state = '  const [fishMissingV4, setFishMissingV4] = useState(true);'
state_new = '''  const [fishMissingV4, setFishMissingV4] = useState(true);\n  const [fishSeasonV4, setFishSeasonV4] = useState("當季");\n  const [fishTodayOpenV4, setFishTodayOpenV4] = useState(null);\n  const [fishFindGroupV4, setFishFindGroupV4] = useState("main");'''
if state_new not in s:
    if state not in s:
        raise SystemExit('fish state marker missing')
    s = s.replace(state, state_new, 1)

# 3) Two-level location groups for Find Fish.
area_marker = 'function fishRuleV4(i){ return FISH_RULES_V4[i] || {s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]}; }'
area_defs = r'''
const FISH_AREA_GROUPS_V4 = {
  main:{name:"本島",ids:["town","forest_river","forest_pond","forest_falls","glacier","mountain","beach","secret"]},
  special:{name:"特殊水域",ids:["desert","sewer","bug","mine20","mine60","mine100","witch","night"]},
  island:{name:"薑島",ids:["island_n","island_w_fresh","island_w_ocean","island_s","pirate","caldera"]}
};

'''
if 'const FISH_AREA_GROUPS_V4 = {' not in s:
    if area_marker not in s:
        raise SystemExit('fish rule marker missing')
    s = s.replace(area_marker, area_defs + area_marker, 1)

# 4) Secret Notes: useful contents + solutions/effects, rather than placeholder summaries.
note_marker = 'const JOURNAL_SUMMARY_V3 = {1:"薑島的第一條探索提示。",2:"島嶼地點線索。",3:"火山相關探索提示。",4:"一張薑島藏寶圖。",5:"島上生物與物品提示。",6:"另一張島嶼藏寶圖。",7:"薑島探索紀錄。",8:"薑島探索紀錄。",9:"薑島探索紀錄。",10:"金色核桃位置圖。",11:"薑島最後的日誌提示。"};'
note_defs = r'''
const SECRET_NOTE_CONTENT_V4 = {
  1:"阿比蓋爾的最愛：南瓜、紫水晶、巧克力蛋糕、香辣鰻魚、黑莓脆皮餅。",
  2:"山姆的採買清單：塞巴斯蒂安＝淚晶／生魚片；潘妮＝綠寶石／虞美人花；文森特＝葡萄／蔓越莓糖果；喬迪＝香酥鱸魚／薄煎餅；肯特＝義式蕨菜燉飯／烤榛子；山姆＝仙人掌果子／楓糖棒／披薩。",
  3:"莉亞理想晚餐：沙拉、山羊乳酪、松露、果酒；甜點是虞美人籽鬆糕。",
  4:"瑪魯的發明材料：金錠、銥錠、電池組、鑽石、草莓。",
  5:"潘妮的送禮備忘：潘姆＝防風草／琉璃山藥（不要啤酒）；賈斯＝玫瑰仙子／葡萄乾布丁；文森特＝粉紅蛋糕／葡萄；喬治＝韭蔥／炒蘑菇；艾芙琳＝甜菜／鬱金香。",
  6:"星之果實餐吧特別點單：劉易斯＝秋日恩賜；瑪妮＝南瓜派；德米特里厄斯＝豆類火鍋；卡洛琳＝魚肉捲。",
  7:"幾位年長單身男性的喜好：哈維＝咖啡／醃菜；艾利歐特＝蟹黃糕／石榴；謝恩＝啤酒／披薩／爆炒青椒。",
  8:"海莉與艾蜜麗父母的送禮提示：海莉＝粉紅蛋糕／向日葵；艾蜜麗＝各類寶石／動物毛。",
  9:"亞歷克斯的力量訓練餐：完美早餐、鮭魚晚餐。",
  10:"紙條提示：有人在骷髏洞穴第 100 層等你。",
  11:"照片型紙條：瑪妮與賈斯的合照。",
  12:"垃圾桶提示：好運日更值得翻；餐吧後方可能有當日料理，喬治／艾芙琳家附近可能有餅乾，鐵匠鋪與博物館附近較容易翻到有價值的東西。",
  13:"提示：每季最後一天，中午 12:00 整，去遊樂場上方的灌木。",
  14:"提示：社區中心後方藏著東西。",
  15:"美人魚秀貝殼順序：1 → 5 → 4 → 2 → 3。",
  16:"藏寶圖型紙條：鐵路區的大石頭附近。",
  17:"藏寶圖型紙條：Joja 超市北側、靠河的最北端位置。",
  18:"藏寶圖型紙條：沙漠東南區長椅附近。",
  19:"路線圖型紙條：從 1 Willow Lane（喬迪家）門口起，依箭頭一路走到不能再走再轉向。",
  20:"路線圖型紙條：從鎮中心眼睛圖案起，依箭頭一路走到 Joja 超市旁的卡車。",
  21:"時間地點圖型紙條：凌晨 12:40 到海灘入口橋西北側的大灌木。",
  22:"齊先生提示：巴士站西側的黑暗隧道裡藏著他的秘密。",
  23:"提示：去秘密森林，身上帶一瓶楓糖漿。",
  24:"M. Jasper 的紀錄：把寶石或礦物放進祝尼魔小屋會影響祝尼魔顏色；葡萄乾也是祝尼魔特別喜歡的食物。",
  25:"提示：有人把卡洛琳的華麗項鍊弄丟在溫泉附近。",
  26:"古代農耕秘訣：餵祝尼魔葡萄乾，會讓牠們成為更有效率的收割幫手。",
  27:"爺爺留下提示：當你準備好時，煤礦森林南部有一處與五種技能精通有關的秘密。"
};
const SECRET_NOTE_SOLUTION_V4 = {
  10:"讀取後會加入「神秘紙條」任務；抵達骷髏洞穴 100 層觸發齊先生事件，獲得永久 +25 生命上限。",
  13:"任一季第 28 日 12:00，互動遊樂場上方灌木，可拿到祝尼魔毛絨玩偶。",
  14:"到社區中心後方、右側木圍欄附近，用十字鎬或鋤頭取得石祝尼魔雕像。",
  15:"冬季夜市進入最右側美人魚船，看完表演後依 1-5-4-2-3 點貝殼，可拿 1 顆珍珠；每位玩家每存檔只能領一次。",
  16:"鐵路軌道北側大石頭右邊一格用鋤頭挖，可拿寶箱。",
  17:"到 Joja 超市北側河邊，在東岸最北端那格挖，可拿綠色奇怪玩偶。",
  18:"到沙漠東南區長椅的西南側指定格挖，可拿黃色奇怪玩偶；沙漠節期間不能挖。",
  19:"照箭頭走到底會到劉易斯家後方的純金劉易斯雕像。把雕像放在鎮上還會觸發後續彩蛋與一次 750g 匿名信。",
  20:"其實可以直接去 Joja 超市旁卡車找司機；交出兔子的腳可取得「特殊的魅力」，永久提高每日運氣。",
  21:"凌晨 12:40 互動該灌木，會看到劉易斯與瑪妮的秘密事件。",
  22:"帶電池組到巴士站西側隧道，把電池放進隧道中央牆上的盒子，開始「神秘的齊」任務。",
  23:"6:00–19:00 帶楓糖漿進秘密森林觸發熊事件，取得「熊的知識」；黑莓與鮭莓售價永久變為 3 倍。",
  24:"在祝尼魔小屋內放寶石／可採集礦物／晶球礦物可改變祝尼魔顏色；五彩碎片會呈現彩虹色。",
  25:"春、夏、秋在溫泉外水池釣魚可釣到華麗項鍊；交卡洛琳加 50 友情，交阿比蓋爾加 100 友情。",
  26:"把葡萄乾放進祝尼魔小屋後，收割時有機率得到雙倍作物；每週消耗 1 袋，可預先堆多袋。",
  27:"五種技能都到 10 級後，煤礦森林南部、下水道管附近的精通洞穴會開放。"
};
'''
if 'const SECRET_NOTE_CONTENT_V4 = {' not in s:
    if note_marker not in s:
        raise SystemExit('secret note marker missing')
    s = s.replace(note_marker, note_marker + '\n' + note_defs, 1)

# 5) Find Fish: region pills + one location dropdown so the details stay near the controls.
start = s.index('  const renderFishFindV4 = () => {')
end = s.index('  const renderFishTodayV4 = () => {')
new_find = r'''  const renderFishFindV4 = () => {
    const group=FISH_AREA_GROUPS_V4[fishFindGroupV4]||FISH_AREA_GROUPS_V4.main;
    const groupAreas=group.ids.map(id=>FISH_AREAS_V4.find(a=>a.id===id)).filter(Boolean);
    const area=groupAreas.find(a=>a.id===fishAreaV4)||groupAreas[0];
    const missing=data.collections.fish||[];
    const rows=area.fish.filter(i=>!fishMissingV4||!missing.includes(i));
    const selectGroup=k=>{setFishFindGroupV4(k);const first=FISH_AREA_GROUPS_V4[k]?.ids?.[0];if(first)setFishAreaV4(first);};
    return <div style={{marginTop:8}}>
      <Card style={{padding:9,background:"#FFF4D8"}}>
        <div style={{fontSize:11,fontWeight:950,color:C.darkBrown}}>先選大區，再選一個地點</div>
        <div style={{display:"flex",gap:5,marginTop:6}}>{Object.entries(FISH_AREA_GROUPS_V4).map(([k,g])=><Pill key={k} small active={fishFindGroupV4===k} onClick={()=>selectGroup(k)}>{g.name}</Pill>)}</div>
        <select value={area.id} onChange={e=>setFishAreaV4(e.target.value)} style={{width:"100%",marginTop:7,border:`2px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"8px 9px",fontSize:12,fontWeight:900,color:C.ink}}>{groupAreas.map(a=><option key={a.id} value={a.id}>{a.name} · {a.sub}</option>)}</select>
      </Card>
      <Card style={{marginTop:8,padding:9,background:"#FFF8E2"}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={area.icon} size={36}/><div style={{flex:1}}><b style={{fontSize:14,color:C.darkBrown}}>{area.name} · {area.sub}</b>{area.island&&<div style={{fontSize:10,color:C.green,fontWeight:900,marginTop:2}}>薑島魚類不受季節限制</div>}</div><span style={{fontSize:10,color:C.muted,fontWeight:900}}>{rows.length} 項</span></div>{area.tip&&<div style={{fontSize:10.5,color:C.brown,lineHeight:1.45,marginTop:6}}>{area.tip}</div>}</Card>
      <label style={{display:"flex",alignItems:"center",gap:6,marginTop:8,fontSize:10.5,fontWeight:900,color:C.brown}}><input type="checkbox" checked={fishMissingV4} onChange={e=>setFishMissingV4(e.target.checked)}/>只看未收集</label>
      <div style={{display:"grid",gap:5,marginTop:7}}>{rows.map(i=>renderFishCardV4(i,area,true))}</div>
      {!rows.length&&<Card style={{marginTop:8,textAlign:"center",fontSize:11,color:C.muted}}>這個地點沒有符合目前篩選的未收集魚。</Card>}
    </div>;
  };

'''
s = s[:start] + new_find + s[end:]

# 6) Today Fish: selectable season + collapsed location accordions.
start = s.index('  const renderFishTodayV4 = () => {')
end = s.index('  const renderFishHubV4 = () => <div>')
new_today = r'''  const renderFishTodayV4 = () => {
    const got=data.collections.fish||[];
    const season=fishSeasonV4==="當季"?data.base.season:fishSeasonV4;
    const autoHour=parseGameHourV4(data.base.gameTime);
    const hour=fishHourV4==="auto"?autoHour:fishHourV4==="all"?null:Number(fishHourV4);
    const areaRows=FISH_AREAS_V4.map(area=>({area,fish:area.fish.filter(i=>fishAvailableV4(area,i,season,fishWeatherV4,hour,data.base.day)&&(!fishMissingV4||!got.includes(i)))})).filter(x=>x.fish.length);
    const total=areaRows.reduce((n,x)=>n+x.fish.length,0);
    return <div style={{marginTop:8}}>
      <Card style={{padding:9,background:"#FFF4D8"}}><div style={{fontSize:12,fontWeight:950,color:C.darkBrown}}>第 {data.base.year} 年 · {season}季 · {data.base.day} 日</div><div style={{fontSize:10.5,color:C.muted,marginTop:3}}>預設跟隨手帳目前季節；也可以臨時切季節查魚，不會改動你的存檔日期。</div></Card>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>季節</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{["當季","春","夏","秋","冬"].map(x=><Pill key={x} small active={fishSeasonV4===x} onClick={()=>{setFishSeasonV4(x);setFishTodayOpenV4(null)}}>{x==="當季"?`當季（${data.base.season}）`:x}</Pill>)}</div>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>天氣</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{["全部","晴","雨"].map(w=><Pill key={w} small active={fishWeatherV4===w} onClick={()=>{setFishWeatherV4(w);setFishTodayOpenV4(null)}}>{w==="全部"?"全部天氣":w}</Pill>)}</div>
      <div style={{fontSize:9.5,fontWeight:950,color:C.muted,marginTop:7}}>時間</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{[["auto",autoHour!=null?`目前 ${data.base.gameTime}`:"目前時間未記錄"],["all","不限時間"],[6,"06:00"],[9,"09:00"],[12,"12:00"],[15,"15:00"],[18,"18:00"],[22,"22:00"],[24,"00:00"]].map(([v,n])=><Pill key={String(v)} small active={String(fishHourV4)===String(v)} onClick={()=>{setFishHourV4(v);setFishTodayOpenV4(null)}}>{n}</Pill>)}</div>
      <label style={{display:"flex",alignItems:"center",gap:6,marginTop:8,fontSize:10.5,fontWeight:900,color:C.brown}}><input type="checkbox" checked={fishMissingV4} onChange={e=>{setFishMissingV4(e.target.checked);setFishTodayOpenV4(null)}}/>只看未收集</label>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"7px 0 5px"}}><span style={{fontSize:10,color:C.muted}}>共 {total} 個「地點 × 魚」；地點預設收起。</span>{fishTodayOpenV4&&<button onClick={()=>setFishTodayOpenV4(null)} style={{border:0,background:"transparent",fontSize:10,color:C.blue,fontWeight:900}}>全部收起</button>}</div>
      <div style={{display:"grid",gap:6}}>{areaRows.map(({area,fish})=>{const open=fishTodayOpenV4===area.id;return <Card key={area.id} style={{padding:0,overflow:"hidden"}}><button onClick={()=>setFishTodayOpenV4(open?null:area.id)} style={{width:"100%",border:0,background:"transparent",padding:"8px 9px",display:"flex",alignItems:"center",gap:7,textAlign:"left",cursor:"pointer"}}><GameIcon file={area.icon} size={30}/><span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:12.5,color:C.darkBrown}}>{area.name} · {area.sub}</b><span style={{display:"flex",gap:2,marginTop:3,overflow:"hidden"}}>{fish.slice(0,5).map(i=><img key={i} src={ICON_URLS.fish[i]} alt="" style={{width:20,height:20,imageRendering:"pixelated",objectFit:"contain"}}/>)}{fish.length>5&&<span style={{fontSize:9,color:C.muted,fontWeight:900,alignSelf:"center"}}>+{fish.length-5}</span>}</span></span><span style={{fontSize:10,color:C.muted,fontWeight:900}}>{fish.length} 項</span><span style={{fontSize:12,color:C.brown,fontWeight:950}}>{open?"▲":"▼"}</span></button>{open&&<div style={{padding:"0 9px 9px",borderTop:`1px dashed ${C.line}`}}><div style={{display:"grid",gap:5,marginTop:7}}>{fish.map(i=>renderFishCardV4(i,area,true))}</div>{area.tip&&<div style={{fontSize:9.5,color:C.muted,lineHeight:1.4,marginTop:6}}>{area.tip}</div>}</div>}</Card>})}</div>
      {!areaRows.length&&<Card style={{marginTop:8,textAlign:"center",color:C.muted,fontSize:11}}>目前條件下沒有符合的魚；可切換季節、天氣、時間或關閉「只看未收集」。</Card>}
    </div>;
  };

'''
s = s[:start] + new_today + s[end:]

# 7) Secret Note detail card: content + solution/effect; image notes still show game art.
start = s.index('  const renderPaperCollectionV3 = (kind,total,title) => {')
end = s.index('  const renderFishCardV4 = (i, area=null, compact=false) => {')
new_paper = r'''  const renderPaperCollectionV3 = (kind,total,title) => {
    const list=extrasState[kind]||[];
    const isNotes=kind==="notes";
    const summary=isNotes?SECRET_NOTE_SUMMARY_V3:JOURNAL_SUMMARY_V3;
    const content=isNotes?SECRET_NOTE_CONTENT_V4:summary;
    const solution=isNotes?SECRET_NOTE_SOLUTION_V4:{};
    const imageMap=isNotes?SECRET_NOTE_IMAGE_V3:JOURNAL_IMAGE_V3;
    const selected=selectedPaperV3?.kind===kind?selectedPaperV3.n:null;
    return <div>
      <Card style={{marginTop:8,padding:9}}><div style={{fontSize:12,fontWeight:950,color:C.brown,marginBottom:7}}>{title} {list.length}/{total}</div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>{Array.from({length:total},(_,i)=>i+1).map(n=>{const on=list.includes(n);return <button key={n} onClick={()=>setSelectedPaperV3({kind,n})} style={{position:"relative",border:`1.5px solid ${selected===n?C.orange:on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"7px 1px",fontSize:10,fontWeight:900,color:on?C.green:C.brown}}>{n}<span onClick={e=>{e.stopPropagation();updateExtras({[kind]:on?list.filter(x=>x!==n):[...list,n]})}} style={{position:"absolute",right:1,top:0,fontSize:9}}>{on?"✓":"○"}</span></button>})}</div></Card>
      {selected&&<Card style={{marginTop:8,padding:10,background:"#F6E5B9"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><GameIcon file={isNotes?"Secret Note":"Journal Scrap"} size={36}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:950,color:C.darkBrown}}>{title} #{selected}</div><div style={{fontSize:9.5,color:C.muted,marginTop:2}}>{isNotes?"紙條內容與可執行解法":"日誌內容速查"}</div></div></div>{imageMap[selected]&&<img src={GAME_FILE(imageMap[selected])} alt={`${title} ${selected} 圖像內容`} onError={e=>e.currentTarget.style.display="none"} style={{display:"block",width:"min(216px,100%)",height:"auto",margin:"10px auto 7px",imageRendering:"pixelated",borderRadius:5}}/>}<div style={{marginTop:8,padding:"8px 9px",background:"#FFF8E2",borderRadius:8,border:`1px solid ${C.line}`}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:3}}>{isNotes?"紙條內容":"內容"}</div><div style={{fontSize:11,color:C.ink,lineHeight:1.55}}>{content[selected]||"尚未整理內容。"}</div></div>{solution[selected]&&<div style={{marginTop:7,padding:"8px 9px",background:"#EAF4D8",borderRadius:8,border:`1px solid ${C.green}`}}><div style={{fontSize:9.5,fontWeight:950,color:C.green,marginBottom:3}}>解法／效果</div><div style={{fontSize:11,color:C.ink,lineHeight:1.55}}>{solution[selected]}</div></div>}<a href={isNotes?"https://stardewvalleywiki.com/Secret_Notes":"https://stardewvalleywiki.com/Journal_Scraps"} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:7,fontSize:10,fontWeight:900,color:C.blue}}>Wiki 完整頁面 ↗</a></Card>}
    </div>;
  };

'''
s = s[:start] + new_paper + s[end:]

p.write_text(s, encoding='utf-8')
print('v17 fish navigation, mail icon and secret note contents applied')
