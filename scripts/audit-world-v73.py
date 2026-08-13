from pathlib import Path
import re

def fail(msg): raise SystemExit(msg)

idx=Path('index.html').read_text()
build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()

if 'world-map-ui-v78.js' in idx:
    for token in ['assets/world-map-data-v78.js?v=78','assets/world-map-ui-v78.js?v=78','assets/world-extra-v78.js?v=78']:
        if token not in idx: fail('v78 map runtime missing '+token)
    data=Path('assets/world-map-data-v78.js').read_text()
    ui=Path('assets/world-map-ui-v78.js').read_text()
    extra=Path('assets/world-extra-v78.js').read_text()
    required=["'鹈鹕镇':","label:'巴士站'","'煤矿森林':","submap:'secret_woods'","'秘密森林':","'海滩':","'深山':","label:'铁路'","label:'山湖'","submap:'mines_fishing'","'矿井钓点':","match:['矿井','20 层']","match:['矿井','60 层']","match:['矿井','100 层']","'姜岛':","'卡利科沙漠':","'下水道':","MinesDistances.png","SecretWoods.png"]
    missing=[x for x in required if x not in data]
    if missing: fail('v78 route coverage missing '+repr(missing))
    if 'activeCard=null' not in ui or "activeSubmap=''" not in ui: fail('v78 deterministic route reset missing')
    if 'secretWoodsOpen' in ui or 'wantsSecret' in ui: fail('v78 sticky Secret Woods state forbidden')
    for token in ["id:'bus_stop'","regionId:'town'","name:'巴士站'"]:
        if token not in extra: fail('v78 bus stop stable entity missing '+token)
    if not re.search(r'deploy-v78',idx): fail('v78 release marker missing')
else:
    pins=Path('world-map-pins-v73.js').read_text()
    need=['const PIN_CONFIG={',"'煤矿森林':{",'img[alt$="區域地圖"]','sdv-world-pin-layer-v73','sdv-world-pin-v73--spot','target.click()','observer?.disconnect()']
    missing=[x for x in need if x not in pins]
    if missing: fail('v73 calibrated map pin invariant missing: '+repr(missing))
    if 'WORLD_REGION_MAP_V71' in pins: fail('v73 pin overlay must not depend on old world-map coordinates')
    if not re.search(r'\./world-map-pins-v73\.js\?v=\d+',idx): fail('v73 pin overlay is not loaded by index.html')

for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v73.py' not in text: fail(name+' v73 audit missing')
    if 'cp -R assets dist/' not in text: fail(name+' must publish assets directory')
print('v78/v73 world route audit passed')
