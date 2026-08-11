from pathlib import Path
import sys

p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')
marker='  const derivedAchievement = id => {'
if marker not in s:
    raise SystemExit('build_collection_link_patch: derivedAchievement marker not found')
s=s.replace(marker, marker + '''\n    if(id==="cook10")return (data.cookingCollectionV3||[]).length>=10;\n    if(id==="cook25")return (data.cookingCollectionV3||[]).length>=25;\n    if(id==="cookall")return (data.cookingCollectionV3||[]).length>=COOKING_DISHES_V3.length;''',1)
p.write_text(s,encoding='utf-8')
print('build_collection_link_patch: cooking checklist drives cooking achievements')
