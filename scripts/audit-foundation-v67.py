from pathlib import Path
import re,sys
t=Path('app.jsx').read_text()
bad=[x for x in ['城镇修复路线','Joja 仓库路线内容','社区中心路线内容','点人物卡 → 社交速查；点礼物 → 物品资料','农场设备','通用喜好分类','点击查看详细用途／来源','特殊物品／分类','功能／服务'] if x in t]
assert not bad, f'App UI language regressions: {bad}'
m=re.search(r'const ITEM_FILE_ZH_V26 = \{(.*?)\n\};',t,re.S)
keys=re.findall(r'"([^"]+)"\s*:',m.group(1)) if m else []
dup=sorted({k for k in keys if keys.count(k)>1})
assert not dup, f'duplicate aliases: {dup}'
assert 'window.SDVLocalGameFilesV67?.[name] || WIKI_FILE(name)' in t
assert 'shirt:"Shirt003",pants:"Farmer Pants"' in t
idx=Path('index.html').read_text()
assert all(f'<script src="./{x}?v=67"' not in idx for x in ['wardrobe-data-v34.js','lookup-data-v46.js','lookup-extra-v49.js'])
print('v67 foundation audit passed')
