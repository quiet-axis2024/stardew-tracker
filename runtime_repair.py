from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# Replace the fake compositing wardrobe with a truthful equipment-slot board.
start=s.index('  const renderWardrobeV30 = () => {')
end=s.index('  const renderNotes = () => <div>', start)
new=r'''  const renderWardrobeV30 = () => {
    const defaults={player:{hat:"",shirt:"",pants:"",boots:""},horse:{hat:""},cat:{hat:""},dog:{hat:""}};
    const wardrobe={...defaults,...(data.wardrobeV30||{})};
    const target={...(defaults[wardrobeTargetV30]||{}),...(wardrobe[wardrobeTargetV30]||{})};
    const setTarget=patch=>update({wardrobeV30:{...wardrobe,[wardrobeTargetV30]:{...target,...patch}}});
    const cats={hat:HATS_V30,shirt:SHIRTS_V30,pants:PANTS_V30,boots:BOOTS_V30};
    const list=wardrobeTargetV30==="player"?cats[wardrobeCategoryV30]:HATS_V30;
    const slot=wardrobeTargetV30==="player"?wardrobeCategoryV30:"hat";
    const chosen=target[slot]||"";
    const targets=[["player","玩家","Inventory Tab"],["horse","馬","Horse"],["cat","貓","Cat 1"],["dog","狗","Dog 1"]];
    const targetFile=wardrobeTargetV30==="horse"?"Horse":wardrobeTargetV30==="cat"?"Cat 1":wardrobeTargetV30==="dog"?"Dog 1":"Inventory Tab";
    const player={...defaults.player,...(wardrobe.player||{})};
    const findMeta=(kind,file)=>kind&&file?(cats[kind]||[]).find(x=>x[0]===file):null;
    const slotDefs=[["hat","帽子","Cowboy Hat"],["shirt","上衣","Shirt003"],["pants","下裝","Farmer Pants"],["boots","鞋","Space Boots"]];
    const currentTargetLabel=targets.find(x=>x[0]===wardrobeTargetV30)?.[1]||"玩家";
    return <div>
      <SectionTitle icon="🎩">衣櫥</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,color:C.muted,lineHeight:1.4}}>這裡改成裝備槽位與取得方式，不再把物品圖示硬貼到角色／動物圖片上。真正的穿戴預覽要用遊戲角色與服飾的 sprite 圖層合成，之後再另外做。</div></Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{targets.map(([id,name,file])=>{const on=wardrobeTargetV30===id;return <button key={id} onClick={()=>{setWardrobeTargetV30(id);if(id!=="player")setWardrobeCategoryV30("hat")}} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:9,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}>{id==="player"?(data.profilePortrait?<img src={data.profilePortrait} alt="" style={{width:27,height:34,objectFit:"cover",borderRadius:4,imageRendering:"pixelated"}}/>:<GameIcon file="Inventory Tab" size={27}/>):<GameIcon file={file} size={27}/>}<div>{name}</div></button>})}</div>

      {wardrobeTargetV30==="player"?<Card style={{marginTop:7,padding:8}}>
        <div style={{display:"grid",gridTemplateColumns:"84px minmax(0,1fr)",gap:9,alignItems:"center"}}>
          <div style={{height:112,display:"flex",alignItems:"center",justifyContent:"center",background:"#F5ECD5",borderRadius:9,border:`1px solid ${C.line}`,overflow:"hidden"}}>{data.profilePortrait?<img src={data.profilePortrait} alt="玩家" style={{width:78,height:104,objectFit:"cover",borderRadius:6,imageRendering:"pixelated"}}/>:<GameIcon file="Inventory Tab" size={70}/>}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5}}>{slotDefs.map(([id,label,fallback])=>{const file=player[id]||"",meta=findMeta(id,file),active=wardrobeCategoryV30===id;return <button key={id} onClick={()=>setWardrobeCategoryV30(id)} style={{border:`1.5px solid ${active?C.orange:file?C.green:C.line}`,background:active?"#FFF0D2":file?"#EEF7DD":C.paper,borderRadius:8,padding:"5px 3px",minHeight:67,textAlign:"center",cursor:"pointer"}}><div style={{height:31,display:"flex",alignItems:"center",justifyContent:"center"}}>{file?<GameIcon file={file} size={29}/>:<GameIcon file={fallback} size={27}/>}</div><div style={{fontSize:8.5,fontWeight:950,color:active?C.orange:file?C.green:C.ink}}>{label}</div><div style={{fontSize:6.8,color:C.muted,lineHeight:1.1,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{meta?.[1]||"未選"}</div></button>})}</div>
        </div>
      </Card>:<Card style={{marginTop:7,padding:9}}>
        <div style={{display:"grid",gridTemplateColumns:"96px minmax(0,1fr)",gap:11,alignItems:"center"}}>
          <div style={{height:108,display:"flex",alignItems:"center",justifyContent:"center",background:"#F5ECD5",borderRadius:9,border:`1px solid ${C.line}`}}><GameIcon file={targetFile} size={82}/></div>
          <div><div style={{fontSize:12,fontWeight:950,color:C.darkBrown}}>{currentTargetLabel}</div><div style={{fontSize:8.5,color:C.muted,marginTop:2}}>帽子槽</div>{target.hat?<div style={{display:"flex",alignItems:"center",gap:7,marginTop:6,padding:6,border:`1px solid ${C.green}`,background:"#EEF7DD",borderRadius:8}}><GameIcon file={target.hat} size={34}/><div style={{minWidth:0}}><b style={{fontSize:9.5,color:C.green}}>{findMeta("hat",target.hat)?.[1]||"已選帽子"}</b><div style={{fontSize:7,color:C.muted,lineHeight:1.25,marginTop:2}}>{findMeta("hat",target.hat)?.[2]||""}</div></div></div>:<div style={{fontSize:10,color:C.muted,marginTop:8}}>未戴帽子</div>}</div>
        </div>
      </Card>}

      {wardrobeTargetV30==="player"&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{slotDefs.map(([id,name,file])=>{const on=wardrobeCategoryV30===id;return <button key={id} onClick={()=>setWardrobeCategoryV30(id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:8,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file={(player[id]||file)} size={25}/><div>{name}</div></button>})}</div>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,marginTop:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown}}>{wardrobeTargetV30==="player"?slotDefs.find(x=>x[0]===slot)?.[1]:`${currentTargetLabel}帽子`}・{list.length} 項</div>{chosen&&<button onClick={()=>setTarget({[slot]:""})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:8.5,fontWeight:900,color:C.red}}>清除</button>}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:6}}>{list.map(it=>{const [file,name,source,dye]=it;const on=chosen===file;return <button key={file} onClick={()=>setTarget({[slot]:on?"":file})} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"5px 3px",minHeight:96,textAlign:"center",cursor:"pointer",minWidth:0}}><GameIcon file={file} size={36}/><div style={{fontSize:8.2,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div><div style={{fontSize:6.7,color:C.muted,lineHeight:1.2,marginTop:3}}>{source}</div>{dye&&<div style={{fontSize:6.5,color:C.blue,fontWeight:900,marginTop:2}}>可染色</div>}</button>})}</div>
    </div>;
  };

'''
s=s[:start]+new+s[end:]

# Make bottom navigation a guaranteed one-line flex bar with a restrained active state.
old='''    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:50,background:"rgba(61,34,15,.98)",borderTop:`3px solid ${C.gold}`,display:"grid",gridTemplateColumns:"repeat(6,minmax(0,1fr))",padding:"4px 5px calc(4px + env(safe-area-inset-bottom))",boxShadow:"0 -3px 10px rgba(0,0,0,.18)"}}>
      {TABS.map(t=>{const active=tab===t.id;return <button key={t.id} onClick={()=>{setTab(t.id);window.scrollTo(0,0)}} style={{background:"transparent",border:"none",padding:"1px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:1,cursor:"pointer",minWidth:0}}><span style={{width:37,height:37,border:`2px solid ${active?C.gold:"transparent"}`,background:active?"#F5D886":"transparent",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:active?"0 2px 0 rgba(0,0,0,.2)":"none"}}><GameIcon file={t.file} size={29}/></span><span style={{fontSize:9,fontWeight:950,color:active?"#FFE8A8":"#D8BC88",lineHeight:1.1,whiteSpace:"nowrap"}}>{t.name}</span></button>})}
    </div>'''
newnav='''    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:50,background:"rgba(61,34,15,.985)",borderTop:`2px solid ${C.gold}`,display:"flex",flexWrap:"nowrap",alignItems:"stretch",padding:"3px 3px calc(4px + env(safe-area-inset-bottom))",boxShadow:"0 -3px 10px rgba(0,0,0,.18)",overflow:"hidden"}}>
      {TABS.map(t=>{const active=tab===t.id;return <button key={t.id} onClick={()=>{setTab(t.id);window.scrollTo(0,0)}} style={{flex:"1 1 0",minWidth:0,background:"transparent",border:"none",padding:"1px 0 0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,cursor:"pointer",position:"relative"}}><span style={{width:26,height:3,borderRadius:3,background:active?C.gold:"transparent",marginBottom:1}}/><span style={{height:28,display:"flex",alignItems:"center",justifyContent:"center",opacity:active?1:.82}}><GameIcon file={t.file} size={25}/></span><span style={{fontSize:8.2,fontWeight:950,color:active?"#FFE39A":"#D8BC88",lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{t.name}</span></button>})}
    </div>'''
if old not in s:
    raise SystemExit('v30 bottom nav block not found')
s=s.replace(old,newnav,1)

p.write_text(s,encoding='utf-8')
print('v31 wardrobe/nav correction ready')
