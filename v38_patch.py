from pathlib import Path

app = Path('app.jsx')
s = app.read_text(encoding='utf-8')

marker = 'function FarmerSpritePreviewV33({player,direction="front",large=false,scene="day",shirtDyeable=false,pantsDyeable=false}) {'
helper = r'''
const WARDROBE_V38_PLAYER_DEFAULT = {
  hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99",
  gender:"female",hairIndex:0,hairColor:"#6a402c",skinIndex:0,eyeColor:"#5B4636",accessoryIndex:-1
};
function normalizeWardrobeHexV38(value,fallback){
  const v=String(value||"");
  return /^#[0-9a-f]{6}$/i.test(v)?v:fallback;
}
function normalizeWardrobeProgressV38(input){
  const base=input&&typeof input==="object"?input:{};
  const old=base.wardrobeV30&&typeof base.wardrobeV30==="object"?base.wardrobeV30:{};
  const oldPlayer=old.player&&typeof old.player==="object"?old.player:{};
  const finite=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
  const player={...WARDROBE_V38_PLAYER_DEFAULT,...oldPlayer};
  player.gender=player.gender==="male"?"male":"female";
  player.hairIndex=Math.max(0,Math.floor(finite(player.hairIndex,0)));
  player.skinIndex=Math.max(0,Math.floor(finite(player.skinIndex,0)));
  player.accessoryIndex=Math.max(-1,Math.floor(finite(player.accessoryIndex,-1)));
  player.hairColor=normalizeWardrobeHexV38(player.hairColor,WARDROBE_V38_PLAYER_DEFAULT.hairColor);
  player.eyeColor=normalizeWardrobeHexV38(player.eyeColor,WARDROBE_V38_PLAYER_DEFAULT.eyeColor);
  player.shirtColor=normalizeWardrobeHexV38(player.shirtColor,WARDROBE_V38_PLAYER_DEFAULT.shirtColor);
  player.pantsColor=normalizeWardrobeHexV38(player.pantsColor,WARDROBE_V38_PLAYER_DEFAULT.pantsColor);
  for(const key of ["hat","shirt","pants","boots"]) player[key]=typeof player[key]==="string"?player[key]:"";
  const animal=(value,pet=false)=>{
    const v=value&&typeof value==="object"?value:{};
    const out={...v,hat:typeof v.hat==="string"?v.hat:""};
    if(pet) out.variant=Math.max(0,Math.min(5,Math.floor(finite(v.variant,0))));
    return out;
  };
  return {...base,wardrobeSchemaVersion:38,wardrobeV30:{...old,player,horse:animal(old.horse),cat:animal(old.cat,true),dog:animal(old.dog,true)}};
}
'''
if 'normalizeWardrobeProgressV38' not in s:
    if marker not in s: raise SystemExit('Farmer preview marker not found')
    s=s.replace(marker,helper+'\n'+marker,1)

old_effect = '''  useEffect(()=>{\n    const api=window.SDVFarmerSpriteV33;\n    if(!api?.draw||!ref.current)return;\n    api.draw(ref.current,{\n      gender:player.gender||"female",direction,\n      selected:{hat:player.hat||"",shirt:player.shirt||"",pants:player.pants||"",boots:player.boots||""},\n      shirtColor:player.shirtColor,pantsColor:player.pantsColor,\n      hairColor:player.hairColor,hairIndex:player.hairIndex,\n      skinIndex:player.skinIndex,eyeColor:player.eyeColor,accessoryIndex:player.accessoryIndex,\n      shirtDyeable,pantsDyeable\n    }).catch(e=>console.warn("farmer sprite preview failed",e));\n  },[player.gender,player.hat,player.shirt,player.pants,player.boots,player.shirtColor,player.pantsColor,player.hairColor,player.hairIndex,player.skinIndex,player.eyeColor,player.accessoryIndex,direction,shirtDyeable,pantsDyeable]);'''
new_effect = '''  useEffect(()=>{\n    const api=window.SDVFarmerSpriteV33;\n    if(!api?.draw||!ref.current)return;\n    const safe={...WARDROBE_V38_PLAYER_DEFAULT,...(player||{})};\n    const opts={\n      gender:safe.gender==="male"?"male":"female",direction,\n      selected:{hat:typeof safe.hat==="string"?safe.hat:"",shirt:typeof safe.shirt==="string"?safe.shirt:"",pants:typeof safe.pants==="string"?safe.pants:"",boots:typeof safe.boots==="string"?safe.boots:""},\n      shirtColor:normalizeWardrobeHexV38(safe.shirtColor,WARDROBE_V38_PLAYER_DEFAULT.shirtColor),pantsColor:normalizeWardrobeHexV38(safe.pantsColor,WARDROBE_V38_PLAYER_DEFAULT.pantsColor),\n      hairColor:normalizeWardrobeHexV38(safe.hairColor,WARDROBE_V38_PLAYER_DEFAULT.hairColor),hairIndex:Number.isFinite(Number(safe.hairIndex))?Number(safe.hairIndex):0,\n      skinIndex:Number.isFinite(Number(safe.skinIndex))?Number(safe.skinIndex):0,eyeColor:normalizeWardrobeHexV38(safe.eyeColor,WARDROBE_V38_PLAYER_DEFAULT.eyeColor),accessoryIndex:Number.isFinite(Number(safe.accessoryIndex))?Number(safe.accessoryIndex):-1,\n      shirtDyeable,pantsDyeable\n    };\n    api.draw(ref.current,opts).catch(e=>{\n      console.warn("farmer sprite preview failed; retrying safe base",e);\n      if(!ref.current)return;\n      api.draw(ref.current,{...opts,selected:{hat:"",shirt:"",pants:"",boots:""},accessoryIndex:-1}).catch(err=>console.warn("farmer safe fallback failed",err));\n    });\n  },[player?.gender,player?.hat,player?.shirt,player?.pants,player?.boots,player?.shirtColor,player?.pantsColor,player?.hairColor,player?.hairIndex,player?.skinIndex,player?.eyeColor,player?.accessoryIndex,direction,shirtDyeable,pantsDyeable]);'''
if old_effect in s:
    s=s.replace(old_effect,new_effect,1)
elif 'retrying safe base' not in s:
    raise SystemExit('Farmer preview effect block not found')

old_load='try { setData({ ...PREFILL, ...JSON.parse(raw) }); }'
new_load='try { setData(normalizeWardrobeProgressV38({ ...PREFILL, ...JSON.parse(raw) })); }'
if old_load in s:
    s=s.replace(old_load,new_load,1)
elif new_load not in s:
    raise SystemExit('Load migration target not found')

s=s.replace('v37：白天／夜晚仍使用遊戲 daybg／nightbg，但只顯示畫面內部、不露素材木框；角色外觀補上法師地下室可調的膚色、眼色、髮色 RGB 與配飾；衣物改成篩選＋分頁瀏覽。','v38：修正舊版衣櫥紀錄升級後人物消失；舊資料會自動補齊外觀欄位，服飾圖層異常時也不再讓整個人物預覽空白。')
app.write_text(s,encoding='utf-8')

fp=Path('farmer-preview-v33.js')
f=fp.read_text(encoding='utf-8')
start=f.index('  function drawCrop(ctx,img,sx,sy,sw,sh,dx,dy,flip,tint){')
end=f.index('\n\n  function paletteRows(img){',start)
safe_crop=r'''  function drawCrop(ctx,img,sx,sy,sw,sh,dx,dy,flip,tint){
    if(!img)return false;
    sx=Math.floor(Number(sx));sy=Math.floor(Number(sy));sw=Math.floor(Number(sw));sh=Math.floor(Number(sh));
    dx=Number(dx);dy=Number(dy);
    if(![sx,sy,sw,sh,dx,dy].every(Number.isFinite)||sw<=0||sh<=0)return false;
    if(sx<0){const cut=-sx;sx=0;sw-=cut;dx+=cut;}
    if(sy<0){const cut=-sy;sy=0;sh-=cut;dy+=cut;}
    sw=Math.min(sw,Math.max(0,img.width-sx));
    sh=Math.min(sh,Math.max(0,img.height-sy));
    if(sw<=0||sh<=0||sx>=img.width||sy>=img.height)return false;
    try{
      const temp=document.createElement('canvas');temp.width=sw;temp.height=sh;
      const t=temp.getContext('2d');if(!t)return false;
      t.imageSmoothingEnabled=false;t.clearRect(0,0,sw,sh);t.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);
      if(tint){
        t.globalCompositeOperation='multiply';t.fillStyle=tint;t.fillRect(0,0,sw,sh);
        t.globalCompositeOperation='destination-in';t.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);t.globalCompositeOperation='source-over';
      }
      ctx.save();ctx.imageSmoothingEnabled=false;
      if(flip){ctx.translate(dx+sw,dy);ctx.scale(-1,1);ctx.drawImage(temp,0,0);}else ctx.drawImage(temp,dx,dy);
      ctx.restore();return true;
    }catch(error){
      console.warn('wardrobe layer skipped',error,{sx,sy,sw,sh});
      return false;
    }
  }'''
f=f[:start]+safe_crop+f[end:]

old='const dressedBody=recolorBody(body,skinColors,shoeColors,gender,Number(opts?.skinIndex)||0,opts?.eyeColor,selected.boots);'
new='let dressedBody=body;\n    try{dressedBody=recolorBody(body,skinColors,shoeColors,gender,Number(opts?.skinIndex)||0,opts?.eyeColor,selected.boots);}catch(error){console.warn("farmer recolor fallback",error);}'
if old in f:
    f=f.replace(old,new,1)
elif 'farmer recolor fallback' not in f:
    raise SystemExit('recolorBody call not found')

fp.write_text(f,encoding='utf-8')

idx=Path('index.html')
i=idx.read_text(encoding='utf-8').replace('?v=37','?v=38').replace('deploy-v37','deploy-v38')
idx.write_text(i,encoding='utf-8')

sw=Path('sw.js')
w=sw.read_text(encoding='utf-8').replace("stardew-tracker-v37","stardew-tracker-v38")
sw.write_text(w,encoding='utf-8')
