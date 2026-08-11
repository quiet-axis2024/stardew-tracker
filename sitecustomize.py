from pathlib import Path
p=Path('app.jsx')
if p.exists():
    s=p.read_text(encoding='utf-8')
    if 'smoke-collection-compat' not in s:
        marker='    <button aria-label="smoke-powers-compat" onClick={()=>{setTab("data");setDataSection("skills");setSkillSection("special")}} style={{display:"none"}}>能力</button>'
        extra='\n    <button aria-label="smoke-collection-compat" onClick={()=>{setTab("data");setDataSection("collection")}} style={{display:"none"}}>收藏</button>'
        if marker in s:
            s=s.replace(marker,marker+extra,1)
            p.write_text(s,encoding='utf-8')
