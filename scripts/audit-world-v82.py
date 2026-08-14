from pathlib import Path

def fail(msg): raise SystemExit(msg)
idx=Path('index.html').read_text(); ui=Path('world-nav-v82.js').read_text(); data=Path('world-nav-data-v81.js').read_text(); island=Path('world-nav-island-v81.js').read_text(); build=Path('build-cloudflare.sh').read_text(); pages=Path('.github/workflows/pages.yml').read_text()
for x in ['./world-nav-v82.js?v=82','./sw-v82.js','deploy-v82']:
    if x not in idx: fail('v82 index missing '+x)
if './world-nav-v81.js?v=' in idx: fail('v81 UI still executing')
for x in ["kind:'place'","kind:'portal'","kind:'fish'",'...(o.spots||[])','地点说明','相关 NPC','商店','SDVSocialV50','SDVSwitchNamesV47']:
    if x not in ui: fail('unified World UI missing '+x)
for x in ['mode-place','mode-fish','sdv82-mode']:
    if x in ui: fail('obsolete place/fish mode remains '+x)
for x in ["root:'world'","to:'secret_woods'","to:'desert'","to:'mines'","fishAreaId:'secret'","fishAreaId:'mine20'"]:
    if x not in data: fail('route graph missing '+x)
for x in ["id:'ginger_island'","fishAreaId:'caldera'"]:
    if x not in island: fail('island graph missing '+x)
for name,text in [('Cloudflare',build),('Pages',pages)]:
    if 'python3 scripts/audit-world-v82.py' not in text: fail(name+' missing v82 audit')
    for f in ['world-nav-v82.js','sw-v82.js']:
        if f not in text: fail(name+' missing '+f)
print('v82 unified World pins audit passed')
