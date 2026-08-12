from pathlib import Path
import json,re
from opencc import OpenCC

cc=OpenCC('s2twp')
app_path=Path('app.jsx')
app=app_path.read_text()

# 0F: explicit save schema. New blank saves are schema 1; missing legacy saves remain schema 0
# until the progress-linking migration is implemented.
if 'const SAVE_SCHEMA_VERSION_V67 = 1;' not in app:
    anchor='/* ================= 全新手帳預設：不帶任何玩家進度 ================= */\nconst PREFILL = {'
    replacement='/* ================= 全新手帳預設：不帶任何玩家進度 ================= */\nconst SAVE_SCHEMA_VERSION_V67 = 1;\nconst LEGACY_SCHEMA_VERSION_V67 = 0;\nconst PREFILL = {\n  schemaVersion: SAVE_SCHEMA_VERSION_V67,'
    if anchor not in app: raise SystemExit('PREFILL anchor not found')
    app=app.replace(anchor,replacement,1)

normalize_anchor='''function normalizeWardrobeProgressV38(input){'''
# Insert the save normalizer after the wardrobe normalizer, before FarmerSpritePreview.
if 'function normalizeSaveV67(input)' not in app:
    marker='\nfunction FarmerSpritePreviewV33('
    idx=app.find(marker)
    if idx<0: raise SystemExit('FarmerSpritePreview marker not found')
    helper='''\nfunction normalizeSaveV67(input){\n  const raw=input&&typeof input==="object"?input:{};\n  const hasSchema=Object.prototype.hasOwnProperty.call(raw,"schemaVersion");\n  const parsed=Number(raw.schemaVersion);\n  const schemaVersion=hasSchema&&Number.isInteger(parsed)&&parsed>=0?parsed:LEGACY_SCHEMA_VERSION_V67;\n  return normalizeWardrobeProgressV38({...PREFILL,...raw,schemaVersion});\n}\n'''
    app=app[:idx]+helper+app[idx:]

old='try { setData(normalizeWardrobeProgressV38({ ...PREFILL, ...JSON.parse(raw) })); }'
new='try { setData(normalizeSaveV67(JSON.parse(raw))); }'
if old in app: app=app.replace(old,new,1)
if 'normalizeSaveV67(JSON.parse(raw))' not in app: raise SystemExit('save loader schema patch missing')

old='try{const parsed=JSON.parse(await file.text());setData({...PREFILL,...parsed});alert("備份已匯入");}catch(e){alert("無法讀取這份備份檔")}'
new='try{const parsed=JSON.parse(await file.text());setData(normalizeSaveV67(parsed));alert("備份已匯入");}catch(e){alert("無法讀取這份備份檔")}'
if old in app: app=app.replace(old,new,1)
if 'setData(normalizeSaveV67(parsed))' not in app: raise SystemExit('backup import schema patch missing')

# 0B: lookup really loads on demand, not automatically a few seconds after opening Overview.
idle='''  useEffect(()=>{\n    const run=()=>{if(!window.SDVLookupV46)loadLazyDataV67("lookup")};\n    if("requestIdleCallback" in window){const id=window.requestIdleCallback(run,{timeout:5000});return()=>window.cancelIdleCallback?.(id);}\n    const id=window.setTimeout(run,2800);return()=>window.clearTimeout(id);\n  },[]);\n'''
app=app.replace(idle,'')

# 0A: known location names that had been manually Traditionalized in the fish map.
app=app.replace('鵜鶘鎮','鹈鹕镇').replace('煤礦森林','煤矿森林').replace('薑島','姜岛')

# App-owned prose fields: convert only prose/labels, never canonical game item names or alias keys.
def convert_regex_block(text,const_name,field_patterns):
    m=re.search(rf'(const {re.escape(const_name)} = \{{)(.*?)(\n\}};)',text,re.S)
    if not m: return text
    block=m.group(2)
    for pat in field_patterns:
        block=re.sub(pat,lambda x:x.group(1)+cc.convert(x.group(2))+x.group(3),block)
    return text[:m.start(2)]+block+text[m.end(2):]

app=convert_regex_block(app,'MACHINE_EXTRA_V55',[(r'(sourceZh:")([^"]*)(")')])
app=convert_regex_block(app,'SOCIAL_SPECIAL_ITEM_V55',[(r'(source:")([^"]*)(")')])
app=convert_regex_block(app,'SOCIAL_GENERIC_V55',[(r'(name:")([^"]*)(")')])

# NPC service object has Simplified + Traditional alias keys; only convert title/description inside rows.
m=re.search(r'(const NPC_SERVICES_V55 = \{)(.*?)(\n\};)',app,re.S)
if m:
    block=m.group(2)
    row=re.compile(r'\["([^"]+)","([^"]+)","([^"]+)"\]')
    block=row.sub(lambda x:'["'+x.group(1)+'","'+cc.convert(x.group(2))+'","'+cc.convert(x.group(3))+'"]',block)
    app=app[:m.start(2)]+block+app[m.end(2):]

# Direct App UI copy found in the v66 audit.
replacements={
    '游戏里社区中心与 Joja 是二选一路线。确定把手帐当前路线切换成「${label}」吗？':'遊戲中社区中心與 Joja 是二選一路線。確定把手帳目前路線切換成「${label}」嗎？',
    '另一条路线已记录的数据会保留，但不会同时计入当前路线。':'另一條路線已記錄的資料會保留，但不會同時計入目前路線。',
    '点人物卡 → 社交速查；点礼物 → 物品资料':'點人物卡 → 社交速查；點禮物 → 物品資料',
    '通用喜好分类':'通用喜好分類','点击查看详细用途／来源':'點擊查看詳細用途／來源','特殊物品／分类':'特殊物品／分類','功能／服务':'功能／服務'
}
for a,b in replacements.items(): app=app.replace(a,b)
app_path.write_text(app)

# 0G: make the snapshot state explicit. Do not claim these files can currently be regenerated.
snapshot_headers={
 'lookup-data-v46.js':'/* Committed snapshot of pinned Stardew 1.6 lookup data. Generator is not currently present in this repo; do not regenerate blindly. See docs/DATA_SOURCES.md. */',
 'lookup-extra-v49.js':'/* Committed snapshot of lookup metadata. Generator is not currently present in this repo. See docs/DATA_SOURCES.md. */',
 'switch-names-v47.js':'/* Committed snapshot of the Switch/zh-CN display-name map from pinned multilingual game data. Generator is not currently present in this repo. See docs/DATA_SOURCES.md. */',
 'wardrobe-data-v34.js':'/* Committed snapshot of pinned Stardew localization + Dressup metadata. Generator is not currently present in this repo. See docs/DATA_SOURCES.md. */',
 'social-data-v50.js':'/* Committed snapshot of social data; sourceCommit is retained in the payload. Generator is not currently present in this repo. See docs/DATA_SOURCES.md. */',
 'machine-data-v51.js':'/* Committed snapshot of machine/equipment data. Generator is not currently present in this repo. See docs/DATA_SOURCES.md. */'
}
for fname,header in snapshot_headers.items():
    p=Path(fname); s=p.read_text()
    if s.startswith('/*'):
        end=s.find('*/')
        if end>=0: s=header+s[end+2:]
        else: s=header+'\n'+s
    else: s=header+'\n'+s
    p.write_text(s)

# 0C: all locally mirrored high-frequency assets are pre-cached; anything else still falls back to Wiki runtime cache.
local=Path('assets/game/local-assets-v67.js').read_text().strip()
mm=re.match(r'window\.SDVLocalGameFilesV67=(\{.*\});?$',local,re.S)
if not mm: raise SystemExit('local asset map parse failed')
mapping=json.loads(mm.group(1))
sw_path=Path('sw.js'); sw=sw_path.read_text()
cm=re.search(r'const CORE=\[(.*?)\];',sw,re.S)
if not cm: raise SystemExit('SW CORE missing')
existing=re.findall(r"'([^']+)'",cm.group(1))
assets=['./assets/game/local-assets-v67.js','./assets/game/main-logo-zh.png']+list(mapping.values())
merged=[]
for x in existing+assets:
    if x not in merged: merged.append(x)
sw=sw[:cm.start()]+"const CORE=["+','.join(repr(x) for x in merged)+"];"+sw[cm.end():]
sw_path.write_text(sw)

# README points to the canonical spec and data-source policy.
rp=Path('README.md'); readme=rp.read_text()
anchor='## 資料來源與聲明\n'
section='''## 產品規格與資料維護\n\n- 正式產品方向與功能完整化規格：`docs/ROADMAP.md`。\n- generated／snapshot 資料的來源與重建規則：`docs/DATA_SOURCES.md`。\n- GitHub Issues 用於追蹤執行狀態；若 Issue 與 ROADMAP 衝突，以 ROADMAP 為準。\n\n'''
if section not in readme:
    if anchor not in readme: raise SystemExit('README data source anchor missing')
    readme=readme.replace(anchor,section+anchor,1)
rp.write_text(readme)

# Strengthen the permanent build audit.
audit=Path('scripts/audit-foundation-v67.py')
audit.write_text(r'''from pathlib import Path
import json,re

def fail(msg): raise SystemExit(msg)

t=Path('app.jsx').read_text()
forbidden=['城镇修复路线','Joja 仓库路线内容','社区中心路线内容','点人物卡 → 社交速查；点礼物 → 物品资料','>农场设备<','通用喜好分类','点击查看详细用途／来源','特殊物品／分类','功能／服务','鵜鶘鎮']
bad=[x for x in forbidden if x in t]
if bad: fail(f'App UI language regressions: {bad}')

m=re.search(r'const ITEM_FILE_ZH_V26 = \{(.*?)\n\};',t,re.S)
keys=re.findall(r'"([^"]+)"\s*:',m.group(1)) if m else []
dup=sorted({k for k in keys if keys.count(k)>1})
if dup: fail(f'duplicate aliases: {dup}')

for needle in ['const SAVE_SCHEMA_VERSION_V67 = 1;','schemaVersion: SAVE_SCHEMA_VERSION_V67','function normalizeSaveV67(input)','setData(normalizeSaveV67(parsed))','normalizeSaveV67(JSON.parse(raw))']:
    if needle not in t: fail('save schema invariant missing: '+needle)
if 'requestIdleCallback(run' in t or 'setTimeout(run,2800)' in t: fail('lookup data is still auto-prefetched from Overview')
if 'window.SDVLocalGameFilesV67?.[name] || WIKI_FILE(name)' not in t: fail('local game asset fallback missing')
if 'shirt:"Shirt003",pants:"Farmer Pants"' not in t: fail('wardrobe neutral preview fallback missing')

idx=Path('index.html').read_text()
for src in ['wardrobe-data-v34.js','lookup-data-v46.js','lookup-extra-v49.js']:
    if f'<script src="./{src}?v=67"' in idx: fail('heavy data still parser-blocking: '+src)
for src in ['cloud.js','social-data-v50.js','machine-data-v51.js','switch-names-v47.js']:
    if f'<script src="./{src}?v=67"' not in idx: fail('required eager script missing: '+src)

for p in ['docs/ROADMAP.md','docs/DATA_SOURCES.md']:
    if not Path(p).is_file(): fail('required project doc missing: '+p)
for p in ['lookup-data-v46.js','lookup-extra-v49.js','switch-names-v47.js','wardrobe-data-v34.js','social-data-v50.js','machine-data-v51.js']:
    head=Path(p).read_text()[:300]
    if 'Committed snapshot' not in head or 'DATA_SOURCES.md' not in head: fail('snapshot policy header missing: '+p)

local=Path('assets/game/local-assets-v67.js').read_text().strip()
mm=re.match(r'window\.SDVLocalGameFilesV67=(\{.*\});?$',local,re.S)
if not mm: fail('local asset map invalid')
asset_map=json.loads(mm.group(1))
sw=Path('sw.js').read_text()
missing=[v for v in asset_map.values() if repr(v) not in sw]
if missing: fail(f'local assets missing from SW core: {len(missing)}')
print(f'v67 foundation audit passed; local assets={len(asset_map)}')
''')

print('v67 finalizer applied')
