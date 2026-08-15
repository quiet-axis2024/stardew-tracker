"""v91 schedule audit — 名單對齊、綁定合法、全季×全週覆蓋、哨兵、佈線。"""
import subprocess,json
from pathlib import Path

def fail(msg):
    raise SystemExit('v91 audit: '+msg)

node_js=r"""
const fs=require('fs');global.window={};
['social-data-v50.js','world-nav-data-v87.js','npc-schedule-data-v91.js'].forEach(f=>eval(fs.readFileSync(f,'utf8')));
const D=window.SDVNpcScheduleV91,NAV=window.SDVWorldNavV87,byZh=window.SDVSocialV50.byZh;
const GROUPS=[["阿比蓋爾","艾蜜麗","海莉","莉亞","瑪魯","潘妮","亞歷克斯","艾利歐特","哈維","山姆","塞巴斯蒂安","謝恩"],["卡洛琳","克林特","德米特里厄斯","艾芙琳","喬治","格斯","賈斯","喬迪","肯特","劉易斯","萊納斯","瑪妮","潘姆","皮埃爾","羅賓","文森特","威利","法師"],["桑迪","科罗布斯","矮人","雷歐"]].flat();
const out={missing:GROUPS.filter(n=>!D.npcs[n]),extra:Object.keys(D.npcs).filter(n=>!GROUPS.includes(n)),badLoc:[],badBind:[],fallbacks:0,checked:0,sent:{}};
for(const [k,n] of Object.entries(D.npcs)){
  for(const r of n.rules)for(const [t,loc] of r.e){
    if(!D.locations[loc])out.badLoc.push(k+':'+loc);
    if(t<600||t>2800)out.badLoc.push(k+':t'+t);
  }
}
for(const [loc,v] of Object.entries(D.locations)){
  if(v.node){
    const nd=NAV.nodes[v.node];
    if(!nd){out.badBind.push(loc+':'+v.node);continue}
    if(v.pin&&![...(nd.places||[]),...(nd.portals||[]),...(nd.spots||[])].some(p=>p.id===v.pin))out.badBind.push(loc+':'+v.node+'.'+v.pin);
  }
}
for(const s of ['春','夏','秋','冬'])for(let d=1;d<=28;d++)for(const k of GROUPS){
  const r=D.resolve(k,{season:s,day:d,rain:false});out.checked++;
  if(r.notes.some(x=>x.includes('無對應規則')))out.fallbacks++;
}
const g=(k,c)=>D.resolve(k,c).entries.map(([t,l])=>t+' '+l.zh).join('|');
out.sent.marnie=g('瑪妮',{season:'春',day:1,rain:false});
out.sent.abby=g('阿比蓋爾',{season:'春',day:3,rain:false});
out.sent.harvey=g('哈維',{season:'夏',day:9,rain:false});
out.sent.wizard=g('法師',{season:'冬',day:20,rain:true});
out.sent.sandy=g('桑迪',{season:'秋',day:8,rain:false});
console.log(JSON.stringify(out));
"""
o=json.loads(subprocess.run(['node','-e',node_js],capture_output=True,text=True,check=True).stdout)
if o['missing']: fail(f"行程缺角色: {o['missing']}")
if o['extra']: fail(f"多出未知角色: {o['extra']}")
if o['badLoc']: fail(f"非法地點/時間: {o['badLoc'][:6]}")
if o['badBind']: fail(f"世界綁定失效: {o['badBind']}")
if o['fallbacks']>0: fail(f"覆蓋缺口：{o['fallbacks']}/{o['checked']} 組合落到 fallback")
for k,must in [('marnie','皮埃尔的杂货店'),('abby','博物馆'),('harvey','哈维的诊所'),('wizard','法师塔'),('sandy','绿洲')]:
    if must not in o['sent'][k]: fail(f'哨兵不符 {k}: {o["sent"][k]}')

app=Path('app.jsx').read_text()
for token in ['SDVNpcScheduleV91','📍 今天','join(" › ")','節日日以會場為準','goToWorldV88(loc.node','好感 {hearts}/{cap}','<CompactLovesV50 items={likes}/>','aria-label={`好感 ${hearts}/${cap}`}']:
    if token not in app: fail('app.jsx missing '+token)
idx=Path('index.html').read_text()
if './npc-schedule-data-v91.js?v=91' not in idx: fail('index.html missing schedule script')
sw=Path('sw-v87.js').read_text()
if './npc-schedule-data-v91.js' not in sw: fail('sw core missing schedule data')
build=Path('build-cloudflare.sh').read_text()
for token in ['npc-schedule-data-v91.js','audit-schedule-v91.py']:
    if token not in build: fail('build missing '+token)
print(f"v91 schedule audit passed; grid={o['checked']} fallbacks=0")
