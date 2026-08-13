from pathlib import Path


def replace_once(path, old, new, label):
    p=Path(path)
    s=p.read_text()
    if old not in s:
        raise SystemExit(f'missing anchor: {label}')
    p.write_text(s.replace(old,new,1))

replace_once('app.jsx',
'''    if(tab==="data"&&dataSection==="world")loadLazyDataV67("world");
  },[tab,dataSection]);''',
'''    if(tab==="fishing"&&fishViewV4==="world")loadLazyDataV67("world");
  },[tab,fishViewV4]);''',
'world lazy placement')

replace_once('app.jsx',
'''    return <div><SectionTitle icon="game:Stardew Valley Almanac">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:7}}><DataTab id="skills" label="角色" file="Stardew Hero Trophy"/><DataTab id="farm" label="農場" file="Farm Computer"/><DataTab id="world" label="世界" file="Map"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Treasure Chest"/></div>{dataSection==="skills"&&renderSkills()}{dataSection==="farm"&&renderFarm()}{dataSection==="world"&&renderWorldV70()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;''',
'''    return <div><SectionTitle icon="game:Stardew Valley Almanac">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="skills" label="角色" file="Stardew Hero Trophy"/><DataTab id="farm" label="農場" file="Farm Computer"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Treasure Chest"/></div>{dataSection==="skills"&&renderSkills()}{dataSection==="farm"&&renderFarm()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;''',
'data tabs back to player records')

replace_once('app.jsx',
'''  const renderFishingV30 = () => {
    const fast=fishViewV4==="find"?"find":"items";
    return <div><SectionTitle icon="game:Magnifying Glass">查找</SectionTitle><Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.7,color:C.muted,lineHeight:1.4}}>查物品用途與取得方式，或依地點、季節、天氣與時間找魚。</div></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:7}}><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={29}/>物品用途</button><button onClick={()=>setFishViewV4("find")} style={{border:`2px solid ${fast==="find"?C.orange:C.line}`,background:fast==="find"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Sonar Bobber" size={29}/>找魚</button></div>{fast==="items"?renderItemUsageV42():renderFishFindV4()}</div>;
  };''',
'''  const renderFishingV30 = () => {
    const fast=["items","find","world"].includes(fishViewV4)?fishViewV4:"items";
    return <div><SectionTitle icon="game:Magnifying Glass">查找</SectionTitle><Card style={{padding:"6px 8px",background:"#FFF4D8"}}><div style={{fontSize:8.7,color:C.muted,lineHeight:1.4}}>這裡放遊戲本身的查詢資料：查物品、找魚，或查世界地點、人物、營業時間與服務。</div></Card><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,marginTop:7}}><button onClick={()=>setFishViewV4("items")} style={{border:`2px solid ${fast==="items"?C.orange:C.line}`,background:fast==="items"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:9.3,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file="Treasure Hunter" size={27}/>物品</button><button onClick={()=>setFishViewV4("find")} style={{border:`2px solid ${fast==="find"?C.orange:C.line}`,background:fast==="find"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:9.3,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file="Sonar Bobber" size={27}/>找魚</button><button onClick={()=>setFishViewV4("world")} style={{border:`2px solid ${fast==="world"?C.orange:C.line}`,background:fast==="world"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:9.3,fontWeight:950,color:C.brown,minWidth:0}}><GameIcon file="Map" size={27}/>世界</button></div>{fast==="items"?renderItemUsageV42():fast==="find"?renderFishFindV4():renderWorldV70()}</div>;
  };''',
'lookup tabs include world')

# Update world audit to enforce information architecture.
p=Path('scripts/audit-world-v70.py')
s=p.read_text()
s=s.replace('''    'DataTab id="world" label="世界"',
    'dataSection==="world"&&renderWorldV70()',
    'loadLazyDataV67("world")',''', '''    'setFishViewV4("world")',
    'fast==="find"?renderFishFindV4():renderWorldV70()',
    'tab==="fishing"&&fishViewV4==="world"',
    'loadLazyDataV67("world")',''')
s=s.replace("missing=[x for x in need if x not in app]\nif missing: fail('v70 world app invariant missing: '+repr(missing))", "missing=[x for x in need if x not in app]\nif missing: fail('v70 world app invariant missing: '+repr(missing))\nif 'DataTab id=\"world\" label=\"世界\"' in app or 'dataSection===\"world\"' in app: fail('world must live under lookup, not player data')")
p.write_text(s)

# Formalize IA in the roadmap.
p=Path('docs/ROADMAP.md')
s=p.read_text()
s=s.replace('## 3｜資料 → 世界', '## 3｜查找 → 世界')
s=s.replace('世界**資料層**重要，但世界瀏覽頁不做成大型 Wiki。', '資訊架構固定為：**「資料」放玩家這個存檔的個人記錄／進度；「查找」放遊戲本身的參考資料。** 因此世界入口放在「查找」，不是「資料」。\n\n世界**資料層**重要，但世界瀏覽頁不做成大型 Wiki。')
p.write_text(s)

p=Path('docs/WORLD_V70.md')
s=p.read_text()
s=s.replace('這份文件記錄 #38 第 3 項「資料 → 世界」第一版的邊界', '這份文件記錄 #38 第 3 項「查找 → 世界」第一版的邊界')
s=s.replace('- 世界放在「資料」內，與角色／農場／社區／收藏同級。', '- 世界放在「查找」內，與物品／找魚同層；「資料」只保留玩家個人存檔記錄與進度（角色／農場／社區／收藏）。')
p.write_text(s)

print('moved World from player Data to Lookup')
