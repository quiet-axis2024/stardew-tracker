from pathlib import Path
import json, re, urllib.request

DRESS='https://raw.githubusercontent.com/lybell-art/stardew-dressup/15f7be39b9a1de549595df8102bc7e77b406b605/'
DECOMP='https://raw.githubusercontent.com/shayderrr/stardew_decomp/6fcc1d4d20d14c5be6232d0f9eac1d423222fd84/'

def get_json(url):
    with urllib.request.urlopen(url) as r:
        return json.load(r)

def unwrap(path):
    obj=get_json(DECOMP+path)
    return obj.get('content',obj)

def norm(s):
    s=str(s or '').lower().replace('’',"'")
    s=re.sub(r'\s*\((male|female)\)\s*','',s)
    return re.sub(r'[^a-z0-9]+','',s)

def strip_gender_zh(s):
    return re.sub(r'[（(](?:男|女)[）)]','',str(s or '')).strip()

locale=get_json(DRESS+'src/i18n/default.json')
shirt_data=get_json(DRESS+'src/data/shirtData.json')
pants_data=get_json(DRESS+'src/data/pantsData.json')
hat_data=get_json(DRESS+'src/data/hatsData.json')
shirts_en=unwrap('stardew/unpacked/Strings/Shirts.json')
shirts_zh=unwrap('stardew/unpacked/Strings/Shirts.zh-CN.json')
pants_en=unwrap('stardew/unpacked/Strings/Pants.json')
pants_zh=unwrap('stardew/unpacked/Strings/Pants.zh-CN.json')
hats_zh=unwrap('stardew/unpacked/Data/hats.zh-CN.json')
objects_en=unwrap('stardew/unpacked/Strings/Objects.json')
objects_zh=unwrap('stardew/unpacked/Strings/Objects.zh-CN.json')

# English display name -> Chinese display name from the game's own localized strings.
def name_map(en,zh):
    out={}
    for k,v in en.items():
        if not k.endswith('_Name') or k not in zh: continue
        out[norm(v)]=strip_gender_zh(zh[k])
    return out
shirt_names=name_map(shirts_en,shirts_zh)
pants_names=name_map(pants_en,pants_zh)
obj_names=name_map(objects_en,objects_zh)
obj_names.update({norm('Cloth'):'布料'})

SPECIAL={
 'anyegg':'任意蛋','anyfish':'任意魚','anymilk':'任意牛奶／羊奶','anyhoney':'任意蜂蜜','anyflower':'任意花',
 'anyfruit':'任意水果','anyvegetable':'任意蔬菜','anymushroom':'任意蘑菇','anyslimeegg':'任意史萊姆蛋',
 'strangedollgreen':'奇怪的玩偶（綠）','strangedollyellow':'奇怪的玩偶（黃）','anyartifact':'任意古物',
 'anygeode':'任意晶球','anymineral':'任意礦物','anygem':'任意寶石','anywine':'任意果酒','anyjuice':'任意果汁'
}

def tr_item(token):
    raw=token.strip()
    key=norm(raw)
    if key in SPECIAL:return SPECIAL[key]
    if key in obj_names:return obj_names[key]
    return raw

def tr_materials(s):
    # Preserve alternatives and + structure but translate item names where possible.
    parts=re.split(r'(\s*/\s*|\s*\+\s*)',s)
    return ''.join(('／' if '/' in p else '＋') if re.fullmatch(r'\s*[/+]\s*',p) else tr_item(p) for p in parts)

def desc_info(desc):
    desc=str(desc or '').strip()
    lines=[x.strip() for x in desc.splitlines() if x.strip()]
    recipe=''
    rest=[]
    for line in lines:
        m=re.search(r'Tailoring\s*\(Cloth\s*\+\s*(.*?)\)\.?$',line,re.I)
        if m:
            recipe='布料＋'+tr_materials(m.group(1)); continue
        m=re.search(r'Tailoring\s*\(Cloth\)\.?$',line,re.I)
        if m:
            recipe='布料'; continue
        rest.append(line)
    text='；'.join(rest)
    reps=[
      ('Randomly sold at the Oasis.','綠洲商店隨機販售'),('Randomly sold at the Oasis','綠洲商店隨機販售'),
      ("Hat Mouse",'帽子老鼠'),("Adventurer's Guild",'探險家公會'),('Skull Cavern','骷髏洞穴'),
      ('Volcano Dungeon','火山地牢'),('Island Trader','薑島商人'),("Qi's Walnut Room",'齊先生核桃房'),
      ('Treasure Room','寶箱層'),('Tailoring','裁縫'),('Museum','博物館')]
    for a,b in reps:text=text.replace(a,b)
    source=recipe if recipe else text
    if recipe and text: source=recipe+'；'+text
    return recipe,source or desc

# Hat localized names are stored directly in Data/hats.* by numeric index.
def hat_zh_name(i,en_name):
    raw=str(hats_zh.get(str(i),'') or '')
    bits=raw.split('/')
    return bits[-1].strip() if bits and bits[-1].strip() else en_name

hats=[]
# All actual vanilla hat entries from dressup data; keep duplicate names unique internally.
name_count={}
for i in range(len(hat_data)):
    en=locale.get(f'hats.name.{i}',f'Hat {i+1}')
    name_count[en]=name_count.get(en,0)+1
seen={}
for i,meta in enumerate(hat_data):
    en=locale.get(f'hats.name.{i}',f'Hat {i+1}')
    seen[en]=seen.get(en,0)+1
    key=en if name_count[en]==1 else f'{en}@{i}'
    recipe,source=desc_info(locale.get(f'hats.desc.{i}',''))
    hats.append({'key':key,'icon':en,'name':hat_zh_name(i,en),'source':source,'recipe':recipe,'dyeable':False,'index':i})

shirts=[]
for i,meta in enumerate(shirt_data):
    en=locale.get(meta.get('name',''),locale.get(f'shirts.name.{i}',f'Shirt {i+1}'))
    if en=='shirts.name.default' or en=='Shirt': en=f'Shirt {i+1}'
    zh=shirt_names.get(norm(en))
    if not zh: zh=f'上衣 {i+1}' + (f'・{en}' if not en.startswith('Shirt ') else '')
    recipe,source=desc_info(locale.get(f'shirts.desc.{i}',''))
    shirts.append({'key':f'Shirt{i:03d}','icon':f'Shirt{i:03d}','name':zh,'source':source,'recipe':recipe,
        'dyeable':bool(meta.get('dyeable')),'maleSprite':int(meta.get('male',i)),'femaleSprite':int(meta.get('female',i)),'index':i})

pants=[]
for pos,meta in enumerate(pants_data):
    name_key=meta.get('name','')
    en=locale.get(name_key, name_key)
    raw_id=name_key.rsplit('.',1)[-1] if '.' in name_key else str(pos)
    zh=pants_names.get(norm(en)) or ('下裝 '+str(pos+1)+(f'・{en}' if en else ''))
    recipe,source=desc_info(locale.get(f'pants.desc.{raw_id}',locale.get(f'pants.desc.{pos}','')))
    key=en or f'Pants {raw_id}'
    pants.append({'key':key,'icon':key,'name':zh,'source':source,'recipe':recipe,'dyeable':bool(meta.get('dyeable')),
        'prismatic':bool(meta.get('prismatic')),'sheetIndex':int(meta.get('sheetIndex',0)),'index':pos})

payload={'hats':hats,'shirts':shirts,'pants':pants}
js='''/* Generated from pinned Stardew game-localization + Stardew Dressup metadata. */\n(function(){\n  const data='''+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+''';\n  data.byKey={hat:{},shirt:{},pants:{}};\n  for(const x of data.hats)data.byKey.hat[x.key]=x;\n  for(const x of data.shirts)data.byKey.shirt[x.key]=x;\n  for(const x of data.pants)data.byKey.pants[x.key]=x;\n  window.SDVWardrobeV34=data;\n})();\n'''
Path('wardrobe-data-v34.js').write_text(js,encoding='utf-8')

# Update farmer compositor to resolve every generated clothing item, including gender-specific shirt sprite indices.
p=Path('farmer-preview-v33.js')
s=p.read_text(encoding='utf-8')
s=s.replace("    const shirtIdx=parseShirtIndex(selected.shirt);\n    const pantsIdx=PANTS[selected.pants];\n    const hatIdx=HATS[selected.hat];",
"    const db=window.SDVWardrobeV34?.byKey||{};\n    const shirtMeta=db.shirt?.[selected.shirt];\n    const pantsMeta=db.pants?.[selected.pants];\n    const hatMeta=db.hat?.[selected.hat];\n    const shirtIdx=shirtMeta?(gender==='female'?shirtMeta.femaleSprite:shirtMeta.maleSprite):parseShirtIndex(selected.shirt);\n    const pantsIdx=Number.isFinite(pantsMeta?.sheetIndex)?pantsMeta.sheetIndex:PANTS[selected.pants];\n    const hatIdx=Number.isFinite(hatMeta?.index)?hatMeta.index:HATS[selected.hat];")
p.write_text(s,encoding='utf-8')

# Animal hats: use the actual animal frame to locate the head region instead of fixed guessed offsets.
p=Path('animal-preview-v33.js')
s=p.read_text(encoding='utf-8')
start=s.index("  const TYPES={")
end=s.index("  const ROW=",start)
s=s[:start]+"  const TYPES={\n    horse:{src:GAME+'horse.png'},\n    cat:{src:GAME+'cat.png'},\n    dog:{src:GAME+'dog.png'}\n  };\n"+s[end:]
s=s.replace("  function crop(ctx,img,sx,sy,sw,sh,dx,dy){ctx.drawImage(img,sx,sy,sw,sh,dx,dy,sw,sh);}\n",
"  function crop(ctx,img,sx,sy,sw,sh,dx,dy){ctx.drawImage(img,sx,sy,sw,sh,dx,dy,sw,sh);}\n  function headAnchor(img,sy,dir){\n    const c=document.createElement('canvas');c.width=32;c.height=32;const x=c.getContext('2d',{willReadFrequently:true});\n    x.drawImage(img,0,sy,32,32,0,0,32,32);const d=x.getImageData(0,0,32,32).data;let xs=[],minY=32;\n    for(let yy=0;yy<22;yy++)for(let xx=0;xx<32;xx++){\n      if(dir==='right'&&xx<15)continue;if(dir==='left'&&xx>17)continue;if((dir==='front'||dir==='back')&&(xx<5||xx>27))continue;\n      if(d[(yy*32+xx)*4+3]>40){xs.push(xx);if(yy<minY)minY=yy;}\n    }\n    if(!xs.length)return dir==='right'?[16,5]:dir==='left'?[4,5]:[10,4];\n    xs.sort((a,b)=>a-b);const center=xs[Math.floor(xs.length/2)];\n    return [Math.max(0,Math.min(20,Math.round(4+center-10))),Math.max(2,Math.min(10,Math.round(6+minY-2)))];\n  }\n")
s=s.replace("    const hatIndex=window.SDVFarmerSpriteV33?.HATS?.[opts?.hat];",
"    const hatIndex=window.SDVWardrobeV34?.byKey?.hat?.[opts?.hat]?.index ?? window.SDVFarmerSpriteV33?.HATS?.[opts?.hat];")
s=s.replace("      const hy=Math.floor(hatIndex/12)*80+type.hatY[dir];\n      const [x,y]=type.hatPos[dir];\n      crop(ctx,hats,hx,hy,20,20,x,y);",
"      const hatY={front:0,right:20,back:60,left:40}[dir];\n      const hy=Math.floor(hatIndex/12)*80+hatY;\n      const [x,y]=headAnchor(animal,sy,dir);\n      crop(ctx,hats,hx,hy,20,20,x,y);")
p.write_text(s,encoding='utf-8')

# Replace wardrobe screen wholesale so it behaves as an outfit builder, not a tiny item list.
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
if 'wardrobeQueryV34' not in s:
    s=s.replace('  const [wardrobeDirectionV32, setWardrobeDirectionV32] = useState("front");',
                '  const [wardrobeDirectionV32, setWardrobeDirectionV32] = useState("front");\n  const [wardrobeQueryV34, setWardrobeQueryV34] = useState("");')
start=s.index('  const renderWardrobeV30 = () => {')
end=s.index('\n\n  const renderNotes = () => <div>',start)
new_func=r'''  const renderWardrobeV30 = () => {
    const defaults={
      player:{hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99",gender:"female",hairIndex:0,hairColor:"#6a402c"},
      horse:{hat:""},cat:{hat:""},dog:{hat:""}
    };
    const stored=data.wardrobeV30||{};
    const wardrobe={...defaults,...stored,
      player:{...defaults.player,...(stored.player||{})},horse:{...defaults.horse,...(stored.horse||{})},cat:{...defaults.cat,...(stored.cat||{})},dog:{...defaults.dog,...(stored.dog||{})}};
    const target={...(defaults[wardrobeTargetV30]||{}),...(wardrobe[wardrobeTargetV30]||{})};
    const setTarget=patch=>update({wardrobeV30:{...wardrobe,[wardrobeTargetV30]:{...target,...patch}}});
    const setPlayer=patch=>update({wardrobeV30:{...wardrobe,player:{...wardrobe.player,...patch}}});
    const db=window.SDVWardrobeV34||{};
    const wrap=arr=>(arr||[]).map(x=>[x.key,x.name,x.source,x.dyeable,x]);
    const hatsFull=wrap(db.hats); const shirtsFull=wrap(db.shirts); const pantsFull=wrap(db.pants);
    const bootsFull=BOOTS_V30.map(x=>[...x,false,{key:x[0],icon:x[0],name:x[1],source:x[2],recipe:"",dyeable:false}]);
    const cats={hat:hatsFull.length?hatsFull:HATS_V30,shirt:shirtsFull.length?shirtsFull:SHIRTS_V30,pants:pantsFull.length?pantsFull:PANTS_V30,boots:bootsFull};
    const rawList=wardrobeTargetV30==="player"?cats[wardrobeCategoryV30]:cats.hat;
    const q=wardrobeQueryV34.trim().toLowerCase();
    const list=q?rawList.filter(it=>`${it[1]} ${it[2]} ${it[0]}`.toLowerCase().includes(q)):rawList;
    const slot=wardrobeTargetV30==="player"?wardrobeCategoryV30:"hat";
    const chosen=target[slot]||"";
    const targets=[["player","玩家","Inventory Tab"],["horse","馬","Horse"],["cat","貓","Cat 1"],["dog","狗","Dog 1"]];
    const directions=[["front","正面"],["right","右側"],["back","背面"],["left","左側"]];
    const player=wardrobe.player;
    const findMeta=(kind,key)=>kind&&key?(cats[kind]||[]).find(x=>x[0]===key):null;
    const slotDefs=[["hat","帽子","Cowboy Hat"],["shirt","上衣","Shirt003"],["pants","下裝","Farmer Pants"],["boots","鞋","Space Boots"]];
    const currentTargetLabel=targets.find(x=>x[0]===wardrobeTargetV30)?.[1]||"玩家";
    const hatMeta=findMeta("hat",player.hat),shirtMeta=findMeta("shirt",player.shirt),pantsMeta=findMeta("pants",player.pants),bootsMeta=findMeta("boots",player.boots);
    const shirtDyeable=Boolean(shirtMeta?.[3]),pantsDyeable=Boolean(pantsMeta?.[3]);
    const shirtColor=player.shirtColor||defaults.player.shirtColor,pantsColor=player.pantsColor||defaults.player.pantsColor;
    const hexRgb=hex=>{const m=String(hex||"").match(/^#([0-9a-f]{6})$/i);if(!m)return[0,0,0];const n=parseInt(m[1],16);return[(n>>16)&255,(n>>8)&255,n&255]};
    const rgbHex=rgb=>`#${rgb.map(v=>Math.max(0,Math.min(255,Number(v)||0)).toString(16).padStart(2,"0")).join("")}`;
    const rgbEditor=(kind,color,enabled)=>{const rgb=hexRgb(color);const set=(i,v)=>{const next=[...rgb];next[i]=Math.max(0,Math.min(255,Number(v)||0));setPlayer({[kind+"Color"]:rgbHex(next)})};return <div style={{display:"grid",gridTemplateColumns:"42px repeat(3,1fr)",gap:4,alignItems:"center",opacity:enabled?1:.42}}><input type="color" disabled={!enabled} value={color} onChange={e=>setPlayer({[kind+"Color"]:e.target.value})} style={{width:40,height:31,border:0,padding:0,background:"transparent"}}/>{rgb.map((v,i)=><input key={i} type="number" min="0" max="255" disabled={!enabled} value={v} onChange={e=>set(i,e.target.value)} style={{width:"100%",border:`1px solid ${C.line}`,borderRadius:6,padding:"5px 2px",fontSize:8.5,textAlign:"center",background:C.cream,color:C.ink}}/>)}</div>};
    const preview=(dir,large=false)=>wardrobeTargetV30==="player"?<FarmerSpritePreviewV33 player={player} direction={dir} large={large} shirtDyeable={shirtDyeable} pantsDyeable={pantsDyeable}/>:<AnimalSpritePreviewV33 type={wardrobeTargetV30} hat={target.hat||""} direction={dir} large={large}/>;
    const summaryRow=(label,meta,color)=>{if(!meta)return <div style={{display:"grid",gridTemplateColumns:"42px 1fr",gap:6,padding:"5px 0",borderBottom:`1px dashed ${C.line}`}}><b style={{fontSize:9,color:C.brown}}>{label}</b><span style={{fontSize:9,color:C.muted}}>未選</span></div>;const m=meta[4]||{};return <div style={{display:"grid",gridTemplateColumns:"42px 1fr",gap:6,padding:"5px 0",borderBottom:`1px dashed ${C.line}`}}><b style={{fontSize:9,color:C.brown}}>{label}</b><div><div style={{fontSize:9.5,fontWeight:950,color:C.ink}}>{meta[1]}</div><div style={{fontSize:8,color:C.muted,lineHeight:1.35,marginTop:2}}>{m.recipe?`製作：${m.recipe}`:(meta[2]||"取得方式待補")}</div>{m.recipe&&meta[2]&&meta[2]!==m.recipe&&<div style={{fontSize:7.5,color:C.muted,lineHeight:1.3,marginTop:1}}>{meta[2]}</div>}{color&&<div style={{fontSize:8,color:C.blue,fontWeight:900,marginTop:2}}>染色 RGB：{hexRgb(color).join(" / ")} ・ {color.toUpperCase()}</div>}</div></div>};

    return <div>
      <SectionTitle icon="🎩">衣櫥搭配</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,color:C.muted,lineHeight:1.45}}>v34：拿來自己配穿搭。帽子／上衣／下裝改成完整遊戲清單；選完直接看角色成品，下面同時列出裁縫材料與染色 RGB。馬、貓、狗帽子位置也改成依遊戲角色幀自動抓頭部，不再固定猜座標。</div></Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{targets.map(([id,name,file])=>{const on=wardrobeTargetV30===id;return <button key={id} onClick={()=>{setWardrobeTargetV30(id);setWardrobeQueryV34("");if(id!=="player")setWardrobeCategoryV30("hat")}} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:9,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}>{id==="player"?(data.profilePortrait?<img src={data.profilePortrait} alt="" style={{width:27,height:34,objectFit:"cover",borderRadius:4,imageRendering:"pixelated"}}/>:<GameIcon file="Inventory Tab" size={27}/>):<GameIcon file={file} size={27}/>}<div>{name}</div></button>})}</div>

      <Card style={{marginTop:7,padding:8}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:4}}>{directions.map(([id])=><button key={id} onClick={()=>setWardrobeDirectionV32(id)} style={{border:`1.5px solid ${wardrobeDirectionV32===id?C.orange:C.line}`,background:wardrobeDirectionV32===id?"#FFF0D2":C.paper,borderRadius:8,padding:3,minWidth:0}}>{preview(id,false)}</button>)}</div>
        <div style={{marginTop:7}}>{preview(wardrobeDirectionV32,true)}</div>
      </Card>

      {wardrobeTargetV30==="player"&&<>
        <Card style={{marginTop:7,padding:8,background:"#FFF8E9"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:4}}><b style={{fontSize:10,color:C.brown}}>我的搭配清單</b><span style={{fontSize:8,color:C.muted}}>髮型 {Number(player.hairIndex||0)+1} 號</span></div>
          {summaryRow("帽子",hatMeta)}{summaryRow("上衣",shirtMeta,shirtDyeable?shirtColor:null)}{summaryRow("下裝",pantsMeta,pantsDyeable?pantsColor:null)}{summaryRow("鞋",bootsMeta)}
        </Card>
        <Card style={{marginTop:7,padding:8}}>
          <div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:6}}>角色外觀</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><button onClick={()=>setPlayer({gender:"female"})} style={{border:`1.5px solid ${player.gender!=="male"?C.orange:C.line}`,background:player.gender!=="male"?"#FFF0D2":C.paper,borderRadius:8,padding:6,fontSize:9,fontWeight:950,color:C.brown}}>女性體型</button><button onClick={()=>setPlayer({gender:"male"})} style={{border:`1.5px solid ${player.gender==="male"?C.orange:C.line}`,background:player.gender==="male"?"#FFF0D2":C.paper,borderRadius:8,padding:6,fontSize:9,fontWeight:950,color:C.brown}}>男性體型</button></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"center",marginTop:8}}><label style={{fontSize:8.5,color:C.muted}}><b style={{color:C.ink}}>髮型 {Number(player.hairIndex||0)+1}</b><input type="range" min="0" max="55" value={Number(player.hairIndex||0)} onChange={e=>setPlayer({hairIndex:Number(e.target.value)})} style={{width:"100%",marginTop:4}}/></label><label style={{fontSize:8.5,color:C.muted,textAlign:"center"}}><input type="color" value={player.hairColor||defaults.player.hairColor} onChange={e=>setPlayer({hairColor:e.target.value})} style={{width:42,height:32,border:0,background:"transparent",padding:0}}/><div>髮色</div></label></div>
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{slotDefs.map(([id,name,file])=>{const on=wardrobeCategoryV30===id;const selected=player[id];const sm=findMeta(id,selected);return <button key={id} onClick={()=>{setWardrobeCategoryV30(id);setWardrobeQueryV34("")}} style={{border:`1.5px solid ${on?C.orange:selected?C.green:C.line}`,background:on?"#FFE2A8":selected?"#EEF7DD":C.paper,borderRadius:8,padding:"5px 2px",fontSize:8.5,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file={sm?.[4]?.icon||selected||file} size={25}/><div>{name}</div></button>})}</div>
        {(shirtDyeable||pantsDyeable)&&<Card style={{marginTop:7,padding:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown,marginBottom:6}}>染色數值</div><div style={{fontSize:7.5,color:C.muted,marginBottom:5}}>左邊挑色；右邊三格依序是 R / G / B（0–255），可直接輸入攻略數值。</div><div style={{display:"grid",gridTemplateColumns:"1fr",gap:7}}><div><b style={{fontSize:8.5,color:shirtDyeable?C.ink:C.muted}}>上衣</b>{rgbEditor("shirt",shirtColor,shirtDyeable)}</div><div><b style={{fontSize:8.5,color:pantsDyeable?C.ink:C.muted}}>下裝</b>{rgbEditor("pants",pantsColor,pantsDyeable)}</div></div></Card>}
      </>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,marginTop:8}}><div style={{fontSize:9.5,fontWeight:950,color:C.brown}}>{wardrobeTargetV30==="player"?slotDefs.find(x=>x[0]===slot)?.[1]:`${currentTargetLabel}帽子`}・{rawList.length} 項</div>{chosen&&<button onClick={()=>setTarget({[slot]:""})} style={{border:`1px solid ${C.line}`,background:C.cream,borderRadius:7,padding:"4px 7px",fontSize:8.5,fontWeight:900,color:C.red}}>清除</button>}</div>
      <input value={wardrobeQueryV34} onChange={e=>setWardrobeQueryV34(e.target.value)} placeholder={`搜尋${wardrobeTargetV30==="player"?(slotDefs.find(x=>x[0]===slot)?.[1]||""):"帽子"}名稱或材料…`} style={{width:"100%",marginTop:6,border:`1.5px solid ${C.line}`,background:C.paper,borderRadius:9,padding:"8px 10px",fontSize:10,color:C.ink,outline:"none"}}/>
      {q&&<div style={{fontSize:8,color:C.muted,marginTop:3}}>找到 {list.length} 項</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:6}}>{list.map(it=>{const [key,name,source,dye,meta]=it;const on=chosen===key;return <button key={key} onClick={()=>setTarget({[slot]:on?"":key})} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"5px 3px",minHeight:104,textAlign:"center",cursor:"pointer",minWidth:0}}><GameIcon file={meta?.icon||key} size={36}/><div style={{fontSize:8.2,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.08,marginTop:2}}>{name}</div><div style={{fontSize:6.7,color:C.muted,lineHeight:1.22,marginTop:3,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{meta?.recipe?`製作：${meta.recipe}`:source}</div>{dye&&<div style={{fontSize:6.5,color:C.blue,fontWeight:900,marginTop:2}}>可染色</div>}</button>})}</div>
    </div>;
  };'''
s=s[:start]+new_func+s[end:]
p.write_text(s,encoding='utf-8')

# PWA boot ordering/version. Data must load before sprite compositors and React app.
p=Path('index.html');s=p.read_text(encoding='utf-8')
s=s.replace('./cloud.js?v=33','./cloud.js?v=34')
s=s.replace('  <script src="./farmer-preview-v33.js?v=33"></script>','  <script src="./wardrobe-data-v34.js?v=34"></script>\n  <script src="./farmer-preview-v33.js?v=34"></script>')
s=s.replace('./animal-preview-v33.js?v=33','./animal-preview-v33.js?v=34').replace("'./app.js?v=33'","'./app.js?v=34'")
s=s.replace('<!-- deploy-v33 -->','<!-- deploy-v34 -->')
p.write_text(s,encoding='utf-8')

p=Path('sw.js');s=p.read_text(encoding='utf-8')
s=s.replace("stardew-tracker-v33","stardew-tracker-v34")
s=s.replace("'./farmer-preview-v33.js','./animal-preview-v33.js'","'./wardrobe-data-v34.js','./farmer-preview-v33.js','./animal-preview-v33.js'")
p.write_text(s,encoding='utf-8')
