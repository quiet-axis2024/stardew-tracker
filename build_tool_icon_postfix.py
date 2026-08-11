from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')
old='<GameIcon file={TOOL_ICON_FILES[id]} size={27}/>'
new='<GameIcon file={id==="trash"?({"初始":"Copper Trash Can","銅":"Copper Trash Can","鋼":"Steel Trash Can","金":"Gold Trash Can","銥":"Iridium Trash Can"}[data.tools[id]]||"Copper Trash Can"):TOOL_ICON_FILES[id]} size={27}/>'
if old not in s:
    raise SystemExit('build_tool_icon_postfix: tool icon marker not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('build_tool_icon_postfix: trash can sprite follows upgrade level')
