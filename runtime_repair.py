from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
old='gridTemplateColumns:"repeat(6,minmax(0,1fr))"'
new='gridTemplateColumns:"repeat(5,minmax(0,1fr))"'
if old not in s:
    raise SystemExit('bottom nav six-column marker missing')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('bottom nav aligned to five visible tabs')
