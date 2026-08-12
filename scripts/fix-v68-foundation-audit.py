from pathlib import Path
p=Path('scripts/audit-foundation-v67.py')
s=p.read_text()
s=s.replace('?v=67','?v=68')
p.write_text(s)
print('foundation audit query version aligned to v68')
