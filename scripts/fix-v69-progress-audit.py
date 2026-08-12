from pathlib import Path
p=Path('scripts/audit-progress-link-v68.py')
s=p.read_text()
old='''idx=Path('index.html').read_text()\nif '?v=68' not in idx or 'deploy-v68' not in idx: fail('v68 index version bump missing')\nif "const CACHE='stardew-tracker-v68';" not in Path('sw.js').read_text(): fail('v68 service worker cache bump missing')\nprint('v68 progress linking audit passed')\n'''
new='''print('v68 progress linking audit passed')\n'''
if old not in s:
    raise SystemExit('v68 version-specific audit anchor missing')
p.write_text(s.replace(old,new,1))
print('v68 audit decoupled from release query/cache version')
