from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

start=s.index('  const renderProfileCard = () => <>')
end=s.index('  const renderMiniItemV26 =', start)
new_profile=r'''  const renderProfileCard = () => <>
    <SectionTitle icon="🎒">農場名片</SectionTitle>
    <Card style={{padding:10}}>
      <div style={{display:"grid",gridTemplateColumns:"104px minmax(0,1fr)",gap:11,alignItems:"start"}}>
        <div style={{minWidth:0,textAlign:"center"}}>
          <button onClick={()=>profileInputRef.current?.click()} style={{width:96,height:126,border:`2px solid ${C.line}`,borderRadius:9,overflow:"hidden",background:"#EFE4C4",padding:0,cursor:"pointer"}}>
            {data.profilePortrait ? <img src={data.profilePortrait} alt="農夫角色" style={{width:"100%",height:"100%",objectFit:"cover",imageRendering:"pixelated"}}/> : <div style={{fontSize:10,color:C.muted,fontWeight:900,lineHeight:1.45}}>上傳玩家<br/>資料畫面<br/><span style={{fontSize:21}}>＋</span></div>}
          </button>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginTop:4}}>
            <button onClick={()=>profileInputRef.current?.click()} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,padding:"3px 6px",fontWeight:900,color:C.brown,fontSize:8.5}}>{data.profilePortrait?"更換":"上傳"}</button>
            {data.profilePortrait&&<button onClick={()=>update({profilePortrait:""})} style={{border:0,background:"transparent",color:C.red,fontSize:8.5,fontWeight:900,padding:"3px 2px"}}>移除</button>}
          </div>
          {profileOcrStatus&&<div style={{fontSize:7.5,color:profileOcrStatus.startsWith("⚠")?C.red:C.green,fontWeight:850,lineHeight:1.25,marginTop:3}}>{profileOcrStatus.startsWith("✓")?"✓ 已更新資料":profileOcrStatus}</div>}
        </div>
        <div style={{minWidth:0}}>
          <div style={{fontSize:15,fontWeight:950,color:C.darkBrown,lineHeight:1.15}}>{data.base.name || "未記錄農夫名"}</div>
          <div style={{fontSize:17,fontWeight:950,color:C.darkBrown,marginTop:2,lineHeight:1.15}}>{data.base.farm}</div>
          <div style={{fontSize:11.5,color:C.brown,marginTop:8,fontWeight:850}}>持有 {Number(data.base.money||0).toLocaleString()}g</div>
          <div style={{fontSize:10.5,color:C.muted,marginTop:1}}>累計 {Number(data.base.totalIncome||0).toLocaleString()}g</div>
          <div style={{display:"grid",gridTemplateColumns:"26px auto 26px",alignItems:"center",gap:4,marginTop:8,width:"fit-content"}}>
            <button onClick={()=>updateBase({year:Math.max(1,Number(data.base.year||1)-1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,height:25,fontWeight:950,color:C.brown,padding:0}}>−</button>
            <div style={{fontSize:10.5,fontWeight:950,color:C.darkBrown,textAlign:"center",minWidth:50}}>第 {data.base.year} 年</div>
            <button onClick={()=>updateBase({year:Math.min(99,Number(data.base.year||1)+1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,height:25,fontWeight:950,color:C.brown,padding:0}}>＋</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:3,marginTop:6}}>{SEASONS.map(season=>{const active=data.base.season===season;return <button key={season} onClick={()=>updateBase({season})} style={{border:`1.5px solid ${active?C.green:C.line}`,background:active?C.lightGreen:C.cream,borderRadius:14,padding:"4px 2px",fontSize:9.5,fontWeight:900,color:active?C.green:C.ink,whiteSpace:"nowrap"}}>{SEASON_ICON[season]} {season}</button>})}</div>
        </div>
        <details style={{gridColumn:"1 / -1",borderTop:`1px dashed ${C.line}`,paddingTop:5,marginTop:0}}>
          <summary style={{fontSize:9.5,color:C.muted,fontWeight:900,cursor:"pointer",width:"fit-content"}}>✎ 編輯資料</summary>
          <div style={{display:"grid",gap:5,marginTop:6}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              <input value={data.base.name||""} onChange={e=>updateBase({name:e.target.value})} placeholder="農夫名字" style={{minWidth:0,border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:10.5,fontWeight:800,color:C.ink}}/>
              <input value={data.base.farm||""} onChange={e=>updateBase({farm:e.target.value})} placeholder="農場名稱" style={{minWidth:0,border:`1.5px solid ${C.line}`,background:"#FFFCF0",borderRadius:7,padding:"6px 7px",fontSize:10.5,fontWeight:800,color:C.ink}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              <label style={{fontSize:8.5,color:C.muted,fontWeight:900}}>目前金錢<div style={{marginTop:2}}><NumInput value={data.base.money} max={999999999} onChange={v=>updateBase({money:v})} suffix="g"/></div></label>
              <label style={{fontSize:8.5,color:C.muted,fontWeight:900}}>累計收入<div style={{marginTop:2}}><NumInput value={data.base.totalIncome} max={999999999} onChange={v=>updateBase({totalIncome:v})} suffix="g"/></div></label>
            </div>
          </div>
        </details>
      </div>
      <input ref={profileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{handleProfileUpload(e.target.files?.[0]);e.target.value=""}}/>
    </Card>
  </>;

'''
s=s[:start]+new_profile+s[end:]

start=s.index('  const renderHeader = () => <>')
end=s.index('  const renderOverview = () =>',start)
new_header=r'''  const renderHeader = () => <>
    <div style={{background:C.darkBrown,color:"white",padding:"calc(8px + env(safe-area-inset-top)) 12px 8px",position:"sticky",top:0,zIndex:30,boxShadow:"0 2px 8px rgba(0,0,0,.25)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <GameIcon file="Junimo Icon" size={34}/>
        <div style={{minWidth:0}}><div style={{fontSize:16,fontWeight:950,letterSpacing:.3,lineHeight:1.1}}>星露谷農場手帳</div></div>
        <div style={{marginLeft:"auto",textAlign:"right",minWidth:0}}>
          <div style={{fontWeight:950,fontSize:12.5,lineHeight:1.15}}>{SEASON_ICON[data.base.season]} 第 {data.base.year} 年 {data.base.season} {data.base.day} 日</div>
          <div style={{fontSize:10.5,color:"#E8C88F",marginTop:2}}>{Number(data.base.money||0).toLocaleString()}g</div>
        </div>
      </div>
    </div>
  </>;

'''
s=s[:start]+new_header+s[end:]
p.write_text(s,encoding='utf-8')
print('compact profile and topbar v29 ready')
