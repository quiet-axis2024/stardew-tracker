from pathlib import Path
p=Path('scripts/audit-foundation-v67.py')
s=p.read_text()
if '?v=67' in s:
    s=s.replace('?v=67','?v=68')
    p.write_text(s)
print('foundation audit is aligned with v68')
