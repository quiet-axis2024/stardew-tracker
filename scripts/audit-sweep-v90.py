"""v90 sweep audit — 地點↔NPC 連結、商店可達性、魚卡跳轉、找魚範圍。"""
import subprocess,json
from pathlib import Path

def fail(msg):
    raise SystemExit('v90 audit: '+msg)

app=Path('app.jsx').read_text()

# fish card can open item card, and all three list contexts use it
for token in ['openCard=false','openCard?openItemLookupV54(name,FISH_ICON_FILES[i]):setSelectedItem(i)',
              'renderFishCardV4(i,area,true,false,true)','renderFishCardV4(i,area,true,true,true)']:
    if token not in app: fail('fish card jump wiring missing: '+token)

# quick fish finder defaults to global with local toggle
for token in ['worldQuickAllV90','quickLocalAreasV90','setWorldQuickAllV90(true)']:
    if token not in app: fail('quick finder scope wiring missing: '+token)

# place detail nav-npc merge and shop fallback
for token in ['navNpcKeysV90','shopKeyV90','npcChipsV90','footerNpcV90','cardOkV90','shopPinV90','SHOP_ITEM_ALIAS_V90']:
    if token not in app: fail('place/shop wiring missing: '+token)

# data invariants via node
node_js=r"""
const fs=require('fs');global.window={};
['social-data-v50.js','lookup-data-v46.js','world-data-v70.js','world-nav-data-v87.js'].forEach(f=>eval(fs.readFileSync(f,'utf8')));
const byZh=window.SDVSocialV50.byZh, NAV=window.SDVWorldNavV87, db=window.SDVWorldV70;
const lookup=new Set(window.SDVLookupV46.items.map(r=>r.file));
const badNpcKeys=[];
Object.values(NAV.nodes).forEach(n=>(n.places||[]).forEach(p=>(p.npcs||[]).forEach(k=>{if(!byZh[k])badNpcKeys.push(`${n.id}.${p.id}:${k}`)})));
const personByKey={};Object.values(db.people||{}).forEach(p=>(p.socialKeys||[]).forEach(k=>personByKey[k]=p.id));
const placeByOwner={};(db.places||[]).forEach(pl=>{if(pl.ownerId)placeByOwner[pl.ownerId]=pl.id});
const pin={};Object.values(NAV.nodes).forEach(n=>(n.places||[]).forEach(p=>{
  if(p.worldPlaceId){const dbp=(db.places||[]).find(x=>x.id===p.worldPlaceId);const per=dbp?.ownerId?db.people[dbp.ownerId]:null;(per?.socialKeys||[]).forEach(k=>pin[k]=pin[k]||`${n.id}.${p.id}`);}
  (p.npcs||[]).forEach(k=>pin[k]=pin[k]||`${n.id}.${p.id}`);
}));
const shopsNoPin=Object.entries(byZh).filter(([n,e])=>(e.shop?.items||[]).length&&!pin[n]).map(([n])=>n);
let shopMissing=0;Object.entries(byZh).forEach(([n,e])=>{if(!pin[n])return;(e.shop?.items||[]).forEach(it=>{const raw=String(it.name||'').replace(/ Recipe$/,'');if(raw&&!lookup.has(raw))shopMissing++;});});
console.log(JSON.stringify({badNpcKeys,shopsNoPin,shopMissing,
  required:['bus_stop.bus','mountain.linus','mines.dwarf','sewer.krobus'].map(x=>{const [nid,pid]=x.split('.');const p=(NAV.nodes[nid].places||[]).find(y=>y.id===pid);return {x,npcs:p?.npcs||[]}})}));
"""
out=json.loads(subprocess.run(['node','-e',node_js],capture_output=True,text=True,check=True).stdout)
if out['badNpcKeys']: fail(f'nav npcs not in social byZh: {out["badNpcKeys"]}')
if out['shopsNoPin']: fail(f'shops unreachable in world: {out["shopsNoPin"]}')
if out['shopMissing']<30: fail('shop-only item count dropped unexpectedly — index source shifted?')
for r in out['required']:
    if not r['npcs']: fail(f'required nav npc annotation missing on {r["x"]}')
# v90.1: 商店類官方簡中名補錄哨兵
name_js=r"""
global.window={};require('fs');eval(require('fs').readFileSync('switch-names-v47.js','utf8'));
const m=window.SDVSwitchNamesV47;
console.log(JSON.stringify({duck:m['Duck'],eo:m['Earth Obelisk'],rod:m['Iridium Rod'],hut:m['Junimo Hut'],rs:m['Return Scepter'],rare:m['Rarecrow #6']||null,total:Object.keys(m).length}));
"""
nm=json.loads(subprocess.run(['node','-e',name_js],capture_output=True,text=True,check=True).stdout)
expect={'duck':'鸭','eo':'土之图腾柱','rod':'铱金鱼竿','hut':'祝尼魔屋','rs':'回程魔杖'}
for k,v in expect.items():
    if nm[k]!=v: fail(f'官方名哨兵不符 {k}: {nm[k]} != {v}')
if nm['rare'] is not None: fail('Rarecrow #6 不應有中文名（wiki 重導向非專屬名）')
if nm['total']<1650: fail('switch-names 條目數異常下降')
print(f"v90 sweep audit passed; shop-only items indexed={out['shopMissing']}; switch-names={nm['total']}")
