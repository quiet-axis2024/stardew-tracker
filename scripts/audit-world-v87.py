"""v87 world audit — 導航圖完整性、資產覆蓋、index/SW 佈線。"""
import json,re,subprocess
from pathlib import Path

def fail(msg):
    raise SystemExit('v87 audit: '+msg)

# --- load nav data via node (single source of truth) ---
node_js = r"""
const fs=require('fs');global.window={};
eval(fs.readFileSync('world-nav-data-v87.js','utf8'));
console.log(JSON.stringify(window.SDVWorldNavV87));
"""
NAV=json.loads(subprocess.run(['node','-e',node_js],capture_output=True,text=True,check=True).stdout)
nodes=NAV['nodes']
if NAV.get('root') not in nodes: fail('root node missing')

# graph integrity
for nid,n in nodes.items():
    for p in n.get('portals',[]):
        if p['to'] not in nodes: fail(f'portal {nid}.{p["id"]} -> unknown node {p["to"]}')
    ids=[x['id'] for x in n.get('places',[])+n.get('portals',[])+n.get('spots',[])]
    if len(ids)!=len(set(ids)): fail(f'duplicate pin ids in {nid}')
    for x in n.get('places',[])+n.get('portals',[])+n.get('spots',[]):
        if not (0<=x['x']<=100 and 0<=x['y']<=100): fail(f'{nid}.{x["id"]} coord out of range')

seen={NAV['root']};queue=[NAV['root']]
while queue:
    cur=queue.pop(0)
    for p in nodes[cur].get('portals',[]):
        if p['to'] not in seen: seen.add(p['to']);queue.append(p['to'])
unreachable=set(nodes)-seen
if unreachable: fail(f'unreachable nodes: {sorted(unreachable)}')

# areaNode coverage: every FISH_AREAS_V4 id must be routable and land on a spot pin
app=Path('app.jsx').read_text()
area_ids=re.findall(r'\{id:"([a-z0-9_]+)",name:"[^"]+",sub:',app)
if len(area_ids)<20: fail('FISH_AREAS_V4 parse failed')
for aid in area_ids:
    tgt=NAV['areaNode'].get(aid)
    if not tgt: fail(f'fish area {aid} missing from areaNode')
    if tgt not in nodes: fail(f'areaNode {aid} -> unknown node {tgt}')
    if not any(s.get('fishAreaId')==aid for s in nodes[tgt].get('spots',[])):
        fail(f'node {tgt} has no spot pin for fish area {aid}')
for aid in NAV['areaNode']:
    if aid not in area_ids: fail(f'areaNode key {aid} has no FISH_AREAS_V4 entry')

# every mapKey and worldPlaceId resolvable
manifest={}
t=Path('assets/game/local-assets-v67.js').read_text()
manifest.update(json.loads(t[t.index('{'):t.rindex('}')+1]))
t=Path('assets/game/local-assets-v87.js').read_text()
mm=re.search(r'Object\.assign\(window\.SDVLocalGameFilesV67=window\.SDVLocalGameFilesV67\|\|\{\}, (\{.*\})\);',t,re.S)
if not mm: fail('local-assets-v87 manifest format invalid')
manifest.update(json.loads(mm.group(1)))
world=Path('world-data-v70.js').read_text()
place_ids=set(re.findall(r'\{id:"([a-z0-9_]+)"',world))
for nid,n in nodes.items():
    mk=n.get('mapKey')
    if mk and mk not in manifest: fail(f'node {nid} mapKey "{mk}" not in local assets')
    if mk and not Path(manifest[mk].lstrip('./')).is_file(): fail(f'node {nid} map asset file missing')
    for x in n.get('places',[]):
        wp=x.get('worldPlaceId')
        if wp and wp not in place_ids: fail(f'{nid}.{x["id"]} worldPlaceId "{wp}" not in world-data-v70')

# fish icon coverage (all 72 local)
files=re.search(r'const FISH_ICON_FILES = \[(.*?)\];',app,re.S)
fish_files=re.findall(r'"([^"]+)"',files.group(1)) if files else []
if len(fish_files)<70: fail('FISH_ICON_FILES parse failed')
missing=[f for f in fish_files if f not in manifest]
if missing: fail(f'fish icons not localized: {missing}')

# app / index / sw wiring
for token in ['const renderWorldV87 = () =>','WORLD_NAV_V87','worldPathToV87','renderWorldV87()','openSocialNpcV55','openItemLookupV54']:
    if token not in app: fail('app.jsx missing '+token)
for legacy in ['renderWorldV70','world-nav-v83','world-lifecycle','SDVWorldNavV81Data','SDVWorldFishV83']:
    if legacy in app: fail('app.jsx still references legacy world: '+legacy)
idx=Path('index.html').read_text()
for token in ['./world-nav-data-v87.js?v=87','./assets/game/local-assets-v87.js?v=87',"./sw-v87.js"]:
    if token not in idx: fail('index.html missing '+token)
for legacy in ['world-nav-v83','world-lifecycle','world-fish-data-v83','world-nav-island','world-nav-data-v81','sw-v86']:
    if legacy in idx: fail('index.html still loads legacy '+legacy)
sw=Path('sw-v87.js').read_text()
for token in ["stardew-tracker-v87","world-nav-data-v87.js","local-assets-v87.js","request.mode==='navigate'"]:
    if token not in sw: fail('sw-v87 missing '+token)
build=Path('build-cloudflare.sh').read_text()
for token in ['world-nav-data-v87.js','sw-v87.js','audit-world-v87.py','local-assets-v87.js']:
    if token not in build: fail('build-cloudflare.sh missing '+token)
pages=Path('.github/workflows/pages.yml').read_text()
if './build-cloudflare.sh' not in pages: fail('pages.yml must invoke build-cloudflare.sh')
print(f'v87 world audit passed; nodes={len(nodes)} areas={len(area_ids)} assets={len(manifest)}')
