"""v97 分類補齊 audit — 零無分類、雜項上限、六哨兵、貨車圖。"""
import subprocess,json
from pathlib import Path
def fail(m):raise SystemExit('v97 audit: '+m)
node_js=r"""
const fs=require('fs');global.window={};
['lookup-data-v46.js','lookup-extra-v49.js'].forEach(f=>eval(fs.readFileSync(f,'utf8')));
const arr=window.SDVLookupV46.items;
const un=arr.filter(x=>!x.category).length;
const misc=arr.filter(x=>x.category==='雜項').length;
const g=n=>{const it=arr.find(x=>x.name===n||x.file===n);return it?it.category:null};
console.log(JSON.stringify({total:arr.length,un,misc,cats:[...new Set(arr.map(x=>x.category))].length,
 s:{amph:g('Chipped Amphora'),wool:g('Wool'),hay:g('Hay'),note:g('Secret Note'),hat:arr.filter(x=>x.kind==='hat'&&x.category!=='帽子').length,ring:g('Small Glow Ring'),geode:g('Omni Geode')}}));
"""
o=json.loads(subprocess.run(['node','-e',node_js],capture_output=True,text=True,check=True).stdout)
if o['un']!=0:fail(f"仍有無分類 {o['un']} 項")
if o['misc']>35:fail(f"雜項超上限 {o['misc']}/35")
S=o['s']
for k,exp in [('amph','古物'),('wool','動物產品'),('hay','資源'),('note','筆記文件'),('ring','戒指'),('geode','礦物')]:
    if S[k]!=exp:fail(f'哨兵 {k}: {S[k]} ≠ {exp}')
if S['hat']!=0:fail(f"帽子 kind 未全射: {S['hat']}")
if 'file:"Traveling Cart"' not in Path('app.jsx').read_text():fail('貨車圖未換')
print(f"v97 lookup-cat audit passed; total={o['total']} 分類覆蓋 100%（雜項 {o['misc']}／類別 {o['cats']}）")
