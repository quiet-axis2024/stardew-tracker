from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

def rep(old,new,count=None):
    global s
    n=s.count(old)
    if count is not None and n!=count:
        raise SystemExit(f'replace count mismatch: expected {count}, got {n}: {old[:90]!r}')
    if n==0:
        raise SystemExit(f'pattern not found: {old[:120]!r}')
    s=s.replace(old,new)

# Large previews: keep the game's actual daybg/nightbg, but crop away the frame baked into those textures.
rep('backgroundSize:"cover",backgroundPosition:"center",imageRendering:"pixelated"',
    'backgroundSize:"125% auto",backgroundPosition:"center 50%",backgroundRepeat:"no-repeat",imageRendering:"pixelated"',2)

# Pass Wizard-style appearance values into the farmer compositor.
rep('''      hairColor:player.hairColor,hairIndex:player.hairIndex,\n      shirtDyeable,pantsDyeable\n    }).catch(e=>console.warn("farmer sprite preview failed",e));\n  },[player.gender,player.hat,player.shirt,player.pants,player.boots,player.shirtColor,player.pantsColor,player.hairColor,player.hairIndex,direction,shirtDyeable,pantsDyeable]);''',
'''      hairColor:player.hairColor,hairIndex:player.hairIndex,\n      skinIndex:player.skinIndex,eyeColor:player.eyeColor,accessoryIndex:player.accessoryIndex,\n      shirtDyeable,pantsDyeable\n    }).catch(e=>console.warn("farmer sprite preview failed",e));\n  },[player.gender,player.hat,player.shirt,player.pants,player.boots,player.shirtColor,player.pantsColor,player.hairColor,player.hairIndex,player.skinIndex,player.eyeColor,player.accessoryIndex,direction,shirtDyeable,pantsDyeable]);''',1)

# Browser / appearance metadata state.
rep('''  const [wardrobeQueryV34, setWardrobeQueryV34] = useState("");\n  const profileInputRef = useRef(null);''',
'''  const [wardrobeQueryV34, setWardrobeQueryV34] = useState("");\n  const [wardrobeFilterV37, setWardrobeFilterV37] = useState("all");\n  const [wardrobePageV37, setWardrobePageV37] = useState(0);\n  const [wardrobeAppearanceMetaV37, setWardrobeAppearanceMetaV37] = useState({hairCount:64,skinCount:24,accessoryCount:29,defaultEyeColor:"#5B4636"});\n  const profileInputRef = useRef(null);''',1)
rep('''  const saveTimer = useRef(null);\n\n  /* 載入：讀取目前瀏覽器的本機進度，無則使用預填資料 */''',
'''  const saveTimer = useRef(null);\n\n  useEffect(()=>{\n    let alive=true;\n    const api=window.SDVFarmerSpriteV33;\n    if(api?.getAppearanceMeta) api.getAppearanceMeta().then(meta=>{if(alive&&meta)setWardrobeAppearanceMetaV37(meta)}).catch(e=>console.warn("appearance metadata failed",e));\n    return()=>{alive=false};\n  },[]);\n\n  /* 載入：讀取目前瀏覽器的本機進度，無則使用預填資料 */''',1)

# Defaults for the Wizard-editable appearance fields.
rep('''      player:{hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99",gender:"female",hairIndex:0,hairColor:"#6a402c"},''',
'''      player:{hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99",gender:"female",hairIndex:0,hairColor:"#6a402c",skinIndex:0,eyeColor:wardrobeAppearanceMetaV37.defaultEyeColor||"#5B4636",accessoryIndex:-1},''',1)

# Search -> filter -> finite page, so hundreds of clothes never render in one endless list.
rep('''    const q=wardrobeQueryV34.trim().toLowerCase();\n    const list=q?rawList.filter(it=>`${it[1]} ${it[2]} ${it[4]?.source||""} ${it[0]}`.toLowerCase().includes(q)):rawList;\n    const slot=wardrobeTargetV30==="player"?wardrobeCategoryV30:"hat";''',
'''    const q=wardrobeQueryV34.trim().toLowerCase();\n    const searched=q?rawList.filter(it=>`${it[1]} ${it[2]} ${it[4]?.source||""} ${it[0]}`.toLowerCase().includes(q)):rawList;\n    const list=searched.filter(it=>wardrobeFilterV37==="dyeable"?Boolean(it[3]):wardrobeFilterV37==="tailoring"?Boolean(it[4]?.recipe):wardrobeFilterV37==="other"?!it[4]?.recipe:true);\n    const WARDROBE_PAGE_SIZE_V37=18;\n    const wardrobePageCountV37=Math.max(1,Math.ceil(list.length/WARDROBE_PAGE_SIZE_V37));\n    const wardrobePageSafeV37=Math.min(wardrobePageV37,wardrobePageCountV37-1);\n    const pageList=list.slice(wardrobePageSafeV37*WARDROBE_PAGE_SIZE_V37,(wardrobePageSafeV37+1)*WARDROBE_PAGE_SIZE_V37);\n    const slot=wardrobeTargetV30==="player"?wardrobeCategoryV30:"hat";''',1)

# Appearance metadata / colors next to existing dye helpers.
rep('''    const shirtColor=player.shirtColor||defaults.player.shirtColor,pantsColor=player.pantsColor||defaults.player.pantsColor;''',
'''    const shirtColor=player.shirtColor||defaults.player.shirtColor,pantsColor=player.pantsColor||defaults.player.pantsColor;\n    const hairColor=player.hairColor||defaults.player.hairColor,eyeColor=player.eyeColor||wardrobeAppearanceMetaV37.defaultEyeColor||"#5B4636";\n    const hairCountV37=Math.max(1,Number(wardrobeAppearanceMetaV37.hairCount)||64),skinCountV37=Math.max(1,Number(wardrobeAppearanceMetaV37.skinCount)||24),accessoryCountV37=Math.max(1,Number(wardrobeAppearanceMetaV37.accessoryCount)||29);''',1)

# Version note.
rep('''v36：下方白天／夜晚預覽改用遊戲 daybg／nightbg 原圖；帽子取得方式中文化；髮型改為箭頭＋號碼輸入；貓狗可切換 6 種遊戲外觀；馬帽重新按 1.6 Horse.draw() 座標校正。''',
'''v37：白天／夜晚仍使用遊戲 daybg／nightbg，但只顯示畫面內部、不露素材木框；角色外觀補上法師地下室可調的膚色、眼色、髮色 RGB 與配飾；衣物改成篩選＋分頁瀏覽。''',1)

# Reset clothing browser when changing target or slot.
rep('''onClick={()=>{setWardrobeTargetV30(id);setWardrobeQueryV34("");if(id!=="player")setWardrobeCategoryV30("hat")}}''',
'''onClick={()=>{setWardrobeTargetV30(id);setWardrobeQueryV34("");setWardrobeFilterV37("all");setWardrobePageV37(0);if(id!=="player")setWardrobeCategoryV30("hat")}}''',1)
rep('''onClick={()=>{setWardrobeCategoryV30(id);setWardrobeQueryV34("")}}''',
'''onClick={()=>{setWardrobeCategoryV30(id);setWardrobeQueryV34("");setWardrobeFilterV37("all");setWardrobePageV37(0)}}''',1)

# Replace the appearance card with the actual Wizard-changing fields that affect how the character looks.
start_marker='''        <Card style={{marginTop:7,padding:8}}>\n          <div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:6}}>角色外觀</div>'''
next_marker='''        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{slotDefs.map'''
start=s.index(start_marker)
end=s.index(next_marker,start)
new_card='''        <Card style={{marginTop:7,padding:8}}>\n          <div style={{fontSize:9.5,fontWeight:950,color:C.brown}}>角色外觀</div>\n          <div style={{fontSize:7.4,color:C.muted,lineHeight:1.4,marginTop:3,marginBottom:7}}>法師地下室可改：體型、膚色、眼睛顏色、髮型、髮色、配飾；另外也能改名字與最愛。這裡只放會影響穿搭預覽的外觀項目。</div>\n          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><button onClick={()=>setPlayer({gender:"female"})} style={{border:`1.5px solid ${player.gender!=="male"?C.orange:C.line}`,background:player.gender!=="male"?"#FFF0D2":C.paper,borderRadius:8,padding:6,fontSize:9,fontWeight:950,color:C.brown}}>女性體型</button><button onClick={()=>setPlayer({gender:"male"})} style={{border:`1.5px solid ${player.gender==="male"?C.orange:C.line}`,background:player.gender==="male"?"#FFF0D2":C.paper,borderRadius:8,padding:6,fontSize:9,fontWeight:950,color:C.brown}}>男性體型</button></div>\n          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:8}}>\n            <div><div style={{fontSize:8.2,fontWeight:950,color:C.ink,marginBottom:4}}>膚色</div><div style={{display:"grid",gridTemplateColumns:"32px 1fr 32px",gap:3}}><button onClick={()=>setPlayer({skinIndex:Math.max(0,Number(player.skinIndex||0)-1)})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,fontWeight:950,color:C.brown}}>◀</button><input type="number" min="1" max={skinCountV37} value={Number(player.skinIndex||0)+1} onChange={e=>setPlayer({skinIndex:Math.max(0,Math.min(skinCountV37-1,(Number(e.target.value)||1)-1))})} style={{width:"100%",border:`1px solid ${C.line}`,borderRadius:6,padding:"5px 2px",background:C.paper,textAlign:"center",fontSize:9,fontWeight:900,color:C.ink}}/><button onClick={()=>setPlayer({skinIndex:Math.min(skinCountV37-1,Number(player.skinIndex||0)+1)})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,fontWeight:950,color:C.brown}}>▶</button></div></div>\n            <div><div style={{fontSize:8.2,fontWeight:950,color:C.ink,marginBottom:4}}>配飾 <span style={{fontSize:7,color:C.muted}}>0＝無</span></div><div style={{display:"grid",gridTemplateColumns:"32px 1fr 32px",gap:3}}><button onClick={()=>setPlayer({accessoryIndex:Math.max(-1,Number(player.accessoryIndex??-1)-1)})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,fontWeight:950,color:C.brown}}>◀</button><input type="number" min="0" max={accessoryCountV37} value={Number(player.accessoryIndex??-1)+1} onChange={e=>setPlayer({accessoryIndex:Math.max(-1,Math.min(accessoryCountV37-1,(Number(e.target.value)||0)-1))})} style={{width:"100%",border:`1px solid ${C.line}`,borderRadius:6,padding:"5px 2px",background:C.paper,textAlign:"center",fontSize:9,fontWeight:900,color:C.ink}}/><button onClick={()=>setPlayer({accessoryIndex:Math.min(accessoryCountV37-1,Number(player.accessoryIndex??-1)+1)})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:6,fontWeight:950,color:C.brown}}>▶</button></div></div>\n          </div>\n          <div style={{marginTop:8}}><div style={{fontSize:8.2,fontWeight:950,color:C.ink,marginBottom:4}}>髮型號碼</div><div style={{display:"grid",gridTemplateColumns:"40px 72px 40px",gap:4,alignItems:"center"}}><button onClick={()=>setPlayer({hairIndex:Math.max(0,Number(player.hairIndex||0)-1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"6px 0",fontSize:11,fontWeight:950,color:C.brown}}>◀</button><input type="number" min="1" max={hairCountV37} value={Number(player.hairIndex||0)+1} onChange={e=>{const n=Math.max(1,Math.min(hairCountV37,Number(e.target.value)||1));setPlayer({hairIndex:n-1})}} style={{width:72,border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:7,padding:"6px 4px",fontSize:10,fontWeight:950,textAlign:"center",color:C.ink}}/><button onClick={()=>setPlayer({hairIndex:Math.min(hairCountV37-1,Number(player.hairIndex||0)+1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"6px 0",fontSize:11,fontWeight:950,color:C.brown}}>▶</button></div></div>\n          <div style={{display:"grid",gridTemplateColumns:"1fr",gap:7,marginTop:8}}>\n            <div><b style={{fontSize:8.5,color:C.ink}}>髮色 RGB</b>{rgbEditor("hair",hairColor,true)}</div>\n            <div><b style={{fontSize:8.5,color:C.ink}}>眼睛 RGB</b>{rgbEditor("eye",eyeColor,true)}</div>\n          </div>\n        </Card>\n'''
s=s[:start]+new_card+s[end:]

# Browser controls: search + meaningful filters + current page status.
old_search='''      <input value={wardrobeQueryV34} onChange={e=>setWardrobeQueryV34(e.target.value)} placeholder={`搜尋${wardrobeTargetV30==="player"?(slotDefs.find(x=>x[0]===slot)?.[1]||""):"帽子"}名稱或材料…`} style={{width:"100%",marginTop:6,border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"8px 10px",fontSize:10,color:C.ink,outline:"none"}}/>\n      {q&&<div style={{fontSize:8,color:C.muted,marginTop:3}}>找到 {list.length} 項</div>}'''
new_search='''      <input value={wardrobeQueryV34} onChange={e=>{setWardrobeQueryV34(e.target.value);setWardrobePageV37(0)}} placeholder={`搜尋${wardrobeTargetV30==="player"?(slotDefs.find(x=>x[0]===slot)?.[1]||""):"帽子"}名稱或材料…`} style={{width:"100%",marginTop:6,border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"8px 10px",fontSize:10,color:C.ink,outline:"none"}}/>\n      <div style={{display:"flex",gap:4,overflowX:"auto",padding:"5px 0 1px",WebkitOverflowScrolling:"touch"}}>{[["all","全部"],["tailoring","裁縫"],...((wardrobeTargetV30==="player"&&(slot==="shirt"||slot==="pants"))?[["dyeable","可染色"]]:[]),["other","其他取得"]].map(([id,label])=><button key={id} onClick={()=>{setWardrobeFilterV37(id);setWardrobePageV37(0)}} style={{flex:"0 0 auto",border:`1.5px solid ${wardrobeFilterV37===id?C.orange:C.line}`,background:wardrobeFilterV37===id?"#FFF0D2":C.cream,borderRadius:14,padding:"4px 9px",fontSize:8,fontWeight:900,color:C.brown}}>{label}</button>)}</div>\n      <div style={{fontSize:7.8,color:C.muted,marginTop:3}}>顯示 {list.length} / {rawList.length} 項 ・ 第 {wardrobePageSafeV37+1} / {wardrobePageCountV37} 頁</div>'''
rep(old_search,new_search,1)

# Compact browse cards: acquisition/recipe remains in selected summary instead of repeating under every thumbnail.
old_card='''      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:6}}>{list.map(it=>{const [key,name,source,dye,meta]=it;const on=chosen===key;return <button key={key} onClick={()=>setTarget({[slot]:on?"":key})} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"5px 3px",minHeight:104,textAlign:"center",cursor:"pointer",minWidth:0}}><GameIcon file={meta?.icon||key} size={36}/><div style={{fontSize:8.2,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.08,marginTop:2}}>{name}</div><div style={{fontSize:6.7,color:C.muted,lineHeight:1.22,marginTop:3,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{meta?.recipe?`製作：${meta.recipe}`:source}</div>{dye&&<div style={{fontSize:6.5,color:C.blue,fontWeight:900,marginTop:2}}>可染色</div>}</button>})}</div>'''
new_card='''      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:6}}>{pageList.map(it=>{const [key,name,source,dye,meta]=it;const on=chosen===key;return <button key={key} onClick={()=>setTarget({[slot]:on?"":key})} title={meta?.recipe?`製作：${meta.recipe}`:source} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"5px 3px",minHeight:78,textAlign:"center",cursor:"pointer",minWidth:0}}><GameIcon file={meta?.icon||key} size={34}/><div style={{fontSize:7.9,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.12,marginTop:2,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{name}</div><div style={{display:"flex",justifyContent:"center",gap:3,marginTop:3}}>{meta?.recipe&&<span style={{fontSize:6.3,color:C.brown,background:"#FFF0D2",borderRadius:5,padding:"1px 4px",fontWeight:900}}>裁縫</span>}{dye&&<span style={{fontSize:6.3,color:C.blue,background:"#E8F3FA",borderRadius:5,padding:"1px 4px",fontWeight:900}}>可染</span>}</div></button>})}</div>\n      {wardrobePageCountV37>1&&<div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:6,alignItems:"center",marginTop:7}}><button disabled={wardrobePageSafeV37<=0} onClick={()=>setWardrobePageV37(Math.max(0,wardrobePageSafeV37-1))} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:6,fontSize:8.5,fontWeight:900,color:C.brown,opacity:wardrobePageSafeV37<=0?.4:1}}>◀ 上一頁</button><span style={{fontSize:8.2,fontWeight:900,color:C.muted}}>{wardrobePageSafeV37+1} / {wardrobePageCountV37}</span><button disabled={wardrobePageSafeV37>=wardrobePageCountV37-1} onClick={()=>setWardrobePageV37(Math.min(wardrobePageCountV37-1,wardrobePageSafeV37+1))} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:8,padding:6,fontSize:8.5,fontWeight:900,color:C.brown,opacity:wardrobePageSafeV37>=wardrobePageCountV37-1?.4:1}}>下一頁 ▶</button></div>}'''
rep(old_card,new_card,1)

p.write_text(s,encoding='utf-8')

# Bump browser cache versions.
idx=Path('index.html')
t=idx.read_text(encoding='utf-8')
t=t.replace('?v=36','?v=37').replace('<!-- deploy-v36 -->','<!-- deploy-v37 -->')
idx.write_text(t,encoding='utf-8')

sw=Path('sw.js')
t=sw.read_text(encoding='utf-8').replace("stardew-tracker-v36","stardew-tracker-v37")
sw.write_text(t,encoding='utf-8')
