from pathlib import Path


def fail(msg):
    raise SystemExit(msg)

idx=Path('index.html').read_text()
life=Path('world-lifecycle-v84.js').read_text()
nav=Path('world-nav-v83.js').read_text()
sw=Path('sw-v85.js').read_text()
build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()

for token in ['./world-lifecycle-v84.js?v=85','./sw-v85.js','./app.js?v=85','deploy-v85']:
    if token not in idx:
        fail('v85 index missing '+token)
if './sw-v84.js' in idx:
    fail('v84 service worker still registered')

for token in ['function decorateRegionTitle','mapImg?.currentSrc','width:30px;height:30px','function focusNpcCard','scrollIntoView({block:\'center\'','b.dataset.linkNpc','setTimeout(()=>focusNpcCard(raw),360)']:
    if token not in life:
        fail('v85 title/NPC fix missing '+token)
for token in ['data-link-npc','openNpcLink']:
    if token not in nav:
        fail('world NPC link missing '+token)
if "stardew-tracker-v85" not in sw or 'world-lifecycle-v84.js' not in sw:
    fail('v85 service worker cache incomplete')

for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v85.py' not in text:
        fail(name+' missing v85 audit')
    if 'node --check sw-v85.js' not in text:
        fail(name+' missing sw-v85 syntax check')
    if 'sw-v85.js' not in text:
        fail(name+' does not publish sw-v85.js')

print('v85 title thumbnails and NPC focus audit passed')