from pathlib import Path
import sys

p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')

def repl(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'build_fish_guide_patch: marker not found: {label}')
    s=s.replace(old,new,1)

# Structured fishing guide. Indexes match COLLECTIONS.fish / FISH_ICON_FILES.
anchor='const SPECIAL_ITEMS_V2 = ['
defs=r'''
const FISH_RULES_V4 = {
  0:{s:["夏"],w:"晴",t:[[12,16]]},1:{s:["春","秋"],w:"任意",t:[[6,26]]},2:{s:["夏","冬"],w:"任意",t:[[6,19]]},3:{s:["春","秋","冬"],w:"任意",t:[[6,19]]},
  4:{s:["春","夏","秋","冬"],w:"任意",t:[[18,26]]},5:{s:["春","夏","秋","冬"],w:"任意",t:[[6,19]]},6:{s:["春","秋"],w:"任意",t:[[6,26]]},7:{s:["夏"],w:"晴",t:[[6,19]]},
  8:{s:["秋"],w:"任意",t:[[6,19]]},9:{s:["秋","冬"],w:"雨",t:[[12,26]]},10:{s:["冬"],w:"任意",t:[[6,26]]},11:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  12:{s:["春","秋"],w:"雨",t:[[6,24]]},13:{s:["夏","冬"],w:"任意",t:[[6,26]]},14:{s:["春","夏"],w:"晴",t:[[6,19]]},15:{s:["夏","冬"],w:"任意",t:[[6,19]]},
  16:{s:["春","冬"],w:"任意",t:[[6,26]]},17:{s:["春","秋"],w:"雨",t:[[16,26]]},18:{s:["夏"],w:"任意",t:[[6,13]]},19:{s:["夏","秋","冬"],w:"雨",t:[[6,19]]},
  20:{s:["冬"],w:"任意",t:[[18,26]]},21:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},22:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},23:{s:["秋","冬"],w:"任意",t:[[6,19]]},
  24:{s:["夏","秋"],w:"任意",t:[[18,26]]},25:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},26:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},27:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  28:{s:["夏"],w:"任意",t:[[6,26]],legend:true},29:{s:["秋"],w:"任意",t:[[6,26]],legend:true},30:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},31:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  32:{s:["春"],w:"雨",t:[[6,26]],legend:true},33:{s:["春","夏","秋","冬"],w:"任意",t:[[6,20]]},34:{s:["春","夏","秋","冬"],w:"任意",t:[[6,20]]},35:{s:["春","夏"],w:"任意",t:[[6,20]]},
  36:{s:["秋","冬"],w:"任意",t:[[22,26]]},38:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]],legend:true},39:{s:["夏","冬"],w:"任意",t:[[6,19]]},40:{s:["秋","冬"],w:"任意",t:[[6,19]]},
  41:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},42:{s:["夏","秋"],w:"任意",t:[[6,14]]},43:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},44:{s:["夏"],w:"任意",t:[[6,19]]},
  45:{s:["秋","冬"],w:"任意",t:[[6,11],[18,26]]},46:{s:["春","夏","秋"],w:"雨",t:[[9,26]]},47:{s:["冬"],w:"任意",t:[[6,26]]},48:{s:["春","夏","冬"],w:"任意",t:[[6,11],[19,26]]},
  58:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},59:{s:["冬"],w:"任意",t:[[6,26]],legend:true},60:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},61:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  62:{s:["冬"],w:"任意",t:[[17,26]]},63:{s:["冬"],w:"任意",t:[[17,26]]},64:{s:["冬"],w:"任意",t:[[17,26]]},65:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},
  66:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},67:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]},68:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]],jelly:true},
  69:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]],jelly:true},70:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]],jelly:true},71:{s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]}
};

const FISH_AREAS_V4 = [
  {id:"town",name:"鵜鶘鎮",sub:"河流",icon:"Sunfish",fish:[14,12,22,6,46,4,7,13,8,40,9,47,10,29,68],tip:"釣鮟鱇魚需站在河流最北端。"},
  {id:"forest_river",name:"煤礦森林",sub:"河流",icon:"Chub",fish:[14,12,43,22,46,4,44,7,13,8,40,9,47,10,68]},
  {id:"forest_pond",name:"煤礦森林",sub:"池塘",icon:"Smallmouth Bass",fish:[22,6,13,9,36,10,68]},
  {id:"forest_falls",name:"煤礦森林",sub:"南部瀑布",icon:"Goby",fish:[71,8],tip:"蝦虎魚需把浮標拋進南部瀑布下方水池；有效釣魚等級至少 4。"},
  {id:"glacier",name:"煤礦森林",sub:"南部小島",icon:"Glacierfish",fish:[59],tip:"冰川魚是冬季傳說魚，需在箭頭形小島南端指定水域。"},
  {id:"mountain",name:"山湖",sub:"礦井外湖泊",icon:"Largemouth Bass",fish:[5,41,11,43,22,7,39,9,36,47,10,32,68],tip:"傳說之魚需春季雨天、釣魚等級 10，浮標需落在離岸足夠遠的位置。"},
  {id:"beach",name:"海灘",sub:"海洋",icon:"Sardine",fish:[3,35,1,16,21,48,17,18,42,15,19,2,0,24,23,45,20,28,70],tip:"緋紅魚需夏季、釣魚等級 5，並在修橋後的東側區域拋遠。"},
  {id:"secret",name:"秘密森林",sub:"池塘",icon:"Woodskip",fish:[11,58,12,68],seasonOverride:{12:["春","夏","秋"]}},
  {id:"desert",name:"沙漠",sub:"池塘",icon:"Sandfish",fish:[33,34,22,68]},
  {id:"sewer",name:"下水道",sub:"水域",icon:"Mutant Carp",fish:[11,22,26,38]},
  {id:"bug",name:"突變蟲穴",sub:"水域",icon:"Slimejack",fish:[11,61,22,26]},
  {id:"mine20",name:"礦井",sub:"20 層",icon:"Stonefish",fish:[25,27,22,26,69]},
  {id:"mine60",name:"礦井",sub:"60 層",icon:"Ice Pip",fish:[25,30,22,26,69]},
  {id:"mine100",name:"礦井",sub:"100 層",icon:"Lava Eel",fish:[31,22,26,69]},
  {id:"witch",name:"女巫沼澤",sub:"沼澤",icon:"Void Salmon",fish:[60,12,22,26],seasonOverride:{12:["春","夏","秋"]}},
  {id:"night",name:"冬季夜市",sub:"潛水艇",icon:"Midnight Squid",fish:[62,63,64,18,23,24,21,70],forceSeasons:["冬"],days:[15,16,17],timeOverride:[[17,26]],tip:"夜市冬 15–17 日 17:00–02:00；潛水艇下潛還會消耗約 30 分鐘遊戲時間。"},
  {id:"island_n",name:"薑島北部",sub:"淡水",icon:"Blue Discus",fish:[67,36,42,68],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_w_fresh",name:"薑島西部",sub:"河流／池塘",icon:"Blue Discus",fish:[67,36,42,68],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_w_ocean",name:"薑島西部",sub:"海洋",icon:"Lionfish",fish:[35,66,18,0,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"island_s",name:"薑島南部及東南部",sub:"海洋",icon:"Lionfish",fish:[35,66,0,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"pirate",name:"海盜灣",sub:"海洋",icon:"Stingray",fish:[35,0,65,24,2,70],forceSeasons:["春","夏","秋","冬"],island:true},
  {id:"caldera",name:"火山口",sub:"熔岩湖",icon:"Lava Eel",fish:[31],forceSeasons:["春","夏","秋","冬"],island:true}
];

function fishRuleV4(i){ return FISH_RULES_V4[i] || {s:["春","夏","秋","冬"],w:"任意",t:[[6,26]]}; }
function formatFishTimeV4(rule, override){
  const windows=override||rule.t||[[6,26]];
  if(windows.length===1&&windows[0][0]===6&&windows[0][1]===26)return "全天";
  const fmt=n=>n>=24?`${String(n-24).padStart(2,"0")}:00`:`${String(n).padStart(2,"0")}:00`;
  return windows.map(([a,b])=>`${fmt(a)}–${fmt(b)}`).join("／");
}
function parseGameHourV4(value){
  const m=String(value||"").match(/(\d{1,2}):(\d{2})/); if(!m)return null;
  let h=Number(m[1])+Number(m[2])/60; if(h<6)h+=24; return h;
}
function fishAvailableV4(area,i,season,weather,hour,day){
  const rule=fishRuleV4(i);
  const seasons=area.forceSeasons||area.seasonOverride?.[i]||rule.s;
  if(season&&season!=="全部"&&!seasons.includes(season))return false;
  if(area.days&&day&&!area.days.includes(Number(day)))return false;
  if(weather&&weather!=="全部"&&rule.w!=="任意"&&rule.w!==weather)return false;
  if(hour!=null){const windows=area.timeOverride||rule.t||[[6,26]];if(!windows.some(([a,b])=>hour>=a&&hour<b))return false;}
  return true;
}
'''
repl(anchor,defs+'\n'+anchor,'fish data')

# Add dedicated fish-guide state after the social state added by build_ui_share_patch.
state='''  const [socialGroup, setSocialGroup] = useState("single");
  const [pondPicker, setPondPicker] = useState(null);'''
state2='''  const [socialGroup, setSocialGroup] = useState("single");
  const [pondPicker, setPondPicker] = useState(null);
  const [fishViewV4, setFishViewV4] = useState("today");
  const [fishAreaV4, setFishAreaV4] = useState("town");
  const [fishWeatherV4, setFishWeatherV4] = useState("全部");
  const [fishHourV4, setFishHourV4] = useState("auto");
  const [fishMissingV4, setFishMissingV4] = useState(true);'''
repl(state,state2,'fish states')

# Insert fish UI before the final collection wrapper.
marker='  const renderCollection = () => {'
idx=s.index(marker)
helpers=r'''
  const renderFishCardV4 = (i, area=null, compact=false) => {
    const name=COLLECTIONS.fish.items[i]; const got=(data.collections.fish||[]).includes(i); const rule=fishRuleV4(i);
    const seasons=area?.forceSeasons||area?.seasonOverride?.[i]||rule.s;
    const seasonText=seasons.length===4?"四季":seasons.join("／");
    const timeText=formatFishTimeV4(rule,area?.timeOverride);
    return <button key={`${area?.id||"fish"}-${i}`} onClick={()=>setSelectedItem(i)} style={{position:"relative",border:`2px solid ${!got?C.orange:C.line}`,background:got?"#F5F0DF":"#FFF2CF",borderRadius:9,padding:compact?"6px":"8px",display:"flex",alignItems:"center",gap:8,textAlign:"left",cursor:"pointer",width:"100%",opacity:got?.78:1}}>
      <img src={ICON_URLS.fish[i]} alt="" loading="lazy" style={{width:compact?34:40,height:compact?34:40,imageRendering:"pixelated",objectFit:"contain",flex:"0 0 auto"}}/>
      <span style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:compact?11:12.5,color:C.ink}}>{name}{rule.legend?" · 傳說":""}</b><span style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:3}}>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#F0E2C5",color:C.brown}}>{seasonText}</span>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:rule.w==="雨"?"#D9EAF8":rule.w==="晴"?"#FFF0A9":"#EAE3D4",color:C.ink}}>{rule.w}</span>
        <span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#E5EDF2",color:C.blue}}>{timeText}</span>
      </span></span>
      <span style={{fontSize:11,fontWeight:950,color:got?C.green:C.orange}}>{got?"✓ 已收集":"未收集"}</span>
    </button>;
  };

  const renderFishDexV4 = () => {
    const got=data.collections.fish||[];
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900,color:C.muted,marginBottom:5}}><span>魚類圖鑑</span><span>{got.length}/{COLLECTIONS.fish.items.length}</span></div><ProgressBar value={got.length} max={COLLECTIONS.fish.items.length}/></Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:6,marginTop:8}}>{COLLECTIONS.fish.items.map((name,i)=>{const on=got.includes(i);return <button key={i} onClick={()=>setSelectedItem(i)} style={{position:"relative",border:`2px solid ${!on?C.orange:C.line}`,background:on?"#E8F1D5":C.paper,borderRadius:9,minHeight:76,padding:"5px 2px",cursor:"pointer"}}><img src={ICON_URLS.fish[i]} alt="" style={{width:36,height:36,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:9,fontWeight:900,color:C.ink,lineHeight:1.05}}>{name}</div><button onClick={e=>{e.stopPropagation();updateNested("collections",{fish:on?got.filter(x=>x!==i):[...got,i]})}} style={{position:"absolute",right:2,top:2,border:0,background:"transparent",fontSize:12,color:on?C.green:"#C9A86A",fontWeight:950}}>{on?"✓":"○"}</button></button>})}</div>
      {selectedItem!=null&&<Card style={{marginTop:8,background:"#FFF8E2"}}><div style={{display:"flex",gap:9,alignItems:"center"}}><img src={ICON_URLS.fish[selectedItem]} alt="" style={{width:48,height:48,imageRendering:"pixelated"}}/><div style={{flex:1,minWidth:0}}><b style={{fontSize:15,color:C.darkBrown}}>{COLLECTIONS.fish.items[selectedItem]}</b><div style={{fontSize:10.5,color:C.muted,marginTop:3}}>{FISH_INFO[selectedItem]||""}</div></div><WikiBtn name={COLLECTIONS.fish.items[selectedItem]}/></div></Card>}
    </div>;
  };

  const renderFishFindV4 = () => {
    const area=FISH_AREAS_V4.find(a=>a.id===fishAreaV4)||FISH_AREAS_V4[0];
    const missing=(data.collections.fish||[]);
    return <div style={{marginTop:8}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5}}>{FISH_AREAS_V4.map(a=><button key={a.id} onClick={()=>setFishAreaV4(a.id)} style={{border:`2px solid ${fishAreaV4===a.id?C.orange:C.line}`,background:fishAreaV4===a.id?"#FFE2B7":C.paper,borderRadius:9,padding:"7px 6px",display:"flex",alignItems:"center",gap:6,textAlign:"left",cursor:"pointer"}}><GameIcon file={a.icon} size={28}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:10.5,color:C.ink}}>{a.name}</b><span style={{display:"block",fontSize:9,color:C.muted}}>{a.sub}</span></span></button>)}</div>
      <Card style={{marginTop:8,padding:9,background:"#FFF4D8"}}><div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={area.icon} size={36}/><div><b style={{fontSize:14,color:C.darkBrown}}>{area.name} · {area.sub}</b>{area.island&&<div style={{fontSize:10,color:C.green,fontWeight:900,marginTop:2}}>薑島魚類不受季節限制</div>}</div></div>{area.tip&&<div style={{fontSize:10.5,color:C.brown,lineHeight:1.45,marginTop:6}}>{area.tip}</div>}</Card>
      <div style={{display:"grid",gap:6,marginTop:7}}>{area.fish.filter(i=>!fishMissingV4||!missing.includes(i)).map(i=>renderFishCardV4(i,area))}</div>
      <label style={{display:"flex",alignItems:"center",gap:6,marginTop:8,fontSize:10.5,fontWeight:900,color:C.brown}}><input type="checkbox" checked={fishMissingV4} onChange={e=>setFishMissingV4(e.target.checked)}/>只看未收集</label>
    </div>;
  };

  const renderFishTodayV4 = () => {
    const got=data.collections.fish||[];
    const autoHour=parseGameHourV4(data.base.gameTime);
    const hour=fishHourV4==="auto"?autoHour:fishHourV4==="all"?null:Number(fishHourV4);
    const areaRows=FISH_AREAS_V4.map(area=>({area,fish:area.fish.filter(i=>fishAvailableV4(area,i,data.base.season,fishWeatherV4,hour,data.base.day)&&(!fishMissingV4||!got.includes(i)))})).filter(x=>x.fish.length);
    const total=areaRows.reduce((n,x)=>n+x.fish.length,0);
    return <div style={{marginTop:8}}>
      <Card style={{padding:9,background:"#FFF4D8"}}><div style={{fontSize:12,fontWeight:950,color:C.darkBrown}}>第 {data.base.year} 年 · {data.base.season} {data.base.day} 日</div><div style={{fontSize:10.5,color:C.muted,marginTop:3}}>依目前季節、天氣與時間篩選；同一條魚如果能在多個地點釣到，會出現在不同地區，方便直接選路線。</div></Card>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:7}}>{["全部","晴","雨"].map(w=><Pill key={w} small active={fishWeatherV4===w} onClick={()=>setFishWeatherV4(w)}>{w==="全部"?"全部天氣":w}</Pill>)}</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>{[["auto",autoHour!=null?`目前 ${data.base.gameTime}`:"目前時間未記錄"],["all","不限時間"],[6,"06:00"],[9,"09:00"],[12,"12:00"],[15,"15:00"],[18,"18:00"],[22,"22:00"],[24,"00:00"]].map(([v,n])=><Pill key={String(v)} small active={String(fishHourV4)===String(v)} onClick={()=>setFishHourV4(v)}>{n}</Pill>)}</div>
      <label style={{display:"flex",alignItems:"center",gap:6,marginTop:7,fontSize:10.5,fontWeight:900,color:C.brown}}><input type="checkbox" checked={fishMissingV4} onChange={e=>setFishMissingV4(e.target.checked)}/>只看未收集</label>
      <div style={{fontSize:10,color:C.muted,margin:"6px 0"}}>目前共有 {total} 個「地點 × 魚」可選。</div>
      <div style={{display:"grid",gap:9}}>{areaRows.map(({area,fish})=><Card key={area.id} style={{padding:9}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}><GameIcon file={area.icon} size={30}/><div style={{flex:1}}><b style={{fontSize:12.5,color:C.darkBrown}}>{area.name} · {area.sub}</b>{area.island&&<span style={{display:"block",fontSize:9,color:C.green,fontWeight:900}}>薑島：四季皆可</span>}</div><span style={{fontSize:10,color:C.muted,fontWeight:900}}>{fish.length} 項</span></div><div style={{display:"grid",gap:5}}>{fish.map(i=>renderFishCardV4(i,area,true))}</div>{area.tip&&<div style={{fontSize:9.5,color:C.muted,lineHeight:1.4,marginTop:6}}>{area.tip}</div>}</Card>)}</div>
      {!areaRows.length&&<Card style={{marginTop:8,textAlign:"center",color:C.muted,fontSize:11}}>目前條件下沒有符合的魚；可切換天氣、時間或關閉「只看未收集」。</Card>}
    </div>;
  };

  const renderFishHubV4 = () => <div>
    <Card style={{marginTop:8,padding:9,background:"#EAF4D8"}}><div style={{fontSize:11.5,fontWeight:950,color:C.darkBrown}}>魚類：收藏＋找魚＋今日決策</div><div style={{fontSize:10.5,color:C.muted,lineHeight:1.45,marginTop:3}}>圖鑑看收集；找魚按地點反查；今日可釣直接依你的存檔日期／時間篩選。</div></Card>
    <div style={{display:"flex",gap:5,marginTop:7}}><Pill active={fishViewV4==="dex"} onClick={()=>setFishViewV4("dex")}>圖鑑</Pill><Pill active={fishViewV4==="find"} onClick={()=>setFishViewV4("find")}>找魚</Pill><Pill active={fishViewV4==="today"} onClick={()=>setFishViewV4("today")}>今日可釣</Pill></div>
    {fishViewV4==="dex"&&renderFishDexV4()}{fishViewV4==="find"&&renderFishFindV4()}{fishViewV4==="today"&&renderFishTodayV4()}
  </div>;

'''
s=s[:idx]+helpers+s[idx:]

repl('{collectionSection==="fish"&&renderDexCollection()}','{collectionSection==="fish"&&renderFishHubV4()}','fish collection route')

p.write_text(s,encoding='utf-8')
print('build_fish_guide_patch: three-mode fish guide applied')
