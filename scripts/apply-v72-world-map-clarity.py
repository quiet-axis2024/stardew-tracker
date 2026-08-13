from pathlib import Path
import re

app_path=Path('app.jsx')
app=app_path.read_text()

DETAIL='''
const WORLD_REGION_DETAIL_V72 = {
  town:"Pelican Town",
  mountain:"The Mountain",
  forest:"CindersapForest",
  beach:"BeachDistances",
  island:"Ginger Island Map"
};
'''
if 'const WORLD_REGION_DETAIL_V72 = {' not in app:
    anchor='const WORLD_SPOT_REGION_V71 = (() => {'
    if anchor not in app: raise SystemExit('missing V71 region anchor')
    app=app.replace(anchor,DETAIL+'\n'+anchor,1)

old_map=re.search(r'''    const renderRegionMapV71=\(\)=> \{.*?\n    \};\n    const spotRows=''',app,re.S)
if not old_map: raise SystemExit('missing renderRegionMapV71 block')
new_map=r'''    const renderRegionMapV71=()=> {
      if(!region||!regionMeta)return null;
      const detailFile=WORLD_REGION_DETAIL_V72[region.id]||regionMeta.file||region.icon||"Map";
      return <Card style={{padding:7,marginTop:6}}>
        <div style={{position:"relative",overflow:"hidden",borderRadius:9,border:`1px solid ${C.line}`,backgroundColor:"#DCE9C2",backgroundImage:regionMeta.file?`url(${GAME_FILE(regionMeta.file)})`:"none",backgroundSize:"cover",backgroundPosition:"center"}}>
          <WikiImg src={GAME_FILE(detailFile)} alt={`${region.name}區域地圖`} style={{display:"block",width:"100%",height:"auto",maxHeight:330,objectFit:"contain",imageRendering:"pixelated",background:"#DCE9C2"}}/>
          <span style={{position:"absolute",left:6,top:6,border:`1px solid ${C.line}`,background:"rgba(255,250,235,.94)",borderRadius:8,padding:"3px 6px",fontSize:7.2,fontWeight:950,color:C.darkBrown,boxShadow:"0 1px 3px rgba(0,0,0,.18)"}}>{region.name}</span>
        </div>
        <div style={{fontSize:7.5,color:C.muted,lineHeight:1.35,marginTop:5,textAlign:"center"}}>先看完整區域位置，再從下方選{worldKindV70==="spots"?"釣點":"地點"}；不再用放大世界地圖硬猜點位。</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5,marginTop:7}}>{markerRows.map(row=>{
          const id=row.id,on=worldKindV70==="spots"?worldSpotV71===id:worldOpenV70===id;
          const label=worldKindV70==="spots"?row.sub:row.name;
          const sub=worldKindV70==="spots"?row.name:(row.hours||row.requires||"");
          return <button key={id} onClick={()=>worldKindV70==="spots"?selectWorldSpotV71(id):selectWorldPlaceV71(id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:9,padding:6,display:"grid",gridTemplateColumns:"38px minmax(0,1fr)",gap:6,alignItems:"center",textAlign:"left",minWidth:0,minHeight:52}}><GameIcon file={row.icon||region.icon||"Map"} size={36}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:8.7,color:on?C.orange:C.ink,lineHeight:1.12}}>{worldKindV70==="spots"?"🎣 ":""}{label}</b>{sub&&<span style={{display:"block",fontSize:6.7,color:C.muted,lineHeight:1.2,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{sub}</span>}</span></button>
        })}</div>
      </Card>;
    };
    const spotRows='''
app=app[:old_map.start()]+new_map+app[old_map.end():]

old_header=re.search(r'''      \{region&&worldQuickV71!=="fish"&&<>\n        <div style=\{\{display:"flex",alignItems:"center",gap:6,marginBottom:5\}\}>.*?<div style=\{\{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5\}\}>''',app,re.S)
if not old_header: raise SystemExit('missing region header block')
new_header=r'''      {region&&worldQuickV71!=="fish"&&<>
        <button onClick={goWorldRootV71} style={{width:"100%",border:`1.5px solid ${C.orange}`,background:"#FFF4D8",borderRadius:10,padding:"8px 9px",display:"grid",gridTemplateColumns:"28px minmax(0,1fr) 18px",gap:7,alignItems:"center",textAlign:"left",marginBottom:7,boxShadow:"0 2px 5px rgba(96,67,33,.10)"}}><GameIcon file="Map" size={26}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:10.5,color:C.darkBrown}}>← 返回大世界地圖</b><span style={{display:"block",fontSize:7,color:C.muted,marginTop:1}}>世界 › {worldMapV70==="island"?"姜岛":worldMapV70==="special"?"特殊區域":"本島"} › {region.name}</span></span><span style={{fontSize:15,color:C.orange,fontWeight:950}}>‹</span></button>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,padding:"1px 1px 0"}}><GameIcon file={region.icon||"Map"} size={29}/><div style={{minWidth:0}}><b style={{display:"block",fontSize:12,color:C.darkBrown}}>{region.name}</b><span style={{display:"block",fontSize:7.5,color:C.muted,lineHeight:1.3,marginTop:1}}>{region.summary}</span></div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>'''
app=app[:old_header.start()]+new_header+app[old_header.end():]

# Remove the now-duplicated summary line directly after the old header if present.
app=app.replace('''        <div style={{fontSize:7.7,color:C.muted,lineHeight:1.35,marginBottom:6}}>{region.summary}</div>\n''','',1)

app_path.write_text(app)

# v72 cache/query so iPhone PWA definitely picks up the visual fix.
p=Path('index.html');s=p.read_text().replace('?v=71','?v=72').replace('deploy-v71','deploy-v72');p.write_text(s)
p=Path('sw.js');s=p.read_text().replace("const CACHE='stardew-tracker-v71';","const CACHE='stardew-tracker-v72';");p.write_text(s)

Path('scripts/audit-world-v72.py').write_text(r'''from pathlib import Path

def fail(msg): raise SystemExit(msg)
app=Path('app.jsx').read_text()
need=[
  'const WORLD_REGION_DETAIL_V72 = {',
  'town:"Pelican Town"', 'forest:"CindersapForest"', 'mountain:"The Mountain"', 'beach:"BeachDistances"',
  '← 返回大世界地圖', '世界 ›', '先看完整區域位置',
  'gridTemplateColumns:"repeat(2,minmax(0,1fr))"',
  '不再用放大世界地圖硬猜點位'
]
missing=[x for x in need if x not in app]
if missing: fail('v72 world map clarity invariant missing: '+repr(missing))
# The region selector must no longer place guessed buttons by percent coordinates.
region_block=app[app.find('const renderRegionMapV71'):app.find('const spotRows=',app.find('const renderRegionMapV71'))]
for stale in ['left:`${point[0]}%`','top:`${point[1]}%`','markerPoints[id]']:
    if stale in region_block: fail('guessed region marker remains: '+stale)
idx=Path('index.html').read_text()
if '?v=72' not in idx or 'deploy-v72' not in idx: fail('v72 release marker missing')
if "const CACHE='stardew-tracker-v72';" not in Path('sw.js').read_text(): fail('v72 SW cache missing')
if 'python3 scripts/audit-world-v72.py' not in Path('build-cloudflare.sh').read_text(): fail('Cloudflare v72 audit missing')
print('v72 world map clarity audit passed')
''')

p=Path('build-cloudflare.sh');s=p.read_text()
if 'python3 scripts/audit-world-v72.py' not in s:s=s.replace('python3 scripts/audit-world-v71.py','python3 scripts/audit-world-v71.py\npython3 scripts/audit-world-v72.py',1)
p.write_text(s)

for file in ['docs/ROADMAP.md','docs/WORLD_V70.md']:
    p=Path(file);s=p.read_text()
    needle='區域頁不要做成 `地点 5｜人物 3｜找鱼` 這種統計 dashboard；地圖本身才是主要導航。' if file.endswith('ROADMAP.md') else '區域頁不要做成 `地点 5｜人物 3｜找鱼` 類型的統計 dashboard；地圖本身才是主要導航。'
    addition='''\n\n區域地圖必須以「辨認遊戲場景」為優先：優先使用完整的區域圖／場景圖，不用任意 CSS 放大世界地圖來冒充區域圖。若沒有可靠的精確座標，寧可讓地圖負責方向感、下方用地點／釣點卡選擇，也不要在地圖上放錯位置的假精確標記。進入任何區域後，「← 返回大世界地圖」必須是頁面最前方、明顯且容易點擊的主要返回操作。'''
    if addition.strip() not in s:
        if needle not in s: raise SystemExit('missing docs map UX anchor '+file)
        s=s.replace(needle,needle+addition,1)
    p.write_text(s)

print('v72 map clarity applied')
