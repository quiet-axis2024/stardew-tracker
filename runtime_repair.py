from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
marker='/* deploy-v28 */'
if marker not in s:
    s=s.rstrip()+"\n\n"+marker+"\n"
    p.write_text(s,encoding='utf-8')
print('v28 deploy marker ready')
