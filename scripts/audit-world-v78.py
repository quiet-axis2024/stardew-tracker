from pathlib import Path


def fail(msg):
    raise SystemExit(msg)

pins=Path('world-map-pins-v73.js').read_text()
helper=Path('world-map-secret-v75.js').read_text()
idx=Path('index.html').read_text()

need=[
    "'鹈鹕镇':", "label:'公交车站'",
    "'煤矿森林':", "label:'秘密森林'", "'秘密森林':",
    "'深山':", "label:'铁路'", 'below:true',
    "label:'山湖'", "label:'矿井 20 层'", "label:'矿井 60 层'", "label:'矿井 100 层'",
    "'海滩':", "'卡利科沙漠':", "'下水道':", "'姜岛':",
    "'巫婆沼泽':", "let intent=''", 'sdv-world-pin-layer-v78', 'observer?.disconnect()'
]
missing=[x for x in need if x not in pins]
if missing:
    fail('v78 world route/pin invariant missing: '+repr(missing))
if 'secretWoodsOpen' in pins:
    fail('v78 must not use persistent secretWoodsOpen state')
if 'addEventListener' in helper or 'MutationObserver' in helper:
    fail('v78 Secret Woods helper must be a no-op')
if './world-map-pins-v73.js?v=78' not in idx or './world-map-secret-v75.js?v=78' not in idx:
    fail('v78 world scripts are not cache-busted')
if 'deploy-v78' not in idx:
    fail('v78 deploy marker missing')
print('v78 world route audit passed')
