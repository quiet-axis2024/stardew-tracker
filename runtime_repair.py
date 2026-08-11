from pathlib import Path
import re

p=Path('app.jsx')
s=p.read_text(encoding='utf-8')

# ---------- 1. Wider numeric inputs ----------
s=s.replace('function NumInput({ value, onChange, min = 0, max = 999, suffix = "" }) {','function NumInput({ value, onChange, min = 0, max = 999, suffix = "", width = 64 }) {',1)
s=s.replace('style={{ width: 64, border: `2px solid ${C.line}`','style={{ width, border: `2px solid ${C.line}`',1)
s=s.replace('<NumInput value={data.base.money} max={999999999} onChange={v=>updateBase({money:v})} suffix="g"/>','<NumInput value={data.base.money} max={999999999} onChange={v=>updateBase({money:v})} suffix="g" width={118}/>',1)
s=s.replace('<NumInput value={data.base.totalIncome} max={999999999} onChange={v=>updateBase({totalIncome:v})} suffix="g"/>','<NumInput value={data.base.totalIncome} max={999999999} onChange={v=>updateBase({totalIncome:v})} suffix="g" width={118}/>',1)

# ---------- 2. Shipping / wardrobe constants ----------
marker='const SECRET_NOTE_SUMMARY_V3 = {'
if 'const SHIPPING_ITEMS_V30' not in s:
    constants=r'''const SHIPPING_ITEMS_V30 = [
  ["Wild Horseradish","野山葵"],["Daffodil","黃水仙"],["Leek","韭蔥"],["Dandelion","蒲公英"],["Parsnip","防風草"],["Cave Carrot","山洞蘿蔔"],["Coconut","椰子"],["Cactus Fruit","仙人掌果子"],["Banana","香蕉"],["Sap","樹液"],["Large Egg","大雞蛋（白）"],["Egg","雞蛋（白）"],["Brown Egg","雞蛋（棕）"],["Large Brown Egg","大雞蛋（棕）"],["Milk","牛奶"],["Large Milk","大壺牛奶"],["Green Bean","青豆"],["Cauliflower","花椰菜"],["Potato","土豆"],["Garlic","蒜"],["Kale","甘藍菜"],["Rhubarb","大黃"],["Melon","甜瓜"],["Tomato","西紅柿"],["Morel","羊肚菌"],["Blueberry","藍莓"],["Fiddlehead Fern","蕨菜"],["Hot Pepper","辣椒"],["Wheat","小麥"],["Radish","蘿蔔"],["Red Cabbage","紅葉卷心菜"],["Starfruit","楊桃"],["Corn","玉米"],["Unmilled Rice","未碾米"],["Eggplant","茄子"],["Artichoke","洋薊"],["Pumpkin","南瓜"],["Bok Choy","小白菜"],["Yam","山藥"],["Chanterelle","雞油菌"],["Cranberries","蔓越莓"],["Holly","冬青樹"],["Beet","甜菜"],["Ostrich Egg","鴕鳥蛋"],["Salmonberry","美洲大樹莓"],["Amaranth","莧菜"],["Pale Ale","淡啤酒"],["Hops","啤酒花"],["Void Egg","虛空蛋"],["Mayonnaise","蛋黃醬"],["Duck Mayonnaise","鴨蛋黃醬"],["Void Mayonnaise","虛空蛋黃醬"],["Clay","黏土"],["Copper Bar","銅錠"],["Iron Bar","鐵錠"],["Gold Bar","金錠"],["Iridium Bar","銥錠"],["Refined Quartz","精煉石英"],["Honey","蜂蜜"],["Pickles","醃菜"],["Jelly","果醬"],["Beer","啤酒"],["Wine","果酒"],["Juice","果汁"],["Poppy","虞美人花"],["Copper Ore","銅礦石"],["Iron Ore","鐵礦石"],["Coal","煤炭"],["Gold Ore","金礦石"],["Iridium Ore","銥礦石"],
  ["Wood","木材"],["Stone","石頭"],["Nautilus Shell","鸚鵡螺"],["Coral","珊瑚"],["Rainbow Shell","彩虹貝殼"],["Spice Berry","香味漿果"],["Sea Urchin","海膽"],["Grape","葡萄"],["Spring Onion","大蔥"],["Strawberry","草莓"],["Sweet Pea","甜豌豆"],["Common Mushroom","普通蘑菇"],["Wild Plum","野梅"],["Hazelnut","榛子"],["Blackberry","黑莓"],["Winter Root","冬根"],["Crystal Fruit","水晶果"],["Snow Yam","雪山藥"],["Sweet Gem Berry","寶石甜莓"],["Crocus","番紅花"],["Red Mushroom","紅蘑菇"],["Sunflower","向日葵"],["Purple Mushroom","紫蘑菇"],["Cheese","奶酪"],["Goat Cheese","山羊奶酪"],["Cloth","布料"],["Truffle","松露"],["Truffle Oil","松露油"],["Coffee Bean","咖啡豆"],["Goat Milk","羊奶"],["Large Goat Milk","大瓶羊奶"],["Wool","羊毛"],["Duck Egg","鴨蛋"],["Duck Feather","鴨毛"],["Caviar","魚子醬"],["Rabbit's Foot","兔子的腳"],["Aged Roe","陳年魚籽"],["Ancient Fruit","上古水果"],["Mead","蜂蜜酒"],["Tulip","鬱金香"],["Summer Spangle","夏季亮片"],["Fairy Rose","玫瑰仙子"],["Blue Jazz","藍爵"],["Apple","蘋果"],["Green Tea","綠茶"],["Apricot","杏子"],["Orange","橙子"],["Peach","桃子"],["Pomegranate","石榴"],["Cherry","櫻桃"],["Bug Meat","蟲肉"],["Hardwood","硬木"],["Maple Syrup","楓糖漿"],["Oak Resin","橡樹樹脂"],["Pine Tar","松焦油"],["Slime","史萊姆泥"],["Bat Wing","蝙蝠翅膀"],["Solar Essence","太陽精華"],["Void Essence","虛空精華"],["Fiber","纖維"],["Battery Pack","電池組"],["Dinosaur Mayonnaise","恐龍蛋黃醬"],["Roe","魚籽"],["Squid Ink","魷魚墨汁"],["Tea Leaves","茶葉"],["Ginger","薑"],["Taro Root","芋頭"],["Pineapple","菠蘿"],["Mango","芒果"],["Cinder Shard","火山晶石"],
  ["Magma Cap","熔岩菇"],["Bone Fragment","骨頭碎片"],["Radioactive Ore","放射性礦石"],["Radioactive Bar","放射性錠"],["Smoked Fish","燻魚"],["Moss","苔蘚"],["Mystic Syrup","神秘糖漿"],["Raisins","葡萄乾"],["Dried Fruit","果乾"],["Dried Mushrooms","蘑菇乾"],["Carrot","胡蘿蔔"],["Summer Squash","金皮西葫蘆"],["Broccoli","西蘭花"],["Powdermelon","霜瓜"]
];

const HATS_V30 = [
  ["Cowboy Hat","牛仔帽","完成博物館全收藏後，帽子老鼠 10,000g"],["Bowler Hat","圓頂禮帽","累計賺取 1,000,000g 後，帽子老鼠 10,000g"],["Top Hat","大禮帽","齊先生賭場 8,000 齊幣"],["Sombrero","墨西哥帽","累計賺取 10,000,000g 後，帽子老鼠"],["Straw Hat","草帽","彩蛋節找蛋比賽首次獲勝"],["Official Cap","大檐帽","釣到 24 種不同魚後，帽子老鼠"],["Blue Bonnet","藍色軟帽","博物館捐贈 40 件後，帽子老鼠"],["Plum Chapeau","紫紅小帽","烹飪 25 種料理後，帽子老鼠"],["Hard Hat","安全帽","探險家公會：擊殺 30 隻掘地蟲；亦可能沙漠節造型"],["Sou'wester","防雨帽","釣到 10 種不同魚後，帽子老鼠"],["Daisy","雛菊髮卡","製作 15 種物品後，帽子老鼠"],["Watermelon Band","西瓜髮卡","釣到 100 條魚後，帽子老鼠"],["Mouse Ears","老鼠耳朵","任一村民 10 心後，帽子老鼠"],["Cat Ears","貓耳","8 位村民 10 心後，帽子老鼠"],["Cowgal Hat","牛仔女郎帽","單一栽培成就後，帽子老鼠"],["Cowpoke Hat","專業牛仔帽","混合栽培成就後，帽子老鼠"],["Archer's Cap","射手帽","烹飪全部配方後，帽子老鼠"],["Blue Cowboy Hat","藍色牛仔帽","骷髏洞穴寶箱層"],["Red Cowboy Hat","紅色牛仔帽","骷髏洞穴寶箱層"],["Cone Hat","錐帽","夜市魔法商船"],["Elegant Turban","優雅頭巾","解鎖全部成就後，帽子老鼠"],["White Turban","白色頭巾","裁縫或骷髏洞穴寶箱層"],["Garbage Hat","垃圾帽","翻過 20 個垃圾桶後，每次有低機率取得"],["Golden Mask","金色面具","裁縫製作"],["Propeller Hat","螺旋槳帽","裁縫／隨機外觀掉落"],["Bridal Veil","新娘面紗","裁縫／隨機外觀掉落"],["Witch Hat","女巫帽","裁縫／隨機外觀掉落"],["Copper Pan","淘盤","把淘盤放進帽子欄"],["Green Turban","綠色頭巾","沙漠商人"],["Magic Cowboy Hat","魔法牛仔帽","沙漠商人奇數日"],["Magic Turban","魔法頭巾","沙漠商人偶數日"],["Golden Helmet","金色頭盔","打開金色椰子時機率取得"],["Deluxe Pirate Hat","豪華海盜帽","火山地牢寶箱"],["Pink Bow","粉色蝴蝶結","火山地牢矮人商店"],["Frog Hat","青蛙帽","薑島青蛙洞穴水域釣到"],["Small Cap","小帽子","薑島商人：週一交換"],["Bluebird Mask","藍鳥面具","薑島商人：週三交換"],["Deluxe Cowboy Hat","豪華牛仔帽","薑島商人：週五交換"],["Mr. Qi's Hat","齊先生的帽子","齊先生核桃房 5 齊鑽"],["Dark Cowboy Hat","黑色牛仔帽","骷髏洞穴寶箱層"]
];
const SHIRTS_V30 = [
  ["Shirt000","經典背帶褲","布料＋完美早餐",false],["Shirt002","薄荷襯衫","布料＋蒲公英",false],["Shirt003","深色襯衫","布料＋蝙蝠翅膀",false],["Shirt004","骷髏襯衫","布料＋史前頭骨；幽靈骷髏也可能掉落",false],["Shirt005","淺藍襯衫","布料＋蛋黃醬",false],["Shirt006","棕色條紋襯衫","布料＋樹液",false],["Shirt007","綠色背帶褲","布料＋蕨菜",false],["Shirt008","好悲傷襯衫","布料＋野山葵",false],["Shirt009","海藍寶石襯衫","布料＋鴨蛋黃醬",false],["Shirt010","西裝上衣","布料＋花束",false],["Shirt011","綠色腰帶襯衫","布料＋山洞蘿蔔",false],["Shirt012","萊姆綠條紋衫","布料＋鴨毛",false],["Shirt013","紅色條紋衫","布料＋蔓越莓糖果",false],["Shirt014","骨架襯衫","布料＋骨頭類物品；幽靈骷髏也可能掉落",false],["Shirt015","橙色襯衫","布料＋雞油菌",false],["Shirt016","夜空襯衫","布料＋藍莓千層酥",false],["Shirt017","鎮長吊帶褲","布料＋蔬菜雜燴",false],["Shirt018","棕色夾克","布料＋泥岩",false],["Shirt019","水手服","角色建立可選；染色版可用布料＋多種蟹籠海產",true]
];
const PANTS_V30 = [
  ["Farmer Pants","農夫長褲","布料＋蔓越莓／菠蘿／霜瓜／草莓／野梅",true],["Shorts","短褲","布料＋藍莓／葡萄／辣椒／甜瓜",true],["Long Dress","長裙","布料＋玫瑰仙子／向日葵",true],["Skirt","裙子","布料＋藍爵／鬱金香",true],["Pleated Skirt","百褶裙","布料＋虞美人花／夏季亮片",true],["Dinosaur Pants","恐龍褲","布料＋恐龍蛋黃醬",false],["Grass Skirt","草裙","布料＋乾草",false],["Genie Pants","神怪褲","布料＋上古水果／楊桃",true],["Baggy Pants","寬鬆褲","布料＋任意史萊姆蛋",true],["Simple Dress","簡單洋裝","布料＋任意蜂蜜",true],["Relaxed Fit Pants","休閒長褲","布料＋蘋果／杏子／香蕉／櫻桃／芒果／石榴",true],["Relaxed Fit Shorts","休閒短褲","布料＋橙子／桃子",true],["Prismatic Pants","五彩長褲","布料＋五彩碎片（隨機五彩服飾）",false],["Prismatic Genie Pants","五彩神怪褲","布料＋五彩碎片（隨機五彩服飾）",false]
];
const BOOTS_V30 = [
  ["Sneakers","運動鞋","探險家公會；礦井特殊史萊姆；釣魚寶箱"],["Rubber Boots","橡膠靴","礦井 1–40 特殊史萊姆；釣魚寶箱"],["Leather Boots","皮靴","礦井 10 層寶箱；釣魚寶箱"],["Work Boots","工作靴","探險家公會；隨機礦井 10 層寶箱"],["Combat Boots","戰靴","探險家公會；礦井／骷髏洞穴掉落"],["Tundra Boots","凍土靴","礦井 50 層寶箱；探險家公會"],["Thermal Boots","熱能靴","礦井中層木箱／特殊史萊姆；釣魚寶箱"],["Dark Boots","黑暗之靴","礦井 80 層後探險家公會；深層掉落"],["Firewalker Boots","蹈火者靴","礦井 80 層寶箱；釣魚寶箱"],["Genie Shoes","神怪之鞋","骷髏洞穴掉落；釣魚寶箱"],["Space Boots","太空之靴","礦井 110 層寶箱"],["Cowboy Boots","牛仔之靴","目前正常遊戲無法取得"],["Emily's Magic Boots","艾蜜麗的魔法靴","艾蜜麗 14 心事件"],["Leprechaun Shoes","矮精靈鞋子","火車掉落"],["Cinderclown Shoes","灰燼小丑鞋","火山地牢商店 100 火山晶石"],["Mermaid Boots","美人魚靴","火山地牢寶箱"],["Dragonscale Boots","龍鱗靴","火山地牢寶箱"],["Crystal Shoes","水晶鞋","骷髏洞穴掉落／隨機礦井 110 層寶箱"]
];

'''
    if marker not in s: raise SystemExit('constant insertion marker missing')
    s=s.replace(marker,constants+marker,1)

# ---------- 3. State ----------
state_marker='  const [fishFindGroupV4, setFishFindGroupV4] = useState("main");'
if 'wardrobeCategoryV30' not in s:
    s=s.replace(state_marker,state_marker+'\n  const [wardrobeCategoryV30, setWardrobeCategoryV30] = useState("hat");\n  const [wardrobeTargetV30, setWardrobeTargetV30] = useState("player");',1)

# ---------- 4. Bottom nav: archive into Data, Fishing + Wardrobe out ----------
pat=r'const TABS = \[.*?\n\];'
new_tabs='''const TABS = [
  { id: "overview", name: "總覽", icon: "🏡", file: TAB_ICON_FILES.overview },
  { id: "data", name: "資料", icon: "⭐", file: TAB_ICON_FILES.skills },
  { id: "people", name: "社交", icon: "💛", file: TAB_ICON_FILES.people },
  { id: "fishing", name: "釣魚", icon: "🐟", file: "Iridium Rod" },
  { id: "wardrobe", name: "衣櫥", icon: "🎩", file: "Deluxe Cowboy Hat" },
  { id: "notes", name: "備註", icon: "📝", file: "Journal Scrap" },
];'''
s,n=re.subn(pat,new_tabs,s,count=1,flags=re.S)
if n!=1: raise SystemExit('TABS replacement failed')

# ---------- 5. Collection: fish becomes pure dex; shipping becomes full icon collection ----------
s=s.replace('{collectionSection==="fish"&&renderFishHubV4()}','{collectionSection==="fish"&&renderFishDexV4()}',1)
old_shipping='''{collectionSection==="shipping"&&<Card style={{marginTop:8}}><div style={{display:"flex",gap:8,alignItems:"center"}}><GameIcon file="ShippingBox" size={34}/><div><div style={{fontSize:12,fontWeight:900,color:C.brown}}>出貨收集</div><div style={{fontSize:10.5,color:C.muted}}>目前先記已點亮數量；之後可再補完整 1.6 出貨圖鑑。</div></div></div><div style={{marginTop:7}}><NumInput value={Number(extrasState.shippedCount||0)} max={999} onChange={v=>updateExtras({shippedCount:v})} suffix="項"/></div></Card>}'''
new_shipping='''{collectionSection==="shipping"&&renderShippingV30()}'''
if old_shipping not in s: raise SystemExit('shipping placeholder marker missing')
s=s.replace(old_shipping,new_shipping,1)

# Insert shipping renderer before renderCollection.
insert='  const renderCollection = () => {'
if 'const renderShippingV30' not in s:
    shipping_renderer=r'''  const renderShippingV30 = () => {
    const shipped=data.shippingV30||[];
    const toggle=file=>update({shippingV30:shipped.includes(file)?shipped.filter(x=>x!==file):[...shipped,file]});
    return <div style={{marginTop:8}}>
      <Card style={{padding:9}}><div style={{display:"flex",alignItems:"center",gap:7}}><GameIcon file="Mini-Shipping Bin" size={34}/><div style={{flex:1}}><b style={{fontSize:12,color:C.brown}}>出貨圖鑑</b><div style={{fontSize:9.5,color:C.muted,marginTop:1}}>照遊戲 1.6「出貨」收藏排列點亮。</div></div><b style={{fontSize:11,color:C.green}}>{shipped.length}/{SHIPPING_ITEMS_V30.length}</b></div><div style={{marginTop:6}}><ProgressBar value={shipped.length} max={SHIPPING_ITEMS_V30.length}/></div>{!shipped.length&&Number(extrasState.shippedCount||0)>0&&<div style={{fontSize:8.5,color:C.muted,marginTop:5}}>舊版只記過「{extrasState.shippedCount} 項」總數，無法知道是哪幾項；請照遊戲圖鑑重新點亮一次。</div>}</Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}>{SHIPPING_ITEMS_V30.map(([file,name])=>{const on=shipped.includes(file);return <button key={file} onClick={()=>toggle(file)} style={{position:"relative",border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:8,padding:"5px 2px",minHeight:70,cursor:"pointer"}}><GameIcon file={file} size={34} alt={name}/><div style={{fontSize:7.7,fontWeight:900,color:on?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div><span style={{position:"absolute",right:2,top:1,fontSize:10,color:on?C.green:"#C9B99A",fontWeight:950}}>{on?"✓":"○"}</span></button>})}</div>
    </div>;
  };

'''
    if insert not in s: raise SystemExit('renderCollection insertion missing')
    s=s.replace(insert,shipping_renderer+insert,1)

# ---------- 6. Data gets archive as fourth first-level category ----------
old_data='''return <div><SectionTitle icon="📊">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:7,marginTop:7}}><DataTab id="farm" label="農場" file="Animals Tab"/><DataTab id="skills" label="技能" file="Skills Tab Icon"/><DataTab id="bundles" label="社區" file="Golden Scroll"/></div>{dataSection==="farm"&&renderFarm()}{dataSection==="skills"&&renderSkills()}{dataSection==="bundles"&&renderBundles()}</div>;'''
new_data='''return <div><SectionTitle icon="📊">資料</SectionTitle><div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:6,marginTop:7}}><DataTab id="farm" label="農場" file="Animals Tab"/><DataTab id="skills" label="技能" file="Skills Tab Icon"/><DataTab id="bundles" label="社區" file="Golden Scroll"/><DataTab id="collection" label="收藏" file="Collections Tab"/></div>{dataSection==="farm"&&renderFarm()}{dataSection==="skills"&&renderSkills()}{dataSection==="bundles"&&renderBundles()}{dataSection==="collection"&&renderCollection()}</div>;'''
if old_data not in s: raise SystemExit('renderData marker missing')
s=s.replace(old_data,new_data,1)

# ---------- 7. Dedicated fishing high-frequency page ----------
insert='  const renderNotes = () => <div>'
if 'const renderFishingV30' not in s:
    pages=r'''  const renderFishingV30 = () => {
    const fast=fishViewV4==="find"?"find":"today";
    return <div><SectionTitle icon="🐟">釣魚速查</SectionTitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:6}}><button onClick={()=>setFishViewV4("today")} style={{border:`2px solid ${fast==="today"?C.orange:C.line}`,background:fast==="today"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Fishing Rod" size={30}/>今日可釣</button><button onClick={()=>setFishViewV4("find")} style={{border:`2px solid ${fast==="find"?C.orange:C.line}`,background:fast==="find"?"#FFE2A8":C.paper,borderRadius:10,padding:7,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:10,fontWeight:950,color:C.brown}}><GameIcon file="Treasure Hunter" size={30}/>找魚</button></div>{fast==="today"?renderFishTodayV4():renderFishFindV4()}</div>;
  };

  const renderWardrobeV30 = () => {
    const defaults={player:{hat:"",shirt:"",pants:"",boots:"",shirtColor:"#5f8fb8",pantsColor:"#3f5f99"},horse:{hat:""},cat:{hat:""},dog:{hat:""}};
    const wardrobe={...defaults,...(data.wardrobeV30||{})};
    const target={...(defaults[wardrobeTargetV30]||{}),...(wardrobe[wardrobeTargetV30]||{})};
    const setTarget=patch=>update({wardrobeV30:{...wardrobe,[wardrobeTargetV30]:{...target,...patch}}});
    const cats={hat:HATS_V30,shirt:SHIRTS_V30,pants:PANTS_V30,boots:BOOTS_V30};
    const list=wardrobeTargetV30==="player"?cats[wardrobeCategoryV30]:HATS_V30;
    const slot=wardrobeTargetV30==="player"?wardrobeCategoryV30:"hat";
    const chosen=target[slot]||"";
    const targets=[["player","玩家","Farmer"],["horse","馬","Horse"],["cat","貓","Cat 1"],["dog","狗","Dog 1"]];
    const baseFile=wardrobeTargetV30==="horse"?"Horse":wardrobeTargetV30==="cat"?"Cat 1":wardrobeTargetV30==="dog"?"Dog 1":null;
    const selectedHat=(wardrobe[wardrobeTargetV30]||{}).hat||"";
    const player=wardrobe.player||defaults.player;
    return <div><SectionTitle icon="🎩">衣櫥搭配</SectionTitle>
      <Card style={{padding:9,background:"#FFF4D8"}}><div style={{fontSize:10.5,color:C.muted,lineHeight:1.4}}>用遊戲服飾圖做搭配板；帽子可套到玩家、馬、貓、狗。玩家上衣／下裝可記染色。這裡是搭配預覽，不假裝成逐像素遊戲角色合成。</div></Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{targets.map(([id,name,file])=>{const on=wardrobeTargetV30===id;return <button key={id} onClick={()=>{setWardrobeTargetV30(id);if(id!=="player")setWardrobeCategoryV30("hat")}} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:9,padding:5,fontSize:8.5,fontWeight:950,color:C.brown}}>{id==="player"?(data.profilePortrait?<img src={data.profilePortrait} alt="" style={{width:30,height:38,objectFit:"cover",borderRadius:4}}/>:<GameIcon file="Inventory Tab" size={30}/>):<GameIcon file={file} size={30}/>}<div>{name}</div></button>})}</div>
      <Card style={{marginTop:7,padding:8,textAlign:"center"}}><div style={{position:"relative",width:150,height:160,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center"}}>{wardrobeTargetV30==="player"?(data.profilePortrait?<img src={data.profilePortrait} alt="玩家" style={{width:105,height:140,objectFit:"cover",borderRadius:8,imageRendering:"pixelated"}}>:<GameIcon file="Inventory Tab" size={90}/>):<GameIcon file={baseFile} size={105}/>} {selectedHat&&<img src={GAME_FILE(selectedHat)} alt="帽子" style={{position:"absolute",top:2,left:"50%",transform:"translateX(-50%)",width:46,height:46,objectFit:"contain",imageRendering:"pixelated",filter:"drop-shadow(0 1px 1px rgba(0,0,0,.25))"}}/>}</div>{wardrobeTargetV30==="player"&&<><div style={{display:"flex",justifyContent:"center",gap:10,marginTop:2}}>{[[player.hat,"帽"],[player.shirt,"衣"],[player.pants,"褲"],[player.boots,"鞋"]].map(([f,l])=><div key={l} style={{width:46,textAlign:"center"}}><div style={{height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>{f?<GameIcon file={f} size={31}/>:<span style={{color:C.muted}}>—</span>}</div><div style={{fontSize:7.5,color:C.muted,fontWeight:900}}>{l}</div></div>)}</div><div style={{display:"flex",justifyContent:"center",gap:12,marginTop:6}}><label style={{fontSize:8.5,color:C.muted,fontWeight:900}}>上衣色 <input type="color" value={player.shirtColor||"#5f8fb8"} onChange={e=>update({wardrobeV30:{...wardrobe,player:{...player,shirtColor:e.target.value}}})} style={{width:31,height:24,border:0,verticalAlign:"middle"}}/></label><label style={{fontSize:8.5,color:C.muted,fontWeight:900}}>下裝色 <input type="color" value={player.pantsColor||"#3f5f99"} onChange={e=>update({wardrobeV30:{...wardrobe,player:{...player,pantsColor:e.target.value}}})} style={{width:31,height:24,border:0,verticalAlign:"middle"}}/></label></div></>}</Card>
      {wardrobeTargetV30==="player"&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5,marginTop:7}}>{[["hat","帽子","Cowboy Hat"],["shirt","上衣","Shirt003"],["pants","下裝","Farmer Pants"],["boots","鞋","Space Boots"]].map(([id,name,file])=>{const on=wardrobeCategoryV30===id;return <button key={id} onClick={()=>setWardrobeCategoryV30(id)} style={{border:`1.5px solid ${on?C.orange:C.line}`,background:on?"#FFE2A8":C.paper,borderRadius:8,padding:5,fontSize:8.5,fontWeight:950,color:C.brown}}><GameIcon file={file} size={26}/><div>{name}</div></button>})}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:5,marginTop:7}}>{list.map(it=>{const [file,name,source,dye]=it;const on=chosen===file;return <button key={file} onClick={()=>setTarget({[slot]:on?"":file})} style={{border:`1.5px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,padding:"5px 3px",minHeight:102,textAlign:"center",cursor:"pointer"}}><GameIcon file={file} size={38}/><div style={{fontSize:8.2,fontWeight:950,color:on?C.green:C.ink,lineHeight:1.05,marginTop:2}}>{name}</div><div style={{fontSize:6.8,color:C.muted,lineHeight:1.2,marginTop:3}}>{source}</div>{dye&&<div style={{fontSize:6.5,color:C.blue,fontWeight:900,marginTop:2}}>可染色</div>}</button>})}</div>
    </div>;
  };

'''
    if insert not in s: raise SystemExit('page insertion marker missing')
    s=s.replace(insert,pages+insert,1)

# ---------- 8. Main content map + bottom columns ----------
s=s.replace('const content={overview:renderOverview,data:renderData,people:renderPeople,powers:renderPowers,collection:renderCollection,notes:renderNotes}[tab];','const content={overview:renderOverview,data:renderData,people:renderPeople,powers:renderPowers,collection:renderCollection,fishing:renderFishingV30,wardrobe:renderWardrobeV30,notes:renderNotes}[tab];',1)
s=s.replace('gridTemplateColumns:"repeat(5,minmax(0,1fr))"','gridTemplateColumns:"repeat(6,minmax(0,1fr))"',1)

p.write_text(s,encoding='utf-8')
print('v30 archive fishing shipping wardrobe patch ready')
