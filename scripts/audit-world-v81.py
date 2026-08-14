from pathlib import Path


def fail(msg):
    raise SystemExit(msg)

idx=Path('index.html').read_text()
data=Path('world-nav-data-v81.js').read_text()
island=Path('world-nav-island-v81.js').read_text()
ui=Path('world-nav-v81.js').read_text()
build=Path('build-cloudflare.sh').read_text()
pages=Path('.github/workflows/pages.yml').read_text()

for token in ['./world-nav-data-v81.js?v=82','./world-nav-island-v81.js?v=82','./world-nav-v81.js?v=82','./sw-v81.js','deploy-v82']:
    if token not in idx: fail('v82 index missing '+token)
for retired in ['world-map-pins-v73.js?v=','world-map-secret-v75.js?v=','world-route-fixes-v79.js?v=']:
    if retired in idx: fail('legacy world overlay still executes: '+retired)

for token in ["root:'world'","label:'煤矿森林'","label:'公交站'","label:'鹈鹕镇'","label:'郊外／深山'","label:'海滩'","label:'下水道'"]:
    if token not in data: fail('root route missing '+token)
for token in ["to:'secret_woods'","to:'sewer'","to:'desert'","to:'mines'","to:'railroad'","to:'quarry'","to:'ginger_island'","to:'mutant_bug_lair'","to:'witch_swamp'"]:
    if token not in data: fail('nested route missing '+token)
for token in ["id:'secret_woods'","fishAreaId:'secret'","id:'mines'","fishAreaId:'mine20'","fishAreaId:'mine60'","fishAreaId:'mine100'"]:
    if token not in data: fail('fishing ownership missing '+token)
for token in ["id:'ginger_island'","to:'island_south'","to:'island_north'","to:'island_west'","to:'island_southeast'","to:'volcano'","fishAreaId:'caldera'"]:
    if token not in island: fail('island route missing '+token)

# v82 renders all map layers at once and enriches place details from shared data.
for token in ["stack:[D.root]","state.stack.push","state.stack.pop","kind:'place'","kind:'portal'","kind:'fish'","...(o.spots||[])",'地点说明','相关 NPC','商店','SDVSocialV50','SDVSwitchNamesV47']:
    if token not in ui: fail('v82 unified runtime missing '+token)
for obsolete in ['state.mode','mode-place','mode-fish','sdv81-mode']:
    if obsolete in ui: fail('obsolete place/fish toggle remains '+obsolete)
for forbidden in ['insertBefore(', 'replaceChild(', 'removeChild(']:
    if forbidden in ui: fail('World runtime must not move/remove React-owned DOM: '+forbidden)

for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v81.py' not in text: fail(name+' does not run current World audit')
    for f in ['world-nav-data-v81.js','world-nav-island-v81.js','world-nav-v81.js','sw-v81.js']:
        if f not in text: fail(name+' does not publish '+f)
print('v82 unified route-graph World audit passed')
