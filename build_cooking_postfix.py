from pathlib import Path
import sys

p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')

# Let cooking achievements follow the actual 81-recipe checklist added by build_cooking_collection_patch.py.
marker='  const derivedAchievement = id => {'
if marker not in s:
    raise SystemExit('build_cooking_postfix: derivedAchievement marker not found')
s=s.replace(marker, marker + '''\n    if(id==="cook10")return (data.cookedRecipesV3||[]).length>=10;\n    if(id==="cook25")return (data.cookedRecipesV3||[]).length>=25;\n    if(id==="cookall")return (data.cookedRecipesV3||[]).length>=COOKING_RECIPES_V3.length;''', 1)

# Stable Wiki links for paper details. Image-type notes/scraps are shown directly in the app.
old='href={`${baseUrl}#${isNote?`Secret_Note_#${selected}`:`Journal_Scrap_#${selected}`}`}'
if old in s:
    s=s.replace(old,'href={baseUrl}',1)

p.write_text(s,encoding='utf-8')
print('build_cooking_postfix: cooking achievements and paper links aligned')
