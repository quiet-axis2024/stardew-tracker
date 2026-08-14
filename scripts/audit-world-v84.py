from pathlib import Path


def fail(msg):
    raise SystemExit(msg)

idx=Path('index.html').read_text()
nav=Path('world-nav-v83.js').read_text()
life=Path('world-lifecycle-v84.js').read_text()
fish=Path('world-fish-data-v83.js').read_text()
sw=Path('sw-v84.js').read_text()
build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()

for token in ['./world-fish-data-v83.js?v=84','./world-nav-v83.js?v=84','./world-lifecycle-v84.js?v=84','./sw-v84.js','./app.js?v=84','deploy-v84']:
    if token not in idx:
        fail('v84 index missing '+token)
for stale in ['./world-nav-v81.js?v=','./world-entry-reset-v83.js','./sw-v83.js']:
    if stale in idx:
        fail('stale World runtime still loaded: '+stale)

# v83 feature set remains the World body.
for token in ['function fishDetail','data-filter-location','data-link-npc','openNpcLink','data-link-item','openItemLink','function fishResults']:
    if token not in nav:
        fail('linked World feature missing '+token)

# v84 owns mounting/unmounting and title cleanup outside route logic.
for token in ['function cleanupWorld','function hideDuplicateLegacyTitle','function decorateRootTitle','if(!pair){cleanupWorld();return;}','b===pair.item','isBottomNav(b)','restoreHidden(host)']:
    if token not in life:
        fail('v84 lifecycle guard missing '+token)

for token in ["window.SDVWorldFishV83={version:83", "id:'town'", "id:'mine100'", "id:'caldera'"]:
    if token not in fish:
        fail('fish snapshot missing '+token)
if "stardew-tracker-v84" not in sw or 'world-lifecycle-v84.js' not in sw or 'world-nav-v83.js' not in sw:
    fail('v84 service worker cache incomplete')
if 'world-entry-reset-v83.js' in sw:
    fail('v84 service worker still caches obsolete entry reset bridge')

for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v84.py' not in text:
        fail(name+' missing v84 audit')
    for f in ['world-fish-data-v83.js','world-nav-v83.js','world-lifecycle-v84.js','sw-v84.js']:
        if f not in text:
            fail(name+' does not publish '+f)
    if 'world-entry-reset-v83.js' in text or 'sw-v83.js' in text:
        fail(name+' still publishes obsolete v83 lifecycle bridge/cache')

print('v84 World lifecycle isolation audit passed')
