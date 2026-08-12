from pathlib import Path


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing replacement marker: {label}')
    return text.replace(old, new, 1)

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')

# Compact pet-variant thumbnails and add the vanilla gender icons used by CharacterCustomization.
old_pet = '''function PetVariantPreviewV36({type,variant=0}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVAnimalSpriteV33;
    if(!api?.draw||!ref.current)return;
    api.draw(ref.current,{type,variant,hat:"",direction:"front"}).catch(e=>console.warn("pet variant preview failed",e));
  },[type,variant]);
  return <canvas ref={ref} aria-label={`${type} 外觀 ${Number(variant)+1}`} style={{width:52,height:48,imageRendering:"pixelated",display:"block",margin:"0 auto"}}/>;
}
'''
new_pet = '''const WARDROBE_CURSOR_V39 = WARDROBE_BG_ROOT_V36+"Cursors.png";
function GenderIconV39({gender}) {
  const ref=useRef(null);
  useEffect(()=>{
    let alive=true;
    const img=new Image();img.crossOrigin="anonymous";img.decoding="async";
    img.onload=()=>{
      if(!alive||!ref.current)return;
      const canvas=ref.current;canvas.width=16;canvas.height=16;
      const ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,16,16);
      ctx.drawImage(img,gender==="male"?128:144,192,16,16,0,0,16,16);
    };
    img.src=WARDROBE_CURSOR_V39;
    return()=>{alive=false};
  },[gender]);
  return <canvas ref={ref} aria-label={gender==="male"?"男性體型":"女性體型"} style={{width:28,height:28,imageRendering:"pixelated",display:"block"}}/>;
}
function PetVariantPreviewV36({type,variant=0,compact=false}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVAnimalSpriteV33;
    if(!api?.draw||!ref.current)return;
    api.draw(ref.current,{type,variant,hat:"",direction:"front"}).catch(e=>console.warn("pet variant preview failed",e));
  },[type,variant]);
  return <canvas ref={ref} aria-label={`${type} 外觀 ${Number(variant)+1}`} style={{width:compact?25:52,height:compact?23:48,imageRendering:"pixelated",display:"block",margin:"0 auto"}}/>;
}
'''
s = replace_once(s, old_pet, new_pet, 'pet variants / gender icons')

# Shoes don't have tailoring/source-type browsing; don't let a stale filter empty their list.
old_filter = '    const list=searched.filter(it=>wardrobeFilterV37==="dyeable"?Boolean(it[3]):wardrobeFilterV37==="tailoring"?Boolean(it[4]?.recipe):wardrobeFilterV37==="other"?!it[4]?.recipe:true);'
new_filter = '''    const wardrobeFilterSafeV39=wardrobeTargetV30==="player"&&wardrobeCategoryV30==="boots"?"all":wardrobeFilterV37;
    const list=searched.filter(it=>wardrobeFilterSafeV39==="dyeable"?Boolean(it[3]):wardrobeFilterSafeV39==="tailoring"?Boolean(it[4]?.recipe):wardrobeFilterSafeV39==="other"?!it[4]?.recipe:true);'''
s = replace_once(s, old_filter, new_filter, 'safe boots filter')

# Make all RGB controls and the three numeric appearance selectors much denser.
i = s.index('    const rgbEditor=')
j = s.index('    const preview=', i)
helpers = '''    const activeDyeKindV39=wardrobeTargetV30==="player"&&slot==="shirt"&&shirtDyeable?"shirt":wardrobeTargetV30==="player"&&slot==="pants"&&pantsDyeable?"pants":null;
    const activeDyeColorV39=activeDyeKindV39==="shirt"?shirtColor:activeDyeKindV39==="pants"?pantsColor:null;
    const rgbEditor=(kind,color,enabled)=>{const rgb=hexRgb(color);const set=(i,v)=>{const next=[...rgb];next[i]=Math.max(0,Math.min(255,Number(v)||0));setPlayer({[kind+"Color"]:rgbHex(next)})};return <div style={{display:"grid",gridTemplateColumns:"30px repeat(3,minmax(0,1fr))",gap:3,alignItems:"center",opacity:enabled?1:.42}}><input type="color" disabled={!enabled} value={color} onChange={e=>setPlayer({[kind+"Color"]:e.target.value})} style={{width:28,height:25,border:0,padding:0,background:"transparent"}}/>{rgb.map((v,i)=><input key={i} type="number" min="0" max="255" disabled={!enabled} value={v} onChange={e=>set(i,e.target.value)} style={{width:"100%",minWidth:0,border:`1px solid ${C.line}`,borderRadius:5,padding:"3px 1px",fontSize:7.5,textAlign:"center",background:C.cream,color:C.ink}}/>)}</div>};
    const compactStepperV39=(label,value,min,max,onValueChange,zeroMeansNone=false)=>{const shown=Math.max(min,Math.min(max,Number(value)||0));return <div style={{minWidth:0}}><div style={{fontSize:7.2,fontWeight:950,color:C.ink,textAlign:"center",whiteSpace:"nowrap",marginBottom:2}}>{label}{zeroMeansNone&&shown===0?<span style={{color:C.muted,fontWeight:800}}>・無</span>:null}</div><div style={{display:"grid",gridTemplateColumns:"22px minmax(30px,1fr) 22px",gap:2}}><button onClick={()=>onValueChange(Math.max(min,shown-1))} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:5,padding:0,fontSize:8,fontWeight:950,color:C.brown}}>◀</button><input type="number" min={min} max={max} value={shown} onChange={e=>onValueChange(Math.max(min,Math.min(max,Number(e.target.value)||min)))} style={{width:"100%",minWidth:0,border:`1px solid ${C.line}`,background:C.paper,borderRadius:5,padding:"3px 1px",fontSize:8,fontWeight:950,textAlign:"center",color:C.ink}}/><button onClick={()=>onValueChange(Math.min(max,shown+1))} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:5,padding:0,fontSize:8,fontWeight:950,color:C.brown}}>▶</button></div></div>};
'''
s = s[:i] + helpers + s[j:]

# Summary rows now show the selected game icon and a tiny slot label on the left.
i = s.index('    const summaryRow=')
j = s.index('\n\n    return <div>', i)
summary = '''    const summaryRow=(label,meta,color,fallback)=>{const m=meta?.[4]||{};const icon=m.icon||meta?.[0]||fallback;return <div style={{display:"grid",gridTemplateColumns:"38px 1fr",gap:6,padding:"4px 0",borderBottom:`1px dashed ${C.line}`,alignItems:"center"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:meta?1:.28}}><GameIcon file={icon||fallback} size={27}/><span style={{fontSize:6.6,fontWeight:900,color:C.brown,lineHeight:1,marginTop:1}}>{label}</span></div>{!meta?<span style={{fontSize:8.5,color:C.muted}}>未選</span>:<div><div style={{fontSize:9.3,fontWeight:950,color:C.ink}}>{meta[1]}</div><div style={{fontSize:7.7,color:C.muted,lineHeight:1.3,marginTop:1}}>{m.recipe?`製作：${m.recipe}`:(meta[2]||"取得方式待補")}</div>{m.recipe&&meta[2]&&meta[2]!==m.recipe&&<div style={{fontSize:7.2,color:C.muted,lineHeight:1.25,marginTop:1}}>{meta[2]}</div>}{color&&<div style={{fontSize:7.7,color:C.blue,fontWeight:900,marginTop:1}}>染色 RGB：{hexRgb(color).join(" / ")} ・ {color.toUpperCase()}</div>}</div>}</div>};'''
s = s[:i] + summary + s[j:]

# Short function-only intro instead of release notes.
old_intro = '      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,color:C.muted,lineHeight:1.45}}>v38：修正舊版衣櫥紀錄升級後人物消失；舊資料會自動補齊外觀欄位，服飾圖層異常時也不再讓整個人物預覽空白。</div></Card>'
new_intro = '      <Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.4,color:C.muted,lineHeight:1.35}}>自由搭配角色、服飾與染色，切換四方向並同時預覽白天／夜晚效果。</div></Card>'
s = replace_once(s, old_intro, new_intro, 'compact intro')

# Put the six cat/dog appearances as tiny secondary buttons directly above the direction previews.
old_preview_start = '''      <Card style={{marginTop:7,padding:8}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{directions.map(([id])=><button key={id} onClick={()=>setWardrobeDirectionV32(id)}'''
new_preview_start = '''      <Card style={{marginTop:7,padding:8}}>
        {(wardrobeTargetV30==="cat"||wardrobeTargetV30==="dog")&&<div style={{display:"grid",gridTemplateColumns:"30px repeat(6,minmax(0,1fr))",gap:3,alignItems:"center",marginBottom:5}}><span style={{fontSize:7.2,fontWeight:950,color:C.muted,textAlign:"center"}}>外觀</span>{[0,1,2,3,4,5].map(v=>{const on=Number(target.variant||0)===v;return <button key={v} title={`款式 ${v+1}`} aria-label={`款式 ${v+1}`} onClick={()=>setTarget({variant:v})} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.cream,borderRadius:6,padding:1,minWidth:0,minHeight:29,display:"flex",alignItems:"center",justifyContent:"center"}}><PetVariantPreviewV36 type={wardrobeTargetV30} variant={v} compact/></button>})}</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{directions.map(([id])=><button key={id} onClick={()=>setWardrobeDirectionV32(id)}'''
s = replace_once(s, old_preview_start, new_preview_start, 'pet variants above previews')

# Remove the old standalone pet-appearance card.
pet_start = s.index('      {(wardrobeTargetV30==="cat"||wardrobeTargetV30==="dog")&&<Card style={{marginTop:7,padding:8}}>')
pet_end = s.index('\n\n      {wardrobeTargetV30==="player"&&<>', pet_start)
s = s[:pet_start] + s[pet_end:]

# Add icons to the outfit summary.
old_summary_calls = '          {summaryRow("帽子",hatMeta)}{summaryRow("上衣",shirtMeta,shirtDyeable?shirtColor:null)}{summaryRow("下裝",pantsMeta,pantsDyeable?pantsColor:null)}{summaryRow("鞋",bootsMeta)}'
new_summary_calls = '          {summaryRow("帽子",hatMeta,null,"Cowboy Hat")}{summaryRow("上衣",shirtMeta,shirtDyeable?shirtColor:null,"Shirt003")}{summaryRow("下裝",pantsMeta,pantsDyeable?pantsColor:null,"Farmer Pants")}{summaryRow("鞋",bootsMeta,null,"Space Boots")}'
s = replace_once(s, old_summary_calls, new_summary_calls, 'summary icon calls')

# Replace the tall Wizard-appearance editor with an icon-first compact panel.
appearance_start = s.index('        <Card style={{marginTop:7,padding:8}}>\n          <div style={{fontSize:9.5,fontWeight:950,color:C.brown}}>角色外觀</div>')
appearance_end_marker = '        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{slotDefs.map'
appearance_end = s.index(appearance_end_marker, appearance_start)
compact_appearance = '''        <Card style={{marginTop:7,padding:7}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}><b style={{fontSize:9.2,color:C.brown}}>角色外觀</b><div style={{display:"flex",gap:4}}>{["female","male"].map(g=>{const on=(g==="male")?player.gender==="male":player.gender!=="male";return <button key={g} title={g==="male"?"男性體型":"女性體型"} aria-label={g==="male"?"男性體型":"女性體型"} onClick={()=>setPlayer({gender:g})} style={{width:34,height:34,border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:7,padding:2,display:"flex",alignItems:"center",justifyContent:"center"}}><GenderIconV39 gender={g}/></button>})}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:5}}>
            {compactStepperV39("膚色",Number(player.skinIndex||0)+1,1,skinCountV37,v=>setPlayer({skinIndex:v-1}))}
            {compactStepperV39("髮型",Number(player.hairIndex||0)+1,1,hairCountV37,v=>setPlayer({hairIndex:v-1}))}
            {compactStepperV39("配飾",Number(player.accessoryIndex??-1)+1,0,accessoryCountV37,v=>setPlayer({accessoryIndex:v-1}),true)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}><div><div style={{fontSize:7.2,fontWeight:950,color:C.ink,marginBottom:2}}>髮色 RGB</div>{rgbEditor("hair",hairColor,true)}</div><div><div style={{fontSize:7.2,fontWeight:950,color:C.ink,marginBottom:2}}>眼睛 RGB</div>{rgbEditor("eye",eyeColor,true)}</div></div>
        </Card>
'''
s = s[:appearance_start] + compact_appearance + s[appearance_end:]

# Dye editor appears only for the currently selected slot and only when that item can actually be dyed.
old_dye = '        {(shirtDyeable||pantsDyeable)&&<Card style={{marginTop:7,padding:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:6}}>染色數值</div><div style={{fontSize:7.5,color:C.muted,marginBottom:5}}>左邊挑色；右邊三格依序是 R / G / B（0–255），可直接輸入攻略數值。</div><div style={{display:"grid",gridTemplateColumns:"1fr",gap:7}}><div><b style={{fontSize:8.5,color:shirtDyeable?C.ink:C.muted}}>上衣</b>{rgbEditor("shirt",shirtColor,shirtDyeable)}</div><div><b style={{fontSize:8.5,color:pantsDyeable?C.ink:C.muted}}>下裝</b>{rgbEditor("pants",pantsColor,pantsDyeable)}</div></div></Card>}'
new_dye = '        {activeDyeKindV39&&<Card style={{marginTop:6,padding:"6px 8px"}}><div style={{display:"grid",gridTemplateColumns:"46px 1fr",gap:6,alignItems:"center"}}><b style={{fontSize:7.8,color:C.brown}}>{activeDyeKindV39==="shirt"?"上衣染色":"下裝染色"}</b>{rgbEditor(activeDyeKindV39,activeDyeColorV39,true)}</div></Card>}'
s = replace_once(s, old_dye, new_dye, 'conditional compact dye editor')

# Hide source-type filter chips entirely for shoes.
old_filter_ui = '      <div style={{display:"flex",gap:4,overflowX:"auto",padding:"5px 0 1px",WebkitOverflowScrolling:"touch"}}>{[["all","全部"],["tailoring","裁縫"],...((wardrobeTargetV30==="player"&&(slot==="shirt"||slot==="pants"))?[["dyeable","可染色"]]:[]),["other","其他取得"]].map(([id,label])=><button key={id} onClick={()=>{setWardrobeFilterV37(id);setWardrobePageV37(0)}} style={{flex:"0 0 auto",border:`1.5px solid ${wardrobeFilterV37===id?C.orange:C.line}`,background:wardrobeFilterV37===id?"#FFF0D2":C.cream,borderRadius:14,padding:"4px 9px",fontSize:8,fontWeight:900,color:C.brown}}>{label}</button>)}</div>'
new_filter_ui = '      {!(wardrobeTargetV30==="player"&&slot==="boots")&&<div style={{display:"flex",gap:4,overflowX:"auto",padding:"5px 0 1px",WebkitOverflowScrolling:"touch"}}>{[["all","全部"],["tailoring","裁縫"],...((wardrobeTargetV30==="player"&&(slot==="shirt"||slot==="pants"))?[["dyeable","可染色"]]:[]),["other","其他取得"]].map(([id,label])=><button key={id} onClick={()=>{setWardrobeFilterV37(id);setWardrobePageV37(0)}} style={{flex:"0 0 auto",border:`1.5px solid ${wardrobeFilterSafeV39===id?C.orange:C.line}`,background:wardrobeFilterSafeV39===id?"#FFF0D2":C.cream,borderRadius:14,padding:"4px 9px",fontSize:8,fontWeight:900,color:C.brown}}>{label}</button>)}</div>}'
s = replace_once(s, old_filter_ui, new_filter_ui, 'hide shoe filters')

p.write_text(s, encoding='utf-8')

# Cache-bust the UI release.
p = Path('index.html')
s = p.read_text(encoding='utf-8').replace('?v=38','?v=39').replace('deploy-v38','deploy-v39')
p.write_text(s, encoding='utf-8')

p = Path('sw.js')
s = p.read_text(encoding='utf-8').replace("stardew-tracker-v38","stardew-tracker-v39")
p.write_text(s, encoding='utf-8')

print('v39 patch applied')
