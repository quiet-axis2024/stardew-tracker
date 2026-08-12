from pathlib import Path


def rep(text, old, new, label):
    n=text.count(old)
    if n!=1:
        raise SystemExit(f'{label}: expected 1 occurrence, got {n}')
    return text.replace(old,new,1)

p=Path('app.jsx')
s=p.read_text()

s=rep(s,
'''    const itemCurrentSeasonV49=it=>{if(!it)return false;if(Array.isArray(it.seasons)&&it.seasons.includes(data.base.season))return true;if(it.fishIndex!==undefined){const r=fishRuleV4(it.fishIndex);return (r?.s||[]).includes(data.base.season);}return false;};
    const buffStatZhV49={Farming:"耕種",Fishing:"釣魚",Foraging:"採集",Mining:"採礦",Luck:"運氣",Speed:"速度",Defense:"防禦",Attack:"攻擊",Magnetism:"磁力",MaxStamina:"最大體力",Combat:"戰鬥"};''',
'''    const itemFarmKindV49=it=>["crop","seed","fruit","sapling"].includes(it?.farmingKind);
    const itemCurrentSeasonV49=it=>{if(!it)return false;if(itemFarmKindV49(it)&&Array.isArray(it.seasons)&&it.seasons.includes(data.base.season))return true;if(it.fishIndex!==undefined){const r=fishRuleV4(it.fishIndex);return (r?.s||[]).includes(data.base.season);}return false;};
    const seasonLabelV49=s=>s==="ginger island"?"薑島全年":s;
    const itemSeasonTextV49=it=>(it?.seasons||[]).length===4?"四季":((it?.seasons||[]).map(seasonLabelV49).join("／"));
    const itemSeasonTitleV49=it=>it?.fishIndex!==undefined?"出現季節":itemFarmKindV49(it)?"耕種季節":"出現季節";
    const itemSeasonIconV49=it=>it?.fishIndex!==undefined?"🐟":itemFarmKindV49(it)?"🌱":"🍃";
    const buffStatZhV49={Farming:"耕種",Fishing:"釣魚",Foraging:"採集",Mining:"採礦",Luck:"運氣",Speed:"速度",Defense:"防禦",Attack:"攻擊",Magnetism:"磁力",MaxStamina:"最大體力","Max Energy":"最大體力",Combat:"戰鬥",Immunity:"免疫",CritChance:"暴擊率"};''',
'current-season precision')

s=rep(s,
'''          {selected.seasons?.length>0&&<div style={{fontSize:9.5,color:C.ink,lineHeight:1.35}}>🌱 <b>季節：</b>{selected.seasons.length===4?"四季":selected.seasons.join("／")}{itemCurrentSeasonV49(selected)&&<span style={{marginLeft:5,color:C.green,fontWeight:950}}>● 當季</span>}{selected.growDays?` · 成熟 ${selected.growDays} 天`:""}{selected.regrowDays?` · 再生 ${selected.regrowDays} 天`:""}</div>}''',
'''          {selected.seasons?.length>0&&<div style={{fontSize:9.5,color:C.ink,lineHeight:1.35}}>{itemSeasonIconV49(selected)} <b>{itemSeasonTitleV49(selected)}：</b>{itemSeasonTextV49(selected)}{itemCurrentSeasonV49(selected)&&<span style={{marginLeft:5,color:C.green,fontWeight:950}}>● 當季</span>}{itemFarmKindV49(selected)&&selected.growDays?` · 成熟 ${selected.growDays} 天`:""}{itemFarmKindV49(selected)&&selected.regrowDays?` · 再生 ${selected.regrowDays} 天`:""}</div>}''',
'season detail labels')

p.write_text(s)

# One item has two vanilla acquisition contexts: summer forage and fall crop.
p=Path('lookup-extra-v49.js')
x=p.read_text()
old='"Grape":{"kind":"forage","energy":38,"health":17,"poison":false,"seasons":["夏"],"growDays":10,"regrowDays":3}'
new='"Grape":{"kind":"crop","energy":38,"health":17,"poison":false,"seasons":["夏","秋"],"growDays":10,"regrowDays":3}'
if x.count(old)!=1:
    raise SystemExit(f'grape metadata: expected 1 occurrence, got {x.count(old)}')
x=x.replace(old,new,1)
p.write_text(x)

print('v49 polish complete')
