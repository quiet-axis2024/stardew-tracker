from pathlib import Path
import re

def fail(msg): raise SystemExit(msg)

pins=Path('world-map-pins-v73.js').read_text()
need=[
  'const PIN_CONFIG={',
  "'煤矿森林':{", "{label:'玛妮的牧场'", "{label:'法师塔'", "{label:'旅行货车'", "{label:'秘密森林'",
  "{label:'池塘'", "{label:'河流'", "{label:'南部瀑布'", "{label:'南部小岛'",
  'img[alt$="區域地圖"]', 'sdv-world-pin-layer-v73', 'sdv-world-pin-v73--spot',
  "target.click()", 'observer?.disconnect()'
]
missing=[x for x in need if x not in pins]
if missing: fail('v73 calibrated map pin invariant missing: '+repr(missing))
# The calibrated layer must not re-enable v71's WORLD_REGION_MAP_V71 coordinates.
if 'WORLD_REGION_MAP_V71' in pins: fail('v73 pin overlay must not depend on old world-map coordinates')

idx=Path('index.html').read_text()
if not re.search(r'\./world-map-pins-v73\.js\?v=\d+', idx): fail('v73 pin overlay is not loaded by index.html')
if not re.search(r'deploy-v\d+', idx): fail('release marker missing')

sw=Path('sw.js').read_text()
if "const CACHE='stardew-tracker-v73';" not in sw: fail('v73 SW cache missing')
if "'./world-map-pins-v73.js'" not in sw: fail('v73 pin overlay missing from SW core cache')

build=Path('build-cloudflare.sh').read_text()
workflow=Path('.github/workflows/pages.yml').read_text()
for name,text in [('Cloudflare',build),('Pages',workflow)]:
    if 'python3 scripts/audit-world-v73.py' not in text: fail(name+' v73 audit missing')
    if 'world-map-pins-v73.js' not in text: fail(name+' does not publish v73 pin overlay')
print('v73 calibrated region map pin audit passed')
