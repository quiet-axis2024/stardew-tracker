from pathlib import Path
import json, re, urllib.request


def replace_once(text, old, new, label):
    n=text.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, got {n}")
    return text.replace(old,new,1)


def sub_once(text, pattern, repl, label, flags=0):
    out,n=re.subn(pattern,lambda m:repl,text,count=1,flags=flags)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 replacement, got {n}")
    return out

# ---------- Generate richer lookup metadata (pinned dataset snapshot) ----------
DATA_COMMIT='70d5f8d306cc7f8cfeba31a8cbec310483390519'
DATA_ROOT=f'https://raw.githubusercontent.com/chiefpansancolt/stardew-valley-data/{DATA_COMMIT}/data/'

def fetch_json(name):
    req=urllib.request.Request(DATA_ROOT+name,headers={'User-Agent':'stardew-tracker-v49-build'})
    with urllib.request.urlopen(req,timeout=30) as r:
        return json.load(r)

season_zh={'spring':'春','summer':'夏','fall':'秋','winter':'冬'}
by_name={}

def merge_meta(name, meta):
    if not name:return
    old=by_name.get(name,{})
    # Prefer newly supplied non-empty fields while preserving earlier metadata.
    for k,v in meta.items():
        if v is not None and v!=[]:
            old[k]=v
        elif k not in old:
            old[k]=v
    by_name[name]=old

def common_food(row,kind):
    eh=row.get('energyHealth') or {}
    return {
      'kind':kind,
      'energy':eh.get('energy'),
      'health':eh.get('health'),
      'poison':bool(eh.get('poison',False)),
    }

for row in fetch_json('crops.json'):
    seasons=[season_zh.get(x,x) for x in (row.get('seasons') or [])]
    meta={**common_food(row,'crop'),'seasons':seasons,'growDays':row.get('growDays'),'regrowDays':row.get('regrowDays')}
    merge_meta(row.get('name'),meta)
    merge_meta(row.get('seedName'),{'kind':'seed','seasons':seasons,'growDays':row.get('growDays'),'regrowDays':row.get('regrowDays')})

for row in fetch_json('cooking.json'):
    meta={**common_food(row,'food'),'buffs':row.get('buffs') or [],'buffDuration':row.get('buffDuration')}
    merge_meta(row.get('name'),meta)

for row in fetch_json('fish.json'):
    meta={**common_food(row,'fish'),'seasons':[season_zh.get(x,x) for x in (row.get('seasons') or [])]}
    merge_meta(row.get('name'),meta)

for row in fetch_json('forageables.json'):
    meta={**common_food(row,'forage'),'seasons':[season_zh.get(x,x) for x in (row.get('seasons') or [])]}
    merge_meta(row.get('name'),meta)

for row in fetch_json('trees.json'):
    if row.get('type')!='fruit-tree':continue
    seasons=[season_zh.get(x,x) for x in (row.get('seasons') or [])]
    merge_meta(row.get('saplingName'),{'kind':'sapling','seasons':seasons,'growDays':row.get('daysToMature')})
    produce=row.get('produce') or {}
    if produce.get('name'):
        merge_meta(produce.get('name'),{**common_food(produce,'fruit'),'seasons':seasons})

Path('lookup-extra-v49.js').write_text('window.SDVLookupExtraV49='+json.dumps({'sourceCommit':DATA_COMMIT,'byName':by_name},ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

# Local copy of the Chinese Stardew title board, so the boot screen doesn't depend on a slow first remote image load.
logo_url='https://stardewvalleywiki.com/Special:Redirect/file/Main%20Logo%20ZH.png'
req=urllib.request.Request(logo_url,headers={'User-Agent':'stardew-tracker-v49-build'})
with urllib.request.urlopen(req,timeout=30) as r:
    logo=r.read()
if not logo.startswith(b'\x89PNG'):
    raise SystemExit('main-logo-zh.png: download was not a PNG')
Path('main-logo-zh.png').write_bytes(logo)

# ---------- app.jsx ----------
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# 1. Terminology: skill, not level.
s=replace_once(s,'["等級",`${skillTotal}/50`]','["技能",`${skillTotal}/50`]','farm card skill label')
s=replace_once(s,'<SkillTab id="skills" label="等級" file="Skills Tab Icon"/>','<SkillTab id="skills" label="技能" file="Skills Tab Icon"/>','skills subtab label')

# 6/7. Clarify Ginger Island south water labels and correct the main-map mountain marker.
s=replace_once(s,'{id:"island_s",name:"薑島南部及東南部",sub:"海洋"','{id:"island_s",name:"薑島南部及東南部",sub:"南部／東南部海域"','island south subtitle')
s=replace_once(s,'{id:"pirate",name:"海盜灣",sub:"海洋"','{id:"pirate",name:"海盜灣",sub:"海盜灣水域"','pirate cove subtitle')
s=replace_once(s,'{id:"mountain",label:"山區",x:57,y:23,ids:["mountain"]}','{id:"mountain",label:"山湖",x:66,y:29,ids:["mountain"]}','mountain map marker')
s=replace_once(s,'{id:"south",label:"南部",x:56,y:80,ids:["island_s","pirate"]}','{id:"south",label:"南部／東南部",x:56,y:80,ids:["island_s","pirate"]}','island south cluster label')

# 5. Find-fish filters are always visible: season / weather / time, no disclosure toggle.
filter_block='''      <Card style={{marginTop:7,padding:7}}>
        <div style={{fontSize:9.2,fontWeight:950,color:C.brown,marginBottom:5}}>條件</div>
        <div style={{display:"grid",gap:5}}>
          <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.5,fontWeight:900,color:C.muted,paddingTop:5}}>季節</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{SEASONS.map(x=>filterButton(x,fishSeasonsV42.includes(x),()=>toggleValue(x,fishSeasonsV42,setFishSeasonsV42),`${SEASON_COLORS[x]}30`))}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.5,fontWeight:900,color:C.muted,paddingTop:5}}>天氣</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{["晴","雨"].map(x=>filterButton(x,fishWeathersV42.includes(x),()=>toggleValue(x,fishWeathersV42,setFishWeathersV42),x==="雨"?"#DCEBFA":"#FFF0B8"))}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:4,alignItems:"start"}}><span style={{fontSize:7.5,fontWeight:900,color:C.muted,paddingTop:5}}>時間</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{FISH_TIME_SEGMENTS_V42.map(x=>filterButton(x.name,fishTimesV42.includes(x.id),()=>toggleValue(x.id,fishTimesV42,setFishTimesV42),"#E5EDF2"))}</div></div>
        </div>
        {(fishSeasonsV42.length||fishWeathersV42.length||fishTimesV42.length)?<button onClick={clearFilters} style={{border:0,background:"transparent",fontSize:7.8,color:C.blue,fontWeight:900,marginTop:6,padding:0}}>清除全部條件</button>:null}
      </Card>'''
s=sub_once(s,r'      <Card style=\{\{marginTop:7,padding:6\}\}>\s*<button onClick=\{\(\)=>setFishFiltersOpenV46\(!fishFiltersOpenV46\)\}.*?\n      </Card>',filter_block,'always-visible fish filters',re.S)
# State is obsolete after the filter disclosure is removed.
s=s.replace('  const [fishFiltersOpenV46, setFishFiltersOpenV46] = useState(false);\n','')

# 8. Fish cards visually call out fish available in the farm's current season.
s=replace_once(s,'    const timeText=formatFishTimeV4(rule,area?.timeOverride);\n    return <button','    const timeText=formatFishTimeV4(rule,area?.timeOverride);\n    const currentSeasonFishV49=seasons.includes(data.base.season);\n    return <button','fish current-season variable')
s=replace_once(s,'border:`2px solid ${showCollection?(!got?C.orange:C.line):C.line}`,background:showCollection?(got?"#F5F0DF":"#FFF2CF"):C.paper','border:`2px solid ${showCollection?(!got?C.orange:C.line):currentSeasonFishV49?C.green:C.line}`,background:showCollection?(got?"#F5F0DF":"#FFF2CF"):currentSeasonFishV49?"#EAF4D8":C.paper','fish current-season card highlight')
s=replace_once(s,'<span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#F0E2C5",color:C.brown}}>{seasonText}</span>','<span style={{fontSize:8.5,fontWeight:900,padding:"1px 4px",borderRadius:7,background:"#F0E2C5",color:C.brown}}>{seasonText}</span>{currentSeasonFishV49&&<span style={{fontSize:8.5,fontWeight:950,padding:"1px 4px",borderRadius:7,background:"#DFF0CD",color:C.green}}>當季</span>}','fish current-season badge')

# 8/9. Enrich item lookup with crop seasons and numeric food/fish/forage energy, health and buffs.
s=replace_once(s,'if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),sources:new Set(),uses:new Set(),recommend:"",bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false});','if(!index.has(key))index.set(key,{key,name,file:resolved,aliases:new Set(),kinds:new Set(),sources:new Set(),uses:new Set(),recommend:"",bundles:[],remix:[],cookNeed:0,cookGroups:new Set(),shippable:false,seasons:[],energy:null,health:null,poison:false,buffs:[],buffDuration:null,farmingKind:""});','item metadata defaults')
extra_apply='''    const extraLookupV49=window.SDVLookupExtraV49?.byName||{};
    const applyExtraV49=(it,meta)=>{if(!it||!meta)return;if(Array.isArray(meta.seasons)&&meta.seasons.length)it.seasons=[...new Set(meta.seasons)];if(meta.energy!==null&&meta.energy!==undefined)it.energy=Number(meta.energy);if(meta.health!==null&&meta.health!==undefined)it.health=Number(meta.health);it.poison=Boolean(meta.poison);if(Array.isArray(meta.buffs))it.buffs=meta.buffs;if(meta.buffDuration!==null&&meta.buffDuration!==undefined)it.buffDuration=Number(meta.buffDuration);if(meta.kind)it.farmingKind=meta.kind;if(meta.growDays!==null&&meta.growDays!==undefined)it.growDays=Number(meta.growDays);if(meta.regrowDays!==null&&meta.regrowDays!==undefined)it.regrowDays=Number(meta.regrowDays);};
    Object.entries(extraLookupV49).forEach(([english,meta])=>{let it=[...index.values()].find(x=>x.name===english||x.file===english||x.aliases.has(english));if(!it)it=ensure(english,english,meta.kind||"game");if(it){it.aliases.add(english);applyExtraV49(it,meta);}});
'''
s=replace_once(s,'    (MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>{const it=ensure(name,file,"mine");if(it)it.sources.add(`礦井 ${group.range} 層${group.note?` · ${group.note}`:""}`)}));\n','    (MINE_BANDS_V28||[]).forEach(group=>(group.items||[]).forEach(([file,name])=>{const it=ensure(name,file,"mine");if(it)it.sources.add(`礦井 ${group.range} 層${group.note?` · ${group.note}`:""}`)}));\n'+extra_apply,'apply lookup extra')

# Helpers + tags + selected detail panel.
marker='    const all=[...index.values()].sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));\n'
helpers='''    const all=[...index.values()].sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));
    const itemCurrentSeasonV49=it=>{if(!it)return false;if(Array.isArray(it.seasons)&&it.seasons.includes(data.base.season))return true;if(it.fishIndex!==undefined){const r=fishRuleV4(it.fishIndex);return (r?.s||[]).includes(data.base.season);}return false;};
    const buffStatZhV49={Farming:"耕種",Fishing:"釣魚",Foraging:"採集",Mining:"採礦",Luck:"運氣",Speed:"速度",Defense:"防禦",Attack:"攻擊",Magnetism:"磁力",MaxStamina:"最大體力",Combat:"戰鬥"};
    const buffTextV49=it=>(it?.buffs||[]).map(b=>`${buffStatZhV49[b.stat]||b.stat} ${Number(b.value)>0?"+":""}${b.value}`).join("、");
    const durationTextV49=sec=>{const n=Number(sec);if(!Number.isFinite(n)||n<=0)return "";const m=Math.floor(n/60),s=n%60;return `${m}分${String(s).padStart(2,"0")}秒`;};
'''
s=replace_once(s,marker,helpers,'lookup season helpers')

old_tags='    const resultTags=it=>{const tags=[];if(it.shippable)tags.push(["出貨","#EAF4D8"]);if(it.kinds.has("artifact")||it.kinds.has("mineral"))tags.push(["博物館","#EEE6F7"]);if(it.bundles.length||it.remix.length)tags.push(["收集包","#FFF0C8"]);if(it.cookNeed)tags.push(["料理","#FBE5D6"]);if(it.kinds.has("fish"))tags.push(["魚","#DDECF7"]);if(it.kinds.has("craft"))tags.push(["製作","#F4E4C7"]);if(it.kinds.has("big"))tags.push(["設備","#E8E1D4"]);return tags.slice(0,3)};'
new_tags='    const resultTags=it=>{const tags=[];if(itemCurrentSeasonV49(it))tags.push(["當季","#DFF0CD"]);if(it.farmingKind==="crop"||it.farmingKind==="seed"||it.farmingKind==="fruit"||it.farmingKind==="sapling")tags.push(["耕種","#EAF4D8"]);if(it.farmingKind==="food")tags.push(["料理","#FBE5D6"]);if(it.shippable)tags.push(["出貨","#EAF4D8"]);if(it.kinds.has("artifact")||it.kinds.has("mineral"))tags.push(["博物館","#EEE6F7"]);if(it.bundles.length||it.remix.length)tags.push(["收集包","#FFF0C8"]);if(it.cookNeed)tags.push(["料理","#FBE5D6"]);if(it.kinds.has("fish"))tags.push(["魚","#DDECF7"]);if(it.kinds.has("craft"))tags.push(["製作","#F4E4C7"]);if(it.kinds.has("big"))tags.push(["設備","#E8E1D4"]);return tags.slice(0,4)};'
s=replace_once(s,old_tags,new_tags,'lookup result tags')

selected_header='''        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={selected.file} size={44}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:14,color:C.darkBrown}}>{switchNameV47(selected.name,selected.file)}</b><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{resultTags(selected).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</div></div></div>
        <div style={{fontSize:12,fontWeight:950,color:C.darkBrown,marginTop:9}}>用途</div>'''
selected_rich='''        <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file={selected.file} size={44}/><div style={{flex:1,minWidth:0}}><b style={{display:"block",fontSize:14,color:C.darkBrown}}>{switchNameV47(selected.name,selected.file)}</b><div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{resultTags(selected).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</div></div></div>
        {(selected.seasons?.length>0||selected.energy!==null||selected.health!==null||(selected.buffs||[]).length>0)&&<div style={{marginTop:8,padding:"7px 8px",background:"#FFF4D8",borderRadius:8,border:`1px solid ${C.line}`,display:"grid",gap:4}}>
          {selected.seasons?.length>0&&<div style={{fontSize:9.5,color:C.ink,lineHeight:1.35}}>🌱 <b>季節：</b>{selected.seasons.length===4?"四季":selected.seasons.join("／")}{itemCurrentSeasonV49(selected)&&<span style={{marginLeft:5,color:C.green,fontWeight:950}}>● 當季</span>}{selected.growDays?` · 成熟 ${selected.growDays} 天`:""}{selected.regrowDays?` · 再生 ${selected.regrowDays} 天`:""}</div>}
          {(selected.energy!==null||selected.health!==null)&&<div style={{fontSize:9.5,color:C.ink,lineHeight:1.35}}>⚡ <b>食用：</b>體力 {selected.energy!==null?(selected.energy>0?`+${selected.energy}`:selected.energy):"—"}　❤️ 生命 {selected.health!==null?(selected.health>0?`+${selected.health}`:selected.health):"—"}{selected.poison?<span style={{color:C.red,fontWeight:950}}> · 有負面食用效果</span>:null}</div>}
          {(selected.buffs||[]).length>0&&<div style={{fontSize:9.5,color:C.ink,lineHeight:1.35}}>✨ <b>技能／狀態加成：</b>{buffTextV49(selected)}{selected.buffDuration?` · ${durationTextV49(selected.buffDuration)}`:""}</div>}
        </div>}
        <div style={{fontSize:12,fontWeight:950,color:C.darkBrown,marginTop:9}}>用途</div>'''
s=replace_once(s,selected_header,selected_rich,'selected nutrition panel')

old_result='''<div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5,marginTop:6}}>{results.map(it=>{const on=selected?.key===it.key;return <button key={it.key} onClick={()=>setItemUsageSelectedV42(it.key)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFF0D2":C.paper,borderRadius:9,padding:"6px 5px",display:"grid",gridTemplateColumns:"34px 1fr",gap:5,alignItems:"center",textAlign:"left",minWidth:0}}><GameIcon file={it.file} size={32}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:8.8,color:C.ink,lineHeight:1.12,overflow:"hidden",textOverflow:"ellipsis"}}>{switchNameV47(it.name,it.file)}</b><span style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:3}}>{resultTags(it).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</span></span></button>})}</div>'''
new_result='''<div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:5,marginTop:6}}>{results.map(it=>{const on=selected?.key===it.key,current=itemCurrentSeasonV49(it);return <button key={it.key} onClick={()=>setItemUsageSelectedV42(it.key)} style={{border:`1.5px solid ${on?C.orange:current?C.green:C.line}`,background:on?"#FFF0D2":current?"#EEF7DD":C.paper,borderRadius:9,padding:"6px 5px",display:"grid",gridTemplateColumns:"34px 1fr",gap:5,alignItems:"center",textAlign:"left",minWidth:0}}><GameIcon file={it.file} size={32}/><span style={{minWidth:0}}><b style={{display:"block",fontSize:8.8,color:current?C.green:C.ink,lineHeight:1.12,overflow:"hidden",textOverflow:"ellipsis"}}>{switchNameV47(it.name,it.file)}</b><span style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:3}}>{resultTags(it).map(([t,b])=><span key={t}>{tag(t,b)}</span>)}</span></span></button>})}</div>'''
s=replace_once(s,old_result,new_result,'lookup result current-season highlight')

# 11. Plain text summary no longer contains obsolete platform or removed free-form notes.
s=replace_once(s,'\\n農場：${data.base.farm}；平台：${data.base.platform}\\n技能：','\\n農場：${data.base.farm||"未記錄"}\\n技能：','summary remove platform')
s=replace_once(s,'\\n圖鑑：${collectionText}\\n\\n備註：\\n${data.notes||"無"}`;','\\n圖鑑：${collectionText}`;','summary remove notes')

# 2/3/10/11. Notes tab becomes sharing/backup/management only.
s=sub_once(s,r'  const renderNotes = \(\) => <div>\n    <SectionTitle icon="📝">備註</SectionTitle>\n    <Card><textarea.*?</Card>\n','  const renderNotes = () => <div>\n','remove notes textarea',re.S)
s=replace_once(s,'<SectionTitle icon="📤">純文字進度</SectionTitle>','<SectionTitle icon="game:Journal Scrap">純文字進度</SectionTitle>','plain text icon')
old_friend='''    <SectionTitle icon="🔗">分享給朋友</SectionTitle>
    <Card><div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>把網站連結分享給朋友即可使用。每個人的進度都只儲存在自己的瀏覽器／裝置，不會看到或改到其他人的記錄。</div></Card>'''
new_friend='''    <SectionTitle icon="🔗">分享 App 網址</SectionTitle>
    <Card><div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:9}}>這是手帳 App 本身的公開網址，不包含你的個人進度。朋友打開後會使用自己的獨立手帳。</div><button onClick={copyPublicAppUrlV49} style={{width:"100%",border:`2px solid ${C.green}`,background:C.lightGreen,color:C.green,borderRadius:9,padding:10,fontWeight:950}}>複製 App 網址</button></Card>'''
s=replace_once(s,old_friend,new_friend,'share app url block')

# Share-card recovery path for an already-installed iOS Home Screen app that doesn't yet have the cloud pair.
old_hint='''      <div style={{fontSize:10,color:C.muted,marginTop:7}}>此連結為唯讀，朋友無法改動你的雲端存檔。</div>'''
new_hint='''      <div style={{fontSize:10,color:C.muted,marginTop:7}}>此連結為唯讀，朋友無法改動你的雲端存檔。</div>
      {!trackerShareUrl()&&<div style={{marginTop:8,padding:"8px 9px",border:`1px dashed ${C.orange}`,borderRadius:8,background:"#FFF4D8"}}><div style={{fontSize:9.5,color:C.brown,lineHeight:1.45}}>主畫面 App 尚未帶入雲端連線時，可貼上原本的管理連結重新連接一次。</div><button onClick={reconnectCloudV49} style={{width:"100%",marginTop:6,border:`1.5px solid ${C.orange}`,background:"#FFE4C5",color:C.brown,borderRadius:8,padding:7,fontWeight:950,fontSize:10}}>重新連接雲端</button></div>}'''
s=replace_once(s,old_hint,new_hint,'cloud reconnect UI')

s=replace_once(s,'alert("這個瀏覽器目前沒有雲端唯讀分享連結。請先用你的管理連結開啟一次手帳。");','alert("這個 App 尚未取得你的雲端唯讀分享連結，請在下方按「重新連接雲端」。");','share missing alert')

copy_fn='''  const copyTrackerView = async () => {
    const url = trackerShareUrl();
    if (!url) { alert("尚未取得雲端唯讀分享連結"); return; }
    try { await navigator.clipboard.writeText(url); alert("唯讀手帳連結已複製"); }
    catch { window.prompt("複製這個唯讀手帳連結", url); }
  };
'''
extra_fns='''  const copyTrackerView = async () => {
    const url = trackerShareUrl();
    if (!url) { alert("尚未取得雲端唯讀分享連結"); return; }
    try { await navigator.clipboard.writeText(url); alert("唯讀手帳連結已複製"); }
    catch { window.prompt("複製這個唯讀手帳連結", url); }
  };
  const publicAppUrlV49 = () => `${window.location.origin}${window.location.pathname}`;
  const copyPublicAppUrlV49 = async () => {
    const url=publicAppUrlV49();
    try { await navigator.clipboard.writeText(url); alert("App 網址已複製"); }
    catch { window.prompt("複製 App 網址",url); }
  };
  const reconnectCloudV49 = async () => {
    const raw=window.prompt("貼上原本的手帳管理連結（包含 manage 與 sharekey）");
    if(!raw)return;
    try { window.SDVCloud?.connectFromManagementUrl?.(raw); window.location.reload(); }
    catch(e){ alert(e?.message||"這不是有效的管理連結"); }
  };
'''
s=replace_once(s,copy_fn,extra_fns,'share helper functions')

# 4. Match the boot screen inside React too, so there is no plain-text flash.
old_loading='  if(!loaded)return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",color:C.darkBrown,fontWeight:900}}>載入星露谷手帳…</div>;'
new_loading='  if(!loaded)return <div style={{minHeight:"100vh",background:"#5a3825",display:"flex",flexDirection:"column",alignItems:"center",padding:"17vh 24px 0",fontFamily:"system-ui",color:"#f4ddb0",fontWeight:900}}><img src="./main-logo-zh.png?v=49" alt="星露谷物語" style={{width:"min(704px,88vw)",height:"auto",imageRendering:"pixelated"}}/><div style={{marginTop:"auto",marginBottom:"23vh",fontSize:15,letterSpacing:2,fontWeight:950}}>LOADING…</div></div>;'
s=replace_once(s,old_loading,new_loading,'react loading screen')

p.write_text(s,encoding='utf-8')

# ---------- cloud.js ----------
p=Path('cloud.js')
c=p.read_text(encoding='utf-8')
c=replace_once(c,"  const LOCAL_UPDATED_STORE = 'sdv-cloud-local-updated-v1';","  const LOCAL_UPDATED_STORE = 'sdv-cloud-local-updated-v1';\n  const OWNER_COOKIE = 'sdv_cloud_owner_v1';\n  const SHARE_COOKIE = 'sdv_cloud_share_v1';",'cloud cookie constants')

cookie_helpers='''
  const cookiePath = (() => {
    const path = window.location.pathname || '/';
    return path.endsWith('/') ? path : path.replace(/[^/]*$/, '');
  })();
  const cookieGet = (name) => {
    const prefix = `${encodeURIComponent(name)}=`;
    const row = String(document.cookie || '').split('; ').find(v => v.startsWith(prefix));
    return row ? decodeURIComponent(row.slice(prefix.length)) : '';
  };
  const cookieSet = (name, value) => {
    if (!value) return;
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=31536000; Path=${cookiePath || '/'}; SameSite=Strict; Secure`;
  };
  const persistCloudPair = (owner, share) => {
    if (owner) { lsSet(OWNER_STORE, owner); cookieSet(OWNER_COOKIE, owner); }
    if (share) { lsSet(SHARE_STORE, share); cookieSet(SHARE_COOKIE, share); }
  };
'''
c=replace_once(c,'  function emitStatus(status) {',cookie_helpers+'\n  function emitStatus(status) {','cloud cookie helpers')

old_manage='''    if (manage) {
      lsSet(OWNER_STORE, manage);
      if (shareKey) lsSet(SHARE_STORE, shareKey);
      state.mode = 'owner';
      state.token = manage;
      state.shareToken = shareKey || lsGet(SHARE_STORE) || '';'''
new_manage='''    if (manage) {
      const pairedShare = shareKey || lsGet(SHARE_STORE) || cookieGet(SHARE_COOKIE) || '';
      persistCloudPair(manage, pairedShare);
      state.mode = 'owner';
      state.token = manage;
      state.shareToken = pairedShare;'''
c=replace_once(c,old_manage,new_manage,'cloud manage persistence')

old_else='''    } else {
      const storedOwner = lsGet(OWNER_STORE);
      if (storedOwner) {
        state.mode = 'owner';
        state.token = storedOwner;
        state.shareToken = lsGet(SHARE_STORE) || '';
      }
    }'''
new_else='''    } else {
      const storedOwner = lsGet(OWNER_STORE) || cookieGet(OWNER_COOKIE);
      const storedShare = lsGet(SHARE_STORE) || cookieGet(SHARE_COOKIE);
      if (storedOwner) {
        persistCloudPair(storedOwner, storedShare);
        state.mode = 'owner';
        state.token = storedOwner;
        state.shareToken = storedShare || '';
      }
    }'''
c=replace_once(c,old_else,new_else,'cloud cookie restore')

old_export='  window.SDVCloud = { init, state, shareUrl, copyShareLink };'
new_export='''  function connectFromManagementUrl(raw) {
    const url = new URL(String(raw || '').trim(), window.location.href);
    if (url.origin !== window.location.origin) throw new Error('管理連結不是這個手帳 App 的網址');
    const owner = url.searchParams.get('manage') || '';
    const share = url.searchParams.get('sharekey') || '';
    if (!owner || !share) throw new Error('管理連結需要同時包含 manage 與 sharekey');
    persistCloudPair(owner, share);
    state.mode='owner'; state.token=owner; state.shareToken=share;
    return true;
  }

  window.SDVCloud = { init, state, shareUrl, copyShareLink, connectFromManagementUrl };'''
c=replace_once(c,old_export,new_export,'cloud reconnect api')
p.write_text(c,encoding='utf-8')

# ---------- index.html ----------
p=Path('index.html')
h=p.read_text(encoding='utf-8')
old_css="    #boot-status{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;color:#f4ddb0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-weight:800;text-align:center}"
new_css="    #boot-status{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:17vh 24px 0;color:#f4ddb0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-weight:900;text-align:center}\\n    #boot-status .boot-logo{width:min(704px,88vw);height:auto;image-rendering:pixelated;filter:drop-shadow(0 5px 3px rgba(0,0,0,.18))}\\n    #boot-status .boot-loading{margin-top:auto;margin-bottom:23vh;font-size:15px;letter-spacing:2px;font-weight:950}"
h=replace_once(h,old_css,new_css,'boot css')
h=replace_once(h,'  <div id="root"><div id="boot-status">🌱 載入星露谷手帳…</div></div>','  <div id="root"><div id="boot-status"><img class="boot-logo" src="./main-logo-zh.png?v=49" alt="星露谷物語"><div class="boot-loading">LOADING…</div></div></div>','boot markup')
# Script revisions + fix the stale nonexistent switch-names-v48 reference.
h=h.replace('./cloud.js?v=48','./cloud.js?v=49').replace('./wardrobe-data-v34.js?v=48','./wardrobe-data-v34.js?v=49').replace('./farmer-preview-v33.js?v=48','./farmer-preview-v33.js?v=49').replace('./animal-preview-v33.js?v=48','./animal-preview-v33.js?v=49').replace('./lookup-data-v46.js?v=48','./lookup-data-v46.js?v=49')
h=replace_once(h,'  <script src="./switch-names-v48.js?v=48"></script>','  <script src="./lookup-extra-v49.js?v=49"></script>\n  <script src="./switch-names-v47.js?v=49"></script>','index lookup extra and switch file')
h=h.replace("script.src='./app.js?v=48';","script.src='./app.js?v=49';")
h=h.replace('<!-- deploy-v48 -->','<!-- deploy-v49 -->')
p.write_text(h,encoding='utf-8')

# ---------- sw.js ----------
p=Path('sw.js')
w=p.read_text(encoding='utf-8')
w=replace_once(w,"const CACHE='stardew-tracker-v48';","const CACHE='stardew-tracker-v49';",'service worker cache')
w=replace_once(w,"'./lookup-data-v46.js','./switch-names-v47.js','./manifest.webmanifest','./icon.svg'","'./lookup-data-v46.js','./lookup-extra-v49.js','./switch-names-v47.js','./main-logo-zh.png','./manifest.webmanifest','./icon.svg'",'service worker core assets')
p.write_text(w,encoding='utf-8')

print(f'v49 patch complete: {len(by_name)} enriched item records')
