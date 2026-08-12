from pathlib import Path
import re

app_path=Path('app.jsx')
app=app_path.read_text(encoding='utf-8')

# 1) Preview helper copy: keep it purely functional.
old_tip='同一方向同時看白天／夜晚；使用固定整數像素倍率，不再把角色硬撐大。'
new_tip='點上方四個方向切換；下方同步預覽白天／夜晚效果。'
if old_tip not in app:
    raise SystemExit('preview tip marker not found')
app=app.replace(old_tip,new_tip,1)

# 2) Move the character appearance controls before the preview card.
appearance_pattern=re.compile(
    r'(?P<block>        <Card style=\{\{marginTop:7,padding:7\}\}>\n'
    r'          <div style=\{\{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6\}\}><b style=\{\{fontSize:9\.2,color:C\.brown\}\}>角色外觀</b>.*?\n'
    r'        </Card>\n)',
    re.S,
)
m=appearance_pattern.search(app)
if not m:
    raise SystemExit('appearance block not found')
appearance=m.group('block')
app=app[:m.start()]+app[m.end():]
preview_marker='      <Card style={{marginTop:7,padding:8}}>\n        {(wardrobeTargetV30==="cat"||wardrobeTargetV30==="dog")&&'
if preview_marker not in app:
    raise SystemExit('preview card marker not found')
insert='      {wardrobeTargetV30==="player"&&<>\n'+appearance+'      </>}\n\n'
app=app.replace(preview_marker,insert+preview_marker,1)

# 3) Non-tailoring cards should show a short acquisition hint so they don't look empty.
card_name='''<div style={{fontSize:7.9,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.12,marginTop:2,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{name}</div><div style={{display:"flex",justifyContent:"center",gap:3,marginTop:3}}>'''
card_name_new='''<div style={{fontSize:7.9,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.12,marginTop:2,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{name}</div>{!meta?.recipe&&source&&<div style={{fontSize:6.8,color:C.muted,lineHeight:1.18,marginTop:2,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{source}</div>}<div style={{display:"flex",justifyContent:"center",gap:3,marginTop:3}}>'''
if card_name not in app:
    raise SystemExit('wardrobe card name marker not found')
app=app.replace(card_name,card_name_new,1)

# 4) Bump cache/version references.
app_path.write_text(app,encoding='utf-8')

index_path=Path('index.html')
index=index_path.read_text(encoding='utf-8')
index=index.replace('?v=40','?v=41').replace('deploy-v40','deploy-v41')
index_path.write_text(index,encoding='utf-8')

sw_path=Path('sw.js')
sw=sw_path.read_text(encoding='utf-8').replace("stardew-tracker-v40","stardew-tracker-v41")
sw_path.write_text(sw,encoding='utf-8')

print('v41 patch applied')
