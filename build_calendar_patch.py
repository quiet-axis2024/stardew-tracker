from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'build/entry.jsx')
s = path.read_text(encoding='utf-8')

start = s.index('  const renderCalendar = () => <>')
end = s.index('\n\n  const renderHeader = () => <>', start)

new_calendar = r'''  const renderCalendar = () => {
    const seasonFile = {
      春:"Calendar Spring ZH", 夏:"Calendar Summer ZH", 秋:"Calendar Fall ZH", 冬:"Calendar Winter ZH"
    }[data.base.season] || "Calendar Spring ZH";
    const todayItems = dayCalendarItems(data.base.day);
    const upcoming = Array.from({length:28-data.base.day},(_,i)=>data.base.day+i+1)
      .map(day=>({day,items:dayCalendarItems(day)}))
      .filter(x=>x.items.length)
      .slice(0,4);
    return <>
      <SectionTitle icon="📅" right={`第 ${data.base.year} 年・${data.base.season}季`}>遊戲日曆</SectionTitle>
      <Card style={{padding:7,overflow:"hidden"}}>
        <div style={{position:"relative",width:"100%",borderRadius:8,overflow:"hidden",background:"#E7C58A"}}>
          <img src={GAME_FILE(seasonFile)} alt={`${data.base.season}季遊戲日曆`} onError={e=>{e.currentTarget.style.display="none"}}
            style={{display:"block",width:"100%",height:"auto",imageRendering:"pixelated"}}/>
          <div style={{position:"absolute",right:7,top:7,background:"rgba(61,34,15,.88)",color:"#FFE9B5",border:`2px solid ${C.gold}`,borderRadius:9,padding:"4px 7px",fontSize:10.5,fontWeight:950,boxShadow:"0 2px 4px rgba(0,0,0,.2)"}}>今天 {data.base.day} 日</div>
        </div>
        {todayItems.length>0 && <div style={{marginTop:7,padding:"7px 9px",borderRadius:8,background:"#FFF1CF",fontSize:12,fontWeight:900,color:C.brown}}>今天：{todayItems.map(x=>x.text).join("、")}</div>}
        {todayItems.length===0 && <div style={{marginTop:7,fontSize:11,color:C.muted,fontWeight:800}}>今天沒有固定生日／節日／季節事件。</div>}
        {upcoming.length>0 && <div style={{marginTop:7,borderTop:`1px dashed ${C.line}`,paddingTop:6}}>
          <div style={{fontSize:10.5,color:C.muted,fontWeight:950,marginBottom:3}}>接下來</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{upcoming.map(x=><button key={x.day} onClick={()=>updateBase({day:x.day})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:9,padding:"4px 7px",fontSize:10,fontWeight:900,color:C.brown,cursor:"pointer"}}>{x.day}日 · {x.items.map(i=>i.text).join("／")}</button>)}</div>
        </div>}
        <div style={{fontSize:9.5,color:C.muted,marginTop:6,lineHeight:1.4}}>上方直接使用《星露谷物語》中文遊戲日曆圖；下方補充季節採集等固定事件。書商每季日期依存檔隨機，無法只靠年份／季節推算。</div>
      </Card>
    </>;
  };'''

s = s[:start] + new_calendar + s[end:]
path.write_text(s, encoding='utf-8')
print('build_calendar_patch: use original Chinese in-game seasonal calendar images')
