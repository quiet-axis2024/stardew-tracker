from pathlib import Path


def fail(msg):
    raise SystemExit(msg)

idx=Path('index.html').read_text()
life=Path('world-lifecycle-v86.js').read_text()
nav=Path('world-nav-v83.js').read_text()
sw=Path('sw-v86.js').read_text()
build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()

for token in ['./world-lifecycle-v86.js?v=86','./sw-v86.js','deploy-v86']:
    if token not in idx:
        fail('v86 index missing '+token)
if './world-lifecycle-v85.js?v=85' in idx or './sw-v85.js' in idx:
    fail('stale v85 lifecycle/cache still loaded')

for token in ['function decorateRegionTitle','sdv85-title-thumb','function focusNpcCard','scrollIntoView({block:\'center\'','b.dataset.linkNpc','setTimeout(()=>focusNpcCard(raw),360)']:
    if token not in life:
        fail('v86 lifecycle feature missing '+token)
for token in ['data-link-npc','openNpcLink']:
    if token not in nav:
        fail('World NPC cross-link missing '+token)
if "stardew-tracker-v86" not in sw or 'world-lifecycle-v86.js' not in sw:
    fail('v86 service worker cache incomplete')

for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v86.py' not in text:
        fail(name+' missing v86 audit')
    if 'node --check world-lifecycle-v86.js' not in text or 'node --check sw-v86.js' not in text:
        fail(name+' missing v86 syntax checks')
    if 'world-lifecycle-v86.js' not in text or 'sw-v86.js' not in text:
        fail(name+' does not publish v86 runtime')

print('v86 World NPC focus audit passed')