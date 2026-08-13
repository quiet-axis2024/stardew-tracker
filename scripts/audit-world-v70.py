from pathlib import Path
import re

def fail(msg):
    raise SystemExit(msg)

app=Path('app.jsx').read_text()
for token in ['const renderWorldV70 = () =>','loadLazyDataV67("world")','NPC_SERVICES_V55','openSocialNpcV55']:
    if token not in app: fail('v70 world data integration missing '+token)
if 'DataTab id="world" label="世界"' in app or 'dataSection==="world"' in app:
    fail('world must live under lookup, not player data')

world=Path('world-data-v70.js').read_text()
for token in ['window.SDVWorldV70','version:70','regions:[','places:[','weather:[','people:{','鹈鹕镇','煤矿森林','姜岛','皮埃尔的杂货店','木匠的商店','铁匠铺','鱼店']:
    if token not in world: fail('v70 world data missing '+token)

ids=re.findall(r'\{id:"([a-z0-9_]+)"', world)
if len(ids)!=len(set(ids)):
    dup=sorted({x for x in ids if ids.count(x)>1})
    fail('duplicate stable IDs in world data: '+repr(dup))

idx=Path('index.html').read_text()
if './world-data-v70.js?v=' not in idx: fail('world lazy group missing')
cloud=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()
for name,text in [('Cloudflare',cloud),('Pages',pages)]:
    if 'world-data-v70.js' not in text or 'dist/' not in text:
        fail(name+' world snapshot must ship in build output')
docs=Path('docs/DATA_SOURCES.md').read_text()
if '`world-data-v70.js` | manual committed snapshot' not in docs:
    fail('world data source documentation missing')
print('v70 world data-layer audit passed')
