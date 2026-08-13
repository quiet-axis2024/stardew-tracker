from pathlib import Path
import re

def fail(msg): raise SystemExit(msg)

idx=Path('index.html').read_text()
build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()

# v78 supersedes the old v73 executable overlay with split data/runtime files.
if 'world-map-ui-v78.js' in idx:
    for token in ['world-map-data-v78.js?v=78','world-map-ui-v78.js?v=78']:
        if token not in idx: fail('v78 map runtime missing '+token)
    if not re.search(r'deploy-v\d+',idx): fail('release marker missing')
    print('v73 pin invariant superseded by v78 audited runtime')
else:
    pins=Path('world-map-pins-v73.js').read_text()
    need=['const PIN_CONFIG={',"'煤矿森林':{",'img[alt$="區域地圖"]','sdv-world-pin-layer-v73','sdv-world-pin-v73--spot','target.click()','observer?.disconnect()']
    missing=[x for x in need if x not in pins]
    if missing: fail('v73 calibrated map pin invariant missing: '+repr(missing))
    if 'WORLD_REGION_MAP_V71' in pins: fail('v73 pin overlay must not depend on old world-map coordinates')
    if not re.search(r'\./world-map-pins-v73\.js\?v=\d+',idx): fail('v73 pin overlay is not loaded by index.html')
    sw=Path('sw.js').read_text()
    if "'./world-map-pins-v73.js'" not in sw: fail('v73 pin overlay missing from SW core cache')

for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v73.py' not in text: fail(name+' v73 audit missing')
print('v73 world map audit passed')
