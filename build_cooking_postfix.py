from pathlib import Path
import sys

p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')

# Legacy compatibility patch. Newer cooking/collection patches may already have
# replaced the old derivedAchievement block, so missing markers are not fatal.
marker='  const derivedAchievement = id => {'
if marker in s:
    s=s.replace(marker, marker + '''\n    if(id==="cook10")return (data.cookedRecipesV3||[]).length>=10;\n    if(id==="cook25")return (data.cookedRecipesV3||[]).length>=25;\n    if(id==="cookall")return (data.cookedRecipesV3||[]).length>=COOKING_RECIPES_V3.length;''', 1)
else:
    print('build_cooking_postfix: legacy derivedAchievement block already replaced; skipping achievement insertion')

old='href={`${baseUrl}#${isNote?`Secret_Note_#${selected}`:`Journal_Scrap_#${selected}`}`}'
if old in s:
    s=s.replace(old,'href={baseUrl}',1)

p.write_text(s,encoding='utf-8')
print('build_cooking_postfix: compatibility pass complete')
