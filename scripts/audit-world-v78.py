from pathlib import Path


def fail(msg):
    raise SystemExit(msg)

pins=Path('world-map-pins-v73.js').read_text()
world=Path('world-data-v70.js').read_text()
idx=Path('index.html').read_text()
sw=Path('sw.js').read_text()
helper=Path('world-map-secret-v75.js').read_text()

for token in [
    "'鹈鹕镇':{", "{label:'公交车站'", "{label:'社区中心'",
    "'煤矿森林':{", "{label:'秘密森林'", "'秘密森林':{",
    "'深山':{", "{label:'铁路'", "below:true",
    "{label:'山湖'", "{label:'矿井 20 层'", "{label:'矿井 60 层'", "{label:'矿井 100 层'",
    "'海滩':{", "'卡利科沙漠':{", "'下水道':{", "'姜岛':{",
    "ROOT_REGION_LABELS", "observer?.disconnect()",
    'img[alt$="區域地圖"]', 'sdv-world-pin-layer-v73', 'target.click()'
]:
    if token not in pins:
        fail('v78 world route/pin invariant missing: '+token)

for token in ['id:"bus_stop"','name:"公交车站"','regionId:"town"']:
    if token not in world:
        fail('v78 bus-stop world data missing: '+token)

if 'addEventListener' in helper or 'MutationObserver' in helper:
    fail('v78 Secret Woods helper must remain a no-op')

if './world-map-pins-v73.js?v=78' not in idx or './world-map-secret-v75.js?v=78' not in idx:
    fail('v78 world scripts are not cache-busted in index.html')
if 'world-data-v70.js?v=78' not in idx:
    fail('v78 world data cache key missing')
if "const CACHE='stardew-tracker-v78';" not in sw:
    fail('v78 service-worker cache missing')

build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()
for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v78.py' not in text:
        fail(name+' v78 route audit missing')

print('v78 world route audit passed')
