from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# Farm card: daily-use season buttons.
if '>{SEASON_ICON[s]} {s}</Pill>)}</div>\n          <button onClick={()=>profileInputRef.current?.click()}' not in s:
    old='''          <div style={{fontSize:12,color:C.brown}}>累計 {Number(data.base.totalIncome||0).toLocaleString()}g</div>\n          <button onClick={()=>profileInputRef.current?.click()}'''
    new='''          <div style={{fontSize:12,color:C.brown}}>累計 {Number(data.base.totalIncome||0).toLocaleString()}g</div>\n          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:7}}>{SEASONS.map(s=><Pill key={s} small active={data.base.season===s} onClick={()=>updateBase({season:s})}>{SEASON_ICON[s]} {s}</Pill>)}</div>\n          <button onClick={()=>profileInputRef.current?.click()}'''
    if old not in s: raise SystemExit('profile season marker missing')
    s=s.replace(old,new,1)

s=s.replace('''<summary style={{fontSize:10.5,color:C.muted,fontWeight:900,cursor:"pointer"}}>名稱辨識錯了？手動修正</summary>''','''<summary style={{fontSize:10.5,color:C.muted,fontWeight:900,cursor:"pointer"}}>手動修正農場資料</summary>''',1)

if '目前金錢<div style={{marginTop:3}}><NumInput value={data.base.money}' not in s:
    old='''              <input value={data.base.farm||""} onChange={e=>updateBase({farm:e.target.value})} placeholder="農場名稱（保留特殊符號）" style={{border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:11,fontWeight:800,color:C.ink}}/>\n            </div>'''
    new='''              <input value={data.base.farm||""} onChange={e=>updateBase({farm:e.target.value})} placeholder="農場名稱（保留特殊符號）" style={{border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:11,fontWeight:800,color:C.ink}}/>\n              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><label style={{fontSize:10,color:C.muted,fontWeight:900}}>年份<div style={{marginTop:3}}><NumInput value={data.base.year} min={1} max={99} onChange={v=>updateBase({year:v})}/></div></label><label style={{fontSize:10,color:C.muted,fontWeight:900}}>目前金錢<div style={{marginTop:3}}><NumInput value={data.base.money} max={999999999} onChange={v=>updateBase({money:v})} suffix="g"/></div></label></div>\n              <label style={{fontSize:10,color:C.muted,fontWeight:900}}>累計收入<div style={{marginTop:3}}><NumInput value={data.base.totalIncome} max={999999999} onChange={v=>updateBase({totalIncome:v})} suffix="g"/></div></label>\n            </div>'''
    if old not in s: raise SystemExit('profile manual edit marker missing')
    s=s.replace(old,new,1)

# Calendar image: 28 transparent day hit targets on actual 7x4 game calendar grid.
if 'aria-label={`切換到 ${day} 日`}' not in s:
    old='''        <div style={{position:"relative",width:"100%",borderRadius:8,overflow:"hidden",background:"#E7C58A"}}>\n          <img src={GAME_FILE(seasonFile)} alt={`${data.base.season}季遊戲日曆`} onError={e=>{e.currentTarget.style.display="none"}}\n            style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>\n          <div style={{position:"absolute",right:7,top:7,background:"rgba(61,34,15,.88)",color:"#FFE9B5",border:`2px solid ${C.gold}`,borderRadius:9,padding:"4px 7px",fontSize:10.5,fontWeight:950,boxShadow:"0 2px 4px rgba(0,0,0,.2)"}}>今天 {data.base.day} 日</div>\n        </div>'''
    new='''        <div style={{position:"relative",width:"100%",borderRadius:8,overflow:"hidden",background:"#E7C58A"}}>\n          <img src={GAME_FILE(seasonFile)} alt={`${data.base.season}季遊戲日曆`} onError={e=>{e.currentTarget.style.display="none"}}\n            style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>\n          <div style={{position:"absolute",left:"3.333%",right:"3.333%",top:"19.048%",bottom:"4.762%",display:"grid",gridTemplateColumns:"repeat(7,1fr)",gridTemplateRows:"repeat(4,1fr)"}}>\n            {Array.from({length:28},(_,i)=>i+1).map(day=><button key={day} aria-label={`切換到 ${day} 日`} onClick={()=>updateBase({day})} style={{position:"relative",border:data.base.day===day?`3px solid ${C.gold}`:"2px solid transparent",background:data.base.day===day?"rgba(255,234,164,.18)":"transparent",borderRadius:6,padding:0,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>{data.base.day===day&&<span style={{position:"absolute",right:2,bottom:2,fontSize:8,fontWeight:950,color:"#FFF2C1",background:"rgba(61,34,15,.82)",borderRadius:5,padding:"1px 3px"}}>{day}</span>}</button>)}\n          </div>\n          <div style={{position:"absolute",right:7,top:7,background:"rgba(61,34,15,.88)",color:"#FFE9B5",border:`2px solid ${C.gold}`,borderRadius:9,padding:"4px 7px",fontSize:10.5,fontWeight:950,boxShadow:"0 2px 4px rgba(0,0,0,.2)"}}>今天 {data.base.day} 日</div>\n        </div>'''
    if old not in s: raise SystemExit('calendar marker missing')
    s=s.replace(old,new,1)

s=s.replace('''<div style={{fontSize:9.5,color:C.muted,marginTop:6,lineHeight:1.4}}>上方直接使用《星露谷物語》中文遊戲日曆圖；下方補充季節採集等固定事件。書商每季日期依存檔隨機，無法只靠年份／季節推算。</div>''','''<div style={{fontSize:9.5,color:C.muted,marginTop:6,lineHeight:1.4}}>直接點上方遊戲日曆的日期格即可切換手帳日期；頁首、當日事件與魚類「今日可釣」會一起更新。書商每季日期依存檔隨機，無法只靠年份／季節推算。</div>''',1)

# Remove the redundant overview Date & Funds panel.
marker='    <SectionTitle icon="📅">日期與資金</SectionTitle>'
if marker in s:
    start=s.index(marker)
    end=s.index('    <SectionTitle icon="📊">進度速覽</SectionTitle>',start)
    s=s[:start]+s[end:]

p.write_text(s,encoding='utf-8')
print('overview calendar controls updated')
