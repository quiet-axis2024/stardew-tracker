from pathlib import Path
import json,re

def fail(msg): raise SystemExit(msg)

t=Path('app.jsx').read_text()
forbidden=['城镇修复路线','Joja 仓库路线内容','社区中心路线内容','点人物卡 → 社交速查；点礼物 → 物品资料','>农场设备<','通用喜好分类','点击查看详细用途／来源','特殊物品／分类','功能／服务','鵜鶘鎮','姜島','揹包','社群升級','鍛造臺']
bad=[x for x in forbidden if x in t]
if bad: fail(f'App UI language regressions: {bad}')

m=re.search(r'const ITEM_FILE_ZH_V26 = \{(.*?)\n\};',t,re.S)
keys=re.findall(r'"([^"]+)"\s*:',m.group(1)) if m else []
dup=sorted({k for k in keys if keys.count(k)>1})
if dup: fail(f'duplicate aliases: {dup}')

for needle in ['const SAVE_SCHEMA_VERSION_V68 = 2;','schemaVersion: SAVE_SCHEMA_VERSION_V68','function normalizeSaveV68(input)','setData(normalizeSaveV68(parsed))','normalizeSaveV68(JSON.parse(raw))']:
    if needle not in t: fail('save schema invariant missing: '+needle)
if 'requestIdleCallback(run' in t or 'setTimeout(run,2800)' in t: fail('lookup data is still auto-prefetched from Overview')
if 'window.SDVLocalGameFilesV67?.[name] || WIKI_FILE(name)' not in t: fail('local game asset fallback missing')
if 'shirt:"Shirt003",pants:"Farmer Pants"' not in t: fail('wardrobe neutral preview fallback missing')

idx=Path('index.html').read_text()
for src in ['wardrobe-data-v34.js','lookup-data-v46.js','lookup-extra-v49.js']:
    if f'<script src="./{src}?v=' in idx: fail('heavy data still parser-blocking: '+src)
for src in ['cloud.js','social-data-v50.js','machine-data-v51.js','switch-names-v47.js']:
    if f'<script src="./{src}?v=' not in idx: fail('required eager script missing: '+src)

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
