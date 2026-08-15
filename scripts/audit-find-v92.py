"""v92 audit — 酒吧正名全域、進度旗標 resolver 雙路線哨兵、找人面板 tokens、佈線。"""
import subprocess,json
from pathlib import Path
def fail(m):raise SystemExit('v92 audit: '+m)
node_js=r"""
const fs=require('fs');global.window={};
['social-data-v50.js','world-nav-data-v87.js','npc-schedule-data-v91.js'].forEach(f=>eval(fs.readFileSync(f,'utf8')));
const R=window.SDVNpcScheduleV91.resolve;
const zhs=r=>r.entries.map(e=>e[1].zh).join('|');
const out={};
const sj=R('謝恩',{season:'夏',day:10,rain:false,ccDone:false});
out.shaneJoja=zhs(sj);out.shaneJojaNote=sj.notes.join(';');
out.shaneCC=zhs(R('謝恩',{season:'夏',day:10,rain:false,ccDone:true}));
out.shaneDefault=zhs(R('謝恩',{season:'夏',day:10,rain:false}));
out.pamNote=R('潘姆',{season:'夏',day:10,rain:false,busFixed:false}).notes.join(';');
const D=window.SDVNpcScheduleV91;
out.badCoverage=Object.entries(D.locations).filter(([k,v])=>!v.node&&k!=='The Farm').map(([k])=>k);
console.log(JSON.stringify(out));
"""
o=json.loads(subprocess.run(['node','-e',node_js],capture_output=True,text=True,check=True).stdout)
if 'Joja超市' not in o['shaneJoja']:fail('謝恩 ccDone:false 未走 Joja: '+o['shaneJoja'])
if '依 Joja 路線' not in o['shaneJojaNote']:fail('Joja 路線註記缺失')
for k in ('shaneCC','shaneDefault'):
    if '玛妮的牧场' not in o[k]:fail(f'謝恩 {k} 未走牧場: {o[k]}')
if '公交尚未修復' not in o['pamNote']:fail('busFixed 註記缺失: '+o['pamNote'])
if o['badCoverage']:fail(f"行程地點缺世界節點（不可達）: {o['badCoverage']}")
FILES=['app.jsx','world-nav-data-v87.js','npc-schedule-data-v91.js','lookup-data-v46.js','world-data-v70.js']
for f in FILES:
    if '餐吧' in Path(f).read_text():fail(f'{f} 仍含「餐吧」')
if '星之果实酒吧' not in Path('world-nav-data-v87.js').read_text():fail('nav 缺酒吧')
if '星之果实酒吧' not in Path('npc-schedule-data-v91.js').read_text():fail('schedule 缺酒吧')
if '星之果實酒吧' not in Path('lookup-data-v46.js').read_text():fail('lookup 缺酒吧')
app=Path('app.jsx').read_text()
for t in ['progressFlagsV92','按條件找人','npcFindViewV92','npcFindQueryV92','jojaClosedV92','已歇業','👤 找人','按地點','NPC_SIMP_V92','今天誰會來','TIME_SLOTS_V93','timeSlotV93:null','slotSelV93','去哪找','footerNpcV90&&npcChipsV90.length===0','跟手帳','本區今天誰會來','FESTIVAL_VENUE_V94','weatherRowMovedV94','forenoon','festVenueLabelV94','會場：','NPC_LEGACY_V95','raw.friendship["科罗布斯"]','profileEditV95','📍 {txt}']:
    if t not in app:fail('app.jsx missing '+t)
import re as _re
mm=_re.search(r'NPC_SIMP_V92=(\{.*?\});',app)
if not mm:fail('NPC_SIMP_V92 表缺失')
simp=json.loads(mm.group(1))
if len(simp)<15 or simp.get('羅賓')!='罗宾':fail(f"NPC_SIMP_V92 異常: {len(simp)} 筆, 羅賓={simp.get('羅賓')}")
if 'audit-find-v92.py' not in Path('build-cloudflare.sh').read_text():fail('build 未佈線')
print('v92 find audit passed; 謝恩雙路線＋公交註記＋改名全綠')
