from pathlib import Path

def fail(msg): raise SystemExit(msg)
app=Path('app.jsx').read_text(); pins=Path('world-map-pins-v73.js').read_text(); fix=Path('world-route-fixes-v79.js').read_text(); extra=Path('world-extra-v79.js').read_text(); idx=Path('index.html').read_text()
for x in ["'鹈鹕镇':","'煤矿森林':","'秘密森林':","'海滩':","'深山':","'姜岛':","'卡利科沙漠':","'下水道':","'巫婆沼泽':","label:'矿井 20 层'","label:'矿井 60 层'","label:'矿井 100 层'"]:
    if x not in pins: fail('base route missing '+x)
for x in ['礦井外湖泊','MinesDistances.png','矿井钓点','铁路',"18%",'SecretWoods']:
    if x not in fix: fail('route fix missing '+x)
for x in ["id:'bus_stop'","regionId:'town'","name:'公交车站'"]:
    if x not in extra: fail('bus stop missing '+x)
for x in ['id:"mountain"','id:"mine20"','id:"mine60"','id:"mine100"']:
    if x not in app: fail('fish route source missing '+x)
for x in ['./world-route-fixes-v79.js?v=79','./world-extra-v79.js?v=79','deploy-v79']:
    if x not in idx: fail('release load missing '+x)
print('v79 World route sweep audit passed')
