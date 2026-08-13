from pathlib import Path
p=Path('scripts/audit-foundation-v67.py')
s=p.read_text()
old='''for src in ['wardrobe-data-v34.js','lookup-data-v46.js','lookup-extra-v49.js']:\n    if f'<script src="./{src}?v=69"' in idx: fail('heavy data still parser-blocking: '+src)\nfor src in ['cloud.js','social-data-v50.js','machine-data-v51.js','switch-names-v47.js']:\n    if f'<script src="./{src}?v=69"' not in idx: fail('required eager script missing: '+src)\n'''
new='''for src in ['wardrobe-data-v34.js','lookup-data-v46.js','lookup-extra-v49.js']:\n    if f'<script src="./{src}?v=' in idx: fail('heavy data still parser-blocking: '+src)\nfor src in ['cloud.js','social-data-v50.js','machine-data-v51.js','switch-names-v47.js']:\n    if f'<script src="./{src}?v=' not in idx: fail('required eager script missing: '+src)\n'''
if old not in s:
    raise SystemExit('foundation version-specific anchor missing')
p.write_text(s.replace(old,new,1))
print('v67 foundation audit decoupled from current release query')
