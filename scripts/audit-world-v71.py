from pathlib import Path

def fail(msg):
    raise SystemExit(msg)

app=Path('app.jsx').read_text()
need=[
    'const WORLD_REGION_MAP_V71 = {',
    'const WORLD_SPOT_REGION_V71 =',
    'const [worldSpotV71, setWorldSpotV71]',
    'const [worldQuickV71, setWorldQuickV71]',
    '大世界地圖',
    '📍 地點',
    '🎣 釣點',
    '按條件找魚',
    '按條件找人',
    'NPC 今日行程完成後啟用',
    'selectWorldSpotV71',
    'renderRegionMapV71',
    'fishMatchesV71',
    'setFishViewV4("world")',
    'setWorldKindV70("spots")',
    'renderWorldV70()'
]
missing=[x for x in need if x not in app]
if missing: fail('v71 world UX invariant missing: '+repr(missing))
for stale in [
    '人物 {regionPeople.length}',
    'openWorldFishV70',
    'fishViewV4==="find"?',
    '返回世界地圖</button>{renderFishFindV4()}'
]:
    if stale in app: fail('stale parallel world/fish UX remains: '+stale)
open_hint=app[app.find('const openFishHintV69'):app.find('const todayFishRowsV69')]
if 'setFishViewV4("world")' not in open_hint or 'setWorldSpotV71(areaId)' not in open_hint:
    fail('Today fish deep-link must land in World fishing spot')

idx=Path('index.html').read_text()
if '?v=71' not in idx or 'deploy-v71' not in idx:
    fail('v71 release query marker missing')
if "const CACHE='stardew-tracker-v71';" not in Path('sw.js').read_text():
    fail('v71 service worker cache missing')
if 'python3 scripts/audit-world-v71.py' not in Path('build-cloudflare.sh').read_text():
    fail('Cloudflare v71 audit missing')
if 'python3 scripts/audit-world-v71.py' not in Path('.github/workflows/pages.yml').read_text():
    fail('Pages v71 audit missing')
print('v71 world region drill-down audit passed')
