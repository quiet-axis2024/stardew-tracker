from pathlib import Path
import re


def fail(msg):
    raise SystemExit(msg)

app=Path('app.jsx').read_text()
need=[
    'const renderWorldV70 = () =>',
    'setFishViewV4("world")',
    'fast==="find"?renderFishFindV4():renderWorldV70()',
    'tab==="fishing"&&fishViewV4==="world"',
    'loadLazyDataV67("world")',
    'worldRegionV70', 'worldQueryV70', 'worldOpenV70',
    '從「在哪裡」開始找', '天氣條件',
    'shop?.items?.length', 'NPC_SERVICES_V55',
    'openFishHintV69("",place.fishingAreaId)',
    'openSocialNpcV55(key)'
]
missing=[x for x in need if x not in app]
if missing: fail('v70 world app invariant missing: '+repr(missing))
if 'DataTab id="world" label="世界"' in app or 'dataSection==="world"' in app: fail('world must live under lookup, not player data')

world=Path('world-data-v70.js').read_text()
for token in ['window.SDVWorldV70','version:70','regions:[','places:[','weather:[','people:{','鹈鹕镇','煤矿森林','姜岛','皮埃尔的杂货店','木匠的商店','铁匠铺','鱼店']:
    if token not in world: fail('v70 world data missing '+token)

ids=re.findall(r'\{id:"([a-z0-9_]+)"', world)
if len(ids)!=len(set(ids)):
    dup=sorted({x for x in ids if ids.count(x)>1})
    fail('duplicate stable IDs in world data: '+repr(dup))

idx=Path('index.html').read_text()
if 'world:["./world-data-v70.js?v=70"]' not in idx: fail('world lazy group missing')
if '?v=70' not in idx or 'deploy-v70' not in idx: fail('v70 index release version missing')
if "const CACHE='stardew-tracker-v70';" not in Path('sw.js').read_text(): fail('v70 SW cache missing')

cloud=Path('build-cloudflare.sh').read_text()
if 'python3 scripts/audit-world-v70.py' not in cloud or 'world-data-v70.js dist/' not in cloud:
    fail('Cloudflare world validation/copy missing')
pages=Path('.github/workflows/pages.yml').read_text()
if 'python3 scripts/audit-world-v70.py' not in pages or 'world-data-v70.js dist/' not in pages:
    fail('Pages world validation/copy missing')

docs=Path('docs/DATA_SOURCES.md').read_text()
if '`world-data-v70.js` | manual committed snapshot' not in docs:
    fail('world data source documentation missing')

print('v70 world audit passed')
