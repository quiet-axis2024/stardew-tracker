from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')
s=s.replace('opacity:auto?.75:1','opacity:auto?0.75:1')
p.write_text(s,encoding='utf-8')
print('build_fix_patch: generated JSX syntax fixed')
