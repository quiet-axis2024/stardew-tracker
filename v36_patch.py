from pathlib import Path
import re

APP=Path('app.jsx')
ANIMAL=Path('animal-preview-v33.js')
DATA=Path('wardrobe-data-v34.js')
INDEX=Path('index.html')
SW=Path('sw.js')

# ---------- app.jsx ----------
a=APP.read_text(encoding='utf-8')

old_scene='''const WARDROBE_SCENE_V35 = {
  day:{label:"☀️ 白天",bg:"linear-gradient(#8FD0F3 0 62%,#78AD57 62% 70%,#C9A66A 70%)",labelBg:"rgba(255,248,227,.9)",labelColor:"#604329"},
  night:{label:"🌙 夜晚",bg:"linear-gradient(#17264B 0 62%,#35513A 62% 70%,#665342 70%)",labelBg:"rgba(27,28,49,.82)",labelColor:"#F7EBC8"}
};'''
new_scene='''const WARDROBE_BG_ROOT_V36 = "https://raw.githubusercontent.com/shayderrr/stardew_decomp/6fcc1d4d20d14c5be6232d0f9eac1d423222fd84/stardew/unpacked/LooseSprites/";
const WARDROBE_SCENE_V35 = {
  day:{label:"☀️ 白天",bg:"linear-gradient(#8FD0F3 0 62%,#78AD57 62% 70%,#C9A66A 70%)",image:WARDROBE_BG_ROOT_V36+"daybg.png",labelBg:"rgba(255,248,227,.9)",labelColor:"#604329"},
  night:{label:"🌙 夜晚",bg:"linear-gradient(#17264B 0 62%,#35513A 62% 70%,#665342 70%)",image:WARDROBE_BG_ROOT_V36+"nightbg.png",labelBg:"rgba(27,28,49,.82)",labelColor:"#F7EBC8"}
};'''
assert old_scene in a
a=a.replace(old_scene,new_scene,1)

# Large previews use the real game daybg/nightbg; small direction previews keep the existing clean gradient.
a=a.replace('''  const w=large?96:48,h=large?168:84;
  return <div style={{position:"relative",height:large?182:100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,background:sc.bg,border:`1px solid ${C.line}`}}>''','''  const w=large?96:48,h=large?168:84;
  const sceneStyle=large?{backgroundColor:scene==="night"?"#17264B":"#8FD0F3",backgroundImage:`url(${sc.image})`,backgroundSize:"cover",backgroundPosition:"center",imageRendering:"pixelated"}:{background:sc.bg};
  return <div style={{position:"relative",height:large?182:100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,...sceneStyle,border:`1px solid ${C.line}`}}>''',1)

a=a.replace('function AnimalSpritePreviewV33({type,hat,direction="front",large=false,scene="day"}) {','function AnimalSpritePreviewV33({type,hat,variant=0,direction="front",large=false,scene="day"}) {',1)
a=a.replace('api.draw(ref.current,{type,hat,direction}).catch(e=>console.warn("animal sprite preview failed",e));','api.draw(ref.current,{type,hat,variant,direction}).catch(e=>console.warn("animal sprite preview failed",e));',1)
a=a.replace('},[type,hat,direction]);','},[type,hat,variant,direction]);',1)
a=a.replace('''  const w=large?104:52,h=large?96:48;
  return <div style={{position:"relative",height:large?126:100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,background:sc.bg,border:`1px solid ${C.line}`}}>''','''  const w=large?104:52,h=large?96:48;
  const sceneStyle=large?{backgroundColor:scene==="night"?"#17264B":"#8FD0F3",backgroundImage:`url(${sc.image})`,backgroundSize:"cover",backgroundPosition:"center",imageRendering:"pixelated"}:{background:sc.bg};
  return <div style={{position:"relative",height:large?126:100,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:9,...sceneStyle,border:`1px solid ${C.line}`}}>''',1)

marker='''/* ================= 主程式 ================= */'''
pet_component='''function PetVariantPreviewV36({type,variant=0}) {
  const ref=useRef(null);
  useEffect(()=>{
    const api=window.SDVAnimalSpriteV33;
    if(!api?.draw||!ref.current)return;
    api.draw(ref.current,{type,variant,hat:"",direction:"front"}).catch(e=>console.warn("pet variant preview failed",e));
  },[type,variant]);
  return <canvas ref={ref} aria-label={`${type} 外觀 ${Number(variant)+1}`} style={{width:52,height:48,imageRendering:"pixelated",display:"block",margin:"0 auto"}}/>;
}

'''+marker
assert marker in a
a=a.replace(marker,pet_component,1)

# Persist cat/dog appearance variant.
a=a.replace('horse:{hat:""},cat:{hat:""},dog:{hat:""}','horse:{hat:""},cat:{hat:"",variant:0},dog:{hat:"",variant:0}',1)

# Use Chinese acquisition text when available.
a=a.replace('const wrap=arr=>(arr||[]).map(x=>[x.key,x.name,x.source,x.dyeable,x]);','const wrap=arr=>(arr||[]).map(x=>[x.key,x.name,x.sourceZh||x.source,x.dyeable,x]);',1)
a=a.replace('const list=q?rawList.filter(it=>`${it[1]} ${it[2]} ${it[0]}`.toLowerCase().includes(q)):rawList;','const list=q?rawList.filter(it=>`${it[1]} ${it[2]} ${it[4]?.source||""} ${it[0]}`.toLowerCase().includes(q)):rawList;',1)

# Pass pet variant into the renderer.
a=a.replace(':<AnimalSpritePreviewV33 type={wardrobeTargetV30} hat={target.hat||""} direction={dir} large={large} scene={scene}/>;',':<AnimalSpritePreviewV33 type={wardrobeTargetV30} variant={Number(target.variant||0)} hat={target.hat||""} direction={dir} large={large} scene={scene}/>;',1)

# v36 description.
a=a.replace('v35：穿搭預覽加入白天／夜晚雙場景與清晰整數像素倍率；鞋子改按遊戲 shoeColors 色盤顯示。貓／狗使用遊戲動物專用帽子素材與原生幀定位，馬使用遊戲自己的馬帽定位規則。','v36：下方白天／夜晚預覽改用遊戲 daybg／nightbg 原圖；帽子取得方式中文化；髮型改為箭頭＋號碼輸入；貓狗可切換 6 種遊戲外觀；馬帽重新按 1.6 Horse.draw() 座標校正。',1)

# Pet variant selector right below the two-scene preview card.
needle='''      </Card>\n\n      {wardrobeTargetV30==="player"&&<>'''
insert='''      </Card>\n\n      {(wardrobeTargetV30==="cat"||wardrobeTargetV30==="dog")&&<Card style={{marginTop:7,padding:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6,marginBottom:6}}><b style={{fontSize:9.5,color:C.brown}}>外觀款式</b><span style={{fontSize:8,color:C.muted}}>目前第 {Number(target.variant||0)+1} 款／6</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5}}>{[0,1,2,3,4,5].map(v=>{const on=Number(target.variant||0)===v;return <button key={v} onClick={()=>setTarget({variant:v})} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.cream,borderRadius:8,padding:"3px 2px 5px",fontSize:7.5,fontWeight:900,color:C.brown,minWidth:0}}><PetVariantPreviewV36 type={wardrobeTargetV30} variant={v}/><div>款式 {v+1}</div></button>})}</div>
      </Card>}\n\n      {wardrobeTargetV30==="player"&&<>'''
assert needle in a
a=a.replace(needle,insert,1)

# Hair control: arrows + editable 1-based number instead of slider.
old_hair='''          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"center",marginTop:8}}><label style={{fontSize:8.5,color:C.muted}}><b style={{color:C.ink}}>髮型 {Number(player.hairIndex||0)+1}</b><input type="range" min="0" max="55" value={Number(player.hairIndex||0)} onChange={e=>setPlayer({hairIndex:Number(e.target.value)})} style={{width:"100%",marginTop:4}}/></label><label style={{fontSize:8.5,color:C.muted,textAlign:"center"}}><input type="color" value={player.hairColor||defaults.player.hairColor} onChange={e=>setPlayer({hairColor:e.target.value})} style={{width:42,height:32,border:0,background:"transparent",padding:0}}/><div>髮色</div></label></div>'''
new_hair='''          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"end",marginTop:8}}><div><div style={{fontSize:8.5,fontWeight:950,color:C.ink,marginBottom:4}}>髮型號碼</div><div style={{display:"grid",gridTemplateColumns:"40px 64px 40px",gap:4,alignItems:"center"}}><button onClick={()=>setPlayer({hairIndex:Math.max(0,Number(player.hairIndex||0)-1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"6px 0",fontSize:11,fontWeight:950,color:C.brown}}>◀</button><input type="number" min="1" max="56" value={Number(player.hairIndex||0)+1} onChange={e=>{const n=Math.max(1,Math.min(56,Number(e.target.value)||1));setPlayer({hairIndex:n-1})}} style={{width:64,border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:7,padding:"6px 4px",fontSize:10,fontWeight:950,textAlign:"center",color:C.ink}}/><button onClick={()=>setPlayer({hairIndex:Math.min(55,Number(player.hairIndex||0)+1)})} style={{border:`1.5px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"6px 0",fontSize:11,fontWeight:950,color:C.brown}}>▶</button></div></div><label style={{fontSize:8.5,color:C.muted,textAlign:"center"}}><input type="color" value={player.hairColor||defaults.player.hairColor} onChange={e=>setPlayer({hairColor:e.target.value})} style={{width:42,height:32,border:0,background:"transparent",padding:0}}/><div>髮色</div></label></div>'''
assert old_hair in a
a=a.replace(old_hair,new_hair,1)

APP.write_text(a,encoding='utf-8')

# ---------- animal-preview-v33.js ----------
animal=r'''/* Stardew Valley horse/pet wardrobe preview.
 * Pet variants use the six vanilla cat/dog sheets (cat..cat5, dog..dog5).
 * Cat/dog hats follow Pet.drawHat() and use hats_animals.png.
 * Horse hats follow Horse.draw(): normal hat texture, standing-facing positions,
 * and vanilla per-hat corrections. Game artwork © ConcernedApe.
 */
(function(){
  'use strict';
  const PIN='6fcc1d4d20d14c5be6232d0f9eac1d423222fd84';
  const RAW=`https://raw.githubusercontent.com/shayderrr/stardew_decomp/${PIN}/stardew/unpacked/`;
  const ANIMAL_HATS=RAW+'Characters/Farmer/hats_animals.png';
  const cache=new Map();
  function load(src){
    if(cache.has(src))return cache.get(src);
    const p=new Promise((resolve,reject)=>{const i=new Image();i.crossOrigin='anonymous';i.decoding='async';i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
    cache.set(src,p);return p;
  }
  function crop(ctx,img,sx,sy,sw,sh,dx,dy,flip=false){
    ctx.save();
    if(flip){ctx.translate(dx+sw,dy);ctx.scale(-1,1);ctx.drawImage(img,sx,sy,sw,sh,0,0,sw,sh)}
    else ctx.drawImage(img,sx,sy,sw,sh,dx,dy,sw,sh);
    ctx.restore();
  }
  const HAT_FRAME_Y={front:0,right:20,left:40,back:60};
  const FRAME={
    horse:{front:{sy:0,flip:false},right:{sy:32,flip:false},back:{sy:64,flip:false},left:{sy:32,flip:true}},
    cat:{front:{sy:0,flip:false},right:{sy:32,flip:false},back:{sy:64,flip:false},left:{sy:96,flip:false}},
    dog:{front:{sy:0,flip:false},right:{sy:32,flip:false},back:{sy:64,flip:false},left:{sy:96,flip:false}}
  };
  // Converted from vanilla Pet.drawHat() standing frames into raw 32px-sheet coordinates.
  const PET_HAT_POS={
    cat:{front:[6.5,10],right:[12.25,8],back:[6.5,2],left:[1,8]},
    dog:{front:[6.5,5],right:[13,4],back:[6.5,-1],left:[0,4]}
  };
  // Converted from vanilla Horse.draw() world coordinates. The horse itself is rendered at 4x;
  // Hat.draw() also resolves to 4x here, so these are raw-pixel offsets relative to a 32x32 horse frame.
  const HORSE_HAT_POS={front:[7,9],right:[16,1],back:[6.5,-7],left:[-4,1]};
  function horseHatAdjustment(index,dir){
    let x=0,y=0,hide=false;
    if(index===14&&dir==='back')hide=true;
    if(index===6){y+=2;if(dir==='front')y-=1;}
    if(index===10){y+=3;if(dir==='back')hide=true;}
    if((index===9||index===32)&&(dir==='back'||dir==='front'))y+=1;
    if(index===31)y+=1;
    if((index===39||index===11)&&(dir==='left'||dir==='right'))x+=dir==='left'?2:-2;
    if(index===26&&(dir==='left'||dir==='right'))x+=dir==='left'?1:-1;
    if((index===67||index===56)&&dir==='back')hide=true;
    return {x,y,hide};
  }
  function petSrc(kind,variant){
    const v=Math.max(0,Math.min(5,Number(variant)||0));
    return RAW+`Animals/${kind}${v===0?'':v}.png`;
  }
  async function draw(canvas,opts){
    if(!canvas)return;
    const kind=(opts?.type==='cat'||opts?.type==='dog')?opts.type:'horse';
    const variant=kind==='horse'?0:Math.max(0,Math.min(5,Number(opts?.variant)||0));
    const dir=FRAME[kind][opts?.direction]?opts.direction:'front';
    const token=String(Date.now())+Math.random();canvas.dataset.sdvAnimalToken=token;
    const farmerHats=window.SDVFarmerSpriteV33?.SRC?.hats;
    const hatSrc=kind==='horse'?farmerHats:ANIMAL_HATS;
    const src=kind==='horse'?RAW+'Animals/horse.png':petSrc(kind,variant);
    const [animal,hats]=await Promise.all([load(src),hatSrc?load(hatSrc):Promise.resolve(null)]);
    if(canvas.dataset.sdvAnimalToken!==token)return;
    const SCALE=2,W=52,H=48;canvas.width=W*SCALE;canvas.height=H*SCALE;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.setTransform(SCALE,0,0,SCALE,0,0);ctx.clearRect(0,0,W,H);
    const f=FRAME[kind][dir],ax=10,ay=12;
    crop(ctx,animal,0,f.sy,32,32,ax,ay,f.flip);
    const hatIndex=window.SDVWardrobeV34?.byKey?.hat?.[opts?.hat]?.index ?? window.SDVFarmerSpriteV33?.HATS?.[opts?.hat];
    if(!hats||!Number.isFinite(hatIndex))return;
    const hx=(hatIndex%12)*20,hy=Math.floor(hatIndex/12)*80+HAT_FRAME_Y[dir];
    if(kind==='horse'){
      const adj=horseHatAdjustment(hatIndex,dir);if(adj.hide)return;
      const p=HORSE_HAT_POS[dir];
      crop(ctx,hats,hx,hy,20,20,ax+p[0]+adj.x,ay+p[1]+adj.y,false);
    }else{
      const p=PET_HAT_POS[kind][dir];
      crop(ctx,hats,hx,hy,20,20,ax+p[0],ay+p[1],false);
    }
  }
  window.SDVAnimalSpriteV33={draw,petSrc};
})();
'''
ANIMAL.write_text(animal,encoding='utf-8')

# ---------- wardrobe-data-v34.js: Chinese hat acquisition descriptions ----------
d=DATA.read_text(encoding='utf-8')
insert_before='''  data.byKey={hat:{},shirt:{},pants:{}};'''
assert insert_before in d
translator=r'''  const ACH_ZH_V36={
    "A Complete Collection":"全套收藏","Millionaire":"百萬富翁","Legend":"傳奇","Ol' Mariner":"老水手","Treasure Trove":"珍寶收藏","Sous Chef":"副主廚","Full Shipment":"全品出貨","A Big Help":"熱心幫手","Popular":"廣受歡迎","Cook":"廚師","Moving Up":"搬新家","A New Friend":"新朋友","Living Large":"富足生活","Artisan":"工匠","Greenhorn":"新手農夫","Homesteader":"農場主人","Cowpoke":"牛仔","Gofer":"跑腿高手","Craft Master":"製作大師","Master Angler":"釣魚大師","Networking":"人脈","Cliques":"小圈子","Fisherman":"漁夫","D.I.Y.":"自己動手","Mother Catch":"捕魚高手","Best Friends":"摯友","The Beloved Farmer":"最受愛戴的農夫","Monoculture":"單一栽培","Polyculture":"多元栽培","Gourmet Chef":"美食大廚"
  };
  function zhHatSourceV36(value){
    let s=String(value||'').trim();
    if(!s)return s;
    s=s.replace(/Warp Totems/g,'傳送圖騰').replace(/Omni Geodes/g,'萬象晶球').replace(/Taro Roots/g,'芋頭').replace(/Qi Gems/g,'齊鑽').replace(/Qi Coins/g,'齊幣');
    s=s.replace(/Found by 1\/26 chance in treasure chests in the 骷髏洞穴\.?/g,'另有 1/26 機率可從骷髏洞穴寶箱取得。');
    s=s.replace(/Found by 1\/9 chance in rare treasure chests in the 火山地牢\.?/g,'有 1/9 機率可從火山地牢的稀有寶箱取得。');
    let m=s.match(/^Achieve '(.+)' and\s*purchase for ([\d,]+)g in the Hat Shop\.?$/);
    if(m){const z=ACH_ZH_V36[m[1]];return `完成「${z?z+'（'+m[1]+'）':m[1]}」成就後，可在帽子老鼠商店以 ${m[2]}g 購買。`;}
    if(/^Achieve All achievements/.test(s))return '完成所有成就後，可在帽子老鼠商店以 1,000g 購買。';
    if(/^Win the egg hunt at the Egg Festival/.test(s))return '在春季彩蛋節贏得找彩蛋比賽；取得一次後，可在帽子老鼠商店再次購買。';
    if(/^Win the fishing competition at the Festival of Ice/.test(s))return '在冬季冰雪節贏得釣魚比賽；取得一次後，可在帽子老鼠商店再次購買。';
    m=s.match(/^Kill (\d+) (.+?) and receive in 探險家公會\.；Can purchase for ([\d,]+)g in the 探險家公會 after achieved the goal\.?$/);
    if(m){const mob={Skeletons:'骷髏',Duggies:'掘地蟲','Pepper Rex':'霸王噴火龍',Mummies:'木乃伊'}[m[2]]||m[2];return `完成探險家公會「擊殺 ${m[1]} 隻${mob}」目標後領取；之後可在探險家公會以 ${m[3]}g 購買。`;}
    if(/^Purchase for 8,000 齊幣 in Qi's Casino/.test(s))return '在齊先生賭場以 8,000 齊幣購買。';
    if(/^Purchase for 500 Star Token at the Stardew Valley Fair/.test(s))return '在星露谷展覽會以 500 星星幣兌換。';
    if(/^Purchase during the Night Market at the Magic Shop Boat/.test(s))return '冬季夜市期間，在魔法商船購買。';
    if(/^0\.001% chance to find while cutting weeds/.test(s))return '割除雜草時有 0.001% 機率取得；荒野魔像另有 0.01% 機率掉落。';
    if(/^Obtained in Emily's 14-heart cutscene/.test(s))return '完成艾蜜莉 14 心事件後取得。';
    if(/^1% chance of obtaining when chopping down a Mushroom Tree/.test(s))return '砍倒蘑菇樹時有 1% 機率取得。';
    if(/^Monster drop from Metal Heads/.test(s))return '擊殺金屬大頭怪取得（每累計擊殺 100 隻會掉落）。';
    if(/^0\.2% chance to find while checking Garbage Cans/.test(s))return '至少翻過 20 次垃圾桶後，再翻垃圾桶時有 0.2% 機率取得。';
    if(/^Wear the Copper Pan in the hat slot/.test(s))return '把淘金盤裝備到帽子欄即可戴在頭上。';
    if(/^Exchange for 50 萬象晶球 to Desert Trader/.test(s))return '在沙漠商人處用 50 個萬象晶球兌換。';
    if(/^Exchange for 333 萬象晶球 to Desert Trader\(Odd days\)/.test(s))return '單數日期可在沙漠商人處用 333 個萬象晶球兌換。';
    if(/^Exchange for 333 萬象晶球 to Desert Trader\(Even days\)/.test(s))return '雙數日期可在沙漠商人處用 333 個萬象晶球兌換。';
    if(/^5% chance of obtaining when open the Golden Coconut/.test(s))return '敲開金色椰子時有 5% 機率取得。';
    if(/^Purchase for 10,000g by Dwarf in 火山地牢/.test(s))return '火山地牢的矮人商店有 25% 機率販售，價格 10,000g。';
    if(/^Fish in the Gourmand Frog's cave on Ginger Island/.test(s))return '在薑島青蛙美食家洞穴的水中釣魚取得。';
    if(/^Exchange for 30 芋頭 to 薑島商人 on Mondays/.test(s))return '星期一可在薑島商人處用 30 個芋頭兌換。';
    if(/^Exchange for 30 芋頭 to 薑島商人 on Wednesdays/.test(s))return '星期三可在薑島商人處用 30 個芋頭兌換。';
    if(/^Exchange for 30 芋頭 to 薑島商人 on Fridays/.test(s))return '星期五可在薑島商人處用 30 個芋頭兌換。';
    if(/^Purchase for 5 齊鑽 in 齊先生核桃房/.test(s))return '在齊先生核桃房以 5 個齊鑽購買。';
    if(/^0\.1% chance of droping from Tiger Slimes/.test(s))return '老虎史萊姆有 0.1% 機率掉落。';
    if(/^Interact with the monkey in the Volcano Caldera/.test(s))return '達成 100% 完美度後，與火山口的猴子互動取得。';
    if(s==='Unobtainable')return '正常遊戲中無法取得。';
    // Translate mixed Chinese/English clauses without degrading already-Chinese tailoring recipes.
    s=s.replace(/；Can purchase in the Hat Shop after get it once\.?/g,'；取得一次後可在帽子老鼠商店再次購買。')
      .replace(/0\.22% chance of droping from Haunted Skulls\.?/g,'鬧鬼骷髏另有 0.22% 機率掉落')
      .replace(/Starting/g,'建立角色時可選')
      .replace(/Randomly \(Cloth \+ Prismatic Shard\)/g,'隨機（布料＋五彩碎片）')
      .replace(/Cloth \+ Prismatic Shard/g,'布料＋五彩碎片');
    return s;
  }
  for(const h of data.hats)h.sourceZh=zhHatSourceV36(h.source);
'''
d=d.replace(insert_before,translator+insert_before,1)
DATA.write_text(d,encoding='utf-8')

# ---------- cache/version ----------
i=INDEX.read_text(encoding='utf-8').replace('?v=35','?v=36').replace('deploy-v35','deploy-v36')
INDEX.write_text(i,encoding='utf-8')
s=SW.read_text(encoding='utf-8').replace("stardew-tracker-v35","stardew-tracker-v36")
SW.write_text(s,encoding='utf-8')
