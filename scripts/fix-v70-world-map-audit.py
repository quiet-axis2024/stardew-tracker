from pathlib import Path
import re

p=Path('scripts/audit-world-v70.py')
s=p.read_text()
new_need='''need=[
    'const renderWorldV70 = () =>',
    'setFishViewV4("world")',
    'const fast=fishViewV4==="items"?"items":"world"',
    'tab==="fishing"&&fishViewV4==="world"',
    'loadLazyDataV67("world")',
    'worldRegionV70', 'worldQueryV70', 'worldOpenV70',
    'worldMapV70', 'worldKindV70',
    '先看地圖，再往下找', '天氣條件',
    'FISH_MAP_META_V42.main', 'FISH_MAP_META_V42.island',
    'openWorldFishV70', '返回世界地圖',
    'shop?.items?.length', 'NPC_SERVICES_V55',
    'openFishHintV69("",place.fishingAreaId)',
    'openSocialNpcV55(key)'
]'''
s,n=re.subn(r'need=\[\n.*?\n\]',new_need,s,count=1,flags=re.S)
if n!=1: raise SystemExit('could not replace world audit need block')
s=re.sub(r"\nif '找魚</button>'.*?pass\nif 'gridTemplateColumns:.*?pass\n",'\n',s,flags=re.S)
# 查找一級不得回到三分法；世界入口也不得回到資料。
marker="if 'DataTab id=\"world\" label=\"世界\"' in app or 'dataSection===\"world\"' in app: fail('world must live under lookup, not player data')"
extra="\nif 'repeat(3,minmax(0,1fr))' in app and '物品</button><button' in app and '找魚</button><button' in app: fail('lookup must not expose fish as a third top-level tab')\nif 'const [fishViewV4, setFishViewV4] = useState(\"world\");' not in app: fail('lookup should default to world')"
if extra.strip() not in s:
    if marker not in s: raise SystemExit('missing placement invariant marker')
    s=s.replace(marker,marker+extra,1)
p.write_text(s)
print('v70 world audit updated for map-first IA')
