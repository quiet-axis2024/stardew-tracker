from pathlib import Path
import re

def fail(msg): raise SystemExit(msg)

pins=Path('world-map-pins-v73.js').read_text()
for token in ["'煤矿森林':", "label:'玛妮的牧场'", "label:'法师塔'", "label:'旅行货车'", "label:'秘密森林'", "label:'池塘'", "label:'河流'", "label:'南部瀑布'", "label:'南部小岛'", 'img[alt$="區域地圖"]', 'observer?.disconnect()']:
    if token not in pins: fail('world map pin invariant missing: '+token)
if 'sdv-world-pin-layer-v73' not in pins and 'sdv-world-pin-layer-v78' not in pins:
    fail('world map pin layer missing')
if 'sdv-world-pin-v73--spot' not in pins and 'sdv-world-pin-v78--spot' not in pins:
    fail('world fishing pin style missing')
if 'target.click()' not in pins and '.click()' not in pins:
    fail('world pin action missing')
if 'WORLD_REGION_MAP_V71' in pins: fail('pin overlay must not depend on old world-map coordinates')

idx=Path('index.html').read_text()
if not re.search(r'\./world-map-pins-v73\.js\?v=\d+', idx): fail('pin overlay is not loaded by index.html')
if not re.search(r'deploy-v\d+', idx): fail('release marker missing')

sw=Path('sw.js').read_text()
if "'./world-map-pins-v73.js'" not in sw: fail('pin overlay missing from SW core cache')

build=Path('build-cloudflare.sh').read_text()
workflow=Path('.github/workflows/pages.yml').read_text()
for name,text in [('Cloudflare',build),('Pages',workflow)]:
    if 'python3 scripts/audit-world-v73.py' not in text: fail(name+' v73 audit missing')
    if 'world-map-pins-v73.js' not in text: fail(name+' does not publish pin overlay')
print('world calibrated region map pin audit passed')
