from pathlib import Path


def fail(msg):
    raise SystemExit(msg)

idx=Path('index.html').read_text()
nav=Path('world-nav-v83.js').read_text()
entry=Path('world-entry-reset-v83.js').read_text()
fish=Path('world-fish-data-v83.js').read_text()
sw=Path('sw-v83.js').read_text()
build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()

for token in ['./world-fish-data-v83.js?v=83','./world-nav-v83.js?v=83','./world-entry-reset-v83.js?v=83','./sw-v83.js','deploy-v83','./app.js?v=83']:
    if token not in idx:
        fail('v83 index missing '+token)
for stale in ['./world-nav-v81.js?v=','./sw-v81.js']:
    if stale in idx:
        fail('legacy World runtime still loaded: '+stale)

# Fish pins open real water data directly; global condition search owns an explicit location filter.
for token in ['function fishDetail','直接顯示這個水域的魚','data-filter-location','地点是独立筛选条件','function fishResults','data-goto-area']:
    if token not in nav:
        fail('direct/global fish UX missing '+token)
# World is linked to the existing Social and Item pages.
for token in ['data-link-npc','openNpcLink','點擊前往社交人物卡','data-link-item','openItemLink','物品詳細卡']:
    if token not in nav:
        fail('cross-page World link missing '+token)
# Shop rows have an image and canonical-name resolver instead of plain English text-only rows.
for token in ['function itemMeta','ITEM_ZH','sdv83-shop-item','<img src=','window.SDVLookupV46']:
    if token not in nav:
        fail('shop item card enrichment missing '+token)
# Re-entering 查找 → 世界 resets both the standalone route and the hidden legacy React route.
for token in ["lookupTopButton('世界')===b",'function resetWorld','state.stack=[D.root]','hideLegacy(host)']:
    if token not in nav:
        fail('World reset/legacy isolation missing '+token)
for token in ['isLookupWorld','legacyBack','返回大世界地圖','setTimeout(()=>{const back=legacyBack();if(back)back.click()}']:
    if token not in entry:
        fail('legacy World entry reset bridge missing '+token)

for token in ["window.SDVWorldFishV83={version:83", "id:'town'", "id:'mine100'", "id:'caldera'", "id:'all',name:'全世界'", "id:'island',name:'姜岛'"]:
    if token not in fish:
        fail('v83 fish snapshot missing '+token)
for token in ['stardew-tracker-v83','world-fish-data-v83.js','world-nav-v83.js','world-entry-reset-v83.js']:
    if token not in sw:
        fail('v83 service worker cache incomplete: '+token)

for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v83.py' not in text:
        fail(name+' missing v83 audit')
    for f in ['world-fish-data-v83.js','world-nav-v83.js','world-entry-reset-v83.js','sw-v83.js']:
        if f not in text:
            fail(name+' does not publish '+f)

print('v83 linked World navigation audit passed')
