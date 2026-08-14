"""v89 gifts audit — 物品卡送禮反查佈線＋資料完整性抽查。"""
import subprocess,json
from pathlib import Path

def fail(msg):
    raise SystemExit('v89 audit: '+msg)

app=Path('app.jsx').read_text()
for token in ['const giftFansV89','giftFansV89(selected.file)','💗 最愛','👍 喜歡','openSocialNpcV55(n)']:
    if token not in app: fail('app.jsx missing '+token)

# gift lists must be English file keys so the exact-match reverse lookup holds
node_js=r"""
const fs=require('fs');global.window={};
eval(fs.readFileSync('social-data-v50.js','utf8'));
const byZh=window.SDVSocialV50.byZh;
const bad=[];let pairs=0;
for(const [n,e] of Object.entries(byZh)){
  for(const it of [...(e.loves||[]),...(e.likes||[])]){
    pairs++;
    if(typeof it!=='string'||!it.trim()||/[\u4e00-\u9fff]/.test(it)) bad.push(`${n}:${it}`);
  }
}
console.log(JSON.stringify({pairs,bad:bad.slice(0,5),abigail:(byZh['阿比蓋爾']?.loves||[]).includes('Amethyst')}));
"""
out=json.loads(subprocess.run(['node','-e',node_js],capture_output=True,text=True,check=True).stdout)
if out['bad']: fail(f'gift entries not in file-key format: {out["bad"]}')
if out['pairs']<200: fail('gift pair count suspiciously low')
if not out['abigail']: fail('sanity pair missing: 阿比蓋爾 loves Amethyst')

build=Path('build-cloudflare.sh').read_text()
if 'audit-gifts-v89.py' not in build: fail('build must run audit-gifts-v89.py')
print(f'v89 gifts audit passed; pairs={out["pairs"]}')
