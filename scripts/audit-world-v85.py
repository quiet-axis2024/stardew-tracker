from pathlib import Path


def fail(msg):
    raise SystemExit(msg)

idx=Path('index.html').read_text()
life=Path('world-lifecycle-v85.js').read_text()
sw=Path('sw-v85.js').read_text()
build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()

for token in ['./world-lifecycle-v85.js?v=85','./sw-v85.js','deploy-v85']:
    if token not in idx:
        fail('v85 index missing '+token)
for stale in ['./world-lifecycle-v84.js?v=84','./sw-v84.js']:
    if stale in idx:
        fail('stale World title runtime still loaded: '+stale)

for token in ['function decorateRegionTitle','sdv85-title-thumb','root.querySelector(\'.sdv83-map>img\')','object-fit:cover']:
    if token not in life:
        fail('v85 region title icon logic missing '+token)
if "stardew-tracker-v85" not in sw or 'world-lifecycle-v85.js' not in sw:
    fail('v85 service worker cache incomplete')

for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v85.py' not in text:
        fail(name+' missing v85 audit')
    for f in ['world-lifecycle-v85.js','sw-v85.js']:
        if f not in text:
            fail(name+' does not publish '+f)

print('v85 World title thumbnail audit passed')