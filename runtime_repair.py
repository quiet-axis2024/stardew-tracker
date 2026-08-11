from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
marker='/* deploy-v20 */'
if marker not in s:
    p.write_text(s+'\n'+marker+'\n',encoding='utf-8')
print('v20 deploy marker ready')
