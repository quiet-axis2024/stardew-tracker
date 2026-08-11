from pathlib import Path
import re

app = Path('app.jsx')
s = app.read_text(encoding='utf-8')

state_old = '''  const [wardrobeCategoryV30, setWardrobeCategoryV30] = useState("hat");
  const [wardrobeTargetV30, setWardrobeTargetV30] = useState("player");'''
state_new = '''  const [wardrobeCategoryV30, setWardrobeCategoryV30] = useState("hat");
  const [wardrobeTargetV30, setWardrobeTargetV30] = useState("player");
  const [wardrobeDirectionV32, setWardrobeDirectionV32] = useState("front");'''
if state_old not in s:
    raise SystemExit('wardrobe state anchor not found')
s = s.replace(state_old, state_new, 1)

new_render = r'''  const renderWardrobeV30 = () => {
    const defaults={
      player:{hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99"},
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
    const shirtMeta=findMeta("shirt",player.shirt), pantsMeta=findMeta("pants",player.pants);
    const shirtDyeable=Boolean(shirtMeta?.[3]), pantsDyeable=Boolean(pantsMeta?.[3]);
    const shirtColor=player.shirtColor||defaults.player.shirtColor, pantsColor=player.pantsColor||defaults.player.pantsColor;

    const previewFrame=(dir,large=false)=>{
      const W=large?164:76,H=large?172:94,scale=large?1:.58;
      const side=dir==="left"||dir==="right";
      const flip=dir==="left";
      const hat=(wardrobe[wardrobeTargetV30]||{}).hat||"";
      const frameBase={position:"relative",width:W,height:H,margin:"0 auto",overflow:"hidden",borderRadius:10,background:"linear-gradient(#DCEEC9 0 67%,#D5B77B 67%)",border:`1px solid ${C.line}`,imageRendering:"pixelated"};
      const icon=(file,style={})=>file?<img src={GAME_FILE(file)} alt="" style={{position:"absolute",objectFit:"contain",imageRendering:"pixelated",...style}}/>:null;
      if(wardrobeTargetV30==="player"){
        const headW=(side?27:34)*scale,headH=34*scale,bodyW=(side?26:38)*scale;
        const cx=W/2;
        return <div style={frameBase}>
          <div style={{position:"absolute",left:cx-headW/2,top:large?31:18,width:headW,height:headH,background:"#E6B48A",border:"2px solid #6C472E",borderRadius:side?"45% 45% 40% 40%":"42%",zIndex:2}}/>
          <div style={{position:"absolute",left:cx-headW/2-2*scale,top:large?26:15,width:headW+4*scale,height:12*scale,background:"#6A402C",borderRadius:"50% 50% 20% 20%",zIndex:3}}/>
          {dir==="front"&&<><span style={{position:"absolute",left:cx-9*scale,top:(large?47:27),width:3*scale,height:3*scale,background:"#2A241E",zIndex:4}}/><span style={{position:"absolute",left:cx+6*scale,top:(large?47:27),width:3*scale,height:3*scale,background:"#2A241E",zIndex:4}}/></>}
          {dir==="back"&&<div style={{position:"absolute",left:cx-headW/2,top:large?31:18,width:headW,height:24*scale,background:"#6A402C",borderRadius:"42%",zIndex:4}}/>}
          <div style={{position:"absolute",left:cx-bodyW/2,top:large?67:38,width:bodyW,height:42*scale,background:player.shirt?shirtColor:"#D9C9A7",border:"2px solid #5B3B27",borderRadius:4*scale,zIndex:2}}/>
          <div style={{position:"absolute",left:cx-bodyW/2+2*scale,top:large?102:58,width:bodyW-4*scale,height:35*scale,background:player.pants?pantsColor:"#566A8A",border:"2px solid #4E3B2C",borderRadius:3*scale,zIndex:2}}/>
          <div style={{position:"absolute",left:cx-bodyW/2-7*scale,top:large?70:40,width:7*scale,height:40*scale,background:"#E6B48A",border:"1px solid #6C472E",zIndex:1}}/>
          <div style={{position:"absolute",left:cx+bodyW/2,top:large?70:40,width:7*scale,height:40*scale,background:"#E6B48A",border:"1px solid #6C472E",zIndex:1}}/>
          <div style={{position:"absolute",left:cx-bodyW/2+1*scale,top:large?135:76,width:(bodyW/2-2*scale),height:12*scale,background:"#3D2F28",zIndex:2}}/>
          <div style={{position:"absolute",left:cx+1*scale,top:large?135:76,width:(bodyW/2-2*scale),height:12*scale,background:"#3D2F28",zIndex:2}}/>
          {player.shirt&&icon(player.shirt,{left:cx-(large?24:14),top:large?70:40,width:large?48:28,height:large?48:28,zIndex:5,opacity:.82,filter:side?"saturate(.9)":"none"})}
          {player.pants&&icon(player.pants,{left:cx-(large?22:13),top:large?104:59,width:large?44:26,height:large?44:26,zIndex:5,opacity:.72})}
          {player.boots&&icon(player.boots,{left:cx-(large?19:11),top:large?132:75,width:large?38:22,height:large?38:22,zIndex:6})}
          {hat&&icon(hat,{left:cx-(large?29:17),top:large?4:3,width:large?58:34,height:large?58:34,zIndex:8,transform:flip?"scaleX(-1)":"none"})}
          <div style={{position:"absolute",left:4,bottom:3,fontSize:large?9:6.5,fontWeight:950,color:"#604329",background:"rgba(255,248,227,.82)",padding:"1px 4px",borderRadius:5}}>{directions.find(x=>x[0]===dir)?.[1]}</div>
        </div>;
      }

      const baseFile=wardrobeTargetV30==="horse"?"Horse":wardrobeTargetV30==="cat"?"Cat 1":"Dog 1";
      const animalSize=large?(wardrobeTargetV30==="horse"?116:86):(wardrobeTargetV30==="horse"?62:48);
      const cx=W/2;
      const isHorse=wardrobeTargetV30==="horse";
      const synthetic=!side;
      return <div style={frameBase}>
        {synthetic?<>
          <div style={{position:"absolute",left:cx-(isHorse?25:16)*scale,top:(large?48:28),width:(isHorse?50:32)*scale,height:(isHorse?68:42)*scale,background:isHorse?"#9B5E30":"#C48B58",border:"2px solid #56351F",borderRadius:isHorse?"35% 35% 24% 24%":"45%",zIndex:2}}/>
          <div style={{position:"absolute",left:cx-(isHorse?17:12)*scale,top:(large?28:17),width:(isHorse?34:24)*scale,height:(isHorse?39:27)*scale,background:isHorse?"#A86736":"#D39B67",border:"2px solid #56351F",borderRadius:"45% 45% 35% 35%",zIndex:3}}/>
          {dir==="front"&&<><span style={{position:"absolute",left:cx-10*scale,top:(large?42:25),width:3*scale,height:3*scale,background:"#211A16",zIndex:4}}/><span style={{position:"absolute",left:cx+7*scale,top:(large?42:25),width:3*scale,height:3*scale,background:"#211A16",zIndex:4}}/></>}
          {isHorse&&<><div style={{position:"absolute",left:cx-23*scale,top:(large?109:63),width:10*scale,height:42*scale,background:"#7B4928",border:"1px solid #56351F",zIndex:1}}/><div style={{position:"absolute",left:cx+13*scale,top:(large?109:63),width:10*scale,height:42*scale,background:"#7B4928",border:"1px solid #56351F",zIndex:1}}/></>}
        </>:icon(baseFile,{left:cx-animalSize/2,top:large?34:24,width:animalSize,height:animalSize,zIndex:3,transform:flip?"scaleX(-1)":"none"})}
        {hat&&icon(hat,{left:cx-(large?(isHorse?30:24):(isHorse?18:14)),top:large?(isHorse?8:18):(isHorse?6:10),width:large?(isHorse?60:48):(isHorse?36:28),height:large?(isHorse?60:48):(isHorse?36:28),zIndex:8,transform:flip?"scaleX(-1)":"none"})}
        <div style={{position:"absolute",left:4,bottom:3,fontSize:large?9:6.5,fontWeight:950,color:"#604329",background:"rgba(255,248,227,.82)",padding:"1px 4px",borderRadius:5}}>{directions.find(x=>x[0]===dir)?.[1]}</div>
      </div>;
    };

    return <div>
      <SectionTitle icon="🎩">衣櫥搭配</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,color:C.muted,lineHeight:1.45}}>v32：新增四方向換裝預覽。玩家會把目前選的帽子／上衣／下裝／鞋帶進預覽；可染色上衣、下裝可直接挑色。馬、貓、狗戴帽也會同步顯示。</div></Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{targets.map(([id,name,file])=>{const on=wardrobeTargetV30===id;return <button key={id} onClick={()=>{setWardrobeTargetV30(id);if(id!=="player")setWardrobeCategoryV30("hat")}} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:9,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}>{id==="player"?(data.profilePortrait?<img src={data.profilePortrait} alt="" style={{width:27,height:34,objectFit:"cover",borderRadius:4,imageRendering:"pixelated"}}/>:<GameIcon file="Inventory Tab" size={27}/>):<GameIcon file={file} size={27}/>}<div>{name}</div></button>})}</div>

      <Card style={{marginTop:7,padding:8}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{directions.map(([id,name])=><button key={id} onClick={()=>setWardrobeDirectionV32(id)} style={{border:`1.5px solid ${wardrobeDirectionV32===id?C.orange:C.line}`,background:wardrobeDirectionV32===id?"#FFF0D2":C.paper,borderRadius:8,padding:3,minWidth:0}}>{previewFrame(id,false)}</button>)}</div>
        <div style={{marginTop:7}}>{previewFrame(wardrobeDirectionV32,true)}</div>
        <div style={{textAlign:"center",fontSize:8.5,color:C.muted,marginTop:5}}>點上方四格切換大圖方向；左右側會依方向翻轉。</div>
      </Card>

      {wardrobeTargetV30==="player"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{slotDefs.map(([id,name,file])=>{const on=wardrobeCategoryV30===id;const selected=player[id];return <button key={id} onClick={()=>setWardrobeCategoryV30(id)} style={{border:`1.5px solid ${on?C.orange:selected?C.green:C.line}`,background:on?"#FFE2A8":selected?"#EEF7DD":C.paper,borderRadius:8,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file={selected||file} size={25}/><div>{name}</div></button>})}</div>
        {(shirtDyeable||pantsDyeable)&&<Card style={{marginTop:7,padding:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:6}}>染色預覽</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          <label style={{display:"flex",alignItems:"center",gap:7,fontSize:9,color:shirtDyeable?C.ink:C.muted,opacity:shirtDyeable?1:.45}}><input type="color" disabled={!shirtDyeable} value={shirtColor} onChange={e=>update({wardrobeV30:{...wardrobe,player:{...player,shirtColor:e.target.value}}})} style={{width:42,height:32,border:0,background:"transparent",padding:0}}/><span><b>上衣</b><br/>{shirtDyeable?"可染色":"目前上衣不可染"}</span></label>
          <label style={{display:"flex",alignItems:"center",gap:7,fontSize:9,color:pantsDyeable?C.ink:C.muted,opacity:pantsDyeable?1:.45}}><input type="color" disabled={!pantsDyeable} value={pantsColor} onChange={e=>update({wardrobeV30:{...wardrobe,player:{...player,pantsColor:e.target.value}}})} style={{width:42,height:32,border:0,background:"transparent",padding:0}}/><span><b>下裝</b><br/>{pantsDyeable?"可染色":"目前下裝不可染"}</span></label>
        </div></Card>}
      </>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,marginTop:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown}}>{wardrobeTargetV30==="player"?slotDefs.find(x=>x[0]===slot)?.[1]:`${currentTargetLabel}帽子`}・{list.length} 項</div>{chosen&&<button onClick={()=>setTarget({[slot]:""})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:8.5,fontWeight:900,color:C.red}}>清除</button>}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:6}}>{list.map(it=>{const [file,name,source,dye]=it;const on=chosen===file;return <button key={file} onClick={()=>setTarget({[slot]:on?"":file})} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"5px 3px",minHeight:96,textAlign:"center",cursor:"pointer",minWidth:0}}><GameIcon file={file} size={36}/><div style={{fontSize:8.2,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div><div style={{fontSize:6.7,color:C.muted,lineHeight:1.2,marginTop:3}}>{source}</div>{dye&&<div style={{fontSize:6.5,color:C.blue,fontWeight:900,marginTop:2}}>可染色</div>}</button>})}</div>
    </div>;
  };
'''

pattern = re.compile(r'  const renderWardrobeV30 = \(\) => \{.*?\n  \};\n\n  const renderNotes = \(\) => <div>', re.S)
m = pattern.search(s)
if not m:
    raise SystemExit('renderWardrobeV30 block not found')
s = s[:m.start()] + new_render + '\n\n  const renderNotes = () => <div>' + s[m.end():]

app.write_text(s, encoding='utf-8')

idx = Path('index.html')
t = idx.read_text(encoding='utf-8')
t = t.replace('cloud.js?v=31','cloud.js?v=32').replace('app.js?v=31','app.js?v=32').replace('<!-- deploy-v31 -->','<!-- deploy-v32 -->')
idx.write_text(t, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8').replace("stardew-tracker-v31","stardew-tracker-v32")
sw.write_text(t, encoding='utf-8')

print('V32_PATCH_APPLIED')
