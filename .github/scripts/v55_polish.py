from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

def rep(a,b,label):
    global s
    if a not in s:
        raise RuntimeError('missing '+label)
    s=s.replace(a,b,1)

rep('''const POND_RARE_V55 = ["Lava Eel","Blobfish","Sturgeon","Super Cucumber","Rainbow Trout","Spook Fish","Ice Pip","Stonefish","Ghostfish","Slimejack","Void Salmon","Stingray"];''','''const POND_RARE_V55 = ["Lava Eel","Blobfish","Sturgeon","Super Cucumber","Rainbow Trout","Spook Fish","Ice Pip","Stonefish","Ghostfish","Slimejack","Void Salmon","Stingray"];
const POND_LEGENDARY_V55 = new Set(["Legend","Crimsonfish","Angler","Glacierfish","Mutant Carp","Legend II","Son of Crimsonfish","Ms. Angler","Glacierfish Jr.","Radioactive Carp"]);''','legendary set')

rep('''const stableMaxV55=Math.max(1,1+Number((d.buildingCounts||{}).cabin||0));''','''const legacyCabinsV55=(d.buildings?.other||[]).includes("連線小屋")?1:0;
      const stableMaxV55=Math.max(1,1+Number((d.buildingCounts||{}).cabin??legacyCabinsV55));''','stable legacy cap')

rep('''{fishIndex>=0?<img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:38,height:38,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file="Fish Pond" size={38}/>}''','''{fishIndex>=0?<img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:38,height:38,imageRendering:"pixelated",objectFit:"contain"}}/>:p.fish?<GameIcon file={pondFishFileV55(p.fish)} size={38}/>:<GameIcon file="Fish Pond" size={38}/>}''','pond selected icon')

rep('''ponds[pondPicker]={...current,fish:x.name};update({ponds});setPondPicker(null);setPondFishQueryV55("")''','''const max=POND_LEGENDARY_V55.has(x.file)?1:10;ponds[pondPicker]={...current,fish:x.name,count:Math.min(max,Number(current.count||0))};update({ponds});setPondPicker(null);setPondFishQueryV55("")''','pond picker legendary clamp')

rep('''count:Math.min(10,Number(p.count||0)+1)''','''count:Math.min(POND_LEGENDARY_V55.has(pondFishFileV55(p.fish))?1:10,Number(p.count||0)+1)''','pond plus legendary cap')

rep('''<div style={{fontSize:6.2,color:C.muted,lineHeight:1.25}}>{meta.obtainZh||"目前不可直接製作／特殊取得"}</div>''','''<div style={{fontSize:6.2,color:C.muted,lineHeight:1.25}}>{meta.sourceZh||meta.obtainZh||"目前不可直接制作／特殊取得"}</div>''','machine special source')

p.write_text(s,encoding='utf-8')
