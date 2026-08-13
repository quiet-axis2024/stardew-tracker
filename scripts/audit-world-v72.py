from pathlib import Path

def fail(msg): raise SystemExit(msg)
app=Path('app.jsx').read_text()
need=[
  'const WORLD_REGION_DETAIL_V72 = {',
  'town:"Pelican Town"', 'forest:"CindersapForest"', 'mountain:"The Mountain"', 'beach:"BeachDistances"',
  '← 返回大世界地圖', '世界 ›', '先看完整區域位置',
  'gridTemplateColumns:"repeat(2,minmax(0,1fr))"',
  '不再用放大世界地圖硬猜點位'
]
missing=[x for x in need if x not in app]
if missing: fail('v72 world map clarity invariant missing: '+repr(missing))
# The region selector must no longer place guessed buttons by percent coordinates.
region_block=app[app.find('const renderRegionMapV71'):app.find('const spotRows=',app.find('const renderRegionMapV71'))]
for stale in ['left:`${point[0]}%`','top:`${point[1]}%`','markerPoints[id]']:
    if stale in region_block: fail('guessed region marker remains: '+stale)
idx=Path('index.html').read_text()
if '?v=72' not in idx or 'deploy-v72' not in idx: fail('v72 release marker missing')
if "const CACHE='stardew-tracker-v72';" not in Path('sw.js').read_text(): fail('v72 SW cache missing')
if 'python3 scripts/audit-world-v72.py' not in Path('build-cloudflare.sh').read_text(): fail('Cloudflare v72 audit missing')
print('v72 world map clarity audit passed')
