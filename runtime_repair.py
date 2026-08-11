from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
old='''    const pondProducts=(fish,count)=>{\n      if(!fish)return [];\n      const defs=pondProductMap[fish]||[[1,"Roe","魚籽"]];\n      return defs.filter(([min])=>Number(count||0)>=min);\n    };'''
new='''    const pondProducts=(fish)=>{\n      if(!fish)return [];\n      return pondProductMap[fish]||[[1,"Roe","魚籽"]];\n    };'''
if old not in s:
    raise SystemExit('pondProducts marker missing')
s=s.replace(old,new,1)
old2='''                <div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap"}}>{products.slice(0,4).map(([min,file,label])=><span key={`${file}-${min}`} title={label}><GameIcon file={file} size={18} alt={label}/></span>)}</div>\n                <div style={{fontSize:6.8,color:C.muted,fontWeight:800,lineHeight:1.05,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{products.length?products.map(x=>x[2]).join("／"):"尚無產出"}</div>'''
new2='''                <div style={{display:"flex",justifyContent:"center",gap:3,flexWrap:"wrap"}}>{products.slice(0,4).map(([min,file,label])=>{const unlocked=Number(p.count||0)>=min;return <span key={`${file}-${min}`} title={unlocked?label:`${label}・需 ${min} 隻`} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",filter:unlocked?"none":"grayscale(1)",opacity:unlocked?1:.28}}><GameIcon file={file} size={18} alt={label}/>{!unlocked&&<span style={{fontSize:5.8,fontWeight:950,color:C.muted,lineHeight:1}}>需{min}</span>}</span>})}</div>\n                <div style={{fontSize:6.8,color:C.muted,fontWeight:800,lineHeight:1.05,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{products.length?products.map(([min,,label])=>Number(p.count||0)>=min?label:`${label}(需${min})`).join("／"):"尚無產出"}</div>'''
if old2 not in s:
    raise SystemExit('pond product rendering marker missing')
s=s.replace(old2,new2,1)
p.write_text(s,encoding='utf-8')
print('locked pond products now stay visible in gray')
