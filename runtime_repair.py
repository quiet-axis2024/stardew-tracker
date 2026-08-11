from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# 1) Collection index 25 is Ghostfish = 鬼魚; index 63 remains Spook Fish = 幽靈魚.
old='''      "魷魚", "海草", "綠藻", "海參", "大海參", "幽靈魚", "白藻", "石魚", "緋紅魚", "安康魚",'''
new='''      "魷魚", "海草", "綠藻", "海參", "大海參", "鬼魚", "白藻", "石魚", "緋紅魚", "安康魚",'''
if old not in s: raise SystemExit('Ghostfish collection-name marker missing')
s=s.replace(old,new,1)

# 2) The tracker prefilled pond was the mine Ghostfish, not the Night Market Spook Fish.
s=s.replace('{ fish: "幽靈魚", count: 3, cap: 3, need: "尚待下一次擴容需求" }','{ fish: "鬼魚", count: 3, cap: 3, need: "尚待下一次擴容需求" }',1)
s=s.replace('魚塘：大海參6/7、幽靈魚3/3、鱘魚5/5','魚塘：大海參6/7、鬼魚3/3、鱘魚5/5',1)

# 3) Fish-pond products: Ghostfish and Spook Fish are distinct species.
old_map='''      "幽靈魚":[[1,"White Roe","魚籽"],[3,"Quartz","石英"],[9,"White Algae","白藻"],[9,"Refined Quartz","精煉石英"],[9,"Pale Broth","清湯"]],'''
new_map='''      "鬼魚":[[1,"White Roe","魚籽"],[3,"Quartz","石英"],[9,"White Algae","白藻"],[9,"Refined Quartz","精煉石英"],[9,"Pale Broth","清湯"]],\n      "幽靈魚":[[1,"Blue Roe","魚籽"],[9,"Treasure Chest","財寶箱"]],'''
if old_map not in s: raise SystemExit('pond Ghostfish product marker missing')
s=s.replace(old_map,new_map,1)

# 4) One-time compatibility migration for the user's old seeded pond.
old_load='''        try { setData({ ...PREFILL, ...JSON.parse(raw) }); }\n        catch (e) { console.warn("progress parse failed", e); }'''
new_load='''        try {\n          const parsed=JSON.parse(raw);\n          if(Array.isArray(parsed.ponds)) parsed.ponds=parsed.ponds.map(p=>p?.fish==="幽靈魚"&&String(p?.need||"").includes("尚待下一次擴容需求")?{...p,fish:"鬼魚"}:p);\n          setData({ ...PREFILL, ...parsed });\n        }\n        catch (e) { console.warn("progress parse failed", e); }'''
if old_load not in s: raise SystemExit('load migration marker missing')
s=s.replace(old_load,new_load,1)

p.write_text(s,encoding='utf-8')
print('Ghostfish=鬼魚 and Spook Fish=幽靈魚 corrected')
