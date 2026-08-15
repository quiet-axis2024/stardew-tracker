"""v96 crop audit — 七哨兵、覆蓋完整性、app tokens、佈線。"""
import subprocess,json
from pathlib import Path
def fail(m):raise SystemExit('v96 audit: '+m)
node_js=r"""
const fs=require('fs');global.window={};
eval(fs.readFileSync('crop-data-v96.js','utf8'));
const C=window.SDVCropsV96;
const out={n:Object.keys(C.crops).length,bad:[],sent:{}};
for(const [en,c] of Object.entries(C.crops)){
  if(!(c.grow>0))out.bad.push(en+':grow');
  if(!c.zh||/^[A-Za-z]/.test(c.zh))out.bad.push(en+':zh='+c.zh);
  if(!Array.isArray(c.seasons))out.bad.push(en+':seasons');
  if(!c.seasons.length&&!c.note)out.bad.push(en+':emptySeason無note');
}
const g=en=>{const c=C.crops[en];return [c.grow,(c.regrow==null?'None':c.regrow),c.seasons.slice().sort().join('')].join('|')};
out.sent={Strawberry:g('Strawberry'),Blueberry:g('Blueberry'),Ancient:g('Ancient Fruit'),Coffee:g('Coffee Bean'),Pumpkin:g('Pumpkin'),Sweet:g('Sweet Gem Berry'),Corn:g('Corn')};
console.log(JSON.stringify(out));
"""
o=json.loads(subprocess.run(['node','-e',node_js],capture_output=True,text=True,check=True).stdout)
if o['n']<40:fail(f"作物數過少: {o['n']}")
if o['bad']:fail(f"資料缺陷: {o['bad'][:6]}")
EXP={'Strawberry':'8|4|春','Blueberry':'13|4|夏','Ancient':'28|7|夏春秋','Coffee':'10|2|夏春','Pumpkin':'13|None|秋','Sweet':'24|None|秋','Corn':'14|4|夏秋'}
for k,v in EXP.items():
    got=o['sent'][k]
    if sorted(got)!=sorted(v):fail(f'哨兵 {k}: {got} ≠ {v}')
app=Path('app.jsx').read_text()
for t in ['cropPlanV96','cropOfV96','🌱 種植','crops-deadline','h.kind==="crops"','還來得及種','無肥料基準']:
    if t not in app:fail('app missing '+t)
if './crop-data-v96.js?v=96' not in Path('index.html').read_text():fail('index 未載入')
if 'crop-data-v96.js' not in Path('sw-v87.js').read_text():fail('sw 未快取')
b=Path('build-cloudflare.sh').read_text()
for t in ['crop-data-v96.js','audit-crop-v96.py']:
    if t not in b:fail('build 缺 '+t)
print(f"v96 crop audit passed; crops={o['n']} 七哨兵全對")
