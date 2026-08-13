from pathlib import Path
import re

def fail(msg): raise SystemExit(msg)

data=Path('world-map-data-v78.js').read_text()
ui=Path('world-map-ui-v78.js').read_text()
extra=Path('world-extra-v78.js').read_text()
idx=Path('index.html').read_text()
required=["'鹈鹕镇':","label:'巴士站'","'煤矿森林':","submap:'secret_woods'","'秘密森林':","'深山':","label:'铁路'","label:'山湖'","submap:'mines_fishing'","'矿井钓点':","match:['矿井','20 层']","match:['矿井','60 层']","match:['矿井','100 层']","'海滩':","'卡利科沙漠':","'下水道':","'姜岛':","MinesDistances.png","SecretWoods.png"]
missing=[x for x in required if x not in data]
if missing: fail('v78 world route coverage missing: '+repr(missing))
if 'activeCard=null' not in ui or "activeSubmap=''" not in ui: fail('deterministic route reset missing')
if 'secretWoodsOpen' in ui or 'wantsSecret' in ui: fail('sticky Secret Woods state forbidden')
for token in ["id:'bus_stop'","regionId:'town'","name:'巴士站'"]:
    if token not in extra: fail('bus stop stable entity missing '+token)
for token in ['world-map-data-v78.js?v=78','world-map-ui-v78.js?v=78','world-extra-v78.js?v=78']:
    if token not in idx: fail('index missing '+token)
if 'world-map-pins-v73.js?v=' in idx or 'world-map-secret-v75.js?v=' in idx: fail('legacy map runtime still loaded')
for name,text in [('Cloudflare',Path('build-cloudflare.sh').read_text()),('Pages',Path('.github/workflows/pages.yml').read_text())]:
    if 'python3 scripts/audit-world-routes-v78.py' not in text: fail(name+' v78 audit missing')
    for token in ['world-extra-v78.js','world-map-data-v78.js','world-map-ui-v78.js']:
        if token not in text: fail(name+' missing publish '+token)
print('v78 world route sweep audit passed')
