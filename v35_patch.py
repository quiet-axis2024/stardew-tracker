from pathlib import Path
import re

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
start=s.index('const WARDROBE_DIR_LABEL_V33 =')
end=s.index('/* ================= 主程式 ================= */', start)
new=r'''const WARDROBE_DIR_LABEL_V33 = {front:"正面",right:"右側",back:"背面",left:"左側"};
const WARDROBE_SCENE_V35 = {
  day:{label:"☀️ 白天",bg:"linear-gradient(#8FD0F3 0 62%,#78AD57 62% 70%,#C9A66A 70%)",labelBg:"rgba(255,248,227,.9)",labelColor:"#604329"},
  night:{label:"🌙 夜晚",bg:"linear-gradient(#17264B 0 62%,#35513A 62% 70%,#665342 70%)",labelBg:"rgba(27,28,49,.82)",labelColor:"#F7EBC8"}
};
function FarmerSpritePreviewV33({player,direction="front",large=false,scene="day",shirtDyeable=false,pantsDyeable=false}) {
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
  const sc=WARDROBE_SCENE_V35[scene]||WARDROBE_SCENE_V35.day;
  // Helper backing is 48x84. 48x84 (small) and 96x168 (large) are exact integer scales.
  const w=large?96:48,h=large?168:84;
  return <div style={{position:"relative",height:large?182:100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,background:sc.bg,border:`1px solid ${C.line}`}}>
    <canvas ref={ref} aria-label={`玩家${WARDROBE_DIR_LABEL_V33[direction]||""}遊戲 sprite 預覽`} style={{width:w,height:h,imageRendering:"pixelated",display:"block"}}/>
    {large&&<span style={{position:"absolute",right:4,top:4,fontSize:7.5,fontWeight:950,color:sc.labelColor,background:sc.labelBg,padding:"2px 5px",borderRadius:5}}>{sc.label}</span>}
    <span style={{position:"absolute",left:4,bottom:3,fontSize:large?8:6.8,fontWeight:950,color:"#604329",background:"rgba(255,248,227,.9)",padding:"1px 4px",borderRadius:5}}>{WARDROBE_DIR_LABEL_V33[direction]}</span>
  </div>;
}
function AnimalSpritePreviewV33({type,hat,direction="front",large=false,scene="day"}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVAnimalSpriteV33;
    if(!api?.draw||!ref.current)return;
    api.draw(ref.current,{type,hat,direction}).catch(e=>console.warn("animal sprite preview failed",e));
  },[type,hat,direction]);
  const sc=WARDROBE_SCENE_V35[scene]||WARDROBE_SCENE_V35.day;
  // Helper backing is 104x96. Small is exact 1/2, large is exact 1x.
  const w=large?104:52,h=large?96:48;
  return <div style={{position:"relative",height:large?126:100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,background:sc.bg,border:`1px solid ${C.line}`}}>
    <canvas ref={ref} aria-label={`${type}${WARDROBE_DIR_LABEL_V33[direction]||""}遊戲 sprite 預覽`} style={{width:w,height:h,imageRendering:"pixelated",display:"block"}}/>
    {large&&<span style={{position:"absolute",right:4,top:4,fontSize:7.5,fontWeight:950,color:sc.labelColor,background:sc.labelBg,padding:"2px 5px",borderRadius:5}}>{sc.label}</span>}
    <span style={{position:"absolute",left:4,bottom:3,fontSize:large?8:6.8,fontWeight:950,color:"#604329",background:"rgba(255,248,227,.9)",padding:"1px 4px",borderRadius:5}}>{WARDROBE_DIR_LABEL_V33[direction]}</span>
  </div>;
}

'''
s=s[:start]+new+s[end:]

old='''    const preview=(dir,large=false)=>wardrobeTargetV30==="player"?<FarmerSpritePreviewV33 player={player} direction={dir} large={large} shirtDyeable={shirtDyeable} pantsDyeable={pantsDyeable}/>:<AnimalSpritePreviewV33 type={wardrobeTargetV30} hat={target.hat||""} direction={dir} large={large}/>;'''
newprev='''    const preview=(dir,large=false,scene="day")=>wardrobeTargetV30==="player"?<FarmerSpritePreviewV33 player={player} direction={dir} large={large} scene={scene} shirtDyeable={shirtDyeable} pantsDyeable={pantsDyeable}/>:<AnimalSpritePreviewV33 type={wardrobeTargetV30} hat={target.hat||""} direction={dir} large={large} scene={scene}/>;'''
if old not in s: raise SystemExit('preview function block not found')
s=s.replace(old,newprev,1)

oldcard='''        <div style={{marginTop:7}}>{preview(wardrobeDirectionV32,true)}</div>
      </Card>'''
newcard='''        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginTop:7}}>
          {preview(wardrobeDirectionV32,true,"day")}
          {preview(wardrobeDirectionV32,true,"night")}
        </div>
        <div style={{textAlign:"center",fontSize:8,color:C.muted,marginTop:5}}>同一方向同時看白天／夜晚；使用固定整數像素倍率，不再把角色硬撐大。</div>
      </Card>'''
if oldcard not in s: raise SystemExit('large preview card block not found')
s=s.replace(oldcard,newcard,1)

s=s.replace('v34：拿來自己配穿搭。帽子／上衣／下裝改成完整遊戲清單；選完直接看角色成品，下面同時列出裁縫材料與染色 RGB。馬、貓、狗帽子位置也改成依遊戲角色幀自動抓頭部，不再固定猜座標。','v35：穿搭預覽加入白天／夜晚雙場景與清晰整數像素倍率；鞋子改按遊戲 shoeColors 色盤顯示。貓／狗使用遊戲動物專用帽子素材與原生幀定位，馬使用遊戲自己的馬帽定位規則。')
p.write_text(s,encoding='utf-8')

# Cache-bust runtime files.
p=Path('index.html'); s=p.read_text(encoding='utf-8')
s=s.replace('cloud.js?v=34','cloud.js?v=35').replace('wardrobe-data-v34.js?v=34','wardrobe-data-v34.js?v=35')
s=s.replace('farmer-preview-v33.js?v=34','farmer-preview-v33.js?v=35').replace('animal-preview-v33.js?v=34','animal-preview-v33.js?v=35')
s=s.replace('app.js?v=34','app.js?v=35').replace('deploy-v34','deploy-v35')
p.write_text(s,encoding='utf-8')

p=Path('sw.js'); s=p.read_text(encoding='utf-8').replace("stardew-tracker-v34","stardew-tracker-v35")
p.write_text(s,encoding='utf-8')
