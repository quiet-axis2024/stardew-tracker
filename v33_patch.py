from pathlib import Path
import re

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

marker='''function WikiBtn({ name }) {
  return <a href={`${WIKI_BASE}${encodeURIComponent(name)}`} target="_blank" rel="noopener noreferrer"
    style={{ textDecoration: "none", fontSize: 11, fontWeight: 900, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 7, padding: "4px 7px", whiteSpace: "nowrap" }}>百科 ↗</a>;
}

/* ================= 主程式 ================= */'''
components='''function WikiBtn({ name }) {
  return <a href={`${WIKI_BASE}${encodeURIComponent(name)}`} target="_blank" rel="noopener noreferrer"
    style={{ textDecoration: "none", fontSize: 11, fontWeight: 900, color: C.blue, border: `1.5px solid ${C.blue}`, borderRadius: 7, padding: "4px 7px", whiteSpace: "nowrap" }}>百科 ↗</a>;
}

const WARDROBE_DIR_LABEL_V33 = {front:"正面",right:"右側",back:"背面",left:"左側"};
function FarmerSpritePreviewV33({player,direction="front",large=false,shirtDyeable=false,pantsDyeable=false}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVFarmerSpriteV33;
    if(!api?.draw||!ref.current)return;
    api.draw(ref.current,{
      gender:player.gender||"female",direction,
      selected:{hat:player.hat||"",shirt:player.shirt||"",pants:player.pants||"",boots:player.boots||""},
      shirtColor:player.shirtColor,pantsColor:player.pantsColor,
      hairColor:player.hairColor,hairIndex:player.hairIndex,
      shirtDyeable,pantsDyeable
    }).catch(e=>console.warn("farmer sprite preview failed",e));
  },[player.gender,player.hat,player.shirt,player.pants,player.boots,player.shirtColor,player.pantsColor,player.hairColor,player.hairIndex,direction,shirtDyeable,pantsDyeable]);
  const w=large?120:52,h=large?210:91;
  return <div style={{position:"relative",height:large?226:105,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,background:"linear-gradient(#DCEEC9 0 68%,#D5B77B 68%)",border:`1px solid ${C.line}`}}>
    <canvas ref={ref} aria-label={`玩家${WARDROBE_DIR_LABEL_V33[direction]||""}遊戲 sprite 預覽`} style={{width:w,height:h,imageRendering:"pixelated",display:"block"}}/>
    <span style={{position:"absolute",left:4,bottom:3,fontSize:large?9:6.8,fontWeight:950,color:"#604329",background:"rgba(255,248,227,.88)",padding:"1px 4px",borderRadius:5}}>{WARDROBE_DIR_LABEL_V33[direction]}</span>
  </div>;
}
function AnimalSpritePreviewV33({type,hat,direction="front",large=false}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVAnimalSpriteV33;
    if(!api?.draw||!ref.current)return;
    api.draw(ref.current,{type,hat,direction}).catch(e=>console.warn("animal sprite preview failed",e));
  },[type,hat,direction]);
  const size=large?176:76;
  return <div style={{position:"relative",height:large?210:105,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,background:"linear-gradient(#DCEEC9 0 68%,#D5B77B 68%)",border:`1px solid ${C.line}`}}>
    <canvas ref={ref} aria-label={`${type}${WARDROBE_DIR_LABEL_V33[direction]||""}遊戲 sprite 預覽`} style={{width:size,height:size,imageRendering:"pixelated",display:"block"}}/>
    <span style={{position:"absolute",left:4,bottom:3,fontSize:large?9:6.8,fontWeight:950,color:"#604329",background:"rgba(255,248,227,.88)",padding:"1px 4px",borderRadius:5}}>{WARDROBE_DIR_LABEL_V33[direction]}</span>
  </div>;
}

/* ================= 主程式 ================= */'''
if marker not in s:
    raise SystemExit('component insertion marker not found')
s=s.replace(marker,components,1)

start='  const renderWardrobeV30 = () => {'
end='\n\n\n  const renderNotes = () => <div>'
i=s.find(start)
j=s.find(end,i)
if i<0 or j<0:
    raise SystemExit('wardrobe block boundaries not found')

new='''  const renderWardrobeV30 = () => {
    const defaults={
      player:{hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99",gender:"female",hairIndex:0,hairColor:"#6a402c"},
      horse:{hat:""},cat:{hat:""},dog:{hat:""}
    };
    const stored=data.wardrobeV30||{};
    const wardrobe={
      ...defaults,...stored,
      player:{...defaults.player,...(stored.player||{})},
      horse:{...defaults.horse,...(stored.horse||{})},
      cat:{...defaults.cat,...(stored.cat||{})},
      dog:{...defaults.dog,...(stored.dog||{})}
    };
    const target={...(defaults[wardrobeTargetV30]||{}),...(wardrobe[wardrobeTargetV30]||{})};
    const setTarget=patch=>update({wardrobeV30:{...wardrobe,[wardrobeTargetV30]:{...target,...patch}}});
    const setPlayer=patch=>update({wardrobeV30:{...wardrobe,player:{...wardrobe.player,...patch}}});
    const cats={hat:HATS_V30,shirt:SHIRTS_V30,pants:PANTS_V30,boots:BOOTS_V30};
    const list=wardrobeTargetV30==="player"?cats[wardrobeCategoryV30]:HATS_V30;
    const slot=wardrobeTargetV30==="player"?wardrobeCategoryV30:"hat";
    const chosen=target[slot]||"";
    const targets=[["player","玩家","Inventory Tab"],["horse","馬","Horse"],["cat","貓","Cat 1"],["dog","狗","Dog 1"]];
    const directions=[["front","正面"],["right","右側"],["back","背面"],["left","左側"]];
    const player=wardrobe.player;
    const findMeta=(kind,file)=>kind&&file?(cats[kind]||[]).find(x=>x[0]===file):null;
    const slotDefs=[["hat","帽子","Cowboy Hat"],["shirt","上衣","Shirt003"],["pants","下裝","Farmer Pants"],["boots","鞋","Space Boots"]];
    const currentTargetLabel=targets.find(x=>x[0]===wardrobeTargetV30)?.[1]||"玩家";
    const shirtMeta=findMeta("shirt",player.shirt),pantsMeta=findMeta("pants",player.pants);
    const shirtDyeable=Boolean(shirtMeta?.[3]),pantsDyeable=Boolean(pantsMeta?.[3]);
    const shirtColor=player.shirtColor||defaults.player.shirtColor,pantsColor=player.pantsColor||defaults.player.pantsColor;
    const preview=(dir,large=false)=>wardrobeTargetV30==="player"
      ?<FarmerSpritePreviewV33 player={player} direction={dir} large={large} shirtDyeable={shirtDyeable} pantsDyeable={pantsDyeable}/>
      :<AnimalSpritePreviewV33 type={wardrobeTargetV30} hat={target.hat||""} direction={dir} large={large}/>;

    return <div>
      <SectionTitle icon="🎩">衣櫥搭配</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,color:C.muted,lineHeight:1.45}}>v33：預覽改用遊戲實際角色、衣服、褲子、帽子、髮型與動物方向 sprite 分層，不再用物品欄圖示拼假人。物品卡仍保留原圖，方便辨認你選的是哪一件。</div></Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{targets.map(([id,name,file])=>{const on=wardrobeTargetV30===id;return <button key={id} onClick={()=>{setWardrobeTargetV30(id);if(id!=="player")setWardrobeCategoryV30("hat")}} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:9,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}>{id==="player"?(data.profilePortrait?<img src={data.profilePortrait} alt="" style={{width:27,height:34,objectFit:"cover",borderRadius:4,imageRendering:"pixelated"}}/>:<GameIcon file="Inventory Tab" size={27}/>):<GameIcon file={file} size={27}/>}<div>{name}</div></button>})}</div>

      <Card style={{marginTop:7,padding:8}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{directions.map(([id])=><button key={id} onClick={()=>setWardrobeDirectionV32(id)} style={{border:`1.5px solid ${wardrobeDirectionV32===id?C.orange:C.line}`,background:wardrobeDirectionV32===id?"#FFF0D2":C.paper,borderRadius:8,padding:3,minWidth:0}}>{preview(id,false)}</button>)}</div>
        <div style={{marginTop:7}}>{preview(wardrobeDirectionV32,true)}</div>
        <div style={{textAlign:"center",fontSize:8.5,color:C.muted,marginTop:5}}>上方四格就是遊戲方向幀；點選後在下方放大查看。</div>
      </Card>

      {wardrobeTargetV30==="player"&&<>
        <Card style={{marginTop:7,padding:8}}>
          <div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:6}}>角色外觀</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <button onClick={()=>setPlayer({gender:"female"})} style={{border:`1.5px solid ${player.gender!=="male"?C.orange:C.line}`,background:player.gender!=="male"?"#FFF0D2":C.paper,borderRadius:8,padding:6,fontSize:9,fontWeight:950,color:C.brown}}>女性體型</button>
            <button onClick={()=>setPlayer({gender:"male"})} style={{border:`1.5px solid ${player.gender==="male"?C.orange:C.line}`,background:player.gender==="male"?"#FFF0D2":C.paper,borderRadius:8,padding:6,fontSize:9,fontWeight:950,color:C.brown}}>男性體型</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"center",marginTop:8}}>
            <label style={{fontSize:8.5,color:C.muted}}><b style={{color:C.ink}}>髮型 {Number(player.hairIndex||0)+1}</b><input type="range" min="0" max="55" value={Number(player.hairIndex||0)} onChange={e=>setPlayer({hairIndex:Number(e.target.value)})} style={{width:"100%",marginTop:4}}/></label>
            <label style={{fontSize:8.5,color:C.muted,textAlign:"center"}}><input type="color" value={player.hairColor||defaults.player.hairColor} onChange={e=>setPlayer({hairColor:e.target.value})} style={{width:42,height:32,border:0,background:"transparent",padding:0}}/><div>髮色</div></label>
          </div>
        </Card>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{slotDefs.map(([id,name,file])=>{const on=wardrobeCategoryV30===id;const selected=player[id];return <button key={id} onClick={()=>setWardrobeCategoryV30(id)} style={{border:`1.5px solid ${on?C.orange:selected?C.green:C.line}`,background:on?"#FFE2A8":selected?"#EEF7DD":C.paper,borderRadius:8,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file={selected||file} size={25}/><div>{name}</div></button>})}</div>

        {(shirtDyeable||pantsDyeable)&&<Card style={{marginTop:7,padding:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:6}}>染色</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          <label style={{display:"flex",alignItems:"center",gap:7,fontSize:9,color:shirtDyeable?C.ink:C.muted,opacity:shirtDyeable?1:.45}}><input type="color" disabled={!shirtDyeable} value={shirtColor} onChange={e=>setPlayer({shirtColor:e.target.value})} style={{width:42,height:32,border:0,background:"transparent",padding:0}}/><span><b>上衣</b><br/>{shirtDyeable?"同步套進遊戲染色圖層":"目前上衣不可染"}</span></label>
          <label style={{display:"flex",alignItems:"center",gap:7,fontSize:9,color:pantsDyeable?C.ink:C.muted,opacity:pantsDyeable?1:.45}}><input type="color" disabled={!pantsDyeable} value={pantsColor} onChange={e=>setPlayer({pantsColor:e.target.value})} style={{width:42,height:32,border:0,background:"transparent",padding:0}}/><span><b>下裝</b><br/>{pantsDyeable?"同步套進遊戲染色圖層":"目前下裝不可染"}</span></label>
        </div></Card>}
        {wardrobeCategoryV30==="boots"&&<div style={{fontSize:8.5,color:C.muted,lineHeight:1.4,marginTop:6,padding:"0 2px"}}>鞋款仍會記錄；遊戲裡鞋子主要是替換角色鞋部色盤，不是獨立鞋子 sprite，所以 v33 不再把鞋子的物品圖硬貼在腳上。</div>}
      </>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,marginTop:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown}}>{wardrobeTargetV30==="player"?slotDefs.find(x=>x[0]===slot)?.[1]:`${currentTargetLabel}帽子`}・{list.length} 項</div>{chosen&&<button onClick={()=>setTarget({[slot]:""})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:8.5,fontWeight:900,color:C.red}}>清除</button>}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:6}}>{list.map(it=>{const [file,name,source,dye]=it;const on=chosen===file;return <button key={file} onClick={()=>setTarget({[slot]:on?"":file})} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"5px 3px",minHeight:96,textAlign:"center",cursor:"pointer",minWidth:0}}><GameIcon file={file} size={36}/><div style={{fontSize:8.2,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div><div style={{fontSize:6.7,color:C.muted,lineHeight:1.2,marginTop:3}}>{source}</div>{dye&&<div style={{fontSize:6.5,color:C.blue,fontWeight:900,marginTop:2}}>可染色</div>}</button>})}</div>
    </div>;
  };'''
s=s[:i]+new+s[j:]
p.write_text(s,encoding='utf-8')

# Versioned browser assets.
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('./cloud.js?v=32','./cloud.js?v=33')
s=s.replace('./app.js?v=32','./app.js?v=33')
if './farmer-preview-v33.js?v=33' not in s:
    s=s.replace('<script src="./cloud.js?v=33"></script>','<script src="./cloud.js?v=33"></script>\n  <script src="./farmer-preview-v33.js?v=33"></script>\n  <script src="./animal-preview-v33.js?v=33"></script>')
s=re.sub(r'<!-- deploy-v\d+[^>]*-->','<!-- deploy-v33 -->',s)
p.write_text(s,encoding='utf-8')

p=Path('sw.js')
s=p.read_text(encoding='utf-8').replace("stardew-tracker-v32","stardew-tracker-v33")
s=re.sub(r"const CORE=\[[^\n]+\];", "const CORE=['./index.html','./app.js','./cloud.js','./farmer-preview-v33.js','./animal-preview-v33.js','./manifest.webmanifest','./icon.svg'];", s, count=1)
p.write_text(s,encoding='utf-8')

p=Path('.github/workflows/pages.yml')
s=p.read_text(encoding='utf-8')
s=s.replace('cp index.html manifest.webmanifest icon.svg sw.js cloud.js dist/','cp index.html manifest.webmanifest icon.svg sw.js cloud.js farmer-preview-v33.js animal-preview-v33.js dist/')
p.write_text(s,encoding='utf-8')
