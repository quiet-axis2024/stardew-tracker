from pathlib import Path

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# Fish-pond products: show only products unlocked by the pond's current population.
marker='    const machineDefs=['
pond_defs=r'''    const pondProductMap={
      "大海參":[[1,"Purple Roe","魚籽"],[9,"Iridium Ore","銥礦"],[9,"Amethyst","紫水晶"]],
      "幽靈魚":[[1,"White Roe","魚籽"],[3,"Quartz","石英"],[9,"White Algae","白藻"],[9,"Refined Quartz","精煉石英"],[9,"Pale Broth","清湯"]],
      "鱘魚":[[1,"Sturgeon Roe","鱘魚籽"]],
      "水滴魚":[[1,"Beige Roe","魚籽"],[9,"Pearl","珍珠"],[9,"Warp Totem Farm","農場圖騰"]]
    };
    const pondProducts=(fish,count)=>{
      if(!fish)return [];
      const defs=pondProductMap[fish]||[[1,"Roe","魚籽"]];
      return defs.filter(([min])=>Number(count||0)>=min);
    };
'''
if 'const pondProductMap={' not in s:
    if marker not in s: raise SystemExit('machine marker missing')
    s=s.replace(marker,pond_defs+marker,1)

# Replace the entire Fish Pond subpage. No quest/expansion-requirement bookkeeping.
start=s.index('      {farmSection==="ponds"&&<>')
end=s.index('      {farmSection==="buildings"&&<>',start)
new_ponds=r'''      {farmSection==="ponds"&&<>
        <SectionTitle icon="🐟" right={`${(data.ponds||[]).length} 座`}>魚塘</SectionTitle>
        <Card style={{padding:8}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6}}>{(data.ponds||[]).map((p,i)=>{
            const fishIndex=COLLECTIONS.fish.items.indexOf(p.fish), open=pondPicker===i, products=pondProducts(p.fish,p.count);
            return <div key={i} style={{border:`1.5px solid ${open?C.orange:C.line}`,background:open?"#FFF5D8":C.paper,borderRadius:10,padding:"6px 3px 5px",textAlign:"center",minWidth:0}}>
              <button onClick={()=>setPondPicker(open?null:i)} style={{border:0,background:"transparent",padding:0,width:"100%",cursor:"pointer",minWidth:0}}>
                {fishIndex>=0?<img src={ICON_URLS.fish[fishIndex]} alt="" style={{width:38,height:38,imageRendering:"pixelated",objectFit:"contain"}}/>:<GameIcon file="Fish Pond" size={38}/>} 
                <div style={{fontSize:9,fontWeight:950,color:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:1}}>{p.fish||"未選魚種"}</div>
              </button>
              <div style={{marginTop:3,minHeight:28}}>
                <div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap"}}>{products.slice(0,4).map(([min,file,label])=><span key={`${file}-${min}`} title={label}><GameIcon file={file} size={18} alt={label}/></span>)}</div>
                <div style={{fontSize:6.8,color:C.muted,fontWeight:800,lineHeight:1.05,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{products.length?products.map(x=>x[2]).join("／"):"尚無產出"}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"22px 1fr 22px",alignItems:"center",gap:2,marginTop:4}}>
                <button onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,count:Math.max(0,Number(p.count||0)-1)};update({ponds})}} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>−</button>
                <b style={{fontSize:10.5,color:Number(p.count||0)>0?C.green:C.muted}}>{Number(p.count||0)}</b>
                <button onClick={()=>{const ponds=[...data.ponds];ponds[i]={...p,count:Math.min(10,Number(p.count||0)+1)};update({ponds})}} style={{border:0,background:C.cream,borderRadius:6,height:21,padding:0,fontWeight:950,color:C.brown}}>＋</button>
              </div>
              <div style={{fontSize:7.2,color:open?C.orange:C.muted,fontWeight:900,marginTop:3}}>{open?"▲ 收起魚種":"點魚圖換魚"}</div>
            </div>;
          })}</div>
        </Card>
        {pondPicker!=null&&data.ponds?.[pondPicker]&&<Card style={{padding:8,marginTop:7,background:"#FFF8E2"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><b style={{fontSize:10.5,color:C.brown,flex:1}}>第 {pondPicker+1} 座魚塘｜選魚</b><button onClick={()=>setPondPicker(null)} style={{border:0,background:"transparent",color:C.brown,fontSize:12,fontWeight:950}}>完成</button></div>
          <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:5,WebkitOverflowScrolling:"touch"}}>{COLLECTIONS.fish.items.map((name,fi)=>{const p=data.ponds[pondPicker],on=name===p.fish;return <button key={`${pondPicker}-${name}`} onClick={()=>{const ponds=[...data.ponds];ponds[pondPicker]={...p,fish:name};update({ponds})}} style={{flex:"0 0 58px",border:`1.5px solid ${on?C.green:C.line}`,background:on?C.lightGreen:C.paper,borderRadius:8,padding:"4px 2px",minHeight:58,cursor:"pointer"}}><img src={ICON_URLS.fish[fi]} alt="" loading="lazy" style={{width:28,height:28,imageRendering:"pixelated",objectFit:"contain"}}/><div style={{fontSize:7.5,fontWeight:900,color:C.ink,lineHeight:1.05}}>{name}</div></button>})}</div>
          <button onClick={()=>{const ponds=data.ponds.filter((_,j)=>j!==pondPicker);setPondPicker(null);update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}})}} style={{marginTop:5,border:0,background:"transparent",color:C.red,fontSize:9.5,fontWeight:900,padding:0}}>刪除這座魚塘</button>
        </Card>}
        <button onClick={()=>{const i=(data.ponds||[]).length;const ponds=[...(data.ponds||[]),{fish:"",count:0}];update({ponds,buildings:{...data.buildings,fishPonds:ponds.length}});setPondPicker(i)}} style={{marginTop:6,width:"100%",border:`1.5px dashed ${C.line}`,background:C.cream,borderRadius:9,padding:7,fontWeight:900,color:C.brown,fontSize:10.5}}>＋ 新增魚塘</button>
        <div style={{fontSize:8.5,color:C.muted,marginTop:5,lineHeight:1.4}}>產出會依魚種與目前塘內數量顯示；擴容任務直接在遊戲魚塘查看，手帳不再另外記錄。</div>
      </>}

'''
s=s[:start]+new_ponds+s[end:]

p.write_text(s,encoding='utf-8')
print('fish pond cards updated; expansion requirement removed')
