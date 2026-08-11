from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# User's actual second pond is the Night Market Spook Fish = 幽靈魚.
s=s.replace('{ fish: "鬼魚", count: 3, cap: 3, need: "尚待下一次擴容需求" }','{ fish: "幽靈魚", count: 3, cap: 3, need: "尚待下一次擴容需求" }',1)
s=s.replace('魚塘：大海參6/7、鬼魚3/3、鱘魚5/5','魚塘：大海參6/7、幽靈魚3/3、鱘魚5/5',1)

# Remove the mistaken compatibility migration that rewrote 幽靈魚 to 鬼魚 on every load.
old='''        try {\n          const parsed=JSON.parse(raw);\n          if(Array.isArray(parsed.ponds)) parsed.ponds=parsed.ponds.map(p=>p?.fish==="幽靈魚"&&String(p?.need||"").includes("尚待下一次擴容需求")?{...p,fish:"鬼魚"}:p);\n          setData({ ...PREFILL, ...parsed });\n        }\n        catch (e) { console.warn("progress parse failed", e); }'''
new='''        try { setData({ ...PREFILL, ...JSON.parse(raw) }); }\n        catch (e) { console.warn("progress parse failed", e); }'''
if old not in s:
    raise SystemExit('mistaken fish migration marker missing')
s=s.replace(old,new,1)

# Selecting a fish should visibly complete the operation immediately.
old_click='''onClick={()=>{const ponds=[...data.ponds];ponds[pondPicker]={...p,fish:name};update({ponds})}}'''
new_click='''onClick={()=>{const ponds=[...data.ponds];ponds[pondPicker]={...p,fish:name};update({ponds});setPondPicker(null)}}'''
if old_click not in s:
    raise SystemExit('pond picker click marker missing')
s=s.replace(old_click,new_click,1)

p.write_text(s,encoding='utf-8')
print('pond fish selection persistence fixed')
