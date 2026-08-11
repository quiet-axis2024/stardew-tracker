from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')
s=s.replace('opacity:got?.78:1','opacity:got?0.78:1')
p.write_text(s,encoding='utf-8')
print('build_fish_guide_fix: generated JSX syntax fixed')
