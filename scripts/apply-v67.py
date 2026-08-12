from pathlib import Path
import hashlib
import json
import re
import urllib.parse
import urllib.request

ROOT = Path('.')
APP = ROOT / 'app.jsx'
INDEX = ROOT / 'index.html'
SW = ROOT / 'sw.js'
README = ROOT / 'README.md'
BUILD_CF = ROOT / 'build-cloudflare.sh'
PAGES = ROOT / '.github/workflows/pages.yml'

app = APP.read_text()

# 0A — App-owned copy is Traditional Chinese; game proper nouns stay in their
# Switch display form. These replacements only touch prose/UI we own.
replacements = {
    '点人物卡 → 社交速查；点礼物 → 物品资料': '點人物卡 → 社交速查；點禮物 → 物品資料',
    '<SectionTitle icon="📦">城镇修复路线</SectionTitle>': '<SectionTitle icon="📦">城鎮修復路線</SectionTitle>',
    'Joja 仓库路线内容': 'Joja 仓库｜路線內容',
    '社区中心路线内容': '社区中心｜路線內容',
    '<SectionTitle icon="🏗️">农场设备</SectionTitle>': '<SectionTitle icon="🏗️">農場設備</SectionTitle>',
    '按用途分成工匠加工／精炼功能／农务设备；已补裁缝机、电话、迷你冰箱、迷你点唱机、精通雕像、分解机、铁砧、迷你锻造台与蟹笼等实用设施。': '按用途分成工匠加工／精煉功能／農務設備；已補裁缝机、电话、迷你冰箱、迷你点唱机、精通雕像、分解机、铁砧、迷你锻造台與蟹笼等實用設施。',
    '通用喜好分类': '通用喜好分類',
    '点击查看详细用途／来源': '點擊查看詳細用途／來源',
    '特殊物品／分类': '特殊物品／分類',
    '功能／服务': '功能／服務',
    '游戏里社区中心与 Joja 是二选一路线。确定把手帐当前路线切换成「${label}」吗？\n另一条路线已记录的数据会保留，但不会同时计入当前路线。': '遊戲中社区中心與 Joja 是二選一路線。確定把手帳目前路線切換成「${label}」嗎？\n另一條路線已記錄的資料會保留，但不會同時計入目前路線。',
    '可以阅读社区中心内的魔法卷轴。': '可以閱讀社区中心內的魔法卷軸。',
    '可以与矿井和火山地牢的矮人交流。': '可以與礦井和火山地牢的矮人交流。',
    '艾米丽特殊订单「宝石恢复活力」完成后邮寄；用于裁缝与染色。': '艾米丽特殊訂單「宝石恢复活力」完成後郵寄；用於裁縫與染色。',
    '木匠商店购买；可远程查询商店营业与部分库存。': '木匠商店購買；可遠端查詢商店營業與部分庫存。',
    '农舍升级后木匠商店购买；也可由格斯特殊订单取得。': '農舍升級後木匠商店購買；也可由格斯特殊訂單取得。',
    '格斯 5 心事件后取得配方。': '格斯 5 心事件後取得配方。',
    '采矿精通后解锁配方。': '採礦精通後解鎖配方。',
    '齐先生核桃房以齐钻购买。': '齐先生核桃房以齐钻購買。',
    '战斗精通后解锁配方。': '戰鬥精通後解鎖配方。',
    '建造／管理农场建筑': '建造／管理農場建築',
    '建造、升级、移动或拆除多数农场建筑，并负责农舍升级与部分社区升级。': '建造、升級、移動或拆除多數農場建築，並負責農舍升級與部分社區升級。',
    '购买农场动物': '購買農場動物',
    '为鸡舍或牲口棚购买动物；也销售干草、暖气机、挤奶桶等动物照护用品。': '為鸡舍或牲口棚購買動物；也販售干草、暖气机、挤奶桶等動物照護用品。',
    '工具升级': '工具升級',
    '支付金钱与金属锭升级主要手持工具。': '支付金錢與金屬錠升級主要手持工具。',
    '处理晶球': '處理晶球',
    '在铁匠铺敲开晶球；每个基础处理费 25g。': '在铁匠铺敲開晶球；每個基礎處理費 25g。',
    '奖券兑换机': '獎券兌換機',
    '镇长家内可用奖品券在奖品机领取连续奖励。': '镇长家內可用奖品券在奖品机領取連續獎勵。',
    '姜岛船运': '姜岛船運',
    '修复鱼店后室的旧船后可搭船前往姜岛；单程船票 1,000g。': '修復鱼店後室的旧船後可搭船前往姜岛；單程船票 1,000g。',
    '背包升级': '背包升級',
    '杂货店可购买两次背包扩充，每次增加 12 格。': '杂货店可購買兩次背包擴充，每次增加 12 格。',
    '达到条件后可付费修改角色外观。': '達到條件後可付費修改角色外觀。',
    '魔法建筑': '魔法建築',
    '归还魔法墨水后可购买祝尼魔小屋、方尖碑与黄金时钟等魔法建筑。': '歸還魔法墨水後可購買祝尼魔小屋、方尖碑與黄金时钟等魔法建築。',
    '{id:"forage",name:"采集",icon:"Common Mushroom"}': '{id:"forage",name:"採集",icon:"Common Mushroom"}',
    '{id:"fruit",name:"果树／动物／加工",icon:"Apple"}': '{id:"fruit",name:"果樹／動物／加工",icon:"Apple"}',
}
for old, new in replacements.items():
    app = app.replace(old, new)

# Confirmed Switch place-name correction from current review.
app = app.replace('name:"鵜鶘鎮",sub:"河流"', 'name:"鹈鹕镇",sub:"河流"')
app = app.replace('{id:"town",label:"鵜鶘鎮"', '{id:"town",label:"鹈鹕镇"')

# 0E — remove exact duplicate aliases which currently trigger esbuild warnings.
def remove_later_duplicate(text: str, key: str, value: str) -> str:
    needle = f'"{key}":"{value}"'
    hits = [m.start() for m in re.finditer(re.escape(needle), text)]
    if len(hits) <= 1:
        return text
    pos = hits[-1]
    before = text[:pos]
    after = text[pos + len(needle):]
    if before.endswith(','):
        before = before[:-1]
    elif after.startswith(','):
        after = after[1:]
    return before + after

app = remove_later_duplicate(app, '仙人掌果子', 'Cactus Fruit')
app = remove_later_duplicate(app, '野山葵', 'Wild Horseradish')

# 0F — introduce a top-level save schema. Brand-new saves are v1; legacy saves
# with no field remain schema 0 in memory so item 1 can migrate them explicitly.
if 'const SAVE_SCHEMA_VERSION_V67 = 1;' not in app:
    anchor = 'const PREFILL = {\n  base:'
    replacement = 'const SAVE_SCHEMA_VERSION_V67 = 1;\nconst PREFILL = {\n  schemaVersion: SAVE_SCHEMA_VERSION_V67,\n  base:'
    if anchor not in app:
        raise SystemExit('PREFILL anchor not found')
    app = app.replace(anchor, replacement, 1)

load_old = '''      if (raw) {\n        try { setData(normalizeWardrobeProgressV38({ ...PREFILL, ...JSON.parse(raw) })); }\n        catch (e) { console.warn("progress parse failed", e); }\n      }'''
load_new = '''      if (raw) {\n        try {\n          const parsed=JSON.parse(raw);\n          const schemaVersion=Number.isFinite(Number(parsed?.schemaVersion))?Number(parsed.schemaVersion):0;\n          setData(normalizeWardrobeProgressV38({ ...PREFILL, ...parsed, schemaVersion }));\n        }\n        catch (e) { console.warn("progress parse failed", e); }\n      }'''
if load_old in app:
    app = app.replace(load_old, load_new, 1)
elif 'const schemaVersion=Number.isFinite(Number(parsed?.schemaVersion))' not in app:
    raise SystemExit('save schema load block not found')

# 0C — core icons resolve locally first, falling back to the Wiki for everything else.
old_game_file = '''const WIKI_FILE = (name) => `https://stardewvalleywiki.com/Special:Redirect/file/${encodeURIComponent(name + ".png")}`;\nconst iconMap = (names) => Object.fromEntries(names.map((name, i) => [i, WIKI_FILE(name)]));\n\n\nconst GAME_FILE = WIKI_FILE;'''
new_game_file = '''const WIKI_FILE = (name) => `https://stardewvalleywiki.com/Special:Redirect/file/${encodeURIComponent(name + ".png")}`;\nconst GAME_FILE = (name) => window.SDVLocalGameFilesV67?.[name] || WIKI_FILE(name);\nconst iconMap = (names) => Object.fromEntries(names.map((name, i) => [i, GAME_FILE(name)]));'''
if old_game_file in app:
    app = app.replace(old_game_file, new_game_file, 1)
elif 'window.SDVLocalGameFilesV67?.[name] || WIKI_FILE(name)' not in app:
    raise SystemExit('GAME_FILE block not found')

# 0D — visual-only neutral outfit. Persisted wardrobe values stay empty.
old_selected = 'selected:{hat:typeof safe.hat==="string"?safe.hat:"",shirt:typeof safe.shirt==="string"?safe.shirt:"",pants:typeof safe.pants==="string"?safe.pants:"",boots:typeof safe.boots==="string"?safe.boots:""},'
new_selected = 'selected:{hat:typeof safe.hat==="string"?safe.hat:"",shirt:(typeof safe.shirt==="string"&&safe.shirt)?safe.shirt:"Shirt003",pants:(typeof safe.pants==="string"&&safe.pants)?safe.pants:"Farmer Pants",boots:typeof safe.boots==="string"?safe.boots:""},'
if old_selected in app:
    app = app.replace(old_selected, new_selected, 1)
elif 'safe.shirt)?safe.shirt:"Shirt003"' not in app:
    raise SystemExit('wardrobe selected block not found')
app = app.replace(
    'api.draw(ref.current,{...opts,selected:{hat:"",shirt:"",pants:"",boots:""},accessoryIndex:-1})',
    'api.draw(ref.current,{...opts,selected:{hat:"",shirt:"Shirt003",pants:"Farmer Pants",boots:""},accessoryIndex:-1})',
    1,
)

# 0B — lazy-load the two heaviest lookup snapshots and full wardrobe catalogue.
state_anchor = '  const [wardrobeAppearanceMetaV37, setWardrobeAppearanceMetaV37] = useState({hairCount:64,skinCount:24,accessoryCount:29,defaultEyeColor:"#5B4636"});\n'
if 'setLazyDataRevisionV67' not in app:
    if state_anchor not in app:
        raise SystemExit('lazy state anchor not found')
    app = app.replace(state_anchor, state_anchor + '  const [, setLazyDataRevisionV67] = useState(0);\n', 1)

effect_anchor = '''  const profileInputRef = useRef(null);\n  const saveTimer = useRef(null);\n\n  useEffect(()=>{\n    let alive=true;'''
effect_insert = '''  const profileInputRef = useRef(null);\n  const saveTimer = useRef(null);\n\n  const loadLazyDataV67 = async group => {\n    const api=window.SDVLazyDataV67;\n    if(!api?.load)return false;\n    try{await api.load(group);setLazyDataRevisionV67(v=>v+1);return true;}\n    catch(error){console.warn(`lazy data load failed: ${group}`,error);return false;}\n  };\n  useEffect(()=>{\n    if(tab==="wardrobe")loadLazyDataV67("wardrobe");\n    if(tab==="fishing"||tab==="people")loadLazyDataV67("lookup");\n  },[tab]);\n  useEffect(()=>{\n    const run=()=>{if(!window.SDVLookupV46)loadLazyDataV67("lookup")};\n    if("requestIdleCallback" in window){const id=window.requestIdleCallback(run,{timeout:5000});return()=>window.cancelIdleCallback?.(id);}\n    const id=window.setTimeout(run,2800);return()=>window.clearTimeout(id);\n  },[]);\n\n  useEffect(()=>{\n    let alive=true;'''
if 'const loadLazyDataV67 = async group =>' not in app:
    if effect_anchor not in app:
        raise SystemExit('lazy effect anchor not found')
    app = app.replace(effect_anchor, effect_insert, 1)

open_old = '''  const openItemLookupV54 = (raw, preferredKey="") => {\n    const row = lookupRowV54(raw);'''
open_new = '''  const openItemLookupV54 = async (raw, preferredKey="") => {\n    if(!window.SDVLookupV46) await loadLazyDataV67("lookup");\n    const row = lookupRowV54(raw);'''
if open_old in app:
    app = app.replace(open_old, open_new, 1)

APP.write_text(app)

# 0C — copy high-frequency assets into the repo. These are deliberately limited
# to navigation, section icons, NPC portraits, calendars and maps.
asset_dir = ROOT / 'assets/game'
asset_dir.mkdir(parents=True, exist_ok=True)
core_names = {
    'Warp Totem Farm','Stardew Valley Almanac','Bouquet','Magnifying Glass','Deluxe Cowboy Hat','Journal Scrap',
    'Calendar','Golden Scroll','Golden Tag','Book Of Stars','Pickaxe','Stardrop','Silo','Sunfish','Friendship 101',
    'Letter','Chest','Map','Ginger Island Map','Calendar Spring ZH','Calendar Summer ZH','Calendar Fall ZH','Calendar Winter ZH',
    'Farm Computer','Junimo Icon','Treasure Chest','Stardew Hero Trophy','Magic Rock Candy','Galaxy Soul','Book of Mysteries'
}
text = app

def object_values(const_name: str):
    m = re.search(rf'const {re.escape(const_name)} = \{{(.*?)\n\}};', text, re.S)
    return set(re.findall(r':\s*"([^"]+)"', m.group(1))) if m else set()

names = set(core_names)
names |= object_values('NPC_ICON_FILES')
names |= object_values('SECTION_ICON_FILES_V65')
tabm = re.search(r'const TABS = \[(.*?)\n\];', text, re.S)
if tabm:
    names |= set(re.findall(r'file:\s*"([^"]+)"', tabm.group(1)))

mapping = {}
failed = []
opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 StardewTracker/1.0')]
for name in sorted(names):
    url = 'https://stardewvalleywiki.com/Special:Redirect/file/' + urllib.parse.quote(name + '.png')
    try:
        with opener.open(url, timeout=20) as response:
            data = response.read()
            ctype = (response.headers.get('Content-Type') or '').lower()
        if not data or ('image' not in ctype and not data.startswith(b'\x89PNG')):
            raise RuntimeError(f'not image: {ctype}')
        fname = hashlib.sha1(name.encode()).hexdigest()[:14] + '.png'
        (asset_dir / fname).write_bytes(data)
        mapping[name] = f'./assets/game/{fname}'
    except Exception as exc:
        failed.append((name, str(exc)))

missing_core = sorted(core_names - mapping.keys())
if missing_core:
    raise SystemExit('critical local assets failed: ' + ', '.join(missing_core))

logo_url = 'https://stardewvalleywiki.com/mediawiki/images/0/07/Main_Logo_ZH.png'
logo_path = asset_dir / 'main-logo-zh.png'
with opener.open(logo_url, timeout=20) as response:
    logo_path.write_bytes(response.read())

(asset_dir / 'local-assets-v67.js').write_text(
    'window.SDVLocalGameFilesV67=' + json.dumps(mapping, ensure_ascii=False, separators=(',', ':')) + ';\n'
)
print('local assets:', len(mapping), 'failed noncritical:', len(failed))
for item in failed:
    print('asset fallback:', item[0], item[1])

# index loader: local map first; heavy lookup/wardrobe catalogues load on demand.
idx = INDEX.read_text()
idx = idx.replace('https://stardewvalleywiki.com/mediawiki/images/0/07/Main_Logo_ZH.png', './assets/game/main-logo-zh.png')
idx = idx.replace('  <script src="./cloud.js?v=66"></script>', '  <script src="./assets/game/local-assets-v67.js?v=67"></script>\n  <script src="./cloud.js?v=67"></script>')
idx = idx.replace('  <script src="./wardrobe-data-v34.js?v=66"></script>\n', '')
idx = idx.replace('  <script src="./lookup-data-v46.js?v=66"></script>\n', '')
idx = idx.replace('  <script src="./lookup-extra-v49.js?v=66"></script>\n', '')
idx = idx.replace('?v=66', '?v=67')
lazy = '''    window.SDVLazyDataV67=(()=>{\n      const groups={lookup:["./lookup-data-v46.js?v=67","./lookup-extra-v49.js?v=67"],wardrobe:["./wardrobe-data-v34.js?v=67"]};\n      const scripts=new Map(),groupLoads=new Map();\n      const loadScript=src=>{if(scripts.has(src))return scripts.get(src);const promise=new Promise((resolve,reject)=>{const el=document.createElement("script");el.src=src;el.async=true;el.onload=()=>resolve(src);el.onerror=()=>reject(new Error(`無法載入 ${src}`));document.head.appendChild(el);});scripts.set(src,promise);return promise;};\n      const load=group=>{if(groupLoads.has(group))return groupLoads.get(group);const list=groups[group]||[];const promise=list.reduce((p,src)=>p.then(()=>loadScript(src)),Promise.resolve());groupLoads.set(group,promise);return promise;};\n      return {load};\n    })();\n'''
marker = '  <script>\n    (async()=>{'
if 'window.SDVLazyDataV67' not in idx:
    if marker not in idx:
        raise SystemExit('index loader marker not found')
    idx = idx.replace(marker, '  <script>\n' + lazy + '    (async()=>{', 1)
idx = idx.replace('<!-- deploy-v66 -->', '<!-- deploy-v67 -->')
INDEX.write_text(idx)

# Build/deploy include local assets.
cf = BUILD_CF.read_text()
if 'cp -R assets dist/' not in cf:
    cf = cf.replace('switch-names-v47.js dist/', 'switch-names-v47.js dist/\ncp -R assets dist/')
BUILD_CF.write_text(cf)

pages = PAGES.read_text()
if 'cp -R assets dist/' not in pages:
    pages = pages.replace('switch-names-v47.js dist/', 'switch-names-v47.js dist/\n          cp -R assets dist/')
PAGES.write_text(pages)

# Service worker: v67, local core assets precached; lazy data stays runtime-cached.
sw = SW.read_text().replace("const CACHE='stardew-tracker-v66';", "const CACHE='stardew-tracker-v67';")
m = re.search(r"const CORE=\[(.*?)\];", sw, re.S)
if not m:
    raise SystemExit('SW CORE not found')
existing = re.findall(r"'([^']+)'", m.group(1))
heavy_lazy = {'./wardrobe-data-v34.js', './lookup-data-v46.js', './lookup-extra-v49.js'}
existing = [x for x in existing if x not in heavy_lazy]
local_paths = ['./assets/game/local-assets-v67.js', './assets/game/main-logo-zh.png'] + sorted(set(mapping.values()))
merged = []
for value in existing + local_paths:
    if value not in merged:
        merged.append(value)
sw = sw[:m.start()] + 'const CORE=[' + ','.join(repr(x) for x in merged) + '];' + sw[m.end():]
SW.write_text(sw)

# 0G — generated snapshots are frozen until their generators/pinned inputs are in-repo.
lookup = ROOT / 'lookup-data-v46.js'
lookup_text = lookup.read_text()
lookup_text = lookup_text.replace(
    '/* Local Stardew 1.6.15 lookup data; generated at build time from pinned game-data extracts. */',
    '/* Committed Stardew 1.6.15 lookup snapshot generated from pinned game-data extracts. Generator is not currently stored in this repo; do not regenerate this file from an untracked script. */',
    1,
)
lookup.write_text(lookup_text)
wardrobe = ROOT / 'wardrobe-data-v34.js'
wardrobe_text = wardrobe.read_text()
wardrobe_text = wardrobe_text.replace(
    '/* Generated from pinned Stardew game-localization + Stardew Dressup metadata. */',
    '/* Committed wardrobe snapshot generated from pinned Stardew game-localization + Stardew Dressup metadata. Generator is not currently stored in this repo; do not regenerate from an untracked script. */',
    1,
)
wardrobe.write_text(wardrobe_text)

provenance = ROOT / 'DATA_PROVENANCE.md'
provenance.write_text('''# Data provenance\n\nThe runtime data files in this repository are committed snapshots. A generated-file header does **not** mean the current build regenerates the file.\n\n- `lookup-data-v46.js`: generated previously from pinned Stardew 1.6.15 game-data extracts. The generator/pinned extraction pipeline is not currently present in this repository. Treat this committed file as the source of truth until that pipeline is recovered and reviewed.\n- `wardrobe-data-v34.js`: generated previously from pinned Stardew localization plus Stardew Dressup metadata. Its generator is also not currently present in this repository.\n- Manual fixes to committed snapshots must not be overwritten by an untracked script. Any future regeneration must first commit the generator, pinned inputs or reproducible fetch rules, and a reviewable diff.\n\nThis rule exists so hand-corrected Switch names, aliases, sources and UI fixes cannot disappear when a historical generator is re-run.\n''')

# CI audit stays in repo after v67 so the foundation rules keep being checked.
audit = ROOT / 'scripts/audit-foundation-v67.py'
audit.write_text('''from pathlib import Path\nimport re, sys\ntext=Path("app.jsx").read_text()\nforbidden=["城镇修复路线","Joja 仓库路线内容","社区中心路线内容","点人物卡 → 社交速查；点礼物 → 物品资料",">农场设备<","通用喜好分类","点击查看详细用途／来源","特殊物品／分类","功能／服务"]\nbad=[x for x in forbidden if x in text]\nif bad: print("App-owned Simplified UI regressions:",bad);sys.exit(1)\nm=re.search(r"const ITEM_FILE_ZH_V26 = \\{(.*?)\\n\\};",text,re.S)\nif m:\n keys=re.findall(r"\\\"([^\\\"]+)\\\"\\s*:",m.group(1));dup=sorted({k for k in keys if keys.count(k)>1})\n if dup: print("Duplicate ITEM_FILE_ZH_V26 keys:",dup);sys.exit(1)\nif "window.SDVLocalGameFilesV67?.[name] || WIKI_FILE(name)" not in text: print("Local image fallback missing");sys.exit(1)\nif "shirt:\"Shirt003\",pants:\"Farmer Pants\"" not in text: print("Wardrobe neutral preview fallback missing");sys.exit(1)\nif "const SAVE_SCHEMA_VERSION_V67 = 1;" not in text: print("Save schema version missing");sys.exit(1)\nidx=Path("index.html").read_text()\nfor src in ["wardrobe-data-v34.js","lookup-data-v46.js","lookup-extra-v49.js"]:\n if f"<script src=\\\"./{src}?v=67\\\"" in idx: print("Heavy data still parser-blocking:",src);sys.exit(1)\nif not Path("DATA_PROVENANCE.md").exists(): print("Data provenance doc missing");sys.exit(1)\nprint("v67 foundation audit passed")\n''')

# README records rules so future features inherit them.
r = README.read_text()
anchor = '## 資料來源與聲明\n'
convention = '''## 語言、存檔與資產規則\n\n- App 自己的介面、說明與功能文案使用繁體中文（台灣用語）。\n- 遊戲內專有名詞以 Switch 版《星露谷物語》遊戲本體實際顯示為準；搜尋別名另外支援繁中／簡中／英文，不用顯示字串當資料 ID。\n- 新手帳存檔帶有頂層 `schemaVersion`；沒有欄位的既有存檔視為 legacy，後續 migration 不靠猜測。\n- 高頻導航、NPC 頭像、日曆／地圖等核心圖優先由 repo 內 `assets/game` 提供；未本地化的遊戲圖仍可回退 Stardew Valley Wiki，並由 Service Worker runtime cache。\n- 大型查找與完整衣櫥目錄採延後載入，後續「世界／NPC 行程／完整分類」等資料模組也沿用此原則。\n- 標示 generated 的 committed snapshot 在 generator／pinned inputs 回到 repo 前不得用不明腳本重建；詳見 `DATA_PROVENANCE.md`。\n\n'''
if convention not in r:
    r = r.replace(anchor, convention + anchor)
README.write_text(r)

print('v67 apply complete')
