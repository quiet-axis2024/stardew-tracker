from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

old='''    const pondableFishV55=COLLECTIONS.fish.items.map((name,fi)=>({name,fi,file:FISH_ICON_FILES[fi]||itemFileZhV26(name)})).filter(x=>x.file&&!POND_NON_PONDABLE_V55.has(x.file));'''
new='''    const pondableBaseV55=COLLECTIONS.fish.items.map((name,fi)=>({name,fi,file:FISH_ICON_FILES[fi]||itemFileZhV26(name)})).filter(x=>x.file&&!POND_NON_PONDABLE_V55.has(x.file));
    const pondExtraV55=[
      {name:"珊瑚",fi:null,file:"Coral"},{name:"海胆",fi:null,file:"Sea Urchin"},
      {name:"绯红鱼之子",fi:null,file:"Son of Crimsonfish"},{name:"雌鮟鱇鱼",fi:null,file:"Ms. Angler"},{name:"传说之鱼二代",fi:null,file:"Legend II"},{name:"小冰川鱼",fi:null,file:"Glacierfish Jr."},{name:"放射性鲤鱼",fi:null,file:"Radioactive Carp"}
    ];
    const pondableFishV55=[...pondableBaseV55,...pondExtraV55];'''
if old not in s: raise RuntimeError('pondable fish line missing')
s=s.replace(old,new,1)

old='''<img src={ICON_URLS.fish[x.fi]} alt="" loading="lazy" style={{width:compact?27:31,height:compact?27:31,imageRendering:"pixelated",objectFit:"contain"}}/>'''
new='''{x.fi!=null?<img src={ICON_URLS.fish[x.fi]} alt="" loading="lazy" style={{width:compact?27:31,height:compact?27:31,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file={x.file} size={compact?27:31}/>}'''
if old not in s: raise RuntimeError('pond picker icon line missing')
s=s.replace(old,new,1)

old='''      const source=generic?"通用喜好分类":special?.source||row?((row?.sources||[])[0]||"点击查看详细用途／来源"):"特殊物品／分类";'''
new='''      const source=generic?"通用喜好分类":(special?.source||(row?((row?.sources||[])[0]||"点击查看详细用途／来源"):"特殊物品／分类"));'''
if old not in s: raise RuntimeError('social source precedence line missing')
s=s.replace(old,new,1)

p.write_text(s,encoding='utf-8')
