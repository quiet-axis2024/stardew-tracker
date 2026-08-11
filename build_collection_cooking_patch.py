from pathlib import Path
import sys

p=Path(sys.argv[1] if len(sys.argv)>1 else 'build/entry.jsx')
s=p.read_text(encoding='utf-8')

def repl(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'build_collection_cooking_patch: marker not found: {label}')
    s=s.replace(old,new,1)

anchor='const SPECIAL_ITEMS_V2 = ['
defs=r'''
const COOKING_PREP_GROUPS_V3 = [
  {id:"g1",name:"第 1 組｜作物＋陸地採集",desc:"照攻略先備齊這組；亮起＝已經放足最低需求量。",items:[
    ["parsnip","防風草","Parsnip",2],["kale","羽衣甘藍","Kale",2],["potato","馬鈴薯","Potato",2],["jazz","藍爵","Blue Jazz",1],["bean","青豆","Green Bean",2],["cauli","花椰菜","Cauliflower",1],["rhubarb","大黃","Rhubarb",1],["garlic","蒜","Garlic",2],["pepper","辣椒","Hot Pepper",3],["radish","蘿蔔","Radish",2],["poppy","虞美人花","Poppy",1],["tomato","番茄","Tomato",8],["melon","甜瓜","Melon",2],["blueberry","藍莓","Blueberry",2],["corn","玉米","Corn",2],["redcabbage","紅葉捲心菜","Red Cabbage",3],["bokchoy","小白菜","Bok Choy",1],["eggplant","茄子","Eggplant",2],["amaranth","莧菜","Amaranth",1],["cranberries","蔓越莓","Cranberries",4],["yam","山藥","Yam",2],["pumpkin","南瓜","Pumpkin",3],["beet","甜菜","Beet",1],["artichoke","朝鮮薊","Artichoke",2],["pineapple","鳳梨","Pineapple",1],["taro","芋頭","Taro Root",4],
    ["cavecarrot","山洞蘿蔔","Cave Carrot",5],["commonmushroom","普通蘑菇","Common Mushroom",3],["dandelion","蒲公英","Dandelion",1],["fiddlehead","蕨菜","Fiddlehead Fern",1],["hazelnut","榛子","Hazelnut",4],["horseradish","野山葵","Wild Horseradish",1],["leek","韭蔥","Leek",1],["morel","羊肚菌","Morel",1],["winterroot","冬根","Winter Root",1]
  ]},
  {id:"g2",name:"第 2 組｜水果・動物・加工・特殊採集",desc:"對應攻略第二箱的水果與加工類。",items:[
    ["blackberry","黑莓","Blackberry",2],["coconut","椰子","Coconut",3],["wildplum","野梅","Wild Plum",2],["ginger","薑","Ginger",3],
    ["apple","蘋果","Apple",1],["apricot","杏子","Apricot",1],["banana","香蕉","Banana",1],["mango","芒果","Mango",1],
    ["egg","蛋","Egg",8],["milk","牛奶","Milk",12],["cheese","乳酪","Cheese",3],["mayo","美乃滋","Mayonnaise",2],["voidmayo","虛空美乃滋","Void Mayonnaise",1],["coffee","咖啡","Coffee",3],
    ["maplesyrup","楓糖漿","Maple Syrup",1],["squidink","魷魚墨汁","Squid Ink",2],["moss","苔蘚","Moss",20]
  ]},
  {id:"g3",name:"第 3 組｜魚・海鮮・蟹籠",desc:"對應攻略水產箱；『任意魚』準備任意可作為料理材料的魚即可。",items:[
    ["tuna","金槍魚","Tuna",1],["sardine","沙丁魚","Sardine",2],["bream","鯛魚","Bream",1],["largemouth","大嘴鱸魚","Largemouth Bass",1],["rainbow","虹鱒魚","Rainbow Trout",1],["salmon","鮭魚","Salmon",1],["flounder","比目魚","Flounder",1],["midnightcarp","午夜鯉魚","Midnight Carp",1],["carp","鯉魚","Carp",4],["sunfish","太陽魚","Sunfish",1],["eel","鰻魚","Eel",2],["squid","魷魚","Squid",1],["seacucumber","海參","Sea Cucumber",1],["anyfish","任意魚","Bream",2],["seaweed","海草","Seaweed",1],["greenalgae","綠藻","Green Algae",5],["whitealgae","白藻","White Algae",2],
    ["lobster","龍蝦","Lobster",1],["clam","蛤","Clam",1],["crayfish","小龍蝦","Crayfish",1],["crab","螃蟹","Crab",1],["mussel","蚌","Mussel",1],["shrimp","蝦","Shrimp",2],["snail","蝸牛","Snail",1],["periwinkle","玉黍螺","Periwinkle",2]
  ]},
  {id:"g4",name:"第 4 組｜商店基礎材料",desc:"直接買齊即可；數字只是攻略最低需求，不用在手帳維護庫存。",items:[
    ["sugar","糖","Sugar",18],["flour","大麥粉","Wheat Flour",22],["rice","大米","Rice",3],["oil","油","Oil",11],["vinegar","醋","Vinegar",4]
  ]},
  {id:"g5",name:"第 5 組｜先做好的前置料理",desc:"這 6 種料理本身又會被其他食譜當材料；先做足再開始逐道完成全部料理。",items:[
    ["friedegg","煎雞蛋","Fried Egg",1],["hashbrowns","薯餅","Hashbrowns",2],["pancakes","薄煎餅","Pancakes",1],["tortilla","墨西哥薄餅","Tortilla",2],["bread","麵包","Bread",3],["omelet","煎蛋捲","Omelet",1]
  ]}
];

const COOKING_DISHES_V3 = [
 ["friedegg","煎雞蛋","Fried Egg"],["omelet","煎蛋捲","Omelet"],["salad","沙拉","Salad"],["cheesecauliflower","乳酪花椰菜","Cheese Cauliflower"],["bakedfish","烤魚","Baked Fish"],["parsnipsoup","防風草湯","Parsnip Soup"],["vegetablemedley","蔬菜雜燴","Vegetable Medley"],["completebreakfast","完美早餐","Complete Breakfast"],["friedcalamari","炸魷魚","Fried Calamari"],["strangebun","奇怪的小麵包","Strange Bun"],
 ["luckylunch","幸運午餐","Lucky Lunch"],["friedmushroom","炒蘑菇","Fried Mushroom"],["pizza","披薩","Pizza"],["beanhotpot","豆類火鍋","Bean Hotpot"],["glazedyams","琉璃山藥","Glazed Yams"],["carpsurprise","驚喜鯉魚","Carp Surprise"],["hashbrowns","薯餅","Hashbrowns"],["pancakes","薄煎餅","Pancakes"],["salmondinner","鮭魚晚餐","Salmon Dinner"],["fishtaco","魚肉捲","Fish Taco"],
 ["crispybass","香酥鱸魚","Crispy Bass"],["pepperpoppers","爆炒青椒","Pepper Poppers"],["bread","麵包","Bread"],["tomkha","椰汁湯","Tom Kha Soup"],["troutsoup","鱒魚湯","Trout Soup"],["chocolatecake","巧克力蛋糕","Chocolate Cake"],["pinkcake","粉紅蛋糕","Pink Cake"],["rhubarbpie","大黃派","Rhubarb Pie"],["cookie","餅乾","Cookie"],["spaghetti","義大利麵","Spaghetti"],
 ["friedeel","炒鰻魚","Fried Eel"],["spicyeel","香辣鰻魚","Spicy Eel"],["sashimi","生魚片","Sashimi"],["makiroll","生魚壽司","Maki Roll"],["tortilla","墨西哥薄餅","Tortilla"],["redplate","紅之盛宴","Red Plate"],["eggplantparmesan","帕爾瑪乳酪茄子","Eggplant Parmesan"],["ricepudding","米布丁","Rice Pudding"],["icecream","冰淇淋","Ice Cream"],["blueberrytart","藍莓千層酥","Blueberry Tart"],
 ["autumnsbounty","秋日恩賜","Autumn's Bounty"],["pumpkinsoup","南瓜湯","Pumpkin Soup"],["supermeal","巨無霸餐","Super Meal"],["cranberrysauce","蔓越莓醬","Cranberry Sauce"],["stuffing","塞料麵包","Stuffing"],["farmerslunch","農夫午餐","Farmer's Lunch"],["survivalburger","救生漢堡","Survival Burger"],["dishofthesea","海之菜餚","Dish O' The Sea"],["minerstreat","礦工特供","Miner's Treat"],["rootsplatter","塊莖拼盤","Roots Platter"],
 ["tripleespresso","三倍濃縮咖啡","Triple Shot Espresso"],["seafoampudding","海泡布丁","Seafoam Pudding"],["algaesoup","海藻湯","Algae Soup"],["palebroth","清湯","Pale Broth"],["plumpudding","葡萄乾布丁","Plum Pudding"],["artichokedip","水煮朝鮮薊","Artichoke Dip"],["stirfry","蔬菜什錦蓋飯","Stir Fry"],["roastedhazelnuts","烤榛子","Roasted Hazelnuts"],["pumpkinpie","南瓜派","Pumpkin Pie"],["radishsalad","蘿蔔沙拉","Radish Salad"],
 ["fruitsalad","水果沙拉","Fruit Salad"],["blackberrycobbler","黑莓脆皮餅","Blackberry Cobbler"],["cranberrycandy","蔓越莓糖果","Cranberry Candy"],["bruschetta","義式烤麵包","Bruschetta"],["coleslaw","高麗菜沙拉","Coleslaw"],["fiddleheadrisotto","義式蕨菜燉飯","Fiddlehead Risotto"],["poppyseedmuffin","虞美人籽鬆糕","Poppyseed Muffin"],["chowder","海鮮雜燴湯","Chowder"],["fishstew","燴魚湯","Fish Stew"],["escargot","法式田螺","Escargot"],
 ["lobsterbisque","龍蝦濃湯","Lobster Bisque"],["maplebar","楓糖棒","Maple Bar"],["crabcakes","蟹黃糕","Crab Cakes"],["shrimpcocktail","蝦雞尾酒","Shrimp Cocktail"],["gingerale","薑汁汽水","Ginger Ale"],["bananapudding","香蕉布丁","Banana Pudding"],["mangostickyrice","芒果糯米飯","Mango Sticky Rice"],["poi","夏威夷芋泥","Poi"],["tropicalcurry","熱帶咖哩","Tropical Curry"],["squidinkravioli","墨汁義大利餃","Squid Ink Ravioli"],["mosssoup","苔蘚湯","Moss Soup"]
];

const COLLECTION_TABS_V3 = [
 ["shipping","出貨","ShippingBox"],["fish","魚類","Pufferfish"],["artifact","古物","Dwarf Scroll I"],["mineral","礦物","Diamond"],["cooking","烹飪","Cooking Icon"],["achievements","成就","Achievements Icon"],["letters","信件","Letter"],["notes","秘密紙條","Secret Note Icon"],["scraps","日誌殘頁","Journal Scrap"]
];

const SECRET_NOTE_SUMMARY_V3 = {
 1:"阿比蓋爾的最愛清單。",2:"山姆家的送禮備忘。",3:"莉亞心目中的完美晚餐。",4:"瑪魯的發明材料備忘。",5:"潘妮記下家人與熟人的喜好。",6:"酒吧常客的特別點單。",7:"幾位單身男性的喜好備忘。",8:"海莉與艾蜜麗的送禮線索。",9:"亞歷克斯的訓練飲食。",10:"骷髏洞窟 100 層有人在等你。",11:"瑪妮與賈斯的舊照片。",12:"垃圾桶尋寶線索。",13:"每月最後一天中午，去遊樂場上方灌木找驚喜。",14:"社區中心後方藏有東西。",15:"夜市美人魚表演的音符順序線索。",16:"鐵路區域的藏寶圖。",17:"Joja 北方的藏寶圖。",18:"沙漠的藏寶圖。",19:"從柳巷 1 號出發的方向謎題。",20:"從鎮中心出發的方向謎題；終點需要兔子的腳。",21:"凌晨 12:40 的灌木秘密。",22:"齊先生隧道任務的開始提示。",23:"把楓糖漿帶進秘密森林。",24:"祝尼魔與寶石顏色／葡萄乾相關提示。",25:"溫泉附近遺失的項鍊線索。",26:"給祝尼魔小屋放葡萄乾可提高收穫。",27:"爺爺留下的精通洞穴線索。"
};
const SECRET_NOTE_IMAGE_V3 = {11:"SecretNote11",16:"SecretNote16",17:"SecretNote17",18:"SecretNote18",19:"SecretNote19",20:"SecretNote20",21:"SecretNote21"};
const JOURNAL_SUMMARY_V3 = {
 1:"海難倖存者抵達薑島並開始求生。",2:"島上魚很多，也提到金色核桃與鸚鵡。",3:"觀察火山與島上環境的紀錄。",4:"一張金色核桃藏寶圖。",5:"關於島上探索與核桃的線索。",6:"一張與美人魚／島嶼謎題有關的圖像線索。",7:"薑島自然與探索提示。",8:"更多島嶼探索與金色核桃線索。",9:"火山與島上秘密的提示。",10:"火山入口附近的藏寶圖；可挖到鴕鳥蛋與金色核桃。",11:"把兩枚戒指投入火山鍛造台可以合併。"
};
const JOURNAL_IMAGE_V3 = {4:"JournalScrap4",6:"JournalScrap6",10:"JournalScrap10"};
'''
repl(anchor,defs+'\n'+anchor,'data')

state='''  const [collectionSection, setCollectionSection] = useState("dex");'''
state2='''  const [collectionSection, setCollectionSection] = useState("fish");
  const [cookingModeV3, setCookingModeV3] = useState("prep");
  const [prepMissingOnlyV3, setPrepMissingOnlyV3] = useState(false);
  const [selectedPaperV3, setSelectedPaperV3] = useState(null);'''
repl(state,state2,'states')

# Remove the inner Fish/Artifact/Mineral selector: these are now real collection subtabs.
old='''      <SectionTitle icon="📖">圖鑑</SectionTitle>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.entries(COLLECTIONS).map(([k,v])=><Pill key={k} active={selectedCollection===k} onClick={()=>{setSelectedCollection(k);setSelectedItem(null)}}>{v.icon} {v.name}</Pill>)}</div>'''
new='''      <SectionTitle icon="📖">{c.name}</SectionTitle>'''
repl(old,new,'dex selector')

insert=s.index('  const renderPowers = () => {')
helpers=r'''
  const prepSetV3 = data.cookingPrepV3 || [];
  const cookedSetV3 = data.cookingCollectionV3 || [];
  const togglePrepV3 = id => update({cookingPrepV3:prepSetV3.includes(id)?prepSetV3.filter(x=>x!==id):[...prepSetV3,id]});
  const toggleCookedV3 = id => update({cookingCollectionV3:cookedSetV3.includes(id)?cookedSetV3.filter(x=>x!==id):[...cookedSetV3,id]});
  const allPrepItemsV3 = COOKING_PREP_GROUPS_V3.flatMap(g=>g.items);

  const renderCookingV3 = () => <div>
    <Card style={{marginTop:8,padding:9,background:"#FFF4D8"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><GameIcon file="Cooking Icon" size={34}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:950,color:C.darkBrown}}>全料理一次性備料</div><div style={{fontSize:10.5,color:C.muted,lineHeight:1.4}}>像圖鑑一樣點亮：亮＝已按攻略放足最低需求量；不記實際庫存數量。</div></div></div>
      <div style={{marginTop:7}}><ProgressBar value={prepSetV3.length} max={allPrepItemsV3.length}/><div style={{fontSize:10,color:C.muted,marginTop:3,textAlign:"right"}}>{prepSetV3.length}/{allPrepItemsV3.length}</div></div>
      <div style={{display:"flex",gap:5,marginTop:7}}><Pill small active={cookingModeV3==="prep"} onClick={()=>setCookingModeV3("prep")}>備料圖鑑</Pill><Pill small active={cookingModeV3==="dishes"} onClick={()=>setCookingModeV3("dishes")}>料理收集</Pill></div>
    </Card>
    {cookingModeV3==="prep" && <>
      <label style={{display:"flex",alignItems:"center",gap:6,margin:"8px 2px 0",fontSize:11,fontWeight:900,color:C.brown}}><input type="checkbox" checked={prepMissingOnlyV3} onChange={e=>setPrepMissingOnlyV3(e.target.checked)}/>只看還沒準備的材料</label>
      {COOKING_PREP_GROUPS_V3.map(g=>{const rows=g.items.filter(it=>!prepMissingOnlyV3||!prepSetV3.includes(it[0]));return rows.length?<Card key={g.id} style={{marginTop:8,padding:9,background:g.id==="g5"?"#FFF0D2":C.paper}}><div style={{fontSize:12.5,fontWeight:950,color:C.darkBrown}}>{g.name}</div><div style={{fontSize:9.5,color:C.muted,marginTop:2,lineHeight:1.35}}>{g.desc}</div><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:7}}>{rows.map(it=>{const [id,name,file,need]=it,on=prepSetV3.includes(id);return <button key={id} onClick={()=>togglePrepV3(id)} style={{position:"relative",border:`2px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:9,minHeight:82,padding:"5px 2px",boxShadow:`0 1px 4px ${C.shadow}`,cursor:"pointer"}}><div style={{height:35,display:"flex",alignItems:"center",justifyContent:"center"}}><GameIcon file={file} size={34}/></div><div style={{fontSize:9,fontWeight:950,color:C.ink,lineHeight:1.1,marginTop:2}}>{name}</div><span style={{position:"absolute",left:3,top:2,fontSize:8.5,fontWeight:950,color:C.brown,background:"#FFF1C9",borderRadius:6,padding:"1px 3px"}}>×{need}</span><span style={{position:"absolute",right:2,top:1,fontSize:12,color:on?C.green:"#C9B99A",fontWeight:950}}>{on?"✓":"○"}</span></button>})}</div></Card>:null})}
    </>}
    {cookingModeV3==="dishes" && <Card style={{marginTop:8,padding:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:950,color:C.brown}}><span>遊戲烹飪收集</span><span>{cookedSetV3.length}/{COOKING_DISHES_V3.length}</span></div><ProgressBar value={cookedSetV3.length} max={COOKING_DISHES_V3.length}/><div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:5,marginTop:8}}>{COOKING_DISHES_V3.map(it=>{const [id,name,file]=it,on=cookedSetV3.includes(id);return <button key={id} onClick={()=>toggleCookedV3(id)} style={{position:"relative",border:`2px solid ${on?C.green:C.line}`,background:on?"#E5F3CF":C.paper,borderRadius:8,minHeight:75,padding:"5px 2px",cursor:"pointer"}}><GameIcon file={file} size={34}/><div style={{fontSize:8.8,fontWeight:900,color:C.ink,lineHeight:1.1,marginTop:2}}>{name}</div><span style={{position:"absolute",right:2,top:1,fontSize:11,color:on?C.green:"#C9B99A"}}>{on?"✓":"○"}</span></button>})}</div></Card>}
  </div>;

  const renderPaperCollectionV3 = (kind,total,title) => {
    const list=extrasState[kind]||[];
    const isNotes=kind==="notes";
    const summary=isNotes?SECRET_NOTE_SUMMARY_V3:JOURNAL_SUMMARY_V3;
    const imageMap=isNotes?SECRET_NOTE_IMAGE_V3:JOURNAL_IMAGE_V3;
    const selected=selectedPaperV3?.kind===kind?selectedPaperV3.n:null;
    return <div><Card style={{marginTop:8,padding:9}}><div style={{fontSize:12,fontWeight:950,color:C.brown,marginBottom:7}}>{title} {list.length}/{total}</div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>{Array.from({length:total},(_,i)=>i+1).map(n=>{const on=list.includes(n);return <button key={n} onClick={()=>setSelectedPaperV3({kind,n})} style={{position:"relative",border:`1.5px solid ${selected===n?C.orange:on?C.green:C.line}`,background:on?C.lightGreen:C.cream,borderRadius:7,padding:"7px 1px",fontSize:10,fontWeight:900,color:on?C.green:C.brown}}>{n}<span onClick={e=>{e.stopPropagation();updateExtras({[kind]:on?list.filter(x=>x!==n):[...list,n]})}} style={{position:"absolute",right:1,top:0,fontSize:9}}>{on?"✓":"○"}</span></button>})}</div></Card>{selected&&<Card style={{marginTop:8,padding:10,background:"#F6E5B9"}}><div style={{display:"flex",gap:8,alignItems:"flex-start"}}><GameIcon file={isNotes?"Secret Note":"Journal Scrap"} size={36}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:950,color:C.darkBrown}}>{title} #{selected}</div><div style={{fontSize:11,color:C.ink,lineHeight:1.55,marginTop:4}}>{summary[selected]||"已取得的紙條內容。"}</div></div></div>{imageMap[selected]&&<img src={GAME_FILE(imageMap[selected])} alt={`${title} ${selected} 圖像內容`} onError={e=>e.currentTarget.style.display="none"} style={{display:"block",width:"min(216px,100%)",height:"auto",margin:"10px auto 2px",imageRendering:"pixelated",borderRadius:5}}/>}<div style={{fontSize:9.5,color:C.muted,marginTop:6}}>圖像型紙條直接顯示遊戲原圖；文字型紙條用手帳紙張樣式摘要呈現。</div><a href={isNotes?"https://stardewvalleywiki.com/Secret_Notes":"https://stardewvalleywiki.com/Journal_Scraps"} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:6,fontSize:10,fontWeight:900,color:C.blue}}>Wiki 完整內容 ↗</a></Card>}</div>;
  };

'''
s=s[:insert]+helpers+s[insert:]

# Replace collection wrapper created by the previous patch.
start=s.index('  const renderCollection = () => <div>')
end=s.index('\n  const buildSummary = () => {',start)
wrapper=r'''  const renderCollection = () => {
    const tabClick = k => { setCollectionSection(k); if(["fish","artifact","mineral"].includes(k)){setSelectedCollection(k);setSelectedItem(null);} };
    return <div>
      <SectionTitle icon="📖">收集品</SectionTitle>
      <Card style={{padding:8,background:"#FFF4D8",fontSize:10.5,color:C.muted,lineHeight:1.4}}>對應遊戲「＋ → 收集品」。每個子頁用遊戲素材當圖示；烹飪裡同時放一次性備料圖鑑。</Card>
      <div style={{display:"flex",gap:5,overflowX:"auto",padding:"8px 0 4px",WebkitOverflowScrolling:"touch"}}>{COLLECTION_TABS_V3.map(([k,n,file])=><button key={k} onClick={()=>tabClick(k)} style={{flex:"0 0 auto",minWidth:58,border:`2px solid ${collectionSection===k?C.orange:C.line}`,background:collectionSection===k?"#FFE0A8":C.paper,borderRadius:9,padding:"5px 5px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:C.ink,fontWeight:900,fontSize:9.5}}><GameIcon file={file} size={29}/><span>{n}</span></button>)}</div>
      {collectionSection==="fish"&&renderDexCollection()}
      {collectionSection==="artifact"&&renderDexCollection()}
      {collectionSection==="mineral"&&renderDexCollection()}
      {collectionSection==="cooking"&&renderCookingV3()}
      {collectionSection==="achievements"&&renderAchievements()}
      {collectionSection==="notes"&&renderPaperCollectionV3("notes",27,"秘密紙條")}
      {collectionSection==="scraps"&&renderPaperCollectionV3("scraps",11,"日誌殘頁")}
      {collectionSection==="shipping"&&<Card style={{marginTop:8}}><div style={{display:"flex",gap:8,alignItems:"center"}}><GameIcon file="ShippingBox" size={34}/><div><div style={{fontSize:12,fontWeight:900,color:C.brown}}>出貨收集</div><div style={{fontSize:10.5,color:C.muted}}>目前先記已點亮數量；之後可再補完整 1.6 出貨圖鑑。</div></div></div><div style={{marginTop:7}}><NumInput value={Number(extrasState.shippedCount||0)} max={999} onChange={v=>updateExtras({shippedCount:v})} suffix="項"/></div></Card>}
      {collectionSection==="letters"&&<Card style={{marginTop:8}}><div style={{display:"flex",gap:8,alignItems:"center"}}><GameIcon file="Letter" size={34}/><b style={{fontSize:12,color:C.brown}}>信件備忘</b></div><textarea value={extrasState.lettersNote||""} onChange={e=>updateExtras({lettersNote:e.target.value})} placeholder="記錄想回頭查看的配方信、獎勵信、劇情信件……" style={{width:"100%",minHeight:120,marginTop:6,border:`1.5px solid ${C.line}`,borderRadius:7,padding:7,background:"#FFFCF0",fontSize:11,color:C.ink}}/></Card>}
    </div>;
  };
'''
s=s[:start]+wrapper+s[end:]

# The fridge is no longer a top-level page.
s=s.replace('  { id: "fridge", name: "冰箱", icon: "🧊", file: "Mini-Fridge" },\n','')
s=s.replace('collection:renderCollection,fridge:renderFridge,notes:renderNotes','collection:renderCollection,notes:renderNotes')

p.write_text(s,encoding='utf-8')
print('build_collection_cooking_patch: fixed cooking-prep dex, collection icons, and paper contents integrated')
