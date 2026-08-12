from pathlib import Path
p=Path('app.jsx')
s=p.read_text()
old='const checked=roomDone(room)||gotRaw.includes(it)'
new='const checked=roomExplicitDoneV68(room)||gotRaw.includes(it)'
if old not in s:
    raise SystemExit('bundle checked anchor missing')
s=s.replace(old,new,1)
old='const panLevel=data.tools?.pan||(progressFactV68("panning")?"銅":"未取得");'
new='const storedPanV68=data.tools?.pan||"";\n    const panLevel=storedPanV68&&storedPanV68!=="未取得"?storedPanV68:(progressFactV68("panning")?"銅":"未取得");'
if old not in s:
    raise SystemExit('pan level anchor missing')
s=s.replace(old,new,1)
p.write_text(s)
print('v68 final UX fixes applied')
