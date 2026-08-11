from pathlib import Path
import sys

p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')

old='<GameIcon file={TOOL_ICON_FILES[id]} size={27}/>'
new='''<GameIcon file={({
  watering:{"初始":"Watering Can","銅":"Copper Watering Can","鋼":"Steel Watering Can","金":"Gold Watering Can","銥":"Iridium Watering Can"},
  pickaxe:{"初始":"Pickaxe","銅":"Copper Pickaxe","鋼":"Steel Pickaxe","金":"Gold Pickaxe","銥":"Iridium Pickaxe"},
  axe:{"初始":"Axe","銅":"Copper Axe","鋼":"Steel Axe","金":"Gold Axe","銥":"Iridium Axe"},
  hoe:{"初始":"Hoe","銅":"Copper Hoe","鋼":"Steel Hoe","金":"Gold Hoe","銥":"Iridium Hoe"},
  trash:{"初始":"Trash Can","銅":"Copper Trash Can","鋼":"Steel Trash Can","金":"Gold Trash Can","銥":"Iridium Trash Can"}
}[id]?.[data.tools[id]] || TOOL_ICON_FILES[id])} size={27}/>'''

if old not in s:
    # Backward compatibility if an earlier trash-only postfix has already been applied.
    old='<GameIcon file={id==="trash"?({"初始":"Copper Trash Can","銅":"Copper Trash Can","鋼":"Steel Trash Can","金":"Gold Trash Can","銥":"Iridium Trash Can"}[data.tools[id]]||"Copper Trash Can"):TOOL_ICON_FILES[id]} size={27}/>'
if old not in s:
    raise SystemExit('build_tool_icon_postfix: tool icon marker not found')

s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('build_tool_icon_postfix: all tool sprites follow upgrade level')
