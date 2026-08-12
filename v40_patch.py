from pathlib import Path


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)

app_path = Path("app.jsx")
app = app_path.read_text(encoding="utf-8")

old_helpers = '''    const hexRgb=hex=>{const m=String(hex||"").match(/^#([0-9a-f]{6})$/i);if(!m)return[0,0,0];const n=parseInt(m[1],16);return[(n>>16)&255,(n>>8)&255,n&255]};
    const rgbHex=rgb=>`#${rgb.map(v=>Math.max(0,Math.min(255,Number(v)||0)).toString(16).padStart(2,"0")).join("")}`;
    const activeDyeKindV39=wardrobeTargetV30==="player"&&slot==="shirt"&&shirtDyeable?"shirt":wardrobeTargetV30==="player"&&slot==="pants"&&pantsDyeable?"pants":null;
    const activeDyeColorV39=activeDyeKindV39==="shirt"?shirtColor:activeDyeKindV39==="pants"?pantsColor:null;
    const rgbEditor=(kind,color,enabled)=>{const rgb=hexRgb(color);const set=(i,v)=>{const next=[...rgb];next[i]=Math.max(0,Math.min(255,Number(v)||0));setPlayer({[kind+"Color"]:rgbHex(next)})};return <div style={{display:"grid",gridTemplateColumns:"30px repeat(3,minmax(0,1fr))",gap:3,alignItems:"center",opacity:enabled?1:.42}}><input type="color" disabled={!enabled} value={color} onChange={e=>setPlayer({[kind+"Color"]:e.target.value})} style={{width:28,height:25,border:0,padding:0,background:"transparent"}}/>{rgb.map((v,i)=><input key={i} type="number" min="0" max="255" disabled={!enabled} value={v} onChange={e=>set(i,e.target.value)} style={{width:"100%",minWidth:0,border:`1px solid ${C.line}`,borderRadius:5,padding:"3px 1px",fontSize:7.5,textAlign:"center",background:C.cream,color:C.ink}}/>)}</div>};'''

new_helpers = '''    const hexRgb=hex=>{const m=String(hex||"").match(/^#([0-9a-f]{6})$/i);if(!m)return[0,0,0];const n=parseInt(m[1],16);return[(n>>16)&255,(n>>8)&255,n&255]};
    const rgbHex=rgb=>`#${rgb.map(v=>Math.max(0,Math.min(255,Math.round(Number(v)||0))).toString(16).padStart(2,"0")).join("")}`;
    const clampGameColorV40=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
    const hexToGameHsvV40=hex=>{const [rr,gg,bb]=hexRgb(hex).map(v=>v/255);const max=Math.max(rr,gg,bb),min=Math.min(rr,gg,bb),d=max-min;let h=0;if(d){if(max===rr)h=((gg-bb)/d)%6;else if(max===gg)h=(bb-rr)/d+2;else h=(rr-gg)/d+4;h/=6;if(h<0)h+=1}const s=max===0?0:d/max;return [Math.round(h*100)%100,Math.round(s*100),Math.round(max*100)]};
    const gameHsvToHexV40=hsv=>{let [h,s,v]=hsv.map(clampGameColorV40);h=(h%100)/100*6;s/=100;v/=100;const sector=Math.floor(h)%6,f=h-Math.floor(h),p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);const rgb=[[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][sector].map(x=>x*255);return rgbHex(rgb)};
    const getGameHsvV40=(kind,color)=>{const storedHsv=kind?player[kind+"ColorHSV"]:null;if(Array.isArray(storedHsv)&&storedHsv.length===3)return storedHsv.map(clampGameColorV40);return hexToGameHsvV40(color)};
    const setGameHsvV40=(kind,color,hsv)=>{const next=hsv.map(clampGameColorV40);setPlayer({[kind+"Color"]:gameHsvToHexV40(next),[kind+"ColorHSV"]:next})};
    const activeDyeKindV39=wardrobeTargetV30==="player"&&slot==="shirt"&&shirtDyeable?"shirt":wardrobeTargetV30==="player"&&slot==="pants"&&pantsDyeable?"pants":null;
    const activeDyeColorV39=activeDyeKindV39==="shirt"?shirtColor:activeDyeKindV39==="pants"?pantsColor:null;
    const hsvEditorV40=(kind,color,enabled)=>{const hsv=getGameHsvV40(kind,color);const labels=[["H","色相"],["S","飽和度"],["V","明度"]];const set=(i,v)=>{const next=[...hsv];next[i]=clampGameColorV40(v);setGameHsvV40(kind,color,next)};const setHex=hex=>{const next=hexToGameHsvV40(hex);setPlayer({[kind+"Color"]:hex,[kind+"ColorHSV"]:next})};return <div style={{display:"grid",gridTemplateColumns:"30px repeat(3,minmax(0,1fr))",gap:3,alignItems:"center",opacity:enabled?1:.42}}><input type="color" disabled={!enabled} value={color} onChange={e=>setHex(e.target.value)} title="挑色" aria-label="挑色" style={{width:28,height:25,border:0,padding:0,background:"transparent"}}/>{hsv.map((value,i)=><label key={i} title={`${labels[i][1]}（遊戲 0–100）`} style={{display:"grid",gridTemplateColumns:"11px minmax(0,1fr)",gap:1,alignItems:"center",minWidth:0}}><span style={{fontSize:7,fontWeight:950,color:C.brown,textAlign:"center"}}>{labels[i][0]}</span><input type="number" min="0" max="100" disabled={!enabled} value={value} aria-label={labels[i][1]} onChange={e=>set(i,e.target.value)} style={{width:"100%",minWidth:0,border:`1px solid ${C.line}`,borderRadius:5,padding:"3px 1px",fontSize:7.5,textAlign:"center",background:C.cream,color:C.ink}}/></label>)}</div>};'''

app = replace_once(app, old_helpers, new_helpers, "HSV helper block")

old_summary = '''    const summaryRow=(label,meta,color,fallback)=>{const m=meta?.[4]||{};const icon=m.icon||meta?.[0]||fallback;return <div style={{display:"grid",gridTemplateColumns:"38px 1fr",gap:6,padding:"4px 0",borderBottom:`1px dashed ${C.line}`,alignItems:"center"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:meta?1:.28}}><GameIcon file={icon||fallback} size={27}/><span style={{fontSize:6.6,fontWeight:900,color:C.brown,lineHeight:1,marginTop:1}}>{label}</span></div>{!meta?<span style={{fontSize:8.5,color:C.muted}}>未選</span>:<div><div style={{fontSize:9.3,fontWeight:950,color:C.ink}}>{meta[1]}</div><div style={{fontSize:7.7,color:C.muted,lineHeight:1.3,marginTop:1}}>{m.recipe?`製作：${m.recipe}`:(meta[2]||"取得方式待補")}</div>{m.recipe&&meta[2]&&meta[2]!==m.recipe&&<div style={{fontSize:7.2,color:C.muted,lineHeight:1.25,marginTop:1}}>{meta[2]}</div>}{color&&<div style={{fontSize:7.7,color:C.blue,fontWeight:900,marginTop:1}}>染色 RGB：{hexRgb(color).join(" / ")} ・ {color.toUpperCase()}</div>}</div>}</div>};'''
new_summary = '''    const summaryRow=(label,meta,color,fallback,colorKind=null)=>{const m=meta?.[4]||{};const icon=m.icon||meta?.[0]||fallback;const hsv=color?getGameHsvV40(colorKind,color):null;return <div style={{display:"grid",gridTemplateColumns:"38px 1fr",gap:6,padding:"4px 0",borderBottom:`1px dashed ${C.line}`,alignItems:"center"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:meta?1:.28}}><GameIcon file={icon||fallback} size={27}/><span style={{fontSize:6.6,fontWeight:900,color:C.brown,lineHeight:1,marginTop:1}}>{label}</span></div>{!meta?<span style={{fontSize:8.5,color:C.muted}}>未選</span>:<div><div style={{fontSize:9.3,fontWeight:950,color:C.ink}}>{meta[1]}</div><div style={{fontSize:7.7,color:C.muted,lineHeight:1.3,marginTop:1}}>{m.recipe?`製作：${m.recipe}`:(meta[2]||"取得方式待補")}</div>{m.recipe&&meta[2]&&meta[2]!==m.recipe&&<div style={{fontSize:7.2,color:C.muted,lineHeight:1.25,marginTop:1}}>{meta[2]}</div>}{hsv&&<div style={{fontSize:7.7,color:C.blue,fontWeight:900,marginTop:1}}>染色 HSV：{hsv.join(" / ")}</div>}</div>}</div>};'''
app = replace_once(app, old_summary, new_summary, "summary row")

app = replace_once(
    app,
    '<Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.4,color:C.muted,lineHeight:1.35}}>自由搭配角色、服飾與染色，切換四方向並同時預覽白天／夜晚效果。</div></Card>',
    '<Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.4,color:C.muted,lineHeight:1.35}}>自由搭配角色、服飾與染色；顏色數字使用遊戲同款 H／S／V（色相／飽和度／明度）。</div></Card>',
    "top wardrobe note",
)

app = replace_once(
    app,
    '{summaryRow("帽子",hatMeta,null,"Cowboy Hat")}{summaryRow("上衣",shirtMeta,shirtDyeable?shirtColor:null,"Shirt003")}{summaryRow("下裝",pantsMeta,pantsDyeable?pantsColor:null,"Farmer Pants")}{summaryRow("鞋",bootsMeta,null,"Space Boots")}',
    '{summaryRow("帽子",hatMeta,null,"Cowboy Hat")}{summaryRow("上衣",shirtMeta,shirtDyeable?shirtColor:null,"Shirt003","shirt")}{summaryRow("下裝",pantsMeta,pantsDyeable?pantsColor:null,"Farmer Pants","pants")}{summaryRow("鞋",bootsMeta,null,"Space Boots")}',
    "summary calls",
)

app = replace_once(
    app,
    '<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}><div><div style={{fontSize:7.2,fontWeight:950,color:C.ink,marginBottom:2}}>髮色 RGB</div>{rgbEditor("hair",hairColor,true)}</div><div><div style={{fontSize:7.2,fontWeight:950,color:C.ink,marginBottom:2}}>眼睛 RGB</div>{rgbEditor("eye",eyeColor,true)}</div></div>',
    '<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}><div><div style={{fontSize:7.2,fontWeight:950,color:C.ink,marginBottom:2}}>髮色 HSV</div>{hsvEditorV40("hair",hairColor,true)}</div><div><div style={{fontSize:7.2,fontWeight:950,color:C.ink,marginBottom:2}}>眼睛 HSV</div>{hsvEditorV40("eye",eyeColor,true)}</div></div>',
    "appearance color editors",
)

app = replace_once(
    app,
    '{activeDyeKindV39&&<Card style={{marginTop:6,padding:"6px 8px"}}><div style={{display:"grid",gridTemplateColumns:"46px 1fr",gap:6,alignItems:"center"}}><b style={{fontSize:7.8,color:C.brown}}>{activeDyeKindV39==="shirt"?"上衣染色":"下裝染色"}</b>{rgbEditor(activeDyeKindV39,activeDyeColorV39,true)}</div></Card>}',
    '{activeDyeKindV39&&<Card style={{marginTop:6,padding:"6px 8px"}}><div style={{display:"grid",gridTemplateColumns:"54px 1fr",gap:6,alignItems:"center"}}><b style={{fontSize:7.8,color:C.brown}}>{activeDyeKindV39==="shirt"?"上衣染色 HSV":"下裝染色 HSV"}</b>{hsvEditorV40(activeDyeKindV39,activeDyeColorV39,true)}</div></Card>}',
    "dye editor",
)

app_path.write_text(app, encoding="utf-8")

index_path = Path("index.html")
index = index_path.read_text(encoding="utf-8")
index = index.replace('?v=39', '?v=40').replace('<!-- deploy-v39 -->', '<!-- deploy-v40 -->')
if '?v=39' in index:
    raise SystemExit('index cache version still v39')
index_path.write_text(index, encoding="utf-8")

sw_path = Path("sw.js")
sw = sw_path.read_text(encoding="utf-8")
sw = sw.replace("stardew-tracker-v39", "stardew-tracker-v40")
if "stardew-tracker-v39" in sw:
    raise SystemExit('service worker cache version still v39')
sw_path.write_text(sw, encoding="utf-8")

print('v40 HSV patch applied')
