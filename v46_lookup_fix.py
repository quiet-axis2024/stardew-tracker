from pathlib import Path
import json,re

lookup_path=Path('lookup-data-v46.js')
raw=lookup_path.read_text(encoding='utf-8')
payload=json.loads(raw.split('=',1)[1].rsplit(';',1)[0])
items=payload['items']
by_name={x['name']:x for x in items}

objects=json.loads(Path('/tmp/sdv-v46/objects.json').read_text(encoding='utf-8')).get('objects',[])
big=json.loads(Path('/tmp/sdv-v46/bigcraftables.json').read_text(encoding='utf-8')).get('bigCraftables',[])
recipes=json.loads(Path('/tmp/sdv-v46/recipes.json').read_text(encoding='utf-8'))
shops=json.loads(Path('/tmp/sdv-v46/shops.json').read_text(encoding='utf-8')).get('shops',[])
extra={}
for filename,key in [('boots.json','boots'),('weapons.json','weapons'),('hats.json','hats'),('trinkets.json','trinkets'),('books.json','books')]:
    extra[key]=json.loads(Path('/tmp/sdv-v46',filename).read_text(encoding='utf-8')).get(key,[])

app=Path('app.jsx').read_text(encoding='utf-8')
zh_by_en={}
m=re.search(r'const ITEM_FILE_ZH_V26\s*=\s*\{(.*?)\n\};',app,re.S)
if m:
    for alias,en in re.findall(r'"([^"]+)"\s*:\s*"([^"]+)"',m.group(1)):
        if re.search(r'[\u3400-\u9fff]',alias) and en not in zh_by_en:zh_by_en[en]=alias
zh_by_en.update({'Cherry Bomb':'櫻桃炸彈','Bomb':'炸彈','Mega Bomb':'超級炸彈','Sonar Bobber':'聲納浮標','Treasure Hunter':'尋寶者'})

def zh(name):return zh_by_en.get(str(name),str(name))
def addu(arr,text):
    if text and text not in arr:arr.append(text)

# Remove bad recipe/shop mappings produced by treating typed IDs as plain object IDs.
for x in items:
    x['sources']=[s for s in x.get('sources',[]) if not (s.startswith('製作：') or s.endswith('購買'))]
    x['uses']=[u for u in x.get('uses',[]) if not u.startswith('製作材料：')]

obj_by_id={str(x.get('id')):x for x in objects}
big_by_id={str(x.get('id')):x for x in big}
kind_maps={
    'B':{str(x.get('id')):x for x in extra['boots']},
    'W':{str(x.get('id')):x for x in extra['weapons']},
    'H':{str(x.get('id')):x for x in extra['hats']},
    'TR':{str(x.get('id')):x for x in extra['trinkets']},
}
cat_ing={'-4':'任意魚類','-5':'任意蛋類','-6':'任意奶類','-75':'任意蔬菜','-79':'任意水果','-80':'任意花卉','-81':'任意採集物','-12':'任意礦物'}
def ing_name(ing):
    iid=str(ing.get('itemId',''));nm=str(ing.get('name') or '')
    if iid in cat_ing:return cat_ing[iid]
    if iid in obj_by_id:return zh(obj_by_id[iid].get('name') or nm or iid)
    return zh(nm or iid)

# Crafting recipe key/name is the reliable output identity; outputItemName can be wrong for typed registry IDs.
for rr in recipes.get('crafting',[]):
    out=str(rr.get('name') or rr.get('outputItemName') or '').strip()
    if not out:continue
    ro=by_name.get(out)
    if ro is None:
        ro={'name':out,'zh':zh(out),'file':out,'kind':'craft','aliases':[],'sources':[],'uses':[],'recommend':''}
        items.append(ro);by_name[out]=ro
    ro['kind']='craft'
    bits=[]
    for ing in rr.get('ingredients') or []:
        nm=ing_name(ing);amt=ing.get('amount',1);bits.append(f'{nm}×{amt}')
        iid=str(ing.get('itemId',''))
        base=obj_by_id.get(iid,{}).get('name') or ing.get('name')
        ri=by_name.get(str(base))
        if ri:addu(ri.setdefault('uses',[]),f'製作材料：{zh(out)}')
    if bits:addu(ro.setdefault('sources',[]),'製作：'+'＋'.join(bits))

shop_names={'SeedShop':'皮埃爾雜貨店','JojaMart':'Joja 超市','Blacksmith':'鐵匠鋪','FishShop':'威利魚店','AdventureShop':'探險家公會','AnimalShop':'瑪妮牧場','Carpenter':'羅賓木匠店','Sandy':'綠洲','DesertTrade':'沙漠商人','Dwarf':'矮人商店','Krobus':'克羅巴斯商店','QiGemShop':'齊先生核桃房','VolcanoShop':'火山矮人商店','Saloon':'星之果實餐吧','HatMouse':'帽子老鼠','IslandTrader':'薑島商人','Casino':'賭場','Hospital':'哈維診所','Bookseller':'書商','RaccoonShop':'浣熊商店'}
def item_name_from_registry(value):
    v=str(value or '')
    m=re.match(r'^\((O|BC|B|W|H|TR)\)(.+)$',v)
    if not m:
        return obj_by_id.get(v,{}).get('name')
    typ,iid=m.group(1),m.group(2)
    if typ=='O':return obj_by_id.get(iid,{}).get('name')
    if typ=='BC':return big_by_id.get(iid,{}).get('name')
    return kind_maps.get(typ,{}).get(iid,{}).get('name')

for shop in shops:
    label=shop_names.get(str(shop.get('id')),str(shop.get('id') or '商店'))
    for entry in shop.get('items') or []:
        name=item_name_from_registry(entry.get('itemId'))
        if name and name in by_name:addu(by_name[name].setdefault('sources',[]),f'{label}購買')

# Keep generic fallback if cleanup left an entry source-less.
for x in items:
    if not x.get('sources'):
        kind=x.get('kind')
        if kind=='big':x['sources']=['製作、商店、獎勵或場景取得']
        elif kind=='boots':x['sources']=['礦井寶箱、商店或掉落取得']
        elif kind=='weapon':x['sources']=['礦井／戰鬥掉落、寶箱或商店取得']
        elif kind=='hat':x['sources']=['帽子老鼠、成就、活動或特殊條件取得']
        elif kind=='trinket':x['sources']=['戰鬥精通後由怪物、寶箱等取得']
        elif kind=='book':x['sources']=['書商、商店、掉落、寶箱或特殊獎勵取得']
        else:x['sources']=['農作、採集、養殖、加工、商店、掉落或任務取得']
    x['sources']=x['sources'][:4];x['uses']=x.get('uses',[])[:8]

lookup_path.write_text('/* Local Stardew 1.6.15 lookup data; generated at build time from pinned game-data extracts. */\nwindow.SDVLookupV46='+json.dumps({'items':items},ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
